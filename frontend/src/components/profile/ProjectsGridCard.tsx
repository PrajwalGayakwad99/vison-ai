import React from 'react';
import Card from '../ui/Card';
import { Layout, Globe, GitBranch, Plus } from 'lucide-react';

const PROJECTS = [
  {
    id: 'p1',
    title: 'Axiom Compiler Core',
    desc: 'High-performance parser and stack tracer written in C++ with LLVM bytecode mapping.',
    tech: ['C++', 'LLVM', 'gRPC', 'Python'],
    gradient: 'linear-gradient(135deg, #60A5FA 0%, #8B5CF6 100%)',
    demoUrl: '#',
    sourceUrl: '#',
  },
  {
    id: 'p2',
    title: 'Visual Trace Studio',
    desc: 'Client-side runtime visualizer rendering nested JSON stack frames inside canvas frames.',
    tech: ['TypeScript', 'React Flow', 'D3.js', 'Vite'],
    gradient: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
    demoUrl: '#',
    sourceUrl: '#',
  },
];

const ProjectsGridCard: React.FC = () => {
  return (
    <Card
      icon={<Layout size={14} strokeWidth={2} />}
      title="Featured Projects"
      showViewAll={false}
      showRefresh={false}
      className="h-full"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {PROJECTS.map((proj) => (
          <div
            key={proj.id}
            className="rounded-xl border border-white/[0.04] bg-[#14131A] overflow-hidden flex flex-col justify-between hover:border-white/[0.08] transition-all duration-150 group"
          >
            {/* Gradient Thumbnail Header */}
            <div
              className="h-28 w-full p-4 flex items-end justify-between"
              style={{ background: proj.gradient }}
            >
              {/* Overlay shadow for text contrast */}
              <div className="absolute inset-0 bg-black/10 pointer-events-none" />
              <div className="z-10 bg-black/35 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-bold text-white uppercase tracking-wider">
                Category 1 Core Engine
              </div>
            </div>

            {/* Content body */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h5 className="text-[13.5px] font-bold text-[#F5F5F7] leading-snug group-hover:text-[#A78BFA] transition-colors">
                  {proj.title}
                </h5>
                <p className="text-[11.5px] text-[#8B8A99] mt-2 leading-relaxed">
                  {proj.desc}
                </p>
              </div>

              <div className="mt-4">
                {/* Tech chips */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {proj.tech.map((t) => (
                    <span
                      key={t}
                      className="text-[9.5px] font-semibold px-2 py-0.5 rounded bg-white/[0.03] text-[#8B8A99]"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Source & Demo links */}
                <div className="flex items-center gap-3 pt-3 border-t border-white/[0.03]">
                  <a
                    href={proj.demoUrl}
                    className="flex items-center gap-1 text-[11px] font-semibold text-[#8B8A99] hover:text-[#34D399] transition-colors"
                  >
                    <Globe size={11} />
                    <span>Live Demo</span>
                  </a>
                  <a
                    href={proj.sourceUrl}
                    className="flex items-center gap-1 text-[11px] font-semibold text-[#8B8A99] hover:text-[#A78BFA] transition-colors"
                  >
                    <GitBranch size={11} />
                    <span>Source Code</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add Project Card */}
        <div className="rounded-xl border-2 border-dashed border-white/[0.05] hover:border-violet-500/20 bg-transparent flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-white/[0.01] transition-all group min-h-[220px]">
          <div className="w-10 h-10 rounded-full flex items-center justify-center border border-dashed border-white/[0.08] text-[#6B6A78] group-hover:text-[#A78BFA] group-hover:border-violet-500/30 transition-all mb-3.5">
            <Plus size={18} />
          </div>
          <span className="text-[13px] font-bold text-[#8B8A99] group-hover:text-[#F5F5F7] transition-colors">
            Add New Project
          </span>
          <span className="text-[10.5px] text-[#6B6A78] mt-1">
            Showcase your algorithm visualization work.
          </span>
        </div>
      </div>
    </Card>
  );
};

export default ProjectsGridCard;
