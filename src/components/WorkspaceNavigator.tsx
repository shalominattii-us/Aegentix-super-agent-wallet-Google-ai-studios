import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  SYSTEM_TOC_ITEMS,
  TocItem
} from './TableOfContentsModal';
import {
  Layers,
  Search,
  BookOpen,
  Maximize2,
  Minimize2,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Command,
  SlidersHorizontal,
  Compass,
  LayoutGrid,
  Columns
} from 'lucide-react';

export type PillarCategory = 
  | 'Core & Spatial'
  | 'Autonomous AI'
  | 'Trading & DEX'
  | 'Federal & Gov'
  | 'Security & Risk'
  | 'Workspace & Comms';

export const PILLAR_DEFINITIONS: Array<{
  category: PillarCategory;
  label: string;
  iconText: string;
  color: string;
  accentBorder: string;
  bgActive: string;
  textActive: string;
}> = [
  {
    category: 'Core & Spatial',
    label: 'Core & Spatial',
    iconText: '🚀',
    color: 'from-cyan-500/20 to-blue-500/20',
    accentBorder: 'border-cyan-500/40',
    bgActive: 'bg-cyan-500/20 text-cyan-300',
    textActive: 'text-cyan-400',
  },
  {
    category: 'Autonomous AI',
    label: 'Autonomous AI',
    iconText: '🤖',
    color: 'from-amber-500/20 to-orange-500/20',
    accentBorder: 'border-amber-500/40',
    bgActive: 'bg-amber-500/20 text-amber-300',
    textActive: 'text-amber-400',
  },
  {
    category: 'Trading & DEX',
    label: 'Trading & DEX',
    iconText: '📈',
    color: 'from-emerald-500/20 to-teal-500/20',
    accentBorder: 'border-emerald-500/40',
    bgActive: 'bg-emerald-500/20 text-emerald-300',
    textActive: 'text-emerald-400',
  },
  {
    category: 'Federal & Gov',
    label: 'Federal & Gov',
    iconText: '🏛️',
    color: 'from-indigo-500/20 to-purple-500/20',
    accentBorder: 'border-indigo-500/40',
    bgActive: 'bg-indigo-500/20 text-indigo-300',
    textActive: 'text-indigo-400',
  },
  {
    category: 'Security & Risk',
    label: 'Security & Risk',
    iconText: '🔒',
    color: 'from-rose-500/20 to-red-500/20',
    accentBorder: 'border-rose-500/40',
    bgActive: 'bg-rose-500/20 text-rose-300',
    textActive: 'text-rose-400',
  },
  {
    category: 'Workspace & Comms',
    label: 'Workspace & Comms',
    iconText: '🌐',
    color: 'from-purple-500/20 to-pink-500/20',
    accentBorder: 'border-purple-500/40',
    bgActive: 'bg-purple-500/20 text-purple-300',
    textActive: 'text-purple-400',
  },
];

interface WorkspaceNavigatorProps {
  activeTab: string;
  onSelectTab: (tabId: any) => void;
  onOpenTocModal: () => void;
  isExpandedCanvas: boolean;
  onToggleExpandedCanvas: () => void;
}

