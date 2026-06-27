// ── Gamification Data ─────────────────────────────────────────────────────
// Full demo data for XP system, leaderboards, streaks, badges, and competitions.
// Consistent with the 8 demo students from collabSeedData.ts.

import { DEMO_STUDENTS } from './collabSeedData';

// ─── Types ──────────────────────────────────────────────────────────────────

export type XpAction =
  | { type: 'lesson_complete' }
  | { type: 'exercise_pass' }
  | { type: 'challenge_pass' }
  | { type: 'project_milestone' }
  | { type: 'competition_win'; rank: number; participantCount: number }
  | { type: 'streak_bonus'; days: number };

export type BadgeType =
  | { type: 'topic_mastery'; topic_id: string; threshold: number }
  | { type: 'streak'; days: number }
  | { type: 'challenges_completed'; count: number }
  | { type: 'exercises_in_day'; count: number }
  | { type: 'study_after_10pm'; count: number }
  | { type: 'join_group' }
  | { type: 'helpful_reviews'; count: number }
  | { type: 'debug_errors'; count: number }
  | { type: 'topic_combo_mastery'; topic_ids: string[]; threshold: number }
  | { type: 'weekly_top_n'; n: number };

export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: BadgeRarity;
  criteria: BadgeType;
}

export interface StudentBadge {
  badgeId: string;
  studentId: string;
  unlockedAt: number;
}

export interface LeaderboardEntry {
  rank: number;
  studentId: string;
  displayName: string;
  avatarColor: string;
  xp: number;
  level: number;
  currentStreak: number;
  trend: 'up' | 'down' | 'none';
  trendAmount?: number;
}

export type LeaderboardScope = 'global' | 'group' | 'topic';
export type LeaderboardWindow = 'all_time' | 'month' | 'week';

export interface CompetitionProblem {
  id: string;
  title: string;
  points: number;
  hidden?: boolean;
}

export type CompetitionStatus = 'upcoming' | 'live' | 'ended';

export interface Competition {
  id: string;
  title: string;
  description: string;
  type: 'weekly' | 'live';
  problems: CompetitionProblem[];
  startTime: number;
  endTime: number;
  durationMinutes: number;
  status: CompetitionStatus;
  participantCount: number;
}

export interface CompetitionSubmission {
  competitionId: string;
  studentId: string;
  studentName: string;
  avatarColor: string;
  problemsSolved: number;
  totalPoints: number;
  totalTimeSeconds: number;
  problemTimes: Record<string, number>; // problemId -> seconds to solve
}

// ─── XP Calculation ─────────────────────────────────────────────────────────

const XP_TABLE: Record<string, number> = {
  lesson_complete: 10,
  exercise_pass: 15,
  challenge_pass: 30,
  project_milestone: 50,
};

export function calculateXp(action: XpAction): { xp: number; label: string } {
  switch (action.type) {
    case 'lesson_complete':
      return { xp: XP_TABLE.lesson_complete, label: 'Lesson Completed' };
    case 'exercise_pass':
      return { xp: XP_TABLE.exercise_pass, label: 'Exercise Completed' };
    case 'challenge_pass':
      return { xp: XP_TABLE.challenge_pass, label: 'Challenge Completed' };
    case 'project_milestone':
      return { xp: XP_TABLE.project_milestone, label: 'Project Milestone' };
    case 'competition_win': {
      const { rank, participantCount } = action;
      const pct = rank / participantCount;
      let xp = 100;
      if (rank === 1) xp = 500;
      else if (rank <= 3) xp = 300;
      else if (rank <= 10) xp = 200;
      else if (pct <= 0.25) xp = 150;
      else if (pct <= 0.5) xp = 100;
      return { xp, label: `Competition Rank #${rank}` };
    }
    case 'streak_bonus':
      return { xp: action.days >= 3 ? 5 : 0, label: `Streak Bonus (${action.days} days)` };
    default:
      return { xp: 0, label: 'Unknown' };
  }
}

// Level = floor(sqrt(totalXp / 100))
export function xpToLevel(totalXp: number): number {
  return Math.floor(Math.sqrt(totalXp / 100));
}

export function xpForNextLevel(level: number): number {
  return (level + 1) * (level + 1) * 100;
}

