import { useEffect, useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { getAEGENTIS, useAEGENTISCommand } from '@/lib/aegentis';

interface CommandResult {
  success: boolean;
  assetTx?: string;
  error?: string;
  timestamp: string;
}

interface OperatorMode {
  authority: 'OBSERVER' | 'OPERATOR' | 'ADMIN' | 'SOVEREIGN';
  canMint: boolean;
  canCommand: boolean;
}

export function Synthesis() {
  const { user, isAuthenticated } = useAuth();
  const { execute: executeCommand, loading: commandLoading, error: commandError } = useAEGENTISCommand();
  const [mode, setMode] = useState<OperatorMode>({
    authority: 'OBSERVER',
    canMint: false,
    canCommand: false,
  });
  const [commandInput, setCommandInput] = useState('');
  const [listening, setListening] = useState(false);
  const [results, setResults] = useState<CommandResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Set JWT token and fetch operator mode on mount
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchMode = async () => {
      try {
        const aegentis = getAEGENTIS();
        // In production, get JWT from OAuth context
        const token = localStorage.getItem('auth_token') || 'mock_jwt_token';
        aegentis.setJWT(token);

        // Get identity to determine authority
        const identity = await aegentis.getIdentity();
        const authority = identity.authority || 'OBSERVER';

        setMode({
          authority: authority as any,
          canMint: ['OPERATOR', 'ADMIN', 'SOVEREIGN'].includes(authority),
          canCommand: ['OPERATOR', 'ADMIN', 'SOVEREIGN'].includes(authority),
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    fetchMode();
  }, [isAuthenticated]);

  // Send command to AEGENTIS
  const sendCommand = async (command: string) => {
    if (!command.trim()) return;
    if (!mode.canCommand) {
      setError('Insufficient authority to send commands');
      return;
    }

    setError(null);

    try {
      // Parse command: "MINT AGENT <name>" or "MINT ASSET <name>"
      const parts = command.trim().split(' ');
      const action = parts[0]?.toUpperCase();
      const type = parts[1]?.toUpperCase();
      const name = parts.slice(2).join(' ') || 'Unnamed';

      if (action !== 'MINT') {
        throw new Error('Only MINT commands supported');
      }

      if (!['AGENT', 'ASSET'].includes(type)) {
        throw new Error('Type must be AGENT or ASSET');
      }

      // Execute command via AEGENTIS client
      const result = await executeCommand({
        action: 'treasury.mint_patent_asset',
        authority: mode.authority,
        params: {
          name,
          type,
        },
      });

      if (!result) {
        throw new Error('No response from AEGENTIS');
      }

      // Add result
      const commandResult: CommandResult = {
        success: result.status === 'ok',
        assetTx: result.result?.asset_tx || `tx_${Date.now()}`,
        error: result.error,
        timestamp: new Date().toISOString(),
      };

      setResults((prev) => [commandResult, ...prev]);
      setCommandInput('');

      // Trigger animation (in real VR, spawn new star)
      console.log('[Synthesis] New asset minted:', commandResult.assetTx);
    } catch (err) {
      const commandResult: CommandResult = {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };

      setResults((prev) => [commandResult, ...prev]);
      setError(commandResult.error || null);
    }
  };

  // Voice command handler
  const startVoiceCommand = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setListening(true);
      setError(null);
    };

    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      if (event.isFinal) {
        setCommandInput(transcript || '');
        setListening(false);
      }
    };

    recognition.onerror = (event: any) => {
      setError(`Speech error: ${event.error}`);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="p-8 max-w-md">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground">Please log in to access synthesis commands.</p>
        </Card>
      </div>
    );
  }

  const canExecute = mode.canCommand && !commandLoading;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Synthesis Command Interface</h1>
          <p className="text-muted-foreground">Execute AEGENTIS treasury operations via voice or text</p>
        </div>

        {/* Authority Check */}
        <Card className="p-6 mb-8 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-2">Operator Authority</h2>
              <p className="text-muted-foreground">
                Current mode: <Badge variant="outline">{mode.authority}</Badge>
              </p>
            </div>
            {mode.canCommand ? (
              <CheckCircle className="w-8 h-8 text-green-500" />
            ) : (
              <AlertCircle className="w-8 h-8 text-red-500" />
            )}
          </div>
          {!mode.canCommand && (
            <p className="text-sm text-red-500 mt-4">
              Your authority level does not permit command execution. Upgrade to OPERATOR or higher.
            </p>
          )}
        </Card>

        {/* Error Display */}
        {(error || commandError) && (
          <Card className="p-4 mb-8 border-red-500 bg-red-50 dark:bg-red-950">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-700 dark:text-red-300">
                {error || (commandError instanceof Error ? commandError.message : commandError)}
              </p>
            </div>
          </Card>
        )}

        {/* Command Input */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Send Command</h2>

          <div className="space-y-4">
            {/* Text Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Text Command</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g., MINT AGENT Carl"
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && canExecute) {
                      sendCommand(commandInput);
                    }
                  }}
                  disabled={!canExecute}
                  className="flex-1 px-4 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground disabled:opacity-50"
                />
                <Button
                  onClick={() => sendCommand(commandInput)}
                  disabled={!canExecute || !commandInput.trim()}
                  className="gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Format: MINT [AGENT|ASSET] [name]
              </p>
            </div>

            {/* Voice Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Voice Command</label>
              <Button
                onClick={startVoiceCommand}
                disabled={!canExecute || listening}
                variant={listening ? 'destructive' : 'outline'}
                className="gap-2 w-full"
              >
                <Mic className="w-4 h-4" />
                {listening ? 'Listening...' : 'Start Voice Command'}
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Say: "MINT AGENT [name]" or "MINT ASSET [name]"
              </p>
            </div>
          </div>
        </Card>

        {/* Results */}
        {results.length > 0 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Command Results</h2>
            <div className="space-y-4">
              {results.map((result, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border ${
                    result.success
                      ? 'border-green-500 bg-green-50 dark:bg-green-950'
                      : 'border-red-500 bg-red-50 dark:bg-red-950'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {result.success ? (
                          <>
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="font-semibold text-green-700 dark:text-green-300">
                              Success
                            </span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-5 h-5 text-red-500" />
                            <span className="font-semibold text-red-700 dark:text-red-300">
                              Failed
                            </span>
                          </>
                        )}
                      </div>
                      {result.assetTx && (
                        <p className="text-sm font-mono mb-2">
                          Transaction: <code className="bg-black/10 px-2 py-1 rounded">{result.assetTx}</code>
                        </p>
                      )}
                      {result.error && (
                        <p className="text-sm text-red-700 dark:text-red-300">{result.error}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(result.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Info Section */}
        <Card className="p-6 mt-8 bg-muted">
          <h3 className="font-semibold mb-2">About Synthesis</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Commands are signed with JWT + nonce verification</li>
            <li>• All mutations route through AEGENTIS (cogn8tives gateway)</li>
            <li>• Results appear as new stars in the VR constellation</li>
            <li>• Voice commands use Web Speech API (requires microphone)</li>
            <li>• Authority level determines available operations</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

export default Synthesis;
