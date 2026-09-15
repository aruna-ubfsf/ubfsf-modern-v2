// src/components/ui/Container.tsx
import { ReactNode } from 'react';

export default function Container({
  children,
  className = '',
  size = 'default',
}: {
  children: ReactNode;
  className?: string;
  size?: 'default' | 'wide' | 'narrow';
}) {
  const sizes = {
    narrow: 'max-w-4xl',
    default: 'max-w-6xl',
    wide: 'max-w-7xl',
  };
  return (
    <div className={`${sizes[size]} mx-auto px-4 sm:px-6 md:px-12 lg:px-20 ${className}`}>
      {children}
    </div>
  );
}
