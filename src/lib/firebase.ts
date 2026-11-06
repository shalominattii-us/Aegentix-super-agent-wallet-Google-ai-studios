import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  getDocFromServer,
  Firestore 
} from 'firebase/firestore';
import fileConfig from '../../firebase-applet-config.json';
import { isExposedSecret } from '../security/exposedSecrets.mjs';

function resolveFirebaseConfig(): Record<string, unknown> | null {
  const env = import.meta.env as Record<string, string | undefined>;
  const apiKey = String(env.VITE_FIREBASE_API_KEY || env.FIREBASE_API_KEY || '').trim();
  if (!apiKey || isExposedSecret(apiKey)) return null;
  return { ...fileConfig, apiKey };
}

const firebaseConfig = resolveFirebaseConfig();
const app = firebaseConfig
  ? (getApps().length === 0 ? initializeApp(firebaseConfig) : getApp())
  : null;

export const firebaseConfigured = Boolean(app);
export const auth = app ? getAuth(app) : null;
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const db: Firestore | null = app
  ? ((firebaseConfig as any).firestoreDatabaseId
      ? getFirestore(app, (firebaseConfig as any).firestoreDatabaseId)
      : getFirestore(app))
  : null;

// ---------------------------------------------------------------------------
// Error Handling & Diagnosability
// ---------------------------------------------------------------------------
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo: auth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// ---------------------------------------------------------------------------
// Connectivity Validation on Boot
// ---------------------------------------------------------------------------
export async function testConnection() {
  if (!db) return;
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('[Firebase]: Firestore connection verified successfully.');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

// ---------------------------------------------------------------------------
// Authentication & User Data Operations
// ---------------------------------------------------------------------------

// Google Sign-In
export async function signInWithGoogle(): Promise<User | null> {
  if (!auth || !db) {
    throw new Error('VITE_FIREBASE_API_KEY is not configured');
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Persist user profile to Firestore
    const path = `users/${user.uid}`;
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Sovereign Operator',
        photoURL: user.photoURL || '',
        lastLoginAt: new Date().toISOString(),
      }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }

    return user;
  } catch (error: any) {
    if (error?.code === 'auth/popup-closed-by-user' || error?.message?.includes('popup-closed-by-user')) {
      console.warn('Google Sign-In cancelled: popup closed by user.');
      return null;
    }
    console.error('Google Sign-In error:', error);
    throw error;
  }
}

// Sign-Out
export async function logOut(): Promise<void> {
  if (!auth) return;
  await signOut(auth);
}

// Save Ability Generation Record to Firestore
export async function saveAbilityRecord(userId: string, record: {
  type: string;
  title: string;
  resultUrl?: string;
  content?: string;
  metadata?: Record<string, any>;
}) {
  if (!userId || !db) return null;
  const path = `users/${userId}/abilities_history`;
  try {
    const colRef = collection(db, 'users', userId, 'abilities_history');
    return await addDoc(colRef, {
      ...record,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
    return null;
  }
}

// Save Chat Message to Firestore
export async function saveChatMessage(userId: string, message: {
  role: 'user' | 'model' | 'system';
  text: string;
  model: string;
}) {
  if (!userId || !db) return null;
  const path = `users/${userId}/chat_messages`;
  try {
    const colRef = collection(db, 'users', userId, 'chat_messages');
    return await addDoc(colRef, {
      ...message,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
    return null;
  }
}
