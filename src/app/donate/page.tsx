import { getPageBySlug } from '@/lib/wordpress';
import Script from 'next/script';
import { notFound } from 'next/navigation';

export default async function DonatePage() {
  // Pull any custom "Donate" text from WordPress if it exists
  const page = await getPageBySlug('donate') || await getPageBySlug('donate-ubfsf');

  return (
    <main className="min-h-screen bg-white">
      {/* 1. Optimized Script Loading for Donation Widget */}
      {/* Replace the src with your actual Givebutter/Donorbox script URL */}
      <Script 
        src="https://widgets.givebutter.com/latest.js" 
        strategy="lazyOnload" 
      />

      {/* HEADER SECTION */}
      <header className="bg-ubfsf-zinc text-white py-24 px-6 md:py-32">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85]">
            Empower <br /> <span className="text-ubfsf-gold">Change</span>
          </h1>
          <div className="h-2 w-24 bg-ubfsf-gold mt-10 mx-auto"></div>
          <p className="mt-10 text-zinc-400 text-sm font-bold uppercase tracking-[0.3em]">
            Your contribution builds the community from within.
          </p>
        </div>
      </header>

      {/* DONATION WIDGET SECTION */}
      <section className="max-w-4xl mx-auto py-20 px-6">
        <div className="grid md:grid-cols-5 gap-16 items-start">
          
          {/* Left: Foundation Info */}
          <div className="md:col-span-2 space-y-8">
            <h2 className="text-2xl font-black uppercase tracking-tighter text-ubfsf-zinc">
              How your gift helps
            </h2>
            <div 
              className="prose prose-zinc text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: page?.content || "Your donation directly supports scholarship funds, community grant programs, and our 'Rebuilding from Within' initiatives." }}
            />
            <div className="p-6 border-l-4 border-ubfsf-gold bg-zinc-50">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Tax Status</p>
              <p className="text-xs font-bold text-ubfsf-zinc">UBFSF is a registered 501(c)3 non-profit organization. All donations are tax-deductible.</p>
            </div>
          </div>

          {/* Right: The Widget Container */}
          <div className="md:col-span-3 bg-white shadow-2xl border border-zinc-100 p-2 rounded-xl">
            {/* 
              This is the "Widget Placeholder". 
              Most donation tools require a specific div ID or class.
              Update the attributes below to match your Givebutter/Donorbox code.
            */}
            <div 
              className="givebutter-widget" 
              data-campaign="ubfsf-general" 
              style={{ minHeight: '600px' }}
            >
              <div className="flex flex-col items-center justify-center py-40 text-zinc-300 animate-pulse">
                <p className="text-[10px] font-black uppercase tracking-widest">Loading Secure Checkout...</p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
