import React, { useState } from 'react';
import { X, Wallet, Key, CheckCircle, ShieldCheck, Check } from 'lucide-react';

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  connectedWallet: { address: string; type: string } | null;
  onConnectWallet: (walletType: string, address: string) => void;
  onDisconnectWallet: () => void;
}

export const WalletConnectModal: React.FC<WalletConnectModalProps> = ({
  isOpen,
  onClose,
  connectedWallet,
  onConnectWallet,
  onDisconnectWallet,
}) => {
  const [binanceKey, setBinanceKey] = useState('binance_us_subaccount_alpha_921');
  const [coinbaseKey, setCoinbaseKey] = useState('coinbase_cloud_advanced_api_active');
  const [savedKeys, setSavedKeys] = useState(false);

  if (!isOpen) return null;

  const mockWallets = [
    {
      name: 'MetaMask (Ethereum Mainnet)',
      type: 'METAMASK',
      address: '0x71C...849F',
      fullAddress: '0x71C568a29A88F3c37e97123984FaA628469E849F',
    },
    {
      name: 'Phantom (Solana & Arbitrum)',
      type: 'PHANTOM',
      address: '4u8D...2Kp9',
      fullAddress: '4u8D51aX8B2Kp93kYvLmQjPo871aZb91e8X2',
    },
    {
      name: 'Ledger Nano X (Hardware Sovereign)',
      type: 'LEDGER',
      address: '0x39a...E180',
      fullAddress: '0x39a2B8f9A814981C091bFa991823901a8901E180',
    },
  ];

  const handleSaveApiKeys = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedKeys(true);
    setTimeout(() => setSavedKeys(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-mono">
      <div className="bg-[#0B0F17] border border-cyan-500/30 rounded-lg w-full max-w-lg p-5 shadow-2xl text-xs space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-wider text-xs">
            <Wallet className="w-4 h-4" />
            <span>Connection & Key Uplink Manager</span>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Web3 Wallets */}
        <div>
          <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wide mb-2 flex items-center gap-2">
            <span>Self-Custodial Web3 Wallets (DEX Uplink)</span>
            <span className="text-[10px] text-emerald-400">· Ready</span>
          </div>

          <div className="space-y-2">
            {mockWallets.map((w) => {
              const isSelected = connectedWallet?.type === w.type;
              return (
                <div
                  key={w.type}
                  className={`flex items-center justify-between p-3 rounded border transition-all ${
                    isSelected
                      ? 'bg-cyan-950/20 border-cyan-500/50 text-white'
                      : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-xs text-white">{w.name}</div>
                    <div className="text-[10px] text-slate-400">{w.address}</div>
                  </div>
                  <div>
                    {isSelected ? (
                      <button
                        onClick={onDisconnectWallet}
                        className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded text-[10px]"
                      >
                        Disconnect
                      </button>
                    ) : (
                      <button
                        onClick={() => onConnectWallet(w.type, w.fullAddress)}
                        className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded text-[10px]"
                      >
                        Handshake
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CEX API Keys (Safe Simulation) */}
        <div>
          <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wide mb-2 flex items-center gap-2">
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>Centralized Exchange API Keys (Simulation)</span>
          </div>

          <form onSubmit={handleSaveApiKeys} className="space-y-3 p-3 bg-slate-900/40 rounded border border-slate-800">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Binance.US API Key Identifier</label>
              <input
                type="text"
                value={binanceKey}
                onChange={(e) => setBinanceKey(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Coinbase Cloud Key Identifier</label>
              <input
                type="text"
                value={coinbaseKey}
                onChange={(e) => setCoinbaseKey(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Secrets Encrypted Locally
              </span>
              <button
                type="submit"
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded font-medium text-xs flex items-center gap-1"
              >
                {savedKeys ? <Check className="w-3 h-3 text-emerald-400" /> : null}
                <span>{savedKeys ? 'Saved' : 'Save Config'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
