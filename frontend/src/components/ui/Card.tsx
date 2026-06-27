import React from 'react';
import { RotateCw } from 'lucide-react';
import clsx from 'clsx';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface CardProps {
  /** 16px icon rendered inside the 28px header circle. Omit on hero-style cards. */
  icon?: React.ReactNode;
  /** Optional tint for the icon circle bg/border (defaults to violet) */
  iconColor?: string;
  title?: string;
  /** Shows "View all" link on the right of the header */
  showViewAll?: boolean;
  onViewAll?: () => void;
  /** Shows the circular refresh icon button */
  showRefresh?: boolean;
  onRefresh?: () => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Suppress the standard header row entirely (used for hero spotlight card) */
  noHeader?: boolean;
  /** Remove internal padding so children can bleed to edges */
  noPadding?: boolean;
}

// ─── Card Component ───────────────────────────────────────────────────────────
const Card: React.FC<CardProps> = ({
  icon,
  iconColor = '#8B5CF6',
  title,
  showViewAll = false,
  onViewAll,
  showRefresh = true,
  onRefresh,
  children,
  className,
  style,
  noHeader = false,
  noPadding = false,
}) => {
  const iconRgb = iconColor === '#8B5CF6'
    ? '139,92,246'
    : iconColor === '#34D399'
    ? '52,211,153'
    : iconColor === '#F87171'
    ? '248,113,113'
    : iconColor === '#60A5FA'
    ? '96,165,250'
    : '139,92,246';

  return (
    <div
      className={clsx('axiom-card', noPadding && '!p-0', className)}
      style={style}
    >
      {/* ── Header Row ── */}
      {!noHeader && (icon || title) && (
        <div className="card-header">
          {/* Icon circle */}
          {icon && (
            <div
              className="card-icon-wrap"
              style={{
                background: `rgba(${iconRgb}, 0.13)`,
                border: `1px solid rgba(${iconRgb}, 0.2)`,
              }}
            >
              <span style={{ color: iconColor, display: 'flex' }}>{icon}</span>
            </div>
          )}

          {/* Title */}
          {title && <span className="card-title">{title}</span>}

          {/* Spacer */}
          <div className="flex-1" />

          {/* View all */}
          {showViewAll && (
            <button className="card-view-all" onClick={onViewAll}>
              View all
            </button>
          )}

          {/* Refresh button */}
          {showRefresh && (
            <button
              className="card-icon-btn ml-1.5"
              onClick={onRefresh}
              aria-label="Refresh"
            >
              <RotateCw size={13} strokeWidth={2} />
            </button>
          )}
        </div>
      )}

      {/* ── Content ── */}
      {children}
    </div>
  );
};

export default Card;
