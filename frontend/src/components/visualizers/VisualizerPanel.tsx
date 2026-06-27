import React, { useEffect, useMemo, useCallback } from 'react';
import { useWorkspace } from '../../store/useWorkspace';
import ReactFlow, { MarkerType } from 'reactflow';
import type { Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  GitMerge,
  Layers,
  Database,
  Code2,
  CheckSquare,
  ArrowRight,
  Info,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Check,
  X,
  StepForward,
  Lightbulb,
} from 'lucide-react';
import { useQuizHints } from '../../hooks/useQuizHints';

// ─── React Flow Node Definitions ──────────────────────────────────────────────
const BASE_NODE_STYLE = {
  background: '#1E1D27',
  border: '1px solid rgba(255,255,255,0.08)',
  color: '#8B8A99',
  padding: '8px 10px',
  fontSize: '11px',
  textAlign: 'center' as const,
};

const initialNodes: Node[] = [
  {
    id: 'start',
    type: 'input',
    data: { label: 'START' },
    position: { x: 140, y: 15 },
    style: { ...BASE_NODE_STYLE, borderRadius: '20px', padding: '4px 10px', fontSize: '10px', fontWeight: 'bold', width: 75 },
  },
  {
    id: 'check-base-1',
    data: { label: 'n ≤ 0?' },
    position: { x: 120, y: 70 },
    style: { ...BASE_NODE_STYLE, borderRadius: '8px', color: '#F5F5F7', width: 110 },
  },
  {
    id: 'check-base-2',
    data: { label: 'n == 1?' },
    position: { x: 120, y: 135 },
    style: { ...BASE_NODE_STYLE, borderRadius: '8px', color: '#F5F5F7', width: 110 },
  },
  {
    id: 'init-seq',
    data: { label: 'sequence = [0, 1]' },
    position: { x: 105, y: 200 },
    style: { ...BASE_NODE_STYLE, borderRadius: '8px', color: '#F5F5F7', width: 140 },
  },
  {
    id: 'loop-check',
    data: { label: 'len(seq) < n?' },
    position: { x: 120, y: 265 },
    style: { ...BASE_NODE_STYLE, borderRadius: '8px', color: '#F5F5F7', width: 110 },
  },
  {
    id: 'calc-next',
    data: { label: 'next_val = seq[-1] + seq[-2]' },
    position: { x: 275, y: 265 },
    style: { ...BASE_NODE_STYLE, borderRadius: '8px', color: '#F5F5F7', fontSize: '10px', width: 160 },
  },
  {
    id: 'append',
    data: { label: 'seq.append(next_val)' },
    position: { x: 280, y: 325 },
    style: { ...BASE_NODE_STYLE, borderRadius: '8px', color: '#F5F5F7', fontSize: '10.5px', width: 150 },
  },
  {
    id: 'return',
    data: { label: 'Return sequence' },
    position: { x: 5, y: 265 },
    style: { ...BASE_NODE_STYLE, borderRadius: '8px', color: '#F5F5F7', width: 100 },
  },
  {
    id: 'end',
    type: 'output',
    data: { label: 'END' },
    position: { x: 18, y: 330 },
    style: { ...BASE_NODE_STYLE, borderRadius: '20px', padding: '4px 10px', fontSize: '10px', fontWeight: 'bold', width: 70 },
  },
];

const initialEdges: Edge[] = [
  { id: 'start-base1', source: 'start', target: 'check-base-1' },
  { id: 'base1-base2', source: 'check-base-1', target: 'check-base-2' },
  { id: 'base2-initseq', source: 'check-base-2', target: 'init-seq' },
  { id: 'initseq-loopcheck', source: 'init-seq', target: 'loop-check' },
  { id: 'loopcheck-calcnext', source: 'loop-check', target: 'calc-next' },
  { id: 'calcnext-append', source: 'calc-next', target: 'append' },
  { id: 'append-loopcheck', source: 'append', target: 'loop-check' },
  { id: 'loopcheck-return', source: 'loop-check', target: 'return' },
  { id: 'return-end', source: 'return', target: 'end' },
];

