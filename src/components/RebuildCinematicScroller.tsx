"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface NarrativeSection {
  id: string;
  label: string;
  start: number; // scroll progress 0-1
  end: number;   // scroll progress 0-1
  title: string;
  description: string;
}

const narrativeSections: NarrativeSection[] = [
  {
    id: "act-1",
    label: "The Problem",
    start: 0.0,
    end: 0.22,
    title: "Understanding What Was Lost",
    description: "For over 75 years, housing segregation and discriminatory policies have created systemic barriers for Black and underserved communities in Northeast Oklahoma City."
  },
  {
    id: "act-2",
    label: "The Response",
    start: 0.25,
    end: 0.52,
    title: "REBUILD = Community Preservation",
    description: "Rather than focusing solely on building homes, REBUILD positions itself as a Community Preservation Initiative whose mission is to preserve people, homes, neighborhoods, and opportunity before they are lost."
  },
  {
    id: "act-3",
    label: "The Framework",
    start: 0.55,
    end: 0.82,
    title: "Four Strategic Pillars",
    description: "Community Preservation — Housing & Neighborhood Revitalization — Youth Workforce & Community Leadership — Legacy & Home Preservation. Each pillar reinforces the others."
  },
  {
    id: "act-4",
    label: "The Call to Action",
    start: 0.85,
    end: 1.0,
    title: "Join Us in Rebuilding Community",
    description: "Partner with REBUILD, donate, or volunteer. Together, we can strengthen Northeast Oklahoma City through resident-centered community development."
  }
];

export default function RebuildCinematicScroller({
  sections = narrativeSections,
}: {
  sections?: NarrativeSection[];
}) {
  const runwayRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeSections = sections.length > 0 ? sections : narrativeSections;

  useEffect(() => {
    const video = videoRef.current;
    const runway = runwayRef.current;
    if (!video || !runway) return;

    const initTimeline = () => {
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: runway,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (video && video.duration) {
              const progress = self.progress;
              // Clamp to 90% of the video: the final frames fade to black/white
              // — never let the scrub reach them (fixes the black-screen flash)
              const maxTime = video.duration * 0.9;
              const loopedTime = (progress * maxTime * 3) % maxTime;
              video.currentTime = loopedTime;
            }
          },
        },
      });

      activeSections.forEach((section, index) => {
        const textRef = textRefs.current[index];
        if (!textRef) return;

        masterTl.fromTo(
          textRef,
          { opacity: 0, y: 30, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.15,
            ease: "power2.out",
          },
          section.start
        );

        masterTl.to(
          textRef,
          {
            opacity: 0,
            y: -30,
            scale: 0.95,
            duration: 0.15,
            ease: "power2.in",
          },
          section.end
        );
      });
    };

    if (video.readyState >= 1) {
      initTimeline();
    } else {
      video.addEventListener("loadedmetadata", initTimeline, { once: true });
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      video.removeEventListener("loadedmetadata", initTimeline);
    };
  }, [activeSections]);

  return (
    <div ref={runwayRef} className="relative w-full h-[150vh] bg-stone-100 dark:bg-zinc-950">
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center">
        {/* Fallback gradient (shows while video loads / if it fails) */}
        <div className="absolute inset-0 bg-gradient-to-br from-stone-100 via-stone-200 to-stone-100 dark:from-zinc-900 dark:via-zinc-950 dark:to-black pointer-events-none" />

        {/* Background Video */}
        <video
          ref={videoRef}
          src="/REBUILD vd/ivanBiking.mp4"
          muted
          playsInline
          preload="auto"
          loop
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          aria-hidden="true"
        />

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50 dark:from-black/60 dark:via-black/30 dark:to-black/70 pointer-events-none" />

        {/* Narrative Text Overlays */}
        <div className="relative z-10 w-full max-w-4xl px-8 pointer-events-none">
          {activeSections.map((section, index) => (
            <div
              key={section.id}
              ref={(el) => { textRefs.current[index] = el; }}
              id={section.id}
              className="absolute opacity-0 max-w-3xl mx-auto bg-black/70 backdrop-blur-lg p-6 md:p-10 rounded-2xl border border-white/20 text-center"
              style={{ bottom: "25%" }}
              role="region"
              aria-label={section.label}
            >
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4A017] mb-4">
                {section.label}
              </div>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                {section.title}
              </h2>
              <p className="text-neutral-300 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                {section.description}
              </p>
            </div>
          ))}
        </div>

        {/* Scroll Hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center text-black/40 dark:text-black/40 dark:text-black/40 dark:text-white/40 text-xs tracking-[0.3em] uppercase animate-bounce">
          <span>Scroll to explore</span>
          <svg className="w-5 h-5 mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </div>
  );
}