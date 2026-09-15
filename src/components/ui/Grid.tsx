// src/components/ui/Grid.tsx
import { ReactNode } from 'react';

export default function Grid({
  children,
  cols = 2,
  className = '',
}: {
  children: ReactNode;
  cols?: 2 | 3;
  className?: string;
}) {
  const colsClass =
    cols === 3
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-1 md:grid-cols-2';
  return <div className={`grid ${colsClass} gap-6 md:gap-8 lg:gap-10 ${className}`}>{children}</div>;
}
