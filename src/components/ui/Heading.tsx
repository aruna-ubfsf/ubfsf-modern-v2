// src/components/ui/Heading.tsx
export default function Heading({
  children,
  as: Tag = 'h2',
  className = '',
}: {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
}) {
  const sizes = {
    h1: 'text-4xl sm:text-5xl md:text-6xl',
    h2: 'text-3xl sm:text-4xl md:text-5xl',
    h3: 'text-2xl md:text-3xl lg:text-4xl',
  };
  return (
    <Tag className={`${sizes[Tag]} font-black uppercase tracking-tight leading-[0.95] mb-6 md:mb-8 text-black dark:text-white ${className}`}>
      {children}
    </Tag>
  );
}

export function HeadingAccent({ children }: { children: React.ReactNode }) {
  return <span className="text-[#D4A017]">{children}</span>;
}
