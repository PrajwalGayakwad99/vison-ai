import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal, Clock, Trophy } from 'lucide-react';
import Card from '../ui/Card';

// ─── Calendar Data ─────────────────────────────────────────────────────────────
const DAYS = [
  { abbr: 'Thu', date: 24 },
  { abbr: 'Fri', date: 25 },
  { abbr: 'Sat', date: 26 },
  { abbr: 'Sun', date: 27 },
  { abbr: 'Mon', date: 28, selected: true },  // ← today/selected
  { abbr: 'Tue', date: 29 },
  { abbr: 'Wed', date: 30 },
];

// ─── Agenda Data ───────────────────────────────────────────────────────────────
const AGENDA_ITEMS = [
  {
    id: 'a1',
    title: 'Daily Challenge: Binary Search',
    desc: 'Gamification & Motivation · 250 XP',
    time: '09:00 AM',
    avatarColors: ['#8B5CF6', '#34D399', '#60A5FA'],
    accentColor: '#8B5CF6',
    accentBg: 'rgba(139,92,246,0.12)',
  },
  {
    id: 'a2',
    title: 'Study Group: Recursion Deep-Dive',
    desc: 'Collaboration & Social Learning · Live',
    time: '02:00 PM',
    avatarColors: ['#F472B6', '#FB923C', '#A78BFA'],
    accentColor: '#34D399',
    accentBg: 'rgba(52,211,153,0.1)',
  },
];

// ─── Avatar Stack ─────────────────────────────────────────────────────────────
const AvatarStack: React.FC<{ colors: string[] }> = ({ colors }) => (
  <div className="flex items-center">
    {colors.map((color, i) => (
      <div
        key={i}
        className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white border-2"
        style={{
          background: color,
          borderColor: '#1E1D27',
          marginLeft: i > 0 ? '-6px' : '0',
          zIndex: colors.length - i,
          position: 'relative',
        }}
      >
        {String.fromCharCode(65 + i)}
      </div>
    ))}
  </div>
);

// ─── Agenda Item ──────────────────────────────────────────────────────────────
interface AgendaItemProps {
  title: string;
  desc: string;
  time: string;
  avatarColors: string[];
  accentColor: string;
  accentBg: string;
}

const AgendaItem: React.FC<AgendaItemProps> = ({ title, desc, time, avatarColors, accentColor, accentBg }) => (
  <div className="agenda-card">
    {/* Top row */}
    <div className="flex items-start justify-between gap-2 mb-1.5">
      <div className="flex items-center gap-2">
        {/* Colored left bar */}
        <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ background: accentColor }} />
        <div>
          <p className="text-[13px] font-semibold leading-tight" style={{ color: '#F5F5F7' }}>
            {title}
          </p>
          <p className="text-[11.5px] mt-0.5" style={{ color: '#6B6A78' }}>{desc}</p>
        </div>
      </div>
      <button className="card-icon-btn flex-shrink-0 mt-0.5" aria-label="Options">
        <MoreHorizontal size={13} strokeWidth={2} />
      </button>
    </div>

    {/* Bottom row */}
    <div className="flex items-center justify-between mt-2.5">
      <AvatarStack colors={avatarColors} />
      {/* Time chip */}
      <div
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold"
        style={{ background: accentBg, color: accentColor }}
      >
        <Clock size={11} strokeWidth={2.5} />
        {time}
      </div>
    </div>
  </div>
);

// ─── Calendar Card ────────────────────────────────────────────────────────────
const CalendarCard: React.FC = () => {
  const [month, setMonth] = useState('October 2024');
  const [selectedDate, setSelectedDate] = useState(28);

  return (
    <Card noHeader>
      {/* ── Month Navigator ── */}
      <div className="flex items-center justify-between mb-5">
        <button
          className="card-icon-btn"
          onClick={() => setMonth('September 2024')}
          aria-label="Previous month"
        >
          <ChevronLeft size={14} strokeWidth={2.5} />
        </button>
        <span className="text-[13.5px] font-semibold" style={{ color: '#F5F5F7' }}>
          {month}
        </span>
        <button
          className="card-icon-btn"
          onClick={() => setMonth('November 2024')}
          aria-label="Next month"
        >
          <ChevronRight size={14} strokeWidth={2.5} />
        </button>
      </div>

      {/* ── 7-Day Date Strip ── */}
      <div className="flex justify-between mb-5">
        {DAYS.map(({ abbr, date }) => {
          const isSelected = date === selectedDate;
          return (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className="flex flex-col items-center gap-1.5 transition-all duration-150"
            >
              <span className="text-[10px] font-medium uppercase tracking-wide" style={{ color: '#6B6A78' }}>
                {abbr}
              </span>
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[13px] font-semibold transition-all duration-150"
                style={
                  isSelected
                    ? {
                        background: 'linear-gradient(135deg, #8B5CF6, #A78BFA)',
                        color: '#fff',
                        boxShadow: '0 4px 12px rgba(139,92,246,0.45)',
                      }
                    : {
                        color: '#8B8A99',
                      }
                }
              >
                {date}
              </div>
              {/* Event dot */}
              {[24, 28, 29].includes(date) && !isSelected && (
                <span className="w-1 h-1 rounded-full" style={{ background: '#8B5CF6' }} />
              )}
              {isSelected && <span className="w-1 h-1 rounded-full opacity-0" />}
            </button>
          );
        })}
      </div>

      {/* ── Divider ── */}
      <div className="mb-4" style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />

      {/* ── Agenda Items ── */}
      <div className="flex flex-col gap-2.5 mb-5">
        {AGENDA_ITEMS.map((item) => (
          <AgendaItem key={item.id} {...item} />
        ))}
      </div>

      {/* ── Create Activity CTA ── */}
      <button
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all duration-150"
        style={{
          background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
          boxShadow: '0 4px 14px rgba(139,92,246,0.35), 0 1px 0 rgba(255,255,255,0.12) inset',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            '0 6px 20px rgba(139,92,246,0.5), 0 1px 0 rgba(255,255,255,0.15) inset';
          (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            '0 4px 14px rgba(139,92,246,0.35), 0 1px 0 rgba(255,255,255,0.12) inset';
          (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
        }}
      >
        <Trophy size={15} strokeWidth={2.5} />
        + Join Challenge
      </button>
    </Card>
  );
};

export default CalendarCard;
