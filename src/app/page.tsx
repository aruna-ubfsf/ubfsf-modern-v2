// src/app/page.tsx
import Image from "next/image";
import Link from "next/link";
import { getPosts } from '@/lib/wordpress';
import { getPageBySlug } from '@/lib/wordpress/pages';

function parseHomeContent(content: string) {
  const cleanContent = content
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8211;/g, "–")
    .replace(/&#038;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ");

  let mission = '';
  let quote = '';
  let vision = '';
  let founderMessage = '';
  let founderImage = '';
  let donationItems: string[] = [];

  const missionMatch = cleanContent.match(/Mission Statement[\s\S]*?<p>([\s\S]*?)<\/p>/);
  if (missionMatch) {
    mission = missionMatch[1]
      .replace(/<[^>]*>/g, '')
      .replace(/&#822[01];/g, '"')
      .replace(/&#8217;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  }

  if (!mission) {
    const missionAltMatch = cleanContent.match(/<p><span[^>]*>([\s\S]*?mission[\s\S]*?)<\/span><\/p>/i);
    if (missionAltMatch) {
      mission = missionAltMatch[1]
        .replace(/<[^>]*>/g, '')
        .replace(/&#822[01];/g, '"')
        .replace(/&#8217;/g, "'")
        .replace(/\s+/g, ' ')
        .trim();
    }
  }

  const quoteMatch = cleanContent.match(/<h4><b>([\s\S]*?)<\/b><\/h4>/);
  if (quoteMatch) {
    quote = quoteMatch[1]
      .replace(/<[^>]*>/g, '')
      .replace(/&#822[01];/g, '"')
      .replace(/&#8217;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  }

  const visionMatch = cleanContent.match(/Vision[\s\S]*?<p>([\s\S]*?)<\/p>/);
  if (visionMatch) {
    vision = visionMatch[1]
      .replace(/<[^>]*>/g, '')
      .replace(/&#822[01];/g, '"')
      .replace(/&#8217;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  }

  if (!vision) {
    const visionAltMatch = cleanContent.match(/<p><span[^>]*>([\s\S]*?vision[\s\S]*?)<\/span><\/p>/i);
    if (visionAltMatch) {
      vision = visionAltMatch[1]
        .replace(/<[^>]*>/g, '')
        .replace(/&#822[01];/g, '"')
        .replace(/&#8217;/g, "'")
        .replace(/\s+/g, ' ')
        .trim();
    }
  }

  const founderImgMatch = cleanContent.match(/\[et_pb_image[^\]]*src=["']([^"']+)["']/);
  if (founderImgMatch) {
    founderImage = founderImgMatch[1];
  }

  const founderMatch = cleanContent.match(/A Word From Our Founder[\s\S]*?<p>([\s\S]*?)<\/p>/);
  if (founderMatch) {
    founderMessage = founderMatch[1]
      .replace(/<[^>]*>/g, '')
      .replace(/&#822[01];/g, '"')
      .replace(/&#8217;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  }

  const donateMatch = cleanContent.match(/<ul>([\s\S]*?)<\/ul>/);
  if (donateMatch) {
    const items = donateMatch[1].match(/<li[^>]*>([\s\S]*?)<\/li>/g);
    if (items) {
      donationItems = items.map(item => 
        item.replace(/<[^>]*>/g, '').replace(/:/g, '').trim()
      );
    }
  }

  return { mission, quote, vision, founderMessage, founderImage, donationItems };
}

export default async function HomePage() {
  const [pageData, posts] = await Promise.all([
    getPageBySlug('home'),
    getPosts(6)
  ]);

  const { mission, quote, vision, founderMessage, founderImage, donationItems } = 
    pageData ? parseHomeContent(pageData.content) : { 
      mission: '', quote: '', vision: '', founderMessage: '', founderImage: '', donationItems: [] 
    };

  const displayMission = mission || "Our mission at the United Black Family Scholarship Foundation is to foster accessible, high-quality education for individuals of all races, driving systemic change in political structures that perpetuate poverty and inequality. Our initiatives go beyond traditional academic credentials, focusing on education as a tool for 'Rebuilding the Community from Within.' We empower communities with the knowledge and resources to lead grassroots movements and promote transformative social and political change.";
  
  const displayVision = vision || "We envision a world where everyone has access to an education that empowers them to overcome social and economic challenges, breaking the cycle of poverty and dismantling systemic racism.";

  const displayQuote = quote || "Education is our passport to the future, for tomorrow belongs to the people who prepare for it today.";

  return (
    <main className="min-h-screen bg-white dark:bg-[#1a1a1a] text-black dark:text-[#f4f4f4] transition-colors duration-300 font-serif selection:bg-[#FFB81C]/30">
      
      {/* VIDEO HERO - Now properly responsive with object-contain */}
      <section className="relative h-screen w-full overflow-hidden bg-black">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-contain"
          poster="/assets/hero-poster.jpg"
        >
          <source src="https://ubfsf.org/wp-content/uploads/2023/04/ivan-headspin.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/50 animate-bounce">
          <span className="text-[8px] uppercase tracking-[0.3em] mb-2">Scroll to explore</span>
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* REBUILDING COMMUNITY - Responsive */}
      <section className="py-16 md:py-24 px-4 md:px-20 bg-white dark:bg-[#1a1a1a] border-t border-black/5 dark:border-white/5">
        <div className="max-w-6xl mx-auto text-center">
          <div className="w-12 md:w-16 h-1 bg-[#FFB81C] mx-auto mb-6 md:mb-8" />
          <span className="inline-block text-[#FFB81C] text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] mb-4 md:mb-6">
            United Black Family Scholarship Foundation
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-6 md:mb-8">
            Rebuilding <br />
            <span className="text-[#FFB81C]">Community</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-stone-600 dark:text-stone-400 max-w-3xl mx-auto leading-relaxed font-light px-2">
            Empowering communities with the knowledge and resources to lead grassroots movements and promote transformative social and political change.
          </p>
          <div className="flex flex-wrap gap-3 md:gap-4 mt-8 md:mt-10 justify-center">
            <Link href="/donate" className="px-6 md:px-10 py-3 md:py-4 bg-[#FFB81C] text-black text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-yellow-500 transition-all rounded-sm">
              Donate Now
            </Link>
            <Link href="/about" className="px-6 md:px-10 py-3 md:py-4 border border-black/20 dark:border-white/20 text-black dark:text-white text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-black/5 dark:hover:bg-white/5 transition-all rounded-sm">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* MISSION & VISION - Responsive */}
      <section className="py-16 md:py-20 px-4 md:px-20 bg-stone-50 dark:bg-[#2a2a2a]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16">
            {/* Mission */}
            <div>
              <span className="inline-block text-[#FFB81C] text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] mb-3 md:mb-4">Mission</span>
              <div className="w-10 md:w-12 h-0.5 bg-[#FFB81C] mb-4 md:mb-6" />
              <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-4 md:mb-6">
                Our <span className="text-[#FFB81C]">Mission</span>
              </h2>
              <p className="text-sm md:text-base text-stone-600 dark:text-stone-400 leading-relaxed">
                {displayMission}
              </p>
            </div>
            
            {/* Vision */}
            <div>
              <span className="inline-block text-[#FFB81C] text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] mb-3 md:mb-4">Vision</span>
              <div className="w-10 md:w-12 h-0.5 bg-[#FFB81C] mb-4 md:mb-6" />
              <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-4 md:mb-6">
                Our <span className="text-[#FFB81C]">Vision</span>
              </h2>
              <p className="text-sm md:text-base text-stone-600 dark:text-stone-400 leading-relaxed">
                {displayVision}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MALCOLM X QUOTE - Responsive */}
      <section className="py-20 md:py-28 px-4 md:px-20 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-[#FFB81C] to-transparent" />
          <div className="absolute bottom-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#FFB81C] to-transparent" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="text-5xl md:text-8xl text-[#FFB81C] font-serif opacity-30">"</span>
          <blockquote className="text-xl sm:text-2xl md:text-4xl font-light italic text-white leading-relaxed -mt-4 md:-mt-6 px-2">
            {displayQuote}
          </blockquote>
          <div className="w-12 md:w-16 h-0.5 bg-[#FFB81C] mx-auto my-4 md:my-6" />
          <p className="text-[#FFB81C] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-sm">— Malcolm X</p>
        </div>
      </section>

      {/* OBJECTIVES - Responsive */}
      <section className="py-16 md:py-24 px-4 md:px-20 bg-white dark:bg-[#1a1a1a]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block text-[#FFB81C] text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] mb-3 md:mb-4">
              Our Focus
            </span>
            <div className="w-10 md:w-12 h-0.5 bg-[#FFB81C] mx-auto mb-4 md:mb-6" />
            <h2 className="text-2xl md:text-5xl font-black uppercase tracking-tighter mb-3 md:mb-4">
              Organizational <span className="text-[#FFB81C]">Objectives</span>
            </h2>
            <p className="text-stone-500 dark:text-stone-400 max-w-2xl mx-auto font-light italic text-sm md:text-base">
              Ideas + Collective Action = Community Growth
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <div className="group bg-stone-50 dark:bg-[#2a2a2a] p-6 md:p-8 rounded-sm border-l-4 border-[#FFB81C]/30 hover:border-[#FFB81C] hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <h3 className="text-base md:text-xl font-bold mb-2 md:mb-3 group-hover:text-[#FFB81C] transition-colors">Expand Community Investment</h3>
              <p className="text-sm md:text-base text-stone-600 dark:text-stone-400 leading-relaxed">
                Implement Scholarship & Community Grant, Internship, and R.E.B.U.I.L.D. programs to support underserved communities.
              </p>
            </div>
            
            <div className="group bg-stone-50 dark:bg-[#2a2a2a] p-6 md:p-8 rounded-sm border-l-4 border-[#FFB81C]/30 hover:border-[#FFB81C] hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <h3 className="text-base md:text-xl font-bold mb-2 md:mb-3 group-hover:text-[#FFB81C] transition-colors">Foster Social & Economic Change</h3>
              <p className="text-sm md:text-base text-stone-600 dark:text-stone-400 leading-relaxed">
                Demonstrate how collaborative action empowers communities to overcome economic disparities.
              </p>
            </div>
            
            <div className="group bg-stone-50 dark:bg-[#2a2a2a] p-6 md:p-8 rounded-sm border-l-4 border-[#FFB81C]/30 hover:border-[#FFB81C] hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <h3 className="text-base md:text-xl font-bold mb-2 md:mb-3 group-hover:text-[#FFB81C] transition-colors">Strengthen Community-Led Systems</h3>
              <p className="text-sm md:text-base text-stone-600 dark:text-stone-400 leading-relaxed">
                Showcase an organizational framework led by community-driven leaders committed to economic empowerment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOUNDER'S MESSAGE - Responsive */}
      {founderMessage && (
        <section className="py-16 md:py-24 px-4 md:px-20 bg-stone-50 dark:bg-[#2a2a2a]">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
              <div>
                <span className="inline-block text-[#FFB81C] text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] mb-3 md:mb-4">
                  Founder's Message
                </span>
                <div className="w-10 md:w-12 h-0.5 bg-[#FFB81C] mb-4 md:mb-6" />
                <h2 className="text-2xl md:text-5xl font-black uppercase tracking-tighter mb-4 md:mb-6">
                  A Word From <span className="text-[#FFB81C]">Ivan Kilgore</span>
                </h2>
                <p className="text-sm md:text-base text-stone-600 dark:text-stone-400 leading-relaxed">
                  {founderMessage}
                </p>
                <div className="mt-4 md:mt-6 space-y-2 text-stone-600 dark:text-stone-400 text-sm">
                  <p className="flex items-start gap-2 md:gap-3">
                    <span className="text-[#FFB81C] font-bold">01</span>
                    <span>Build Life and Job Skills</span>
                  </p>
                  <p className="flex items-start gap-2 md:gap-3">
                    <span className="text-[#FFB81C] font-bold">02</span>
                    <span>Achieve Economic Stability</span>
                  </p>
                  <p className="flex items-start gap-2 md:gap-3">
                    <span className="text-[#FFB81C] font-bold">03</span>
                    <span>Disrupt the School-to-Prison Pipeline</span>
                  </p>
                </div>
                <Link 
                  href="/about/ivan-kilgore" 
                  className="inline-block mt-6 md:mt-8 px-6 md:px-8 py-3 bg-[#FFB81C] text-black text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-yellow-500 transition-all rounded-sm"
                >
                  Meet Ivan
                </Link>
              </div>
              {founderImage && (
                <div className="relative aspect-[4/5] rounded-sm overflow-hidden bg-stone-200 dark:bg-stone-800 shadow-xl">
                  <Image
                    src={founderImage}
                    alt="Ivan Kilgore - Founder"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* DONATE SECTION - Responsive */}
      <section className="py-16 md:py-24 px-4 md:px-20 bg-white dark:bg-[#1a1a1a]">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl md:text-5xl font-black uppercase tracking-tighter mb-4 md:mb-6">
            Empower Communities Through <span className="text-[#FFB81C]">Education & Opportunity</span>
          </h2>
          <div className="w-12 md:w-16 h-0.5 bg-[#FFB81C] mx-auto mb-6 md:mb-8" />
          <p className="text-sm md:text-base text-stone-500 dark:text-stone-400 max-w-2xl mx-auto mb-8 md:mb-12 font-light px-2">
            Every donation directly supports our mission-driven programs that empower underserved communities and foster lasting change.
          </p>
          
          <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
            {donationItems.slice(0, 3).map((item, index) => (
              <div key={index} className="bg-stone-50 dark:bg-[#2a2a2a] p-6 md:p-8 rounded-sm border border-black/5 dark:border-white/5 hover:shadow-lg hover:border-[#FFB81C]/30 transition-all duration-300 group">
                <div className="w-6 md:w-8 h-0.5 bg-[#FFB81C] mb-3 md:mb-4 group-hover:w-8 md:group-hover:w-12 transition-all duration-300" />
                <h4 className="font-bold text-base md:text-lg mb-1 md:mb-2">{item}</h4>
              </div>
            ))}
          </div>
          
          <Link 
            href="/donate" 
            className="inline-block px-8 md:px-12 py-4 md:py-5 bg-[#FFB81C] text-black text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-yellow-500 transition-all rounded-sm"
          >
            Donate Now
          </Link>
        </div>
      </section>

      {/* LATEST UPDATES - Responsive */}
      <section className="py-16 md:py-24 px-4 md:px-20 bg-stone-50 dark:bg-[#2a2a2a]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-between mb-8 md:mb-12">
            <div>
              <span className="inline-block text-[#FFB81C] text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] mb-2">
                Latest Updates
              </span>
              <div className="w-10 md:w-12 h-0.5 bg-[#FFB81C] mb-3 md:mb-4" />
              <h2 className="text-2xl md:text-5xl font-black uppercase tracking-tighter">
                From the <span className="text-[#FFB81C]">Newsroom</span>
              </h2>
            </div>
            <Link 
              href="/blog" 
              className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#FFB81C] border-b-2 border-[#FFB81C] hover:opacity-70 transition-opacity"
            >
              View All News →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                <article className="bg-white dark:bg-[#1a1a1a] rounded-sm border border-black/5 dark:border-white/5 overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] h-full flex flex-col">
                  {post.image && (
                    <div className="relative w-full h-48 md:h-56 overflow-hidden bg-stone-200 dark:bg-stone-800">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-4 md:p-6 flex flex-col flex-grow">
                    <time className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-[#FFB81C] mb-2">
                      {new Date(post.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </time>
                    <h3 className="text-base md:text-xl font-bold tracking-tight mb-2 group-hover:text-[#FFB81C] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <div 
                      className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed line-clamp-3 flex-grow"
                      dangerouslySetInnerHTML={{ __html: post.excerpt }} 
                    />
                    <span className="inline-block mt-4 text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-[#FFB81C] group-hover:underline">
                      Read More →
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FOOTER - Responsive */}
      <section className="py-16 md:py-20 px-4 md:px-20 bg-black text-white text-center">
        <div className="max-w-4xl mx-auto">
          <div className="w-12 md:w-16 h-0.5 bg-[#FFB81C] mx-auto mb-6 md:mb-8" />
          <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tighter mb-4 md:mb-6">
            Join Us in <span className="text-[#FFB81C]">Rebuilding</span> Community
          </h2>
          <p className="text-sm md:text-base text-white/60 max-w-2xl mx-auto mb-6 md:mb-8 font-light px-2">
            Together, we can create lasting change and build a brighter future for all.
          </p>
          <div className="flex flex-wrap gap-3 md:gap-4 justify-center">
            <Link 
              href="/donate" 
              className="px-6 md:px-10 py-3 md:py-4 bg-[#FFB81C] text-black text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-yellow-500 transition-all rounded-sm"
            >
              Donate Now
            </Link>
            <Link 
              href="/contact" 
              className="px-6 md:px-10 py-3 md:py-4 border border-white/30 text-white text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all rounded-sm"
            >
              Get Involved
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}