export function xpProgressToNextLevel(totalXp: number): { current: number; needed: number; pct: number } {
  const level = xpToLevel(totalXp);
  const currentLevelXp = level * level * 100;
  const nextLevelXp = (level + 1) * (level + 1) * 100;
  const current = totalXp - currentLevelXp;
  const needed = nextLevelXp - currentLevelXp;
  return { current, needed, pct: Math.min(100, Math.round((current / needed) * 100)) };
}

// ─── Badge Catalog ──────────────────────────────────────────────────────────

export const BADGE_CATALOG: Badge[] = [
  // Common
  { id: 'badge-first-steps', name: 'First Steps', description: 'Complete your first lesson', icon: '👣', rarity: 'common', criteria: { type: 'topic_mastery', topic_id: 'variables', threshold: 10 } },
  { id: 'badge-quick-learner', name: 'Quick Learner', description: 'Complete 5 exercises in one day', icon: '', rarity: 'common', criteria: { type: 'exercises_in_day', count: 5 } },
  { id: 'badge-night-owl', name: 'Night Owl', description: 'Study after 10pm at least 5 times', icon: '🦉', rarity: 'common', criteria: { type: 'study_after_10pm', count: 5 } },
  { id: 'badge-team-player', name: 'Team Player', description: 'Join your first study group', icon: '🤝', rarity: 'common', criteria: { type: 'join_group' } },
  // Rare
  { id: 'badge-recursion-master', name: 'Recursion Master', description: 'Achieve 100% mastery on Recursion', icon: '🔄', rarity: 'rare', criteria: { type: 'topic_mastery', topic_id: 'recursion', threshold: 100 } },
  { id: 'badge-7day-streak', name: '7-Day Streak', description: 'Maintain a learning streak for 7 days', icon: '🔥', rarity: 'rare', criteria: { type: 'streak', days: 7 } },
  { id: 'badge-helpful-hand', name: 'Helpful Hand', description: 'Get 10 helpful marks on peer reviews', icon: '', rarity: 'rare', criteria: { type: 'helpful_reviews', count: 10 } },
  { id: 'badge-bug-hunter', name: 'Bug Hunter', description: 'Debug 25 errors using AI Debug Assistant', icon: '🐛', rarity: 'rare', criteria: { type: 'debug_errors', count: 25 } },
  // Epic
  { id: 'badge-30day-streak', name: '30-Day Streak', description: 'Maintain a learning streak for 30 days', icon: '', rarity: 'epic', criteria: { type: 'streak', days: 30 } },
  { id: 'badge-tree-climber', name: 'Tree Climber', description: 'Master both Trees and Graphs topics', icon: '🌳', rarity: 'epic', criteria: { type: 'topic_combo_mastery', topic_ids: ['trees', 'graphs'], threshold: 80 } },
  { id: 'badge-top-10-weekly', name: 'Top 10 Weekly', description: 'Finish in the top 10 of a weekly challenge', icon: '🏅', rarity: 'epic', criteria: { type: 'weekly_top_n', n: 10 } },
  // Legendary
  { id: 'badge-algo-sage', name: 'Algorithm Sage', description: 'Master all topics in the DSA learning path', icon: '👑', rarity: 'legendary', criteria: { type: 'topic_combo_mastery', topic_ids: ['variables-data-types', 'conditionals', 'loops', 'arrays-lists', 'functions', 'recursion', 'linked-lists', 'stacks-queues', 'hash-maps', 'trees', 'graphs', 'dijkstra'], threshold: 80 } },
];

const RARITY_COLORS: Record<BadgeRarity, { bg: string; border: string; text: string; glow: string }> = {
  common: { bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.2)', text: '#A78BFA', glow: '' },
  rare: { bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.3)', text: '#60A5FA', glow: '0 0 12px rgba(96,165,250,0.2)' },
  epic: { bg: 'rgba(251,146,60,0.08)', border: 'rgba(251,146,60,0.3)', text: '#FB923C', glow: '0 0 16px rgba(251,146,60,0.25)' },
  legendary: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.5)', text: '#F59E0B', glow: '0 0 20px rgba(245,158,11,0.3)' },
};

export function getRarityConfig(rarity: BadgeRarity) {
  return RARITY_COLORS[rarity];
}

// ── Badge Unlock Checker ───────────────────────────────────────────────────

