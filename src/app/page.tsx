// src/app/page.tsx
import Image from "next/image";
import Link from "next/link";
import { getPosts } from '@/lib/wordpress';
import { getPageBySlug } from '@/lib/wordpress/pages';

// ISR: re-render this page at most every 60 seconds
export const revalidate = 60;

// Canonical donation URL (Give Lively) - replaces the legacy bit.ly link
export const DONATE_URL =
  'https://secure.givelively.org/donate/united-black-family-scholarship-foundation';

import Hero from '@/components/home/Hero';
import AnnouncementBar from '@/components/home/AnnouncementBar';
import UBFSFDefinition from '@/components/home/UBFSFDefinition';
import Testimonial from '@/components/home/Testimonial';
import Objectives from '@/components/home/Objectives';
import FounderSection from '@/components/home/Founder';
import FinalCTA from '@/components/home/FinalCTA';

function parseHomeContent(content: string) {
  // First pass: clean HTML entities
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
  let donationBulletPoints: { title: string; description: string }[] = [];

  // Extract Video URL
  const videoMatch = cleanContent.match(/src="([^"]*ivan-headspin[^"]*)"/);
  if (videoMatch) {
    videoUrl = videoMatch[1];
  }

  // Extract Mission Text - more flexible pattern
  const missionMatch = cleanContent.match(/Our mission at the United Black Family Scholarship Foundation[\s\S]*?<\/span><\/p>/i);
  if (missionMatch) {
    mission = missionMatch[0]
      .replace(/<[^>]*>/g, '')
      .replace(/&#822[01];/g, '"')
      .replace(/&#8217;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Extract Malcolm X Quote - from et_pb_testimonial content
  const quoteMatch = cleanContent.match(/<div class="et_pb_testimonial_content">([\s\S]*?)<\/div>/);
  if (quoteMatch) {
    quote = quoteMatch[1]
      .replace(/<[^>]*>/g, '')
      .replace(/&#822[01];/g, '"')
      .replace(/&#8217;/g, "'")
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/^["\u201c]+/, '')
      .replace(/["\u201d]+$/, '');
  }

  // Extract Vision — strip stray/unbalanced quote artifacts from WordPress text
  const visionMatch = cleanContent.match(/We envision a world[\s\S]*?<\/span><\/p>/i);
  if (visionMatch) {
    vision = visionMatch[0]
      .replace(/<[^>]*>/g, '')
      .replace(/&#822[01];/g, '"')
      .replace(/&#8217;/g, "'")
      .replace(/\s+/g, ' ')
      .replace(/^["“”']+|["“”']+$/g, '')
      .trim();
  }

  // ===== FOUNDER SECTION: compute bounds once =====
  // From the "A Word From Our Founder" heading to the next Divi section
  let founderSection = '';
  const founderSectionIdx = cleanContent.indexOf('A Word From Our Founder');
  if (founderSectionIdx > -1) {
    const nextSectionIdx = cleanContent.indexOf('et_pb_section', founderSectionIdx + 30);
    founderSection = cleanContent.substring(
      founderSectionIdx,
      nextSectionIdx > -1 ? nextSectionIdx : founderSectionIdx + 12000
    );
  }

  // Extract Founder Image - first <img> inside the founder section
  // (filename-agnostic: works with any WordPress upload, e.g. Screenshot-2025-01-24-at-22.11.12.png)
  // Returns '' when not found so callers can fall back to static pages.json data
  const founderImgMatch = founderSection.match(/<img[^>]+src="([^"]+)"/i);
  founderImage = founderImgMatch ? founderImgMatch[1] : '';

  // Extract Founder Name - from Divi heading title_suffix (e.g. title_suffix=" | Ivan Kilgore")
  const founderNameMatch = cleanContent.match(/title_suffix="[^"]*\|\s*([^"]+)"/i);
  founderName = founderNameMatch ? founderNameMatch[1].trim() : 'Ivan Kilgore';

  // Extract Logo Image
  const logoMatch = cleanContent.match(/src="([^"]*UBFSF-logo[^"]*\.(jpg|jpeg|png|webp))/i);
  if (logoMatch) {
    logoImage = logoMatch[1];
  }

  // Extract Background Image
  const bgMatch = cleanContent.match(/background-image[^:]*:[^u]*url\(["']?([^"')]*)/i);
  if (bgMatch) {
    backgroundImage = bgMatch[1];
  }

  // Extract Organizational Chart Image
  const orgMatch = cleanContent.match(/src="([^"]*ubfsf-brand_goals-initiatives[^"]*\.(jpg|jpeg|png|webp))/i);
  if (orgMatch) {
    organizationalImage = orgMatch[1];
  }

  // Extract Founder Message - harvest ALL paragraphs in the founder section
  // until the next Divi section (no fixed 3000-char window / slice count)
  if (founderSection) {
    const paragraphs = founderSection.match(/<p[\s\S]*?<\/p>/g);
    if (paragraphs && paragraphs.length > 0) {
      founderMessage = paragraphs
        .map(p =>
          p
            .replace(/<[^>]*>/g, '')
            .replace(/&#822[01];/g, '"')
            .replace(/&#8217;/g, "'")
            .replace(/&nbsp;/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
        )
        // Filter: skip short fragments and heading-like paragraphs
        .filter(text => text.length >= 30 && !/^[A-Z0-9\s&'.,-]+$/.test(text))
.join('\n\n');
    }
  }

  // Extract Donation Items with better parsing
  const donateListMatch = cleanContent.match(/<ul>([\s\S]*?)<\/ul>/);
  if (donateListMatch) {
    const items = donateListMatch[1].match(/<li[^>]*>([\s\S]*?)<\/li>/g);
    if (items) {
      donationBulletPoints = items.map(item => {
        const cleanItem = item.replace(/<[^>]*>/g, '').trim();
        const parts = cleanItem.split(':');
        if (parts.length >= 2) {
          const title = parts[0].trim();
          const description = parts.slice(1).join(':').trim();
          return { title, description };
        }
        return { title: cleanItem, description: '' };
      });
      donationItems = donationBulletPoints.map(item =>
        item.description ? `${item.title}: ${item.description}` : item.title
      );
    }
  }

  // Extract Objectives - only real data from WordPress (Divi text modules following
  // an "Objectives" heading). No invented content: if WP has none, section is hidden.
  let objectivesFormula = '';
  const objectivesHeadingIdx = cleanContent.search(/UBFSF Organizational Objectives|Organizational Objectives/i);
  if (objectivesHeadingIdx > -1) {
    const afterHeading = cleanContent.slice(objectivesHeadingIdx);
    // Extract formula heading like 💡 Ideas + ⚙️ Collective Action = 📈 Community Growth
    const formulaMatch = afterHeading.match(/<span class="prefix">([\s\S]*?💡[\s\S]*?)<\/span>/);
    if (formulaMatch) {
      objectivesFormula = formulaMatch[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    }
    const objModules = [...afterHeading.matchAll(/et_pb_text_inner[\s\S]*?<p>([\s\S]*?)<\/p>/g)];
    objectives = objModules
      .map(m => {
        const html = m[1];
        const titleMatch = html.match(/<(strong|b)>([\s\S]*?)<\/(strong|b)>/i);
        const title = titleMatch
          ? titleMatch[2].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
          : '';
        const desc = html
          .replace(/<[^>]*>/g, ' ')
          .replace(/\s+/g, ' ')
          .replace(title, '')
          .replace(/["“”]+/g, '')
          .trim();
        return { title, description: desc };
      })
      .filter(o => o.title);
  }

  // Extract Donate Section Title
  const donateTitleMatch = cleanContent.match(/Empower Communities Through Education.*?<\/h[1-4]>/i);
  if (donateTitleMatch) {
    donateTitle = donateTitleMatch[0]
      .replace(/<[^>]*>/g, '')
      .trim();
  }

  // Extract Donate Description — first clean paragraph only (prevents run-on
  // text bleeding into the raw initiative list; e.g. '"Donate" "UBFSF 💡 Expand...')
  const donateDescMatch = cleanContent.match(/Every donation[\s\S]*?<\/span><\/p>/i);
  if (donateDescMatch) {
    donateDescription = donateDescMatch[0]
      .replace(/<[^>]*>/g, '')
      .replace(/&#822[01];/g, '"')
      .replace(/&#8217;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
    // Cut everything from the first stray quote / emoji bullet onward
    const cutIdx = donateDescription.search(/["“”💡⚙️📈]/u);
    if (cutIdx > 40) donateDescription = donateDescription.slice(0, cutIdx).trim();
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
    objectivesFormula,
    donateTitle,
    donateDescription,
    logoImage,
    backgroundImage,
    organizationalImage,
    founderName,
    donationBulletPoints
  };
}

export default async function HomePage() {
  const [pageData, posts] = await Promise.all([
    getPageBySlug('home'),
    getPosts(6)
  ]);

  // Static fallback data (manual WP export) - used when the live API content
  // is missing sections (e.g. the live homepage currently omits the founder section)
  const staticPages = (await import('@/data/pages.json')).default as { slug?: string; content?: string }[];
  const staticContent =
    staticPages.find(p => p.slug?.startsWith('empower-communities'))?.content ?? '';

  const emptyParsed = {
    mission: '', 
    quote: '', 
    vision: '', 
    founderMessage: '', 
    founderImage: '', 
    donationItems: [] as string[],
    videoUrl: '',
    objectives: [] as { title: string; description: string }[],
    objectivesFormula: '',
    donateTitle: '',
    donateDescription: '',
    logoImage: '',
    backgroundImage: '',
    organizationalImage: '',
    founderName: 'Ivan Kilgore',
    donationBulletPoints: [] as { title: string; description: string }[]
  };

  // Primary: live WordPress REST API content. Fallback: static pages.json export.
  const parsed = parseHomeContent(pageData?.content ?? staticContent);
  let {
    mission, quote, vision, donationItems,
    videoUrl, objectives, objectivesFormula, donateTitle, donateDescription, logoImage,
    backgroundImage, organizationalImage, founderName, donationBulletPoints
  } = pageData ? parsed : { ...emptyParsed, ...parsed };
  let { founderMessage, founderImage } = pageData ? parsed : { ...emptyParsed, ...parsed };

  // Merge: fill founder + objectives + image fields missing from live content from the static export
  if (!founderMessage || !founderImage || founderName === 'Ivan Kilgore' || objectives.length === 0 || !organizationalImage) {
    const staticParsed = staticContent && staticContent !== (pageData?.content ?? '')
      ? parseHomeContent(staticContent)
      : null;
    if (staticParsed) {
      if (!founderMessage) founderMessage = staticParsed.founderMessage;
      if (!founderImage) founderImage = staticParsed.founderImage;
      if (objectives.length === 0 && staticParsed.objectives.length > 0) objectives = staticParsed.objectives;
      if (!organizationalImage && staticParsed.organizationalImage) {
        organizationalImage = staticParsed.organizationalImage.replace(/&#038;/g, '&');
      }
      if (!objectivesFormula && staticParsed.objectivesFormula) {
        objectivesFormula = staticParsed.objectivesFormula;
      }
    }
  }

  // Ensure objectives always shows three items
  if (objectives.length < 3) {
    const staticParsed = staticContent
      ? parseHomeContent(staticContent)
      : null;
    if (staticParsed && staticParsed.objectives.length >= 3) {
      objectives = staticParsed.objectives.slice(0, 3);
    }
  }

  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0a] text-black dark:text-[#f4f4f4] transition-colors duration-300 font-sans selection:bg-[#D4A017]/30">
      
      {/* ===== OSCAR ANNOUNCEMENT BAR ===== */}
      <AnnouncementBar />

      {/* ===== HERO VIDEO ===== */}
      <Hero videoUrl={videoUrl} />

      {/* ===== UBFSF: WHAT IT STANDS FOR ===== */}
      <UBFSFDefinition />

      {/* ===== MISSION (single centered column) ===== */}
      {mission && (
        <section className="py-14 md:py-20 px-4 sm:px-6 md:px-12 lg:px-20 bg-black text-white">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 text-[#D4A017] text-[10px] md:text-[11px] lg:text-xs font-bold uppercase tracking-[0.2em] mb-4 md:mb-6 justify-center">
              <div className="w-2.5 md:w-3 h-px bg-[#D4A017]" />
              Mission Statement
              <div className="w-2.5 md:w-3 h-px bg-[#D4A017]" />
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 md:mb-8 text-white">
              Our <span className="text-[#D4A017]">Mission</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-stone-300 leading-relaxed font-light">
              {mission}
            </p>
          </div>
        </section>
      )}


      {/* ===== QUOTE / TESTIMONIAL ===== */}
      <Testimonial quote={quote} author="Malcolm X" />
      {/* ===== VISION (own section after the quotecurrent) ===== */}
      {vision && (
        <section className="py-16 md:py-24 lg:py-32 px-4 sm:px-6 md:px-12 lg:px-20 bg-[#f4f4f4] dark:bg-[#1a1a1a]">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 text-[#D4A017] text-[10px] md:text-[11px] lg:text-xs font-bold uppercase tracking-[0.2em] mb-4 md:mb-6 justify-center">
              <div className="w-2.5 md:w-3 h-px bg-[#D4A017]" />
              Vision
              <div className="w-2.5 md:w-3 h-px bg-[#D4A017]" />
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 md:mb-8 text-black dark:text-white">
              Our <span className="text-[#D4A017]">Vision</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-stone-700 dark:text-stone-300 leading-relaxed font-light">
              {vision}
            </p>
          </div>
        </section>
      )}


      {/* Vision now lives in the Who We Are section (removed duplicate) */}

      {/* ===== DONATE ===== */}
      {donationItems.length > 0 && (
        <section 
          className="py-16 md:py-24 lg:py-32 px-4 sm:px-6 md:px-12 lg:px-20 bg-white dark:bg-[#0a0a0a]"
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10 md:mb-14 lg:mb-16">
              <span className="inline-flex items-center gap-2 text-[#D4A017] text-[10px] md:text-[11px] lg:text-xs font-bold uppercase tracking-[0.2em] mb-4 md:mb-6 justify-center">
                <div className="w-2.5 md:w-3 h-px bg-[#D4A017]" />
                Make an Impact
                <div className="w-2.5 md:w-3 h-px bg-[#D4A017]" />
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight mb-6 text-black dark:text-white">
                {donateTitle || "How Your Gift Creates Change"}
              </h2>
              <p className="text-base md:text-lg lg:text-xl text-stone-700 dark:text-stone-300 max-w-3xl mx-auto leading-relaxed font-light">
                {donateDescription ? donateDescription.slice(0, 220) + (donateDescription.length > 220 ? '…' : '') : "Your gift funds education, leadership training and community programs that create lasting change."}
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {donationBulletPoints && donationBulletPoints.length > 0 ? (
                  donationBulletPoints.map((item, index) => (
                    <div key={index} className="bg-white/70 dark:bg-stone-800/70 backdrop-blur-sm p-5 md:p-6 rounded-lg border-l-4 border-[#D4A017] hover:shadow-md transition-all duration-300">
                      <h4 className="font-bold text-sm md:text-base lg:text-lg text-black dark:text-white mb-2">
                        <span className="text-[#D4A017] text-lg mr-3">→</span>{item.title}
                      </h4>
                      {item.description && (
                        <p className="text-xs md:text-sm lg:text-base text-stone-700 dark:text-stone-300 leading-relaxed ml-7">
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))
                ) : donationItems && donationItems.length > 0 ? (
                  donationItems.map((item, index) => (
                    <div key={index} className="bg-white/70 dark:bg-stone-800/70 backdrop-blur-sm p-5 md:p-6 rounded-lg border-l-4 border-[#D4A017] hover:shadow-md transition-all duration-300">
                      <h4 className="font-bold text-sm md:text-base lg:text-lg text-black dark:text-white">
                        <span className="text-[#D4A017] text-lg mr-3">→</span>{item}
                      </h4>
                    </div>
                  ))
                ) : null}
              </div>

              {/* Program callout: Nonprofit Coaching & Leadership Training Conference */}
              <div className="mt-10 md:mt-12">
                <Link
                  href="/programs/nonprofit-conference"
                  className="group block bg-white/80 dark:bg-white/5 backdrop-blur-sm p-5 md:p-6 rounded-lg border-l-4 border-[#D4A017] hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start gap-3 md:gap-4">
                    <span className="text-[#D4A017] text-2xl leading-none mt-0.5">▸</span>
                    <div>
                      <h4 className="text-sm md:text-base font-bold text-black dark:text-white group-hover:text-[#D4A017] transition-colors">
                        Nonprofit Coaching & Leadership Training Conference
                      </h4>
                      <p className="text-xs md:text-sm text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">
                        Empowering incarcerated citizens to become nonprofit leaders through workshops, panel discussions, and university partnerships.
                      </p>
                      <span className="inline-block text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] text-[#D4A017] mt-2 group-hover:underline">
                        Learn More →
                      </span>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="flex flex-col items-center mt-10 md:mt-12">
                {logoImage && (
                  <div className="relative w-32 h-32 md:w-40 md:h-40 mb-6">
                    <Image
                      src={logoImage}
                      alt="UBFSF Logo"
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 128px, 160px"
                    />
                  </div>
                )}
                <Link 
                  href={DONATE_URL} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-6 md:px-8 lg:px-10 py-4 md:py-5 lg:py-6 bg-[#D4A017] text-black text-center font-black uppercase text-sm md:text-base tracking-[0.15em] hover:bg-[#B98A2D] transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 mb-4 md:mb-6"
                >
                  Make a Donation
                </Link>
                <p className="text-xs md:text-sm text-stone-600 dark:text-stone-400 text-center">
                  Secure online giving • Monthly & one-time gifts accepted
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== UBFSF ORGANIZATIONAL OBJECTIVES (24–60 Month Goals) ===== */}
      <Objectives
        objectives={objectives}
        formula={objectivesFormula || "💡 Ideas + ⚙️ Collective Action = 📈 Community Growth"}
        image={organizationalImage}
      />

      {/* ===== FOUNDER ===== */}
      <FounderSection name={founderName} message={founderMessage} image={founderImage} />

      {/* ===== LATEST NEWS ===== */}
      <section className="py-16 md:py-24 lg:py-32 px-4 sm:px-6 md:px-12 lg:px-20 bg-[#f4f4f4] dark:bg-[#1a1a1a]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 md:mb-16 lg:mb-20">
            <div>
              <span className="inline-flex items-center gap-2 text-[#D4A017] text-[10px] md:text-[11px] lg:text-xs font-bold uppercase tracking-[0.2em] mb-4 md:mb-6">
                <div className="w-2.5 md:w-3 h-px bg-[#D4A017]" />
                Latest Updates
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-black dark:text-white">
                From the <br className="hidden sm:inline"/><span className="text-[#D4A017]">Newsroom</span>
              </h2>
            </div>
            <Link 
              href="/blog" 
              className="text-sm md:text-base font-bold uppercase tracking-[0.15em] text-[#D4A017] border-b-2 border-[#D4A017] hover:text-[#B98A2D] hover:border-[#B98A2D] transition-all duration-300 whitespace-nowrap pb-1"
            >
              View All News →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            {/* Only show posts that have a preview image — keeps the grid even */}
            {posts.filter((post) => post.image).slice(0, 8).map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                <article className="bg-white dark:bg-[#0a0a0a] rounded-lg border border-black/5 dark:border-white/5 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] h-full flex flex-col">
                  {post.image && (
                    <div className="relative w-full h-48 md:h-56 lg:h-64 overflow-hidden bg-stone-200 dark:bg-stone-800">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-5 md:p-6 lg:p-7 flex flex-col flex-grow">
                    <time className="text-[9px] md:text-[10px] lg:text-xs font-bold uppercase tracking-[0.15em] text-[#D4A017] mb-3 md:mb-4">
                      {new Date(post.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </time>
                    <h3 className="text-base md:text-lg lg:text-xl font-bold tracking-tight mb-3 md:mb-4 text-black dark:text-white group-hover:text-[#D4A017] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <div 
                      className="text-sm md:text-base text-stone-600 dark:text-stone-400 leading-relaxed line-clamp-3 flex-grow mb-4 md:mb-5"
                      dangerouslySetInnerHTML={{ __html: post.excerpt }} 
                    />
                    <span className="inline-block text-[9px] md:text-[10px] lg:text-xs font-bold uppercase tracking-[0.15em] text-[#D4A017] group-hover:underline">
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
      <FinalCTA donateUrl={DONATE_URL} />
    </main>
  );
}
