import React, { useState, useMemo } from 'react';
import { 
  Folder, 
  FileCode, 
  Terminal, 
  Cpu, 
  Mic, 
  Brain, 
  Shield, 
  HardDrive, 
  Copy, 
  Check, 
  Search, 
  Play, 
  Sparkles, 
  ExternalLink,
  Code,
  Layers,
  FileText,
  Volume2
} from 'lucide-react';
import { 
  EAGLE_USER_BASE, 
  EAGLE_USER_PROFILE_CATALOG, 
  EagleProfileItem 
} from '../data/eagleUserProfileMap';

interface EagleUserProfileMapViewProps {
  onNotify?: (message: string, type: 'ALERT' | 'SUCCESS' | 'INFO') => void;
  onOpenMoEDefense?: () => void;
}

export const EagleUserProfileMapView: React.FC<EagleUserProfileMapViewProps> = ({ onNotify, onOpenMoEDefense }) => {
  const [selectedCategory, setSelectedCategory] = useState<
    'ALL' | 'RYZEN_DNA' | 'JARVIS_VOICE' | 'AI_INFERENCE' | 'AEGENTIX_SWARM' | 'PRODUCTION_SCRIPTS' | 'DOT_ENV_CONFIG' | 'SYSTEM_STORAGE'
  >('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<EagleProfileItem | null>(null);
  const [viewMarkdownModal, setViewMarkdownModal] = useState(false);
  const [executingName, setExecutingName] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPath(text);
    setTimeout(() => setCopiedPath(null), 2000);
    if (onNotify) onNotify(`Copied ${label}: ${text}`, 'SUCCESS');
  };

  const handleExecute = (item: EagleProfileItem) => {
    if (!item.quickCommand) {
      handleCopy(item.fullPath, 'Path');
      return;
    }
    setExecutingName(item.name);
    handleCopy(item.quickCommand, 'Command');
    setTimeout(() => {
      setExecutingName(null);
      if (onNotify) onNotify(`Dispatched command for ${item.name} to clipboard buffer.`, 'SUCCESS');
    }, 600);
  };

  const filteredItems = useMemo(() => {
    return EAGLE_USER_PROFILE_CATALOG.filter(item => {
      const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        item.name.toLowerCase().includes(q) ||
        item.fullPath.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.sizeOrDetails && item.sizeOrDetails.toLowerCase().includes(q)) ||
        item.category.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const categories = [
    { id: 'ALL', label: `All (${EAGLE_USER_PROFILE_CATALOG.length})`, icon: Folder },
    { id: 'RYZEN_DNA', label: `AMD Ryzen DNA (${EAGLE_USER_PROFILE_CATALOG.filter(i => i.category === 'RYZEN_DNA').length})`, icon: Cpu },
    { id: 'JARVIS_VOICE', label: `Jarvis & Voice (${EAGLE_USER_PROFILE_CATALOG.filter(i => i.category === 'JARVIS_VOICE').length})`, icon: Mic },
    { id: 'AI_INFERENCE', label: `AI & Model Hubs (${EAGLE_USER_PROFILE_CATALOG.filter(i => i.category === 'AI_INFERENCE').length})`, icon: Brain },
    { id: 'AEGENTIX_SWARM', label: `Aegentix Swarm (${EAGLE_USER_PROFILE_CATALOG.filter(i => i.category === 'AEGENTIX_SWARM').length})`, icon: Shield },
    { id: 'PRODUCTION_SCRIPTS', label: `Scripts & PowerShell (${EAGLE_USER_PROFILE_CATALOG.filter(i => i.category === 'PRODUCTION_SCRIPTS').length})`, icon: Terminal },
    { id: 'DOT_ENV_CONFIG', label: `Dot Runtimes & Configs (${EAGLE_USER_PROFILE_CATALOG.filter(i => i.category === 'DOT_ENV_CONFIG').length})`, icon: Code },
    { id: 'SYSTEM_STORAGE', label: `System & Storage (${EAGLE_USER_PROFILE_CATALOG.filter(i => i.category === 'SYSTEM_STORAGE').length})`, icon: HardDrive },
  ] as const;

  // Build Markdown representation of USER_PROFILE_MAP.md
  const generateMarkdownMap = () => {
    let md = `# USER_PROFILE_MAP.md\n`;
    md += `**Root Environment**: \`${EAGLE_USER_BASE}\`\n`;
    md += `**Total Indexed Artifacts**: ${EAGLE_USER_PROFILE_CATALOG.length}\n`;
    md += `**Attestation Status**: VERIFIED LOCAL WORKSTATION DEPLOYMENT\n\n`;

    const grouped: Record<string, EagleProfileItem[]> = {};
    for (const item of EAGLE_USER_PROFILE_CATALOG) {
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push(item);
    }

    for (const [cat, items] of Object.entries(grouped)) {
      md += `## ${cat.replace('_', ' ')} (${items.length} Items)\n\n`;
      md += `| Name | Type | Status | Path | Description |\n`;
      md += `| :--- | :--- | :--- | :--- | :--- |\n`;
      for (const it of items) {
        md += `| \`${it.name}\` | ${it.type} | **${it.status}** | \`${it.fullPath}\` | ${it.description} |\n`;
      }
      md += `\n`;
    }
    return md;
  };

  return (
    <div className="bg-[#0B0F17] border border-slate-800 rounded-xl overflow-hidden shadow-2xl space-y-4 font-mono text-xs">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-purple-950/40 via-[#0B0F17] to-cyan-950/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
            <Folder className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wide uppercase">
                USER PROFILE MAP &middot; C:\Users\eagle
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-black border flex items-center gap-1 bg-cyan-500/20 text-cyan-300 border-cyan-500/40">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                {EAGLE_USER_PROFILE_CATALOG.length} ARTIFACTS
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <code className="text-[11px] text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 font-mono select-all">
                {EAGLE_USER_BASE}
              </code>
              <button
                onClick={() => handleCopy(EAGLE_USER_BASE, 'Root Directory')}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-bold flex items-center gap-1 border border-slate-700 transition-colors cursor-pointer"
                title="Copy root directory path"
              >
                {copiedPath === EAGLE_USER_BASE ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedPath === EAGLE_USER_BASE ? 'Copied Root!' : 'Copy Root'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* View Markdown Map Modal Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setViewMarkdownModal(true)}
            className="px-3 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/40 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>View USER_PROFILE_MAP.md</span>
          </button>
        </div>
      </div>

      {/* Filter Category Pills & Search */}
      <div className="px-4 space-y-3">
        <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-lg font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search across 140+ files, scripts, audio models, RYZEN stages, dot configs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Grid of Profile Items */}
      <div className="px-4 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredItems.map((item) => {
            const isCopied = copiedPath === item.fullPath;
            const isRunning = executingName === item.name;

            return (
              <div
                key={item.fullPath}
                className="p-3 bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 rounded-xl space-y-2 transition-all flex flex-col justify-between group shadow-sm hover:shadow-cyan-500/5 cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {item.type === 'SCRIPT' ? (
                        <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : item.type === 'AUDIO' ? (
                        <Volume2 className="w-4 h-4 text-purple-400 shrink-0" />
                      ) : item.type === 'CONFIG' ? (
                        <Code className="w-4 h-4 text-cyan-400 shrink-0" />
                      ) : (
                        <Folder className="w-4 h-4 text-yellow-400 shrink-0" />
                      )}
                      <span className="font-bold text-white text-xs truncate max-w-[170px]" title={item.name}>
                        {item.name}
                      </span>
                    </div>

                    <span
                      className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider shrink-0 ${
                        item.status === 'CALIBRATED'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : item.status === 'ACTIVE'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : item.status === 'SYNTHESIZED'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-900 space-y-1.5" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono">
                    <span className="truncate max-w-[200px]" title={item.fullPath}>
                      {item.fullPath}
                    </span>
                    {item.sizeOrDetails && (
                      <span className="text-cyan-400/80 font-bold shrink-0">{item.sizeOrDetails}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.name === 'AgentsOfChaosMoE.ps1' && onOpenMoEDefense && (
                      <button
                        onClick={onOpenMoEDefense}
                        className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 border border-amber-500/40 text-[10px] font-black flex items-center gap-1 transition-all cursor-pointer shadow-xs shrink-0"
                        title="Open interactive Agents of Chaos MoE Defense Studio"
                      >
                        <Shield className="w-3 h-3 text-amber-400" />
                        <span>MoE Studio</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleCopy(item.fullPath, 'Path')}
                      className="flex-1 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      title="Copy full Windows path"
                    >
                      {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{isCopied ? 'Copied Path!' : 'Copy Path'}</span>
                    </button>

                    {item.quickCommand && (
                      <button
                        disabled={isRunning}
                        onClick={() => handleExecute(item)}
                        className="px-2.5 py-1 rounded bg-cyan-600/30 hover:bg-cyan-600 border border-cyan-500/40 text-cyan-200 hover:text-slate-950 font-bold text-[10px] flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50 shrink-0"
                        title={`Copy Launch Command: ${item.quickCommand}`}
                      >
                        <Play className={`w-2.5 h-2.5 ${isRunning ? 'animate-spin' : 'fill-current'}`} />
                        <span>{isRunning ? 'Copying...' : 'Launch Cmd'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0D121D] border border-cyan-500/40 rounded-xl p-5 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">{selectedItem.name}</h3>
                  <span className="text-[10px] text-cyan-400 font-mono">{selectedItem.category.replace('_', ' ')}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-white text-sm font-bold px-2 py-0.5 rounded bg-slate-800"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedItem.description}
            </p>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block">Absolute Full Path:</span>
                <code className="text-cyan-300 text-[11px] break-all select-all">{selectedItem.fullPath}</code>
              </div>

              {selectedItem.quickCommand && (
                <div className="p-2.5 bg-slate-950 rounded border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 block">Quick Launch Command:</span>
                  <code className="text-emerald-300 text-[11px] break-all select-all">{selectedItem.quickCommand}</code>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => handleCopy(selectedItem.fullPath, 'Path')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Path</span>
              </button>
              {selectedItem.name === 'AgentsOfChaosMoE.ps1' && onOpenMoEDefense && (
                <button
                  onClick={() => {
                    setSelectedItem(null);
                    onOpenMoEDefense();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Shield className="w-3.5 h-3.5 fill-current" />
                  <span>Open MoE Defense Studio</span>
                </button>
              )}
              {selectedItem.quickCommand && (
                <button
                  onClick={() => handleExecute(selectedItem)}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-black flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Copy Launch Command</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Full USER_PROFILE_MAP.md Markdown Modal */}
      {viewMarkdownModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0D121D] border border-purple-500/40 rounded-xl p-5 max-w-4xl w-full max-h-[85vh] flex flex-col space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-white text-sm uppercase">USER_PROFILE_MAP.md &middot; Full Manifest</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(generateMarkdownMap(), 'USER_PROFILE_MAP.md Markdown')}
                  className="px-3 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy Markdown</span>
                </button>
                <button
                  onClick={() => setViewMarkdownModal(false)}
                  className="text-slate-400 hover:text-white text-sm font-bold px-2 py-0.5 rounded bg-slate-800 cursor-pointer"
                >
                  &times;
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-300 font-mono whitespace-pre-wrap select-all">
              {generateMarkdownMap()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
