import React, { useState } from 'react';
import {
  LayoutDashboard,
  Code2,
  Sparkles,
  Map,
  Trophy,
  Users,
  MessageCircle,
  Zap,
  ChevronDown,
  BarChart3,
  Flame,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';

// ─── Logo Mark ────────────────────────────────────────────────────────────────
export const AxiomLogoMark: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="lm-g1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#A78BFA" />
      </linearGradient>
      <linearGradient id="lm-g2" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#C4B5FD" stopOpacity="0.9" />
      </linearGradient>
    </defs>
    <circle cx="10" cy="14" r="8" fill="url(#lm-g1)" />
    <circle cx="19" cy="14" r="7" fill="url(#lm-g2)" />
    <ellipse cx="14.5" cy="14" rx="3" ry="5.5" fill="rgba(255,255,255,0.15)" />
  </svg>
);

// ─── Nav sections ─────────────────────────────────────────────────────────────
const GENERAL_ITEMS = [
  { id: '/',              label: 'Dashboard',   Icon: LayoutDashboard },
  { id: '/workspace',     label: 'Workspace',   Icon: Code2 },
  { id: '/analytics',     label: 'Analytics',   Icon: BarChart3 },
  { id: '/ai-tutor',      label: 'AI Tutor',    Icon: Sparkles, accent: true },
];

const LEARN_ITEMS = [
  { id: '/curriculum',    label: 'Curriculum',  Icon: Map },
  { id: '/challenges',    label: 'Challenges',  Icon: Trophy },
  { id: '/gamification',  label: 'Gamification', Icon: Flame },
];

const CONNECT_ITEMS = [
  { id: '/study-groups',  label: 'Study Groups', Icon: Users },
  { id: '/community',     label: 'Community',    Icon: MessageCircle },
];

const ENROLLED_COURSES = [
  { id: 'c1', title: 'Data Structures & Algorithms', initials: 'DS', color: '#8B5CF6' },
  { id: 'c2', title: 'System Design Mastery',        initials: 'SD', color: '#34D399' },
  { id: 'c3', title: 'Databases Deep Dive',          initials: 'DB', color: '#F87171' },
  { id: 'c4', title: 'TypeScript Advanced',          initials: 'TS', color: '#60A5FA' },
  { id: 'c5', title: 'React Internals',              initials: 'RE', color: '#FBBF24' },
];