export interface StudentStats {
  studentId: string;
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  exercisesCompleted: number;
  challengesCompleted: number;
  lessonsCompleted: number;
  topicsMastered: string[]; // topic IDs with 100% mastery
  topicsAtThreshold: Record<string, number>; // topicId -> mastery%
  helpfulReviews: number;
  debugErrorsFixed: number;
  studySessionsAfter10pm: number;
  groupsJoined: number;
  weeklyChallengeBestRank: number; // best ever rank in weekly challenges
}

export function checkBadgeUnlocks(stats: StudentStats): string[] {
  const unlocked: string[] = [];
  for (const badge of BADGE_CATALOG) {
    const c = badge.criteria;
    switch (c.type) {
      case 'topic_mastery':
        if ((stats.topicsAtThreshold[c.topic_id] || 0) >= c.threshold) unlocked.push(badge.id);
        break;
      case 'streak':
        if (stats.currentStreak >= c.days) unlocked.push(badge.id);
        break;
      case 'challenges_completed':
        if (stats.challengesCompleted >= c.count) unlocked.push(badge.id);
        break;
      case 'exercises_in_day':
        if (stats.exercisesCompleted >= c.count) unlocked.push(badge.id);
        break;
      case 'study_after_10pm':
        if (stats.studySessionsAfter10pm >= c.count) unlocked.push(badge.id);
        break;
      case 'join_group':
        if (stats.groupsJoined >= 1) unlocked.push(badge.id);
        break;
      case 'helpful_reviews':
        if (stats.helpfulReviews >= c.count) unlocked.push(badge.id);
        break;
      case 'debug_errors':
        if (stats.debugErrorsFixed >= c.count) unlocked.push(badge.id);
        break;
      case 'topic_combo_mastery':
        if (c.topic_ids.every((tid) => (stats.topicsAtThreshold[tid] || 0) >= c.threshold)) unlocked.push(badge.id);
        break;
      case 'weekly_top_n':
        if (stats.weeklyChallengeBestRank <= c.n && stats.weeklyChallengeBestRank > 0) unlocked.push(badge.id);
        break;
    }
  }
  return unlocked;
}

// ─── Competition Scoring ────────────────────────────────────────────────────

export function scoreCompetition(submissions: CompetitionSubmission[]): CompetitionSubmission[] {
  return [...submissions].sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
    return a.totalTimeSeconds - b.totalTimeSeconds;
  });
}

// ─── Demo: Current Student ──────────────────────────────────────────────────

export const DEMO_CURRENT_STUDENT = {
  id: 'student_demo',
  displayName: 'Alex Chen',
  avatarColor: '#8B5CF6',
  totalXp: 4280,
  level: xpToLevel(4280), // 6
  currentStreak: 12,
  longestStreak: 23,
  rankGlobal: 47,
  stats: {
    studentId: 'student_demo',
    totalXp: 4280,
    currentStreak: 12,
    longestStreak: 23,
    exercisesCompleted: 47,
    challengesCompleted: 12,
    lessonsCompleted: 23,
    topicsMastered: ['variables-data-types', 'conditionals', 'loops'],
    topicsAtThreshold: {
      'variables-data-types': 100,
      'conditionals': 100,
      'loops': 95,
      'arrays-lists': 72,
      'functions': 60,
      'recursion': 45,
      'linked-lists': 30,
      'hash-maps': 20,
    },
    helpfulReviews: 8,
    debugErrorsFixed: 15,
    studySessionsAfter10pm: 6,
    groupsJoined: 2,
    weeklyChallengeBestRank: 7,
  } as StudentStats,
};

// ─── Demo: Leaderboard ──────────────────────────────────────────────────────

const NOW = Date.now();
const DAY = 86400000;

