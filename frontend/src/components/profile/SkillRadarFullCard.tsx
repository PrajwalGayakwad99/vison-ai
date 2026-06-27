import React from 'react';
import Card from '../ui/Card';
import { Brain } from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

const SKILL_DATA = [
  { subject: 'Algorithms', score: 85, fullMark: 100 },
  { subject: 'Data Structures', score: 78, fullMark: 100 },
  { subject: 'Debugging', score: 65, fullMark: 100 },
  { subject: 'Systems Design', score: 90, fullMark: 100 },
  { subject: 'Databases', score: 72, fullMark: 100 },
  { subject: 'Code Quality', score: 82, fullMark: 100 },
];

const SkillRadarFullCard: React.FC = () => {
  return (
    <Card
      icon={<Brain size={15} strokeWidth={2} />}
      title="AI Skill Assessment Radar"
      showViewAll={false}
      showRefresh
      className="h-full"
    >
      <div className="mt-4 flex flex-col justify-between h-[300px]">
        {/* Radar Chart Container */}
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={SKILL_DATA}>
            <defs>
              <radialGradient id="radar-glow-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#A78BFA" stopOpacity="0.1" />
              </radialGradient>
            </defs>
            <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: '#8B8A99', fontSize: 11, fontWeight: 500 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: '#6B6A78', fontSize: 9 }}
              stroke="rgba(255, 255, 255, 0.1)"
            />
            <Radar
              name="Michael"
              dataKey="score"
              stroke="#8B5CF6"
              strokeWidth={2}
              fill="url(#radar-glow-grad)"
              fillOpacity={1}
              isAnimationActive={true}
              animationDuration={1200}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend / Metrics */}
      <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/[0.05]">
        {[
          { label: 'Top Skill', val: 'Systems Design (90)', color: '#34D399' },
          { label: 'Aggregate Score', val: '78.2 / 100', color: '#A78BFA' },
          { label: 'Next Goal', val: 'Recursion Debugging', color: '#FB923C' },
        ].map((metric) => (
          <div key={metric.label}>
            <p className="text-[10px] text-[#6B6A78] font-bold uppercase tracking-wider">{metric.label}</p>
            <p className="text-[12.5px] font-semibold mt-1" style={{ color: metric.color }}>{metric.val}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default SkillRadarFullCard;