const VISIBLE_DEFAULT = 3;

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const Sidebar: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? ENROLLED_COURSES : ENROLLED_COURSES.slice(0, VISIBLE_DEFAULT);
  const hidden = ENROLLED_COURSES.length - VISIBLE_DEFAULT;

  const pathname = usePathname();
  const router = useRouter();

  const isActive = (id: string) => pathname === id || (id !== '/' && pathname?.startsWith(id + '/'));

  // Shared nav item renderer — uses Framer Motion layoutId for animated pill
  const NavBtn: React.FC<{
    id: string;
    label: string;
    Icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string; style?: React.CSSProperties }>;
    accent?: boolean;
    badge?: number;
  }> = ({ id, label, Icon, accent = false, badge }) => {
    const active = isActive(id);
    return (
      <button
        onClick={() => router.push(id)}
        className="relative flex items-center gap-2.5 px-3 py-[9px] rounded-xl w-full text-left transition-colors duration-150"
        style={{
          color: active ? '#F5F5F7' : accent ? '#A78BFA' : '#8B8A99',
        }}
      >
        {/* Animated active pill background (shared layoutId across ALL nav sections) */}
        <AnimatePresence>
          {active && (
            <motion.div
              layoutId="nav-active-pill"
              className="absolute inset-0 rounded-xl"
              style={{ background: accent ? 'rgba(139,92,246,0.18)' : '#2A2935' }}
              initial={false}
              transition={{ type: 'spring', stiffness: 500, damping: 38, mass: 0.8 }}
            />
          )}
        </AnimatePresence>

        <Icon
          size={18}
          strokeWidth={1.75}
          className="relative z-10 flex-shrink-0 transition-colors duration-150"
          style={{ color: active ? (accent ? '#A78BFA' : '#F5F5F7') : accent ? '#A78BFA' : '#8B8A99' }}
        />
        <span className="relative z-10 text-[13.5px] font-medium flex-1">{label}</span>

        {accent && !active && (
          <span
            className="relative z-10 ml-auto text-[9.5px] font-semibold px-1.5 py-0.5 rounded-full"
            style={{ background: 'rgba(139,92,246,0.18)', color: '#A78BFA' }}
          >
            NEW
          </span>
        )}

        {badge != null && badge > 0 && (
          <span
            className="relative z-10 ml-auto min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9.5px] font-bold text-white px-1"
            style={{ background: '#8B5CF6' }}
          >
            {badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <aside
      className="flex flex-col h-full select-none"
      style={{
        width: '220px',
        minWidth: '220px',
        background: '#14131A',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        overflow: 'hidden',
      }}
    >
      {/* Scrollable nav area */}
      <div className="flex-1 overflow-y-auto px-3 pt-5 pb-2" style={{ scrollbarWidth: 'thin' }}>
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-2 mb-5">
          <AxiomLogoMark size={28} />
          <div>
            <p className="text-[15px] font-bold tracking-tight text-[#F5F5F7] leading-tight">AXIOM</p>
            <p className="text-[10px] text-[#6B6A78] font-medium tracking-wide leading-tight">AI Visual Learning</p>
          </div>
        </div>

        {/* GENERAL */}
        <p className="section-label" style={{ marginTop: 0 }}>General</p>
        <nav className="flex flex-col gap-0.5 mb-5">
          {GENERAL_ITEMS.map(({ id, label, Icon, accent }) => (
            <NavBtn key={id} id={id} label={label} Icon={Icon} accent={accent} />
          ))}
        </nav>

        {/* LEARN */}
        <p className="section-label">Learn</p>
        <nav className="flex flex-col gap-0.5 mb-5">
          {LEARN_ITEMS.map(({ id, label, Icon }) => (
            <NavBtn key={id} id={id} label={label} Icon={Icon} />
          ))}
        </nav>

        {/* CONNECT */}
        <p className="section-label">Connect</p>
        <nav className="flex flex-col gap-0.5 mb-5">
          {CONNECT_ITEMS.map(({ id, label, Icon }) => (
            <NavBtn key={id} id={id} label={label} Icon={Icon} />
          ))}
        </nav>

        {/* ENROLLED COURSES */}
        <p className="section-label">Courses</p>
        <div className="flex flex-col gap-0.5 mb-3">
          {visible.map((course) => (
            <button
              key={course.id}
              onClick={() => router.push('/')}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl group transition-colors duration-150 w-full text-left hover:bg-white/[0.03]"
            >
              <span
                className="w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center text-[9.5px] font-bold"
                style={{ background: course.color + '22', color: course.color, border: `1px solid ${course.color}33` }}
              >
                {course.initials}
              </span>
              <span className="text-[12.5px] font-medium text-[#8B8A99] group-hover:text-[#C4C3D0] transition-colors truncate">
                {course.title}
              </span>
            </button>
          ))}
          {!showAll && hidden > 0 && (
            <button
              onClick={() => setShowAll(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-[#6B6A78] hover:text-[#8B8A99] transition-colors"
            >
              <ChevronDown size={13} strokeWidth={2} />
              Show {hidden} more
            </button>
          )}
          {showAll && (
            <button
              onClick={() => setShowAll(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-[#6B6A78] hover:text-[#8B8A99] transition-colors"
            >
              <ChevronDown size={13} strokeWidth={2} className="rotate-180" />
              Show less
            </button>
          )}
        </div>
      </div>

      {/* Upgrade CTA — always visible at bottom */}
      <div className="px-3 pb-4 pt-2 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div
          className="rounded-2xl p-3.5 mb-3"
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(167,139,250,0.06) 100%)',
            border: '1px solid rgba(139,92,246,0.2)',
          }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <Zap size={13} className="text-[#A78BFA]" strokeWidth={2.5} />
            <p className="text-[11.5px] font-semibold text-[#C4B5FD]">Unlock Pro Features</p>
          </div>
          <p className="text-[11px] text-[#6B6A78] leading-snug">
            Voice AI Tutor, unlimited challenges & skill radar insights.
          </p>
        </div>
        <button
          className="btn-upgrade"
          onClick={() => {}}
        >
          <Zap size={14} strokeWidth={2.5} />
          Upgrade to Pro
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
