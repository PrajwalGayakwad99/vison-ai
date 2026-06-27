// ─── Gamification View ─────────────────────────────────────────────────────
// Full gamification tab: XP progress, leaderboards, streaks, badges, and
// coding competitions. All populated with demo data.

import React, { useState } from 'react';
import {
  useXp,
  useLeaderboard,
  useStreak,
  useBadges,
  useCompetitions,
} from '../../hooks/useGamification';
import { Flame, Trophy, Star, Zap, Crown, Award, Users, Clock, Target, ArrowUp, ArrowDown, Minus, Gift, ChevronRight, X, Sparkles, Timer, Medal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── XP Progress Panel ─────────────────────────────────────────────────────

function XpProgressPanel() {
  const { student, level, progress, xpLog, toasts, dismissToast } = useXp();

  return (
    <div>
      {/* XP Toasts */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border shadow-lg"
              style={{
                background: 'rgba(139,92,246,0.15)',
                borderColor: 'rgba(139,92,246,0.3)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <Zap size={14} className="text-[#F59E0B]" />
              <span className="text-[12px] font-bold text-[#F5F5F7]">+{toast.xp} XP</span>
              <span className="text-[10px] text-[#8B8A99]">— {toast.label}</span>
              <button onClick={() => dismissToast(toast.id)} className="ml-1 text-[#6B6A78] hover:text-[#F5F5F7]"><X size={12} /></button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Player Card */}
      <div className="p-5 rounded-2xl border" style={{ background: '#1E1D27', borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-[22px] font-bold" style={{ background: `${student.avatarColor}20`, color: student.avatarColor, border: `2px solid ${student.avatarColor}40` }}>
            {student.displayName.charAt(0)}
          </div>
          <div className="flex-1">
            <h2 className="text-[18px] font-bold text-[#F5F5F7]">{student.displayName}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[12px] text-[#A78BFA] font-bold">Level {level}</span>
              <span className="text-[10px] text-[#6B6A78]">#{student.rankGlobal} global</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[24px] font-bold text-[#F59E0B]">{student.totalXp.toLocaleString()}</div>
            <div className="text-[10px] text-[#6B6A78]">Total XP</div>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="mb-2">
          <div className="flex items-center justify-between text-[10px] text-[#6B6A78] mb-1">
            <span>{progress.current.toLocaleString()} XP</span>
            <span>{progress.pct}% to Level {level + 1}</span>
            <span>{progress.needed.toLocaleString()} XP needed</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#14131A] overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #8B5CF6, #A78BFA, #F59E0B)' }}
              initial={{ width: 0 }}
              animate={{ width: `${progress.pct}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-3 mt-4">
          {[
            { icon: Zap, label: 'XP Today', value: '+35', color: '#F59E0B' },
            { icon: Flame, label: 'Streak', value: `${student.currentStreak}d`, color: '#FB923C' },
            { icon: Target, label: 'Exercises', value: student.stats.exercisesCompleted, color: '#34D399' },
            { icon: Trophy, label: 'Challenges', value: student.stats.challengesCompleted, color: '#A78BFA' },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-2 rounded-xl bg-[#14131A]">
              <stat.icon size={14} className="mx-auto mb-1" style={{ color: stat.color }} />
              <div className="text-[13px] font-bold text-[#F5F5F7]">{stat.value}</div>
              <div className="text-[9px] text-[#6B6A78]">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Recent XP Activity */}
        <div className="mt-4">
          <h3 className="text-[11px] font-bold text-[#8B8A99] uppercase tracking-wider mb-2">Recent XP Activity</h3>
          <div className="flex flex-col gap-1.5">
            {xpLog.slice(0, 5).map((log, i) => (
              <div key={i} className="flex items-center justify-between text-[11px] px-2 py-1.5 rounded-lg bg-[#14131A]">
                <span className="text-[#C4C3D0]">{log.label}</span>
                <span className="font-bold text-[#F59E0B]">+{log.xp} XP</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Leaderboard Panel ─────────────────────────────────────────────────────

function LeaderboardPanel() {
  const { entries, studentEntry, isPinned, scope, setScope, window, setWindow, studentRank } = useLeaderboard();

  const scopeOptions: { id: 'global' | 'group' | 'topic'; label: string }[] = [
    { id: 'global', label: 'Global' },
    { id: 'group', label: 'My Groups' },
    { id: 'topic', label: 'By Topic' },
  ];

  const windowOptions: { id: 'all_time' | 'month' | 'week'; label: string }[] = [
    { id: 'all_time', label: 'All Time' },
    { id: 'month', label: 'This Month' },
    { id: 'week', label: 'This Week' },
  ];

  return (
    <div className="p-5 rounded-2xl border" style={{ background: '#1E1D27', borderColor: 'rgba(255,255,255,0.06)' }}>
      {/* Filters */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1">
          {scopeOptions.map((opt) => (
            <button key={opt.id} onClick={() => setScope(opt.id)} className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${scope === opt.id ? 'bg-violet-500/10 text-[#A78BFA] border border-violet-500/20' : 'text-[#6B6A78] border border-transparent'}`}>
              {opt.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {windowOptions.map((opt) => (
            <button key={opt.id} onClick={() => setWindow(opt.id)} className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${window === opt.id ? 'bg-violet-500/10 text-[#A78BFA] border border-violet-500/20' : 'text-[#6B6A78] border border-transparent'}`}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 gap-2 text-[9px] font-bold text-[#6B6A78] uppercase tracking-wider px-3 py-2 mb-1">
        <div className="col-span-1">Rank</div>
        <div className="col-span-4">Student</div>
        <div className="col-span-2 text-right">XP</div>
        <div className="col-span-2 text-right">Level</div>
        <div className="col-span-1 text-right"></div>
        <div className="col-span-2 text-right">Trend</div>
      </div>

      {/* Entries */}
      <div className="flex flex-col gap-1">
        {entries.map((entry) => {
          const isSelf = entry.studentId === 'student_demo';
          const rankColor = entry.rank === 1 ? '#F59E0B' : entry.rank === 2 ? '#A78BFA' : entry.rank === 3 ? '#FB923C' : '#6B6A78';
          return (
            <div
              key={entry.studentId}
              className={`grid grid-cols-12 gap-2 items-center px-3 py-2.5 rounded-xl transition-all ${
                isSelf ? 'bg-violet-500/10 border border-violet-500/20' : 'bg-[#14131A] hover:bg-white/[0.02]'
              }`}
            >
              <div className="col-span-1 text-[12px] font-bold" style={{ color: rankColor }}>
                {entry.rank <= 3 ? (['🥇', '🥈', '🥉'][entry.rank - 1]) : `#${entry.rank}`}
              </div>
              <div className="col-span-4 flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0" style={{ background: `${entry.avatarColor}20`, color: entry.avatarColor }}>
                  {entry.displayName.charAt(0)}
                </div>
                <span className={`text-[11px] font-bold truncate ${isSelf ? 'text-[#A78BFA]' : 'text-[#F5F5F7]'}`}>{entry.displayName}</span>
              </div>
              <div className="col-span-2 text-[11px] font-bold text-[#F5F5F7] text-right">{entry.xp.toLocaleString()}</div>
              <div className="col-span-2 text-[10px] text-[#8B8A99] text-right">Lv.{entry.level}</div>
              <div className="col-span-1 text-[10px] text-[#FB923C] text-right">{entry.currentStreak}</div>
              <div className="col-span-2 flex items-center justify-end gap-0.5">
                {entry.trend === 'up' && <ArrowUp size={10} className="text-[#34D399]" />}
                {entry.trend === 'down' && <ArrowDown size={10} className="text-[#F87171]" />}
                {entry.trend === 'none' && <Minus size={10} className="text-[#6B6A78]" />}
                {entry.trendAmount ? <span className="text-[9px]" style={{ color: entry.trend === 'up' ? '#34D399' : entry.trend === 'down' ? '#F87171' : '#6B6A78' }}>{entry.trendAmount}</span> : null}
              </div>
            </div>
          );
        })}

        {/* Pinned "Your Rank" row */}
        {isPinned && studentEntry && (
          <div className="mt-2 p-3 rounded-xl border border-violet-500/20 bg-violet-500/5">
            <div className="flex items-center justify-between text-[10px] text-[#8B8A99] mb-1">
              <span>Your Rank</span>
              <span className="text-[#A78BFA] font-bold">#{studentEntry.rank}</span>
            </div>
            <div className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-1 text-[11px] font-bold text-[#A78BFA]">#{studentEntry.rank}</div>
              <div className="col-span-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-bold" style={{ background: `${studentEntry.avatarColor}20`, color: studentEntry.avatarColor }}>
                  {studentEntry.displayName.charAt(0)}
                </div>
                <span className="text-[11px] font-bold text-[#A78BFA]">{studentEntry.displayName}</span>
              </div>
              <div className="col-span-2 text-[11px] font-bold text-[#F5F5F7] text-right">{studentEntry.xp.toLocaleString()}</div>
              <div className="col-span-2 text-[10px] text-[#8B8A99] text-right">Lv.{studentEntry.level}</div>
              <div className="col-span-1 text-[10px] text-[#FB923C] text-right">{studentEntry.currentStreak}</div>
              <div className="col-span-2 text-right">
                <ChevronRight size={12} className="text-[#6B6A78] inline" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Streak Panel ──────────────────────────────────────────────────────────

function StreakPanel() {
  const { currentStreak, longestStreak, days, isTodayActive, freezeUsed, freezeDay, streakFreezesPerWeek } = useStreak();

  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekStartDay = new Date(Date.now() - 29 * 86400000).getDay(); // day of week 30 days ago

  const getIntensity = (active: boolean, isFreeze: boolean) => {
    if (isFreeze) return { bg: 'rgba(251,146,60,0.3)', border: 'rgba(251,146,60,0.5)' };
    if (!active) return { bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.05)' };
    return { bg: 'rgba(139,92,246,0.4)', border: 'rgba(139,92,246,0.5)' };
  };

  return (
    <div className="p-5 rounded-2xl border" style={{ background: '#1E1D27', borderColor: 'rgba(255,255,255,0.06)' }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(251,146,60,0.15)' }}>
          <Flame size={20} className="text-[#FB923C]" />
        </div>
        <div>
          <h3 className="text-[16px] font-bold text-[#F5F5F7]">Learning Streak</h3>
          <p className="text-[11px] text-[#8B8A99]">Keep the flame alive!</p>
        </div>
        <div className="ml-auto text-right">
          <div className="text-[28px] font-bold text-[#FB923C]">{currentStreak}</div>
          <div className="text-[10px] text-[#6B6A78]">days · best: {longestStreak}</div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="mb-3">
        <div className="text-[10px] font-bold text-[#6B6A78] uppercase tracking-wider mb-2">Last 30 Days</div>
        <div className="flex gap-1 flex-wrap">
          {days.map((day, i) => {
            const colors = getIntensity(day.active, day.isFreeze || false);
            return (
              <div
                key={i}
                className="w-[18px] h-[18px] rounded-sm transition-all"
                style={{
                  background: colors.bg,
                  border: `1px solid ${colors.border}`,
                }}
                title={`Day ${i + 1}: ${day.active ? 'Active' : day.isFreeze ? 'Freeze Used' : 'Missed'}`}
              />
            );
          })}
        </div>
        <div className="flex items-center gap-3 mt-2 text-[9px] text-[#6B6A78]">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)]" /> Missed</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-[rgba(139,92,246,0.4)] border border-[rgba(139,92,246,0.5)]" /> Active</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-[rgba(251,146,60,0.3)] border border-[rgba(251,146,60,0.5)]" /> Freeze</span>
        </div>
      </div>

      {/* Streak Freeze Info */}
      <div className="p-3 rounded-xl bg-[#14131A] border border-white/[0.04]">
        <div className="flex items-center gap-2 mb-1">
          <Gift size={12} className="text-[#FB923C]" />
          <span className="text-[11px] font-bold text-[#F5F5F7]">Streak Freezes</span>
        </div>
        <p className="text-[10px] text-[#8B8A99] mb-2">
          Miss a day? A streak freeze auto-applies to protect your streak. You get {streakFreezesPerWeek} free freeze per week.
        </p>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: freezeUsed ? 'rgba(251,146,60,0.2)' : 'rgba(52,211,153,0.2)' }}>
            <Flame size={12} style={{ color: freezeUsed ? '#FB923C' : '#34D399' }} />
          </div>
          <span className="text-[10px]" style={{ color: freezeUsed ? '#FB923C' : '#34D399' }}>
            {freezeUsed ? 'Freeze used this week' : 'Freeze available'}
          </span>
          {freezeUsed && freezeDay !== undefined && (
            <span className="text-[9px] text-[#6B6A78] ml-auto">Applied {freezeDay === 13 ? '17 days ago' : `${freezeDay} days ago`}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Badges Panel ──────────────────────────────────────────────────────────

function BadgesPanel() {
  const { badges, newlyUnlocked, rarityCounts, totalUnlocked, totalCatalog, dismissUnlock } = useBadges();

  const rarityOrder: Array<'legendary' | 'epic' | 'rare' | 'common'> = ['legendary', 'epic', 'rare', 'common'];
  const rarityLabels: Record<string, string> = { common: 'Common', rare: 'Rare', epic: 'Epic', legendary: 'Legendary' };

  return (
    <div>
      {/* Unlock Modal */}
      <AnimatePresence>
        {newlyUnlocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={dismissUnlock}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="p-8 rounded-3xl border text-center max-w-sm"
              style={{
                background: '#1E1D27',
                borderColor: 'rgba(255,255,255,0.1)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-[48px] mb-4">
                {badges.find((b) => b.id === newlyUnlocked)?.icon || '🏆'}
              </div>
              <div className="text-[10px] font-bold text-[#F59E0B] uppercase tracking-widest mb-1">Achievement Unlocked!</div>
              <h2 className="text-[20px] font-bold text-[#F5F5F7] mb-2">{badges.find((b) => b.id === newlyUnlocked)?.name}</h2>
              <p className="text-[12px] text-[#8B8A99] mb-4">{badges.find((b) => b.id === newlyUnlocked)?.description}</p>
              <button onClick={dismissUnlock} className="px-6 py-2 rounded-xl text-[11px] font-bold text-white bg-violet-500 hover:bg-violet-600 transition-all">
                Awesome!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-5 rounded-2xl border" style={{ background: '#1E1D27', borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[16px] font-bold text-[#F5F5F7]">Badge Showcase</h3>
            <p className="text-[11px] text-[#8B8A99]">{totalUnlocked} of {totalCatalog} badges earned</p>
          </div>
          <div className="flex gap-2">
            {rarityOrder.map((r) => (
              <span key={r} className="text-[9px] px-2 py-1 rounded-lg font-bold" style={{
                background: getRarityConfig(r).bg,
                color: getRarityConfig(r).text,
                border: `1px solid ${getRarityConfig(r).border}`,
              }}>
                {rarityLabels[r]}: {rarityCounts[r]}
              </span>
            ))}
          </div>
        </div>

        {/* Badge Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="p-3 rounded-xl border text-center transition-all"
              style={{
                background: badge.unlocked ? badge.rarityConfig.bg : 'rgba(255,255,255,0.02)',
                borderColor: badge.unlocked ? badge.rarityConfig.border : 'rgba(255,255,255,0.04)',
                boxShadow: badge.unlocked ? badge.rarityConfig.glow : 'none',
                opacity: badge.unlocked ? 1 : 0.4,
                filter: badge.unlocked ? 'none' : 'grayscale(1)',
              }}
            >
              <div className="text-[28px] mb-2">{badge.icon}</div>
              <div className="text-[11px] font-bold text-[#F5F5F7] truncate">{badge.name}</div>
              <div className="text-[9px] text-[#6B6A78] mt-1 line-clamp-2">{badge.description}</div>
              {badge.unlocked && badge.earnedAt && (
                <div className="text-[8px] text-[#8B8A99] mt-2">
                  Earned {new Date(badge.earnedAt).toLocaleDateString()}
                </div>
              )}
              {!badge.unlocked && (
                <div className="text-[8px] text-[#6B6A78] mt-2">
                  Locked
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getRarityConfig(rarity: string) {
  const colors: Record<string, { bg: string; border: string; text: string; glow: string }> = {
    common: { bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.2)', text: '#A78BFA', glow: '' },
    rare: { bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.3)', text: '#60A5FA', glow: '0 0 12px rgba(96,165,250,0.2)' },
    epic: { bg: 'rgba(251,146,60,0.08)', border: 'rgba(251,146,60,0.3)', text: '#FB923C', glow: '0 0 16px rgba(251,146,60,0.25)' },
    legendary: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.5)', text: '#F59E0B', glow: '0 0 20px rgba(245,158,11,0.3)' },
  };
  return colors[rarity] || colors.common;
}

// ─── Competitions Panel ────────────────────────────────────────────────────

function CompetitionsPanel() {
  const {
    competitions,
    liveCompetition,
    upcomingCompetition,
    rankedLive,
    rankedEnded,
    studentLiveRank,
    studentEndedRank,
    studentEndedSubmission,
    now,
  } = useCompetitions();

  const [selectedTab, setSelectedTab] = useState<'live' | 'upcoming' | 'past'>('live');

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getCountdown = (startTime: number) => {
    const diff = startTime - now;
    if (diff <= 0) return 'Started!';
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    return days > 0 ? `${days}d ${hours}h` : `${hours}h ${mins}m`;
  };

  const tabs = [
    { id: 'live' as const, label: 'Live Now', count: competitions.filter((c) => c.status === 'live').length, icon: Zap },
    { id: 'upcoming' as const, label: 'Upcoming', count: competitions.filter((c) => c.status === 'upcoming').length, icon: Clock },
    { id: 'past' as const, label: 'Past', count: competitions.filter((c) => c.status === 'ended').length, icon: Trophy },
  ];

  return (
    <div className="p-5 rounded-2xl border" style={{ background: '#1E1D27', borderColor: 'rgba(255,255,255,0.06)' }}>
      {/* Tabs */}
      <div className="flex gap-1 mb-4">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold transition-all ${
              selectedTab === t.id ? 'bg-violet-500/10 text-[#A78BFA] border border-violet-500/20' : 'text-[#6B6A78] border border-transparent'
            }`}
          >
            <t.icon size={12} />
            {t.label}
            {t.count > 0 && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.06]">{t.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Live Competition */}
      {selectedTab === 'live' && liveCompetition && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-[#F87171] animate-pulse" />
            <h3 className="text-[14px] font-bold text-[#F5F5F7]">{liveCompetition.title}</h3>
            <span className="text-[9px] px-2 py-0.5 rounded bg-red-500/10 text-[#F87171] border border-red-500/20 font-bold animate-pulse">LIVE</span>
            <span className="text-[10px] text-[#6B6A78] ml-auto">{liveCompetition.participantCount} participants</span>
          </div>

          {/* Problems */}
          <div className="flex gap-2 mb-4">
            {liveCompetition.problems.map((p) => (
              <div key={p.id} className="flex-1 p-2 rounded-lg bg-[#14131A] border border-white/[0.04] text-center">
                <div className="text-[10px] text-[#6B6A78]">{p.title}</div>
                <div className="text-[13px] font-bold text-[#F59E0B]">{p.points} pts</div>
              </div>
            ))}
          </div>

          {/* Leaderboard */}
          <div className="text-[10px] font-bold text-[#6B6A78] uppercase tracking-wider mb-2">Live Leaderboard</div>
          <div className="flex flex-col gap-1">
            {rankedLive.slice(0, 10).map((sub, i) => {
              const isSelf = sub.studentId === 'student_demo';
              const medal = i === 0 ? '' : i === 1 ? '🥈' : i === 2 ? '🥉' : null;
              return (
                <div
                  key={sub.studentId}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isSelf ? 'bg-violet-500/10 border border-violet-500/20' : 'bg-[#14131A]'}`}
                >
                  <div className="w-6 text-[11px] font-bold text-center">
                    {medal || `#${i + 1}`}
                  </div>
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-bold" style={{ background: `${sub.avatarColor}20`, color: sub.avatarColor }}>
                    {sub.studentName.charAt(0)}
                  </div>
                  <span className={`text-[11px] font-bold flex-1 truncate ${isSelf ? 'text-[#A78BFA]' : 'text-[#F5F5F7]'}`}>{sub.studentName}</span>
                  <span className="text-[11px] font-bold text-[#F59E0B]">{sub.totalPoints}</span>
                  <span className="text-[10px] text-[#6B6A78]">{formatTime(sub.totalTimeSeconds)}</span>
                </div>
              );
            })}

            {/* Student's rank if not in top 10 */}
            {studentLiveRank > 10 && (
              <div className="mt-2 p-2 rounded-lg bg-violet-500/5 border border-violet-500/10">
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="text-[#6B6A78]">Your rank:</span>
                  <span className="text-[#A78BFA] font-bold">#{studentLiveRank}</span>
                  <span className="text-[#6B6A78]">· 100 pts</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upcoming Competition */}
      {selectedTab === 'upcoming' && upcomingCompetition && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Timer size={14} className="text-[#A78BFA]" />
            <h3 className="text-[14px] font-bold text-[#F5F5F7]">{upcomingCompetition.title}</h3>
            <span className="text-[9px] px-2 py-0.5 rounded bg-violet-500/10 text-[#A78BFA] border border-violet-500/20 font-bold">UPCOMING</span>
          </div>

          <div className="p-4 rounded-xl bg-[#14131A] border border-white/[0.04] mb-3">
            <div className="text-center mb-3">
              <div className="text-[10px] text-[#6B6A78] mb-1">Starts in</div>
              <div className="text-[24px] font-bold text-[#A78BFA] font-mono">{getCountdown(upcomingCompetition.startTime)}</div>
            </div>
            <div className="flex items-center justify-between text-[10px] text-[#6B6A78]">
              <span>{upcomingCompetition.participantCount} registered</span>
              <span>{upcomingCompetition.durationMinutes} minutes</span>
              <span>{upcomingCompetition.problems.length} problems (hidden until start)</span>
            </div>
          </div>

          <button className="w-full py-2.5 rounded-xl text-[12px] font-bold text-white bg-violet-500 hover:bg-violet-600 transition-all">
            Register to Compete
          </button>
        </div>
      )}

      {/* Past Competition */}
      {selectedTab === 'past' && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Trophy size={14} className="text-[#F59E0B]" />
            <h3 className="text-[14px] font-bold text-[#F5F5F7]">Weekly Challenge: Dynamic Programming Basics</h3>
            <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 text-[#34D399] border border-emerald-500/20 font-bold">ENDED</span>
          </div>

          {/* Top 3 */}
          <div className="flex gap-3 mb-4">
            {[0, 1, 2].map((i) => {
              const sub = rankedEnded[i];
              if (!sub) return null;
              const size = i === 0 ? 'w-20' : i === 1 ? 'w-16' : 'w-14';
              const order = i === 1 ? 'order-first' : i === 0 ? 'order-1' : 'order-2';
              const colors = i === 0 ? ['#F59E0B', 'rgba(245,158,11,0.15)'] : i === 1 ? ['#A78BFA', 'rgba(167,139,250,0.15)'] : ['#FB923C', 'rgba(251,146,60,0.15)'];
              return (
                <div key={sub.studentId} className={`${order} ${size} p-3 rounded-xl text-center border`} style={{ background: colors[1], borderColor: `${colors[0]}30` }}>
                  <div className="text-[20px] mb-1">{['', '🥈', '🥉'][i]}</div>
                  <div className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-[11px] font-bold" style={{ background: `${sub.avatarColor}30`, color: sub.avatarColor }}>
                    {sub.studentName.charAt(0)}
                  </div>
                  <div className="text-[10px] font-bold text-[#F5F5F7] truncate">{sub.studentName}</div>
                  <div className="text-[12px] font-bold text-[#F59E0B] mt-1">{sub.totalPoints} pts</div>
                  <div className="text-[9px] text-[#6B6A78]">{formatTime(sub.totalTimeSeconds)}</div>
                </div>
              );
            })}
          </div>

          {/* Full standings */}
          <div className="text-[10px] font-bold text-[#6B6A78] uppercase tracking-wider mb-2">Full Standings</div>
          <div className="flex flex-col gap-1">
            {rankedEnded.slice(0, 5).map((sub, i) => {
              const isSelf = sub.studentId === 'student_demo';
              return (
                <div
                  key={sub.studentId}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isSelf ? 'bg-violet-500/10 border border-violet-500/20' : 'bg-[#14131A]'}`}
                >
                  <div className="w-6 text-[11px] font-bold text-center">#{i + 1}</div>
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-bold" style={{ background: `${sub.avatarColor}20`, color: sub.avatarColor }}>
                    {sub.studentName.charAt(0)}
                  </div>
                  <span className={`text-[11px] font-bold flex-1 truncate ${isSelf ? 'text-[#A78BFA]' : 'text-[#F5F5F7]'}`}>{sub.studentName}</span>
                  <span className="text-[11px] font-bold text-[#F59E0B]">{sub.totalPoints}</span>
                  <span className="text-[10px] text-[#6B6A78]">{formatTime(sub.totalTimeSeconds)}</span>
                </div>
              );
            })}
            {studentEndedRank > 5 && studentEndedSubmission && (
              <div className="mt-2 p-2 rounded-lg bg-violet-500/5 border border-violet-500/10">
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="text-[#6B6A78]">Your rank:</span>
                  <span className="text-[#A78BFA] font-bold">#{studentEndedRank}</span>
                  <span className="text-[#F59E0B] font-bold">{studentEndedSubmission.totalPoints} pts</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Gamification View ────────────────────────────────────────────────

const GamificationView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'xp' | 'leaderboard' | 'streak' | 'badges' | 'competitions'>('xp');

  const tabs = [
    { id: 'xp' as const, label: 'XP & Level', icon: Zap },
    { id: 'leaderboard' as const, label: 'Leaderboard', icon: Trophy },
    { id: 'streak' as const, label: 'Streak', icon: Flame },
    { id: 'badges' as const, label: 'Badges', icon: Award },
    { id: 'competitions' as const, label: 'Competitions', icon: Sparkles },
  ];

  return (
    <div className="flex flex-col h-full bg-[#14131A]" style={{ minWidth: 0 }}>
      {/* Header */}
      <div className="px-6 py-5 border-b border-white/[0.05] shrink-0">
        <h1 className="text-[20px] font-bold text-[#F5F5F7] mb-1">Gamification</h1>
        <p className="text-[12px] text-[#8B8A99]">Track your progress, compete with peers, and earn rewards.</p>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 px-6 py-3 border-b border-white/[0.03] shrink-0 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-all ${
              activeTab === t.id
                ? 'bg-violet-500/10 text-[#A78BFA] border border-violet-500/20'
                : 'text-[#6B6A78] hover:text-[#8B8A99] border border-transparent'
            }`}
          >
            <t.icon size={12} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6" style={{ minHeight: 0 }}>
        <AnimatePresence mode="wait">
          {activeTab === 'xp' && <motion.div key="xp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><XpProgressPanel /></motion.div>}
          {activeTab === 'leaderboard' && <motion.div key="leaderboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><LeaderboardPanel /></motion.div>}
          {activeTab === 'streak' && <motion.div key="streak" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><StreakPanel /></motion.div>}
          {activeTab === 'badges' && <motion.div key="badges" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><BadgesPanel /></motion.div>}
          {activeTab === 'competitions' && <motion.div key="competitions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><CompetitionsPanel /></motion.div>}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GamificationView;
