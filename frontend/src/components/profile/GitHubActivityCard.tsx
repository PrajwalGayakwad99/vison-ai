import React, { useState } from 'react';
import Card from '../ui/Card';
import { GitBranch, Star, ExternalLink } from 'lucide-react';

const REPOS = [
  {
    name: 'axiom-compiler',
    desc: 'Core visual compilation engine sandboxing C++ and Python.',
    lang: 'C++',
    langColor: '#f34b7d',
    stars: 154,
  },
  {
    name: 'stack-visualizer',
    desc: 'React Flow and D3 wrapper rendering call stacks in real time.',
    lang: 'TypeScript',
    langColor: '#3178c6',
    stars: 98,
  },
  {
    name: 'ai-socratic-agent',
    desc: 'Local agent executing Socratic feedback loops based on AST code parse.',
    lang: 'Python',
    langColor: '#3572a5',
    stars: 42,
  },
];

// Mock 5 rows x 20 columns contribution levels (0-4)
const CONTRIBS: number[][] = [
  [0, 1, 2, 0, 4, 1, 2, 3, 0, 1, 2, 4, 3, 1, 0, 2, 4, 1, 3, 2],
  [1, 2, 0, 1, 3, 2, 0, 1, 2, 4, 0, 2, 1, 3, 2, 1, 0, 4, 2, 1],
  [2, 0, 4, 2, 1, 0, 3, 4, 1, 2, 3, 1, 0, 4, 2, 1, 3, 2, 0, 3],
  [0, 1, 3, 2, 4, 2, 1, 0, 3, 1, 2, 4, 1, 2, 0, 3, 1, 2, 4, 1],
  [3, 2, 1, 4, 0, 1, 2, 3, 4, 1, 0, 2, 3, 4, 1, 2, 0, 1, 3, 4],
];

const INTENSITY_COLORS: Record<number, string> = {
  0: 'rgba(255, 255, 255, 0.03)',
  1: 'rgba(139, 92, 246, 0.15)',
  2: 'rgba(139, 92, 246, 0.35)',
  3: 'rgba(139, 92, 246, 0.65)',
  4: '#8B5CF6',
};

interface ContributionCellProps {
  level: number;
}

const ContributionCell: React.FC<ContributionCellProps> = ({ level }) => {
  const [hovered, setHovered] = useState(false);
  const color = INTENSITY_COLORS[level];

  return (
    <div className="relative">
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="w-5 h-5 rounded-md cursor-pointer transition-all duration-100"
        style={{
          background: color,
          border: '1px solid rgba(255, 255, 255, 0.04)',
          transform: hovered ? 'scale(1.2)' : 'scale(1)',
          zIndex: hovered ? 10 : 1,
        }}
      />
      {hovered && (
        <div
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1.5 px-2 py-1 rounded bg-[#2A2935] border border-white/[0.08] text-[9.5px] text-[#F5F5F7] whitespace-nowrap z-50 pointer-events-none shadow-xl"
        >
          {level > 0 ? `${level * 3} contributions` : 'No contributions'}
        </div>
      )}
    </div>
  );
};

const GitHubActivityCard: React.FC = () => {
  return (
    <Card noHeader>
      <div className="flex flex-col gap-6">
        {/* Header bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="card-icon-wrap"
              style={{
                background: 'rgba(139,92,246,0.13)',
                border: '1px solid rgba(139,92,246,0.2)',
              }}
            >
              <GitBranch size={14} className="text-[#8B5CF6]" />
            </div>
            <span className="card-title">GitHub Activity</span>
            <span className="text-[10px] bg-[#1E1D27] text-[#8B8A99] font-mono border border-white/[0.05] rounded px-2 py-0.5 ml-1">
              Connected as @michaels-dev
            </span>
          </div>

          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-[12px] font-semibold text-[#8B8A99] hover:text-[#A78BFA] transition-colors"
          >
            <span>View GitHub Profile</span>
            <ExternalLink size={12} />
          </a>
        </div>

        {/* Heatmap Grid */}
        <div className="bg-[#14131A] p-5 rounded-2xl border border-white/[0.04] flex flex-col justify-center overflow-x-auto">
          <p className="text-[11px] text-[#6B6A78] font-bold uppercase tracking-wider mb-3">
            Contributions Timeline
          </p>
          <div className="flex flex-col gap-1.5 min-w-[480px]">
            {CONTRIBS.map((row, rowIdx) => (
              <div key={rowIdx} className="flex gap-1.5">
                {row.map((level, colIdx) => (
                  <ContributionCell
                    key={`${rowIdx}-${colIdx}`}
                    level={level}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Repositories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {REPOS.map((repo) => (
            <div
              key={repo.name}
              className="p-4 rounded-xl border border-white/[0.04] bg-[#14131A] hover:border-white/[0.08] transition-all duration-150 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h5 className="text-[13px] font-bold text-[#F5F5F7] font-mono tracking-tight">
                    {repo.name}
                  </h5>
                  <div className="flex items-center gap-1 text-[#8B8A99]">
                    <Star size={11} className="text-[#FBBF24]" fill="#FBBF24" />
                    <span className="text-[11px] font-semibold font-mono">{repo.stars}</span>
                  </div>
                </div>
                <p className="text-[11.5px] text-[#8B8A99] mt-2 leading-relaxed">
                  {repo.desc}
                </p>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/[0.03]">
                <span className="w-2 h-2 rounded-full" style={{ background: repo.langColor }} />
                <span className="text-[11px] text-[#6B6A78] font-semibold">{repo.lang}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default GitHubActivityCard;
