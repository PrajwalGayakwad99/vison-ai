import React from 'react';
import Card from '../ui/Card';
import { Activity } from 'lucide-react';

const ROW_LABELS = ['Arrays', 'Recursion', 'Trees', 'Graphs', 'Dynamic Prog.'];
const LESSONS = Array.from({ length: 12 }, (_, i) => `L${i + 1}`);

// Mock data (intensity levels: 0 = Quick, 1 = Normal, 2 = Slow, 3 = Stuck)
const RAW_DATA: number[][] = [
  /* Arrays       */ [0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0],
  /* Recursion    */ [0, 2, 3, 2, 3, 1, 0, 1, 2, 0, 1, 2],
  /* Trees        */ [1, 2, 1, 0, 2, 1, 1, 0, 2, 1, 2, 0],
  /* Graphs       */ [0, 1, 2, 1, 2, 0, 1, 2, 3, 2, 1, 0],
  /* Dynamic Prog.*/ [2, 3, 2, 3, 2, 1, 3, 2, 1, 2, 3, 2],
];

const MOCK_CELL_NOTES: Record<string, { time: string; note?: string }> = {
  '1-2': { time: '45 mins', note: 'Struggled on 4 retries' },
  '1-4': { time: '52 mins', note: 'Failed compiler AST test 6 times' },
  '3-8': { time: '38 mins', note: 'Cycle checks infinite loops' },
  '4-1': { time: '65 mins', note: 'Knapsack subproblem overflow' },
  '4-3': { time: '55 mins', note: 'Stuck on Memoization state allocation' },
  '4-6': { time: '72 mins', note: 'LCS recursive stack overflow' },
};

const INTENSITY_STYLES: Record<number, { bg: string; border: string; label: string }> = {
  0: { bg: 'rgba(139, 92, 246, 0.08)',  border: 'rgba(139, 92, 246, 0.15)',  label: 'Quick' },
  1: { bg: 'rgba(139, 92, 246, 0.25)',  border: 'rgba(139, 92, 246, 0.35)',  label: 'Normal' },
  2: { bg: 'rgba(139, 92, 246, 0.55)',  border: 'rgba(139, 92, 246, 0.65)',  label: 'Slow' },
  3: { bg: '#8B5CF6',                  border: '#A78BFA',                  label: 'Stuck' },
};

interface HeatmapCellProps {
  level: number;
  rowIdx: number;
  colIdx: number;
  lessonName: string;
  topicName: string;
}

const HeatmapCell: React.FC<HeatmapCellProps> = ({
  level,
  rowIdx,
  colIdx,
  lessonName,
  topicName,
}) => {
  const { bg, border } = INTENSITY_STYLES[level];

  // Lookup mock stats
  const key = `${rowIdx}-${colIdx}`;
  const cellDetail = MOCK_CELL_NOTES[key] || {
    time: level === 0 ? '4 mins' : level === 1 ? '12 mins' : '24 mins',
  };

  return (
    <div className="relative group">
      {/* Cell Square */}
      <div
        id={`cell-${rowIdx}-${colIdx}`}
        className="w-7 h-7 rounded-md cursor-pointer transition-all duration-100 hover:scale-118"
        style={{
          background: bg,
          border: `1px solid ${border}`,
        }}
      />

      {/* Floating Tooltip */}
      <div
        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2.5 rounded-xl text-[11px] text-[#F5F5F7] whitespace-nowrap z-50 pointer-events-none shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-150"
        style={{
          background: '#2A2935',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <span className="font-bold text-[#A78BFA]">
          {topicName} &bull; {lessonName}
        </span>
        <div className="mt-1 flex flex-col gap-0.5">
          <span>
            Duration: <strong className="text-white">{cellDetail.time}</strong>
          </span>
          {cellDetail.note && (
            <span className="text-[#F87171] font-semibold mt-0.5 font-mono">
              {cellDetail.note}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const LearningHeatmapCard: React.FC = () => {
  return (
    <Card
      icon={<Activity size={15} strokeWidth={2} />}
      title="Learning Heatmap"
      showViewAll={false}
      showRefresh
    >
      <div className="mt-4 flex flex-col gap-6 relative">
        {/* Heatmap header details */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-white/[0.03]">
          <p className="text-[12.5px] text-[#8B8A99]">
            Displays the amount of time spent per sub-topic. High intensity (dark purple) flags struggle points.
          </p>

          {/* Legend */}
          <div className="flex items-center gap-3 bg-[#14131A] px-3.5 py-1.5 rounded-full border border-white/[0.04]">
            {Object.entries(INTENSITY_STYLES).map(([key, style]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div
                  className="w-3.5 h-3.5 rounded border"
                  style={{
                    background: style.bg,
                    borderColor: style.border,
                  }}
                />
                <span className="text-[10px] text-[#6B6A78] font-bold uppercase tracking-wide">
                  {style.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Heatmap Grid Wrapper */}
        <div className="overflow-x-auto lg:overflow-visible pb-2 pt-6">
          <div className="flex flex-col gap-2 min-w-[520px]">
            {ROW_LABELS.map((rowLabel, rowIdx) => (
              <div key={rowLabel} className="flex items-center gap-3">
                {/* Topic Row Label */}
                <div className="w-[100px] text-right font-medium text-[12px] text-[#8B8A99] shrink-0 pr-1">
                  {rowLabel}
                </div>

                {/* Grid Cells */}
                <div className="flex gap-2">
                  {LESSONS.map((lessonName, colIdx) => (
                    <HeatmapCell
                      key={`${rowIdx}-${colIdx}`}
                      level={RAW_DATA[rowIdx][colIdx]}
                      rowIdx={rowIdx}
                      colIdx={colIdx}
                      lessonName={lessonName}
                      topicName={rowLabel}
                    />
                  ))}
                </div>
              </div>
            ))}

            {/* Column header dates/lessons */}
            <div className="flex items-center gap-2 mt-1.5" style={{ paddingLeft: '112px' }}>
              {LESSONS.map((lessonName) => (
                <div key={lessonName} className="w-7 text-center font-mono text-[9.5px] text-[#6B6A78] font-bold shrink-0">
                  {lessonName}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Heatmap summary footer stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/[0.04]">
          {[
            { label: 'Total Tracked Lessons', val: '60 Concepts', color: '#8B5CF6' },
            { label: 'Identified Struggle Blocks', val: '6 Lessons', color: '#F87171' },
            { label: 'Average Pace', val: '14.8 mins/topic', color: '#34D399' },
            { label: 'Self-Solve Ratio', val: '83%', color: '#FB923C' },
          ].map((metric) => (
            <div key={metric.label}>
              <p className="text-[10px] text-[#6B6A78] font-bold uppercase tracking-wider">{metric.label}</p>
              <p className="text-[14px] font-bold mt-1" style={{ color: metric.color }}>{metric.val}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default LearningHeatmapCard;
