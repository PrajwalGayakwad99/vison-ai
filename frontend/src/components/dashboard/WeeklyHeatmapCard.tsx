import React, { useState } from 'react';
import { Activity, RotateCw } from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────
const ROW_LABELS = ['Challenges', 'Lessons', 'AI Sessions', 'Reviews', 'Practice'];
const DATES = Array.from({ length: 12 }, (_, i) => i + 18);   // 18 → 29
const MONTH = 'Jun';

// 4-level intensity: 0=none, 1=low, 2=med, 3=high, 4=best
const RAW_DATA: number[][] = [
  // Challenges     18  19  20  21  22  23  24  25  26  27  28  29
  /* Challenges */  [2, 1, 4, 2, 1, 0, 2, 4, 3, 4, 2, 3],
  /* Lessons    */  [1, 3, 2, 4, 1, 2, 1, 1, 4, 2, 4, 2],
  /* AI Sessions */ [4, 2, 1, 0, 3, 4, 1, 3, 2, 4, 3, 4],
  /* Reviews    */  [0, 1, 3, 2, 4, 2, 2, 0, 3, 1, 2, 1],
  /* Practice   */  [2, 4, 1, 3, 0, 1, 4, 2, 1, 3, 4, 3],
];

// XP mock values per intensity level
const XP_BY_LEVEL: Record<number, number[]> = {
  0: [0],
  1: [30, 45, 55, 65],
  2: [90, 110, 130, 145],
  3: [180, 200, 230, 250],
  4: [310, 340, 380, 420],
};

function mockXP(level: number, row: number, col: number): number {
  const pool = XP_BY_LEVEL[level];
  return pool[(row * 3 + col) % pool.length];
}

// ─── 5-step intensity palette (0 = empty, 1–4 = Low → Best) ──────────────────
const INTENSITY_STYLES: { bg: string; border: string }[] = [
  { bg: 'rgba(255,255,255,0.04)',  border: 'rgba(255,255,255,0.06)' }, // 0 – empty
  { bg: 'rgba(139,92,246,0.15)',  border: 'rgba(139,92,246,0.22)'  }, // 1 – Low
  { bg: 'rgba(139,92,246,0.35)',  border: 'rgba(139,92,246,0.45)'  }, // 2 – Medium
  { bg: 'rgba(139,92,246,0.65)',  border: 'rgba(139,92,246,0.75)'  }, // 3 – High
  { bg: '#8B5CF6',                border: '#A78BFA'                 }, // 4 – Best
];

// ─── Legend ───────────────────────────────────────────────────────────────────
const LEGEND = [
  { label: 'Low',    level: 1 },
  { label: 'Medium', level: 2 },
  { label: 'High',   level: 3 },
  { label: 'Best',   level: 4 },
];

// ─── Single Heatmap Cell ──────────────────────────────────────────────────────
interface CellProps {
  level: number;
  row: number;
  col: number;
  date: number;
  rowLabel: string;
  animDelay: number;
}

const HeatmapCell: React.FC<CellProps> = ({ level, row, col, date, rowLabel, animDelay }) => {
  const [hovered, setHovered] = useState(false);
  const xp = mockXP(level, row, col);
  const { bg, border } = INTENSITY_STYLES[level];

  return (
    <div
      className="relative cell-in"
      style={{ animationDelay: `${animDelay}ms` }}
    >
      {/* Cell square */}
      <div
        className="cursor-pointer"
        style={{
          width: '26px',
          height: '26px',
          borderRadius: '6px',
          background: bg,
          border: `1px solid ${border}`,
          transition: 'transform 120ms ease, box-shadow 120ms ease',
          transform: hovered ? 'scale(1.18)' : 'scale(1)',
          boxShadow: hovered && level > 0
            ? `0 4px 14px rgba(139,92,246,${0.15 + level * 0.1})`
            : 'none',
          position: 'relative',
          zIndex: hovered ? 10 : 1,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />

      {/* Tooltip — pops above the cell */}
      {hovered && (
        <div
          className="tooltip-in pointer-events-none"
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 7px)',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 50,
            whiteSpace: 'nowrap',
          }}
        >
          <div
            className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium"
            style={{
              background: '#2A2935',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
              color: '#F5F5F7',
            }}
          >
            <span style={{ color: '#6B6A78' }}>{MONTH} {date} · {rowLabel}</span>
            <br />
            <span className="font-semibold" style={{ color: xp > 0 ? '#A78BFA' : '#6B6A78' }}>
              {xp > 0 ? `+${xp} XP` : 'No activity'}
            </span>
          </div>
          {/* Caret */}
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              borderTop: '5px solid #2A2935',
            }}
          />
        </div>
      )}
    </div>
  );
};