// Use names from collabSeedData + create additional ones for continuity
const LEADERBOARD_NAMES = [
  { studentId: 'stu-5', displayName: 'Priya Sharma', avatarColor: '#60A5FA', xp: 8920, streak: 28 },
  { studentId: 'stu-1', displayName: 'Aisha Patel', avatarColor: '#8B5CF6', xp: 7650, streak: 19 },
  { studentId: 'stu-3', displayName: 'Sofia Rodriguez', avatarColor: '#EC4899', xp: 6800, streak: 15 },
  { studentId: 'stu-2', displayName: 'Marcus Chen', avatarColor: '#34D399', xp: 5940, streak: 22 },
  { studentId: 'stu-7', displayName: 'Emma Wilson', avatarColor: '#A78BFA', xp: 5120, streak: 11 },
  { studentId: 'student_demo', displayName: 'Alex Chen', avatarColor: '#8B5CF6', xp: 4280, streak: 12 },
  { studentId: 'stu-4', displayName: 'Jake Thompson', avatarColor: '#F59E0B', xp: 3900, streak: 8 },
  { studentId: 'stu-6', displayName: 'Dev Patel', avatarColor: '#F87171', xp: 3200, streak: 5 },
  { studentId: 'stu-8', displayName: 'Ryan Kim', avatarColor: '#2DD4BF', xp: 2800, streak: 3 },
  // Additional students to fill top 15
  { studentId: 'ext-1', displayName: 'Jordan Lee', avatarColor: '#F472B6', xp: 2500, streak: 7 },
  { studentId: 'ext-2', displayName: 'Maya Singh', avatarColor: '#34D399', xp: 2200, streak: 4 },
  { studentId: 'ext-3', displayName: 'Chris Park', avatarColor: '#F59E0B', xp: 1900, streak: 6 },
  { studentId: 'ext-4', displayName: 'Zara Ahmed', avatarColor: '#60A5FA', xp: 1700, streak: 2 },
  { studentId: 'ext-5', displayName: 'Liam Foster', avatarColor: '#A78BFA', xp: 1500, streak: 1 },
  { studentId: 'ext-6', displayName: 'Nina Kowalski', avatarColor: '#FB923C', xp: 1300, streak: 3 },
];

// Sort by XP descending
const sortedLeaderboard = [...LEADERBOARD_NAMES]
  .sort((a, b) => b.xp - a.xp)
  .map((entry, i) => ({
    ...entry,
    rank: i + 1,
    level: xpToLevel(entry.xp),
  }));

// Add trend indicators (randomized but deterministic based on rank changes)
const trends: Array<'up' | 'down' | 'none'> = ['up', 'up', 'down', 'none', 'up', 'down', 'none', 'up', 'down', 'none', 'up', 'down', 'none', 'up', 'down'];

export const DEMO_LEADERBOARD: LeaderboardEntry[] = sortedLeaderboard.map((entry, i) => ({
  rank: entry.rank,
  studentId: entry.studentId,
  displayName: entry.displayName,
  avatarColor: entry.avatarColor,
  xp: entry.xp,
  level: entry.level,
  currentStreak: entry.streak,
  trend: trends[i] || 'none',
  trendAmount: Math.floor(Math.random() * 3) + 1,
}));

// ─── Demo: Streak Heatmap ───────────────────────────────────────────────────
// 30 days: index 0 = 30 days ago, index 29 = today
// 12-day current streak (days 19-30 active), gap of 2 days around day 12-13

const HEATMAP: number[] = Array(30).fill(0);
// Days 0-10: mostly active with some gaps
[0, 1, 2, 4, 5, 6, 8, 9, 10].forEach((d) => { HEATMAP[d] = 1; });
// Days 11-12: GAP (missed 2 days)
HEATMAP[11] = 0;
HEATMAP[12] = 0;
// Day 13: streak freeze used
// Days 14-18: active
[14, 15, 16, 17, 18].forEach((d) => { HEATMAP[d] = 1; });
// Days 19-29: current 12-day streak
for (let d = 19; d < 30; d++) HEATMAP[d] = 1;

export const DEMO_STREAK_HEATMAP = HEATMAP;
export const DEMO_STREAK_FREEZE_USED = true;
export const DEMO_STREAK_FREEZE_DAY = 13; // 17 days ago

// ─── Demo: Student Badges ───────────────────────────────────────────────────

// Demo student has these 6 unlocked:
// - badge-first-steps (common) — completed first lesson ✓
// - badge-team-player (common) — joined study group ✓
// - badge-night-owl (common) — studied after 10pm 6 times ✓
// - badge-7day-streak (rare) — 12 day streak ✓
// - badge-helpful-hand (rare) — 8 helpful reviews (needs 10, so LOCKED actually — let me fix)
// Actually let me match the criteria to the demo stats:

