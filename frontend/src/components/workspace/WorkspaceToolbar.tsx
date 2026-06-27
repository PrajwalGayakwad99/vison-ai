// ─── Workspace Toolbar ─────────────────────────────────────────────────────
// Horizontal toolbar at the top of the workspace with view-mode icon buttons
// and a collapsible Debugging Assistant drawer.

import React, { useState } from 'react';
import { useWorkspace } from '../../store/useWorkspace';
import type { LanguageId } from '../../store/useWorkspace';
import { LANGUAGE_DISPLAY } from '../../store/useWorkspace';
import {
  GitMerge,
  Layers,
  Database,
  Code2,
  CheckSquare,
  Bug,
  Search,
  X,
  Globe,
  RefreshCw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSelectorDropdown from './LanguageSelectorDropdown';

const WorkspaceToolbar: React.FC = () => {
  const {
    activeToolbarView,
    setActiveToolbarView,
    steps,
    currentStep,
    language,
    setLanguage,
  } = useWorkspace();

  const [debugSearch, setDebugSearch] = useState('');
  const [debugToolIdx, setDebugToolIdx] = useState(0);

  const step = steps[currentStep] || steps[0];
  const filteredVars = step.variables.filter((v) =>
    v.name.toLowerCase().includes(debugSearch.toLowerCase())
  );

  const debugTools = [
    { icon: Bug, label: 'Inspect' },
    { icon: X, label: 'Breakpoint' },
    { icon: Globe, label: 'Watch' },
    { icon: Layers, label: 'Trace' },
  ];

  const toolbarItems = [
    { id: 'flow' as const, icon: GitMerge, label: 'Algorithm Flow' },
    { id: 'memory' as const, icon: Layers, label: 'Memory & Stack' },
    { id: 'heap' as const, icon: Database, label: 'Heap & Data' },
    { id: 'compare' as const, icon: Code2, label: 'Compare' },
    { id: 'quiz' as const, icon: CheckSquare, label: 'Quiz' },
  ];

  const isDebugOpen = activeToolbarView === 'debug';
  const isViewOpen = toolbarItems.some((t) => t.id === activeToolbarView);
  const isOpen = isDebugOpen || isViewOpen;

  const handleToggle = (id: string) => {
    if (activeToolbarView === id) {
      setActiveToolbarView(null);
    } else {
      setActiveToolbarView(id as any);
      if (id === 'debug') setDebugSearch('');
    }
  };

  return (
    <div className="shrink-0 relative" style={{ minWidth: 0, overflow: 'visible' }}>
      {/* ─ Toolbar Row ─ */}
      <div
        className="flex items-center gap-1.5 px-4 py-2 glass-toolbar-row"
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          overflow: 'visible',
        }}
      >
        {/* View Mode Icons */}
        {toolbarItems.map((item) => {
          const isActive = activeToolbarView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleToggle(item.id)}
              className="relative p-2 rounded-xl transition-all duration-150 active:scale-95"
              style={{ color: isActive ? '#FFFFFF' : '#6B6A78' }}
              title={item.label}
            >
              {isActive && (
                <motion.div
                  layoutId="toolbar-active-pill"
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
                    boxShadow: '0 4px 12px rgba(139,92,246,0.3)',
                    zIndex: 0,
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10 block">
                <item.icon size={15} strokeWidth={isActive ? 2.5 : 2} />
              </span>
            </button>
          );
        })}

        {/* Separator */}
        <div className="w-px h-6 bg-white/[0.06] mx-1" />

        {/* Debug Button */}
        <button
          onClick={() => handleToggle('debug')}
          className="relative p-2 rounded-xl transition-all duration-150 active:scale-95"
          style={{ color: isDebugOpen ? '#EC4899' : '#6B6A78' }}
          title="Debugging Assistant"
        >
          {isDebugOpen && (
            <motion.div
              layoutId="toolbar-active-pill"
              className="absolute inset-0 rounded-xl"
              style={{
                background: 'rgba(236,72,153,0.15)',
                border: '1px solid rgba(236,72,153,0.3)',
                zIndex: 0,
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative z-10 block">
            <Bug size={15} strokeWidth={isDebugOpen ? 2.5 : 2} />
          </span>
        </button>

        {/* Separator */}
        <div className="w-px h-6 bg-white/[0.06] mx-1" />

        {/* Language Selector */}
        <LanguageSelectorDropdown language={language} onChange={setLanguage} />

        {/* Active view label — inline at right side */}
        <AnimatePresence>
          {isOpen && !isDebugOpen && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 text-[10.5px] text-[#8B8A99] font-bold uppercase tracking-wider"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-pulse" />
              {toolbarItems.find((t) => t.id === activeToolbarView)?.label} — Active View
            </motion.span>
          )}
        </AnimatePresence>

        {/* Spacer */}
        {!isOpen && <div className="flex-1" />}

        {/* Close button */}
        <AnimatePresence>
          {isOpen && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setActiveToolbarView(null)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-[#6B6A78] hover:text-[#F5F5F7] hover:bg-white/[0.03] transition-all"
            >
              <X size={11} />
              Close
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── Collapsible Drawer ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden glass-toolbar-drawer"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
          >
            {/* Debug Drawer */}
            {isDebugOpen && (
              <div className="flex gap-6 px-6 py-4">
                {/* Left: Debug Variables */}
                <div className="flex-1 flex flex-col gap-3">
                  <div className="flex items-center gap-2 p-1.5 rounded-xl border border-white/[0.04] bg-[#14131A]">
                    <div className="flex gap-1">
                      {debugTools.map((tool, idx) => (
                        <button
                          key={idx}
                          onClick={() => setDebugToolIdx(idx)}
                          className={`p-1.5 rounded-lg transition-all ${
                            debugToolIdx === idx
                              ? 'text-[#EC4899] bg-pink-500/10'
                              : 'text-[#6B6A78] hover:text-[#EC4899] hover:bg-pink-500/5'
                          }`}
                          title={tool.label}
                        >
                          <tool.icon size={13} />
                        </button>
                      ))}
                    </div>
                    <span className="text-[9px] text-[#6B6A78] font-bold uppercase tracking-wider ml-auto pr-1">
                      {debugTools[debugToolIdx].label}
                    </span>
                  </div>

                  <div className="relative">
                    <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6B6A78]" />
                    <input
                      type="text"
                      value={debugSearch}
                      onChange={(e) => setDebugSearch(e.target.value)}
                      placeholder="Search variables..."
                      className="w-full pl-7 pr-3 py-1.5 rounded-lg border border-white/[0.06] bg-[#14131A] text-[11px] text-[#F5F5F7] focus:outline-none focus:border-violet-500/30 placeholder-[#6B6A78]"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2 max-h-[100px] overflow-y-auto">
                    {filteredVars.map((v) => (
                      <div
                        key={v.name}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/[0.03] bg-[#14131A]"
                      >
                        <span className="text-[11px] font-mono font-bold text-[#A78BFA]">{v.name}</span>
                        <span className="text-[11px] font-mono font-bold text-[#34D399]">{v.val}</span>
                      </div>
                    ))}
                    {filteredVars.length === 0 && (
                      <p className="text-[10px] text-[#6B6A78] italic py-2">
                        {debugSearch ? 'No variables match.' : 'No variables in current step.'}
                      </p>
                    )}
                  </div>

                  <div className="text-[9px] text-[#6B6A78] font-mono text-center">
                    Inspecting step <span className="text-[#A78BFA] font-bold">{currentStep + 1}</span> of {steps.length}
                  </div>
                </div>

                {/* Right: Language Selector */}
                <div className="w-[220px] flex flex-col gap-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)' }}>
                      <Globe size={11} className="text-[#34D399]" />
                    </div>
                    <span className="text-[12px] font-bold text-[#F5F5F7]">Language Selector</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-[#6B6A78] font-bold uppercase tracking-wider">Multi-Language</span>
                    <span className="text-[9px] text-[#8B8A99] italic flex items-center gap-1">
                      <RefreshCw size={8} className="animate-spin" style={{ animationDuration: '4s' }} />
                      Same logic, new syntax
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(LANGUAGE_DISPLAY).map(([id, { name, ext }]) => {
                      const isActive = language === id;
                      return (
                        <button
                          key={id}
                          onClick={() => setLanguage(id as LanguageId)}
                          className="flex flex-col items-start px-3 py-2 rounded-xl border transition-all active:scale-95"
                          style={{
                            background: isActive ? 'rgba(139,92,246,0.1)' : '#14131A',
                            borderColor: isActive ? '#A78BFA' : 'rgba(255,255,255,0.04)',
                          }}
                        >
                          <span className="text-[11px] font-bold" style={{ color: isActive ? '#F5F5F7' : '#8B8A99' }}>
                            {name}
                          </span>
                          <span className="text-[8px] font-mono text-[#6B6A78] mt-0.5">{ext}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkspaceToolbar;
