// src/components/RebuildCinematicScrollerWrapper.tsx
"use client";

import dynamic from "next/dynamic";

const RebuildCinematicScroller = dynamic(() => import("./RebuildCinematicScroller"), {
  ssr: false,
  loading: () => (
    <div className="h-screen bg-stone-100 dark:bg-black flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#D4A017] border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

export default function RebuildCinematicScrollerWrapper({
  sections,
}: {
  sections?: {
    id: string;
    label: string;
    start: number;
    end: number;
    title: string;
    description: string;
  }[];
}) {
  return <RebuildCinematicScroller sections={sections} />;
}
