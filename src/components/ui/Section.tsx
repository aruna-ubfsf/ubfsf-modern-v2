// src/components/ui/Section.tsx
import { ReactNode } from 'react';
import Container from './Container';

type SectionBg = 'white' | 'light' | 'dark' | 'gradient' | 'transparent';

export default function Section({
  children,
  bg = 'white',
  className = '',
  containerSize = 'default',
  id,
}: {
  children: ReactNode;
  bg?: SectionBg;
  className?: string;
  containerSize?: 'default' | 'wide' | 'narrow';
  id?: string;
}) {
  const bgs: Record<SectionBg, string> = {
    white: 'bg-white dark:bg-[#0a0a0a]',
    light: 'bg-stone-50 dark:bg-[#141414]',
    dark: 'bg-black text-white',
    gradient: 'bg-gradient-to-b from-black to-stone-900 text-white',
    transparent: '',
  };
  return (
    <section
      id={id}
      className={`py-16 md:py-24 lg:py-32 ${bgs[bg]} ${className}`}
    >
      <Container size={containerSize}>{children}</Container>
    </section>
  );
}

// Eyebrow label used across sections (gold uppercase kicker)
export function SectionLabel({ children, centered = false }: { children: ReactNode; centered?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-[#D4A017] text-[10px] md:text-[11px] lg:text-xs font-bold uppercase tracking-[0.2em] mb-4 md:mb-6 ${centered ? 'justify-center' : ''}`}
    >
      <div className="w-2.5 md:w-3 h-px bg-[#D4A017]" />
      {children}
      {centered && <div className="w-2.5 md:w-3 h-px bg-[#D4A017]" />}
    </span>
  );
}
