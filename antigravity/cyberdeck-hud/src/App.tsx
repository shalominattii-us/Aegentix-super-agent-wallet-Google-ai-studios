import React, { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('status');
  const [command, setCommand] = useState('');

  return (
    <div style={{
      backgroundColor: '#05070f', color: '#00f0ff', minHeight: '100vh',
      fontFamily: 'Consolas, Courier, monospace', padding: '20px',
      border: '2px solid #ff0055', boxShadow: '0 0 15px rgba(255, 0, 85, 0.3)'
    }}>
      {/* HUD Header Matrix */}
      <header style={{
        borderBottom: '2px dashed #00f0ff', paddingBottom: '10px', marginBottom: '20px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, textShadow: '0 0 10px #00f0ff', color: '#ffffff' }}>
          ☤ AEGENTIX LIQUID CYBERDECK // MK-VI
        </h1>
        <div style={{ color: '#ff0055', fontWeight: 'bold' }}>GRID PROTOCOL: ACTIVE</div>
      </header>

      {/* Primary Subnet Navigation */}
      <nav style={{ marginBottom: '25px', display: 'flex', gap: '10px' }}>
        {['status', 'terminal', 'mesh'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: activeTab === tab ? '#00f0ff' : 'transparent',
              color: activeTab === tab ? '#05070f' : '#00f0ff',
              border: '1px solid #00f0ff', padding: '10px 20px', cursor: 'pointer',
              fontWeight: 'bold', textTransform: 'uppercase', transition: 'all 0.2s'
            }}
          >
            {tab} matrix
          </button>
        ))}
      </nav>

      {/* Tab Context Render Panes */}
      {activeTab === 'status' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ border: '1px solid #ff0055', padding: '15px', background: 'rgba(255,0,85,0.05)' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#ff0055' }}>[ SYSTEM RUNTIME TELEMETRY ]</h3>
            <p>• <b>JARVIS CORE 8081:</b> <span style={{color: '#00ff66'}}>ONLINE (SAPI CONF)</span></p>
            <p>• <b>HERMES HUB 9119:</b> <span style={{color: '#00ff66'}}>ACTIVE (V_45 REWRITTEN)</span></p>
            <p>• <b>VOICE SPEED LAYER:</b> NOMINAL (-20% PROFILED)</p>
          </div>
          <div style={{ border: '1px solid #00f0ff', padding: '15px', background: 'rgba(0,240,255,0.05)' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#00f0ff' }}>[ ACTIVE MESH DAEMON ]</h3>
            <p>• <b>BACKING ENGINE:</b> Liquid Mesh Sub-layer Router</p>
            <p>• <b>INFERENCE PROFILE:</b> Nous / Solar Pro4 Free Tier</p>
            <p>• <b>STATUS:</b> Syncing background telemetry nodes</p>
          </div>
        </div>
      )}

      {activeTab === 'terminal' && (
        <div style={{ border: '1px solid #00f0ff', padding: '15px', background: '#000000' }}>
          <div style={{ height: '200px', overflowY: 'auto', marginBottom: '15px', color: '#ffffff' }}>
            <p style={{color: '#888888'}}>[2026-09-20 14:38] Aegentix Liquid Mesh core handshake complete.</p>
            <p style={{color: '#888888'}}>[2026-09-20 14:39] Port 9119 JSON-RPC system streams listening.</p>
            <p style={{color: '#00ff66'}}>&gt; Ready for local command injection input, Sir.</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <span style={{ color: '#ff0055', alignSelf: 'center', fontWeight: 'bold' }}>(aegentix) $</span>
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="Inject command sequence (e.g., cyber-status, mesh)..."
              style={{
                flexGrow: 1, background: 'transparent', border: '1px solid #00f0ff',
                color: '#ffffff', padding: '8px', fontFamily: 'monospace'
              }}
            />
          </div>
        </div>
      )}

      {activeTab === 'mesh' && (
        <div style={{ border: '1px solid #ff0055', padding: '20px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 15px 0' }}>[ MULTI-AGENT MESH MAPPER ]</h3>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', alignItems: 'center' }}>
            <div style={{ border: '1px solid #00f0ff', padding: '10px', borderRadius: '4px' }}>MIC PROTOCOL (5)</div>
            <div style={{ color: '#ff0055' }}>➔</div>
            <div style={{ border: '1px solid #00f0ff', padding: '10px', borderRadius: '4px' }}>JARVIS PORT 8081</div>
            <div style={{ color: '#ff0055' }}>➔</div>
            <div style={{ border: '1px solid #00f0ff', padding: '10px', borderRadius: '4px' }}>HERMES GATEWAY</div>
          </div>
        </div>
      )}
    </div>
  );
}
