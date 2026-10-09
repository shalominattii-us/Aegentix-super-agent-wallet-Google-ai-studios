import React, { useState, useEffect, useRef } from 'react';
import { 
  Music, 
  Image as ImageIcon, 
  Film, 
  Search, 
  MapPin, 
  MessageSquare, 
  Mic, 
  Radio, 
  Sparkles, 
  Send, 
  Play, 
  Pause, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  User as UserIcon, 
  LogOut, 
  Layers, 
  ExternalLink,
  ChevronRight,
  Sliders,
  Upload,
  Volume2,
  Square
} from 'lucide-react';
import { 
  auth, 
  signInWithGoogle, 
  logOut, 
  saveAbilityRecord, 
  saveChatMessage, 
  db 
} from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

interface AbilityRecord {
  id: string;
  type: string;
  title: string;
  resultUrl?: string;
  content?: string;
  createdAt?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  model: string;
  timestamp: string;
}

interface GeminiAbilitiesHubProps {
  onNotify?: (message: string, type: 'ALERT' | 'SUCCESS' | 'INFO') => void;
}

export const GeminiAbilitiesHub: React.FC<GeminiAbilitiesHubProps> = ({ onNotify }) => {
  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Active sub-ability tab
  const [activeTab, setActiveTab] = useState<'MUSIC' | 'IMAGE' | 'VIDEO' | 'SEARCH' | 'MAPS' | 'CHAT' | 'VOICE'>('MUSIC');

  // History from Firestore
  const [historyRecords, setHistoryRecords] = useState<AbilityRecord[]>([]);

  // 1. Music state
  const [musicPrompt, setMusicPrompt] = useState('An upbeat cyberpunk synthwave track with heavy bass and algorithmic arpeggios.');
  const [musicModel, setMusicModel] = useState<'lyria-3-clip-preview' | 'lyria-3-pro-preview'>('lyria-3-clip-preview');
  const [musicImageBase64, setMusicImageBase64] = useState<string | null>(null);
  const [isGeneratingMusic, setIsGeneratingMusic] = useState(false);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null);
  const [generatedLyrics, setGeneratedLyrics] = useState<string | null>(null);

  // 2. Image state
  const [imagePrompt, setImagePrompt] = useState('A sleek holographic cybernetic crypto bull standing on a neon trading terminal floor in Tokyo at night, ultra-detailed.');
  const [editImageBase64, setEditImageBase64] = useState<string | null>(null);
  const [imageAspectRatio, setImageAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3'>('1:1');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  // 3. Video state (Veo)
  const [videoPrompt, setVideoPrompt] = useState('Camera slowly pans across a high-frequency trading server room with neon cyan fiber-optic cables glowing in the dark.');
  const [videoImageBase64, setVideoImageBase64] = useState<string | null>(null);
  const [videoAspectRatio, setVideoAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoStatusMessage, setVideoStatusMessage] = useState<string | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);

  // 4. Search Grounding state
  const [searchPrompt, setSearchPrompt] = useState('What are the latest institutional ETF net inflows for Ethereum and Bitcoin over the past 48 hours?');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [searchMetadata, setSearchMetadata] = useState<any>(null);

  // 5. Maps Grounding state
  const [mapsPrompt, setMapsPrompt] = useState('Where are the top Bitcoin ATM kiosks and crypto physical trading lounges located in Zurich, Switzerland?');
  const [isSearchingMaps, setIsSearchingMaps] = useState(false);
  const [mapsResult, setMapsResult] = useState<string | null>(null);
  const [mapsMetadata, setMapsMetadata] = useState<any>(null);

  // 6. Gemini Multi-Turn Chatbot state
  const [chatModel, setChatModel] = useState<'gemini-2.5-pro' | 'gemini-2.5-flash' | 'gemini-2.0-flash'>('gemini-2.5-flash');
  const [chatRole, setChatRole] = useState<string>('Sovereign Quantitative Architect');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-0',
      role: 'model',
      text: 'Greetings, Operator. I am the Aegentix Sovereign Intelligence Core. How can I assist with your autonomous execution strategies, multi-venue arbitrage models, or risk guardrails today?',
      model: 'gemini-2.5-flash',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [isChatting, setIsChatting] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // 7. Voice Conversations & Transcription
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [voicePrompt, setVoicePrompt] = useState('Synthesize a fast market situational report on cross-exchange liquidity.');
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Auth observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Listen to user's ability history from Firestore
  useEffect(() => {
    if (!currentUser) {
      setHistoryRecords([]);
      return;
    }
    try {
      const q = query(
        collection(db, 'users', currentUser.uid, 'abilities_history'),
        orderBy('createdAt', 'desc'),
        limit(15)
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as AbilityRecord[];
        setHistoryRecords(docs);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('Firestore subscription notice:', e);
    }
  }, [currentUser]);

  // Scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Auth actions
  const handleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      if (user && onNotify) {
        onNotify(`Signed in securely with Google: ${user.email}`, 'SUCCESS');
      }
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user' && !err?.message?.includes('popup-closed-by-user')) {
        if (onNotify) onNotify(`Sign-in error: ${err.message}`, 'ALERT');
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
      if (onNotify) onNotify('Signed out of Firebase session', 'INFO');
    } catch (err: any) {
      if (onNotify) onNotify(`Sign-out error: ${err.message}`, 'ALERT');
    }
  };

  // 1. Music Handler (lyria-3-clip-preview / lyria-3-pro-preview)
  const handleGenerateMusic = async () => {
    if (!musicPrompt.trim()) return;
    setIsGeneratingMusic(true);
    setGeneratedAudioUrl(null);
    setGeneratedLyrics(null);

    try {
      const res = await fetch('/api/abilities/music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: musicPrompt,
          model: musicModel,
          imageBase64: musicImageBase64,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Music generation failed');
      }

      // Convert base64 audio to Blob URL
      const byteCharacters = atob(data.audioBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: data.mimeType || 'audio/wav' });
      const audioUrl = URL.createObjectURL(blob);

      setGeneratedAudioUrl(audioUrl);
      setGeneratedLyrics(data.lyrics);

      if (currentUser) {
        await saveAbilityRecord(currentUser.uid, {
          type: 'music',
          title: musicPrompt.slice(0, 80),
          resultUrl: audioUrl,
          content: data.lyrics,
          metadata: { model: data.model },
        });
      }

      if (onNotify) onNotify(`Music track synthesized via ${data.model}!`, 'SUCCESS');
    } catch (err: any) {
      if (onNotify) onNotify(`Music error: ${err.message}`, 'ALERT');
    } finally {
      setIsGeneratingMusic(false);
    }
  };

  // 2. Image Handler (gemini-3.1-flash-image-preview)
  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;
    setIsGeneratingImage(true);
    setGeneratedImageUrl(null);

    try {
      const res = await fetch('/api/abilities/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: imagePrompt,
          editImageBase64,
          aspectRatio: imageAspectRatio,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Image generation failed');
      }

      const imageUrl = `data:${data.mimeType};base64,${data.imageBase64}`;
      setGeneratedImageUrl(imageUrl);

      if (currentUser) {
        await saveAbilityRecord(currentUser.uid, {
          type: 'image',
          title: imagePrompt.slice(0, 80),
          resultUrl: imageUrl,
          metadata: { model: data.model, aspectRatio: imageAspectRatio },
        });
      }

      if (onNotify) onNotify('Image generated via gemini-3.1-flash-image-preview', 'SUCCESS');
    } catch (err: any) {
      if (onNotify) onNotify(`Image error: ${err.message}`, 'ALERT');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // 3. Video Handler (veo-3.1-fast-generate-preview)
  const handleGenerateVideo = async () => {
    if (!videoPrompt.trim() && !videoImageBase64) return;
    setIsGeneratingVideo(true);
    setGeneratedVideoUrl(null);
    setVideoStatusMessage('Initiating Veo 3.1 video generation operation...');

    try {
      const res = await fetch('/api/abilities/video/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: videoPrompt,
          imageBase64: videoImageBase64,
          aspectRatio: videoAspectRatio,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Video initiation failed');
      }

      const operationName = data.operationName;
      setVideoStatusMessage('Veo model is rendering neural frames (this may take 1-2 minutes)...');

      // Poll operation
      let attempts = 0;
      const pollInterval = setInterval(async () => {
        attempts++;
        try {
          const statusRes = await fetch('/api/abilities/video/status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ operationName }),
          });
          const statusData = await statusRes.json();

          if (statusData.done) {
            clearInterval(pollInterval);
            if (statusData.error) {
              throw new Error(statusData.error.message || 'Video rendering failed');
            }

            setVideoStatusMessage('Rendering complete! Streaming video output...');

            // Download video
            const dlRes = await fetch('/api/abilities/video/download', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ operationName }),
            });

            if (!dlRes.ok) throw new Error('Failed to stream video');
            const blob = await dlRes.blob();
            const videoUrl = URL.createObjectURL(blob);
            setGeneratedVideoUrl(videoUrl);
            setVideoStatusMessage(null);
            setIsGeneratingVideo(false);

            if (currentUser) {
              await saveAbilityRecord(currentUser.uid, {
                type: 'video',
                title: videoPrompt.slice(0, 80) || 'Photo Animation',
                resultUrl: videoUrl,
                metadata: { model: 'veo-3.1-fast-generate-preview', aspectRatio: videoAspectRatio },
              });
            }

            if (onNotify) onNotify('Veo video generation complete!', 'SUCCESS');
          } else {
            setVideoStatusMessage(`Synthesizing motion frames... (Check ${attempts * 5}s elapsed)`);
          }
        } catch (e: any) {
          clearInterval(pollInterval);
          setIsGeneratingVideo(false);
          setVideoStatusMessage(`Video error: ${e.message}`);
        }
      }, 5000);
    } catch (err: any) {
      setIsGeneratingVideo(false);
      setVideoStatusMessage(null);
      if (onNotify) onNotify(`Video error: ${err.message}`, 'ALERT');
    }
  };

  // 4. Search Grounding Handler (gemini-3.5-flash with googleSearch)
  const handleSearchGrounding = async () => {
    if (!searchPrompt.trim()) return;
    setIsSearching(true);
    setSearchResult(null);
    setSearchMetadata(null);

    try {
      const res = await fetch('/api/abilities/search-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: searchPrompt }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Search grounding failed');

      setSearchResult(data.text);
      setSearchMetadata(data.groundingMetadata);

      if (currentUser) {
        await saveAbilityRecord(currentUser.uid, {
          type: 'search',
          title: searchPrompt.slice(0, 80),
          content: data.text,
          metadata: { model: data.model },
        });
      }

      if (onNotify) onNotify('Live Google Search data retrieved with gemini-3.5-flash', 'SUCCESS');
    } catch (err: any) {
      if (onNotify) onNotify(`Search grounding error: ${err.message}`, 'ALERT');
    } finally {
      setIsSearching(false);
    }
  };

  // 5. Maps Grounding Handler (gemini-3.5-flash with googleMaps)
  const handleMapsGrounding = async () => {
    if (!mapsPrompt.trim()) return;
    setIsSearchingMaps(true);
    setMapsResult(null);
    setMapsMetadata(null);

    try {
      const res = await fetch('/api/abilities/maps-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: mapsPrompt }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Maps grounding failed');

      setMapsResult(data.text);
      setMapsMetadata(data.groundingMetadata);

      if (currentUser) {
        await saveAbilityRecord(currentUser.uid, {
          type: 'maps',
          title: mapsPrompt.slice(0, 80),
          content: data.text,
          metadata: { model: data.model },
        });
      }

      if (onNotify) onNotify('Geospatial Google Maps data grounded successfully', 'SUCCESS');
    } catch (err: any) {
      if (onNotify) onNotify(`Maps grounding error: ${err.message}`, 'ALERT');
    } finally {
      setIsSearchingMaps(false);
    }
  };

  // 6. Gemini Multi-Turn Chatbot
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatting) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text: chatInput.trim(),
      model: chatModel,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...chatMessages, userMsg];
    setChatMessages(newHistory);
    setChatInput('');
    setIsChatting(true);

    try {
      const res = await fetch('/api/abilities/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ role: m.role, text: m.text })),
          model: chatModel,
          systemInstruction: `You are the Aegentix Sovereign Intelligence Core acting in the role of: ${chatRole}. Deliver sharp, technical, and data-driven crypto intelligence.`,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Chat response error');

      const modelMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'model',
        text: data.text,
        model: data.model,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatMessages((prev) => [...prev, modelMsg]);

      if (currentUser) {
        await saveChatMessage(currentUser.uid, {
          role: 'user',
          text: userMsg.text,
          model: chatModel,
        });
        await saveChatMessage(currentUser.uid, {
          role: 'model',
          text: modelMsg.text,
          model: data.model,
        });
      }
    } catch (err: any) {
      if (onNotify) onNotify(`Chat error: ${err.message}`, 'ALERT');
    } finally {
      setIsChatting(false);
    }
  };

  // 7. Microphone Recording & Transcription (gemini-3.5-transcribe)
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          await transcribeAudio(base64Audio, 'audio/webm');
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err: any) {
      if (onNotify) onNotify(`Microphone access error: ${err.message}`, 'ALERT');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBase64: string, mimeType: string) => {
    setIsTranscribing(true);
    setTranscribedText(null);
    try {
      const res = await fetch('/api/abilities/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioBase64, mimeType }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Transcription failed');

      setTranscribedText(data.transcript);

      if (currentUser) {
        await saveAbilityRecord(currentUser.uid, {
          type: 'transcribe',
          title: 'Microphone Audio Transcription',
          content: data.transcript,
          metadata: { model: 'gemini-3.5-transcribe' },
        });
      }

      if (onNotify) onNotify('Audio transcribed with gemini-3.5-transcribe!', 'SUCCESS');
    } catch (err: any) {
      if (onNotify) onNotify(`Transcription error: ${err.message}`, 'ALERT');
    } finally {
      setIsTranscribing(false);
    }
  };

  // Live Voice speech prompt
  const handleLiveSpeak = async () => {
    if (!voicePrompt.trim()) return;
    setIsGeneratingVoice(true);
    try {
      const res = await fetch('/api/abilities/live-speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: voicePrompt }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Live voice synthesis failed');

      if (data.audioBase64) {
        const audio = new Audio(`data:audio/mp3;base64,${data.audioBase64}`);
        audio.play();
        if (onNotify) onNotify('Voice output playing via gemini-3.8-live', 'SUCCESS');
      }
    } catch (err: any) {
      if (onNotify) onNotify(`Voice synthesis error: ${err.message}`, 'ALERT');
    } finally {
      setIsGeneratingVoice(false);
    }
  };

  // Image upload helper
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (b64: string | null) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const b64 = (reader.result as string).split(',')[1];
      setter(b64);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-[#0B0F17] border border-slate-800 rounded-xl overflow-hidden shadow-2xl space-y-0">
      {/* Top Banner & Firebase Auth Status */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-indigo-950/40 via-[#0B0F17] to-cyan-950/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">GEMINI MULTI-MODAL ABILITIES</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold">
                  10 Native Abilities
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Firebase Connected
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Music · Image Studio · Veo Video · Search & Maps Grounding · Chatbot · Audio Transcription · Live Voice
              </p>
            </div>
          </div>

          {/* Firebase Authentication Button / Profile */}
          <div className="flex items-center gap-3 shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 px-3 py-1.5 rounded-lg text-xs font-mono">
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt="Avatar" className="w-6 h-6 rounded-full border border-cyan-400/40" />
                ) : (
                  <UserIcon className="w-4 h-4 text-cyan-400" />
                )}
                <div className="truncate max-w-[120px]">
                  <span className="text-slate-200 font-semibold block truncate">
                    {currentUser.displayName || currentUser.email?.split('@')[0]}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-1 hover:bg-slate-800 text-slate-400 hover:text-red-400 rounded transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                disabled={isAuthLoading}
                className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded text-xs font-mono font-medium flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" className="w-3.5 h-3.5" />
                <span>Google Sign-In</span>
              </button>
            )}
          </div>
        </div>

        {/* Ability Selector Pills */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveTab('MUSIC')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'MUSIC'
                ? 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-300 border border-purple-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800'
            }`}
          >
            <Music className="w-3.5 h-3.5 text-purple-400" />
            <span>Generate Music (Lyria)</span>
          </button>

          <button
            onClick={() => setActiveTab('IMAGE')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'IMAGE'
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>Image Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('VIDEO')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'VIDEO'
                ? 'bg-gradient-to-r from-rose-500/20 to-orange-500/20 text-rose-300 border border-rose-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800'
            }`}
          >
            <Film className="w-3.5 h-3.5 text-rose-400" />
            <span>Veo Video & Animate</span>
          </button>

          <button
            onClick={() => setActiveTab('SEARCH')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'SEARCH'
                ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-emerald-400" />
            <span>Search Grounding</span>
          </button>

          <button
            onClick={() => setActiveTab('MAPS')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'MAPS'
                ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Maps Grounding</span>
          </button>

          <button
            onClick={() => setActiveTab('CHAT')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'CHAT'
                ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-300 border border-blue-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
            <span>Gemini Chatbot</span>
          </button>

          <button
            onClick={() => setActiveTab('VOICE')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'VOICE'
                ? 'bg-gradient-to-r from-teal-500/20 to-emerald-500/20 text-teal-300 border border-teal-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800'
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-teal-400" />
            <span>Voice & Transcribe</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: MUSIC GENERATION (Lyria Clip / Lyria Pro) */}
      {activeTab === 'MUSIC' && (
        <div className="p-5 space-y-4 font-mono text-xs">
          <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Music className="w-4 h-4 text-purple-400" />
                  <span>AI Music Generation Suite</span>
                </h3>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Powered by <span className="text-purple-300">lyria-3-clip-preview</span> (up to 30s) or <span className="text-purple-300">lyria-3-pro-preview</span> (full tracks).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-[11px]">Model:</span>
                <select
                  value={musicModel}
                  onChange={(e) => setMusicModel(e.target.value as any)}
                  className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded text-slate-200 text-xs"
                >
                  <option value="lyria-3-clip-preview">Lyria Clip (30s Short Clip)</option>
                  <option value="lyria-3-pro-preview">Lyria Pro (Full Length Track)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Music Prompt / Theme:</label>
              <textarea
                value={musicPrompt}
                onChange={(e) => setMusicPrompt(e.target.value)}
                rows={2}
                placeholder="Describe style, instruments, mood, tempo..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-purple-500 font-mono text-xs"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <label className="flex items-center gap-2 text-slate-400 hover:text-slate-200 cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-purple-400" />
                <span>Attach Reference Image (Optional)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, setMusicImageBase64)}
                  className="hidden"
                />
              </label>

              {musicImageBase64 && (
                <span className="text-purple-400 text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Image Attached
                </span>
              )}

              <button
                onClick={handleGenerateMusic}
                disabled={isGeneratingMusic || !musicPrompt.trim()}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded font-semibold flex items-center gap-2 shadow-lg shadow-purple-500/20 disabled:opacity-50 cursor-pointer"
              >
                {isGeneratingMusic ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Synthesizing Track...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Generate Music Track</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated Track Playback */}
          {generatedAudioUrl && (
            <div className="p-4 bg-purple-950/20 border border-purple-500/30 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-300 font-semibold">
                  <Volume2 className="w-4 h-4 text-purple-400" />
                  <span>Synthesized Audio Track Ready</span>
                </div>
                <a
                  href={generatedAudioUrl}
                  download="aegentix-track.wav"
                  className="px-2.5 py-1 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 rounded flex items-center gap-1 text-[11px]"
                >
                  <Download className="w-3 h-3" />
                  <span>Download Audio</span>
                </a>
              </div>

              <audio controls src={generatedAudioUrl} className="w-full" autoPlay />

              {generatedLyrics && (
                <div className="p-3 bg-slate-950/80 rounded border border-purple-500/20">
                  <span className="text-[10px] text-purple-400 uppercase font-semibold block mb-1">Generated Lyrics / Arrangement:</span>
                  <p className="text-slate-300 whitespace-pre-wrap text-[11px]">{generatedLyrics}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: IMAGE STUDIO (gemini-3.1-flash-image-preview) */}
      {activeTab === 'IMAGE' && (
        <div className="p-5 space-y-4 font-mono text-xs">
          <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-cyan-400" />
                  <span>Create & Edit Images</span>
                </h3>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Powered by <span className="text-cyan-300">gemini-3.1-flash-image-preview</span> with text-to-image and multimodal image-to-image editing.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-[11px]">Ratio:</span>
                <select
                  value={imageAspectRatio}
                  onChange={(e) => setImageAspectRatio(e.target.value as any)}
                  className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded text-slate-200 text-xs"
                >
                  <option value="1:1">1:1 (Square)</option>
                  <option value="16:9">16:9 (Landscape)</option>
                  <option value="9:16">9:16 (Portrait)</option>
                  <option value="4:3">4:3 (Standard)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Image Prompt or Edit Instruction:</label>
              <textarea
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                rows={2}
                placeholder="e.g. A neon cybernetic trading interface with green alpha indicators..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-cyan-500 font-mono text-xs"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <label className="flex items-center gap-2 text-slate-400 hover:text-slate-200 cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-cyan-400" />
                <span>Upload Source Image to Edit (Optional)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, setEditImageBase64)}
                  className="hidden"
                />
              </label>

              {editImageBase64 && (
                <span className="text-cyan-400 text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Source Image Loaded (Edit Mode)
                </span>
              )}

              <button
                onClick={handleGenerateImage}
                disabled={isGeneratingImage || !imagePrompt.trim()}
                className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded font-semibold flex items-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
              >
                {isGeneratingImage ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Rendering Image...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{editImageBase64 ? 'Edit Image' : 'Generate Image'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated Image Output */}
          {generatedImageUrl && (
            <div className="p-4 bg-cyan-950/20 border border-cyan-500/30 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-cyan-300 font-semibold">Generated Artwork</span>
                <a
                  href={generatedImageUrl}
                  download="aegentix-image.png"
                  className="px-2.5 py-1 bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 border border-cyan-500/40 rounded flex items-center gap-1 text-[11px]"
                >
                  <Download className="w-3 h-3" />
                  <span>Download Image</span>
                </a>
              </div>
              <div className="rounded-lg overflow-hidden border border-slate-800 max-w-md mx-auto">
                <img src={generatedImageUrl} alt="Generated" className="w-full h-auto object-cover" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 3: VIDEO STUDIO (veo-3.1-fast-generate-preview) */}
      {activeTab === 'VIDEO' && (
        <div className="p-5 space-y-4 font-mono text-xs">
          <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Film className="w-4 h-4 text-rose-400" />
                  <span>Veo Video Generation & Photo Animation</span>
                </h3>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Powered by <span className="text-rose-300">veo-3.1-fast-generate-preview</span>. Generate video from text prompts or animate an uploaded photo.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-[11px]">Aspect Ratio:</span>
                <select
                  value={videoAspectRatio}
                  onChange={(e) => setVideoAspectRatio(e.target.value as any)}
                  className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded text-slate-200 text-xs"
                >
                  <option value="16:9">16:9 (Landscape)</option>
                  <option value="9:16">9:16 (Portrait)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Video Prompt / Motion Description:</label>
              <textarea
                value={videoPrompt}
                onChange={(e) => setVideoPrompt(e.target.value)}
                rows={2}
                placeholder="Camera movements, cinematic lighting, motion dynamics..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-rose-500 font-mono text-xs"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <label className="flex items-center gap-2 text-slate-400 hover:text-slate-200 cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-rose-400" />
                <span>Upload Photo to Animate (Optional)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, setVideoImageBase64)}
                  className="hidden"
                />
              </label>

              {videoImageBase64 && (
                <span className="text-rose-400 text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Photo Attached for Animation
                </span>
              )}

              <button
                onClick={handleGenerateVideo}
                disabled={isGeneratingVideo || (!videoPrompt.trim() && !videoImageBase64)}
                className="px-4 py-2 bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white rounded font-semibold flex items-center gap-2 shadow-lg shadow-rose-500/20 disabled:opacity-50 cursor-pointer"
              >
                {isGeneratingVideo ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Rendering Veo Video...</span>
                  </>
                ) : (
                  <>
                    <Film className="w-3.5 h-3.5" />
                    <span>{videoImageBase64 ? 'Animate Photo into Video' : 'Generate Video from Text'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Progress / Status banner */}
          {videoStatusMessage && (
            <div className="p-3 bg-rose-950/20 border border-rose-500/30 rounded-lg flex items-center gap-2 text-rose-300 text-xs">
              <RefreshCw className="w-4 h-4 animate-spin shrink-0 text-rose-400" />
              <span>{videoStatusMessage}</span>
            </div>
          )}

          {/* Rendered Video Player */}
          {generatedVideoUrl && (
            <div className="p-4 bg-rose-950/20 border border-rose-500/30 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-rose-300 font-semibold">Veo Rendered Output</span>
                <a
                  href={generatedVideoUrl}
                  download="aegentix-veo-video.mp4"
                  className="px-2.5 py-1 bg-rose-600/30 hover:bg-rose-600/50 text-rose-200 border border-rose-500/40 rounded flex items-center gap-1 text-[11px]"
                >
                  <Download className="w-3 h-3" />
                  <span>Download MP4</span>
                </a>
              </div>
              <div className="rounded-lg overflow-hidden border border-slate-800 max-w-lg mx-auto bg-black">
                <video controls src={generatedVideoUrl} className="w-full h-auto" autoPlay loop />
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 4: SEARCH GROUNDING (gemini-3.5-flash + googleSearch) */}
      {activeTab === 'SEARCH' && (
        <div className="p-5 space-y-4 font-mono text-xs">
          <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-emerald-400" />
              <span>Real-Time Google Search Grounding</span>
            </h3>
            <p className="text-slate-400 text-[11px]">
              Grounded with live web search data via <span className="text-emerald-300">gemini-3.5-flash</span> (using the <span className="font-semibold text-emerald-400">googleSearch</span> tool).
            </p>

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Market Query / Breaking Search Question:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchPrompt}
                  onChange={(e) => setSearchPrompt(e.target.value)}
                  placeholder="e.g. Current Bitcoin funding rate on Binance and Deribit..."
                  className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-emerald-500 font-mono text-xs"
                />
                <button
                  onClick={handleSearchGrounding}
                  disabled={isSearching || !searchPrompt.trim()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 disabled:opacity-50"
                >
                  {isSearching ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                  <span>Ground with Search</span>
                </button>
              </div>
            </div>
          </div>

          {searchResult && (
            <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-lg space-y-3">
              <div className="text-emerald-300 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Grounded Intelligence Response:</span>
              </div>
              <p className="text-slate-200 whitespace-pre-wrap leading-relaxed text-xs bg-slate-950/80 p-3 rounded border border-emerald-500/20">
                {searchResult}
              </p>

              {searchMetadata?.groundingChunks && (
                <div className="pt-2 border-t border-emerald-500/20">
                  <span className="text-[10px] text-emerald-400 font-semibold block mb-1">Citations & Search Sources:</span>
                  <div className="flex flex-wrap gap-2">
                    {searchMetadata.groundingChunks.slice(0, 5).map((chunk: any, i: number) => (
                      <a
                        key={i}
                        href={chunk.web?.uri}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-500/30 rounded text-[10px] flex items-center gap-1"
                      >
                        <ExternalLink className="w-2.5 h-2.5" />
                        <span>{chunk.web?.title?.slice(0, 30) || 'Source'}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 5: MAPS GROUNDING (gemini-3.5-flash + googleMaps) */}
      {activeTab === 'MAPS' && (
        <div className="p-5 space-y-4 font-mono text-xs">
          <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Geospatial Google Maps Grounding</span>
            </h3>
            <p className="text-slate-400 text-[11px]">
              Grounded with real-world physical location data via <span className="text-amber-300">gemini-3.5-flash</span> (using the <span className="font-semibold text-amber-400">googleMaps</span> tool).
            </p>

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Location / Geospatial Query:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={mapsPrompt}
                  onChange={(e) => setMapsPrompt(e.target.value)}
                  placeholder="e.g. Crypto ATM kiosks or OTC trading lounges in Tokyo..."
                  className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-amber-500 font-mono text-xs"
                />
                <button
                  onClick={handleMapsGrounding}
                  disabled={isSearchingMaps || !mapsPrompt.trim()}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded font-semibold flex items-center gap-1.5 shadow-md shadow-amber-500/20 disabled:opacity-50"
                >
                  {isSearchingMaps ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <MapPin className="w-3.5 h-3.5" />}
                  <span>Ground with Maps</span>
                </button>
              </div>
            </div>
          </div>

          {mapsResult && (
            <div className="p-4 bg-amber-950/20 border border-amber-500/30 rounded-lg space-y-3">
              <div className="text-amber-300 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Geospatial Intelligence:</span>
              </div>
              <p className="text-slate-200 whitespace-pre-wrap leading-relaxed text-xs bg-slate-950/80 p-3 rounded border border-amber-500/20">
                {mapsResult}
              </p>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 6: GEMINI MULTI-TURN CHATBOT */}
      {activeTab === 'CHAT' && (
        <div className="p-5 space-y-4 font-mono text-xs">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Model:</span>
              <select
                value={chatModel}
                onChange={(e) => setChatModel(e.target.value as any)}
                className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded text-slate-200 text-xs"
              >
                <option value="gemini-2.5-pro">gemini-2.5-pro (Complex Reasoning)</option>
                <option value="gemini-2.5-flash">gemini-2.5-flash (High Performance & Default)</option>
                <option value="gemini-2.0-flash">gemini-2.0-flash (Ultra-Fast Speed)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Role:</span>
              <select
                value={chatRole}
                onChange={(e) => setChatRole(e.target.value)}
                className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded text-slate-200 text-xs"
              >
                <option value="Sovereign Quantitative Architect">Sovereign Quantitative Architect</option>
                <option value="Cybersecurity & Invariant Auditor">Cybersecurity & Invariant Auditor</option>
                <option value="Autonomous Multi-Exchange Copilot">Autonomous Multi-Exchange Copilot</option>
              </select>
            </div>
          </div>

          {/* Conversation Thread */}
          <div className="border border-slate-800 rounded-lg bg-slate-950/60 p-4 h-[380px] overflow-y-auto space-y-3">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-2 mb-1 text-[10px] text-slate-500 font-mono">
                  <span>{msg.role === 'user' ? 'Operator' : `@${msg.model}`}</span>
                  <span>· {msg.timestamp}</span>
                </div>
                <div
                  className={`max-w-[85%] p-3 rounded-lg text-xs leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-blue-600/30 text-blue-100 border border-blue-500/40'
                      : 'bg-slate-900/90 text-slate-200 border border-slate-800'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isChatting && (
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Thinking ({chatModel})...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Chat Input Form */}
          <form onSubmit={handleSendChatMessage} className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask the Gemini Intelligence Core anything..."
              className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-blue-500 font-mono text-xs"
            />
            <button
              type="submit"
              disabled={isChatting || !chatInput.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-semibold flex items-center gap-1.5 shadow-md shadow-blue-500/20 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}

      {/* SUB-TAB 7: VOICE & AUDIO TRANSCRIPTION (gemini-3.8-live & gemini-3.5-transcribe) */}
      {activeTab === 'VOICE' && (
        <div className="p-5 space-y-5 font-mono text-xs">
          {/* Section A: Live Voice Synthesis (gemini-3.8-live) */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-teal-400" />
              <span>Live Voice Conversational Copilot (gemini-3.8-live)</span>
            </h3>
            <p className="text-slate-400 text-[11px]">
              Speaks in real-time with ultra-low latency voice output via Live API architecture.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={voicePrompt}
                onChange={(e) => setVoicePrompt(e.target.value)}
                placeholder="Spoken query for Gemini Live voice..."
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-teal-500 font-mono text-xs"
              />
              <button
                onClick={handleLiveSpeak}
                disabled={isGeneratingVoice || !voicePrompt.trim()}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded font-semibold flex items-center gap-1.5 shadow-md shadow-teal-500/20 disabled:opacity-50"
              >
                {isGeneratingVoice ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>Speak Now</span>
              </button>
            </div>
          </div>

          {/* Section B: Microphone Audio Transcription (gemini-3.5-transcribe) */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Mic className="w-4 h-4 text-emerald-400" />
              <span>Microphone Audio Transcription (gemini-3.5-transcribe)</span>
            </h3>
            <p className="text-slate-400 text-[11px]">
              Speak into your microphone; audio is transcribed into text using <span className="text-emerald-300">gemini-3.5-transcribe</span>.
            </p>

            <div className="flex items-center gap-3">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  disabled={isTranscribing}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded font-semibold flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <Mic className="w-4 h-4" />
                  <span>Start Microphone Recording</span>
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded font-semibold flex items-center gap-2 animate-pulse"
                >
                  <Square className="w-4 h-4" />
                  <span>Stop & Transcribe Spoken Audio</span>
                </button>
              )}

              {isTranscribing && (
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Transcribing recording...
                </span>
              )}
            </div>

            {transcribedText && (
              <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-lg space-y-1">
                <span className="text-[10px] text-emerald-400 font-semibold block">Transcribed Text Output:</span>
                <p className="text-slate-200 text-xs whitespace-pre-wrap leading-relaxed">
                  {transcribedText}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Firestore Synced Generation History Bar */}
      {historyRecords.length > 0 && (
        <div className="p-4 border-t border-slate-800 bg-[#070A0F] text-xs font-mono">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Cloud Firestore Synced History ({historyRecords.length} Saved)</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-medium">Auto-Persisted</span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {historyRecords.slice(0, 6).map((rec) => (
              <div
                key={rec.id}
                className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-[11px] shrink-0 text-slate-300 max-w-[200px] truncate"
              >
                <span className="text-cyan-400 font-bold uppercase text-[9px] block">[{rec.type}]</span>
                <span className="truncate block">{rec.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
