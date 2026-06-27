import React from 'react';
import Card from '../ui/Card';
import { Route, Check } from 'lucide-react';
import type { PathStep } from '../../types';

const MOCK_PATH: PathStep[] = [
  {
    id: 's1',
    topic: 'Basic Arrays & Lists',
    reason: 'Standard sequence',
    status: 'completed',
  },
  {
    id: 's2',
    topic: 'Binary Search Traversal',
    reason: 'Standard sequence',
    status: 'completed',
  },
  {
    id: 's3',
    topic: 'Recursion Call Stacks',
    reason: 'Inserted: revision needed',
    status: 'current',
  },
  {
    id: 's4',
    topic: 'Tree Traversal Algorithms',
    reason: 'Reordered: pace adjustment',
    status: 'future',
  },
];

const AdaptivePathCard: React.FC = () => {
  return (
    <Card
      icon={<Route size={15} strokeWidth={2} />}
      title="Adaptive Learning Path"
      showViewAll={false}
      showRefresh={false}
      className="h-full"
    >
      <div className="flex flex-col justify-between h-full pt-1">
        {/* Subtitle */}
        <div className="flex items-center gap-1.5 mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-[11px] text-[#6B6A78] uppercase font-bold tracking-wider">
            Adjusted 2 hours ago based on your pace
          </span>
        </div>

        {/* Stepper Timeline */}
        <div className="relative pl-7 flex flex-col gap-6 flex-1">
          {/* Vertical connecting line */}
          <div
            className="absolute left-3 top-2.5 bottom-2.5 w-px bg-white/[0.04]"
            style={{
              background: 'linear-gradient(180deg, #8B5CF6 0%, rgba(139,92,246,0.3) 50%, rgba(255,255,255,0.04) 100%)',
            }}
          />

          {MOCK_PATH.map((step) => {
            const isCompleted = step.status === 'completed';
            const isCurrent = step.status === 'current';

            return (
              <div key={step.id} className="relative flex flex-col items-start gap-1">
                {/* Node icon / indicator */}
                <div
                  className="absolute -left-7 top-0.5 w-6 h-6 rounded-full flex items-center justify-center border z-10 transition-all duration-300"
                  style={{
                    background: isCompleted
                      ? 'rgba(52,211,153,0.12)'
                      : isCurrent
                      ? 'rgba(139,92,246,0.2)'
                      : '#14131A',
                    borderColor: isCompleted
                      ? '#34D399'
                      : isCurrent
                      ? '#A78BFA'
                      : 'rgba(255,255,255,0.08)',
                    boxShadow: isCurrent
                      ? '0 0 12px rgba(139,92,246,0.35)'
                      : 'none',
                  }}
                >
                  {isCompleted ? (
                    <Check size={11} className="text-[#34D399]" strokeWidth={3} />
                  ) : isCurrent ? (
                    <span className="w-2 h-2 rounded-full bg-[#A78BFA] animate-pulse" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6B6A78]" />
                  )}
                </div>

                {/* Topic label & tag */}
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-[13px] font-bold transition-colors ${
                      isCompleted
                        ? 'text-[#8B8A99]'
                        : isCurrent
                        ? 'text-[#F5F5F7] font-extrabold'
                        : 'text-[#6B6A78]'
                    }`}
                  >
                    {step.topic}
                  </span>
                  
                  {/* Justification pill tag */}
                  <span
                    className="text-[8.5px] uppercase font-extrabold tracking-wider px-1.5 py-0.5 rounded border"
                    style={{
                      background: isCurrent
                        ? 'rgba(239,68,68,0.06)'
                        : isCompleted
                        ? 'rgba(255,255,255,0.02)'
                        : 'rgba(139,92,246,0.05)',
                      borderColor: isCurrent
                        ? 'rgba(239,68,68,0.15)'
                        : isCompleted
                        ? 'rgba(255,255,255,0.04)'
                        : 'rgba(139,92,246,0.15)',
                      color: isCurrent
                        ? '#F87171'
                        : isCompleted
                        ? '#6B6A78'
                        : '#A78BFA',
                    }}
                  >
                    {step.reason}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default AdaptivePathCard;
