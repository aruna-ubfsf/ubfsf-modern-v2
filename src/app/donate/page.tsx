// src/app/donate/page.tsx
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { getPageBySlug } from "@/lib/wordpress/pages";

export default async function DonatePage() {
  const page = await getPageBySlug('donate');

  if (!page) {
    return (
      <main className="min-h-screen bg-white dark:bg-[#1a1a1a] flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-[#1a1a1a] text-black dark:text-[#f4f4f4] transition-colors duration-300 font-serif">
      
      {/* HERO SECTION */}
      <header className="relative h-[40vh] flex items-end pb-16 px-6 md:px-20 overflow-hidden border-b border-black/10 dark:border-white/10">
        {page.featuredImageUrl && (
          <div className="absolute inset-0 z-0">
            <Image 
              src={page.featuredImageUrl} 
              alt={page.title}
              fill
              className="object-cover opacity-20 grayscale"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#1a1a1a] to-transparent" />
          </div>
        )}
        
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <span className="inline-block bg-[#FFB81C] text-black px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            Support Our Mission
          </span>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-4">
            Donate <span className="text-[#FFB81C]">Now</span>
          </h1>
          <p className="text-lg md:text-xl text-stone-600 dark:text-stone-400 max-w-2xl font-light">
            Your generosity empowers underserved communities through education, opportunity, and lasting change.
          </p>
        </div>
      </header>

      {/* DONATION SECTION */}
      <section className="max-w-7xl mx-auto py-16 px-6 md:px-20">
        <div className="max-w-4xl mx-auto">
          
          {/* Impact Statement */}
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Make a Difference Today</h2>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
              Every contribution, no matter the size, helps us build stronger communities, 
              empower individuals, and create lasting social change.
            </p>
          </div>

          {/* Give Lively Widget */}
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-black/10 dark:border-white/10 overflow-hidden shadow-lg">
            <div className="p-6 md:p-8">
              {/* Donation Widget Container */}
              <div 
                id="give-lively-widget" 
                className="gl-branded-donation-widget min-h-[500px]"
                data-widget-src="https://secure.givelively.org/donate/united-black-family-scholarship-foundation?ref=sd_widget"
              />
              
              {/* Give Lively Script */}
              <Script
                id="give-lively-script"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                  __html: `
                    if (typeof document !== 'undefined') {
                      var gl = document.createElement('script');
                      gl.src = 'https://secure.givelively.org/widgets/branded_donation/united-black-family-scholarship-foundation.js';
                      gl.async = true;
                      document.getElementsByTagName('head')[0].appendChild(gl);
                    }
                  `
                }}
              />
            </div>
          </div>

          {/* Why Donate Section */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <div className="bg-stone-50 dark:bg-[#2a2a2a] p-6 rounded-2xl border border-black/5 dark:border-white/5 text-center">
              <div className="text-4xl mb-3">🎓</div>
              <h3 className="text-lg font-bold mb-2">Scholarships</h3>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                Support students pursuing higher education and building brighter futures.
              </p>
            </div>
            
            <div className="bg-stone-50 dark:bg-[#2a2a2a] p-6 rounded-2xl border border-black/5 dark:border-white/5 text-center">
              <div className="text-4xl mb-3">🏗️</div>
              <h3 className="text-lg font-bold mb-2">Community Programs</h3>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                Fund initiatives that rebuild communities from within.
              </p>
            </div>
            
            <div className="bg-stone-50 dark:bg-[#2a2a2a] p-6 rounded-2xl border border-black/5 dark:border-white/5 text-center">
              <div className="text-4xl mb-3">📢</div>
              <h3 className="text-lg font-bold mb-2">Advocacy</h3>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                Amplify voices and drive systemic change for underserved communities.
              </p>
            </div>
          </div>

          {/* Other Ways to Give */}
          <div className="mt-16 bg-black dark:bg-[#0a0a0a] text-white p-8 md:p-12 rounded-2xl">
            <h2 className="text-2xl font-bold mb-6 text-[#FFB81C]">Other Ways to Give</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Mail a Check</h3>
                <p className="text-white/70 text-sm">
                  United Black Family Scholarship Foundation<br />
                  San Francisco, CA
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Donate Stock</h3>
                <p className="text-white/70 text-sm">
                  Contact us for stock transfer instructions.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Employer Matching</h3>
                <p className="text-white/70 text-sm">
                  Double your impact with employer matching gifts.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Planned Giving</h3>
                <p className="text-white/70 text-sm">
                  Leave a lasting legacy through estate planning.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* ACTION FOOTER */}
        <div className="max-w-4xl mx-auto mt-16 pt-16 border-t border-black/10 dark:border-white/10 flex flex-wrap gap-8 items-center justify-center">
          <Link 
            href="/contact" 
            className="px-10 py-5 bg-[#FFB81C] text-black text-xs font-black uppercase tracking-widest hover:bg-yellow-500 transition-all"
          >
            Contact Us
          </Link>
          <p className="text-stone-500 font-bold uppercase tracking-widest text-[10px]">
            Every dollar makes a difference. Thank you for your support.
          </p>
        </div>
      </section>
    </main>
  );
}