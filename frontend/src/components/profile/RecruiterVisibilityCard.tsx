import React, { useState } from 'react';
import Card from '../ui/Card';
import { Shield, Eye, Settings2, Lock } from 'lucide-react';

const RecruiterVisibilityCard: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <Card
      icon={<Shield size={14} strokeWidth={2} />}
      iconColor="#FBBF24"
      title="Recruiter Visibility &amp; Search Access"
      showViewAll={false}
      showRefresh={false}
      style={{
        border: '1px solid rgba(251, 191, 36, 0.2)',
        boxShadow: '0 4px 24px rgba(251, 191, 36, 0.03)',
      }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mt-4">
        {/* Left Side: Explanations and status */}
        <div className="flex-1">
          <p className="text-[13px] text-[#C4C3D0] leading-relaxed">
            Configure how recruiters interact with your portfolio. Enabling this surfaces your skill scores and project links directly in recruiter dashboards.
          </p>

          {/* Visibility Info rows */}
          {isVisible ? (
            <div className="flex flex-wrap gap-4 mt-4 text-[12px] text-[#8B8A99]">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/5 border border-amber-500/10">
                <Eye size={13} className="text-[#FBBF24]" />
                <span>Visible in Search since <strong className="text-[#F5F5F7]">Jun 15, 2026</strong></span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                <Settings2 size={13} className="text-[#34D399]" />
                <span>Viewed by <strong className="text-[#F5F5F7] font-mono">12 recruiters</strong> this month</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 mt-4 text-[12px] text-[#8B8A99] px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.04] w-fit">
              <Lock size={13} className="text-[#6B6A78]" />
              <span>Your profile is currently <strong className="text-[#6B6A78]">hidden</strong> to recruiters.</span>
            </div>
          )}

          {/* Privacy Note */}
          <p className="text-[11px] text-[#6B6A78] mt-3.5 leading-snug">
            * Privacy Note: Recruiters can view your skill scores, certifications, and projects. Contact details (email, phone) remain private until you explicitly approve a connection request.
          </p>
        </div>

        {/* Right Side: Toggle control */}
        <div className="flex items-center gap-3 bg-[#14131A] p-4 rounded-xl border border-white/[0.04] shrink-0 justify-between md:justify-start">
          <span className="text-[12px] font-bold text-[#8B8A99] uppercase tracking-wide">Recruiter Search</span>
          
          {/* Custom Amber Toggle Switch */}
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="w-10 h-5.5 rounded-full relative p-0.5 transition-all duration-200 focus:outline-none"
            style={{
              background: isVisible ? 'linear-gradient(135deg, #FBBF24, #F59E0B)' : 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <div
              className="w-4 h-4 rounded-full bg-white shadow-md transition-all duration-200"
              style={{
                transform: isVisible ? 'translateX(18px)' : 'translateX(0px)',
              }}
            />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default RecruiterVisibilityCard;