// Unlocked based on stats:
// First Steps: topicsAtThreshold['variables'] >= 10 → YES (100)
// Quick Learner: exercisesCompleted >= 5 → YES (47)
// Night Owl: studySessionsAfter10pm >= 5 → YES (6)
// Team Player: groupsJoined >= 1 → YES (2)
// 7-Day Streak: currentStreak >= 7 → YES (12)
// Helpful Hand: helpfulReviews >= 10 → NO (8) — LOCKED
// 30-Day Streak: currentStreak >= 30 → NO (12) — LOCKED
// Tree Climber: trees>=80 AND graphs>=80 → NO — LOCKED
// Top 10 Weekly: bestRank <= 10 → YES (7)
// Recursion Master: recursion >= 100 → NO (45) — LOCKED
// Bug Hunter: debugErrors >= 25 → NO (15) — LOCKED
// Algorithm Sage: all 12 topics >= 80 → NO — LOCKED

// So unlocked: First Steps, Quick Learner, Night Owl, Team Player, 7-Day Streak, Top 10 Weekly (6 unlocked)
// Locked: Helpful Hand, 30-Day Streak, Tree Climber, Recursion Master, Bug Hunter, Algorithm Sage (6 locked)

export const DEMO_STUDENT_BADGES: StudentBadge[] = [
  { badgeId: 'badge-first-steps', studentId: 'student_demo', unlockedAt: NOW - DAY * 45 },
  { badgeId: 'badge-quick-learner', studentId: 'student_demo', unlockedAt: NOW - DAY * 30 },
  { badgeId: 'badge-night-owl', studentId: 'student_demo', unlockedAt: NOW - DAY * 20 },
  { badgeId: 'badge-team-player', studentId: 'student_demo', unlockedAt: NOW - DAY * 14 },
  { badgeId: 'badge-7day-streak', studentId: 'student_demo', unlockedAt: NOW - DAY * 12 },
  { badgeId: 'badge-top-10-weekly', studentId: 'student_demo', unlockedAt: NOW - DAY * 3 },
];

// ─── Demo: Competitions ─────────────────────────────────────────────────────

const THREE_DAYS_AGO = NOW - DAY * 3;
const FOUR_DAYS_FROM_NOW = NOW + DAY * 4;
const TWO_DAYS_FROM_NOW = NOW + DAY * 2;
const LAST_WEEK_START = NOW - DAY * 10;
const LAST_WEEK_END = NOW - DAY * 3;

export const DEMO_COMPETITIONS: Competition[] = [
  {
    id: 'comp-1',
    title: 'Weekly Challenge: Graph Traversal',
    description: 'Test your graph knowledge with BFS, shortest path, and cycle detection problems.',
    type: 'weekly',
    problems: [
      { id: 'prob-1', title: 'BFS Basics', points: 100 },
      { id: 'prob-2', title: 'Shortest Path in Unweighted Graph', points: 150 },
      { id: 'prob-3', title: 'Cycle Detection in Directed Graph', points: 200 },
    ],
    startTime: THREE_DAYS_AGO,
    endTime: FOUR_DAYS_FROM_NOW,
    durationMinutes: 7 * 24 * 60, // 1 week
    status: 'live',
    participantCount: 142,
  },
  {
    id: 'comp-2',
    title: 'Friday Night Live Code-Off',
    description: 'Real-time competitive coding! 4 problems, 90 minutes, live leaderboard. Problems revealed at start.',
    type: 'live',
    problems: [
      { id: 'prob-live-1', title: 'Problem A', points: 100, hidden: true },
      { id: 'prob-live-2', title: 'Problem B', points: 200, hidden: true },
      { id: 'prob-live-3', title: 'Problem C', points: 300, hidden: true },
      { id: 'prob-live-4', title: 'Problem D', points: 400, hidden: true },
    ],
    startTime: TWO_DAYS_FROM_NOW,
    endTime: TWO_DAYS_FROM_NOW + 90 * 60000,
    durationMinutes: 90,
    status: 'upcoming',
    participantCount: 67,
  },
  {
    id: 'comp-3',
    title: 'Weekly Challenge: Dynamic Programming Basics',
    description: 'Climbing Stairs, House Robber, and Longest Increasing Subsequence — classic DP patterns.',
    type: 'weekly',
    problems: [
      { id: 'prob-dp-1', title: 'Climbing Stairs', points: 100 },
      { id: 'prob-dp-2', title: 'House Robber', points: 150 },
      { id: 'prob-dp-3', title: 'Longest Increasing Subsequence', points: 200 },
    ],
    startTime: LAST_WEEK_START,
    endTime: LAST_WEEK_END,
    durationMinutes: 7 * 24 * 60,
    status: 'ended',
    participantCount: 128,
  },
];

