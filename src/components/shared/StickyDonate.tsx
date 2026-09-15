'use client';

// src/components/shared/StickyDonate.tsx
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function StickyDonate() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <Link
      href="/donate"
      aria-label="Donate to UBFSF"
      className="fixed z-50 bottom-4 right-4 md:bottom-8 md:right-8 px-6 md:px-8 py-3.5 md:py-4 bg-[#D4A017] text-black font-black uppercase text-xs md:text-sm tracking-[0.15em] rounded-full shadow-2xl hover:bg-[#B98A2D] hover:scale-105 transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#D4A017]/50"
    >
      ♥ Donate
    </Link>
  );
}
