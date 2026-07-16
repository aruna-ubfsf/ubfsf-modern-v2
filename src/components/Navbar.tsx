"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isProgramsOpen, setIsProgramsOpen] = useState(false);
  const [isBlogOpen, setIsBlogOpen] = useState(false);

  const programLinks = [
    { title: "Programs Overview", href: "/programs" },
    { title: "Hundred Stories Project", href: "/programs/hundred-stories" },
    { title: "Nonprofit Coaching & Fellowship", href: "/programs/coaching" },
    { title: "Rebuild", href: "/programs/rebuild" },
    { title: "Writing Beyond the Prison", href: "/programs/writing" }
  ];

  const aboutLinks = [
    { title: "Our Mission", href: "/about" },
    { title: "Staff & Volunteers", href: "/about/staff" },
    { title: "Board of Advisory", href: "/about/board-advisory" },
    { title: "Board of Directors", href: "/about/board-directors" },
    { title: "Ivan Kilgore", href: "/about/founder" }
  ];

  return (
    <nav className="bg-[#1a1a1a] text-white py-3 px-6 sticky top-0 z-[100] shadow-2xl border-b border-white/5">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
          <div className="relative w-10 h-10 bg-white rounded-full p-1">
            <Image src="/assets/logo.png" alt="UBFSF Logo" fill className="object-contain" priority sizes="40px" />
          </div>
          <span className="font-black text-xl uppercase text-white group-hover:text-[#FFB81C] transition-colors">
            UBFSF
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-widest">
          <Link href="/" className="text-white hover:text-[#FFB81C] transition-colors">
            Home
          </Link>
          
          {/* ABOUT DROPDOWN */}
          <div className="relative" onMouseEnter={() => setIsAboutOpen(true)} onMouseLeave={() => setIsAboutOpen(false)}>
            <button className="flex items-center gap-1 text-white hover:text-[#FFB81C] transition-colors uppercase">
              About <ChevronDown size={10} />
            </button>
            {isAboutOpen && (
              <div className="absolute top-full left-0 w-56 bg-[#1a1a1a] border border-white/10 py-3 rounded-b-lg shadow-xl">
                {aboutLinks.map(link => (
                  <Link 
                    key={link.title} 
                    href={link.href} 
                    className="block px-6 py-2.5 text-white hover:bg-white/5 hover:text-[#FFB81C] transition-colors text-[11px]"
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* PROGRAMS DROPDOWN */}
          <div className="relative" onMouseEnter={() => setIsProgramsOpen(true)} onMouseLeave={() => setIsProgramsOpen(false)}>
            <button className="flex items-center gap-1 text-white hover:text-[#FFB81C] transition-colors uppercase">
              Programs <ChevronDown size={10} />
            </button>
            {isProgramsOpen && (
              <div className="absolute top-full left-0 w-64 bg-[#1a1a1a] border border-white/10 py-3 rounded-b-lg shadow-xl">
                {programLinks.map(link => (
                  <Link 
                    key={link.title} 
                    href={link.href} 
                    className="block px-6 py-2.5 text-white hover:bg-white/5 hover:text-[#FFB81C] transition-colors text-[11px]"
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* BLOG & NEWSLETTER DROPDOWN */}
          <div className="relative" onMouseEnter={() => setIsBlogOpen(true)} onMouseLeave={() => setIsBlogOpen(false)}>
            <button className="flex items-center gap-1 text-white hover:text-[#FFB81C] transition-colors uppercase">
              Blog <ChevronDown size={10} />
            </button>
            {isBlogOpen && (
              <div className="absolute top-full left-0 w-48 bg-[#1a1a1a] border border-white/10 py-3 rounded-b-lg shadow-xl">
                <Link href="/blog" className="block px-6 py-2.5 text-white hover:bg-white/5 hover:text-[#FFB81C] transition-colors text-[11px]">
                  Blog Home
                </Link>
                <a 
                  href="https://the-new-wave-newsletter-ubfsf.beehiiv.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block px-6 py-2.5 text-white hover:bg-white/5 hover:text-[#FFB81C] transition-colors text-[11px]"
                >
                  Newsletter
                </a>
              </div>
            )}
          </div>

          <Link href="/contact" className="text-white hover:text-[#FFB81C] transition-colors">
            Contact
          </Link>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button 
          className="md:hidden text-white hover:text-[#FFB81C] transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <Link href="/donate" className="hidden md:block flex-shrink-0">
          <button className="bg-[#FFB81C] text-black text-[10px] font-black px-5 py-2.5 hover:bg-yellow-500 transition-all">
            DONATE NOW
          </button>
        </Link>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#1a1a1a] py-6 px-6 space-y-4 text-sm font-bold uppercase border-t border-white/10 max-h-[80vh] overflow-y-auto">
          <Link 
            href="/" 
            className="block text-white hover:text-[#FFB81C] transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          
          {/* Mobile About Section */}
          <div className="space-y-2">
            <p className="text-[#FFB81C]">About</p>
            <div className="space-y-2 pl-4">
              {aboutLinks.map(link => (
                <Link 
                  key={link.title} 
                  href={link.href} 
                  className="block text-xs text-white hover:text-[#FFB81C] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Programs Section */}
          <div className="space-y-2">
            <p className="text-[#FFB81C]">Programs</p>
            <div className="space-y-2 pl-4">
              {programLinks.map(link => (
                <Link 
                  key={link.title} 
                  href={link.href} 
                  className="block text-xs text-white hover:text-[#FFB81C] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Blog Section */}
          <div className="space-y-2">
            <p className="text-[#FFB81C]">Blog</p>
            <div className="space-y-2 pl-4">
              <Link 
                href="/blog" 
                className="block text-xs text-white hover:text-[#FFB81C] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Blog Home
              </Link>
              <a 
                href="https://the-new-wave-newsletter-ubfsf.beehiiv.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block text-xs text-white hover:text-[#FFB81C] transition-colors"
              >
                Newsletter
              </a>
            </div>
          </div>

          <Link 
            href="/contact" 
            className="block text-white hover:text-[#FFB81C] transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact
          </Link>
          
          {/* Mobile Donate Button */}
          <Link href="/donate" onClick={() => setIsMobileMenuOpen(false)}>
            <button className="w-full bg-[#FFB81C] text-black text-xs font-black px-5 py-3 hover:bg-yellow-500 transition-all mt-4">
              DONATE NOW
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
}