// ─── Weekly Engagement Heatmap Card ──────────────────────────────────────────
const WeeklyHeatmapCard: React.FC = () => {
  // Calculate totalXP correctly by iterating over all cells
  const totalXP = RAW_DATA.reduce((sum, row, rowIdx) =>
    sum + row.reduce((rowSum, lvl, colIdx) => rowSum + mockXP(lvl, rowIdx, colIdx), 0),
  0);

  return (
    <div className="axiom-card h-full flex flex-col">
      {/* ── Header row ── */}
      <div className="flex items-center gap-2.5 mb-5">
        {/* Icon */}
        <div
          className="card-icon-wrap"
          style={{
            background: 'rgba(139,92,246,0.13)',
            border: '1px solid rgba(139,92,246,0.2)',
          }}
        >
          <Activity size={14} strokeWidth={2} style={{ color: '#8B5CF6' }} />
        </div>

        <span className="card-title">Weekly Engagement</span>

        {/* XP total badge */}
        <div
          className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
          style={{ background: 'rgba(139,92,246,0.12)', color: '#A78BFA' }}
        >
          {totalXP.toLocaleString()} XP this period
        </div>

        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border border-white/[0.05]" style={{ color: '#6B6A78', background: 'rgba(255,255,255,0.02)' }}>
          Powered by Learning Heatmaps
        </span>

        <div className="flex-1" />

        {/* Legend */}
        <div className="flex items-center gap-3 mr-2">
          {LEGEND.map(({ label, level }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '3px',
                  background: INTENSITY_STYLES[level].bg,
                  border: `1px solid ${INTENSITY_STYLES[level].border}`,
                  flexShrink: 0,
                }}
              />
              <span className="text-[11px]" style={{ color: '#6B6A78' }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Refresh */}
        <button className="card-icon-btn" aria-label="Refresh heatmap">
          <RotateCw size={13} strokeWidth={2} />
        </button>
      </div>

      {/* ── Heatmap grid ── */}
      <div className="flex-1 flex flex-col justify-center">
        {/* Each row: label + cells */}
        <div className="flex flex-col gap-2" style={{ overflow: 'visible' }}>
          {ROW_LABELS.map((rowLabel, rowIdx) => (
            <div key={rowLabel} className="flex items-center gap-2">
              {/* Row label */}
              <div
                className="text-right flex-shrink-0"
                style={{ width: '80px', fontSize: '11px', color: '#6B6A78', fontWeight: 500 }}
              >
                {rowLabel}
              </div>

              {/* Cells */}
              <div className="flex gap-[5px]" style={{ overflow: 'visible' }}>
                {DATES.map((date, colIdx) => (
                  <HeatmapCell
                    key={`${rowIdx}-${colIdx}`}
                    level={RAW_DATA[rowIdx][colIdx]}
                    row={rowIdx}
                    col={colIdx}
                    date={date}
                    rowLabel={rowLabel}
                    animDelay={rowIdx * 60 + colIdx * 20}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Column date labels (bottom) ── */}
        <div className="flex items-center gap-[5px] mt-2.5" style={{ paddingLeft: '88px' }}>
          {DATES.map((date) => (
            <div
              key={date}
              style={{
                width: '26px',
                textAlign: 'center',
                fontSize: '10px',
                color: '#6B6A78',
                fontWeight: 500,
                flexShrink: 0,
              }}
            >
              {date}
            </div>
          ))}
        </div>

        {/* ── Summary bar ── */}
        <div
          className="flex items-center gap-6 mt-5 pt-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          {[
            { label: 'Active days', value: '9 / 12', color: '#A78BFA' },
            { label: 'Avg daily XP', value: '142', color: '#34D399' },
            { label: 'Peak activity', value: `Jun 20`, color: '#60A5FA' },
            { label: 'Top category', value: 'AI Sessions', color: '#FB923C' },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <p className="text-[10.5px] mb-0.5" style={{ color: '#6B6A78' }}>{label}</p>
              <p className="text-[13px] font-semibold" style={{ color }}>{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklyHeatmapCard;
