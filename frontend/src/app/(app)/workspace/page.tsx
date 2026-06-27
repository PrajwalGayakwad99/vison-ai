'use client';

import dynamic from 'next/dynamic';

const WorkspaceView = dynamic(
  () => import('@/views/workspace/WorkspaceView'),
  { ssr: false }
);

export default function WorkspacePage() {
  return <WorkspaceView />;
}
