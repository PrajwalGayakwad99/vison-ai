import React from 'react';
import { Sparkles, ArrowRight, Zap, Brain } from 'lucide-react';

// ─── Colorful Gradient Blob SVG ───────────────────────────────────────────────
const GlossyBlob: React.FC = () => (
  <svg
    width="260"
    height="240"
    viewBox="0 0 260 240"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ filter: 'blur(0px)' }}
  >
    <defs>
      {/* Blue */}
      <radialGradient id="hb1" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#60A5FA" stopOpacity="1" />
        <stop offset="70%" stopColor="#60A5FA" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#60A5FA" stopOpacity="0" />
      </radialGradient>
      {/* Purple */}
      <radialGradient id="hb2" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#C084FC" stopOpacity="1" />
        <stop offset="65%" stopColor="#C084FC" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#C084FC" stopOpacity="0" />
      </radialGradient>
      {/* Pink */}
      <radialGradient id="hb3" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#F472B6" stopOpacity="0.9" />
        <stop offset="60%" stopColor="#F472B6" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#F472B6" stopOpacity="0" />
      </radialGradient>
      {/* Orange */}
      <radialGradient id="hb4" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FB923C" stopOpacity="0.9" />
        <stop offset="60%" stopColor="#FB923C" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#FB923C" stopOpacity="0" />
      </radialGradient>
      {/* Cyan */}
      <radialGradient id="hb5" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#34D399" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#34D399" stopOpacity="0" />
      </radialGradient>
      {/* Glossy white highlight */}
      <radialGradient id="hb6" cx="40%" cy="35%" r="50%">
        <stop offset="0%" stopColor="white" stopOpacity="0.35" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>
      {/* Blur filter for soft blob look */}
      <filter id="blob-blur" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="12" />
      </filter>
      <filter id="highlight-blur">
        <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
      </filter>
    </defs>

    {/* ── Blurred blob layer ── */}
    <g filter="url(#blob-blur)">
      {/* Primary blue mass */}
      <ellipse cx="140" cy="110" rx="80" ry="75" fill="url(#hb1)" />
      {/* Purple mass */}
      <ellipse cx="175" cy="150" rx="70" ry="65" fill="url(#hb2)" />
      {/* Pink accent */}
      <ellipse cx="110" cy="160" rx="65" ry="55" fill="url(#hb3)" />
      {/* Orange accent */}
      <ellipse cx="190" cy="90" rx="58" ry="52" fill="url(#hb4)" />
      {/* Cyan touch */}
      <ellipse cx="90" cy="100" rx="45" ry="42" fill="url(#hb5)" />
    </g>

    {/* ── Sharp inner core (no blur, gives 3D glossy depth) ── */}
    <ellipse cx="155" cy="120" rx="48" ry="44" fill="url(#hb1)" opacity="0.6" />
    <ellipse cx="170" cy="135" rx="40" ry="36" fill="url(#hb2)" opacity="0.55" />
    <ellipse cx="140" cy="148" rx="35" ry="30" fill="url(#hb3)" opacity="0.5" />

    {/* ── Glossy specular highlight ── */}
    <g filter="url(#highlight-blur)">
      <ellipse cx="140" cy="105" rx="30" ry="24" fill="url(#hb6)" />
    </g>

    {/* ── Tiny sharp top-highlight dot ── */}
    <circle cx="133" cy="95" r="8" fill="white" opacity="0.2" />
    <circle cx="133" cy="95" r="4" fill="white" opacity="0.3" />
  </svg>
);

// ─── Feature Pill ─────────────────────────────────────────────────────────────
const FeaturePill: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <div
    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11.5px] font-medium"
    style={{
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.1)',
      color: '#C4C3D0',
    }}
  >
    <span style={{ color: '#A78BFA' }}>{icon}</span>
    {label}
  </div>
);

// ─── Hero Spotlight Card ──────────────────────────────────────────────────────
interface HeroSpotlightCardProps {
  onOpenWorkspace?: () => void;
}

const HeroSpotlightCard: React.FC<HeroSpotlightCardProps> = ({ onOpenWorkspace }) => (
  /* Gradient border wrapper — 2px gradient border trick */
  <div
    className="relative"
    style={{
      background: 'linear-gradient(135deg, #60A5FA 0%, #C084FC 35%, #F472B6 65%, #FB923C 100%)',
      borderRadius: '22px',
      padding: '2px',
    }}
  >
    {/* Inner dark panel */}
    <div
      className="relative overflow-hidden flex flex-col justify-between h-full"
      style={{
        background: '#14131A',
        borderRadius: '20px',
        padding: '28px',
        minHeight: '220px',
      }}
    >
      {/* ── Top-left content ── */}
      <div className="relative z-10 max-w-[55%]">
        {/* Eyebrow label */}
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-5 h-5 rounded-md flex items-center justify-center"
            style={{ background: 'rgba(139,92,246,0.25)', border: '1px solid rgba(139,92,246,0.35)' }}
          >
            <Sparkles size={11} strokeWidth={2.5} style={{ color: '#A78BFA' }} />
          </div>
          <span className="text-[11px] font-semibold tracking-widest uppercase" style={{ color: '#A78BFA' }}>
            Core Learning Engine
          </span>
        </div>

        {/* Gradient headline */}
        <h2
          className="font-bold leading-tight mb-3"
          style={{
            fontSize: '26px',
            background: 'linear-gradient(135deg, #60A5FA 0%, #C084FC 40%, #F472B6 70%, #FB923C 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.03em',
          }}
        >
          Watch Code Come Alive
        </h2>

        {/* Subtext */}
        <p className="text-[13px] leading-relaxed mb-5" style={{ color: '#8B8A99' }}>
          Memory panels, call stacks, and algorithms — animated in real time.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          <FeaturePill icon={<Brain size={11} strokeWidth={2.5} />} label="Memory Visualization" />
          <FeaturePill icon={<Zap size={11} strokeWidth={2.5} />} label="Call Stack Animation" />
          <FeaturePill icon={<Sparkles size={11} strokeWidth={2.5} />} label="Algorithm Visualizer" />
        </div>

        {/* CTA */}
        <button
          onClick={onOpenWorkspace}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold text-white transition-all duration-150 hover:gap-3"
          style={{
            background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
            boxShadow: '0 4px 16px rgba(139,92,246,0.4), 0 1px 0 rgba(255,255,255,0.15) inset',
          }}
        >
          Open Workspace
          <ArrowRight size={14} strokeWidth={2.5} />
        </button>
      </div>

      {/* ── Blob — bleeds off right/bottom edge ── */}
      <div
        className="absolute"
        style={{
          right: '-30px',
          bottom: '-30px',
          pointerEvents: 'none',
        }}
      >
        <GlossyBlob />
      </div>

      {/* ── Subtle ambient glow behind blob ── */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '200px',
          height: '200px',
          right: '-20px',
          bottom: '-40px',
          background: 'radial-gradient(circle, rgba(192,132,252,0.12) 0%, transparent 70%)',
          filter: 'blur(24px)',
        }}
      />
    </div>
  </div>
);

export default HeroSpotlightCard;
