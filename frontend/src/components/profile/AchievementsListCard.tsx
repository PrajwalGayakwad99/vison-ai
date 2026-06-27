import React from 'react';
import Card from '../ui/Card';
import { Award, Star, Flame, Sparkles, Zap } from 'lucide-react';
import type { Achievement } from '../../types';

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'a1',
    title: 'Byte Buster',
    desc: 'Successfully executed 100 memory visualizer simulations.',
    iconName: 'zap',
    rarity: 'legendary',
    date: 'Jun 24, 2026',
  },
  {
    id: 'a2',
    title: 'Socratic Scholar',
    desc: 'Engaged in 25 structured AI Tutor Socratic sessions.',
    iconName: 'sparkles',
    rarity: 'epic',
    date: 'Jun 20, 2026',
  },
  {
    id: 'a3',
    title: 'Streak Master',
    desc: 'Maintained a consecutive 14-day daily study streak.',
    iconName: 'flame',
    rarity: 'rare',
    date: 'Jun 18, 2026',
  },
  {
    id: 'a4',
    title: 'Compiler Crusader',
    desc: 'Compiled and executed code in 3 languages in the editor.',
    iconName: 'star',
    rarity: 'common',
    date: 'Jun 12, 2026',
  },
];

const RARITY_STYLES: Record<string, { color: string; border: string; bg: string; text: string }> = {
  legendary: {
    color: '#8B5CF6',
    border: 'rgba(139,92,246,0.3)',
    bg: 'rgba(139,92,246,0.12)',
    text: '#C4B5FD',
  },
  epic: {
    color: '#FB923C',
    border: 'rgba(251,146,60,0.3)',
    bg: 'rgba(251,146,60,0.12)',
    text: '#FDBA74',
  },
  rare: {
    color: '#60A5FA',
    border: 'rgba(96,165,250,0.3)',
    bg: 'rgba(96,165,250,0.12)',
    text: '#93C5FD',
  },
  common: {
    color: '#8B8A99',
    border: 'rgba(139,138,153,0.2)',
    bg: 'rgba(139,138,153,0.08)',
    text: '#D1D5DB',
  },
};

const AchievementIcon: React.FC<{ name: string; size?: number; className?: string }> = ({ name, size = 16, className }) => {
  switch (name) {
    case 'zap':
      return <Zap size={size} className={className} />;
    case 'sparkles':
      return <Sparkles size={size} className={className} />;
    case 'flame':
      return <Flame size={size} className={className} />;
    default:
      return <Star size={size} className={className} />;
  }
};

const AchievementsListCard: React.FC = () => {
  return (
    <Card
      icon={<Award size={15} strokeWidth={2} />}
      title="Achievements &amp; Badges"
      showViewAll
      onViewAll={() => {}}
      showRefresh={false}
      className="h-full"
    >
      <div className="flex flex-col gap-3 mt-4">
        {ACHIEVEMENTS.map((ach) => {
          const style = RARITY_STYLES[ach.rarity];
          const isLegendary = ach.rarity === 'legendary';

          return (
            <div
              key={ach.id}
              className={`flex items-center justify-between p-3 rounded-xl border border-white/[0.04] bg-[#14131A] transition-all duration-300 group ${
                isLegendary
                  ? 'hover:shadow-lg hover:shadow-purple-500/5 hover:border-violet-500/25 relative overflow-hidden'
                  : 'hover:border-white/[0.08]'
              }`}
            >
              {/* Shimmer overlay for Legendary */}
              {isLegendary && (
                <div className="absolute inset-0 w-full h-full pointer-events-none bg-gradient-to-r from-transparent via-white/[0.015] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
              )}

              <div className="flex items-center gap-3.5 relative z-10">
                {/* Circular Badge Icon wrapper */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center border"
                  style={{
                    background: style.bg,
                    borderColor: style.border,
                    color: style.color,
                  }}
                >
                  <AchievementIcon name={ach.iconName} size={18} />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-[#F5F5F7] group-hover:text-[#A78BFA] transition-colors">
                      {ach.title}
                    </span>
                    <span
                      className="text-[8.5px] uppercase font-extrabold tracking-wider px-1.5 py-0.5 rounded border"
                      style={{
                        background: style.bg,
                        borderColor: style.border,
                        color: style.color,
                      }}
                    >
                      {ach.rarity}
                    </span>
                  </div>
                  <p className="text-[11.5px] text-[#8B8A99] mt-1 leading-snug">
                    {ach.desc}
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-mono text-[#6B6A78] self-start mt-1 relative z-10 shrink-0">
                {ach.date}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default AchievementsListCard;
