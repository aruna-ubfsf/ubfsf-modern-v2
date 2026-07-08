import Image from 'next/image';
import Script from 'next/script';

export default function Footer() {
  return (
    <footer className="bg-white pt-20 pb-10 border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* TOP DIVIDER LINE */}
        <div className="flex items-center gap-4 mb-16">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 whitespace-nowrap">
            Join our Newsletter
          </span>
          <div className="h-px w-full bg-zinc-100"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-start">
          
          {/* LEFT COLUMN: CONTACT & LOGO */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h2 className="text-xl font-black uppercase tracking-tighter text-zinc-900 mb-6">
              United Black Family <br /> Scholarship Foundation
            </h2>
            
            <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest leading-loose mb-10">
              <p>P.O. Box 862</p>
              <p>Bristow OK 74010</p>
              <p className="mt-2">Phone: 1-918-924-5872</p>
              <p>Email: news@ubfsf.org</p>
            </div>

            {/* CIRCULAR LOGO - Matching your screenshot */}
            <div className="relative w-48 h-48">
              <Image 
                src="https://ubfsf.org/wp-content/uploads/2021/10/UBFSF-logo_clr-email.png"
                alt="UBFSF Logo"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </div>

          {/* RIGHT COLUMN: BEEHIIV EMBED */}
          <div className="flex flex-col items-center md:items-end">
            <div className="w-full max-w-[400px]">
              <h3 className="text-lg font-black uppercase tracking-tighter text-zinc-900 mb-6 text-center md:text-right">
              </h3>
              
              <Script 
                src="https://subscribe-forms.beehiiv.com/embed.js" 
                strategy="afterInteractive" 
              />
              
              <div className="ubfsf-newsletter-container shadow-sm border border-zinc-100">
                <iframe 
                  src="https://subscribe-forms.beehiiv.com/04d12702-7399-421a-886b-8ba94f02ddc4" 
                  className="beehiiv-embed" 
                  data-test-id="beehiiv-embed" 
                  frameBorder="0" 
                  scrolling="no" 
                  style={{ 
                    width: '100%', 
                    height: '350px', 
                    margin: '0', 
                    borderRadius: '0px', 
                    backgroundColor: 'transparent' 
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="mt-20 pt-8 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
            © {new Date().getFullYear()} United Black Family Scholarship Foundation | All Rights Reserved.
          </p>
          <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
            A 501(c)3 Non-Profit Organization
          </p>
        </div>
      </div>
    </footer>
  );
}
