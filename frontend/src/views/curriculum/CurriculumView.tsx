// ─── Curriculum View ───────────────────────────────────────────────────────
// The main curriculum page: module/topic list, topic detail with mode switcher,
// projects section, and dependency graph.

import React, { useState } from 'react';
import { useCurriculum } from '../../hooks/useCurriculum';
import { useProjectTracker } from '../../hooks/useProjectTracker';
import { DIFFICULTY_CONFIG, STATUS_CONFIG, MASTERY_THRESHOLD } from '../../data/curriculumData';
import { Lock, Check, BookOpen, MonitorPlay, Code2, Trophy, GitGraph, ChevronRight, ArrowLeft, Sparkles, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Module Card ───────────────────────────────────────────────────────────

function ModuleCard({
  module,
  topics,
  progress,
  onClick,
}: {
  module: { id: string; title: string; description: string; difficulty: string };
  topics: { id: string; title: string; status: string; masteryScore: number }[];
  progress: { completed: number; total: number };
  onClick: () => void;
}) {
  const difficulty = DIFFICULTY_CONFIG[module.difficulty as keyof typeof DIFFICULTY_CONFIG] || DIFFICULTY_CONFIG.beginner;
  const pct = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99]"
      style={{
        background: '#1E1D27',
        borderColor: 'rgba(255,255,255,0.06)',
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-[15px] font-bold text-[#F5F5F7]">{module.title}</h3>
          <p className="text-[11px] text-[#8B8A99] mt-1 leading-relaxed">{module.description}</p>
        </div>
        <span
          className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg shrink-0"
          style={{ background: `${difficulty.color}15`, color: difficulty.color, border: `1px solid ${difficulty.color}30` }}
        >
          {difficulty.label}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 rounded-full bg-[#14131A] mb-3 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${difficulty.color}, #A78BFA)` }}
        />
      </div>

      <div className="flex items-center justify-between text-[10px] text-[#6B6A78]">
        <span>{progress.completed}/{progress.total} topics completed</span>
        <span className="font-bold" style={{ color: difficulty.color }}>{pct}%</span>
      </div>

      {/* Topic pills */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {topics.map((t) => {
          const status = STATUS_CONFIG[t.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.locked;
          return (
            <span
              key={t.id}
              className="text-[9px] px-2 py-0.5 rounded-md font-medium"
              style={{
                background: t.status === 'locked' ? 'rgba(255,255,255,0.03)' : `${status.color}10`,
                color: status.color,
                border: `1px solid ${status.color}20`,
              }}
            >
              {t.title}
            </span>
          );
        })}
      </div>
    </button>
  );
}

// ─── Topic Detail View ─────────────────────────────────────────────────────

function TopicDetailView() {
  const {
    activeTopic,
    activeTopicStatus,
    activeTopicMastery,
    activeTopicProgress,
    activeTopicMissingPrereqs,
    activeMode,
    setMode,
    markExplanationViewed,
    markVisualizationInteracted,
    markExercisePassed,
    markChallengePassed,
    getCachedAiProblems,
    curriculum,
    goBack,
  } = useCurriculum();

  const [exercises, setExercises] = useState(() => activeTopic?.exercises || []);
  const [passedExercises, setPassedExercises] = useState<Set<string>>(new Set());
  const [passedChallenges, setPassedChallenges] = useState<Set<string>>(new Set());
  const [generating, setGenerating] = useState(false);

  if (!activeTopic) return null;

  const modes: { id: 'learn' | 'visualize' | 'practice' | 'challenge'; icon: React.ElementType; label: string }[] = [
    { id: 'learn', icon: BookOpen, label: 'Learn' },
    { id: 'visualize', icon: MonitorPlay, label: 'Visualize' },
    { id: 'practice', icon: Code2, label: 'Practice' },
    { id: 'challenge', icon: Trophy, label: 'Challenge' },
  ];

  const allExercises = [...activeTopic.exercises, ...getCachedAiProblems(activeTopic.id)];

  const handleGeneratePractice = async () => {
    setGenerating(true);
    // In production, this calls generatePracticeProblems()
    // For now, we'll simulate with a mock
    setTimeout(() => {
      setGenerating(false);
    }, 2000);
  };

  const handleExercisePass = (exerciseId: string) => {
    setPassedExercises((prev) => new Set(prev).add(exerciseId));
    markExercisePassed(exerciseId);
  };

  const handleChallengePass = (challengeId: string) => {
    setPassedChallenges((prev) => new Set(prev).add(challengeId));
    markChallengePassed(challengeId);
  };

  return (
    <div className="flex flex-col h-full" style={{ minWidth: 0 }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.05] shrink-0">
        <button onClick={goBack} className="p-1.5 rounded-lg text-[#6B6A78] hover:text-[#A78BFA] hover:bg-white/[0.03] transition-all">
          <ArrowLeft size={16} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-[16px] font-bold text-[#F5F5F7] truncate">{activeTopic.title}</h2>
            <span
              className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shrink-0"
              style={{
                background: `${STATUS_CONFIG[activeTopicStatus]?.color || '#6B6A78'}15`,
                color: STATUS_CONFIG[activeTopicStatus]?.color || '#6B6A78',
                border: `1px solid ${STATUS_CONFIG[activeTopicStatus]?.color || '#6B6A78'}30`,
              }}
            >
              {STATUS_CONFIG[activeTopicStatus]?.label || 'Locked'}
            </span>
          </div>
          <p className="text-[11px] text-[#8B8A99] mt-0.5">{activeTopic.description}</p>
        </div>
        {/* Mastery */}
        <div className="text-right shrink-0">
          <div className="text-[18px] font-bold" style={{ color: activeTopicMastery >= MASTERY_THRESHOLD ? '#8B5CF6' : '#A78BFA' }}>
            {activeTopicMastery}%
          </div>
          <div className="text-[9px] text-[#6B6A78]">Mastery</div>
        </div>
      </div>

      {/* Locked state */}
      {activeTopicStatus === 'locked' && activeTopicMissingPrereqs.length > 0 && (
        <div className="px-6 py-4 bg-red-500/5 border-b border-red-500/10 shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <Lock size={13} className="text-[#F87171]" />
            <span className="text-[12px] font-bold text-[#F87171]">This topic is locked</span>
          </div>
          <p className="text-[11px] text-[#8B8A99]">
            Complete these prerequisites first (80%+ mastery required):
          </p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {activeTopicMissingPrereqs.map((title) => (
              <span key={title} className="text-[10px] px-2 py-0.5 rounded-md bg-red-500/10 text-[#F87171] border border-red-500/20">
                {title}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Mode Tabs */}
      <div className="flex gap-1 px-6 py-3 border-b border-white/[0.03] shrink-0">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => { setMode(mode.id); if (mode.id === 'learn') markExplanationViewed(); if (mode.id === 'visualize') markVisualizationInteracted(); }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11.5px] font-semibold transition-all ${
              activeMode === mode.id
                ? 'bg-violet-500/10 text-[#A78BFA] border border-violet-500/20'
                : 'text-[#6B6A78] hover:text-[#8B8A99] border border-transparent'
            }`}
          >
            <mode.icon size={12} />
            {mode.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6" style={{ minHeight: 0 }}>
        <AnimatePresence mode="wait">
          {/* Learn Mode */}
          {activeMode === 'learn' && (
            <motion.div
              key="learn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-3xl"
            >
              <div
                className="prose prose-invert max-w-none"
                style={{ color: '#C4C3D0', lineHeight: 1.7, fontSize: '13px' }}
              >
                {activeTopic.explanation.split('\n').map((line, i) => {
                  if (line.startsWith('# ')) return <h2 key={i} className="text-[18px] font-bold text-[#F5F5F7] mt-6 mb-3">{line.replace('# ', '')}</h2>;
                  if (line.startsWith('## ')) return <h3 key={i} className="text-[15px] font-bold text-[#A78BFA] mt-4 mb-2">{line.replace('## ', '')}</h3>;
                  if (line.startsWith('### ')) return <h4 key={i} className="text-[13px] font-bold text-[#8B8A99] mt-3 mb-1">{line.replace('### ', '')}</h4>;
                  if (line.startsWith('```')) return null; // skip code fence markers for simplicity
                  if (line.trim() === '') return <div key={i} className="h-3" />;
                  if (line.startsWith('|')) return (
                    <div key={i} className="font-mono text-[11px] text-[#8B8A99] bg-[#14131A] px-3 py-1.5 rounded my-1">
                      {line}
                    </div>
                  );
                  // Bold/inline code
                  const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
                  return (
                    <p key={i} className="mb-2">
                      {parts.map((part, j) => {
                        if (part.startsWith('**') && part.endsWith('**')) return <strong key={j} className="text-[#F5F5F7]">{part.slice(2, -2)}</strong>;
                        if (part.startsWith('`') && part.endsWith('`')) return <code key={j} className="px-1.5 py-0.5 rounded bg-[#14131A] text-[#EC4899] text-[11px] font-mono">{part.slice(1, -1)}</code>;
                        return <span key={j}>{part}</span>;
                      })}
                    </p>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Visualize Mode */}
          {activeMode === 'visualize' && (
            <motion.div
              key="visualize"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <div className="flex items-center gap-2 mb-4">
                <MonitorPlay size={14} className="text-[#A78BFA]" />
                <span className="text-[13px] font-bold text-[#F5F5F7]">Interactive Visualization</span>
              </div>
              <div
                className="rounded-2xl border border-white/[0.05] bg-[#14131A] flex items-center justify-center"
                style={{ minHeight: '400px' }}
              >
                <div className="text-center">
                  <Sparkles size={32} className="text-[#A78BFA]/40 mx-auto mb-3" />
                  <p className="text-[13px] text-[#8B8A99] font-medium">{activeTopic.title}</p>
                  <p className="text-[11px] text-[#6B6A78] mt-1">
                    Visualization type: <strong className="text-[#A78BFA]">{activeTopic.visualizationType}</strong>
                  </p>
                  <p className="text-[11px] text-[#6B6A78] mt-2">
                    Interactive visualization coming soon — this will use the same React Flow engine as the Algorithm Flow panel.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Practice Mode */}
          {activeMode === 'practice' && (
            <motion.div
              key="practice"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-3xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Code2 size={14} className="text-[#34D399]" />
                  <span className="text-[13px] font-bold text-[#F5F5F7]">Exercises</span>
                  <span className="text-[10px] text-[#6B6A78]">
                    ({passedExercises.size}/{allExercises.length} completed)
                  </span>
                </div>
                <button
                  onClick={handleGeneratePractice}
                  disabled={generating}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10.5px] font-bold text-[#A78BFA] border border-violet-500/20 bg-violet-500/5 hover:bg-violet-500/10 transition-all disabled:opacity-50"
                >
                  {generating ? <RefreshCw size={11} className="animate-spin" /> : <Sparkles size={11} />}
                  {generating ? 'Generating...' : 'Generate More'}
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {allExercises.map((ex, idx) => {
                  const passed = passedExercises.has(ex.id);
                  return (
                    <div
                      key={ex.id}
                      className="p-4 rounded-xl border transition-all"
                      style={{
                        background: '#14131A',
                        borderColor: passed ? 'rgba(52,211,153,0.3)' : 'rgba(255,255,255,0.04)',
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-[#6B6A78]">#{idx + 1}</span>
                          <h4 className="text-[13px] font-bold text-[#F5F5F7]">{ex.title}</h4>
                          {ex.aiGenerated && (
                            <span className="text-[8px] px-1.5 py-0.5 rounded bg-violet-500/10 text-[#A78BFA] border border-violet-500/20 font-bold uppercase">AI</span>
                          )}
                        </div>
                        <span
                          className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                          style={{
                            background: `${DIFFICULTY_CONFIG[ex.difficulty]?.color || '#8B8A99'}15`,
                            color: DIFFICULTY_CONFIG[ex.difficulty]?.color || '#8B8A99',
                          }}
                        >
                          {DIFFICULTY_CONFIG[ex.difficulty]?.label || ex.difficulty}
                        </span>
                      </div>
                      <p className="text-[12px] text-[#8B8A99] mb-3">{ex.description}</p>

                      {/* Starter code */}
                      <pre className="text-[11px] font-mono text-[#C4C3D0] bg-[#1E1D27] p-3 rounded-lg overflow-x-auto mb-3 border border-white/[0.03]">
                        {ex.starterCode}
                      </pre>

                      {/* Test cases */}
                      {ex.testCases.length > 0 && (
                        <div className="mb-3">
                          <span className="text-[10px] font-bold text-[#6B6A78] uppercase tracking-wider">Test Cases</span>
                          <div className="mt-1 flex flex-col gap-1">
                            {ex.testCases.map((tc: { input: string; expectedOutput: string }, ti: number) => (
                              <div key={ti} className="flex gap-2 text-[11px] font-mono">
                                <span className="text-[#6B6A78]">Input:</span>
                                <span className="text-[#EC4899]">{tc.input}</span>
                                <span className="text-[#6B6A78]">→</span>
                                <span className="text-[#34D399]">{tc.expectedOutput}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Pass button */}
                      {!passed && (
                        <button
                          onClick={() => handleExercisePass(ex.id)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold text-white transition-all active:scale-95"
                          style={{
                            background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
                            boxShadow: '0 4px 12px rgba(139,92,246,0.3)',
                          }}
                        >
                          <Check size={12} /> Mark as Completed
                        </button>
                      )}
                      {passed && (
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#34D399]">
                          <Check size={12} /> Completed
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Challenge Mode */}
          {activeMode === 'challenge' && (
            <motion.div
              key="challenge"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-2 mb-4">
                <Trophy size={14} className="text-[#FB923C]" />
                <span className="text-[13px] font-bold text-[#F5F5F7]">Challenges</span>
                <span className="text-[10px] text-[#6B6A78]">
                  ({passedChallenges.size}/{activeTopic.challenges.length} completed)
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {activeTopic.challenges.map((ch, idx) => {
                  const passed = passedChallenges.has(ch.id);
                  return (
                    <div
                      key={ch.id}
                      className="p-4 rounded-xl border transition-all"
                      style={{
                        background: '#14131A',
                        borderColor: passed ? 'rgba(251,146,60,0.3)' : 'rgba(255,255,255,0.04)',
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Trophy size={12} className="text-[#FB923C]" />
                          <h4 className="text-[13px] font-bold text-[#F5F5F7]">{ch.title}</h4>
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded" style={{ background: '#F8717115', color: '#F87171' }}>
                          {DIFFICULTY_CONFIG[ch.difficulty]?.label || ch.difficulty}
                        </span>
                      </div>
                      <p className="text-[12px] text-[#8B8A99] mb-3">{ch.description}</p>

                      <pre className="text-[11px] font-mono text-[#C4C3D0] bg-[#1E1D27] p-3 rounded-lg overflow-x-auto mb-3 border border-white/[0.03]">
                        {ch.starterCode}
                      </pre>

                      {ch.testCases.length > 0 && (
                        <div className="mb-3">
                          <span className="text-[10px] font-bold text-[#6B6A78] uppercase tracking-wider">Test Cases</span>
                          <div className="mt-1 flex flex-col gap-1">
                            {ch.testCases.map((tc, ti) => (
                              <div key={ti} className="flex gap-2 text-[11px] font-mono">
                                <span className="text-[#6B6A78]">Input:</span>
                                <span className="text-[#EC4899]">{tc.input}</span>
                                <span className="text-[#6B6A78]">→</span>
                                <span className="text-[#34D399]">{tc.expectedOutput}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {!passed && (
                        <button
                          onClick={() => handleChallengePass(ch.id)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold text-white transition-all active:scale-95"
                          style={{
                            background: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)',
                            boxShadow: '0 4px 12px rgba(236,72,153,0.3)',
                          }}
                        >
                          <Check size={12} /> Mark as Solved
                        </button>
                      )}
                      {passed && (
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#FB923C]">
                          <Check size={12} /> Solved
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Projects View ─────────────────────────────────────────────────────────

function ProjectsView() {
  const { progress, curriculum } = useCurriculum();
  const { projects, activeProject, selectProject, completeMilestone, goBack } = useProjectTracker(progress);

  if (activeProject) {
    return (
      <div className="flex flex-col h-full" style={{ minWidth: 0 }}>
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.05] shrink-0">
          <button onClick={goBack} className="p-1.5 rounded-lg text-[#6B6A78] hover:text-[#A78BFA] hover:bg-white/[0.03] transition-all">
            <ArrowLeft size={16} />
          </button>
          <div>
            <h2 className="text-[16px] font-bold text-[#F5F5F7]">{activeProject.title}</h2>
            <p className="text-[11px] text-[#8B8A99]">{activeProject.description}</p>
          </div>
          {!activeProject.unlocked && (
            <span className="ml-auto text-[10px] px-2 py-1 rounded-lg bg-red-500/10 text-[#F87171] border border-red-500/20 font-bold">
              Locked
            </span>
          )}
        </div>

        {/* Locked state */}
        {!activeProject.unlocked && activeProject.missingTopics.length > 0 && (
          <div className="px-6 py-3 bg-red-500/5 border-b border-red-500/10 shrink-0">
            <p className="text-[11px] text-[#8B8A99]">
              Requires: {activeProject.missingTopics.join(', ')}
            </p>
          </div>
        )}

        {/* Milestones */}
        <div className="flex-1 overflow-y-auto p-6" style={{ minHeight: 0 }}>
          <div className="flex items-center gap-2 mb-4">
            <Trophy size={14} className="text-[#FB923C]" />
            <span className="text-[13px] font-bold text-[#F5F5F7]">Milestones</span>
            <span className="text-[10px] text-[#6B6A78]">
              ({activeProject.milestones.filter((m) => m.completed).length}/{activeProject.milestones.length})
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {activeProject.milestones.map((milestone, idx) => (
              <div
                key={milestone.id}
                className="p-4 rounded-xl border transition-all"
                style={{
                  background: '#14131A',
                  borderColor: milestone.completed ? 'rgba(52,211,153,0.3)' : 'rgba(255,255,255,0.04)',
                  opacity: !activeProject.unlocked && !milestone.completed ? 0.5 : 1,
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-[12px] font-bold"
                    style={{
                      background: milestone.completed ? 'rgba(52,211,153,0.15)' : 'rgba(139,92,246,0.15)',
                      color: milestone.completed ? '#34D399' : '#A78BFA',
                      border: `1px solid ${milestone.completed ? 'rgba(52,211,153,0.3)' : 'rgba(139,92,246,0.3)'}`,
                    }}
                  >
                    {milestone.completed ? '✓' : idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[13px] font-bold text-[#F5F5F7]">{milestone.title}</h4>
                    <p className="text-[11px] text-[#8B8A99] mt-1">{milestone.description}</p>
                  </div>
                  {activeProject.unlocked && !milestone.completed && (
                    <button
                      onClick={() => completeMilestone(milestone.id)}
                      className="shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-bold text-[#34D399] border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all"
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Starter code */}
          <div className="mt-6">
            <span className="text-[10px] font-bold text-[#6B6A78] uppercase tracking-wider mb-2 block">Starter Code</span>
            <pre className="text-[11px] font-mono text-[#C4C3D0] bg-[#1E1D27] p-4 rounded-xl overflow-x-auto border border-white/[0.03]">
              {activeProject.starterCode}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" style={{ minWidth: 0 }}>
      <div className="px-6 py-4 border-b border-white/[0.05] shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => {}} className="p-1.5 rounded-lg text-[#6B6A78] hover:text-[#A78BFA] hover:bg-white/[0.03] transition-all">
            <ArrowLeft size={16} />
          </button>
          <h2 className="text-[16px] font-bold text-[#F5F5F7]">Projects</h2>
        </div>
        <p className="text-[11px] text-[#8B8A99] mt-1">Multi-topic capstone projects to apply everything you've learned.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6" style={{ minHeight: 0 }}>
        <div className="grid grid-cols-1 gap-4">
          {projects.map((project) => (
            <button
              key={project.id}
              onClick={() => selectProject(project.id)}
              className="w-full text-left p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: '#1E1D27',
                borderColor: project.unlocked ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
                opacity: project.unlocked ? 1 : 0.6,
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-[14px] font-bold text-[#F5F5F7]">{project.title}</h3>
                <div className="flex items-center gap-2">
                  {!project.unlocked && <Lock size={12} className="text-[#F87171]" />}
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded" style={{ background: `${DIFFICULTY_CONFIG[project.difficulty]?.color || '#8B8A99'}15`, color: DIFFICULTY_CONFIG[project.difficulty]?.color || '#8B8A99' }}>
                    {DIFFICULTY_CONFIG[project.difficulty]?.label}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-[#8B8A99] mb-3">{project.description}</p>

              {/* Progress bar */}
              <div className="w-full h-1.5 rounded-full bg-[#14131A] mb-2 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${project.completionPercentage}%`, background: 'linear-gradient(90deg, #FB923C, #F472B6)' }} />
              </div>

              <div className="flex items-center justify-between text-[10px] text-[#6B6A78]">
                <span>{project.milestones.filter((m) => m.completed).length}/{project.milestones.length} milestones</span>
                <span className="font-bold text-[#FB923C]">{project.completionPercentage}%</span>
              </div>

              {!project.unlocked && (
                <div className="mt-3 text-[10px] text-[#F87171]">
                  Requires: {project.missingTopics.join(', ')}
                </div>
              )}

              {/* Required topics */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {project.requiredTopicIds.map((tid) => {
                  const topic = curriculum.topics[tid];
                  return topic ? (
                    <span key={tid} className="text-[9px] px-2 py-0.5 rounded-md bg-violet-500/10 text-[#A78BFA] border border-violet-500/20">
                      {topic.title}
                    </span>
                  ) : null;
                })}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Dependency Graph View ─────────────────────────────────────────────────

function DependencyGraphView() {
  const { curriculum, progress, goBack } = useCurriculum();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Simple SVG-based dependency graph (React Flow would be used in production)
  const nodeWidth = 160;
  const nodeHeight = 48;
  const hGap = 260;
  const vGap = 80;
  const startX = 40;
  const startY = 40;

  // Build node positions
  const positions: Record<string, { x: number; y: number; topic: any; status: string; mastery: number }> = {};
  for (let mi = 0; mi < curriculum.modules.length; mi++) {
    const module = curriculum.modules[mi];
    const x = startX + mi * hGap;
    for (let ti = 0; ti < module.topicIds.length; ti++) {
      const topicId = module.topicIds[ti];
      const topic = curriculum.topics[topicId];
      if (!topic) continue;
      const y = startY + ti * vGap;
      const tp = progress.topicProgress[topicId];
      const mastery = tp ? Math.round(
        ((tp.modeCompletion.explanationViewed ? 0.1 : 0) +
          (tp.modeCompletion.visualizationInteracted ? 0.1 : 0) +
          (tp.modeCompletion.exercisesTotal > 0 ? (tp.modeCompletion.exercisesPassed / tp.modeCompletion.exercisesTotal) * 0.4 : 0) +
          (tp.modeCompletion.challengesTotal > 0 ? (tp.modeCompletion.challengesPassed / tp.modeCompletion.challengesTotal) * 0.4 : 0)) * 100
      ) : 0;
      const status = !tp ? (topic.prerequisiteIds.length === 0 ? 'unlocked' : 'locked') : tp.status;

      positions[topicId] = { x, y, topic, status, mastery };
    }
  }

  // Build edges
  const edges: { from: string; to: string }[] = [];
  for (const topicId of Object.keys(curriculum.topics)) {
    const topic = curriculum.topics[topicId];
    for (const prereqId of topic.prerequisiteIds) {
      if (positions[prereqId]) {
        edges.push({ from: prereqId, to: topicId });
      }
    }
  }

  const selectedNode = selectedNodeId ? positions[selectedNodeId] : null;

  const svgWidth = startX + curriculum.modules.length * hGap + 100;
  const maxTopicsInModule = Math.max(...curriculum.modules.map((m) => m.topicIds.length));
  const svgHeight = startY + maxTopicsInModule * vGap + 100;

  return (
    <div className="flex flex-col h-full" style={{ minWidth: 0 }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.05] shrink-0">
        <button onClick={goBack} className="p-1.5 rounded-lg text-[#6B6A78] hover:text-[#A78BFA] hover:bg-white/[0.03] transition-all">
          <ArrowLeft size={16} />
        </button>
        <div className="flex items-center gap-2">
          <GitGraph size={16} className="text-[#A78BFA]" />
          <h2 className="text-[16px] font-bold text-[#F5F5F7]">Concept Dependency Graph</h2>
        </div>
        <span className="text-[10px] text-[#6B6A78] ml-auto">Click a node to see prerequisites</span>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 px-6 py-2 border-b border-white/[0.03] shrink-0">
        <span className="flex items-center gap-1.5 text-[10px] text-[#6B6A78]">
          <span className="w-3 h-3 rounded bg-[#6B6A78]/30 border border-[#6B6A78]/50" /> Locked
        </span>
        <span className="flex items-center gap-1.5 text-[10px] text-[#6B6A78]">
          <span className="w-3 h-3 rounded bg-[#A78BFA]/20 border border-[#A78BFA]/50" /> Unlocked
        </span>
        <span className="flex items-center gap-1.5 text-[10px] text-[#6B6A78]">
          <span className="w-3 h-3 rounded bg-[#34D399]/20 border border-[#34D399]/50" /> Completed
        </span>
        <span className="flex items-center gap-1.5 text-[10px] text-[#6B6A78]">
          <span className="w-3 h-3 rounded bg-[#8B5CF6]/30 border border-[#8B5CF6]/50" /> Mastered
        </span>
      </div>

      {/* Graph */}
      <div className="flex-1 overflow-auto p-4" style={{ minHeight: 0 }}>
        <svg width={svgWidth} height={svgHeight} className="min-w-full">
          {/* Edges */}
          {edges.map((edge) => {
            const from = positions[edge.from];
            const to = positions[edge.to];
            if (!from || !to) return null;
            const x1 = from.x + nodeWidth;
            const y1 = from.y + nodeHeight / 2;
            const x2 = to.x;
            const y2 = to.y + nodeHeight / 2;
            const midX = (x1 + x2) / 2;
            return (
              <path
                key={`${edge.from}-${edge.to}`}
                d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
                fill="none"
                stroke={from.status === 'mastered' && to.status === 'mastered' ? '#8B5CF6' : 'rgba(255,255,255,0.08)'}
                strokeWidth={from.status === 'mastered' ? 2 : 1}
                markerEnd="url(#arrowhead)"
              />
            );
          })}

          <defs>
            <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="rgba(255,255,255,0.15)" />
            </marker>
          </defs>

          {/* Nodes */}
          {Object.entries(positions).map(([id, node]) => {
            const bgColor = node.status === 'mastered'
              ? 'rgba(139,92,246,0.2)'
              : node.status === 'completed'
                ? 'rgba(52,211,153,0.15)'
                : node.status === 'locked'
                  ? 'rgba(107,106,120,0.15)'
                  : 'rgba(167,139,250,0.1)';
            const borderColor = node.status === 'mastered'
              ? '#8B5CF6'
              : node.status === 'completed'
                ? '#34D399'
                : node.status === 'locked'
                  ? 'rgba(107,106,120,0.4)'
                  : '#A78BFA';
            const textColor = node.status === 'locked' ? '#6B6A78' : '#F5F5F7';
            const isSelected = selectedNodeId === id;

            return (
              <g
                key={id}
                onClick={() => setSelectedNodeId(isSelected ? null : id)}
                className="cursor-pointer"
              >
                <rect
                  x={node.x}
                  y={node.y}
                  width={nodeWidth}
                  height={nodeHeight}
                  rx={10}
                  fill={bgColor}
                  stroke={isSelected ? '#EC4899' : borderColor}
                  strokeWidth={isSelected ? 2 : 1}
                />
                <text x={node.x + nodeWidth / 2} y={node.y + nodeHeight / 2 - 4} textAnchor="middle" fill={textColor} fontSize="11" fontWeight="600">
                  {node.topic.title.length > 18 ? node.topic.title.slice(0, 16) + '…' : node.topic.title}
                </text>
                <text x={node.x + nodeWidth / 2} y={node.y + nodeHeight / 2 + 10} textAnchor="middle" fill={node.mastery >= 80 ? '#8B5CF6' : '#6B6A78'} fontSize="9" fontWeight="500">
                  {node.mastery}% mastery
                </text>
              </g>
            );
          })}

          {/* Module labels */}
          {curriculum.modules.map((module, mi) => (
            <text
              key={module.id}
              x={startX + mi * hGap + nodeWidth / 2}
              y={startY - 15}
              textAnchor="middle"
              fill="#6B6A78"
              fontSize="11"
              fontWeight="600"
            >
              {module.title}
            </text>
          ))}
        </svg>
      </div>

      {/* Selected node detail */}
      {selectedNode && (
        <div className="px-6 py-3 border-t border-white/[0.05] shrink-0 bg-[#1E1D27]">
          <div className="flex items-center gap-3">
            <span className="text-[13px] font-bold text-[#F5F5F7]">{selectedNode.topic.title}</span>
            <span className="text-[10px] text-[#6B6A78]">{selectedNode.mastery}% mastery</span>
            {selectedNode.topic.prerequisiteIds.length > 0 && (
              <span className="text-[10px] text-[#6B6A78] ml-auto">
                Requires: {selectedNode.topic.prerequisiteIds.map((id: string) => curriculum.topics[id]?.title).filter(Boolean).join(', ')}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Curriculum View ──────────────────────────────────────────────────

const CurriculumView: React.FC = () => {
  const {
    curriculum,
    progress,
    overallProgress,
    nextRecommendedTopic,
    activeModuleId,
    view,
    selectTopic,
    selectModule,
    goToProjects,
    goToGraph,
    goBack,
  } = useCurriculum();

  if (view === 'topic') return <TopicDetailView />;
  if (view === 'projects') return <ProjectsView />;
  if (view === 'graph') return <DependencyGraphView />;

  return (
    <div className="flex flex-col h-full bg-[#14131A]" style={{ minWidth: 0 }}>
      {/* Header */}
      <div className="px-6 py-5 border-b border-white/[0.05] shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-[20px] font-bold text-[#F5F5F7]">Curriculum</h1>
            <p className="text-[12px] text-[#8B8A99] mt-0.5">Your structured learning path from fundamentals to advanced algorithms.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={goToGraph}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold text-[#8B8A99] border border-white/[0.06] bg-[#1E1D27] hover:text-[#A78BFA] hover:border-violet-500/20 transition-all"
            >
              <GitGraph size={13} />
              Dependency Graph
            </button>
            <button
              onClick={goToProjects}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold text-[#8B8A99] border border-white/[0.06] bg-[#1E1D27] hover:text-[#FB923C] hover:border-orange-500/20 transition-all"
            >
              <Trophy size={13} />
              Projects
            </button>
          </div>
        </div>

        {/* Overall progress */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="w-full h-2 rounded-full bg-[#1E1D27] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${overallProgress.overallPercentage}%`, background: 'linear-gradient(90deg, #8B5CF6, #A78BFA, #EC4899)' }}
              />
            </div>
          </div>
          <div className="text-right">
            <span className="text-[18px] font-bold text-[#A78BFA]">{overallProgress.overallPercentage}%</span>
            <span className="text-[10px] text-[#6B6A78] ml-1">
              ({overallProgress.completedTopics}/{overallProgress.totalTopics} topics)
            </span>
          </div>
        </div>

        {/* Next recommended */}
        {nextRecommendedTopic && (
          <button
            onClick={() => selectTopic(nextRecommendedTopic.id)}
            className="mt-3 flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11.5px] font-bold transition-all active:scale-95 w-fit"
            style={{
              background: 'rgba(139,92,246,0.1)',
              border: '1px solid rgba(139,92,246,0.3)',
              color: '#A78BFA',
            }}
          >
            <Sparkles size={13} />
            Continue: {nextRecommendedTopic.title}
            <ChevronRight size={13} />
          </button>
        )}
      </div>

      {/* Module Grid */}
      <div className="flex-1 overflow-y-auto p-6" style={{ minHeight: 0 }}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {curriculum.modules.map((module) => {
            const modProgress = overallProgress.moduleProgress.find((mp) => mp.moduleId === module.id);
            const isSelected = activeModuleId === module.id;

            return (
              <div key={module.id}>
                <ModuleCard
                  module={module}
                  topics={module.topicIds.map((tid) => {
                    const topicObj = curriculum.topics[tid];
                    if (!topicObj) return { id: tid, title: tid, status: 'locked' as const, masteryScore: 0 };
                    const tp = progress.topicProgress[tid];
                    const mastery = tp
                      ? Math.round(
                          ((tp.modeCompletion.explanationViewed ? 0.1 : 0) +
                            (tp.modeCompletion.visualizationInteracted ? 0.1 : 0) +
                            (tp.modeCompletion.exercisesTotal > 0 ? (tp.modeCompletion.exercisesPassed / tp.modeCompletion.exercisesTotal) * 0.4 : 0) +
                            (tp.modeCompletion.challengesTotal > 0 ? (tp.modeCompletion.challengesPassed / tp.modeCompletion.challengesTotal) * 0.4 : 0)) * 100
                        )
                      : 0;
                    const status = !tp
                      ? (topicObj.prerequisiteIds.length === 0 ? 'unlocked' as const : 'locked' as const)
                      : tp.status;
                    return { id: tid, title: topicObj.title, status, masteryScore: mastery };
                  })}
                  progress={modProgress || { completed: 0, total: module.topicIds.length }}
                  onClick={() => selectModule(isSelected ? '' : module.id)}
                />

                {/* Expanded topics */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden mt-2"
                    >
                      <div className="flex flex-col gap-1.5 pl-2">
                        {module.topicIds.map((tid) => {
                          const topic = curriculum.topics[tid];
                          if (!topic) return null;
                          const tp = progress.topicProgress[tid];
                          const status = !tp
                            ? (topic.prerequisiteIds.length === 0 ? 'unlocked' as const : 'locked' as const)
                            : tp.status;
                          const statusConfig = STATUS_CONFIG[status];

                          return (
                            <button
                              key={tid}
                              onClick={() => selectTopic(tid)}
                              className="flex items-center gap-2 px-3 py-2 rounded-xl text-[11.5px] transition-all text-left hover:bg-white/[0.03]"
                              style={{
                                background: status === 'locked' ? 'rgba(255,255,255,0.02)' : 'transparent',
                              }}
                            >
                              {status === 'locked' ? (
                                <Lock size={11} className="text-[#6B6A78]" />
                              ) : status === 'unlocked' ? (
                                <div className="w-2.5 h-2.5 rounded-full bg-[#A78BFA]" />
                              ) : (
                                <Check size={11} className="text-[#34D399]" />
                              )}
                              <span className={status === 'locked' ? 'text-[#6B6A78]' : 'text-[#C4C3D0]'}>
                                {topic.title}
                              </span>
                              <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded" style={{ background: `${statusConfig.color}15`, color: statusConfig.color }}>
                                {statusConfig.label}
                              </span>
                              <ChevronRight size={12} className="text-[#6B6A78] ml-1" />
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CurriculumView;
