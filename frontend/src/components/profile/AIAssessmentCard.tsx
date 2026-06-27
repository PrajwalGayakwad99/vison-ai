import React from 'react';
import Card from '../ui/Card';
import { Sparkles, Zap, Target } from 'lucide-react';

const AIAssessmentCard: React.FC = () => {
  return (
    <Card
      icon={<Sparkles size={14} strokeWidth={2} />}
      title="AI Assessment Summary"
      showViewAll={false}
      showRefresh={false}
      className="h-full"
    >
      <div className="flex flex-col justify-between h-full pt-2 pb-1">
        {/* Paragraph block */}
        <div className="text-[13px] text-[#8B8A99] leading-relaxed">
          <p className="mb-3.5">
            Michael shows exceptional command of <span className="text-[#F5F5F7] font-semibold">Systems Design</span> and 
            complexity analysis, ranking in the <span className="text-[#34D399] font-bold">top 9%</span> of learners. 
            He demonstrates structural thinking in memory allocation models.
          </p>
          <p>
            The primary learning bottleneck is in <span className="text-[#FB923C] font-semibold">Recursion Call Stacks</span>. 
            We recommend focusing on binary recursion tree tracing to close his current debugging skill gap.
          </p>
        </div>

        {/* Strengths / Growth areas pills */}
        <div className="flex flex-col gap-4 mt-6 pt-5 border-t border-white/[0.05]">
          {/* Strengths */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Zap size={12} className="text-[#34D399]" />
              <span className="text-[10px] font-bold text-[#6B6A78] uppercase tracking-wider">Top Strengths</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['Complexity Analysis', 'System Design', 'Memory Models'].map((strength) => (
                <span
                  key={strength}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-[#34D399]"
                >
                  {strength}
                </span>
              ))}
            </div>
          </div>

          {/* Growth Areas */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Target size={12} className="text-[#FB923C]" />
              <span className="text-[10px] font-bold text-[#6B6A78] uppercase tracking-wider">Focus Growth Areas</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['Recursion Stack Tracing', 'Pointer Safety', 'B-Trees'].map((growth) => (
                <span
                  key={growth}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-lg border border-orange-500/20 bg-orange-500/10 text-[#FB923C]"
                >
                  {growth}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AIAssessmentCard;
