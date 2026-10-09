import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  getDocs, 
  onSnapshot 
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { 
  PortfolioGrowthPlan, 
  TradingCredential, 
  CyberGymCredential 
} from '../types/growthAndCredentials';
import { 
  INITIAL_GROWTH_PLAN, 
  INITIAL_TRADING_CREDENTIALS, 
  INITIAL_CYBERGYM_CREDENTIALS 
} from '../data/growthAndCredentialsData';

const LOCAL_STORAGE_PLAN_KEY = 'aegentix_portfolio_growth_plan_v1';
const LOCAL_STORAGE_TRADING_CREDS_KEY = 'aegentix_trading_credentials_v1';
const LOCAL_STORAGE_CYBERGYM_CREDS_KEY = 'aegentix_cybergym_credentials_v1';

// Load initial state with localStorage fallback
export function getStoredGrowthPlan(): PortfolioGrowthPlan {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PLAN_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to parse growth plan from localStorage:', err);
  }
  return INITIAL_GROWTH_PLAN;
}

export function getStoredTradingCredentials(): TradingCredential[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_TRADING_CREDS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to parse trading credentials from localStorage:', err);
  }
  return INITIAL_TRADING_CREDENTIALS;
}

export function getStoredCyberGymCredentials(): CyberGymCredential[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CYBERGYM_CREDS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to parse cyber gym credentials from localStorage:', err);
  }
  return INITIAL_CYBERGYM_CREDENTIALS;
}

// Save Growth Plan to LocalStorage & Firestore if logged in
export async function saveGrowthPlan(plan: PortfolioGrowthPlan): Promise<void> {
  // Always update localStorage
  try {
    localStorage.setItem(LOCAL_STORAGE_PLAN_KEY, JSON.stringify(plan));
  } catch (err) {
    console.error('LocalStorage write error for growth plan:', err);
  }

  // If user is authenticated in Firebase, sync to Firestore
  const user = auth.currentUser;
  if (user && user.uid) {
    try {
      const planDocRef = doc(db, 'users', user.uid, 'portfolio_plans', plan.id);
      await setDoc(planDocRef, {
        planName: plan.planName,
        initialCapitalUsd: plan.initialCapitalUsd,
        targetMilestoneUsd: plan.targetMilestoneUsd,
        monthlyContributionUsd: plan.monthlyContributionUsd,
        projectedAprPct: plan.projectedAprPct,
        strategyMode: plan.strategyMode,
        timeHorizonMonths: Math.round(plan.timeHorizonMonths),
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore sync failed for growth plan (offline/permissions):', err);
    }
  }
}

// Save Trading Credential
export async function saveTradingCredential(cred: TradingCredential): Promise<void> {
  try {
    const current = getStoredTradingCredentials();
    const index = current.findIndex(c => c.id === cred.id);
    let updated: TradingCredential[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = cred;
    } else {
      updated = [cred, ...current];
    }
    localStorage.setItem(LOCAL_STORAGE_TRADING_CREDS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('LocalStorage write error for trading credential:', err);
  }

  const user = auth.currentUser;
  if (user && user.uid) {
    try {
      const credDocRef = doc(db, 'users', user.uid, 'trading_credentials', cred.id);
      await setDoc(credDocRef, {
        provider: cred.provider,
        name: cred.name,
        type: cred.type,
        status: cred.status,
        keyIdentifier: cred.keyIdentifier,
        secretMasked: cred.secretMasked,
        permissions: cred.permissions,
        network: cred.network,
        lastTestedAt: cred.lastTestedAt,
        createdAt: cred.createdAt
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore sync failed for trading credential:', err);
    }
  }
}

// Save CyberGym Credential
export async function saveCyberGymCredential(cred: CyberGymCredential): Promise<void> {
  try {
    const current = getStoredCyberGymCredentials();
    const index = current.findIndex(c => c.id === cred.id);
    let updated: CyberGymCredential[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = cred;
    } else {
      updated = [cred, ...current];
    }
    localStorage.setItem(LOCAL_STORAGE_CYBERGYM_CREDS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('LocalStorage write error for cyber gym credential:', err);
  }

  const user = auth.currentUser;
  if (user && user.uid) {
    try {
      const credDocRef = doc(db, 'users', user.uid, 'cybergym_credentials', cred.id);
      await setDoc(credDocRef, {
        athleteOrEntity: cred.athleteOrEntity,
        title: cred.title,
        category: cred.category,
        tier: cred.tier,
        status: cred.status,
        credentialHash: cred.credentialHash,
        verifierSignature: cred.verifierSignature,
        issuedAt: cred.issuedAt,
        expiresAt: cred.expiresAt
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore sync failed for cybergym credential:', err);
    }
  }
}
