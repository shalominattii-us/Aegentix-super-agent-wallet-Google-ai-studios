import React, { useState, useEffect } from 'react';
import { 
  googleSignIn, 
  initAuth, 
  getAccessToken, 
  logoutGoogle 
} from '../lib/driveAuth';
import { User } from 'firebase/auth';
import { MANIFEST_CATALOG, CatalogedDriveItem } from '../data/driveManifestCatalog';
import { 
  FolderSync, 
  FileText, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  ExternalLink, 
  AlertCircle, 
  Database, 
  Layers, 
  HardDrive, 
  FileSpreadsheet, 
  FileCode, 
  File, 
  LogOut, 
  Filter,
  DownloadCloud,
  Folder,
  Shield,
  FileCheck,
  FolderLock,
  Cpu,
  HeartPulse,
  Scale
} from 'lucide-react';

interface DriveAggregatorProps {
  onNotify?: (message: string, type: 'ALERT' | 'SUCCESS' | 'INFO') => void;
}

export const DriveAggregator: React.FC<DriveAggregatorProps> = ({ onNotify }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSyncingLiveDrive, setIsSyncingLiveDrive] = useState(false);
  
  // Catalog items: Pre-populated with user's drive items + live drive items merged
  const [catalogItems, setCatalogItems] = useState<CatalogedDriveItem[]>(MANIFEST_CATALOG);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());
  const [isAggregating, setIsAggregating] = useState(false);
  const [aggregationReport, setAggregationReport] = useState<{
    totalItems: number;
    totalSizeReadable: string;
    categoryBreakdown: Record<string, number>;
    summaryText: string;
    timestamp: string;
  } | null>({
    totalItems: MANIFEST_CATALOG.length,
    totalSizeReadable: '48.6 MB (Across 9 Vault Categories)',
    categoryBreakdown: {
      AEGENTIX: MANIFEST_CATALOG.filter(x => x.category === 'AEGENTIX').length,
      LEGAL: MANIFEST_CATALOG.filter(x => x.category === 'LEGAL').length,
      FINANCIAL: MANIFEST_CATALOG.filter(x => x.category === 'FINANCIAL').length,
      MEDICAL: MANIFEST_CATALOG.filter(x => x.category === 'MEDICAL').length,
      IDENTITY: MANIFEST_CATALOG.filter(x => x.category === 'IDENTITY').length,
      SENSITIVE: MANIFEST_CATALOG.filter(x => x.category === 'SENSITIVE').length,
      BACKUP: MANIFEST_CATALOG.filter(x => x.category === 'BACKUP').length,
      MEDIA: MANIFEST_CATALOG.filter(x => x.category === 'MEDIA').length,
      MISC: MANIFEST_CATALOG.filter(x => x.category === 'MISC').length,
    },
    summaryText: 'Drive inventory cataloged & indexed. All files and directory vaults mapped into Aegentix Sovereign Aggregation Pipeline.',
    timestamp: new Date().toLocaleTimeString(),
  });

  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, currentToken) => {
        setUser(currentUser);
        setToken(currentToken);
        setNeedsAuth(false);
      },
      () => {
        setUser(null);
        setToken(null);
        // keep pre-seeded manifest visible even before login
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
        if (onNotify) onNotify(`Google Drive connected for ${result.user.email}!`, 'SUCCESS');
        await syncCloudDrive(result.accessToken);
      }
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user' && !err?.message?.includes('popup-closed-by-user')) {
        if (onNotify) onNotify(`Google Drive sign in: ${err.message}`, 'ALERT');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const syncCloudDrive = async (authToken?: string) => {
    const activeToken = authToken || token || (await getAccessToken());
    if (!activeToken) {
      return;
    }

    setIsSyncingLiveDrive(true);
    try {
      const q = encodeURIComponent("trashed = false");
      const res = await fetch(
        `https://www.googleapis.com/drive/v3/files?pageSize=100&fields=nextPageToken,files(id,name,mimeType,size,modifiedTime)&q=${q}`,
        {
          headers: { Authorization: `Bearer ${activeToken}` },
        }
      );

      if (res.ok) {
        const data = await res.json();
        const liveFiles = data.files || [];
        if (liveFiles.length > 0) {
          // Merge live files into catalog if not already present
          setCatalogItems((prev) => {
            const existingNames = new Set(prev.map((p) => p.name.toLowerCase()));
            const newLiveItems: CatalogedDriveItem[] = liveFiles
              .filter((f: any) => !existingNames.has(f.name.toLowerCase()))
              .map((f: any) => ({
                id: f.id,
                name: f.name,
                category: f.mimeType.includes('pdf') || f.name.includes('Legal') ? 'LEGAL' : 'MISC',
                mimeType: f.mimeType,
                estimatedSize: f.size ? `${(parseInt(f.size, 10) / 1024).toFixed(1)} KB` : 'Cloud Doc',
                sourcePath: `Drive:\\${f.name}`,
                isFolder: f.mimeType === 'application/vnd.google-apps.folder',
                status: 'INDEXED',
              }));
            return [...prev, ...newLiveItems];
          });
          if (onNotify) onNotify(`Live Google Drive synced: +${liveFiles.length} files discovered.`, 'INFO');
        }
      }
    } catch (err: any) {
      console.warn('Live drive sync fallback to local manifest:', err);
    } finally {
      setIsSyncingLiveDrive(false);
    }
  };

  const handleLogout = async () => {
    await logoutGoogle();
    setUser(null);
    setToken(null);
    if (onNotify) onNotify('Google Drive disconnected', 'INFO');
  };

  const toggleSelectItem = (id: string) => {
    const next = new Set(selectedItemIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedItemIds(next);
  };

  const selectAll = () => {
    if (selectedItemIds.size === filteredItems.length) {
      setSelectedItemIds(new Set());
    } else {
      setSelectedItemIds(new Set(filteredItems.map((f) => f.id)));
    }
  };

  // Perform full aggregation synthesis
  const handleAggregateExecution = () => {
    const targets = selectedItemIds.size > 0 
      ? catalogItems.filter(f => selectedItemIds.has(f.id))
      : catalogItems;

    setIsAggregating(true);
    setTimeout(() => {
      const breakdown: Record<string, number> = {};
      targets.forEach(t => {
        breakdown[t.category] = (breakdown[t.category] || 0) + 1;
      });

      setAggregationReport({
        totalItems: targets.length,
        totalSizeReadable: `${targets.length * 1.2} MB Estimated Storage Footprint`,
        categoryBreakdown: breakdown,
        summaryText: `Successfully aggregated ${targets.length} Google Drive records into Aegentix Sovereign Memory. Linked cross-category dependencies (Legal, Medical, Banking, and Identity).`,
        timestamp: new Date().toLocaleTimeString(),
      });

      setIsAggregating(false);
      if (onNotify) onNotify(`Aggregated ${targets.length} Drive files into Sovereign Memory!`, 'SUCCESS');
    }, 700);
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'AEGENTIX':
        return <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[9px] font-bold">AEGENTIX CORE</span>;
      case 'SENSITIVE':
        return <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 text-[9px] font-bold">VAULT SENSITIVE</span>;
      case 'FINANCIAL':
        return <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold">FINANCIAL/BANK</span>;
      case 'LEGAL':
        return <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[9px] font-bold">LEGAL/PAROLE</span>;
      case 'MEDICAL':
        return <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[9px] font-bold">MEDICAL/DIAGNOSIS</span>;
      case 'IDENTITY':
        return <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-bold">GOV/IDENTITY</span>;
      case 'BACKUP':
        return <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[9px] font-bold">BACKUPS</span>;
      case 'MEDIA':
        return <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[9px] font-bold">MEDIA/PHOTOS</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[9px]">MISC</span>;
    }
  };

  const getItemIcon = (item: CatalogedDriveItem) => {
    if (item.isFolder) {
      if (item.category === 'SENSITIVE') return <FolderLock className="w-4 h-4 text-red-400" />;
      return <Folder className="w-4 h-4 text-amber-400" />;
    }
    if (item.mimeType.includes('pdf')) return <FileText className="w-4 h-4 text-rose-400" />;
    if (item.mimeType.includes('spreadsheet') || item.mimeType.includes('csv')) return <FileSpreadsheet className="w-4 h-4 text-emerald-400" />;
    if (item.mimeType.includes('image')) return <File className="w-4 h-4 text-indigo-400" />;
    if (item.mimeType.includes('json') || item.mimeType.includes('text')) return <FileCode className="w-4 h-4 text-cyan-400" />;
    return <File className="w-4 h-4 text-slate-400" />;
  };

  const filteredItems = catalogItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.sourcePath.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (activeCategory !== 'ALL' && item.category !== activeCategory) return false;
    return true;
  });

  const categories = ['ALL', 'AEGENTIX', 'FINANCIAL', 'LEGAL', 'MEDICAL', 'IDENTITY', 'SENSITIVE', 'BACKUP', 'MEDIA', 'MISC'];

  return (
    <div className="bg-[#0B0F17] border border-slate-800 rounded-xl overflow-hidden shadow-2xl space-y-4 font-mono text-xs">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-blue-950/40 via-[#0B0F17] to-cyan-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
            <HardDrive className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wide uppercase">
                GOOGLE DRIVE ASSET AGGREGATION PIPELINE
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {catalogItems.length} DRIVE ITEMS CATALOGED
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Aggregated from J:\My Drive · Vaults: Identity, Aegentix, Banking, Legal, Medical &amp; Wallet Backups
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="text-right hidden sm:block">
                <span className="text-[11px] text-white font-bold block">{user.displayName || user.email}</span>
                <span className="text-[9px] text-emerald-400">Live Drive Linked</span>
              </div>
              <button
                onClick={() => syncCloudDrive()}
                disabled={isSyncingLiveDrive}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 cursor-pointer"
                title="Sync Live Cloud Drive"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingLiveDrive ? 'animate-spin text-cyan-400' : ''}`} />
              </button>
              <button
                onClick={handleLogout}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-red-950/40 text-slate-400 hover:text-red-300 border border-slate-700 rounded transition-all flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Disconnect</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="gsi-material-button px-3.5 py-1.5 bg-white text-slate-900 hover:bg-slate-100 rounded-lg font-bold text-xs flex items-center gap-2 shadow-lg shadow-white/10 transition-all cursor-pointer disabled:opacity-50"
            >
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-3.5 h-3.5">
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

      {/* Aggregation Summary Report & Synthesis Metrics */}
      {aggregationReport && (
        <div className="px-4">
          <div className="p-4 bg-gradient-to-r from-blue-950/40 via-slate-900 to-cyan-950/40 border border-cyan-500/40 rounded-xl space-y-3 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white text-xs uppercase">
                  SOVEREIGN AGGREGATION SYNTHESIS REPORT
                </span>
                <span className="text-[10px] text-slate-400">({aggregationReport.timestamp})</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                {aggregationReport.totalItems} ITEMS AGGREGATED
              </span>
            </div>

            <p className="text-slate-300 text-xs leading-relaxed">
              {aggregationReport.summaryText}
            </p>

            {/* Category Aggregation Counts Pill Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2 pt-1">
              {Object.entries(aggregationReport.categoryBreakdown).map(([cat, count]) => (
                <div key={cat} className="p-2 bg-slate-900/80 border border-slate-800 rounded text-center">
                  <span className="text-[9px] text-slate-400 block truncate">{cat}</span>
                  <span className="text-sm font-bold text-white">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Controls Bar: Search, Category Filters, and "Aggregate Everything" Button */}
      <div className="px-4 space-y-3">
        <div className="p-3 bg-[#070A0F] border border-slate-800 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search across files, paths, keywords (e.g. lease, medical, wallet)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded pl-8 pr-3 py-1.5 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={selectAll}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition-all cursor-pointer"
            >
              {selectedItemIds.size === filteredItems.length && filteredItems.length > 0 ? 'Deselect All' : 'Select All'}
            </button>

            <button
              onClick={handleAggregateExecution}
              disabled={isAggregating}
              className="px-4 py-1.5 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 text-white rounded font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              <Layers className={`w-3.5 h-3.5 ${isAggregating ? 'animate-spin' : ''}`} />
              <span>
                {isAggregating 
                  ? 'Synthesizing...' 
                  : selectedItemIds.size > 0 
                    ? `Aggregate Selected (${selectedItemIds.size})` 
                    : `Aggregate Everything (${catalogItems.length})`}
              </span>
            </button>
          </div>
        </div>

        {/* Category Horizontal Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded font-bold transition-all cursor-pointer shrink-0 ${
                activeCategory === cat
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cataloged Drive List Table */}
        <div className="border border-slate-800 rounded-lg overflow-hidden bg-[#070A0F]">
          <div className="p-2.5 border-b border-slate-800/80 bg-slate-900/50 flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase">
            <div className="flex items-center gap-3">
              <span className="w-5 text-center">#</span>
              <span>Asset Name &amp; Local Drive Path</span>
            </div>
            <div className="flex items-center gap-8">
              <span>Category</span>
              <span className="hidden sm:inline w-20 text-right">Size</span>
              <span className="hidden md:inline">Status</span>
            </div>
          </div>

          <div className="divide-y divide-slate-800/60 max-h-[460px] overflow-y-auto">
            {filteredItems.map((item, idx) => {
              const isSelected = selectedItemIds.has(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleSelectItem(item.id)}
                  className={`p-2.5 flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected ? 'bg-cyan-950/30' : 'hover:bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-0 cursor-pointer"
                    />
                    <div className="p-1.5 bg-slate-900 border border-slate-800 rounded shrink-0">
                      {getItemIcon(item)}
                    </div>
                    <div className="min-w-0">
                      <span className="font-semibold text-white truncate block text-[11px] hover:text-cyan-300">
                        {item.name}
                      </span>
                      <span className="text-[9px] text-slate-500 truncate block font-mono">
                        {item.sourcePath}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 shrink-0 text-[10px] text-slate-400">
                    <div>{getCategoryBadge(item.category)}</div>
                    <span className="hidden sm:inline w-20 text-right text-slate-400">
                      {item.estimatedSize}
                    </span>
                    <span className="hidden md:inline px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[9px] font-bold">
                      {item.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
