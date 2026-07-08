"use client"

import { useState } from 'react';
import Script from 'next/script';
import { Globe, ChevronDown } from 'lucide-react';

export default function LanguageManager() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* THE PRO POPUP TRIGGER */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded-lg transition-all group"
      >
        <Globe size={16} className="text-ubfsf-gold group-hover:rotate-12 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">Language</span>
        <ChevronDown size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* DROPDOWN POPUP */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl z-[200] p-4 animate-in fade-in slide-in-from-top-2">
          <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-3">Select Language</p>
          <div id="google_translate_element"></div>
        </div>
      )}

      {/* GOOGLE TRANSLATE ENGINE */}
      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
      <Script id="google-translate-init" strategy="afterInteractive">
        {`
          function googleTranslateElementInit() {
            new google.translate.TranslateElement({
              pageLanguage: 'en',
              autoDisplay: true,
              layout: google.translate.TranslateElement.InlineLayout.SIMPLE
            }, 'google_translate_element');
          }
        `}
      </Script>

      <style jsx global>{`
        .goog-te-banner-frame { display: none !important; }
        body { top: 0 !important; }
        .goog-te-gadget-simple {
          background: transparent !important;
          border: none !important;
          padding: 0 !important;
        }
        .goog-te-menu-value span {
          color: #D4A017 !important;
          font-size: 11px !important;
          font-weight: 900 !important;
          text-transform: uppercase !important;
        }
        .goog-te-gadget-icon { display: none !important; }
      `}</style>
    </div>
  );
}
