// src/components/home/AnnouncementBar.tsx
import Link from "next/link";

export default function AnnouncementBar() {
  return (
    <div className="bg-[#D4A017] text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-20 py-2.5 md:py-3">
        <Link
          href="/blog"
          className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 text-center group"
        >
          <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.15em]">
            ★ Oscar Nominated
          </span>
          <span className="hidden sm:block w-px h-3.5 bg-black/40" />
          <span className="text-[10px] md:text-xs font-medium tracking-wide">
            The Alabama Solution — A Strategic Collaboration by UBFSF Founder Ivan Kilgore
          </span>
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-wide underline-offset-2 group-hover:underline">
            Learn More →
          </span>
        </Link>
      </div>
    </div>
  );
}
