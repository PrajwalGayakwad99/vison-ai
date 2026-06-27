// ── useCurriculum Hook ─────────────────────────────────────────────────────
// Central curriculum state management: progress tracking, topic selection,
// mode switching, and recommendation logic.

import { useState, useCallback, useMemo } from 'react';
import { CURRICULUM } from '../data/curriculumData';
import type {
  Curriculum,
  Topic,
  TopicStatus,
  ModeCompletion,
  StudentProgress,
  StudentTopicProgress,
} from '../data/curriculumData';
import {
  canUnlock,
  resolveStatus,
  getNextRecommendedTopic,
  computeCurriculumProgress,
  getMissingPrerequisiteTitles,
} from '../lib/curriculumGraph';
import { calcMasteryScore, MASTERY_THRESHOLD } from '../data/curriculumData';

// Default empty progress
function createDefaultProgress(): StudentProgress {
  return {
    studentId: 'default',
    topicProgress: {},
    projectProgress: {},
    cachedAiProblems: {},
  };
}

// Load from localStorage or create default
function loadProgress(): StudentProgress {
  try {
    const raw = localStorage.getItem('axiom-curriculum-progress');
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return createDefaultProgress();
}

function saveProgress(progress: StudentProgress) {
  try {
    localStorage.setItem('axiom-curriculum-progress', JSON.stringify(progress));
  } catch { /* ignore */ }
}

export function useCurriculum() {
  const [progress, setProgress] = useState<StudentProgress>(loadProgress);
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<'learn' | 'visualize' | 'practice' | 'challenge'>('learn');
  const [view, setView] = useState<'overview' | 'topic' | 'projects' | 'graph'>('overview');

  // Persist on every change
  const updateProgress = useCallback((updater: (p: StudentProgress) => StudentProgress) => {
    setProgress((prev) => {
      const next = updater(prev);
      saveProgress(next);
      return next;
    });
  }, []);

  // ── Derived Data ──────────────────────────────────────────────────────

  const curriculum: Curriculum = CURRICULUM;

  const nextRecommendedTopic = useMemo(
    () => getNextRecommendedTopic(curriculum, progress),
    [curriculum, progress]
  );

  const overallProgress = useMemo(
    () => computeCurriculumProgress(curriculum, progress),
    [curriculum, progress]
  );

  const activeTopic: Topic | null = useMemo(
    () => (activeTopicId ? curriculum.topics[activeTopicId] || null : null),
    [curriculum, activeTopicId]
  );

  const activeTopicStatus: TopicStatus = useMemo(() => {
    if (!activeTopic) return 'locked';
    return resolveStatus(activeTopic, progress);
  }, [activeTopic, progress]);

  const activeTopicMastery: number = useMemo(() => {
    if (!activeTopicId) return 0;
    const tp = progress.topicProgress[activeTopicId];
    return tp ? calcMasteryScore(tp.modeCompletion) : 0;
  }, [activeTopicId, progress]);

  const activeTopicProgress: ModeCompletion = useMemo(() => {
    if (!activeTopicId) return { explanationViewed: false, visualizationInteracted: false, exercisesPassed: 0, exercisesTotal: 0, challengesPassed: 0, challengesTotal: 0 };
    const tp = progress.topicProgress[activeTopicId];
    if (!tp) {
      // Initialize from topic data
      const topic = curriculum.topics[activeTopicId];
      return {
        explanationViewed: false,
        visualizationInteracted: false,
        exercisesPassed: 0,
        exercisesTotal: topic?.exercises.length || 0,
        challengesPassed: 0,
        challengesTotal: topic?.challenges.length || 0,
      };
    }
    return tp.modeCompletion;
  }, [activeTopicId, progress, curriculum]);

  const activeTopicMissingPrereqs: string[] = useMemo(() => {
    if (!activeTopic) return [];
    return getMissingPrerequisiteTitles(activeTopic, curriculum, progress);
  }, [activeTopic, curriculum, progress]);

  // ── Actions ───────────────────────────────────────────────────────────

  const selectTopic = useCallback((topicId: string) => {
    setActiveTopicId(topicId);
    setView('topic');
    setActiveMode('learn');

    // Mark as in-progress if it was unlocked
    updateProgress((p) => {
      if (!p.topicProgress[topicId]) {
        const topic = curriculum.topics[topicId];
        const { unlocked } = canUnlock(topic, p);
        if (!unlocked) return p; // can't select locked topics
        p.topicProgress[topicId] = {
          topicId,
          status: 'in-progress',
          modeCompletion: {
            explanationViewed: false,
            visualizationInteracted: false,
            exercisesPassed: 0,
            exercisesTotal: topic.exercises.length,
            challengesPassed: 0,
            challengesTotal: topic.challenges.length,
          },
          lastAccessed: Date.now(),
          timeSpentMinutes: 0,
          assessmentScores: [],
        };
      }
      return p;
    });
  }, [curriculum, updateProgress]);

  const selectModule = useCallback((moduleId: string) => {
    setActiveModuleId(moduleId);
  }, []);

  const setMode = useCallback((mode: 'learn' | 'visualize' | 'practice' | 'challenge') => {
    setActiveMode(mode);
  }, []);

  // Mark explanation as viewed
  const markExplanationViewed = useCallback(() => {
    if (!activeTopicId) return;
    updateProgress((p) => {
      const tp = p.topicProgress[activeTopicId];
      if (!tp) return p;
      tp.modeCompletion.explanationViewed = true;
      // Update status based on mastery
      const score = calcMasteryScore(tp.modeCompletion);
      tp.status = score >= MASTERY_THRESHOLD ? 'mastered' : score > 0 ? 'in-progress' : tp.status;
      return p;
    });
  }, [activeTopicId, updateProgress]);

  const markVisualizationInteracted = useCallback(() => {
    if (!activeTopicId) return;
    updateProgress((p) => {
      const tp = p.topicProgress[activeTopicId];
      if (!tp) return p;
      tp.modeCompletion.visualizationInteracted = true;
      const score = calcMasteryScore(tp.modeCompletion);
      tp.status = score >= MASTERY_THRESHOLD ? 'mastered' : 'in-progress';
      return p;
    });
  }, [activeTopicId, updateProgress]);

  const markExercisePassed = useCallback((exerciseId: string) => {
    if (!activeTopicId) return;
    updateProgress((p) => {
      const tp = p.topicProgress[activeTopicId];
      if (!tp) return p;
      // Check if already counted
      const topic = curriculum.topics[activeTopicId];
      const exerciseIndex = topic.exercises.findIndex((e) => e.id === exerciseId);
      if (exerciseIndex === -1) return p;

      // Track passed exercises (simple: count unique passed)
      const passedKey = `passed:${exerciseId}`;
      if ((tp as any)[passedKey]) return p; // already counted
      (tp as any)[passedKey] = true;
      tp.modeCompletion.exercisesPassed = Math.min(
        tp.modeCompletion.exercisesPassed + 1,
        tp.modeCompletion.exercisesTotal
      );
      const score = calcMasteryScore(tp.modeCompletion);
      tp.status = score >= MASTERY_THRESHOLD ? 'mastered' : 'in-progress';
      return p;
    });
  }, [activeTopicId, curriculum, updateProgress]);

  const markChallengePassed = useCallback((challengeId: string) => {
    if (!activeTopicId) return;
    updateProgress((p) => {
      const tp = p.topicProgress[activeTopicId];
      if (!tp) return p;
      const passedKey = `passed:${challengeId}`;
      if ((tp as any)[passedKey]) return p;
      (tp as any)[passedKey] = true;
      tp.modeCompletion.challengesPassed = Math.min(
        tp.modeCompletion.challengesPassed + 1,
        tp.modeCompletion.challengesTotal
      );
      const score = calcMasteryScore(tp.modeCompletion);
      tp.status = score >= MASTERY_THRESHOLD ? 'mastered' : 'in-progress';
      return p;
    });
  }, [activeTopicId, updateProgress]);

  // AI-generated exercise caching
  const addCachedAiProblem = useCallback((topicId: string, exercises: { id: string; title: string; description: string; starterCode: string; solution: string; testCases: { input: string; expectedOutput: string }[]; difficulty: string; aiGenerated: true }[]) => {
    updateProgress((p) => {
      if (!p.cachedAiProblems[topicId]) {
        p.cachedAiProblems[topicId] = [];
      }
      // Deduplicate by title
      const existing = p.cachedAiProblems[topicId];
      const newExercises = exercises.filter(
        (e) => !existing.some((ex) => ex.title === e.title)
      );
      p.cachedAiProblems[topicId].push(...newExercises);
      return p;
    });
  }, [updateProgress]);

  const getCachedAiProblems = useCallback((topicId: string) => {
    return progress.cachedAiProblems[topicId] || [];
  }, [progress]);

  // Navigate back
  const goBack = useCallback(() => {
    setView('overview');
    setActiveTopicId(null);
  }, []);

  // Switch to projects view
  const goToProjects = useCallback(() => {
    setView('projects');
  }, []);

  // Switch to dependency graph view
  const goToGraph = useCallback(() => {
    setView('graph');
  }, []);

  return {
    // Data
    curriculum,
    progress,
    overallProgress,
    nextRecommendedTopic,
    activeTopic,
    activeTopicStatus,
    activeTopicMastery,
    activeTopicProgress,
    activeTopicMissingPrereqs,
    activeModuleId,

    // State
    activeTopicId,
    activeMode,
    view,

    // Actions
    selectTopic,
    selectModule,
    setMode,
    markExplanationViewed,
    markVisualizationInteracted,
    markExercisePassed,
    markChallengePassed,
    addCachedAiProblem,
    getCachedAiProblems,
    goBack,
    goToProjects,
    goToGraph,
    setView,
  };
}
