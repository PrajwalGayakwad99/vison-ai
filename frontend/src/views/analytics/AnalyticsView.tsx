import React from 'react';
import LearningAnalyticsCard from '../../components/analytics/LearningAnalyticsCard';
import SkillGapDetectionCard from '../../components/analytics/SkillGapDetectionCard';
import AdaptivePathCard from '../../components/analytics/AdaptivePathCard';
import TeacherDashboardCard from '../../components/analytics/TeacherDashboardCard';
import LearningHeatmapCard from '../../components/analytics/LearningHeatmapCard';

const AnalyticsView: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Page Title Header */}
      <div className="mb-2">
        <p className="text-[15px] font-medium text-[#8B8A99]">
          Performance Tracking &bull; Personalization Engine
        </p>
        <h1
          className="font-bold leading-tight mt-0.5 text-[30px] text-[#F5F5F7] tracking-tight"
          style={{ letterSpacing: '-0.03em' }}
        >
          Learning Analytics &amp; Personalization
        </h1>
      </div>

      {/* Main Grid Wrapper */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Section 1: Learning Analytics Line Chart (Full Width) */}
        <div className="col-span-12">
          <LearningAnalyticsCard />
        </div>

        {/* Section 2: Skill Gaps + Adaptive Path (50/50 Row) */}
        <div className="col-span-12 lg:col-span-6">
          <SkillGapDetectionCard />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <AdaptivePathCard />
        </div>

        {/* Section 3: Mentor / Teacher Dashboard Table (Full Width) */}
        <div className="col-span-12">
          <TeacherDashboardCard />
        </div>

        {/* Section 4: Difficulties & Time Spent Heatmap (Full Width) */}
        <div className="col-span-12">
          <LearningHeatmapCard />
        </div>

      </div>
    </div>
  );
};

export default AnalyticsView;
