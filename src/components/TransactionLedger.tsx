import React, { useState } from 'react';
import { Layers, ExternalLink, ShieldCheck, Filter } from 'lucide-react';
import { TransactionRecord } from '../types';

interface TransactionLedgerProps {
  transactions: TransactionRecord[];
}

const getExplorerUrl = (tx: TransactionRecord): string => {
  const hash = tx.txHash || '';
  const pair = (tx.pair || '').toUpperCase();
  const asset = (tx.asset || '').toUpperCase();

  if (pair.includes('SOL') || asset.includes('SOL')) {
    return `https://solscan.io/tx/${hash}`;
  }
  if (pair.includes('XRP') || asset.includes('XRP')) {
    return `https://xrpscan.com/tx/${hash}`;
  }
  if (pair.includes('BTC') || asset.includes('BTC')) {
    return `https://mempool.space/tx/${hash}`;
  }
  if (pair.includes('AVAX') || asset.includes('AVAX')) {
    return `https://snowtrace.io/tx/${hash}`;
  }
  if (pair.includes('POL') || pair.includes('MATIC')) {
    return `https://polygonscan.com/tx/${hash}`;
  }
  if (pair.includes('ARB')) {
    return `https://arbiscan.io/tx/${hash}`;
  }
  if (pair.includes('OP')) {
    return `https://optimistic.etherscan.io/tx/${hash}`;
  }
  if (hash.startsWith('0x')) {
    return `https://etherscan.io/tx/${hash}`;
  }
  return `https://etherscan.io/tx/${hash}`;
};

export const TransactionLedger: React.FC<TransactionLedgerProps> = ({ transactions }) => {
  const [filter, setFilter] = useState<'ALL' | 'DEX' | 'CEX' | 'ARBITRAGE'>('ALL');

  const filteredTxs = transactions.filter((tx) => {
    if (filter === 'DEX') return tx.venue === 'ON_CHAIN_DEX';
    if (filter === 'CEX') return tx.venue === 'OFF_CHAIN_CEX';
    if (filter === 'ARBITRAGE') return tx.venue === 'CROSS_EXCHANGE';
    return true;
  });

  return (
    <div className="bg-[#0D121D] border border-slate-800 rounded-lg p-5 font-mono shadow-sm">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-800/80 gap-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Dual-Exchange Execution Ledger
          </h3>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded border border-slate-800 text-xs">
          {(['ALL', 'ARBITRAGE', 'DEX', 'CEX'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilter(mode)}
              className={`px-2.5 py-1 text-[10px] font-medium rounded transition-colors ${
                filter === mode
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {mode === 'ALL'
                ? 'All Venues'
                : mode === 'ARBITRAGE'
                ? 'Cross-Exchange'
                : mode === 'DEX'
                ? 'On-Chain (DEX)'
                : 'Off-Chain (CEX)'}
            </button>
          ))}
        </div>
      </div>

      {/* Ledger Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-[10px] text-slate-400 border-b border-slate-800/60">
              <th className="py-2 font-normal">Timestamp</th>
              <th className="py-2 font-normal">Venue & Action</th>
              <th className="py-2 font-normal">Asset / Pair</th>
              <th className="py-2 font-normal text-right">Size</th>
              <th className="py-2 font-normal text-right">Exec Price</th>
              <th className="py-2 font-normal text-right">Fee / Gas</th>
              <th className="py-2 font-normal text-right">Tx Hash</th>
              <th className="py-2 font-normal text-right">Explorer</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {filteredTxs.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-6 text-center text-slate-400 text-xs">
                  No transactions recorded for the selected venue filter.
                </td>
              </tr>
            ) : (
              filteredTxs.map((tx, idx) => {
                const isDex = tx.venue === 'ON_CHAIN_DEX';
                const isCross = tx.venue === 'CROSS_EXCHANGE';
                const uniqueKey = tx.id ? `${tx.id}-${idx}` : `tx-${idx}`;
                const explorerUrl = getExplorerUrl(tx);

                return (
                  <tr key={uniqueKey} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-2.5 text-slate-400 text-[10px]">
                      {new Date(tx.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isCross ? 'bg-cyan-400' : isDex ? 'bg-indigo-400' : 'bg-emerald-400'
                          }`}
                        />
                        <span className="font-semibold text-slate-200 text-xs">{tx.type}</span>
                        <span className="text-[9px] text-slate-400 border border-slate-700/60 rounded px-1">
                          {isCross ? 'CROSS' : isDex ? 'DEX' : 'CEX'}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 text-slate-300 font-medium">
                      {tx.pair}
                    </td>
                    <td className="py-2.5 text-right tabular-nums text-slate-200">
                      {tx.amount} {tx.asset}
                    </td>
                    <td className="py-2.5 text-right tabular-nums text-slate-200">
                      ${tx.executionPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 text-right tabular-nums text-slate-400 text-[10px]">
                      ${tx.feeUsd.toFixed(2)}
                    </td>
                    <td className="py-2.5 text-right text-[10px]">
                      <span className="text-cyan-400 font-mono" title={tx.txHash}>
                        {tx.txHash.startsWith('0x')
                          ? `${tx.txHash.slice(0, 6)}...${tx.txHash.slice(-4)}`
                          : tx.txHash}
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      <a
                        href={explorerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800/80 hover:bg-cyan-600/30 text-cyan-300 hover:text-cyan-200 border border-slate-700/80 hover:border-cyan-400/50 text-[10px] font-bold transition-all shadow-xs"
                        title={`View on Explorer: ${tx.txHash}`}
                      >
                        <span>View on Explorer</span>
                        <ExternalLink className="w-3 h-3 text-cyan-400" />
                      </a>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
