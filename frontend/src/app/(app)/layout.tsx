'use client';

'use client';

import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { useRouter } from 'next/navigation';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <div
      className="w-screen h-screen flex overflow-hidden relative"
      style={{ background: '#14131A' }}
    >
      {/* Subtle ambient violet gradient at top edge */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px z-50"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.4) 30%, rgba(167,139,250,0.5) 50%, rgba(139,92,246,0.4) 70%, transparent 100%)',
        }}
      />

      {/* Two-column layout */}
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden" style={{ background: '#14131A' }}>
        <TopBar onProfileClick={() => router.push('/profile')} />
        <main
          className="flex-1 overflow-y-auto"
          style={{ padding: '20px' }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
