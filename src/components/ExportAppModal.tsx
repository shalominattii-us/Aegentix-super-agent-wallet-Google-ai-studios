import React, { useState } from 'react';
import {
  Download,
  Github,
  Terminal,
  FolderArchive,
  Check,
  Copy,
  ExternalLink,
  Layers,
  Sparkles,
  Shield,
  FileCode,
  HardDrive
} from 'lucide-react';

interface ExportAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenGitHubForge?: () => void;
}

export const ExportAppModal: React.FC<ExportAppModalProps> = ({
  isOpen,
  onClose,
  onOpenGitHubForge
}) => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2500);
  };

  const handleDownloadTarball = () => {
    setIsDownloading(true);
    const link = document.createElement('a');
    link.href = '/api/export-bundle';
    link.download = 'aegentix-aistudio-bundle.tar.gz';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setIsDownloading(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 font-mono animate-in fade-in">
      <div className="bg-[#0B0F17] border-2 border-cyan-500/50 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative text-slate-200 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-cyan-500/30 pb-4 mb-5">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
            <Download className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-white uppercase tracking-wider">
                Export &amp; Download Application
              </h2>
              <span className="px-2 py-0.5 rounded text-[9px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                READY
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Export the full codebase, dependencies, and server runtime for local execution or cloud deployment.
            </p>
          </div>
        </div>

        {/* Export Options Grid */}
        <div className="space-y-4">
          {/* Method 1: Instant Tarball Download */}
          <div className="p-4 bg-slate-900/90 border border-cyan-500/40 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
            <div className="space-y-1">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <FolderArchive className="w-4 h-4 text-cyan-400" />
                <span>1. One-Click Project Source Archive (.tar.gz)</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Downloads the complete codebase (frontend, Express server, models, styling) sanitized without node_modules.
              </p>
            </div>
            <button
              onClick={handleDownloadTarball}
              disabled={isDownloading}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-lg shadow-lg flex items-center gap-2 shrink-0 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'Packaging...' : 'Download Code (.tar.gz)'}</span>
            </button>
          </div>

          {/* Method 2: Google AI Studio Platform Export */}
          <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl space-y-2">
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-emerald-400" />
              <span>2. Google AI Studio Top Navigation Export</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              In the outer Google AI Studio header (outside the preview frame):
            </p>
            <ol className="list-decimal list-inside text-xs text-slate-300 space-y-1 pl-1">
              <li>Look at the top-right toolbar in your browser tab.</li>
              <li>Click the <b className="text-cyan-300">&ldquo;Export&rdquo;</b> button or the <b className="text-cyan-300">Share / Three Dots (&vellip;)</b> icon.</li>
              <li>Select <b className="text-white">&ldquo;Export to GitHub&rdquo;</b> to push to your repository or <b className="text-white">&ldquo;Download ZIP&rdquo;</b> to save locally.</li>
            </ol>
          </div>

          {/* Method 3: Sovereign GitHub Forge Suite */}
          <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <Github className="w-4 h-4 text-purple-400" />
                <span>3. Built-In GitHub Forge &amp; Remote Mirror</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Use the in-app Sovereign GitHub Forge Suite to reconcile merge conflicts and push overseas.
              </p>
            </div>
            {onOpenGitHubForge && (
              <button
                onClick={() => {
                  onClose();
                  onOpenGitHubForge();
                }}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/40 rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Open GitHub Forge</span>
              </button>
            )}
          </div>

          {/* Method 4: How to Run Locally */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Local Setup Commands (Terminal / PowerShell)</span>
              </span>
              <button
                onClick={() =>
                  copyToClipboard(
                    `tar -xzf aegentix-aistudio-bundle.tar.gz\nnpm install\ncp .env.example .env\nnpm run dev`,
                    'all-cmds'
                  )
                }
                className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                {copiedCmd === 'all-cmds' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCmd === 'all-cmds' ? 'Copied All!' : 'Copy Script'}</span>
              </button>
            </div>

            <div className="p-2.5 bg-black/60 rounded-lg border border-slate-800 text-[11px] text-cyan-300 font-mono space-y-1">
              <div><span className="text-slate-500"># 1. Unpack archive</span></div>
              <div className="text-white select-all">tar -xzf aegentix-aistudio-bundle.tar.gz</div>
              <div><span className="text-slate-500"># 2. Install dependencies</span></div>
              <div className="text-white select-all">npm install</div>
              <div><span className="text-slate-500"># 3. Configure environment</span></div>
              <div className="text-white select-all">cp .env.example .env</div>
              <div><span className="text-slate-500"># 4. Start local development server (Port 3000)</span></div>
              <div className="text-emerald-300 select-all font-bold">npm run dev</div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>PORT 3000 &middot; REACT 19 &middot; VITE &middot; NODE EXPRESS</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
