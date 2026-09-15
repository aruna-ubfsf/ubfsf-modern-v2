"use client";

import { useState, useEffect } from "react";

interface RebuildCyclistProps {
  defaultText?: string;
}

export const RebuildCyclist = ({ defaultText = "Follow the journey..." }: RebuildCyclistProps) => {
  const [bubbleText, setBubbleText] = useState(defaultText);
  const [isVisible, setIsVisible] = useState(true);

  const updateBubble = (text: string) => {
    if (text && text.length > 0) {
      setBubbleText(text);
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Expose update function to parent via window for global access
  useEffect(() => {
    // @ts-ignore - attach to window for global access
    window.__updateCyclistBubble = updateBubble;
    return () => {
      // @ts-ignore
      delete window.__updateCyclistBubble;
    };
  }, []);

  return (
    <div className="fixed bottom-6 left-0 w-full pointer-events-none z-50">
      <div className="relative flex items-end">
        <div 
          className="absolute bottom-0 flex flex-col items-center"
          style={{ left: "2rem" }}
        >
          {/* Speech Bubble */}
          <div 
            className={`bg-white dark:bg-zinc-900 text-black dark:text-white px-4 py-2 rounded-xl shadow-2xl border-2 border-[#D4A017] mb-2 text-sm font-bold whitespace-nowrap relative transition-all duration-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span>{bubbleText}</span>
            {/* Bubble Tail */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white dark:border-t-zinc-900" />
          </div>
          
          {/* Video Container */}
          <div className="w-28 h-20 rounded-xl overflow-hidden shadow-2xl border-2 border-[#D4A017]/50 bg-black">
            <video
              src="/REBUILD vd/ivanBiking.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};