import Image from "next/image";
import { getPageBySlug } from "@/lib/wordpress/pages";
import { getWpImageUrl } from "@/lib/wordpress/client";

export default async function AboutPage() {
  const page = await getPageBySlug("about-ubfsf");

  if (!page) return <main className="p-20 text-center dark:bg-[#1a1a1a]">Loading...</main>;

  return (
    <main className="min-h-screen bg-white dark:bg-[#1a1a1a] text-black dark:text-[#f4f4f4] py-16 px-6 md:px-20 font-serif transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        
        {/* REFINED HEADER: Logo + Title */}
        <header className="mb-20 flex flex-col md:flex-row items-center gap-8 border-b border-black/10 dark:border-white/10 pb-12">
          <div className="relative w-24 h-24 flex-shrink-0">
             <Image 
                src={getWpImageUrl("/wp-content/uploads/2021/10/UBFSF-logo_clr-email.png")} 
                alt="UBFSF Logo" 
                fill 
                className="object-contain"
            />
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-black dark:text-white">
            {page.title}
          </h1>
        </header>

        {/* MISSION & APPROACH */}
        <section className="grid md:grid-cols-2 gap-16 mb-24">
          <div className="space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-[#FFB81C]">Our Mission</h2>
            <p className="leading-relaxed text-stone-800 dark:text-[#d1d1d1]">
              The United Black Family Scholarship Foundation (UBFSF) is a 501(c)(3) nonprofit organization 
              dedicated to improving the social and economic conditions of underserved communities. 
              We empower individuals through education, advocacy, and community-driven initiatives.
            </p>
          </div>
          <div className="space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-[#FFB81C]">Our Approach</h2>
            <p className="leading-relaxed text-stone-800 dark:text-[#d1d1d1]">
              We place a strong emphasis on literacy and critical thinking. By equipping communities with 
              knowledge and awareness, we empower them to challenge and change the systems that perpetuate inequality.
            </p>
          </div>
        </section>

        {/* VIDEO SECTION */}
        <section className="mb-24">
          <div className="aspect-video w-full border border-black/10 dark:border-white/10 shadow-xl">
            <iframe 
                className="w-full h-full"
                src="https://www.youtube.com/embed/0YJZmIHGBXE" 
                title="UBFSF Video"
                allowFullScreen
            />
          </div>
        </section>

        {/* IMPACT METRICS */}
        <section className="py-16 border-y border-black/10 dark:border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: "Founded", val: "2014" },
            { label: "Programs", val: "5+" },
            { label: "Community Impact", val: "1000+" },
            { label: "Focus Areas", val: "3" }
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-black mb-2 text-black dark:text-white">{stat.val}</div>
              <div className="text-[9px] uppercase tracking-[0.2em] text-stone-500">{stat.label}</div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
