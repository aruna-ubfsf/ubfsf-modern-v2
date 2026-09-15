"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface RebuildStoryCardProps {
  badge?: string;
  title: string;
  subtitle?: string;
  description: string;
  imageSrc: string;
  imageAlt?: string;
  speechText?: string;
  onHoverBubble?: (text: string) => void;
  delay?: number;
}

export const RebuildStoryCard = ({
  badge,
  title,
  subtitle,
  description,
  imageSrc,
  imageAlt,
  speechText,
  onHoverBubble,
  delay = 0,
}: RebuildStoryCardProps) => {
  return (
    <motion.div
      // Scroll Entrance: Fade in and slide up when entering viewport
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ 
        duration: 0.7, 
        delay: delay,
        ease: [0.215, 0.61, 0.355, 1] 
      }}
      // Card Container with hover interaction
      onMouseEnter={() => onHoverBubble && onHoverBubble(speechText || title)}
      onMouseLeave={() => onHoverBubble && onHoverBubble("")}
      className="group relative w-full bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:border-[#D4A017]/50 hover:shadow-[#D4A017]/10 hover:shadow-xl"
    >
      {/* 1. Image Container (Serves as the boundary mask) */}
      <div className="relative h-72 w-full overflow-hidden bg-zinc-800">
        {/* The Image: Scales smoothly on card hover */}
        <Image
          src={imageSrc}
          alt={imageAlt || title}
          fill
          className="object-cover transform transition-transform duration-700 ease-out group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        {/* Dark Gradient Overlay: Keeps text legible over photos */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-75" />

        {/* Top Badge Tag */}
        {badge && (
          <div className="absolute top-4 left-4 bg-[#D4A017] text-zinc-950 text-xs font-black px-3 py-1.5 rounded-md uppercase tracking-wider shadow-lg">
            {badge}
          </div>
        )}
      </div>

      {/* 2. Text Content Area */}
      <div className="p-6 relative z-10 bg-zinc-900">
        {subtitle && (
          <span className="text-xs font-semibold text-[#D4A017] uppercase tracking-widest block mb-1">
            {subtitle}
          </span>
        )}
        
        <h3 className="text-xl font-bold text-white group-hover:text-[#D4A017] transition-colors duration-300">
          {title}
        </h3>

        <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
          {description}
        </p>
      </div>

      {/* 3. Subtle Outer Glow on Hover */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#D4A017]/30 pointer-events-none transition-all duration-300" />
    </motion.div>
  );
};