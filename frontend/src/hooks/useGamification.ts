// ── Gamification Hooks ─────────────────────────────────────────────────────
// Modular hooks for XP, Leaderboard, Streak, Badges, and Competitions.
// Each can receive events from curriculum/AI systems to trigger XP awards
// and badge unlocks.

import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  calculateXp,
  xpToLevel,
  xpForNextLevel,
  xpProgressToNextLevel,
  checkBadgeUnlocks,
  scoreCompetition,
  getRarityConfig,
  DEMO_CURRENT_STUDENT,
  DEMO_LEADERBOARD,
  DEMO_STREAK_HEATMAP,
  DEMO_STREAK_FREEZE_USED,
  DEMO_STREAK_FREEZE_DAY,
  DEMO_STUDENT_BADGES,
  BADGE_CATALOG,
  DEMO_COMPETITIONS,
  DEMO_COMP_SUBMISSIONS_LIVE,
  DEMO_COMP_SUBMISSIONS_ENDED,
  DEMO_XP_LOG,
  type XpAction,
  type StudentStats,
  type LeaderboardScope,
  type LeaderboardWindow,
  type Competition,
  type CompetitionSubmission,
} from '../data/gamificationData';

// ─── useXp Hook ─────────────────────────────────────────────────────────────

export interface XpToast {
  id: string;
  xp: number;
  label: string;
  visible: boolean;
}

export function useXp() {
  const [student] = useState(() => DEMO_CURRENT_STUDENT);
  const [xpLog] = useState(() => DEMO_XP_LOG);
  const [toasts, setToasts] = useState<XpToast[]>([]);

  const level = xpToLevel(student.totalXp);
  const progress = xpProgressToNextLevel(student.totalXp);

  const awardXp = useCallback((action: XpAction) => {
    const result = calculateXp(action);
    if (result.xp <= 0) return;

    const toast: XpToast = {
      id: `toast-${Date.now()}`,
      xp: result.xp,
      label: result.label,
      visible: true,
    };
    setToasts((prev) => [...prev, toast]);

    // Auto-dismiss after 3s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toast.id));
    }, 3000);

    return result;
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return {
    student,
    level,
    progress,
    xpLog,
    toasts,
    awardXp,
    dismissToast,
  };
}

// ─── useLeaderboard Hook ────────────────────────────────────────────────────

export function useLeaderboard() {
  const [scope, setScope] = useState<LeaderboardScope>('global');
  const [window, setWindow] = useState<LeaderboardWindow>('week');
  const [allEntries] = useState(() => DEMO_LEADERBOARD);

  const VISIBLE_COUNT = 10;
  const visibleEntries = allEntries.slice(0, VISIBLE_COUNT);
  const isPinned = !allEntries.slice(0, VISIBLE_COUNT).some((e) => e.studentId === 'student_demo');
  const studentEntry = allEntries.find((e) => e.studentId === 'student_demo');

  return {
    entries: visibleEntries,
    allEntries,
    studentEntry,
    isPinned,
    scope,
    setScope,
    window,
    setWindow,
    studentRank: studentEntry?.rank || 0,
  };
}

// ─── useStreak Hook ─────────────────────────────────────────────────────────

export interface StreakDay {
  dayIndex: number; // 0 = 30 days ago, 29 = today
  active: boolean;
  isFreeze?: boolean;
}

export function useStreak() {
  const [student] = useState(() => DEMO_CURRENT_STUDENT);
  const [heatmap] = useState(() => DEMO_STREAK_HEATMAP);
  const [freezeUsed] = useState(() => DEMO_STREAK_FREEZE_USED);
  const [freezeDay] = useState(() => DEMO_STREAK_FREEZE_DAY);
  const [streakFreezesPerWeek] = useState(1);

  const days: StreakDay[] = heatmap.map((val, i) => ({
    dayIndex: i,
    active: val === 1,
    isFreeze: freezeUsed && i === freezeDay,
  }));

  // Activity needed for today (has the student already been active today?)
  const isTodayActive = heatmap[29] === 1;

  return {
    currentStreak: student.currentStreak,
    longestStreak: student.longestStreak,
    days,
    isTodayActive,
    freezeUsed,
    freezeDay,
    streakFreezesPerWeek,
  };
}

