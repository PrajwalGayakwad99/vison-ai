import React from 'react';
import { BookOpen, BarChart2, Flame, Sparkles } from 'lucide-react';
import CompactStatCard from './CompactStatCard';

// ─── Stat definitions ─────────────────────────────────────────────────────────
const STATS = [
  {
    id: 'lessons',
    icon: <BookOpen size={14} strokeWidth={2} />,
    iconColor: '#A78BFA',
    title: 'Lessons Completed',
    numericTarget: 282,
    decimals: 0,
    suffix: '',
    delta: '38.12% from previous weeks',
    positive: true,
  },
  {
    id: 'quiz',
    icon: <BarChart2 size={14} strokeWidth={2} />,
    iconColor: '#34D399',
    title: 'Avg Quiz Score',
    numericTarget: 87,
    decimals: 0,
    suffix: '%',
    delta: '17.8% from previous weeks',
    positive: true,
  },
  {
    id: 'streak',
    icon: <Flame size={14} strokeWidth={2} />,
    iconColor: '#FB923C',
    title: 'Study Streak',
    numericTarget: 21,
    decimals: 0,
    suffix: ' days',
    delta: '+4 days from last week',
    positive: true,
  },
  {
    id: 'tutor-sessions',
    icon: <Sparkles size={14} strokeWidth={2} />,
    iconColor: '#60A5FA',
    title: 'AI Tutor Sessions',
    numericTarget: 147,
    decimals: 0,
    suffix: '',
    delta: '+12 sessions this week',
    positive: true,
  },
];

// ─── Stats Grid (2 × 2) ───────────────────────────────────────────────────────
const StatsGrid: React.FC = () => (
  <div
    className="grid grid-cols-2 gap-4 h-full"
    style={{ gridAutoRows: '1fr' }}
  >
    {STATS.map((stat) => (
      <CompactStatCard key={stat.id} {...stat} />
    ))}
  </div>
);

export default StatsGrid;
