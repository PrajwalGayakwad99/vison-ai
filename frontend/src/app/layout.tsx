import type { Metadata } from 'next';
// TODO: Re-enable Clerk after setting up a real Clerk app
// import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import { SettingsInitializer } from '@/components/shared/SettingsInitializer';

export const metadata: Metadata = {
  title: 'AXIOM — AI Visual Learning',
  description: 'AI-powered visual learning platform for Data Structures & Algorithms',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // TODO: Wrap with <ClerkProvider> when auth is set up
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" style={{ background: '#14131A' }}>
        <SettingsInitializer />
        {children}
      </body>
    </html>
  );
}
