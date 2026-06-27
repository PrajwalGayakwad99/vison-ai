import React from 'react';
import Card from '../ui/Card';
import { Target, Sparkles } from 'lucide-react';
import type { SkillGap } from '../../types';

const MOCK_GAPS: SkillGap[] = [
  {
    topic: 'Recursion Call Stacks',
    severity: 'high',
    note: 'Struggled on 3 recent quizzes; call stack frames execution mismatch.',
  },
  {
    topic: 'Pointers & Heap Allocation',
    severity: 'medium',
    note: 'Code execution failed due to dereferencing null pointers.',
  },
  {
    topic: 'Binary Search Trees',
    severity: 'low',
    note: 'Mild delay in rebalancing traversal execution speed.',
  },
];

const SEVERITY_STYLES: Record<string, { color: string; border: string; bg: string }> = {
  high: {
    color: '#F87171',
    border: 'rgba(248,113,113,0.3)',
    bg: 'rgba(248,113,113,0.12)',
  },
  medium: {
    color: '#FB923C',
    border: 'rgba(251,146,60,0.3)',
    bg: 'rgba(251,146,60,0.12)',
  },
  low: {
    color: '#34D399',
    border: 'rgba(52,211,153,0.3)',
    bg: 'rgba(52,211,153,0.12)',
  },
};

const SkillGapDetectionCard: React.FC = () => {
  return (
    <Card
      icon={<Target size={15} strokeWidth={2} />}
      title="Skill Gap Detection"
      showViewAll={false}
      showRefresh={false}
      className="h-full"
    >
      <div className="flex flex-col justify-between h-full pt-2">
        {/* Gap List */}
        <div className="flex flex-col gap-3.5">
          {MOCK_GAPS.map((gap, idx) => {
            const style = SEVERITY_STYLES[gap.severity];
            return (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-white/[0.04] bg-[#14131A] hover:border-white/[0.08] transition-colors flex items-start gap-3.5"
              >
                {/* Severity Badge */}
                <div
                  className="px-2 py-0.5 rounded text-[8.5px] uppercase font-extrabold tracking-wider border shrink-0 text-center"
                  style={{
                    color: style.color,
                    borderColor: style.border,
                    background: style.bg,
                  }}
                >
                  {gap.severity}
                </div>

                <div>
                  <h4 className="text-[13px] font-bold text-[#F5F5F7] leading-none">
                    {gap.topic}
                  </h4>
                  <p className="text-[11.5px] text-[#8B8A99] mt-2 leading-relaxed">
                    {gap.note}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Global Action CTA Button */}
        <div className="mt-6 pt-4 border-t border-white/[0.05]">
          <button
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12.5px] font-bold text-white transition-all duration-150 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
              boxShadow: '0 4px 12px rgba(139,92,246,0.3)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 16px rgba(139,92,246,0.45)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(139,92,246,0.3)';
            }}
          >
            <Sparkles size={13} fill="white" />
            Generate Custom Practice Set
          </button>
        </div>
      </div>
    </Card>
  );
};

export default SkillGapDetectionCard;
