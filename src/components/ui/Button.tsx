// src/components/ui/Button.tsx
import Link from 'next/link';
import { ReactNode } from 'react';

type Variant = 'primary' | 'outline' | 'outlineLight';
type Size = 'md' | 'lg';

export default function Button({
  children,
  href,
  variant = 'primary',
  size = 'lg',
  external = false,
  className = '',
}: {
  children: ReactNode;
  href: string;
  variant?: Variant;
  size?: Size;
  external?: boolean;
  className?: string;
}) {
  const variants: Record<Variant, string> = {
    primary:
      'bg-[#D4A017] text-black hover:bg-[#B98A2D] shadow-lg hover:shadow-xl hover:-translate-y-1',
    outline:
      'border-2 border-black/20 dark:border-white/20 text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5',
    outlineLight:
      'border-2 border-white/40 text-white hover:border-white/80 hover:bg-white/10',
  };
  const sizes: Record<Size, string> = {
    md: 'px-6 md:px-8 py-3 md:py-4 text-xs',
    lg: 'px-8 md:px-10 lg:px-12 py-3.5 md:py-4 lg:py-5 text-sm',
  };
  const cls = `inline-block font-black uppercase tracking-[0.15em] transition-all duration-300 rounded-sm ${variants[variant]} ${sizes[size]} ${className}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
