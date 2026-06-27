import React from 'react';
import ProfileHeaderCard from '../../components/profile/ProfileHeaderCard';
import SkillRadarFullCard from '../../components/profile/SkillRadarFullCard';
import AIAssessmentCard from '../../components/profile/AIAssessmentCard';
import CareerReadinessCard from '../../components/profile/CareerReadinessCard';
import GitHubActivityCard from '../../components/profile/GitHubActivityCard';

const ProfileView: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Page Header Title */}
      <div className="mb-2">
        <p className="text-[15px] font-medium text-[#8B8A99]">
          Student Identity &bull; Profile
        </p>
        <h1
          className="font-bold leading-tight mt-0.5 text-[30px] text-[#F5F5F7] tracking-tight"
          style={{ letterSpacing: '-0.03em' }}
        >
          My Profile
        </h1>
      </div>

      {/* Main Responsive Grid Layout */}
      <div className="grid grid-cols-12 gap-6">

        {/* Section 1: Profile Header Card (Full Width) */}
        <div className="col-span-12">
          <ProfileHeaderCard />
        </div>

        {/* Section 2: Skill Radar + AI Assessment (60/40 Row) */}
        <div className="col-span-12 lg:col-span-7">
          <SkillRadarFullCard />
        </div>
        <div className="col-span-12 lg:col-span-5">
          <AIAssessmentCard />
        </div>

        {/* Section 3: Career Readiness Card (Full Width) */}
        <div className="col-span-12">
          <CareerReadinessCard />
        </div>

        {/* Section 4: GitHub Activity Card (Full Width) */}
        <div className="col-span-12">
          <GitHubActivityCard />
        </div>

      </div>
    </div>
  );
};

export default ProfileView;
