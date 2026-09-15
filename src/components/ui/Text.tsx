// src/components/ui/Text.tsx
import { ReactNode } from 'react';

export default function Text({
  children,
  variant = 'body',
  className = '',
}: {
  children: ReactNode;
  variant?: 'body' | 'lead' | 'muted';
  className?: string;
}) {
  const variants = {
    body: 'text-base sm:text-lg md:text-xl text-stone-600 dark:text-stone-300 leading-relaxed',
    lead: 'text-base sm:text-lg md:text-xl lg:text-2xl text-stone-600 dark:text-stone-400 leading-relaxed font-light',
    muted: 'text-sm md:text-base text-stone-500 dark:text-stone-400 leading-relaxed',
  };
  return <p className={`${variants[variant]} ${className}`}>{children}</p>;
}
