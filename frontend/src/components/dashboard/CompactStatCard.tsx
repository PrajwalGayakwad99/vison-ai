import React from 'react';
import { useCountUp } from '../../hooks/useCountUp';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface CompactStatCardProps {
  icon: React.ReactNode;
  iconColor?: string;
  title: string;
  /** The formatted display string, e.g. "282", "87%", "4.8h" */
  display?: string;
  /** Raw numeric target for the count-up animation */
  numericTarget: number;
  decimals?: number;
  /** Display suffix appended after the animated number, e.g. "%" or "h" */
  suffix?: string;
  /** Prefix before the number, e.g. "" */
  prefix?: string;
  delta: string;
  positive: boolean;
}

// ─── CompactStatCard ──────────────────────────────────────────────────────────
const CompactStatCard: React.FC<CompactStatCardProps> = ({
  icon,
  iconColor = '#8B5CF6',
  title,
  numericTarget,
  decimals = 0,
  suffix = '',
  prefix = '',
  delta,
  positive,
}) => {
  const count = useCountUp(numericTarget, 1400, decimals);
  const formatted = decimals > 0 ? count.toFixed(decimals) : Math.round(count).toLocaleString();

  const iconRgb = iconColor === '#8B5CF6'
    ? '139,92,246'
    : iconColor === '#34D399'
    ? '52,211,153'
    : iconColor === '#60A5FA'
    ? '96,165,250'
    : iconColor === '#FB923C'
    ? '251,146,60'
    : '139,92,246';

  return (
    <div className="axiom-card flex flex-col" style={{ padding: '18px' }}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div
          className="card-icon-wrap"
          style={{
            background: `rgba(${iconRgb}, 0.13)`,
            border: `1px solid rgba(${iconRgb}, 0.2)`,
          }}
        >
          <span style={{ color: iconColor, display: 'flex' }}>{icon}</span>
        </div>
        <span className="card-title text-[13px]">{title}</span>
      </div>

      {/* Big number */}
      <div className="flex-1 flex flex-col justify-end">
        <p
          className="num-in font-bold leading-none tracking-tight"
          style={{ fontSize: '32px', color: '#F5F5F7', letterSpacing: '-0.035em' }}
        >
          {prefix}{formatted}{suffix}
        </p>

        {/* Delta */}
        <div className="flex items-center gap-1.5 mt-2">
          <span
            className="text-[11.5px] font-semibold"
            style={{ color: positive ? '#34D399' : '#F87171' }}
          >
            {positive ? '↑' : '↓'} {delta}
          </span>
          <span className="text-[11px]" style={{ color: '#6B6A78' }}>vs prev. month</span>
        </div>
      </div>
    </div>
  );
};

export default CompactStatCard;
