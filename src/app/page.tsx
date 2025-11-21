'use client';

import dynamic from 'next/dynamic';
import { ControlsPanel } from '@/components/ui/ControlsPanel';

const Canvas3D = dynamic(() => import('@/components/Scene/Canvas3D').then((mod) => mod.Canvas3D), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-black/10 animate-pulse" />,
});

export default function Home() {
  return (
    <main className="flex h-screen w-screen overflow-hidden">
      <div className="w-80 h-full flex-shrink-0 z-10 bg-background">
        <ControlsPanel />
      </div>
      <div className="flex-grow h-full relative">
        <Canvas3D />
      </div>
    </main>
  );
}
