import React, { useState } from 'react';
import Card from '../ui/Card';
import { useCountUp } from '../../hooks/useCountUp';
import { Settings, Copy, Check, Flame, Trophy, Award } from 'lucide-react';

const ProfileHeaderCard: React.FC = () => {
  const [publicProfile, setPublicProfile] = useState(true);
  const [copied, setCopied] = useState(false);
  
  const xpCount = useCountUp(24580, 1500);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card noHeader className="relative overflow-hidden">
      {/* ── Subtle background gradient mesh ── */}
      <div
        className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
          filter: 'blur(32px)',
        }}
      />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        {/* Left Side: Avatar & Bio */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Avatar with Violet Gradient Ring */}
          <div
            className="relative p-1 rounded-full shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
              boxShadow: '0 4px 16px rgba(139,92,246,0.25)',
            }}
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-[#1E1D27] bg-[#14131A] flex items-center justify-center">
              {/* Initials or Placeholder Avatar */}
              <span className="text-[28px] font-extrabold text-[#F5F5F7]">MS</span>
            </div>
            {/* Status dot */}
            <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#34D399] border-2 border-[#14131A]" />
          </div>

          {/* Name and Bio */}
          <div className="text-center sm:text-left">
            <h1 className="text-[26px] sm:text-[28px] font-bold text-[#F5F5F7] tracking-tight leading-none">
              Michael S.
            </h1>
            <p className="text-[13px] text-[#8B8A99] mt-2 font-medium">
              Aspiring Systems Engineer &bull; Deeply passionate about call stack visualization and recursion.
            </p>

            {/* Stat Chips Row */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-2.5 mt-4">
              {/* Level Chip */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/[0.04] bg-[#14131A] text-[12px] font-semibold text-[#A78BFA]">
                <Trophy size={12} />
                <span>Level 12 &bull; Algorithm Apprentice</span>
              </div>
              
              {/* XP Chip */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/[0.04] bg-[#14131A] text-[12px] font-bold text-[#F5F5F7]">
                <Award size={12} className="text-[#34D399]" />
                <span>{Math.round(xpCount).toLocaleString()} XP</span>
              </div>

              {/* Streak Chip */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/[0.04] bg-[#14131A] text-[12px] font-semibold text-[#FB923C]">
                <Flame size={12} fill="#FB923C" stroke="none" />
                <span>14-day streak</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Action Controls */}
        <div className="flex flex-wrap items-center gap-3.5 w-full md:w-auto justify-center md:justify-end">
          {/* Public Profile Switch */}
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-white/[0.04] bg-[#14131A]">
            <span className="text-[11.5px] font-semibold text-[#8B8A99] uppercase tracking-wider">Public Link</span>
            <button
              onClick={() => setPublicProfile(!publicProfile)}
              className="w-10 h-5.5 rounded-full relative p-0.5 transition-all duration-200 focus:outline-none"
              style={{
                background: publicProfile ? 'linear-gradient(135deg, #8B5CF6, #A78BFA)' : 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <div
                className="w-4 h-4 rounded-full bg-white shadow-md transition-all duration-200"
                style={{
                  transform: publicProfile ? 'translateX(18px)' : 'translateX(0px)',
                }}
              />
            </button>
          </div>

          {/* Copy Link Button */}
          <button
            onClick={handleCopyLink}
            className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/[0.05] bg-[#14131A] text-[#8B8A99] hover:text-[#F5F5F7] hover:border-violet-500/20 active:scale-95 transition-all"
            title="Copy Profile Link"
          >
            {copied ? <Check size={16} className="text-[#34D399]" /> : <Copy size={16} />}
          </button>

          {/* Edit Profile Button */}
          <button
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-bold border border-white/[0.06] bg-[#14131A] text-[#C4C3D0] hover:text-[#F5F5F7] hover:border-violet-500/20 active:scale-95 transition-all"
          >
            <Settings size={14} />
            Edit Profile
          </button>
        </div>
      </div>
    </Card>
  );
};

export default ProfileHeaderCard;
