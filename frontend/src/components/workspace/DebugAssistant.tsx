import React, { useState } from 'react';
import { Bug, Search, User, Flag, Terminal, Eye, Globe, RefreshCw } from 'lucide-react';
import { useWorkspace } from '../../store/useWorkspace';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Group,
  Panel,
  Separator,
} from 'react-resizable-panels';

const DebugAssistant: React.FC = () => {
  const [filterText, setFilterText] = useState('');
  const [activeToolIdx, setActiveToolIdx] = useState(0);
  const { steps, currentStep, language, setLanguage } = useWorkspace();
  const step = steps[currentStep] || steps[0];

  const filteredVars = step.variables.filter((v) =>
    v.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const tools = [
    { icon: Bug, label: 'Inspect' },
    { icon: Flag, label: 'Breakpoint' },
    { icon: User, label: 'Watch' },
    { icon: Eye, label: 'Trace' },
  ];

  const langs: { id: 'python' | 'javascript' | 'cpp' | 'java'; name: string; ext: string }[] = [
    { id: 'python', name: 'Python', ext: '.py' },
    { id: 'javascript', name: 'Node.js', ext: '.js' },
    { id: 'cpp', name: 'C++', ext: '.cpp' },
    { id: 'java', name: 'Java', ext: '.java' },
  ];

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{
        background: '#1E1D27',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.05)',
        minWidth: 0,
        minHeight: 0,
      }}
    >
      {/* ── Header ─ */}
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-white/[0.04] shrink-0">
        <div
          className="w-6 h-6 rounded-md flex items-center justify-center"
          style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)' }}
        >
          <Bug size={13} className="text-[#A78BFA]" />
        </div>
        <span className="text-[13px] font-bold text-[#F5F5F7]">Debugging Assistant</span>
      </div>

      {/* ── Vertically Resizable: Live Variables (top) / Language Selector (bottom) ── */}
      <Group
        id="debug-vertical"
        orientation="vertical"
        className="flex-1"
        style={{ minWidth: 0, minHeight: 0 }}
      >
        {/* Top Panel: Debug Variables */}
        <Panel
          id="debug-variables"
          defaultSize={60}
          minSize={30}
        >
          <div className="flex flex-col h-full p-4" style={{ minWidth: 0, minHeight: 0 }}>
            {/* Debug Action Bar */}
            <div className="flex items-center gap-2 p-1.5 rounded-xl border border-white/[0.04] bg-[#14131A] justify-between shrink-0">
              <div className="flex gap-1">
                {tools.map((tool, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveToolIdx(idx)}
                    className={`relative p-1.5 rounded-lg transition-all duration-150 active:scale-95 ${
                      activeToolIdx === idx
                        ? 'text-[#A78BFA] bg-violet-500/10'
                        : 'text-[#8B8A99] hover:text-[#A78BFA] hover:bg-violet-500/5'
                    }`}
                    title={tool.label}
                  >
                    <tool.icon size={13} />
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-[#6B6A78] font-bold uppercase tracking-wider pr-1 flex items-center gap-1">
                <Terminal size={10} /> {tools[activeToolIdx].label}
              </span>
            </div>

            {/* Search Bar */}
            <div className="relative mt-3 shrink-0">
              <input
                type="text"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="Search variables or breakpoints..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-white/[0.06] bg-[#14131A] text-[11.5px] text-[#F5F5F7] focus:outline-none focus:border-violet-500/30 transition-all placeholder-[#6B6A78]"
              />
              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6A78]" />
            </div>

            {/* In-Scope Variables watch list — SCROLLABLE */}
            <div className="flex-1 flex flex-col gap-2 overflow-y-auto overflow-x-hidden mt-3" style={{ minHeight: 0 }}>
              <AnimatePresence mode="popLayout">
                {filteredVars.length > 0 ? (
                  filteredVars.map((v) => (
                    <motion.div
                      key={v.name}
                      layout
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center justify-between px-3 py-2 rounded-xl border border-white/[0.03] bg-[#14131A]/60 hover:border-white/[0.06] transition-colors"
                    >
                      <span className="font-mono text-[11.5px] font-bold text-[#A78BFA]">{v.name}</span>
                      <motion.span
                        key={`${v.name}-${v.val}`}
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ duration: 0.25 }}
                        className="font-mono text-[11.5px] font-bold text-[#34D399] bg-[#34D399]/5 px-2 py-0.5 rounded border border-[#34D399]/10"
                      >
                        {v.val}
                      </motion.span>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-[11px] text-[#6B6A78] italic text-center py-2">
                    {filterText ? 'No variables match filter.' : 'No variables in current step.'}
                  </p>
                )}
              </AnimatePresence>
            </div>

            {/* Step indicator */}
            <div className="text-[9.5px] text-[#6B6A78] font-mono text-center border-t border-white/[0.03] pt-2 mt-auto shrink-0">
              Inspecting step <span className="text-[#A78BFA] font-bold">{currentStep + 1}</span> of {steps.length}
            </div>
          </div>
        </Panel>

        <Separator className="hover:bg-[#8B5CF6]/30 transition-colors cursor-row-resize group">
          <div className="h-0.5 w-8 rounded-full bg-[#6B6A78]/30 group-hover:bg-[#8B5CF6]/50 my-auto mx-auto transition-colors" />
        </Separator>

        {/* Bottom Panel: Language Selector */}
        <Panel
          id="debug-language"
          defaultSize={40}
          minSize={20}
        >
          <div className="flex flex-col h-full p-4" style={{ minWidth: 0, minHeight: 0 }}>
            {/* Header */}
            <div className="flex items-center gap-2.5 mb-3 shrink-0">
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center"
                style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)' }}
              >
                <Globe size={13} className="text-[#34D399]" />
              </div>
              <span className="text-[13px] font-bold text-[#F5F5F7]">Language Selector</span>
            </div>

            {/* Caption */}
            <div className="flex items-center justify-between mb-3 shrink-0">
              <span className="text-[10px] text-[#6B6A78] font-bold uppercase tracking-wider">
                Multi-Language Support
              </span>
              <span className="text-[10.5px] text-[#8B8A99] italic flex items-center gap-1">
                <RefreshCw size={9} className="animate-spin" style={{ animationDuration: '4s' }} />
                Same logic, new syntax
              </span>
            </div>

            {/* Pills Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {langs.map((lang) => {
                const isActive = language === lang.id;
                return (
                  <button
                    key={lang.id}
                    onClick={() => setLanguage(lang.id)}
                    className="flex flex-col items-start px-3.5 py-2.5 rounded-xl border transition-all duration-150 active:scale-95 text-left"
                    style={{
                      background: isActive ? 'rgba(139,92,246,0.1)' : '#14131A',
                      borderColor: isActive ? '#A78BFA' : 'rgba(255,255,255,0.04)',
                    }}
                  >
                    <span
                      className="text-[12px] font-bold transition-colors"
                      style={{ color: isActive ? '#F5F5F7' : '#8B8A99' }}
                    >
                      {lang.name}
                    </span>
                    <span className="text-[9px] font-mono text-[#6B6A78] mt-0.5">
                      {lang.ext}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </Panel>
      </Group>
    </div>
  );
};

export default DebugAssistant;