// Competition submissions for the live weekly challenge
export const DEMO_COMP_SUBMISSIONS_LIVE: CompetitionSubmission[] = [
  { competitionId: 'comp-1', studentId: 'stu-5', studentName: 'Priya Sharma', avatarColor: '#60A5FA', problemsSolved: 3, totalPoints: 450, totalTimeSeconds: 3600, problemTimes: { 'prob-1': 900, 'prob-2': 1500, 'prob-3': 1200 } },
  { competitionId: 'comp-1', studentId: 'stu-1', studentName: 'Aisha Patel', avatarColor: '#8B5CF6', problemsSolved: 3, totalPoints: 450, totalTimeSeconds: 4200, problemTimes: { 'prob-1': 1200, 'prob-2': 1800, 'prob-3': 1200 } },
  { competitionId: 'comp-1', studentId: 'stu-3', studentName: 'Sofia Rodriguez', avatarColor: '#EC4899', problemsSolved: 3, totalPoints: 450, totalTimeSeconds: 5100, problemTimes: { 'prob-1': 1500, 'prob-2': 2100, 'prob-3': 1500 } },
  { competitionId: 'comp-1', studentId: 'stu-2', studentName: 'Marcus Chen', avatarColor: '#34D399', problemsSolved: 2, totalPoints: 250, totalTimeSeconds: 2400, problemTimes: { 'prob-1': 1200, 'prob-2': 1200 } },
  { competitionId: 'comp-1', studentId: 'stu-7', studentName: 'Emma Wilson', avatarColor: '#A78BFA', problemsSolved: 2, totalPoints: 250, totalTimeSeconds: 3000, problemTimes: { 'prob-1': 1800, 'prob-2': 1200 } },
  // ... more participants for rank 6-22
  { competitionId: 'comp-1', studentId: 'ext-7', studentName: 'Tyler Brooks', avatarColor: '#F472B6', problemsSolved: 2, totalPoints: 250, totalTimeSeconds: 3300, problemTimes: {} },
  { competitionId: 'comp-1', studentId: 'ext-8', studentName: 'Hannah Cruz', avatarColor: '#34D399', problemsSolved: 2, totalPoints: 250, totalTimeSeconds: 3600, problemTimes: {} },
  { competitionId: 'comp-1', studentId: 'ext-9', studentName: 'Omar Hassan', avatarColor: '#F59E0B', problemsSolved: 2, totalPoints: 100, totalTimeSeconds: 1800, problemTimes: {} },
  { competitionId: 'comp-1', studentId: 'ext-10', studentName: 'Lily Zhang', avatarColor: '#60A5FA', problemsSolved: 1, totalPoints: 150, totalTimeSeconds: 900, problemTimes: {} },
  { competitionId: 'comp-1', studentId: 'ext-11', studentName: 'Noah Williams', avatarColor: '#A78BFA', problemsSolved: 1, totalPoints: 150, totalTimeSeconds: 1200, problemTimes: {} },
  { competitionId: 'comp-1', studentId: 'ext-12', studentName: 'Ava Martinez', avatarColor: '#FB923C', problemsSolved: 1, totalPoints: 150, totalTimeSeconds: 1500, problemTimes: {} },
  { competitionId: 'comp-1', studentId: 'ext-13', studentName: 'Ethan Davis', avatarColor: '#2DD4BF', problemsSolved: 1, totalPoints: 100, totalTimeSeconds: 600, problemTimes: {} },
  { competitionId: 'comp-1', studentId: 'ext-14', studentName: 'Mia Johnson', avatarColor: '#F472B6', problemsSolved: 1, totalPoints: 100, totalTimeSeconds: 900, problemTimes: {} },
  { competitionId: 'comp-1', studentId: 'ext-15', studentName: 'Lucas Brown', avatarColor: '#34D399', problemsSolved: 1, totalPoints: 100, totalTimeSeconds: 1200, problemTimes: {} },
  { competitionId: 'comp-1', studentId: 'ext-16', studentName: 'Chloe Wilson', avatarColor: '#F59E0B', problemsSolved: 1, totalPoints: 100, totalTimeSeconds: 1500, problemTimes: {} },
  { competitionId: 'comp-1', studentId: 'ext-17', studentName: 'Mason Taylor', avatarColor: '#60A5FA', problemsSolved: 1, totalPoints: 100, totalTimeSeconds: 1800, problemTimes: {} },
  { competitionId: 'comp-1', studentId: 'ext-18', studentName: 'Grace Anderson', avatarColor: '#A78BFA', problemsSolved: 1, totalPoints: 100, totalTimeSeconds: 2100, problemTimes: {} },
  { competitionId: 'comp-1', studentId: 'ext-19', studentName: 'Jack Thomas', avatarColor: '#FB923C', problemsSolved: 0, totalPoints: 0, totalTimeSeconds: 0, problemTimes: {} },
  { competitionId: 'comp-1', studentId: 'ext-20', studentName: 'Ella Jackson', avatarColor: '#2DD4BF', problemsSolved: 0, totalPoints: 0, totalTimeSeconds: 0, problemTimes: {} },
  // Demo student at rank 23
  { competitionId: 'comp-1', studentId: 'student_demo', studentName: 'Alex Chen', avatarColor: '#8B5CF6', problemsSolved: 1, totalPoints: 100, totalTimeSeconds: 2400, problemTimes: { 'prob-1': 2400 } },
  { competitionId: 'comp-1', studentId: 'ext-21', studentName: 'Ryan White', avatarColor: '#F472B6', problemsSolved: 0, totalPoints: 0, totalTimeSeconds: 0, problemTimes: {} },
  { competitionId: 'comp-1', studentId: 'ext-22', studentName: 'Zoe Harris', avatarColor: '#34D399', problemsSolved: 0, totalPoints: 0, totalTimeSeconds: 0, problemTimes: {} },
];

