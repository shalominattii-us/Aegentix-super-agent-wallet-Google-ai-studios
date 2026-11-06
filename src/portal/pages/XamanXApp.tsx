import { useEffect, useState } from 'react';
import { simulateCoinbaseSpot, xamanResearchEntryModel } from '../../research/xamanOmniResearchMode';

type Readiness = {
  xamanApiKeyConfigured?: boolean;
  xamanApiSecretConfigured?: boolean;
  unconfigured?: string[];
};

const entry = xamanResearchEntryModel();

function presenceLabel(value: boolean | null) {
  if (value === null) return 'Not checked';
  return value ? 'Present' : 'Not set';
}

export function XamanXApp() {
  const [readiness, setReadiness] = useState<Readiness | null>(null);
  const [checkState, setCheckState] = useState<'idle' | 'checking' | 'ready' | 'unreachable'>('idle');
  const [productId, setProductId] = useState<'BTC-USD' | 'XRP-USD'>('BTC-USD');
  const [profitInput, setProfitInput] = useState('');
  const [simulationText, setSimulationText] = useState('No simulation run yet.');

  useEffect(() => {
    let cancelled = false;
    setCheckState('checking');
    fetch('/api/xaman/readiness', { headers: { Accept: 'application/json' } })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setReadiness(data.readiness ?? null);
        setCheckState('ready');
      })
      .catch(() => {
        if (cancelled) return;
        setReadiness(null);
        setCheckState('unreachable');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const runSimulation = () => {
    const netProfitUsd = profitInput.trim() === '' ? undefined : Number(profitInput);
    const result = simulateCoinbaseSpot({
      productId,
      netProfitUsd: profitInput.trim() === '' ? undefined : netProfitUsd,
    });
    const profit = result.netProfitUsd === null ? 'unknown' : String(result.netProfitUsd);
    setSimulationText(
      `${result.venue} ${result.market} ${result.productId ?? 'unknown'}: ${result.status}. Profit ${profit}. No order was sent.`,
    );
  };

  const keyState = checkState === 'ready' ? Boolean(readiness?.xamanApiKeyConfigured) : null;
  const secretState = checkState === 'ready' ? Boolean(readiness?.xamanApiSecretConfigured) : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-cyan-300">Research / simulation</p>
          <h1 className="text-3xl font-bold text-white">{entry.title}</h1>
          <p className="text-slate-300">
            The OmniCyberDex XRPL app key stays in the server environment. This screen shows where it belongs and what already runs without the secret.
          </p>
        </header>

        <section className="rounded-xl border border-cyan-800 bg-slate-900 p-5 space-y-3">
          <h2 className="text-lg font-semibold text-white">Where XAMAN_API_KEY belongs</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div>
              <dt className="text-slate-400">File</dt>
              <dd className="font-mono text-cyan-200">{entry.setup.pathRelativeToRepoRoot}</dd>
            </div>
            <div>
              <dt className="text-slate-400">Folder</dt>
              <dd>{entry.setup.directory}</dd>
            </div>
            <div>
              <dt className="text-slate-400">Loader</dt>
              <dd>{entry.setup.loader}</dd>
            </div>
          </dl>
          <pre className="overflow-x-auto rounded-lg bg-slate-950 p-3 text-sm text-cyan-100">{`XAMAN_API_KEY=
XAMAN_API_SECRET=`}</pre>
          <p className="text-sm text-slate-300">
            Put the OmniCyberDex XRPL app key in <span className="font-mono">XAMAN_API_KEY</span>. Leave <span className="font-mono">XAMAN_API_SECRET</span> empty if you only want the simulation features. Restart the Node process after saving. {entry.setup.reload}
          </p>
          <p className="text-sm text-slate-400">
            Reader: <span className="font-mono">{entry.setup.consumer}</span>. Check: <span className="font-mono">{entry.setup.presenceEndpoint}</span>.
          </p>
        </section>

        <section className="rounded-xl border border-slate-700 bg-slate-900 p-5 space-y-3">
          <h2 className="text-lg font-semibold text-white">Server presence</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border border-slate-800 p-3">
              <div className="text-slate-400">XAMAN_API_KEY</div>
              <div className="text-xl font-semibold">{presenceLabel(keyState)}</div>
            </div>
            <div className="rounded-lg border border-slate-800 p-3">
              <div className="text-slate-400">XAMAN_API_SECRET</div>
              <div className="text-xl font-semibold">{presenceLabel(secretState)}</div>
            </div>
          </div>
          <p className="text-sm text-slate-400">
            {checkState === 'unreachable'
              ? 'The readiness endpoint did not respond, so presence is unknown. The file location above is still the setup destination.'
              : 'The values themselves are not loaded into this page.'}
          </p>
          {readiness && (
            <ul className="text-sm text-slate-300 list-disc pl-5 space-y-1">
              {readiness.unconfigured.slice(0, 4).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-slate-700 bg-slate-900 p-5 space-y-3">
          <h2 className="text-lg font-semibold text-white">Works without API_SECRET</h2>
          <ul className="text-sm text-slate-300 list-disc pl-5 space-y-1">
            <li>This setup page and GET /api/xaman/readiness</li>
            <li>GET /api/omnicyberdex/status, /engines, and /api/orchestrator/status</li>
            <li>Coinbase Advanced spot research for BTC-USD and XRP-USD</li>
          </ul>
          <div className="flex flex-wrap gap-2 items-end">
            <label className="text-sm text-slate-300">
              Product
              <select
                className="mt-1 block bg-slate-950 border border-slate-700 rounded px-2 py-1"
                value={productId}
                onChange={(event) => setProductId(event.target.value as 'BTC-USD' | 'XRP-USD')}
              >
                <option value="BTC-USD">BTC-USD</option>
                <option value="XRP-USD">XRP-USD</option>
              </select>
            </label>
            <label className="text-sm text-slate-300">
              Reported profit (blank = unknown)
              <input
                className="mt-1 block bg-slate-950 border border-slate-700 rounded px-2 py-1 w-40"
                value={profitInput}
                onChange={(event) => setProfitInput(event.target.value)}
                placeholder="unknown"
              />
            </label>
            <button
              type="button"
              className="bg-cyan-600 hover:bg-cyan-500 text-white rounded px-3 py-2 text-sm"
              onClick={runSimulation}
            >
              Run local simulation
            </button>
          </div>
          <p className="text-sm text-cyan-100">{simulationText}</p>
          <p className="text-xs text-slate-500">
            Proposed name only: {entry.proposedAcademyName}. The CyberGym catalog was not renamed.
          </p>
        </section>
      </div>
    </div>
  );
}

export default XamanXApp;