// ─── CSS keyframes for edge traversal animation ───────────────────────────────
const EDGE_ANIMATION_CSS = `
  @keyframes edge-traverse {
    0% { stroke-dashoffset: 24; }
    100% { stroke-dashoffset: 0; }
  }
  .react-flow__edge-path[style*="stroke: #EC4899"] {
    stroke-dasharray: 6 3 !important;
    animation: edge-traverse 0.6s linear infinite !important;
  }
  .react-flow .react-flow__node {
    transition: box-shadow 0.3s ease, background 0.3s ease, border-color 0.3s ease;
  }
  @keyframes node-glow-pulse {
    0%, 100% { box-shadow: 0 0 12px rgba(139, 92, 246, 0.35); }
    50% { box-shadow: 0 0 22px rgba(139, 92, 246, 0.6); }
  }
`;

// ─── Main Component ───────────────────────────────────────────────────────────
const VisualizerPanel: React.FC = () => {
  const {
    activeToolbarView,
    setActiveToolbarView,
    activeTab,
    setActiveTab,
    currentStep,
    steps,
    isPlaying,
    setIsPlaying,
    nextStep,
    prevStep,
    speed,
    setSpeed,
    quizAnswered,
    quizCorrect,
    answerQuiz,
    resetQuiz,
    language,
  } = useWorkspace();

  // Sync: if toolbar view is a valid tab, use it; otherwise fall back to activeTab
  const effectiveTab: 'flow' | 'memory' | 'heap' | 'compare' | 'quiz' =
    activeToolbarView && ['flow', 'memory', 'heap', 'compare', 'quiz'].includes(activeToolbarView)
      ? (activeToolbarView as any)
      : activeTab;

  const { requestHint, hints, hintCount, maxHints, generating: hintGenerating } = useQuizHints();

  const step = steps[currentStep] || steps[0];
  const prevStepData = currentStep > 0 ? steps[currentStep - 1] : null;

  // Auto-play timer implementation
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        nextStep();
      }, speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, nextStep]);

  // ─── Build Nodes with Active Glows ──────────────────────────────────────
  const flowNodes = useMemo(() => {
    return initialNodes.map((n) => {
      const isActive = n.id === step.activeNodeId;
      const isVisited =
        step.traversedEdges.some((e) => e.startsWith(n.id) || e.endsWith(n.id)) ||
        n.id === 'start';

      return {
        ...n,
        style: {
          ...n.style,
          background: isActive
            ? 'rgba(139, 92, 246, 0.18)'
            : isVisited
            ? 'rgba(139, 92, 246, 0.05)'
            : '#1E1D27',
          borderColor: isActive
            ? '#8B5CF6'
            : isVisited
            ? 'rgba(139, 92, 246, 0.3)'
            : 'rgba(255, 255, 255, 0.08)',
          boxShadow: isActive ? '0 0 16px rgba(139, 92, 246, 0.45)' : 'none',
          color: isActive ? '#F5F5F7' : isVisited ? '#C4C3D0' : '#6B6A78',
          transition: 'all 0.3s ease',
        },
      };
    });
  }, [step.activeNodeId, step.traversedEdges]);

  // ─── Build Edges with Traversal Styling ─────────────────────────────────
  const flowEdges = useMemo(() => {
    return initialEdges.map((e) => {
      const isCurrentActive = e.id === step.activeEdgeId;
      const isTraversed = step.traversedEdges.includes(e.id);

      return {
        ...e,
        animated: isCurrentActive,
        style: {
          stroke: isCurrentActive
            ? '#EC4899'
            : isTraversed
            ? '#8B5CF6'
            : 'rgba(255, 255, 255, 0.08)',
          strokeWidth: isCurrentActive ? 2.5 : isTraversed ? 2 : 1.5,
          transition: 'stroke 0.3s ease, stroke-width 0.3s ease',
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isCurrentActive
            ? '#EC4899'
            : isTraversed
            ? '#8B5CF6'
            : 'rgba(255, 255, 255, 0.08)',
        },
      };
    });
  }, [step.activeEdgeId, step.traversedEdges]);

  // ─── Detect changed memory cells for pulse animation ────────────────────
  const getMemoryCellKey = useCallback((variable: { name: string; val: string }) => {
    return `${variable.name}-${variable.val}-${currentStep}`;
  }, [currentStep]);

  const isMemoryCellChanged = useCallback((cellName: string) => {
    if (!prevStepData) return false;
    const prevCell = prevStepData.memoryCells.find((c) => c.name === cellName);
    const currCell = step.memoryCells.find((c) => c.name === cellName);
    if (!prevCell && currCell) return true; // newly appeared
    if (prevCell && currCell && prevCell.val !== currCell.val) return true;
    return false;
  }, [step.memoryCells, prevStepData]);

  // ─── Tab Content Renderers ──────────────────────────────────────────────
  const renderAlgorithmFlow = () => (
    <div className="flex flex-col flex-1 relative bg-[#14131A] rounded-2xl border border-white/[0.05] overflow-hidden" style={{ minHeight: 0 }}>
      <style>{EDGE_ANIMATION_CSS}</style>

      {/* Live variable overlay card */}
      {step.variables.length > 0 && (
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="absolute top-4 right-4 p-3.5 rounded-xl border shadow-2xl z-20 text-[11px] font-mono leading-relaxed min-w-[130px] glass-live-vars"
          style={{
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}
        >
          <div className="text-[9px] uppercase font-bold text-[#A78BFA] tracking-wider mb-1.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Variables
          </div>
          {step.variables.map((v) => (
            <div key={v.name} className="flex justify-between gap-3">
              <span className="text-[#8B8A99]">{v.name}:</span>
              <motion.span
                key={`${v.name}-${v.val}`}
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 0.25 }}
                className="text-[#34D399] font-bold"
              >
                {v.val}
              </motion.span>
            </div>
          ))}
        </motion.div>
      )}

      {/* React Flow Component — fills all remaining space */}
      <div style={{ flex: 1, minHeight: 0, width: '100%', height: '100%' }}>
        <ReactFlow
          nodes={flowNodes}
          edges={flowEdges}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          nodesDraggable={false}
          zoomOnScroll={false}
          preventScrolling
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );

  const renderMemoryStack = () => (
    <div className="flex flex-col gap-4 h-full" style={{ minHeight: 0 }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0" style={{ minHeight: 0 }}>
        {/* ── Call Stack Frames ── */}
        <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.05] bg-[#14131A]/60 p-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.03]">
            <span className="text-[10px] text-[#6B6A78] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Layers size={11} className="text-[#A78BFA]" /> Call Stack Frames
            </span>
            <span className="text-[10.5px] font-mono text-[#8B8A99]">Depth: {step.callStack.length}</span>
          </div>

          <div className="flex-1 flex flex-col gap-2 overflow-y-auto max-h-[220px] justify-end">
            <AnimatePresence mode="popLayout">
              {step.callStack.length > 0 ? (
                step.callStack.map((frame, idx) => (
                  <motion.div
                    key={frame.name + idx}
                    initial={{ opacity: 0, y: -15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                      frame.active
                        ? 'border-[#8B5CF6] bg-[#8B5CF6]/5 shadow-[0_0_12px_rgba(139,92,246,0.12)]'
                        : 'border-white/[0.04] bg-[#14131A]'
                    }`}
                    style={{ marginLeft: `${frame.offset}px` }}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${frame.active ? 'bg-[#8B5CF6] animate-pulse' : 'bg-[#6B6A78]'}`} />
                      <span className={`text-[12.5px] font-mono ${frame.active ? 'text-[#F5F5F7] font-bold' : 'text-[#8B8A99]'}`}>
                        {frame.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#6B6A78] flex items-center gap-0.5">
                      Line {frame.line} <ChevronRight size={10} />
                    </span>
                  </motion.div>
                ))
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[11.5px] text-[#6B6A78] italic text-center py-6"
                >
                  No active frames. Execution completed.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Memory Cells ── */}
        <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.05] bg-[#14131A]/60 p-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.03]">
            <span className="text-[10px] text-[#6B6A78] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Database size={11} className="text-[#34D399]" /> Memory Cells
            </span>
            <button className="flex items-center gap-1 text-[10px] text-[#6B6A78] hover:text-[#A78BFA] transition-colors font-bold uppercase tracking-wider pr-1">
              <StepForward size={10} /> Step Memory
            </button>
          </div>

          <div className="flex-grow grid grid-cols-1 gap-2.5 overflow-y-auto max-h-[220px]">
            <AnimatePresence mode="popLayout">
              {step.memoryCells.length > 0 ? (
                step.memoryCells.map((variable) => {
                  const changed = isMemoryCellChanged(variable.name);
                  return (
                    <motion.div
                      key={variable.name}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-white/[0.03] bg-[#14131A] hover:border-white/[0.06] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[8.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-violet-600/10 text-[#A78BFA] border border-violet-500/20">
                          {variable.type}
                        </span>
                        <span className="text-[12px] font-mono font-bold text-[#F5F5F7]">{variable.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <motion.span
                          key={getMemoryCellKey(variable)}
                          animate={changed ? {
                            scale: [1, 1.3, 1],
                            color: ['#34D399', '#A78BFA', '#34D399'],
                          } : {}}
                          transition={{ duration: 0.4 }}
                          className="text-[12.5px] font-mono text-[#34D399] font-bold"
                        >
                          {variable.val}
                        </motion.span>
                        <span className="text-[9.5px] font-mono text-[#6b6a78]">{variable.address}</span>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <p className="text-[11.5px] text-[#6B6A78] italic text-center py-6">
                  No stack allocation. All frames returned.
                </p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Variables Horizontal Strip ── */}
      <div className="p-3.5 rounded-xl border border-white/[0.04] bg-[#14131A]">
        <p className="text-[9px] text-[#6B6A78] font-bold uppercase tracking-wider mb-2.5">
          Current Scope Variables
        </p>
        <div className="flex flex-wrap gap-2.5">
          <AnimatePresence mode="popLayout">
            {step.variables.map((v) => (
              <motion.div
                key={v.name}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/[0.04] bg-[#1E1D27]"
              >
                <span className="text-[11px] font-mono text-[#8B8A99]">{v.name} =</span>
                <motion.span
                  key={`${v.name}-${v.val}`}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.2 }}
                  className="text-[11px] font-mono text-[#A78BFA] font-bold"
                >
                  {v.val}
                </motion.span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  const renderHeapData = () => {
    const refVar = step.heapRefs.find((r) => r.isRef);
    const heapObj = step.heapRefs.find((r) => !r.isRef);

    return (
      <div className="flex flex-col gap-4 h-full" style={{ minHeight: 0 }}>
        {/* ── Copy vs Reference Aliasing ── */}
        <div className="rounded-2xl border border-white/[0.05] bg-[#14131A]/60 p-4 shrink-0">
          <span className="text-[10px] text-[#6B6A78] font-bold uppercase tracking-wider flex items-center gap-1.5 mb-3.5">
            <Database size={11} className="text-[#A78BFA]" /> Copy vs Reference (Aliasing)
          </span>

          {refVar && heapObj ? (
            <div className="flex items-center justify-center gap-6 py-4">
              {/* Stack Pointer Box */}
              <motion.div
                key={`stack-${refVar.name}-${currentStep}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="p-3.5 rounded-xl border border-[#8B5CF6]/30 bg-[#1E1D27] text-center shadow-lg min-w-[110px]"
              >
                <p className="text-[8px] text-[#A78BFA] font-bold uppercase tracking-wider">Stack Variable</p>
                <p className="text-[12.5px] text-[#F5F5F7] font-mono font-bold mt-1">{refVar.name}</p>
                <p className="text-[9.5px] text-[#6B6A78] font-mono mt-0.5">Ref: {refVar.pointsTo}</p>
              </motion.div>

              {/* Connect arrow */}
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                className="text-[#EC4899]"
              >
                <ArrowRight size={20} strokeWidth={2.5} />
              </motion.div>

              {/* Heap Memory Box */}
              <motion.div
                key={`heap-${heapObj.value}-${currentStep}`}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="p-3.5 rounded-xl border border-emerald-500/20 bg-[#1E1D27] text-center shadow-lg min-w-[150px]"
              >
                <p className="text-[8px] text-[#34D399] font-bold uppercase tracking-wider">Heap Address {heapObj.address}</p>
                <motion.p
                  key={heapObj.value}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 0.3 }}
                  className="text-[13px] text-[#34D399] font-mono font-extrabold mt-1"
                >
                  {heapObj.value}
                </motion.p>
                <p className="text-[8.5px] text-[#6B6A78] mt-1 font-mono">Array Object Reference</p>
              </motion.div>
            </div>
          ) : (
            <div className="flex items-center justify-center p-6 text-[12px] text-[#6B6A78] italic">
              No reference bindings in current scope.
            </div>
          )}
        </div>

        {/* ── Recharts Area Chart ── */}
        <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.05] bg-[#14131A]/60 p-4 flex-1" style={{ minHeight: 0 }}>
          <span className="text-[10px] text-[#6B6A78] font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0">
            <TrendingUp size={11} className="text-[#EC4899]" /> Visualize Data (Fibonacci Progression)
          </span>

          <div className="flex-1 w-full h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={step.chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="vis-flow-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.35} />
                    <stop offset="50%" stopColor="#EC4899" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#EC4899" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.03)" />
                <XAxis
                  dataKey="step"
                  tick={{ fill: '#6B6A78', fontSize: 10 }}
                  stroke="rgba(255, 255, 255, 0.05)"
                  name="Index"
                />
                <YAxis
                  domain={[0, 'auto']}
                  tick={{ fill: '#6B6A78', fontSize: 10 }}
                  stroke="rgba(255, 255, 255, 0.05)"
                />
                <Tooltip
                  contentStyle={{
                    background: '#1E1D27',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
                  }}
                  labelStyle={{ color: '#6B6A78', fontSize: 10, fontWeight: 600 }}
                  itemStyle={{ color: '#A78BFA', fontSize: 12, fontWeight: 600 }}
                />
                <Area
                  type="monotone"
                  dataKey="val"
                  name="Fibonacci Value"
                  stroke="#8B5CF6"
                  strokeWidth={2.5}
                  fill="url(#vis-flow-grad)"
                  animationDuration={400}
                  dot={{ r: 3, fill: '#A78BFA', stroke: '#8B5CF6', strokeWidth: 1.5 }}
                  activeDot={{ r: 5, fill: '#EC4899', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  const renderCompare = () => {
    // Core languages — full comparison table
    const coreSyntax: Record<string, Record<string, string>> = {
      'Function Head': {
        python: 'def fibonacci(n):',
        javascript: 'function fibonacci(n) {',
        cpp: 'vector<int> fibonacci(int n) {',
        java: 'List<Integer> fibonacci(int n) {',
      },
      'Array Init': {
        python: 'sequence = [0, 1]',
        javascript: 'const sequence = [0, 1]',
        cpp: 'vector<int> sequence = {0, 1}',
        java: 'List<Integer> seq = new ArrayList<>(...)',
      },
      'Loop Guard': {
        python: 'while len(sequence) < n:',
        javascript: 'while (sequence.length < n) {',
        cpp: 'while (sequence.size() < n) {',
        java: 'while (sequence.size() < n) {',
      },
      'Append Value': {
        python: 'sequence.append(val)',
        javascript: 'sequence.push(val)',
        cpp: 'sequence.push_back(val)',
        java: 'sequence.add(val)',
      },
    };

    // Additional languages — function heads only
    const extraLangs: { id: string; name: string; fnHead: string; color: string }[] = [
      { id: 'typescript', name: 'TypeScript', fnHead: 'function fibonacci(n: number): number[] {', color: '#3178c6' },
      { id: 'rust', name: 'Rust', fnHead: 'fn fibonacci(n: i32) -> Vec<i32> {', color: '#f97316' },
      { id: 'go', name: 'Go', fnHead: 'func fibonacci(n int) []int {', color: '#00add8' },
      { id: 'ruby', name: 'Ruby', fnHead: 'def fibonacci(n)', color: '#dc2626' },
      { id: 'php', name: 'PHP', fnHead: 'function fibonacci(int $n): array {', color: '#7c3aed' },
      { id: 'csharp', name: 'C#', fnHead: 'public static List<int> Fibonacci(int n) {', color: '#239120' },
    ];

    return (
      <div className="flex flex-col gap-4 h-full">
        <span className="text-[10px] text-[#6B6A78] font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1">
          <Code2 size={11} className="text-[#A78BFA]" /> Multi-Language Logic Map
        </span>
        <p className="text-[12.5px] text-[#8B8A99] leading-relaxed">
          Regardless of the syntax in the editor, AXIOM's Core Learning Engine compiles the execution
          states into the same visual model. Below is a comparison across all 10 supported languages.
        </p>

        {/* Core 4 languages — full comparison */}
        <div className="p-4 rounded-xl border border-white/[0.04] bg-[#14131A] flex flex-col gap-0 font-mono text-[11px] mt-1 overflow-hidden">
          <div className="grid grid-cols-5 gap-2 border-b border-white/[0.04] pb-2.5 mb-2">
            <span className="text-[#A78BFA] font-bold text-[10px] uppercase tracking-wider">Operation</span>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${language === 'python' ? 'text-[#A78BFA]' : 'text-[#6B6A78]'}`}>Python</span>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${language === 'javascript' ? 'text-[#A78BFA]' : 'text-[#6B6A78]'}`}>JavaScript</span>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${language === 'cpp' ? 'text-[#A78BFA]' : 'text-[#6B6A78]'}`}>C++</span>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${language === 'java' ? 'text-[#A78BFA]' : 'text-[#6B6A78]'}`}>Java</span>
          </div>
          {Object.entries(coreSyntax).map(([op, langs]) => (
            <div key={op} className="grid grid-cols-5 gap-2 py-1.5 border-b border-white/[0.02] last:border-0">
              <span className="text-[#6B6A78] text-[10px]">{op}</span>
              {(['python', 'javascript', 'cpp', 'java'] as const).map((lang) => {
                const isActive = language === lang;
                return (
                  <span
                    key={lang}
                    className={`text-[10px] truncate ${isActive ? 'text-[#F5F5F7] font-semibold' : 'text-[#8B8A99]'}`}
                    title={langs[lang]}
                  >
                    {langs[lang]}
                  </span>
                );
              })}
            </div>
          ))}
        </div>

        {/* Additional 6 languages — function heads */}
        <div className="p-4 rounded-xl border border-white/[0.04] bg-[#14131A] flex flex-col gap-2.5">
          <span className="text-[10px] text-[#6B6A78] font-bold uppercase tracking-wider">Also Available</span>
          <div className="grid grid-cols-2 gap-2">
            {extraLangs.map((lang) => {
              const isActive = language === lang.id;
              return (
                <div
                  key={lang.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border font-mono text-[11px]"
                  style={{
                    borderColor: isActive ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.04)',
                    background: isActive ? 'rgba(139,92,246,0.08)' : 'transparent',
                  }}
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: lang.color }} />
                  <span className={`truncate ${isActive ? 'text-[#F5F5F7] font-semibold' : 'text-[#8B8A99]'}`}>
                    {lang.fnHead}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-auto p-3 rounded-xl border border-violet-500/10 bg-violet-500/5 flex items-center gap-2">
          <Sparkles size={12} className="text-[#A78BFA]" />
          <span className="text-[11px] text-[#8B8A99]">
            The active language (<strong className="text-[#A78BFA]">{language}</strong>) is highlighted. Switch languages in the toolbar to see how the same algorithm translates.
          </span>
        </div>
      </div>
    );
  };

  const renderQuiz = () => {
    const options = [
      '1 frame (Iterative — no recursion)',
      '5 frames (Recursive depth for n=5)',
      '2 frames (main + fibonacci)',
    ];

    return (
      <div className="flex flex-col gap-4 h-full text-[12.5px] leading-relaxed">
        <span className="text-[10px] text-[#6B6A78] font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1">
          <CheckSquare size={11} className="text-[#FB923C]" /> Quiz Challenge
        </span>
        <div className="p-4 rounded-xl border border-white/[0.04] bg-[#14131A] flex flex-col gap-3">
          <h4 className="font-bold text-[#F5F5F7] text-[13px]">
            Question: What is the maximum call stack depth during fibonacci(5)?
          </h4>
          <p className="text-[11px] text-[#8B8A99]">
            Hint: Look at how this implementation works — is it iterative or recursive?
          </p>
          <div className="flex flex-col gap-2 mt-2">
            {options.map((opt, idx) => {
              const isSelected = quizAnswered === idx;
              const showCorrect = quizAnswered !== null && idx === 0;
              const showWrong = isSelected && !quizCorrect;

              return (
                <motion.button
                  key={idx}
                  onClick={() => quizAnswered === null && answerQuiz(idx)}
                  whileTap={quizAnswered === null ? { scale: 0.98 } : {}}
                  className={`w-full text-left p-3 rounded-lg border flex items-center justify-between transition-all font-medium ${
                    showCorrect
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-[#34D399]'
                      : showWrong
                      ? 'border-red-500/40 bg-red-500/10 text-[#F87171]'
                      : isSelected
                      ? 'border-violet-500/30 bg-violet-500/10 text-[#F5F5F7]'
                      : 'border-white/[0.04] bg-[#1E1D27] hover:border-violet-500/30 text-[#8B8A99] hover:text-[#F5F5F7]'
                  }`}
                  disabled={quizAnswered !== null}
                >
                  <span>{opt}</span>
                  {showCorrect && <Check size={14} className="text-[#34D399]" />}
                  {showWrong && <X size={14} className="text-[#F87171]" />}
                </motion.button>
              );
            })}
          </div>

          {quizAnswered !== null && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-lg border mt-2 ${
                quizCorrect
                  ? 'border-emerald-500/20 bg-emerald-500/5 text-[#34D399]'
                  : 'border-red-500/20 bg-red-500/5 text-[#F87171]'
              }`}
            >
              <p className="text-[12px] font-medium">
                {quizCorrect
                  ? '✓ Correct! This implementation is iterative (uses a while loop), so it only ever has 1 active stack frame for fibonacci().'
                  : ' Not quite. This implementation uses a while loop (iterative), not recursion — so the call stack depth stays at 1 frame for fibonacci().'}
              </p>
              {!quizCorrect && hintCount < maxHints && (
                <button
                  onClick={() => requestHint(
                    'What is the maximum call stack depth during fibonacci(5)?',
                    '1 frame (Iterative — no recursion)',
                    options[quizAnswered] || ''
                  )}
                  disabled={hintGenerating}
                  className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-[#A78BFA] hover:text-[#C4B5FD] transition-colors uppercase tracking-wider disabled:opacity-50"
                >
                  <Lightbulb size={10} />
                  {hintGenerating ? 'Generating hint...' : `AI Hint (${maxHints - hintCount} remaining)`}
                </button>
              )}
              {hints.length > 0 && (
                <div className="mt-2 p-2.5 rounded-lg border border-violet-500/20 bg-violet-500/5">
                  <p className="text-[10px] font-bold text-[#A78BFA] uppercase tracking-wider mb-1">AI Hint</p>
                  <p className="text-[11.5px] text-[#C4C3D0] leading-relaxed">{hints[hints.length - 1]}</p>
                </div>
              )}
              <button
                onClick={resetQuiz}
                className="mt-2 text-[10px] font-bold text-[#A78BFA] hover:text-white transition-colors uppercase tracking-wider"
              >
                Try Again →
              </button>
            </motion.div>
          )}
        </div>
      </div>
    );
  };

  const renderActiveTab = () => {
    switch (effectiveTab) {
      case 'flow': return renderAlgorithmFlow();
      case 'memory': return renderMemoryStack();
      case 'heap': return renderHeapData();
      case 'compare': return renderCompare();
      case 'quiz': return renderQuiz();
      default: return null;
    }
  };

  const tabs: { id: 'flow' | 'memory' | 'heap' | 'compare' | 'quiz'; icon: React.ElementType; title: string }[] = [
    { id: 'flow', icon: GitMerge, title: 'Algorithm Flow' },
    { id: 'memory', icon: Layers, title: 'Memory & Stack' },
    { id: 'heap', icon: Database, title: 'Heap & Data' },
    { id: 'compare', icon: Code2, title: 'Compare' },
    { id: 'quiz', icon: CheckSquare, title: 'Quiz' },
  ];

  return (
    <div className="flex h-full overflow-hidden" style={{ minWidth: 0, minHeight: 0 }}>
      {/* ── Visualizer Card Container ── */}
      <div
        className="flex-1 flex flex-col overflow-hidden glass-visualizer-panel"
        style={{
          minWidth: 0,
          minHeight: 0,
        }}
      >
        {/* Card Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.04] shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-bold text-[#F5F5F7] uppercase tracking-wide">
              {tabs.find((t) => t.id === activeTab)?.title}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10.5px] text-[#6B6A78] font-bold uppercase tracking-wider">
            <Info size={11} /> Step-by-Step Tracing
          </div>
        </div>

        {/* Tab Content — scrollable for most tabs, flex-fill for flow */}
        {effectiveTab === 'flow' ? (
          <div className="flex-1 flex flex-col overflow-hidden p-4 pb-0" style={{ minHeight: 0 }}>
            {renderActiveTab()}
          </div>
        ) : (
          <div className="flex-1 p-4 overflow-y-auto overflow-x-hidden leading-relaxed bg-[#1E1D27]" style={{ minHeight: 0 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="h-full"
              >
                {renderActiveTab()}
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* ── Persistent Step Controls ── */}
        <div className="px-5 py-3.5 border-t border-white/[0.04] flex flex-col gap-3 glass-bottom-bar">
          <div className="flex items-center justify-between gap-4">
            {/* Speed Slider */}
            <div className="flex items-center gap-2.5 min-w-[130px]">
              <span className="text-[9.5px] text-[#6B6A78] font-bold uppercase tracking-wider">Speed:</span>
              <input
                type="range"
                min="200"
                max="2500"
                step="100"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-20 accent-[#8B5CF6] h-1 bg-white/[0.06] rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-[10px] font-mono text-[#8B8A99]">{speed}ms</span>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-2 bg-[#14131A] p-1 rounded-xl border border-white/[0.04]">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="p-2 rounded-lg text-[#8B8A99] hover:text-[#F5F5F7] disabled:opacity-30 disabled:pointer-events-none active:scale-95 transition-all"
                title="Previous step"
              >
                <SkipBack size={13} />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-lg bg-[#8B5CF6]/10 text-[#A78BFA] border border-[#8B5CF6]/20 active:scale-95 transition-all"
                title={isPlaying ? 'Pause' : 'Auto Play'}
              >
                {isPlaying ? <Pause size={13} fill="currentColor" /> : <Play size={13} fill="currentColor" />}
              </button>

              <button
                onClick={nextStep}
                disabled={currentStep === steps.length - 1}
                className="p-2 rounded-lg text-[#8B8A99] hover:text-[#F5F5F7] disabled:opacity-30 disabled:pointer-events-none active:scale-95 transition-all"
                title="Next step"
              >
                <SkipForward size={13} />
              </button>
            </div>

            {/* Stepper Info */}
            <div className="text-[11px] font-mono text-[#6B6A78]">
              Step <strong className="text-[#A78BFA]">{currentStep + 1}</strong> / {steps.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualizerPanel;
