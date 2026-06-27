'use client';

import DashboardView from '@/components/dashboard/DashboardView';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  return <DashboardView setActivePage={(page) => router.push(page === 'workspace' ? '/workspace' : '/')} />;
}
