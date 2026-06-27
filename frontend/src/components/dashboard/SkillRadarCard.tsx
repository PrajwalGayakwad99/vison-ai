import React from 'react';
import { Brain } from 'lucide-react';
import Card from '../ui/Card';
import { useCountUp } from '../../hooks/useCountUp';

const SkillRadarCard: React.FC = () => {
  const count = useCountUp(78, 1400);

  return (
    <Card
      icon={<Brain size={15} strokeWidth={2} />}
      title="Skill Radar"
      showViewAll
      showRefresh
    >
      <div>
        <p
          className="num-in font-bold leading-none tracking-tight"
          style={{ fontSize: '38px', color: '#F5F5F7', letterSpacing: '-0.03em' }}
        >
          {Math.round(count)}/100
        </p>
        <p className="mt-1.5 text-[12.5px] font-medium" style={{ color: '#A78BFA' }}>
          Skill Gap Detection: focus on Recursion
        </p>
        <p className="mt-1 text-[11px]" style={{ color: '#6B6A78' }}>
          Real-time analysis powered by learning metrics
        </p>
      </div>

      {/* SVG Radar Chart Wrapper */}
      <div className="flex items-center justify-center mt-6 py-2">
        <svg width="150" height="150" viewBox="0 0 150 150" className="overflow-visible select-none">
          <defs>
            {/* Polygon Gradient */}
            <linearGradient id="radar-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#A78BFA" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="radar-stroke" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#A78BFA" />
            </linearGradient>
            {/* Soft shadow */}
            <filter id="radar-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Concentric diamonds grid */}
          <polygon points="75,25 125,75 75,125 25,75" stroke="rgba(255,255,255,0.06)" fill="none" strokeWidth="1" />
          <polygon points="75,37.5 112.5,75 75,112.5 37.5,75" stroke="rgba(255,255,255,0.06)" fill="none" strokeWidth="1" />
          <polygon points="75,50 100,75 75,100 50,75" stroke="rgba(255,255,255,0.06)" fill="none" strokeWidth="1" />
          <polygon points="75,62.5 87.5,75 75,87.5 62.5,75" stroke="rgba(255,255,255,0.06)" fill="none" strokeWidth="1" />

          {/* Grid axis lines */}
          <line x1="75" y1="25" x2="75" y2="125" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <line x1="25" y1="75" x2="125" y2="75" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

          {/* Scores: Algo (0.85), DS (0.78), Debug (0.65), Systems (0.80) */}
          {/* Coordinates:
              Algorithms (Up): (75, 75 - 50*0.85) = (75, 32.5)
              Data Structures (Right): (75 + 50*0.78, 75) = (114, 75)
              Debugging (Down): (75, 75 + 50*0.65) = (75, 107.5)
              Systems (Left): (75 - 50*0.8, 75) = (35, 75)
          */}
          <polygon
            points="75,32.5 114,75 75,107.5 35,75"
            fill="url(#radar-grad)"
            stroke="url(#radar-stroke)"
            strokeWidth="2"
            filter="url(#radar-glow)"
            style={{ transformOrigin: '75px 75px' }}
          />

          {/* Vertex marker dots */}
          <circle cx="75" cy="32.5" r="3" fill="#A78BFA" />
          <circle cx="114" cy="75" r="3" fill="#A78BFA" />
          <circle cx="75" cy="107.5" r="3" fill="#A78BFA" />
          <circle cx="35" cy="75" r="3" fill="#A78BFA" />

          {/* Labels */}
          <text x="75" y="14" fill="#8B8A99" fontSize="9.5" fontWeight="600" textAnchor="middle" dominantBaseline="middle">
            ALGORITHMS
          </text>
          <text x="132" y="75" fill="#8B8A99" fontSize="9.5" fontWeight="600" textAnchor="start" dominantBaseline="middle">
            DS
          </text>
          <text x="75" y="137" fill="#8B8A99" fontSize="9.5" fontWeight="600" textAnchor="middle" dominantBaseline="middle">
            DEBUGGING
          </text>
          <text x="18" y="75" fill="#8B8A99" fontSize="9.5" fontWeight="600" textAnchor="end" dominantBaseline="middle">
            SYSTEMS
          </text>
        </svg>
      </div>
    </Card>
  );
};

export default SkillRadarCard;
