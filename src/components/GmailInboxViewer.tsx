import React, { useState, useEffect } from 'react';
import { 
  googleSignIn, 
  initAuth, 
  getAccessToken, 
  logoutGoogle 
} from '../lib/driveAuth';
import { User } from 'firebase/auth';
import { 
  Mail, 
  Send, 
  Inbox, 
  RefreshCw, 
  CheckCircle2, 
  Trash2, 
  Star, 
  AlertCircle, 
  Search, 
  PenSquare, 
  X, 
  ExternalLink, 
  LogOut, 
  Tag,
  Paperclip
} from 'lucide-react';

interface GmailMessageHeader {
  name: string;
  value: string;
}

interface GmailMessageSummary {
  id: string;
  threadId: string;
  snippet: string;
  subject?: string;
  from?: string;
  date?: string;
  labels?: string[];
  unread?: boolean;
}

interface GmailInboxViewerProps {
  onNotify?: (message: string, type: 'ALERT' | 'SUCCESS' | 'INFO') => void;
}

export const GmailInboxViewer: React.FC<GmailInboxViewerProps> = ({ onNotify }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [messages, setMessages] = useState<GmailMessageSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<GmailMessageSummary | null>(null);

  // Compose modal state
  const [isComposing, setIsComposing] = useState(false);
  const [toAddress, setToAddress] = useState('');
  const [subjectText, setSubjectText] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Destructive delete confirmation dialog state
  const [messageToDelete, setMessageToDelete] = useState<GmailMessageSummary | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, currentToken) => {
        setUser(currentUser);
        setToken(currentToken);
        setNeedsAuth(false);
        loadGmailMessages(currentToken);
      },
      () => {
        setUser(null);
        setToken(null);
        setNeedsAuth(true);
        setMessages([]);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        setNeedsAuth(false);
        if (onNotify) onNotify(`Gmail connected for ${result.user.email}!`, 'SUCCESS');
        await loadGmailMessages(result.accessToken);
      }
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user' && !err?.message?.includes('popup-closed-by-user')) {
        if (onNotify) onNotify(`Gmail sign in failed: ${err.message}`, 'ALERT');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logoutGoogle();
    setUser(null);
    setToken(null);
    setNeedsAuth(true);
    setMessages([]);
    setSelectedMessage(null);
    if (onNotify) onNotify('Gmail disconnected', 'INFO');
  };

  // Fetch recent messages list from Gmail API
  const loadGmailMessages = async (authToken?: string | null) => {
    const activeToken = authToken || token || (await getAccessToken());
    if (!activeToken) {
      setNeedsAuth(true);
      return;
    }

    setIsLoadingMessages(true);
    try {
      const q = searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : '';
      const listRes = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=25${q}`,
        {
          headers: { Authorization: `Bearer ${activeToken}` },
        }
      );

      if (!listRes.ok) {
        if (listRes.status === 401) {
          setNeedsAuth(true);
          throw new Error('Access token expired. Please re-authenticate.');
        }
        const errJson = await listRes.json();
        throw new Error(errJson.error?.message || 'Failed to fetch messages');
      }

      const listData = await listRes.json();
      const rawMessages: { id: string; threadId: string }[] = listData.messages || [];

      // Fetch headers & snippet for each message (top 15)
      const messageDetails = await Promise.all(
        rawMessages.slice(0, 15).map(async (msg) => {
          try {
            const detailRes = await fetch(
              `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`,
              {
                headers: { Authorization: `Bearer ${activeToken}` },
              }
            );
            if (detailRes.ok) {
              const detail = await detailRes.json();
              const headers: GmailMessageHeader[] = detail.payload?.headers || [];
              const subject = headers.find((h) => h.name.toLowerCase() === 'subject')?.value || '(No Subject)';
              const from = headers.find((h) => h.name.toLowerCase() === 'from')?.value || 'Unknown Sender';
              const date = headers.find((h) => h.name.toLowerCase() === 'date')?.value || '';
              const labels: string[] = detail.labelIds || [];
              const unread = labels.includes('UNREAD');

              return {
                id: msg.id,
                threadId: msg.threadId,
                snippet: detail.snippet || '',
                subject,
                from,
                date,
                labels,
                unread,
              };
            }
          } catch {
            // fallback minimal info
          }
          return {
            id: msg.id,
            threadId: msg.threadId,
            snippet: 'Could not load preview',
            subject: '(No Subject)',
            from: 'Unknown',
            date: '',
          };
        })
      );

      setMessages(messageDetails);
      if (onNotify) onNotify(`Loaded ${messageDetails.length} messages from your Gmail inbox.`, 'INFO');
    } catch (err: any) {
      if (onNotify) onNotify(`Gmail error: ${err.message}`, 'ALERT');
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Explicit user confirmation for destructive delete
  const confirmDeleteMessage = async () => {
    if (!messageToDelete) return;
    const activeToken = token || (await getAccessToken());
    if (!activeToken) return;

    setIsDeleting(true);
    try {
      // Move message to trash or permanently delete
      const res = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageToDelete.id}/trash`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${activeToken}` },
        }
      );

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error?.message || 'Failed to move email to trash');
      }

      setMessages((prev) => prev.filter((m) => m.id !== messageToDelete.id));
      if (selectedMessage?.id === messageToDelete.id) {
        setSelectedMessage(null);
      }
      if (onNotify) onNotify(`Email "${messageToDelete.subject}" moved to trash.`, 'SUCCESS');
      setMessageToDelete(null);
    } catch (err: any) {
      if (onNotify) onNotify(`Delete failed: ${err.message}`, 'ALERT');
    } finally {
      setIsDeleting(false);
    }
  };

  // Explicit user confirmation for sending an email
  const handleSendEmail = async () => {
    if (!toAddress || !bodyText) {
      if (onNotify) onNotify('Please enter a recipient email and body text.', 'ALERT');
      return;
    }

    const activeToken = token || (await getAccessToken());
    if (!activeToken) return;

    setIsSending(true);
    try {
      // Build RFC 2822 email format and base64url encode it
      const emailContent = [
        `To: ${toAddress}`,
        `Subject: ${subjectText || 'Automated Portfolio Alert'}`,
        'Content-Type: text/plain; charset=utf-8',
        '',
        bodyText,
      ].join('\r\n');

      const encodedMessage = btoa(unescape(encodeURIComponent(emailContent)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const res = await fetch(
        'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${activeToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ raw: encodedMessage }),
        }
      );

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error?.message || 'Failed to send message');
      }

      if (onNotify) onNotify(`Email successfully sent to ${toAddress}!`, 'SUCCESS');
      setIsComposing(false);
      setToAddress('');
      setSubjectText('');
      setBodyText('');
      loadGmailMessages();
    } catch (err: any) {
      if (onNotify) onNotify(`Send failed: ${err.message}`, 'ALERT');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-[#0B0F17] border border-slate-800 rounded-xl overflow-hidden shadow-2xl space-y-4 font-mono text-xs">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-red-950/40 via-[#0B0F17] to-amber-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/20 shrink-0">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wide uppercase">
                GMAIL WORKSPACE INBOX &amp; NOTIFICATION DISPATCHER
              </h2>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 ${
                user ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${user ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                {user ? 'GMAIL ACTIVE' : 'AUTHENTICATION REQUIRED'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Read real-time inbox messages, search threads, and compose automated risk/portfolio email dispatches
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="text-right hidden sm:block">
                <span className="text-[11px] text-white font-bold block">{user.displayName || user.email}</span>
                <span className="text-[9px] text-slate-400">{messages.length} messages loaded</span>
              </div>

              <button
                onClick={() => setIsComposing(true)}
                className="px-3 py-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded font-bold text-xs flex items-center gap-1.5 shadow-md shadow-red-600/20 cursor-pointer"
              >
                <PenSquare className="w-3.5 h-3.5" />
                <span>Compose</span>
              </button>

              <button
                onClick={() => loadGmailMessages()}
                disabled={isLoadingMessages}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 cursor-pointer"
                title="Refresh Messages"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMessages ? 'animate-spin text-cyan-400' : ''}`} />
              </button>

              <button
                onClick={handleLogout}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-red-950/40 text-slate-400 hover:text-red-300 border border-slate-700 rounded transition-all flex items-center gap-1 cursor-pointer"
                title="Disconnect Gmail"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Disconnect</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="gsi-material-button px-4 py-2 bg-white text-slate-900 hover:bg-slate-100 rounded-lg font-bold text-xs flex items-center gap-2.5 shadow-lg shadow-white/10 transition-all cursor-pointer disabled:opacity-50"
            >
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              </svg>
              <span>{isLoggingIn ? 'Connecting...' : 'Sign in with Google'}</span>
            </button>
          )}
        </div>
      </div>

      {needsAuth ? (
        <div className="p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 mx-auto flex items-center justify-center">
            <Mail className="w-8 h-8 text-red-400 animate-pulse" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="text-base font-bold text-white">Connect Gmail to Access Messages &amp; Send Alerts</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Authenticate with your Google Workspace account to read transaction confirmations, trade execution alerts, and directly compose automated reports.
            </p>
          </div>
          <button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs rounded-lg shadow-lg shadow-red-600/30 transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            <span>Connect Gmail Workspace</span>
          </button>
        </div>
      ) : (
        <div className="px-4 space-y-3">
          {/* Search bar & filter controls */}
          <div className="p-3 bg-[#070A0F] border border-slate-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search emails (e.g. from:support, portfolio, trade)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') loadGmailMessages();
                }}
                className="w-full bg-slate-900 border border-slate-800 rounded pl-8 pr-3 py-1.5 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => loadGmailMessages()}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-semibold cursor-pointer"
              >
                Search
              </button>
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    loadGmailMessages();
                  }}
                  className="px-2 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-500 hover:text-white rounded text-xs cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Messages Split View (List on left, preview on right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-[420px]">
            {/* Messages List (7 cols) */}
            <div className="lg:col-span-7 border border-slate-800 rounded-lg overflow-hidden bg-[#070A0F] flex flex-col">
              <div className="p-2.5 border-b border-slate-800/80 bg-slate-900/50 flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase">
                <span className="flex items-center gap-1.5">
                  <Inbox className="w-3.5 h-3.5 text-red-400" />
                  <span>Recent Messages ({messages.length})</span>
                </span>
                <span>Actions</span>
              </div>

              {isLoadingMessages ? (
                <div className="p-12 text-center space-y-2 flex-1 flex flex-col justify-center items-center">
                  <RefreshCw className="w-5 h-5 text-red-400 animate-spin mx-auto" />
                  <span className="text-slate-400 text-xs">Fetching messages from Gmail...</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="p-12 text-center text-slate-500 text-xs flex-1 flex flex-col justify-center items-center">
                  No messages found in your inbox matching the query.
                </div>
              ) : (
                <div className="divide-y divide-slate-800/60 overflow-y-auto max-h-[460px]">
                  {messages.map((msg) => {
                    const isSelected = selectedMessage?.id === msg.id;
                    return (
                      <div
                        key={msg.id}
                        onClick={() => setSelectedMessage(msg)}
                        className={`p-3 transition-colors cursor-pointer flex items-start justify-between gap-2.5 ${
                          isSelected ? 'bg-red-950/20 border-l-2 border-red-500' : 'hover:bg-slate-900/40'
                        }`}
                      >
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-[11px] font-bold truncate ${msg.unread ? 'text-white font-bold' : 'text-slate-300'}`}>
                              {msg.from}
                            </span>
                            {msg.unread && (
                              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                            )}
                          </div>
                          <span className="text-white block text-xs font-semibold truncate">
                            {msg.subject}
                          </span>
                          <p className="text-slate-400 text-[10px] line-clamp-1">
                            {msg.snippet}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-1 shrink-0 text-[10px] text-slate-500">
                          <span>{msg.date ? new Date(msg.date).toLocaleDateString([], { month: 'short', day: 'numeric' }) : ''}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setMessageToDelete(msg);
                            }}
                            className="p-1 hover:text-red-400 text-slate-600 transition-colors"
                            title="Delete message"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Message Detail Preview (5 cols) */}
            <div className="lg:col-span-5 border border-slate-800 rounded-lg p-4 bg-[#070A0F] flex flex-col justify-between">
              {selectedMessage ? (
                <div className="space-y-3">
                  <div className="border-b border-slate-800 pb-3 space-y-1">
                    <span className="text-white font-bold text-sm block">
                      {selectedMessage.subject}
                    </span>
                    <div className="text-[10px] text-slate-400 flex flex-col gap-0.5">
                      <div><b className="text-slate-300">From:</b> {selectedMessage.from}</div>
                      <div><b className="text-slate-300">Date:</b> {selectedMessage.date}</div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-900/60 border border-slate-800 rounded text-slate-300 text-xs leading-relaxed whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                    {selectedMessage.snippet}
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => {
                        setToAddress(selectedMessage.from || '');
                        setSubjectText(`Re: ${selectedMessage.subject}`);
                        setIsComposing(true);
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <PenSquare className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Reply</span>
                    </button>
                    <button
                      onClick={() => setMessageToDelete(selectedMessage)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-red-950/40 text-slate-400 hover:text-red-300 border border-slate-800 rounded font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Move to Trash</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500 text-xs my-auto">
                  Select an email on the left to read preview or reply.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MANDATORY USER CONFIRMATION MODAL: Destructive Delete */}
      {messageToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0B0F17] border border-red-500/50 rounded-xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase">Move Email to Trash?</h3>
                <p className="text-[11px] text-slate-400">Confirmation required for data mutation.</p>
              </div>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs space-y-1">
              <div><b className="text-slate-400">Subject:</b> <span className="text-white">{messageToDelete.subject}</span></div>
              <div><b className="text-slate-400">From:</b> <span className="text-slate-300">{messageToDelete.from}</span></div>
            </div>

            <p className="text-slate-300 text-xs leading-relaxed">
              Are you sure you want to move this email to the Gmail Trash? You can restore it from your Gmail Trash folder within 30 days.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setMessageToDelete(null)}
                disabled={isDeleting}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteMessage}
                disabled={isDeleting}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>{isDeleting ? 'Moving to Trash...' : 'Confirm Move to Trash'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMPOSE EMAIL MODAL */}
      {isComposing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0B0F17] border border-slate-700 rounded-xl max-w-lg w-full p-5 space-y-3.5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span className="font-bold text-white text-xs uppercase flex items-center gap-1.5">
                <PenSquare className="w-4 h-4 text-red-400" />
                <span>Compose Gmail Message</span>
              </span>
              <button
                onClick={() => setIsComposing(false)}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 text-[10px] font-bold">RECIPIENT (TO):</label>
                <input
                  type="email"
                  placeholder="recipient@example.com"
                  value={toAddress}
                  onChange={(e) => setToAddress(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 text-[10px] font-bold">SUBJECT:</label>
                <input
                  type="text"
                  placeholder="Subject line..."
                  value={subjectText}
                  onChange={(e) => setSubjectText(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 text-[10px] font-bold">BODY CONTENT:</label>
                <textarea
                  rows={6}
                  placeholder="Write message content here..."
                  value={bodyText}
                  onChange={(e) => setBodyText(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-3 text-white focus:outline-none focus:border-red-500 leading-relaxed font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsComposing(false)}
                disabled={isSending}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                disabled={isSending || !toAddress || !bodyText}
                className="px-4 py-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Send className={`w-3.5 h-3.5 ${isSending ? 'animate-spin' : ''}`} />
                <span>{isSending ? 'Sending...' : 'Confirm & Send Email'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
