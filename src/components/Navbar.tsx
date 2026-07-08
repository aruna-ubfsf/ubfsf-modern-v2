"use client"

import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-ubfsf-zinc text-white py-3 px-6 sticky top-0 z-[100] shadow-2xl border-b border-white/5">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* LOGO & BRANDING */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 bg-white rounded-full p-1">
            <Image 
              src="/assets/logo.png" 
              alt="UBFSF Logo" 
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-black tracking-tighter text-xl leading-none group-hover:text-ubfsf-gold transition-colors uppercase">
              UBFSF
            </span>
            <span className="text-[8px] text-zinc-500 uppercase tracking-[0.3em] font-bold">
            </span>
          </div>
        </Link>

        {/* NAV LINKS */}
        <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-widest">
          <Link href="/" className="hover:text-ubfsf-gold transition-colors">Home</Link>
          <Link href="/about" className="hover:text-ubfsf-gold transition-colors">About</Link>
          <Link href="/programs" className="hover:text-ubfsf-gold transition-colors">Programs</Link>
          <Link href="/blog" className="hover:text-ubfsf-gold transition-colors">Blog</Link>
          <Link href="/contact" className="hover:text-ubfsf-gold transition-colors">Contact</Link>
        </div>

        {/* CALL TO ACTION */}
        <Link href="/donate">
          <button className="bg-ubfsf-gold hover:bg-yellow-500 text-black text-[10px] font-black px-5 py-2.5 transition-all shadow-lg active:scale-95">
            DONATE NOW
          </button>
        </Link>
      </div>
    </nav>
  );
}
