// ─── Workspace View (Restructured) ─────────────────────────────────────────
// New layout: Header → Horizontal Toolbar → Two resizable panels → AXIOM AI bar.

import React, { useEffect, useState, useCallback } from 'react';
import { useWorkspace } from '../../store/useWorkspace';
import { socket } from '../../lib/socket';
import EditorPanel from '../../components/editor/EditorPanel';
import VisualizerPanel from '../../components/visualizers/VisualizerPanel';
import WorkspaceToolbar from '../../components/workspace/WorkspaceToolbar';
import { Sparkles, Wifi, WifiOff, Send, PanelLeftClose, PanelLeftOpen, Mic, Bug, BarChart3, RefreshCw, Volume2, VolumeX, Lightbulb, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebugAssistant } from '../../hooks/useDebugAssistant';
import { useAiTutor } from '../../hooks/useAiTutor';
import { useVoiceInteraction } from '../../hooks/useVoiceInteraction';
import { useProgressFeedback } from '../../hooks/useProgressFeedback';
import {
  Group,
  Panel,
  Separator,
  useDefaultLayout,
  usePanelRef,
} from 'react-resizable-panels';

// Simple markdown-like renderer for AI responses
function formatContent(text: string): React.ReactNode {
  return text.split('\n').map((line, i) => {
    if (line.startsWith('###')) {
      return (
        <div key={i} className="text-[12px] font-bold text-[#A78BFA] mt-3 mb-1">
          {line.replace(/^#+\s*/, '')}
        </div>
      );
    }
    const parts = line.split(/\*\*(.+?)\*\*/g);
    if (parts.length > 1) {
      return (
        <div key={i} className="text-[12.5px] leading-relaxed">
          {parts.map((part, j) =>
            j % 2 === 1 ? (
              <strong key={j} className="text-[#F5F5F7] font-semibold">{part}</strong>
            ) : (
              <span key={j}>{part}</span>
            )
          )}
        </div>
      );
    }
    if (line.trim().startsWith('- ')) {
      return (
        <div key={i} className="text-[12.5px] leading-relaxed pl-3 flex gap-1.5">
          <span className="text-[#A78BFA] mt-0.5">•</span>
          <span>{line.trim().slice(2)}</span>
        </div>
      );
    }
    const codeMatch = line.match(/`([^`]+)`/g);
    if (codeMatch) {
      const segments = line.split(/`([^`]+)`/g);
      return (
        <div key={i} className="text-[12.5px] leading-relaxed">
          {segments.map((seg, j) =>
            j % 2 === 1 ? (
              <code key={j} className="px-1.5 py-0.5 rounded bg-[#14131A] text-[#EC4899] text-[11px] font-mono border border-white/[0.04]">
                {seg}
              </code>
            ) : (
              <span key={j}>{seg}</span>
            )
          )}
        </div>
      );
    }
    if (line.trim() === '') return <div key={i} className="h-1" />;
    return <div key={i} className="text-[12.5px] leading-relaxed">{line}</div>;
  });
}

// ── Glassmorphism CSS (injected via style tag for !important support) ───
const GLASS_CSS = `
  .glass-editor-panel, .glass-visualizer-panel {
    background: rgba(255, 255, 255, 0.07) !important;
    backdrop-filter: blur(20px) !important;
    -webkit-backdrop-filter: blur(20px) !important;
    border: 1px solid rgba(255, 255, 255, 0.12) !important;
    border-radius: 12px !important;
  }
  .glass-live-vars {
    background: rgba(255, 255, 255, 0.1) !important;
    backdrop-filter: blur(16px) !important;
    -webkit-backdrop-filter: blur(16px) !important;
    border: 1px solid rgba(255, 255, 255, 0.15) !important;
  }
  .glass-tab-bar {
    background: rgba(255, 255, 255, 0.05) !important;
    backdrop-filter: blur(10px) !important;
    -webkit-backdrop-filter: blur(10px) !important;
  }
  .glass-bottom-bar {
    background: rgba(255, 255, 255, 0.05) !important;
    backdrop-filter: blur(10px) !important;
    -webkit-backdrop-filter: blur(10px) !important;
  }
  .glass-toolbar-row {
    background: rgba(255, 255, 255, 0.05) !important;
    backdrop-filter: blur(10px) !important;
    -webkit-backdrop-filter: blur(10px) !important;
  }
  .glass-toolbar-drawer {
    background: rgba(255, 255, 255, 0.05) !important;
    backdrop-filter: blur(10px) !important;
    -webkit-backdrop-filter: blur(10px) !important;
  }
  .glass-ai-bar {
    background: rgba(10, 8, 20, 0.55) !important;
    backdrop-filter: blur(24px) !important;
    -webkit-backdrop-filter: blur(24px) !important;
    border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
  }
`;

const WorkspaceView: React.FC = () => {
  const {
    aiTutorOpen,
    setAiTutorOpen,
    socketConnected,
    setSocketConnected,
    steps,
    currentStep,
    addMessage,
    messages,
    code,
    language,
  } = useWorkspace();

  const [aiInput, setAiInput] = useState('');
  const editorPanelRef = usePanelRef();
  const [showEditor, setShowEditor] = useState(true);
  const [activeAiSection, setActiveAiSection] = useState<'chat' | 'debug' | 'progress'>('chat');

  // AI hooks
  const { sendMessage, isStreaming, streamingText, directnessLevel, resetDirectness } = useAiTutor();
  const { analyze: debugAnalyze, analyzing: debugAnalyzing, result: debugResult, error: debugError, clear: clearDebug } = useDebugAssistant();
  const { feedback, analyzing: feedbackAnalyzing, analyze: analyzeProgress, clear: clearFeedback } = useProgressFeedback();
  const {
    isListening, transcript, interimTranscript, isSpeaking, voiceEnabled, setVoiceEnabled,
    error: voiceError, startListening, stopListening, clearTranscript, speak,
  } = useVoiceInteraction();

  // Persist layout to localStorage
  const { defaultLayout, onLayoutChanged } = useDefaultLayout({
    id: 'axiom-workspace-panels-v2',
    storage: localStorage,
    panelIds: ['editor', 'visualizer'],
  });

  // Socket Connection management
  useEffect(() => {
    socket.connect();
    setSocketConnected(true);
    return () => {
      socket.disconnect();
      setSocketConnected(false);
    };
  }, [setSocketConnected]);

  const step = steps[currentStep] || steps[0];
  const aiTip = step?.aiTip || '';
  const output = step?.output || '';

  const handleSendAiPrompt = () => {
    if (!aiInput.trim()) return;
    const input = aiInput;
    addMessage({
      role: 'user',
      content: input,
    });
    setAiInput('');
    setAiTutorOpen(true);
    sendMessage(input);
  };

  const toggleEditor = () => {
    const ref = editorPanelRef.current;
    if (!ref) return;
    if (showEditor) {
      ref.collapse();
    } else {
      ref.expand();
    }
    setShowEditor(!showEditor);
  };

  const handleDebugAnalyze = useCallback(() => {
    setActiveAiSection('debug');
    debugAnalyze();
  }, [debugAnalyze]);

  const handleProgressAnalyze = useCallback(() => {
    setActiveAiSection('progress');
    analyzeProgress();
  }, [analyzeProgress]);

  const handleSpeakMessage = useCallback((text: string) => {
    if (isSpeaking) {
      window.speechSynthesis?.cancel();
    } else {
      speak(text);
    }
  }, [isSpeaking, speak]);

  return (
    <div className="flex flex-col h-full overflow-hidden text-[#F5F5F7]" style={{ minWidth: 0, background: 'radial-gradient(ellipse at 30% 50%, rgba(99,60,180,0.15), transparent 60%)' }}>
      <style>{GLASS_CSS}</style>

      {/* ── Top Workspace Header Bar ── */}
      <header
        className="flex items-center justify-between px-6 py-3.5 shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={toggleEditor}
            className="p-1.5 rounded-lg text-[#6B6A78] hover:text-[#A78BFA] hover:bg-white/[0.03] transition-all"
            title={showEditor ? 'Collapse editor' : 'Expand editor'}
          >
            {showEditor ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
          </button>
          <div className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-pulse" />
          <div>
            <h1 className="text-[15px] font-bold tracking-tight">AXIOM Visual Workspace</h1>
            <p className="text-[10px] text-[#6B6A78] font-medium uppercase tracking-wider">
              Core Learning Engine &bull; Coding Practice Environment
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.04] bg-[#1E1D27]">
            {socketConnected ? (
              <>
                <Wifi size={13} className="text-[#34D399]" />
                <span className="text-[11px] font-medium text-[#34D399]">Live Collaboration Active</span>
              </>
            ) : (
              <>
                <WifiOff size={13} className="text-[#F87171]" />
                <span className="text-[11px] font-medium text-[#8B8A99]">Offline sandbox mode</span>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Horizontal Toolbar ─ */}
      <WorkspaceToolbar />

      {/* ── Main Resizable Workspace Area ── */}
      <div className="flex-1 flex overflow-hidden relative" style={{ minWidth: 0 }}>
        <Group
          id="axiom-workspace-panels-v2"
          orientation="horizontal"
          defaultLayout={defaultLayout ?? { editor: 30, visualizer: 70 }}
          onLayoutChanged={onLayoutChanged}
          className="flex-1"
          style={{ minWidth: 0 }}
        >
          {/* Panel 1: Code Editor */}
          <Panel
            id="editor"
            panelRef={editorPanelRef}
            defaultSize={30}
            minSize={15}
            collapsible
            collapsedSize={0}
          >
            <div className="h-full p-3 pb-0 pl-3" style={{ minWidth: 0 }}>
              <EditorPanel />
            </div>
          </Panel>

          <Separator className="hover:bg-[#8B5CF6]/30 transition-colors cursor-col-resize group">
            <div className="w-0.5 h-8 rounded-full bg-[#6B6A78]/30 group-hover:bg-[#8B5CF6]/50 mx-auto transition-colors" />
          </Separator>

          {/* Panel 2: Algorithm Flow */}
          <Panel id="visualizer" defaultSize={70} minSize={25}>
            <div className="h-full p-3 pb-0" style={{ minWidth: 0 }}>
              <VisualizerPanel />
            </div>
          </Panel>
        </Group>
      </div>

      {/* ── AXIOM AI Companion Bottom Bar ── */}
      <footer className="shrink-0 flex items-center gap-3 px-4 relative glass-ai-bar" style={{ height: '56px' }}>
        {/* ── Left: Branding ── */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
            }}
          >
            <Sparkles size={14} className="text-white" />
          </div>
          <div>
            <p className="text-[13px] font-bold text-[#F5F5F7] leading-tight">AXIOM AI</p>
            <p className="text-[9px] text-[#6B6A78] font-medium leading-tight">AI Companion</p>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="w-px h-6 flex-shrink-0" style={{ background: 'rgba(255,255,255,0.06)' }} />

        {/* ── Center: Input field ── */}
        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={isListening ? transcript + interimTranscript : aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isListening) handleSendAiPrompt();
            }}
            placeholder="Ask AXIOM anything about this code…"
            disabled={isStreaming || isListening}
            className="w-full h-9 rounded-full px-4 text-[12.5px] focus:outline-none text-[#F5F5F7] placeholder-[#6B6A78] disabled:opacity-50"
            style={{
              background: '#1E1D27',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          />
        </div>

        {/* ─ Right: Icon buttons ── */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Mic button */}
          <button
            onClick={isListening ? stopListening : startListening}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
            style={{
              background: isListening ? 'rgba(139,92,246,0.15)' : 'transparent',
              border: '1px solid rgba(255,255,255,0.06)',
              color: isListening ? '#A78BFA' : '#6B6A78',
            }}
            title={isListening ? 'Stop listening' : 'Voice input'}
          >
            <Mic size={15} className={isListening ? 'animate-pulse' : ''} />
          </button>

          {/* Send button */}
          <button
            onClick={handleSendAiPrompt}
            disabled={isStreaming || isListening || !aiInput.trim()}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95 disabled:opacity-40"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
              boxShadow: '0 2px 8px rgba(139,92,246,0.25)',
            }}
            title="Send"
          >
            <Send size={14} className="text-white" />
          </button>
        </div>

        {/* Voice transcript send */}
        {isListening === false && transcript.trim() && (
          <button
            onClick={() => { handleSendAiPrompt(); clearTranscript(); }}
            className="absolute bottom-14 left-1/2 -translate-x-1/2 text-[10px] text-[#A78BFA] hover:text-[#C4B5FD] transition-colors py-1 px-3 rounded-full"
            style={{ background: 'rgba(139,92,246,0.1)' }}
          >
            Send: "{transcript.trim().slice(0, 50)}{transcript.length > 50 ? '...' : ''}"
          </button>
        )}
      </footer>
    </div>
  );
};

export default WorkspaceView;