// Submissions for ended competition
export const DEMO_COMP_SUBMISSIONS_ENDED: CompetitionSubmission[] = [
  { competitionId: 'comp-3', studentId: 'stu-5', studentName: 'Priya Sharma', avatarColor: '#60A5FA', problemsSolved: 3, totalPoints: 450, totalTimeSeconds: 2700, problemTimes: { 'prob-dp-1': 600, 'prob-dp-2': 900, 'prob-dp-3': 1200 } },
  { competitionId: 'comp-3', studentId: 'stu-1', studentName: 'Aisha Patel', avatarColor: '#8B5CF6', problemsSolved: 3, totalPoints: 450, totalTimeSeconds: 3300, problemTimes: { 'prob-dp-1': 900, 'prob-dp-2': 1200, 'prob-dp-3': 1200 } },
  { competitionId: 'comp-3', studentId: 'stu-3', studentName: 'Sofia Rodriguez', avatarColor: '#EC4899', problemsSolved: 3, totalPoints: 450, totalTimeSeconds: 3900, problemTimes: { 'prob-dp-1': 1200, 'prob-dp-2': 1500, 'prob-dp-3': 1200 } },
  { competitionId: 'comp-3', studentId: 'stu-2', studentName: 'Marcus Chen', avatarColor: '#34D399', problemsSolved: 2, totalPoints: 250, totalTimeSeconds: 1800, problemTimes: { 'prob-dp-1': 900, 'prob-dp-2': 900 } },
  { competitionId: 'comp-3', studentId: 'student_demo', studentName: 'Alex Chen', avatarColor: '#8B5CF6', problemsSolved: 2, totalPoints: 250, totalTimeSeconds: 3000, problemTimes: { 'prob-dp-1': 1200, 'prob-dp-2': 1800 } },
];

// XP log entries for demo student
export const DEMO_XP_LOG = [
  { action: 'lesson_complete' as const, xp: 10, label: 'Lesson Completed', timestamp: NOW - DAY * 0.5 },
  { action: 'exercise_pass' as const, xp: 15, label: 'Exercise Completed', timestamp: NOW - DAY * 1 },
  { action: 'exercise_pass' as const, xp: 15, label: 'Exercise Completed', timestamp: NOW - DAY * 1.2 },
  { action: 'challenge_pass' as const, xp: 30, label: 'Challenge Completed', timestamp: NOW - DAY * 2 },
  { action: 'project_milestone' as const, xp: 50, label: 'Project Milestone', timestamp: NOW - DAY * 3 },
  { action: 'streak_bonus' as const, xp: 5, label: 'Streak Bonus (12 days)', timestamp: NOW - DAY * 0.5 },
  { action: 'competition_win' as const, xp: 200, label: 'Competition Rank #7', timestamp: NOW - DAY * 3, rank: 7, participantCount: 128 },
];
