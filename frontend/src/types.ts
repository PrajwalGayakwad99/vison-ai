// Shared types for AXIOM client application

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string; style?: React.CSSProperties }>;
  badge?: number;
  accent?: boolean;
}

export interface Course {
  id: string;
  title: string;
  color: string;
  initials: string;
}

export interface ActivePage {
  page: string;
  setPage: (p: string) => void;
}

export interface SkillScore {
  subject: string;
  score: number;
  fullMark: number;
}

export interface RoleMatch {
  title: string;
  matchPct: number;
  skills: string[];
}

export interface GitHubRepo {
  name: string;
  desc: string;
  lang: string;
  langColor: string;
  stars: number;
}

export interface Project {
  id: string;
  title: string;
  desc: string;
  tech: string[];
  imageColor: string;
  demoUrl: string;
  sourceUrl: string;
}

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  iconName: string;
  rarity: 'legendary' | 'epic' | 'rare' | 'common';
  date: string;
}

// Analytics Features shared interfaces
export interface LessonInteraction {
  date: string;
  score: number;
}

export interface SkillGap {
  topic: string;
  severity: 'low' | 'medium' | 'high';
  note: string;
}

export interface PathStep {
  id: string;
  topic: string;
  reason: string;
  status: 'completed' | 'current' | 'future';
}

export interface StudentSummary {
  id: string;
  name: string;
  progress: number;
  lastActive: string;
  status: 'on_track' | 'attention' | 'falling_behind';
}

export interface HeatmapCell {
  topic: string;
  lessonIndex: number;
  timeSpent: number;
  note?: string;
}
