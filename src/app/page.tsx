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
    .replace(/&nbsp;/g, " ")
    .replace(/&#8243;/g, '"')
    .replace(/&#8242;/g, "'")
    .replace(/&#x7b;/g, '{');

  let mission = '';
  let quote = '';
  let vision = '';
  let founderMessage = '';
  let founderImage = '';
  let donationItems: string[] = [];
  let videoUrl = '';
  let objectives: { title: string; description: string }[] = [];
  let donateTitle = '';
  let donateDescription = '';
  let logoImage = '';
  let backgroundImage = '';
  let organizationalImage = '';
  let founderName = '';

  // Extract Video URL
  const videoMatch = cleanContent.match(/\[et_pb_video[^\]]*src="([^"]*ivan-headspin[^"]*)"[^\]]*\]/);
  if (videoMatch) {
    videoUrl = videoMatch[1];
  }

  // Extract Mission Text
  const missionMatch = cleanContent.match(/<p><span style="font-weight: 400;">([\s\S]*?Our mission at the United Black Family Scholarship Foundation[\s\S]*?)<\/span><\/p>/i);
  if (missionMatch) {
    mission = missionMatch[1]
      .replace(/<[^>]*>/g, '')
      .replace(/&#822[01];/g, '"')
      .replace(/&#8217;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Extract Malcolm X Quote
  const quoteMatch = cleanContent.match(/<h4><b>([\s\S]*?)<\/b><\/h4>/);
  if (quoteMatch) {
    quote = quoteMatch[1]
      .replace(/<[^>]*>/g, '')
      .replace(/&#822[01];/g, '"')
      .replace(/&#8217;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Extract Vision
  const visionMatch = cleanContent.match(/<p><span style="font-weight: 400;">([\s\S]*?We envision a world[\s\S]*?)<\/span><\/p>/i);
  if (visionMatch) {
    vision = visionMatch[1]
      .replace(/<[^>]*>/g, '')
      .replace(/&#822[01];/g, '"')
      .replace(/&#8217;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Extract Founder Image
  const founderImgMatch = cleanContent.match(/\[et_pb_image[^\]]*src="([^"]*Screenshot-2025-01-24[^"]*)"[^\]]*\]/);
  if (founderImgMatch) {
    founderImage = founderImgMatch[1];
  }

  // Extract Founder Name
  const founderNameMatch = cleanContent.match(/title_suffix="[^"]*\| ([^"]*)"[^>]*>/);
  if (founderNameMatch) {
    founderName = founderNameMatch[1].trim();
  }

  // Extract Logo Image
  const logoMatch = cleanContent.match(/\[et_pb_image[^\]]*src="([^"]*UBFSF-logo[^"]*)"[^\]]*\]/);
  if (logoMatch) {
    logoImage = logoMatch[1];
  }

  // Extract Background Image
  const bgMatch = cleanContent.match(/background_image="([^"]*lifting-others[^"]*)"[^>]*>/);
  if (bgMatch) {
    backgroundImage = bgMatch[1];
  }

  // Extract Organizational Chart Image
  const orgMatch = cleanContent.match(/\[et_pb_image[^\]]*src="([^"]*ubfsf-brand_goals-initiatives[^"]*)"[^\]]*\]/);
  if (orgMatch) {
    organizationalImage = orgMatch[1];
  }

  // Extract Founder Message
  const founderSection = cleanContent.match(/A Word From Our Founder[\s\S]*?<p>([\s\S]*?)<\/p>[\s\S]*?<p>([\s\S]*?)<\/p>[\s\S]*?<p>([\s\S]*?)<\/p>[\s\S]*?<p>([\s\S]*?)<\/p>[\s\S]*?<p>([\s\S]*?)<\/p>[\s\S]*?<p>([\s\S]*?)<\/p>/i);
  if (founderSection) {
    founderMessage = founderSection.slice(1).map(p => 
      p.replace(/<[^>]*>/g, '')
       .replace(/&#822[01];/g, '"')
       .replace(/&#8217;/g, "'")
       .trim()
    ).join('\n\n');
  }

  // Extract Donation Items
  const donateListMatch = cleanContent.match(/<ul>([\s\S]*?)<\/ul>/);
  if (donateListMatch) {
    const items = donateListMatch[1].match(/<li[^>]*>([\s\S]*?)<\/li>/g);
    if (items) {
      donationItems = items.map(item => 
        item.replace(/<[^>]*>/g, '').replace(/:/g, '').trim()
      );
    }
  }

  // Extract Objectives
  const objectiveMatches = cleanContent.match(/<p><span style="text-decoration: underline;">\s*<strong>([\s\S]*?)<\/strong>\s*<\/span><\/p>\s*<p><span style="font-weight: 400;">([\s\S]*?)<\/span><\/p>/g);
  if (objectiveMatches) {
    objectiveMatches.forEach((match) => {
      const titleMatch = match.match(/<strong>([\s\S]*?)<\/strong>/);
      const descMatch = match.match(/<span style="font-weight: 400;">([\s\S]*?)<\/span>/);
      if (titleMatch && descMatch) {
        objectives.push({
          title: titleMatch[1].trim(),
          description: descMatch[1].trim()
        });
      }
    });
  }

  // Extract Donate Section Title
  const donateTitleMatch = cleanContent.match(/title_prefix="([^"]*Empower Communities Through Education[^"]*)"[^>]*>/);
  if (donateTitleMatch) {
    donateTitle = donateTitleMatch[1].trim();
  }

  // Extract Donate Description
  const donateDescMatch = cleanContent.match(/<p>([\s\S]*?Every donation directly supports[\s\S]*?)<\/p>/i);
  if (donateDescMatch) {
    donateDescription = donateDescMatch[1]
      .replace(/<[^>]*>/g, '')
      .replace(/&#822[01];/g, '"')
      .replace(/&#8217;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  }

  return { 
    mission, 
    quote, 
    vision, 
    founderMessage, 
    founderImage, 
    donationItems, 
    videoUrl,
    objectives,
    donateTitle,
    donateDescription,
    logoImage,
    backgroundImage,
    organizationalImage,
    founderName
  };
}

export default async function HomePage() {
  const [pageData, posts] = await Promise.all([
    getPageBySlug('home'),
    getPosts(6)
  ]);

  const { 
    mission, 
    quote, 
    vision, 
    founderMessage, 
    founderImage, 
    donationItems,
    videoUrl,
    objectives,
    donateTitle,
    donateDescription,
    logoImage,
    backgroundImage,
    organizationalImage,
    founderName
  } = pageData ? parseHomeContent(pageData.content) : { 
    mission: '', 
    quote: '', 
    vision: '', 
    founderMessage: '', 
    founderImage: '', 
    donationItems: [],
    videoUrl: '',
    objectives: [],
    donateTitle: '',
    donateDescription: '',
    logoImage: '',
    backgroundImage: '',
    organizationalImage: '',
    founderName: 'Ivan Kilgore'
  };

  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0a] text-black dark:text-[#f4f4f4] transition-colors duration-300 font-serif selection:bg-[#FFB81C]/30">
      
      {/* ===== HERO VIDEO ===== */}
      <section className="relative h-screen w-full overflow-hidden bg-black">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={videoUrl || "https://ubfsf.org/wp-content/uploads/2023/04/ivan-headspin.mp4"} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/50 animate-bounce">
          <span className="text-[6px] md:text-[8px] uppercase tracking-[0.2em] md:tracking-[0.3em] mb-1 md:mb-2">Scroll to explore</span>
          <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ===== REBUILDING COMMUNITY ===== */}
      <section className="py-12 md:py-16 lg:py-24 px-4 sm:px-6 md:px-12 lg:px-20 bg-white dark:bg-[#0a0a0a] border-t border-black/5 dark:border-white/5">
        <div className="max-w-6xl mx-auto text-center">
          <div className="w-10 md:w-16 h-1 bg-[#FFB81C] mx-auto mb-4 md:mb-6" />
          <span className="inline-block text-[#FFB81C] text-[7px] md:text-[8px] lg:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] lg:tracking-[0.3em] mb-3 md:mb-4">
            United Black Family Scholarship Foundation
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-4 md:mb-6 text-black dark:text-white">
            Rebuilding <br className="hidden sm:block" />
            <span className="text-[#FFB81C]">Community</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-stone-600 dark:text-stone-300 max-w-3xl mx-auto leading-relaxed font-light px-2">
            Empowering communities with the knowledge and resources to lead grassroots movements and promote transformative social and political change.
          </p>
          <div className="flex flex-wrap gap-3 md:gap-4 mt-6 md:mt-8 lg:mt-10 justify-center">
            <Link href="/donate" className="px-5 md:px-8 lg:px-10 py-2.5 md:py-3 lg:py-4 bg-[#FFB81C] text-black text-[9px] md:text-[10px] lg:text-xs font-black uppercase tracking-widest hover:bg-yellow-500 transition-all rounded-sm">
              Donate Now
            </Link>
            <Link href="/about" className="px-5 md:px-8 lg:px-10 py-2.5 md:py-3 lg:py-4 border border-black/20 dark:border-white/20 text-black dark:text-white text-[9px] md:text-[10px] lg:text-xs font-black uppercase tracking-widest hover:bg-black/5 dark:hover:bg-white/5 transition-all rounded-sm">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* ===== MISSION ===== */}
      {mission && (
        <section className="py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-12 lg:px-20 bg-stone-50 dark:bg-[#141414]">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-16">
              <div className="order-first lg:order-none">
                {videoUrl && (
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-black shadow-xl">
                    <video controls className="absolute inset-0 w-full h-full object-contain">
                      <source src={videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
              </div>
              <div>
                <span className="inline-block text-[#FFB81C] text-[7px] md:text-[8px] lg:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] lg:tracking-[0.3em] mb-2 md:mb-3">
                  Mission Statement
                </span>
                <div className="w-8 md:w-12 h-0.5 bg-[#FFB81C] mb-3 md:mb-4" />
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter mb-3 md:mb-4 text-black dark:text-white">
                  Our <span className="text-[#FFB81C]">Mission</span>
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-stone-600 dark:text-stone-300 leading-relaxed">
                  {mission}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== QUOTE ===== */}
      {quote && (
        <section className="py-12 md:py-16 px-4 sm:px-6 md:px-12 lg:px-20 bg-white dark:bg-[#0a0a0a]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light italic text-black dark:text-white leading-relaxed">
                "{quote}"
              </p>
              <div className="w-12 md:w-16 h-0.5 bg-[#FFB81C] mx-auto my-3 md:my-4" />
              <p className="text-[#FFB81C] font-bold uppercase tracking-widest text-sm md:text-base">
                — Malcolm X
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ===== VISION ===== */}
      {vision && (
        <section className="py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-12 lg:px-20 bg-black text-white">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block text-[#FFB81C] text-[7px] md:text-[8px] lg:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] lg:tracking-[0.3em] mb-2 md:mb-3">
              Vision
            </span>
            <div className="w-8 md:w-12 h-0.5 bg-[#FFB81C] mx-auto mb-3 md:mb-4" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter mb-4 md:mb-6 text-white">
              <span className="text-[#FFB81C]">Vision</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 leading-relaxed font-light">
              {vision}
            </p>
          </div>
        </section>
      )}

      {/* ===== OBJECTIVES ===== */}
      {objectives.length > 0 && (
        <section className="py-12 md:py-16 lg:py-24 px-4 sm:px-6 md:px-12 lg:px-20 bg-black text-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 md:mb-12 lg:mb-16">
              <span className="inline-block text-[#FFB81C] text-[7px] md:text-[8px] lg:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] lg:tracking-[0.3em] mb-2 md:mb-3">
                Our Focus
              </span>
              <div className="w-8 md:w-12 h-0.5 bg-[#FFB81C] mx-auto mb-3 md:mb-4" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter mb-2 md:mb-3 text-white">
                Organizational <span className="text-[#FFB81C]">Objectives</span>
              </h2>
              <p className="text-stone-400 max-w-2xl mx-auto font-light italic text-sm md:text-base lg:text-lg">
                💡 Ideas + ⚙️ Collective Action = 📈 Community Growth
              </p>
            </div>

            {organizationalImage && (
              <div className="mb-8 md:mb-12">
                <div className="relative w-full bg-stone-900/50 rounded-lg overflow-hidden">
                  <Image
                    src={organizationalImage}
                    alt="UBFSF Organizational Goals and Initiatives"
                    width={1200}
                    height={600}
                    className="w-full h-auto object-contain"
                    sizes="(max-width: 768px) 100vw, 1200px"
                  />
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {objectives.map((obj, index) => (
                <div key={index} className="group bg-stone-900/50 p-4 md:p-6 lg:p-8 rounded-sm border-l-4 border-[#FFB81C]/30 hover:border-[#FFB81C] hover:bg-stone-800/50 transition-all duration-300 hover:-translate-y-1">
                  <h3 className="text-sm md:text-base lg:text-xl font-bold mb-1 md:mb-2 text-white group-hover:text-[#FFB81C] transition-colors">
                    {obj.title}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-stone-400 leading-relaxed">
                    {obj.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== DONATE ===== */}
      {donationItems.length > 0 && (
        <section 
          className="py-12 md:py-16 lg:py-24 px-4 sm:px-6 md:px-12 lg:px-20 bg-cover bg-center bg-no-repeat relative"
          style={{ 
            backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/95 to-white/90 dark:from-black/90 dark:via-black/95 dark:to-black/90" />
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-6 md:mb-8 lg:mb-12">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tighter mb-3 md:mb-4 text-black dark:text-white">
                {donateTitle || "Empower Communities Through Education & Opportunity"}
              </h2>
              <div className="w-10 md:w-16 h-0.5 bg-[#FFB81C] mx-auto mb-4 md:mb-6" />
              <p className="text-sm md:text-base lg:text-lg text-stone-600 dark:text-stone-300 max-w-3xl mx-auto leading-relaxed">
                {donateDescription || "Every donation directly supports our mission-driven programs that empower underserved communities and foster lasting change."}
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-12 items-center">
              <div className="flex-1 w-full">
                <h3 className="text-base md:text-lg lg:text-2xl font-bold mb-3 md:mb-4 text-black dark:text-white">
                  How Your Donation Makes a Difference
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  {donationItems.map((item, index) => (
                    <div key={index} className="bg-white/80 dark:bg-stone-800/80 backdrop-blur-sm p-3 md:p-4 lg:p-6 rounded-sm border border-black/5 dark:border-white/5 hover:shadow-lg hover:border-[#FFB81C]/30 transition-all duration-300 group">
                      <div className="w-4 md:w-6 lg:w-8 h-0.5 bg-[#FFB81C] mb-1 md:mb-2 group-hover:w-6 md:group-hover:w-8 lg:group-hover:w-12 transition-all duration-300" />
                      <h4 className="font-bold text-xs sm:text-sm md:text-base text-black dark:text-white">{item}</h4>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="lg:w-1/3 flex flex-col items-center w-full">
                {logoImage && (
                  <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 mb-4 md:mb-6">
                    <Image
                      src={logoImage}
                      alt="UBFSF Logo"
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 128px, (max-width: 1024px) 160px, 192px"
                    />
                  </div>
                )}
                <Link 
                  href="http://bit.ly/1Dy14yX" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full px-6 md:px-8 lg:px-12 py-3 md:py-4 lg:py-5 bg-[#FFB81C] text-black text-center text-[9px] md:text-[10px] lg:text-xs font-black uppercase tracking-widest hover:bg-yellow-500 transition-all rounded-sm"
                >
                  Donate Now
                </Link>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-3 md:mt-4 text-center">
                  We are committed to transparency and impact.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== FOUNDER ===== */}
      {founderMessage && (
        <section className="py-12 md:py-16 lg:py-24 px-4 sm:px-6 md:px-12 lg:px-20 bg-white dark:bg-[#0a0a0a]">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-16 items-center">
              <div className="order-last lg:order-none">
                <span className="inline-block text-[#FFB81C] text-[7px] md:text-[8px] lg:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] lg:tracking-[0.3em] mb-2 md:mb-3">
                  A Word From Our Founder
                </span>
                <div className="w-8 md:w-12 h-0.5 bg-[#FFB81C] mb-3 md:mb-4" />
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter mb-3 md:mb-4 text-black dark:text-white">
                  A Word From <span className="text-[#FFB81C]">{founderName || 'Ivan Kilgore'}</span>
                </h2>
                <div className="text-sm sm:text-base md:text-lg text-stone-600 dark:text-stone-300 leading-relaxed space-y-3 md:space-y-4 whitespace-pre-line">
                  {founderMessage}
                </div>
                <Link 
                  href="/about/ivan-kilgore" 
                  className="inline-block mt-4 md:mt-6 lg:mt-8 px-5 md:px-6 lg:px-8 py-2.5 md:py-3 lg:py-3.5 bg-[#FFB81C] text-black text-[9px] md:text-[10px] lg:text-xs font-black uppercase tracking-widest hover:bg-yellow-500 transition-all rounded-sm"
                >
                  Meet Ivan
                </Link>
              </div>
              {founderImage && (
                <div className="relative aspect-[4/5] rounded-sm overflow-hidden bg-stone-200 dark:bg-stone-800 shadow-xl max-w-sm mx-auto lg:max-w-none w-full">
                  <Image
                    src={founderImage}
                    alt="Ivan Kilgore - Founder"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ===== LATEST NEWS ===== */}
      <section className="py-12 md:py-16 lg:py-24 px-4 sm:px-6 md:px-12 lg:px-20 bg-stone-50 dark:bg-[#141414]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 md:mb-8 lg:mb-12">
            <div>
              <span className="inline-block text-[#FFB81C] text-[7px] md:text-[8px] lg:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] lg:tracking-[0.3em] mb-1 md:mb-2">
                Latest Updates
              </span>
              <div className="w-8 md:w-12 h-0.5 bg-[#FFB81C] mb-2 md:mb-3" />
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-black uppercase tracking-tighter text-black dark:text-white">
                From the <span className="text-[#FFB81C]">Newsroom</span>
              </h2>
            </div>
            <Link 
              href="/blog" 
              className="text-[8px] md:text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-[#FFB81C] border-b-2 border-[#FFB81C] hover:opacity-70 transition-opacity whitespace-nowrap"
            >
              View All News →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                <article className="bg-white dark:bg-[#0a0a0a] rounded-sm border border-black/5 dark:border-white/5 overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] h-full flex flex-col">
                  {post.image && (
                    <div className="relative w-full h-40 md:h-48 lg:h-56 overflow-hidden bg-stone-200 dark:bg-stone-800">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-3 md:p-4 lg:p-6 flex flex-col flex-grow">
                    <time className="text-[7px] md:text-[8px] lg:text-[10px] font-bold uppercase tracking-widest text-[#FFB81C] mb-1 md:mb-2">
                      {new Date(post.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </time>
                    <h3 className="text-sm md:text-base lg:text-xl font-bold tracking-tight mb-1 md:mb-2 text-black dark:text-white group-hover:text-[#FFB81C] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <div 
                      className="text-xs md:text-sm text-stone-500 dark:text-stone-400 leading-relaxed line-clamp-3 flex-grow"
                      dangerouslySetInnerHTML={{ __html: post.excerpt }} 
                    />
                    <span className="inline-block mt-2 md:mt-3 lg:mt-4 text-[7px] md:text-[8px] lg:text-[10px] font-bold uppercase tracking-widest text-[#FFB81C] group-hover:underline">
                      Read More →
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-12 lg:px-20 bg-black text-white text-center">
        <div className="max-w-4xl mx-auto">
          <div className="w-10 md:w-16 h-0.5 bg-[#FFB81C] mx-auto mb-4 md:mb-6" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-black uppercase tracking-tighter mb-3 md:mb-4 text-white">
            Join Us in <span className="text-[#FFB81C]">Rebuilding</span> Community
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-white/60 max-w-2xl mx-auto mb-4 md:mb-6 font-light px-2">
            Together, we can create lasting change and build a brighter future for all.
          </p>
          <div className="flex flex-wrap gap-3 md:gap-4 justify-center">
            <Link 
              href="/donate" 
              className="px-5 md:px-8 lg:px-10 py-2.5 md:py-3 lg:py-4 bg-[#FFB81C] text-black text-[9px] md:text-[10px] lg:text-xs font-black uppercase tracking-widest hover:bg-yellow-500 transition-all rounded-sm"
            >
              Donate Now
            </Link>
            <Link 
              href="/contact" 
              className="px-5 md:px-8 lg:px-10 py-2.5 md:py-3 lg:py-4 border border-white/30 text-white text-[9px] md:text-[10px] lg:text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all rounded-sm"
            >
              Get Involved
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}