'use client';

import { Sparkles, Bug, MessageSquare } from 'lucide-react';

export default function AiTutorPage() {
  return (
    <div>
      <div className="mb-8">
        <p className="text-[15px] font-medium" style={{ color: '#8B8A99' }}>
          AI Teacher System
        </p>
        <h1
          className="font-bold leading-tight mt-0.5"
          style={{
            fontSize: '30px',
            color: '#F5F5F7',
            letterSpacing: '-0.03em',
          }}
        >
          AI Tutor
        </h1>
        <p className="mt-1 text-[14px]" style={{ color: '#8B8A99' }}>
          Context-aware Socratic tutor — ask questions, debug code, and get progress feedback.
        </p>
      </div>
      <div
        className="rounded-2xl flex flex-col items-center justify-center py-24 text-center"
        style={{
          border: '1px dashed rgba(255,255,255,0.07)',
          background: 'repeating-linear-gradient(-45deg, rgba(255,255,255,0.012) 0, rgba(255,255,255,0.012) 1px, transparent 1px, transparent 12px)',
        }}
      >
        <div className="flex gap-4 mb-6">
          <div className="p-3 rounded-xl" style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)' }}>
            <Sparkles size={24} className="text-[#A78BFA]" />
          </div>
          <div className="p-3 rounded-xl" style={{ background: 'rgba(236,72,153,0.12)', border: '1px solid rgba(236,72,153,0.2)' }}>
            <Bug size={24} className="text-[#EC4899]" />
          </div>
          <div className="p-3 rounded-xl" style={{ background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.2)' }}>
            <MessageSquare size={24} className="text-[#34D399]" />
          </div>
        </div>
        <p className="text-[15px] font-semibold mb-1.5" style={{ color: '#F5F5F7' }}>Access the AI Tutor from the Workspace</p>
        <p className="text-[13px]" style={{ color: '#6B6A78' }}>Open the Workspace to chat with the AI Tutor, debug your code, and get progress feedback.</p>
      </div>
    </div>
  );
}