// ─── useBadges Hook ─────────────────────────────────────────────────────────

export function useBadges() {
  const [student] = useState(() => DEMO_CURRENT_STUDENT);
  const [catalog] = useState(() => BADGE_CATALOG);
  const [earned] = useState(() => DEMO_STUDENT_BADGES);
  const [newlyUnlocked, setNewlyUnlocked] = useState<string | null>(null);

  const earnedBadgeIds = new Set(earned.map((b) => b.badgeId));

  // Check what badges the student qualifies for
  const unlockedBadgeIds = useMemo(() => {
    return checkBadgeUnlocks(student.stats);
  }, [student.stats]);

  // Merge earned + newly qualified
  const allUnlockedIds = useMemo(() => {
    const ids = new Set(earnedBadgeIds);
    unlockedBadgeIds.forEach((id) => ids.add(id));
    return ids;
  }, [earnedBadgeIds, unlockedBadgeIds]);

  const badges = useMemo(() => {
    return catalog.map((badge) => ({
      ...badge,
      unlocked: allUnlockedIds.has(badge.id),
      earnedAt: earned.find((b) => b.badgeId === badge.id)?.unlockedAt,
      rarityConfig: getRarityConfig(badge.rarity),
    }));
  }, [catalog, allUnlockedIds, earned]);

  // Unlock animation trigger
  const triggerUnlock = useCallback((badgeId: string) => {
    setNewlyUnlocked(badgeId);
    setTimeout(() => setNewlyUnlocked(null), 4000);
  }, []);

  // Check for newly qualified badges
  useEffect(() => {
    const newlyQualified = unlockedBadgeIds.filter((id) => !earnedBadgeIds.has(id));
    if (newlyQualified.length > 0) {
      triggerUnlock(newlyQualified[0]);
    }
  }, [unlockedBadgeIds, earnedBadgeIds, triggerUnlock]);

  const rarityCounts = useMemo(() => {
    const counts: Record<string, number> = { common: 0, rare: 0, epic: 0, legendary: 0 };
    badges.forEach((b) => { if (b.unlocked) counts[b.rarity]++; });
    return counts;
  }, [badges]);

  return {
    badges,
    newlyUnlocked,
    rarityCounts,
    totalUnlocked: allUnlockedIds.size,
    totalCatalog: catalog.length,
    dismissUnlock: () => setNewlyUnlocked(null),
  };
}

// ─── useCompetitions Hook ───────────────────────────────────────────────────

export function useCompetitions() {
  const [competitions] = useState(() => DEMO_COMPETITIONS);
  const [liveSubmissions] = useState(() => DEMO_COMP_SUBMISSIONS_LIVE);
  const [endedSubmissions] = useState(() => DEMO_COMP_SUBMISSIONS_ENDED);
  const [selectedCompId, setSelectedCompId] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());

  // Update "now" every second for live countdowns
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const liveCompetition = competitions.find((c) => c.status === 'live' && c.id === selectedCompId) || competitions.find((c) => c.status === 'live');
  const upcomingCompetition = competitions.find((c) => c.status === 'upcoming');

  const rankedLive = useMemo(() => scoreCompetition(liveSubmissions), [liveSubmissions]);
  const rankedEnded = useMemo(() => scoreCompetition(endedSubmissions), [endedSubmissions]);

  const studentLiveRank = rankedLive.findIndex((s) => s.studentId === 'student_demo') + 1;
  const studentEndedRank = rankedEnded.findIndex((s) => s.studentId === 'student_demo') + 1;
  const studentEndedSubmission = rankedEnded.find((s) => s.studentId === 'student_demo');

  return {
    competitions,
    liveCompetition,
    upcomingCompetition,
    rankedLive,
    rankedEnded,
    studentLiveRank,
    studentEndedRank,
    studentEndedSubmission,
    selectedCompId,
    setSelectedCompId,
    now,
  };
}
