import React from 'react';
import Card from '../ui/Card';
import { useCountUp } from '../../hooks/useCountUp';
import { Briefcase, ShieldCheck } from 'lucide-react';

const ROLE_MATCHES = [
  {
    title: 'Systems Software Engineer',
    matchPct: 92,
    skills: ['C++', 'Python', 'Linux Kernel', 'POSIX Threading'],
  },
  {
    title: 'Backend Developer',
    matchPct: 85,
    skills: ['Node.js', 'TypeScript', 'PostgreSQL', 'Docker'],
  },
  {
    title: 'Site Reliability Engineer',
    matchPct: 76,
    skills: ['Go', 'Kubernetes', 'Terraform', 'Prometheus'],
  },
];

const CareerReadinessCard: React.FC = () => {
  const readinessPct = useCountUp(82, 1400);

  // Circular progress dimensions
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * readinessPct) / 100;

  return (
    <Card
      icon={<Briefcase size={14} strokeWidth={2} />}
      title="Career Readiness Profile"
      showViewAll={false}
      showRefresh={false}
    >
      <div className="flex flex-col lg:flex-row items-center gap-8 mt-4">
        {/* Left Side: Circular Ring Widget */}
        <div className="flex items-center gap-5 bg-[#14131A] p-4.5 rounded-2xl border border-white/[0.04] w-full lg:w-auto shrink-0 justify-center lg:justify-start">
          <div className="relative w-20 h-20">
            {/* Background SVG ring */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-white/[0.04]"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-[#8B5CF6]"
                strokeWidth="8"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 100ms ease-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[17px] font-bold text-[#F5F5F7] tracking-tight">
                {Math.round(readinessPct)}%
              </span>
            </div>
          </div>
          <div>
            <h4 className="text-[14px] font-bold text-[#F5F5F7] flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[#34D399]" />
              Career Ready
            </h4>
            <p className="text-[11.5px] text-[#8B8A99] mt-1">
              Top 12% in regional systems capabilities.
            </p>
          </div>
        </div>

        {/* Right Side: Role matches */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {ROLE_MATCHES.map((role) => (
            <div
              key={role.title}
              className="p-4 rounded-xl border border-white/[0.04] bg-[#14131A] hover:border-white/[0.08] transition-all duration-150 group"
            >
              <div className="flex items-start justify-between gap-2">
                <h5 className="text-[13px] font-bold text-[#F5F5F7] leading-snug group-hover:text-[#A78BFA] transition-colors">
                  {role.title}
                </h5>
                <span className="text-[12px] font-bold text-[#A78BFA]">{role.matchPct}%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden mt-2.5">
                <div
                  className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] rounded-full"
                  style={{ width: `${role.matchPct}%` }}
                />
              </div>

              {/* Mini tech chips */}
              <div className="flex flex-wrap gap-1 mt-3.5">
                {role.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-[9.5px] font-medium px-2 py-0.5 rounded bg-white/[0.03] text-[#8B8A99] border border-white/[0.04]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default CareerReadinessCard;
