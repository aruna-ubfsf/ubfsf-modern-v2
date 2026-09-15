"use client";

import dynamic from "next/dynamic";

// CyclistGuide is client-side only (uses GSAP ScrollTrigger)
const CyclistGuide = dynamic(() => import("./CyclistGuide"), {
  ssr: false,
  loading: () => null,
});

export default function CyclistGuideWrapper() {
  return <CyclistGuide />;
}