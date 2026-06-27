// ─── Language Selector Dropdown ─────────────────────────────────────────────
// Reusable dropdown for switching programming languages in the toolbar.
// Renders via portal at document body to avoid overflow clipping.

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown, Check } from 'lucide-react';
import type { LanguageId } from '../../store/useWorkspace';
import { LANGUAGE_DISPLAY } from '../../store/useWorkspace';

interface LanguageSelectorDropdownProps {
  language: LanguageId;
  onChange: (lang: LanguageId) => void;
  compact?: boolean;
}

const LANGUAGES: { id: LanguageId; name: string; emoji: string }[] = [
  { id: 'python', name: 'Python', emoji: '🐍' },
  { id: 'javascript', name: 'JavaScript', emoji: '🌐' },
  { id: 'typescript', name: 'TypeScript', emoji: '🔷' },
  { id: 'java', name: 'Java', emoji: '☕' },
  { id: 'cpp', name: 'C++', emoji: '⚙️' },
  { id: 'rust', name: 'Rust', emoji: '🦀' },
  { id: 'go', name: 'Go', emoji: '🐹' },
  { id: 'ruby', name: 'Ruby', emoji: '💎' },
  { id: 'php', name: 'PHP', emoji: '' },
  { id: 'csharp', name: 'C#', emoji: '🔵' },
];

const LanguageSelectorDropdown: React.FC<LanguageSelectorDropdownProps> = ({
  language,
  onChange,
  compact = false,
}) => {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click or Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent | KeyboardEvent) => {
      if (e.type === 'keydown' && (e as KeyboardEvent).key === 'Escape') {
        setOpen(false);
        return;
      }
      const inBtn = btnRef.current?.contains(e.target as Node);
      const inDropdown = dropdownRef.current?.contains(e.target as Node);
      if (!inBtn && !inDropdown) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', handler);
    };
  }, [open]);

  // Position dropdown below button (portal renders at body level)
  useEffect(() => {
    if (!open || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    dropdownRef.current?.style.setProperty('--dd-top', `${rect.bottom + 6}px`);
    dropdownRef.current?.style.setProperty('--dd-left', `${rect.left}px`);
  }, [open]);

  const selected = LANGUAGES.find((l) => l.id === language) ?? LANGUAGES[0];

  return (
    <>
      {/* Trigger button */}
      <button
        ref={btnRef}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-xl text-[12px] font-semibold transition-all duration-150 active:scale-95"
        style={{
          padding: compact ? '4px 8px' : '6px 10px',
          background: open ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.03)',
          border: `1px solid ${open ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.06)'}`,
          color: '#C4C3D0',
        }}
      >
        <Globe size={compact ? 11 : 13} className="text-[#34D399]" />
        <span className="hidden sm:inline">{selected.emoji} {selected.name}</span>
        <span className="sm:hidden">{selected.name}</span>
        <ChevronDown
          size={compact ? 10 : 12}
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown — rendered via portal at document body */}
      <AnimatePresence>
        {open &&
          createPortal(
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: -4, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.96 }}
              transition={{ duration: 0.12 }}
              className="fixed z-[9999] min-w-[220px] rounded-xl overflow-hidden"
              style={{
                top: 'var(--dd-top, 0px)',
                left: 'var(--dd-left, 0px)',
                background: '#1E1D27',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
              }}
            >
              {/* Header */}
              <div className="px-4 py-2.5 text-[9px] font-bold text-[#6B6A78] uppercase tracking-wider border-b border-white/[0.04] flex items-center justify-between">
                <span>Select Language</span>
                <span className="text-[#A78BFA]">{selected.name}</span>
              </div>

              {/* Language list */}
              {LANGUAGES.map((lang) => {
                const isActive = language === lang.id;
                const info = LANGUAGE_DISPLAY[lang.id];
                return (
                  <button
                    key={lang.id}
                    onClick={() => {
                      onChange(lang.id);
                      setOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] transition-all duration-100 group"
                    style={{
                      color: isActive ? '#F5F5F7' : '#C4C3D0',
                      background: isActive
                        ? 'rgba(139,92,246,0.12)'
                        : 'transparent',
                      borderLeft: isActive
                        ? '3px solid #7C3AED'
                        : '3px solid transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLButtonElement).style.background =
                          'rgba(124, 58, 237, 0.15)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLButtonElement).style.background =
                          'transparent';
                      }
                    }}
                  >
                    {/* Color dot */}
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ background: info.color }}
                    />
                    {/* Name */}
                    <span className="flex-1 text-left font-medium">
                      {lang.emoji} {lang.name}
                    </span>
                    {/* Extension */}
                    <span className="text-[10px] font-mono text-[#6B6A78] group-hover:text-[#8B8A99] transition-colors">
                      {info.ext}
                    </span>
                    {/* Check icon for active */}
                    {isActive && (
                      <Check size={14} className="text-[#A78BFA] shrink-0" />
                    )}
                  </button>
                );
              })}
            </motion.div>,
            document.body
          )}
      </AnimatePresence>
    </>
  );
};

export default LanguageSelectorDropdown;
