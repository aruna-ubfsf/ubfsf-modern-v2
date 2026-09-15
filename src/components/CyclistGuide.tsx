"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SpeechBubbleProps {
  text: string;
}

function SpeechBubble({ text }: SpeechBubbleProps) {
  return (
    <div
      className="speech-bubble"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <span>{text}</span>
    </div>
  );
}

export default function CyclistGuide() {
  // Speech bubble texts for each section
  const sections = [
    { id: "#section-hero", text: "Welcome to REBUILD! 🚴" },
    { id: "#section-mission", text: "Preserving communities from within" },
    { id: "#section-pillars", text: "Our four strategic pillars" },
    { id: "#section-pillars-1", text: "Community Assessment" },
    { id: "#section-pillars-2", text: "Partnership Development" },
    { id: "#section-pillars-3", text: "Opportunity Mapping" },
    { id: "#section-pillars-4", text: "Community Participation" },
    { id: "#section-context", text: "Understanding the challenge" },
    { id: "#section-flow", text: "How REBUILD works step by step" },
    { id: "#section-culture", text: "Preserving community memory" },
    { id: "#section-volunteers", text: "Meet our volunteers! 👋" },
    { id: "#section-contact", text: "Ready to partner with us? →" },
  ];

  const spriteSheetRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const frameCount = 361; // Total frames extracted
  const frameWidth = 200; // Width of each frame
  const frameHeight = 120; // Height of each frame (approximate)
  const spritesPerRow = 19; // 19 frames per row in the sprite sheet

  // Preload the sprite sheet
  useEffect(() => {
    const img = new Image();
    img.src = "/ivan-biking-spritesheet.png";
    img.onload = () => {
      setIsLoaded(true);
    };
    spriteSheetRef.current = img;
  }, []);

  // Draw current frame to canvas
  useEffect(() => {
    if (!isLoaded || !canvasRef.current || !spriteSheetRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Calculate frame position in sprite sheet
    const col = currentFrame % spritesPerRow;
    const row = Math.floor(currentFrame / spritesPerRow);

    const sx = col * frameWidth;
    const sy = row * frameHeight;

    // Clear canvas and draw frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      spriteSheetRef.current,
      sx,
      sy,
      frameWidth,
      frameHeight,
      0,
      0,
      canvas.width,
      canvas.height
    );
  }, [currentFrame, isLoaded]);

  // Function to update bubble text
  function updateBubble(text: string) {
    const bubble = document.getElementById("cyclist-bubble");
    if (bubble) {
      bubble.style.opacity = "0";
      setTimeout(() => {
        bubble.textContent = text;
        bubble.style.opacity = "1";
      }, 150);
    }
  }

  useGSAP(() => {
    const ctx = gsap.context(() => {
      // Main horizontal movement animation
      gsap.to("#cyclist", {
        x: "120vw",
        ease: "none",
        scrollTrigger: {
          trigger: "#rebuild-page",
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Update sprite frame based on scroll progress
            const progress = self.progress;
            const frame = Math.floor(progress * frameCount);
            setCurrentFrame(Math.min(frame, frameCount - 1));
          },
        },
      });

      // Speech bubble updates based on section visibility
      sections.forEach((section, i) => {
        ScrollTrigger.create({
          trigger: section.id,
          start: "top center",
          end: "bottom center",
          onEnter: () => updateBubble(section.text),
          onEnterBack: () => updateBubble(section.text),
          onLeave: () => updateBubble(sections[i + 1]?.text || sections[sections.length - 1].text),
          onLeaveBack: () => updateBubble(sections[i - 1]?.text || sections[0].text),
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      id="rebuild-page"
      className="relative"
      style={{ minHeight: "100vh" }}
    >
      {/* Fixed cyclist track at bottom of viewport */}
      <div
        className="fixed bottom-8 left-0 right-0 z-50 pointer-events-none"
        id="cyclist-track"
        aria-hidden="true"
      >
        <div
          id="cyclist"
          className="absolute left-[-150px] bottom-0 flex flex-col items-center"
          style={{ transform: "translateX(-150px)" }}
        >
          {/* Speech Bubble */}
          <div id="cyclist-bubble" className="speech-bubble mb-2">
            <span>Follow the journey...</span>
          </div>

          {/* Cyclist Sprite Sheet Animation via Canvas */}
          <div id="cyclist-sprite" className="w-32 h-auto md:w-40 relative" style={{ width: "128px", height: "77px" }}>
            <canvas
              ref={canvasRef}
              width={frameWidth}
              height={frameHeight}
              style={{ width: "100%", height: "auto", display: "block" }}
              aria-label="Ivan Kilgore biking across the screen"
            />
          </div>
        </div>
      </div>

      {/* Speech bubble styles injected via style tag */}
      <style jsx global>{`
        .speech-bubble {
          background: white;
          color: #111;
          padding: 8px 16px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.85rem;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
          border: 2px solid #111;
          transition: opacity 0.2s ease;
          position: relative;
          max-width: 200px;
        }

        .speech-bubble::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          border-width: 10px 10px 0;
          border-style: solid;
          border-color: white transparent;
          filter: drop-shadow(0 2px 2px rgba(0,0,0,0.1));
        }

        .speech-bubble::before {
          content: '';
          position: absolute;
          bottom: -12px;
          left: 50%;
          transform: translateX(-50%);
          border-width: 12px 12px 0;
          border-style: solid;
          border-color: #111 transparent;
        }

        /* Mobile adjustments */
        @media (max-width: 768px) {
          .speech-bubble {
            font-size: 0.75rem;
            padding: 6px 12px;
            max-width: 160px;
          }

          #cyclist-sprite {
            width: 6rem !important;
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          #cyclist {
            animation: none !important;
            transform: none !important;
            left: 50% !important;
          }
        }
      `}</style>
    </div>
  );
}