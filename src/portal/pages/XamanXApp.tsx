import { Shield, Zap, TrendingUp, Lock, Wallet, Activity } from 'lucide-react';

export function XamanXApp() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 text-white p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-6 h-6 text-cyan-400" />
          <h1 className="text-2xl font-bold text-cyan-400">SOVEREIGN SYSTEM</h1>
        </div>
        <p className="text-sm text-slate-400">Autonomous Trading Portal</p>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-cyan-500/30 rounded-lg p-6 mb-6">
        <h2 className="text-3xl font-bold mb-2 text-white">
          AUTONOMOUS TRADING
        </h2>
        <p className="text-cyan-400 text-sm mb-4">
          Integrity. Resilience. Transparency. Sovereignty.
        </p>
        <div className="flex gap-2">
          <button className="bg-cyan-500 hover:bg-cyan-600 text-black px-4 py-2 rounded font-semibold text-sm transition">
            Start Trading
          </button>
          <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded font-semibold text-sm transition">
            View Docs
          </button>
        </div>
      </div>

      {/* Portfolio Overview */}
      <div className="space-y-4 mb-6">
        {/* Total Value */}
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Portfolio Value</span>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            $8,942,731.22
          </div>
          <div className="text-sm text-green-400">
            +2.73% (24h)
          </div>
        </div>

        {/* XRP Balance */}
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">XRP Balance</span>
            <Wallet className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            5,000 XRP
          </div>
          <div className="text-sm text-slate-400">
            ≈ $2,500.00
          </div>
        </div>

        {/* Trading Strategy */}
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Active Strategy</span>
            <Zap className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-xl font-bold text-white">
            Cross-DEX Arbitrage
          </div>
          <div className="text-sm text-slate-400">
            Status: <span className="text-green-400">Active</span>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm flex items-center gap-2">
              <Activity className="w-4 h-4" />
              System Status
            </span>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Batch Engine</span>
              <span className="text-green-400">✓ Ready</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Xaman Connected</span>
              <span className="text-green-400">✓ Connected</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Desktop Sync</span>
              <span className="text-green-400">✓ Synced</span>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Sync Status */}
      <div className="mb-6 bg-slate-900/50 border border-slate-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-slate-400 text-sm">Desktop Twin Engine</span>
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        </div>
        <div className="text-sm text-green-400">Connected</div>
        <div className="text-xs text-slate-500 mt-2">Batch Queue: 0/8</div>
      </div>

      {/* Live Trade Feed */}
      <div className="mb-6">
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Live Trade Execution</h3>
            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">LIVE</span>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <div className="text-slate-400 text-xs mb-1">Total Profit</div>
              <div className="text-2xl font-bold text-green-400">$0.00</div>
            </div>
            <div>
              <div className="text-slate-400 text-xs mb-1">Executed</div>
              <div className="text-2xl font-bold text-white">0</div>
            </div>
            <div>
              <div className="text-slate-400 text-xs mb-1">Avg Profit</div>
              <div className="text-2xl font-bold text-cyan-400">$0.00</div>
            </div>
          </div>

          <div className="text-center text-slate-400 text-sm py-4">
            Waiting for trades...
          </div>
        </div>
      </div>

      {/* Trading Controls */}
      <div className="space-y-3 mb-6">
        <button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2">
          <Zap className="w-4 h-4" />
          Pause Trading
        </button>

        <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2">
          <Lock className="w-4 h-4" />
          Cross-DEX Arbitrage
        </button>

        <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-semibold transition">
          View Trading History
        </button>
      </div>

      {/* Account Info */}
      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-xs">
        <div className="text-slate-400 mb-2">Account Address</div>
        <div className="text-cyan-400 font-mono break-all">
          rwB7JKKc5gJ47pPnWCFvQuhVW85mejYF1M
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-slate-500 text-xs">
        <p>Powered by Sovereign System Portal</p>
        <p className="mt-1">Secure. Autonomous. Sovereign.</p>
      </div>
    </div>
  );
}

export default XamanXApp;
