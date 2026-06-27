import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useWorkspace } from '../../store/useWorkspace';
import { LANGUAGE_TEMPLATES, LANGUAGE_DISPLAY, type LanguageId } from '../../store/useWorkspace';
import Editor from '@monaco-editor/react';
import { Play, Settings, RotateCcw, X, Plus, FileCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EditorPanel: React.FC = () => {
  const {
    runCode, steps, currentStep,
    files, activeFileId, language,
    setActiveFile, addFile, removeFile, updateFileCode,
  } = useWorkspace();

  const [showNewFilePicker, setShowNewFilePicker] = useState(false);
  const [showInlineName, setShowInlineName] = useState(false);
  const [newFileName, setNewFileName] = useState('');

  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const decorationsRef = useRef<string[]>([]);
  const pickerRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const activeTab = files.find((f) => f.id === activeFileId);
  const langKey = (activeTab?.language ?? 'python') as LanguageId;
  const config = LANGUAGE_DISPLAY[langKey] ?? LANGUAGE_DISPLAY.python;

  const step = steps[currentStep] || steps[0];
  const activeLine = step?.lines[activeTab?.language || 'python'] || 1;

  // Close picker on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) setShowNewFilePicker(false);
    };
    if (showNewFilePicker) {
      document.addEventListener('mousedown', handler);
      return () => document.removeEventListener('mousedown', handler);
    }
  }, [showNewFilePicker]);

  // Auto-focus name input
  useEffect(() => {
    if (showInlineName && nameInputRef.current) { nameInputRef.current.focus(); nameInputRef.current.select(); }
  }, [showInlineName]);

  const handleEditorMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    monaco.editor.defineTheme('axiom-dark', {
      base: 'vs-dark', inherit: true,
      rules: [
        { token: 'comment', foreground: '6B6A78', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'A78BFA' },
        { token: 'string', foreground: '34D399' },
        { token: 'number', foreground: 'EC4899' },
        { token: 'type', foreground: '8B5CF6' },
      ],
      colors: {
        'editor.background': '#14131A', 'editor.foreground': '#F5F5F7',
        'editor.lineHighlightBackground': '#1E1D2700', 'editor.selectionBackground': '#8B5CF630',
        'editor.inactiveSelectionBackground': '#8B5CF615', 'editorLineNumber.foreground': '#6B6A78',
        'editorLineNumber.activeForeground': '#A78BFA', 'editorGutter.background': '#14131A',
        'editorCursor.foreground': '#A78BFA', 'editor.selectionHighlightBackground': '#8B5CF620',
        'editorIndentGuide.background': '#ffffff08', 'editorIndentGuide.activeBackground': '#8B5CF630',
      },
    });
    monaco.editor.setTheme('axiom-dark');
  };

  useEffect(() => {
    if (editorRef.current && monacoRef.current && activeLine) {
      const monaco = monacoRef.current;
      decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, [
        { range: new monaco.Range(activeLine, 1, activeLine, 1), options: { isWholeLine: true, className: 'monaco-active-line-highlight', glyphMarginClassName: 'monaco-active-line-glyph' } },
      ]);
      editorRef.current.revealLineInCenterIfOutsideViewport(activeLine);
    }
  }, [activeLine, activeTab?.language]);

  const handleLangSwitch = useCallback((lang: string) => {
    const langId = lang as LanguageId;
    const existing = files.find((f) => f.language === langId);
    if (existing) {
      setActiveFile(existing.id);
    } else {
      const display = LANGUAGE_DISPLAY[langId] ?? LANGUAGE_DISPLAY.python;
      const newFile = { id: `lang-${lang}-${Date.now()}`, name: `fibonacci.${display.ext}`, language: langId, code: LANGUAGE_TEMPLATES[langId] ?? '' };
      addFile(newFile);
    }
    setShowNewFilePicker(false);
  }, [files, setActiveFile, addFile]);

  const handleInlineCreate = useCallback(() => {
    if (!newFileName.trim()) return;
    const name = newFileName.trim().includes('.') ? newFileName.trim() : `${newFileName.trim()}${config.ext}`;
    const lang = langKey;
    addFile({ id: String(Date.now()), name, language: lang, code: '' });
    setShowInlineName(false);
    setNewFileName('');
  }, [newFileName, config.ext, langKey, addFile]);

  return (
    <div className="flex flex-col h-full overflow-hidden glass-editor-panel" style={{ minWidth: 0, minHeight: 0 }}>
      <style>{`
        .blob-btn { position: relative; overflow: visible; z-index: 1; }
        .blob-btn::before {
          content: ''; position: absolute; inset: -3px; z-index: -1;
          background: linear-gradient(135deg, #8B5CF6, #EC4899, #A78BFA, #6366F1);
          background-size: 400% 400%;
          animation: blob-morph 6s ease infinite, blob-glow 3s ease-in-out infinite;
          border-radius: 14px; filter: blur(8px); opacity: 0.7;
        }
        .blob-btn::after {
          content: ''; position: absolute; inset: 0; z-index: -1;
          background: linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%); border-radius: 12px;
        }
        .blob-btn:hover::before { opacity: 1; filter: blur(10px); }
        @keyframes blob-morph {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          25% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          50% { border-radius: 50% 60% 30% 60% / 30% 50% 70% 50%; }
          75% { border-radius: 60% 40% 60% 30% / 70% 40% 50% 60%; }
        }
        @keyframes blob-glow { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        .monaco-active-line-highlight { background: rgba(139, 92, 246, 0.12) !important; border-left: 3px solid #8B5CF6 !important; }
        .monaco-active-line-glyph { background: transparent; margin-left: 2px; }
        .monaco-editor, .monaco-editor .margin { background-color: #14131A !important; }
        .monaco-editor .cursor { background-color: #A78BFA !important; }
      `}</style>

      {/* ── File Tab Bar ─ */}
      <div className="flex items-center justify-between px-4 border-b border-white/[0.04] pt-2 glass-tab-bar">
        <div className="flex items-center gap-1 flex-1 min-w-0 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          <AnimatePresence>
            {files.map((tab) => {
              const isActive = tab.id === activeFileId;
              const tabColor = LANGUAGE_DISPLAY[tab.language as LanguageId]?.color ?? '#3b82f6';
              return (
                <motion.div
                  key={tab.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, width: 0 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => setActiveFile(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-t-xl text-[11.5px] font-medium cursor-pointer transition-all shrink-0 ${isActive ? 'bg-[#1E1D27]/80 border-t-2 border-[#8B5CF6] text-[#F5F5F7]' : 'bg-transparent border-t-2 border-transparent text-[#6B6A78] hover:text-[#8B8A99] hover:bg-white/[0.02]'}`}
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: tabColor }} />
                  <span className="truncate max-w-[100px]">{tab.name}</span>
                  {files.length > 1 && (
                    <button onClick={(e) => { e.stopPropagation(); removeFile(tab.id); }} className="ml-0.5 text-[#6B6A78] hover:text-white transition-colors shrink-0">
                      <X size={10} />
                    </button>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Plus button */}
          <div className="relative shrink-0" ref={pickerRef}>
            <button onClick={() => setShowNewFilePicker(!showNewFilePicker)} className="p-2 text-[#6B6A78] hover:text-white hover:bg-white/[0.02] rounded-t-lg transition-all" title="New file">
              <Plus size={12} />
            </button>
            <AnimatePresence>
              {showNewFilePicker && (
                <motion.div initial={{ opacity: 0, y: -4, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, scale: 0.96 }} transition={{ duration: 0.12 }}
                  className="absolute left-0 top-[calc(100%+4px)] z-30 min-w-[170px] rounded-xl overflow-hidden py-1.5"
                  style={{ background: '#1E1D27', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
                >
                  <p className="px-3.5 py-1.5 text-[9px] font-bold text-[#6B6A78] uppercase tracking-wider">New File</p>
                  {Object.entries(LANGUAGE_DISPLAY).map(([lang, { name, color }]) => (
                    <button key={lang} onClick={() => handleLangSwitch(lang)} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[12px] font-medium text-[#8B8A99] hover:text-[#F5F5F7] hover:bg-white/[0.04] transition-colors">
                      <FileCode size={13} style={{ color }} />
                      <span className="flex-1 text-left">{name}</span>
                    </button>
                  ))}
                  <div className="mx-2 my-1.5 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
                  <button onClick={() => { setShowNewFilePicker(false); setShowInlineName(true); }} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[12px] font-medium text-[#8B8A99] hover:text-[#A78BFA] hover:bg-white/[0.04] transition-colors">
                    <Plus size={13} /> Custom name…
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Inline name input */}
          <AnimatePresence>
            {showInlineName && (
              <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} className="flex items-center gap-1">
                <input ref={nameInputRef} type="text" value={newFileName} onChange={(e) => setNewFileName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleInlineCreate(); if (e.key === 'Escape') { setShowInlineName(false); setNewFileName(''); } }}
                  placeholder={`untitled${config.ext}`}
                  className="h-7 w-[130px] px-2 text-[11px] bg-[#1E1D27] border border-[#8B5CF6]/40 rounded-lg text-[#F5F5F7] focus:outline-none focus:border-[#8B5CF6] placeholder-[#6B6A78]"
                />
                <button onClick={handleInlineCreate} className="h-7 px-2 text-[10px] font-semibold text-white bg-[#8B5CF6] rounded-lg hover:bg-[#7C3AED] transition-colors">Create</button>
                <button onClick={() => { setShowInlineName(false); setNewFileName(''); }} className="h-7 w-7 flex items-center justify-center text-[#6B6A78] hover:text-white transition-colors">
                  <X size={12} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <span className="text-[10px] font-bold text-[#6B6A78] uppercase tracking-wider pr-2 shrink-0">{config.name} Editor</span>
      </div>

      {/* ── Monaco Editor ── */}
      <div className="flex-1 bg-[#14131A] relative p-1">
        <AnimatePresence mode="wait">
          <motion.div key={activeFileId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.1 }} className="h-full">
            <Editor height="100%" language={config.monacoLang} value={activeTab?.code || ''} onChange={(val) => updateFileCode(activeFileId, val || '')} theme="axiom-dark" onMount={handleEditorMount}
              options={{ lineNumbers: 'on', minimap: { enabled: false }, selectOnLineNumbers: true, fontSize: 13, scrollBeyondLastLine: false, fontFamily: "'JetBrains Mono', 'Fira Code', monospace", renderLineHighlight: 'all', padding: { top: 12 }, smoothScrolling: true, cursorBlinking: 'smooth', cursorSmoothCaretAnimation: 'on' }}
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute bottom-4 right-4 text-[10px] uppercase font-bold tracking-widest text-white/[0.02] select-none pointer-events-none z-10">Monaco Editor Core</div>
      </div>

      {/* ─ Bottom Controls ── */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.04] glass-bottom-bar">
        <div className="flex gap-2">
          <button className="p-2 rounded-xl text-[#6B6A78] hover:text-[#A78BFA] hover:bg-white/[0.02] active:scale-95 transition-all"><Settings size={14} /></button>
          <button onClick={runCode} className="p-2 rounded-xl text-[#6B6A78] hover:text-[#A78BFA] hover:bg-white/[0.02] active:scale-95 transition-all" title="Reset code execution"><RotateCcw size={14} /></button>
        </div>
        <button onClick={runCode} className="blob-btn relative flex items-center gap-1.5 px-5 py-2 rounded-xl text-[12.5px] font-bold text-white transition-all duration-150 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)', boxShadow: '0 4px 12px rgba(139,92,246,0.3)' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 16px rgba(139,92,246,0.45)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(139,92,246,0.3)'; }}
        >
          <Play size={12} fill="white" /> Run Code
        </button>
      </div>
    </div>
  );
};

export default EditorPanel;
