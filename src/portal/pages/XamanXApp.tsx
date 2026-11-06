import { useEffect, useState } from 'react';
import { AlertTriangle, Lock, Shield } from 'lucide-react';
import {
  EMBEDDED_XAMAN_STATIC_SNAPSHOT,
  RESEARCH_SWARM_ROLES,
  RETIRED_PORTAL_HEADLINE,
  SAMPLE_PROJECTED_YIELD,
  classifyOmniExecuteStub,
  classifySeededClaim,
  runEvidenceLabelingDrill,
  type ResearchStatus,
  type SpotWorksheet,
} from '../../research/xamanOmniResearch';

interface AttemptState {
  label: string;
  httpStatus: number | null;
  body: string;
}

const seeded = classifySeededClaim({ id: 'RECON_1', status: 'VERIFIED' });
const synthetic = classifyOmniExecuteStub();
const localDrill = runEvidenceLabelingDrill();

export function XamanXApp() {
  const [serverStatus, setServerStatus] = useState<ResearchStatus | null>(null);
  const [serverNote, setServerNote] = useState('Loading research status from this server.');
  const [worksheet, setWorksheet] = useState<SpotWorksheet | null>(null);
  const [attempt, setAttempt] = useState<AttemptState | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/xaman/research-status')
      .then(async (res) => {
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setServerNote(`Research status returned HTTP ${res.status}.`);
          return;
        }
        setServerStatus(data);
        setServerNote('Status is from this server. Credential values are not included.');
      })
      .catch(() => {
        if (!cancelled) setServerNote('This server did not return research status. Local drill results are still shown.');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const runWorksheet = async (product: 'BTC-USD' | 'XRP-USD') => {
    setWorksheet(null);
    const res = await fetch('/api/xaman/research/spot-simulation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product, side: 'buy', quoteSize: 100 }),
    });
    const data = await res.json();
    if (res.ok && data.success) setWorksheet(data as SpotWorksheet);
    else setAttempt({ label: `${product} worksheet`, httpStatus: res.status, body: JSON.stringify(data, null, 2) });
  };

  const attemptBlocked = async (path: string, label: string) => {
    const res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pair: 'XRP-USD', quoteSize: 100, execute: true }),
    });
    const data = await res.json();
    setAttempt({ label, httpStatus: res.status, body: JSON.stringify(data, null, 2) });
  };

  return (
    <section className="rounded-2xl border border-cyan-800/50 bg-slate-950 text-slate-100 p-4 md:p-6 space-y-5">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="inline-flex items-center gap-1 rounded-full border border-cyan-500/40 bg-cyan-950/60 px-2 py-1 text-cyan-200">
            <Shield className="h-3.5 w-3.5" />
            RESEARCH_SIMULATION
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-950/40 px-2 py-1 text-amber-200">
            <Lock className="h-3.5 w-3.5" />
            Live execution false
          </span>
        </div>
        <h2 className="text-xl font-semibold text-white">Xaman research console</h2>
        <p className="text-sm text-slate-300 max-w-3xl">
          Companion view for OmniCyberDex. This milestone records readiness, labels evidence, and runs a Coinbase Advanced spot worksheet for BTC-USD and XRP-USD. It does not sign, submit, or move funds.
        </p>
        <p className="text-xs text-slate-400">{serverNote}</p>
      </header>

      <div className="grid gap-3 md:grid-cols-2">
        <article className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-2">
          <h3 className="text-sm font-semibold text-white">Integration readiness</h3>
          <ul className="space-y-2 text-xs">
            {(serverStatus?.readiness ?? []).map((item) => (
              <li key={item.id} className="border-b border-slate-800 pb-2">
                <div className="flex justify-between gap-3">
                  <span className="text-slate-200">{item.label}</span>
                  <span className="font-mono text-cyan-300">{item.state}</span>
                </div>
                <p className="text-slate-400 mt-1">{item.detail}</p>
              </li>
            ))}
            {!serverStatus && <li className="text-slate-400">Server readiness appears after /api/xaman/research-status responds.</li>}
          </ul>
          {serverStatus && (
            <p className="text-xs text-slate-300">
              Xaman key configured: {String(serverStatus.credentialPresence.xummKeyConfigured)}. Secret configured: {String(serverStatus.credentialPresence.xummSecretConfigured)}. Signing permission: {String(serverStatus.signingPermission)}.
            </p>
          )}
        </article>

        <article className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-2">
          <h3 className="text-sm font-semibold text-white">Evidence labels</h3>
          <EvidenceRow title="Embedded Xaman snapshot" klass={EMBEDDED_XAMAN_STATIC_SNAPSHOT.evidenceClass} text={EMBEDDED_XAMAN_STATIC_SNAPSHOT.label} />
          <EvidenceRow title="Retired portal headline" klass={RETIRED_PORTAL_HEADLINE.evidenceClass} text={`${RETIRED_PORTAL_HEADLINE.label} Figure ${RETIRED_PORTAL_HEADLINE.value.portfolioUsd} is not a balance.`} />
          <EvidenceRow title="Projected yield" klass={SAMPLE_PROJECTED_YIELD.evidenceClass} text={SAMPLE_PROJECTED_YIELD.label} />
          <EvidenceRow title="Historical Omni fill stub" klass={synthetic.evidenceClass} text={synthetic.label} />
          <EvidenceRow title={`Seeded badge ${seeded.id}`} klass={seeded.evidenceClass} text={seeded.displayLabel} />
        </article>
      </div>

      <article className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-3">
        <h3 className="text-sm font-semibold text-white">Research swarm roles</h3>
        <div className="grid gap-2 md:grid-cols-2">
          {RESEARCH_SWARM_ROLES.map((role) => (
            <div key={role.id} className="rounded-lg border border-slate-800 p-3">
              <div className="text-xs font-mono text-cyan-300">{role.id}</div>
              <div className="text-sm text-white">{role.title}</div>
              <p className="text-xs text-slate-400 mt-1">{role.duty}</p>
              <p className="text-[11px] text-amber-200/90 mt-1">Does not authorize trading or signing.</p>
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-2">
        <h3 className="text-sm font-semibold text-white">Earned training evidence</h3>
        {localDrill.badge ? (
          <div className="text-sm text-slate-200 space-y-1">
            <p>
              <span className="font-mono text-emerald-300">{localDrill.badge.id}</span> {localDrill.badge.name} is earned by the local drill in this build.
            </p>
            <p className="text-xs text-slate-400">
              Evidence class {localDrill.badge.evidenceClass}, scope {localDrill.badge.observationScope}. Market observation: {String(localDrill.badge.marketObservation)}. External certification: {String(localDrill.badge.externalCertification)}. Trading authorization: {String(localDrill.badge.tradingAuthorization)}.
            </p>
          </div>
        ) : (
          <p className="text-sm text-amber-200">No badge is shown because the local evidence drill did not pass.</p>
        )}
        <ul className="text-xs text-slate-400 space-y-1">
          {localDrill.checks.map((check) => (
            <li key={check.id}>{check.pass ? 'pass' : 'fail'} · {check.id} · {check.detail}</li>
          ))}
        </ul>
      </article>

      <article className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-3">
        <h3 className="text-sm font-semibold text-white">Coinbase Advanced spot worksheet</h3>
        <p className="text-xs text-slate-400">BTC-USD and XRP-USD fixtures only. The result is not an order, a preview, or a fill. Spread cost does not establish an edge.</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="rounded-lg bg-slate-800 px-3 py-2 text-xs text-white" onClick={() => runWorksheet('BTC-USD')}>BTC-USD fixture</button>
          <button type="button" className="rounded-lg bg-slate-800 px-3 py-2 text-xs text-white" onClick={() => runWorksheet('XRP-USD')}>XRP-USD fixture</button>
          <button type="button" className="rounded-lg bg-rose-950 px-3 py-2 text-xs text-rose-100" onClick={() => attemptBlocked('/api/omnicyberdex/execute', 'OmniCyberDex execute')}>Request OmniCyberDex fill</button>
          <button type="button" className="rounded-lg bg-rose-950 px-3 py-2 text-xs text-rose-100" onClick={() => attemptBlocked('/api/xaman/create-payload', 'Xaman payload')}>Request Xaman payload</button>
        </div>
        {worksheet && (
          <div className="text-xs font-mono text-slate-300 space-y-1">
            <div>{worksheet.venue} {worksheet.product} {worksheet.side}</div>
            <div>Fixture {worksheet.fixture.evidenceClass} bid {worksheet.fixture.bid} ask {worksheet.fixture.ask}</div>
            <div>Spread cost estimate {worksheet.spreadCostEstimateUsd.toFixed(4)} USD · {worksheet.spreadCostEvidenceClass} · edge {String(worksheet.establishesEdge)}</div>
            <div>Fills {worksheet.fills.length} · order {String(worksheet.order)} · signed {String(worksheet.signed)}</div>
            <p className="text-slate-400">{worksheet.note}</p>
          </div>
        )}
        {attempt && (
          <div className="rounded-lg border border-amber-700/50 bg-amber-950/30 p-3 text-xs">
            <div className="flex items-center gap-2 text-amber-200">
              <AlertTriangle className="h-3.5 w-3.5" />
              {attempt.label} · HTTP {attempt.httpStatus}
            </div>
            <pre className="mt-2 overflow-x-auto text-slate-300">{attempt.body}</pre>
          </div>
        )}
      </article>
    </section>
  );
}

function EvidenceRow({ title, klass, text }: { title: string; klass: string; text: string }) {
  return (
    <div className="text-xs">
      <div className="flex justify-between gap-2">
        <span className="text-slate-200">{title}</span>
        <span className="font-mono text-amber-200">{klass}</span>
      </div>
      <p className="text-slate-400">{text}</p>
    </div>
  );
}

export default XamanXApp;
