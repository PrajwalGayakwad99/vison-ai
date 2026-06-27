import React from 'react';
import SkillRadarCard from './SkillRadarCard';
import HeroSpotlightCard from './HeroSpotlightCard';
import CalendarCard from './CalendarCard';
import StatsGrid from './StatsGrid';
import WeeklyHeatmapCard from './WeeklyHeatmapCard';

// ─── Greeting Header ──────────────────────────────────────────────────────────
const GreetingHeader: React.FC = () => (
  <div className="mb-8">
    <p className="text-[15px] font-medium" style={{ color: '#8B8A99' }}>
      Hi, Michael! 👋
    </p>
    <h1
      className="font-bold leading-tight mt-0.5"
      style={{
        fontSize: '30px',
        color: '#F5F5F7',
        letterSpacing: '-0.03em',
      }}
    >
      What do you want to learn today?
    </h1>
  </div>
);

// ─── Dashboard View ───────────────────────────────────────────────────────────
interface DashboardViewProps {
  setActivePage: (page: string) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ setActivePage }) => (
  <div>
    <GreetingHeader />

    {/*
     * Unified grid — same column ratio for both rows.
     * Row 1: [SkillRadar(1fr)] [HeroSpotlight(1.55fr)] [Calendar(1fr)]
     * Row 2: [StatsGrid 2×2(1fr)] [WeeklyHeatmap spans cols 2-3 (2.55fr)]
     *
     * Both rows share one <div> with grid-template-columns so the columns
     * align perfectly top-to-bottom.
     *
     * Category 7: Analytics & Personalization (Dashboard is analytics/profile focused).
     */}
    <div
      className="grid gap-5"
      style={{ gridTemplateColumns: '1fr 1.55fr 1fr' }}
    >
      {/* ── ROW 1 ── */}
      <SkillRadarCard />
      <HeroSpotlightCard onOpenWorkspace={() => setActivePage('workspace')} />
      <CalendarCard />

      {/* ── ROW 2 ── */}
      {/* Col 1: 2×2 compact stats mini-grid */}
      <StatsGrid />

      {/* Cols 2–3: Wide heatmap (spans the remaining two columns) */}
      <div style={{ gridColumn: 'span 2' }}>
        <WeeklyHeatmapCard />
      </div>
    </div>
  </div>
);

export default DashboardView;
