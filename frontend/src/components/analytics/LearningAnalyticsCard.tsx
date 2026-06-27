import React from 'react';
import Card from '../ui/Card';
import { useCountUp } from '../../hooks/useCountUp';
import { TrendingUp } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const MOCK_TIMELINE = [
  { day: 'Day 1', score: 62 },
  { day: 'Day 5', score: 65 },
  { day: 'Day 10', score: 71 },
  { day: 'Day 15', score: 69 },
  { day: 'Day 20', score: 75 },
  { day: 'Day 25', score: 81 },
  { day: 'Day 30', score: 87 },
];

const LearningAnalyticsCard: React.FC = () => {
  const avgSession = useCountUp(24, 1500);
  const lessonsCount = useCountUp(63, 1400);
  const conceptsCount = useCountUp(9, 1200);

  const [chartKey, setChartKey] = React.useState(0);
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setChartKey((prev) => prev + 1);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Card
      icon={<TrendingUp size={15} strokeWidth={2} />}
      title="Learning Analytics"
      showViewAll
      showRefresh={false}
    >
      <div className="mt-4">
        {/* Explanation subtitle */}
        <p className="text-[12.5px] text-[#8B8A99] mb-4">
          Understanding score dynamics modeled over the last 30 days based on compile trials and quiz responses.
        </p>

        {/* Recharts Area/Line Chart */}
        <div className="h-[240px] w-full min-w-0 overflow-hidden">
          <ResponsiveContainer key={chartKey} width="100%" height={240} minWidth={0}>
            <AreaChart data={MOCK_TIMELINE} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="score-glow-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.03)" />
              <XAxis
                dataKey="day"
                tick={{ fill: '#6B6A78', fontSize: 10 }}
                stroke="rgba(255, 255, 255, 0.05)"
              />
              <YAxis
                domain={[50, 100]}
                tick={{ fill: '#6B6A78', fontSize: 10 }}
                stroke="rgba(255, 255, 255, 0.05)"
              />
              <Tooltip
                contentStyle={{
                  background: '#1E1D27',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
                }}
                labelStyle={{ color: '#6B6A78', fontSize: 10, fontWeight: 600 }}
                itemStyle={{ color: '#A78BFA', fontSize: 12, fontWeight: 600 }}
              />
              <Area
                type="monotone"
                dataKey="score"
                name="Understanding Score"
                stroke="#8B5CF6"
                strokeWidth={2.5}
                fill="url(#score-glow-grad)"
                isAnimationActive={true}
                animationDuration={1200}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Compact stats row below chart */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-white/[0.05]">
          {[
            { label: 'Avg Session Time', val: `${Math.round(avgSession)} min`, color: '#A78BFA' },
            { label: 'Lessons Interacted', val: Math.round(lessonsCount), color: '#34D399' },
            { label: 'Concepts Revisited', val: Math.round(conceptsCount), color: '#FB923C' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <span className="text-[10px] text-[#6B6A78] font-bold uppercase tracking-wider">
                {stat.label}
              </span>
              <span className="text-[20px] font-bold leading-tight mt-1" style={{ color: stat.color }}>
                {stat.val}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default LearningAnalyticsCard;