export const WorkspaceNavigator: React.FC<WorkspaceNavigatorProps> = ({
  activeTab,
  onSelectTab,
  onOpenTocModal,
  isExpandedCanvas,
  onToggleExpandedCanvas,
}) => {
  // Find current active item
  const currentItem = useMemo(() => {
    return SYSTEM_TOC_ITEMS.find((item) => item.id === activeTab) || SYSTEM_TOC_ITEMS[0];
  }, [activeTab]);

  // Selected category state (defaults to current item's category)
  const [selectedPillar, setSelectedPillar] = useState<PillarCategory>(currentItem.category);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Sync pillar when activeTab changes externally
  useEffect(() => {
    if (currentItem && currentItem.category !== selectedPillar) {
      setSelectedPillar(currentItem.category);
    }
  }, [currentItem.category]);

  // Modules belonging to currently selected pillar
  const pillarModules = useMemo(() => {
    return SYSTEM_TOC_ITEMS.filter((item) => item.category === selectedPillar);
  }, [selectedPillar]);

  // Search filter results across all 34 modules
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return SYSTEM_TOC_ITEMS.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.badge.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-3 sm:p-4 shadow-xl shadow-black/40 space-y-3 font-mono">
      {/* Level 1: Command Header & Breadcrumb Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        {/* Breadcrumb Info */}
        <div className="flex items-center gap-2 text-xs truncate">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 font-semibold shrink-0">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">WORKSPACE</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          <span className="text-slate-400 truncate">{currentItem.category}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          <span className="text-cyan-300 font-bold truncate flex items-center gap-1.5">
            {React.createElement(currentItem.icon, { className: 'w-3.5 h-3.5 text-cyan-400 shrink-0' })}
            <span className="truncate">{currentItem.name}</span>
          </span>
          <span className="px-1.5 py-0.2 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded text-[9px] font-bold shrink-0">
            {currentItem.badge}
          </span>
        </div>

        {/* Right Action Tools: Quick Jump, Layout Toggle, TOC Button */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          {/* Quick Jump Search Input */}
          <div className="relative" ref={searchContainerRef}>
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 absolute left-2.5 text-slate-500 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Jump to module..."
                value={searchQuery}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                className="w-36 sm:w-48 pl-8 pr-2 py-1 bg-slate-900/90 border border-slate-700/80 rounded text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:w-56 transition-all"
              />
            </div>

            {/* Jump Search Results Dropdown */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute right-0 top-full mt-1.5 w-72 sm:w-80 max-h-72 overflow-y-auto bg-[#0E131F] border border-cyan-500/40 rounded-lg shadow-2xl z-50 p-1.5 space-y-1">
                <div className="px-2 py-1 text-[10px] text-slate-400 uppercase font-bold border-b border-slate-800">
                  {searchResults.length} Subsystems Found
                </div>
                {searchResults.map((item) => {
                  const Icon = item.icon;
                  const isCur = item.id === activeTab;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectTab(item.id);
                        setSelectedPillar(item.category);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between text-xs transition-colors ${
                        isCur
                          ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <Icon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="truncate">{item.name}</span>
                      </div>
                      <span className="text-[9px] px-1 py-0.2 bg-slate-800 text-slate-400 rounded shrink-0">
                        {item.category.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Full-Width Canvas Focus Mode Toggle */}
          <button
            onClick={onToggleExpandedCanvas}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-all border ${
              isExpandedCanvas
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm shadow-cyan-500/20 font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700'
            }`}
            title={isExpandedCanvas ? 'Return to 3-column triage layout' : 'Expand active workspace to full screen width'}
          >
            {isExpandedCanvas ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden md:inline">Triage View</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden md:inline">Focus Canvas</span>
              </>
            )}
          </button>

          {/* Full Table of Contents Directory Launcher */}
          <button
            onClick={onOpenTocModal}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 hover:from-cyan-500/30 hover:to-indigo-500/30 text-cyan-300 border border-cyan-500/40 rounded text-xs font-semibold transition-all shadow-sm"
            title="Open Complete 34 Subsystems Table of Contents"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Index</span>
            <span className="px-1.5 py-0.2 bg-cyan-500/30 text-cyan-200 rounded text-[9px] font-bold">34</span>
          </button>
        </div>
      </div>

      {/* Level 2: Six Pillar Categories (Primary Functional Switcher) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        {PILLAR_DEFINITIONS.map((def) => {
          const isPillarSelected = selectedPillar === def.category;
          const isPillarActiveTab = currentItem.category === def.category;
          const count = SYSTEM_TOC_ITEMS.filter((i) => i.category === def.category).length;

          return (
            <button
              key={def.category}
              onClick={() => setSelectedPillar(def.category)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all border ${
                isPillarSelected
                  ? `${def.bgActive} ${def.accentBorder} shadow-sm shadow-cyan-500/10`
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border-slate-800/80'
              }`}
            >
              <span>{def.iconText}</span>
              <span>{def.label}</span>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                  isPillarSelected
                    ? 'bg-black/30 text-cyan-200'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {count}
              </span>
              {isPillarActiveTab && (
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping ml-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Level 3: Subsystem Modules for Selected Pillar (Clean 4-7 Module Grid/Bar) */}
      <div className="pt-2 border-t border-slate-800/60">
        <div className="flex items-center justify-between mb-2 text-[10px] text-slate-400 uppercase tracking-wider">
          <span className="flex items-center gap-1 font-bold">
            <LayoutGrid className="w-3 h-3 text-cyan-400" />
            <span>{selectedPillar} Subsystems ({pillarModules.length})</span>
          </span>
          <span className="text-slate-500 hidden sm:inline">
            Select a module to load its operational cockpit
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {pillarModules.map((item) => {
            const Icon = item.icon;
            const isTabActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`p-2 rounded-lg border text-left flex flex-col justify-between transition-all ${
                  isTabActive
                    ? 'bg-gradient-to-br from-cyan-950/60 to-slate-900 border-cyan-400/80 ring-1 ring-cyan-400/40 text-cyan-300 shadow-md shadow-cyan-500/10'
                    : 'bg-[#0E131F]/90 border-slate-800/90 text-slate-400 hover:text-slate-200 hover:border-slate-700 hover:bg-[#121928]'
                }`}
              >
                <div className="flex items-start justify-between gap-1 mb-1">
                  <div className={`p-1 rounded ${isTabActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className={`text-[8px] font-bold px-1 py-0.2 rounded truncate ${
                    isTabActive ? 'bg-cyan-500/30 text-cyan-200' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                </div>

                <div className="text-xs font-bold truncate leading-tight mt-1">
                  {item.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
