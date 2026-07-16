import Image from "next/image";
import Link from "next/link";
import { getPageBySlug } from "@/lib/wordpress/pages";
import { getWpImageUrl } from "@/lib/wordpress/client";

// Decode HTML entities that come from WordPress
function decodeEntities(str: string): string {
  return str
    .replace(/&#8221;/g, '"')
    .replace(/&#8243;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#038;/g, "&")
    .replace(/&#8220;/g, '"')
    .replace(/&#8230;/g, "…")
    .replace(/&#160;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–");
}

// Helper function to clean HTML content and extract structured data
function extractContentFromWordPress(rawContent: string) {
  const content = decodeEntities(rawContent);

  const textMatches = content.match(/<p>(.*?)<\/p>/g) || [];
  const textContent = textMatches
    .map(p => p.replace(/<[^>]+>/g, '').trim())
    .filter(Boolean);

  const listMatches = content.match(/<li[^>]*>(.*?)<\/li>/g) || [];
  const listItems = listMatches
    .map(li => li.replace(/<[^>]+>/g, '').trim())
    .filter(Boolean);

  const sections = [
    ...content.matchAll(/title_suffix="([^"]+)"/g),
  ].map(m => m[1]);

  const imageUrls = [
    ...content.matchAll(/src="([^"]+\.(?:jpg|jpeg|png|webp))/gi),
  ].map(m => m[1]);

  let videoUrl: string | null = null;
  const videoMatch = content.match(
    /src="https?:\/\/(?:www\.)?(?:youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/)([^"?&]+)/i
  );
  if (videoMatch) {
    videoUrl = `https://www.youtube.com/embed/${videoMatch[1]}`;
  }

  const bookTitles: string[] = [];
  const bookImages: string[] = [];
  
  const bookSectionRegex = /dg_adh_heading[^>]*title_suffix="([^"]*)"[^>]*>[\s\S]*?et_pb_image[^>]*src="([^"]*\.(jpg|jpeg|png))"/g;
  let bookMatch;
  while ((bookMatch = bookSectionRegex.exec(content)) !== null) {
    if (bookMatch[1] && bookMatch[2]) {
      const title = bookMatch[1];
      if (title.includes('No Rhyme') || title.includes('Social Justice') || title.includes('Kill the Bastard')) {
        bookTitles.push(title);
        bookImages.push(bookMatch[2]);
      }
    }
  }

  if (bookTitles.length === 0) {
    const fallbackRegex = /title_suffix="([^"]*)"[^>]*>[\s\S]*?src="([^"]*\.(jpg|jpeg|png))"/g;
    let fallbackMatch;
    while ((fallbackMatch = fallbackRegex.exec(content)) !== null) {
      if (fallbackMatch[1] && fallbackMatch[2]) {
        const title = fallbackMatch[1];
        if (title.includes('No Rhyme') || title.includes('Social Justice') || title.includes('Kill the Bastard')) {
          bookTitles.push(title);
          bookImages.push(fallbackMatch[2]);
        }
      }
    }
  }

  return {
    textContent,
    listItems,
    sections,
    imageUrls,
    videoUrl,
    bookTitles,
    bookImages,
  };
}

export default async function HundredStoriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const page = await getPageBySlug("hundred-stories-project");

  if (!page) {
    return <main className="p-20 min-h-screen bg-white dark:bg-[#1a1a1a] text-black dark:text-white">Loading...</main>;
  }

  const content = page.content || '';
  const extracted = extractContentFromWordPress(content);

  const heroTitle = page.title || "Hundred Stories Project";
  
  const mainDescription = extracted.textContent[0] || "";
  const givingVoiceContent = extracted.textContent.slice(1, 3).join(" ");
  const expandingPerspectivesContent = extracted.textContent.slice(3, 5).join(" ");
  const whyItMattersContent = extracted.textContent.slice(5, 8).join(" ");
  const keyComponents = extracted.listItems.slice(0, 3);
  const whyItMattersItems = extracted.listItems.slice(3, 6);

  const books = [
    { 
      title: extracted.bookTitles[0] || 'No Rhyme or Reason', 
      img: extracted.bookImages[0] || 'https://ubfsf.org/wp-content/uploads/2024/10/no_rhyme_no_reason-1.jpg' 
    },
    { 
      title: extracted.bookTitles[1] || 'Social Justice Autobiographies', 
      img: extracted.bookImages[1] || 'https://ubfsf.org/wp-content/uploads/2024/10/socialjusticeautobiographies_cover-scaled-1.jpg' 
    },
    { 
      title: extracted.bookTitles[2] || 'Kill the Bastard', 
      img: extracted.bookImages[2] || 'https://ubfsf.org/wp-content/uploads/2024/10/kill_the_bastard-scaled-1.jpg' 
    }
  ];

  const pillars = [
    {
      icon: "✍️",
      title: "Write",
      description: "Empowering incarcerated individuals to share their stories through a self-taught writing curriculum."
    },
    {
      icon: "📚",
      title: "Publish",
      description: "Transforming personal narratives into published manuscripts and anthologies that reach the world."
    },
    {
      icon: "🌍",
      title: "Transform",
      description: "Changing perspectives and inspiring solutions to systemic issues in the carceral ecosystem."
    }
  ];

  function getImageUrl(imagePath: string, fallback: string): string {
    if (!imagePath) return fallback;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    try {
      const url = getWpImageUrl(imagePath);
      return url || fallback;
    } catch {
      return fallback;
    }
  }

  return (
    <main className="bg-white dark:bg-[#1a1a1a] text-black dark:text-[#f4f4f4] min-h-screen font-serif">
      
      {/* HERO SECTION - With "Unsung Voices" */}
      <section className="relative bg-black dark:bg-[#0a0a0a] text-white py-24 md:py-32 px-6 md:px-20 overflow-hidden">
        {/* Background pattern - layered handwritten excerpts effect */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 text-4xl font-serif italic text-white/20 rotate-[-5deg]">✍️</div>
          <div className="absolute bottom-20 right-20 text-6xl font-serif italic text-white/20 rotate-[15deg]">📝</div>
          <div className="absolute top-1/2 left-1/4 text-5xl font-serif italic text-white/20 rotate-[8deg]">✒️</div>
          <div className="absolute bottom-1/3 right-1/3 text-3xl font-serif italic text-white/20 rotate-[-12deg]">📖</div>
          {/* Subtle handwritten line pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cGF0aCBkPSJNMzAgMzBhMTAgMTAgMCAwIDEgMjAgMCAxMCAxMCAwIDAgMS0yMCAweiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjAuNSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] bg-repeat opacity-20"></div>
        </div>
        
        <div className="relative max-w-5xl mx-auto text-center">
          {/* Gold accent badge */}
          <div className="inline-block bg-[#FFB81C] text-black px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
            Unsung Voices
          </div>
          
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter mb-6 leading-[1.1] text-white">
            {heroTitle}
          </h1>
          <div className="w-20 h-1 bg-[#FFB81C] mx-auto mb-8"></div>
          
          {/* Updated tagline */}
          <p className="text-xl md:text-2xl text-stone-300 max-w-3xl mx-auto leading-relaxed font-light">
            "Amplifying the voices that have been silenced. One story at a time."
          </p>
          
          <div className="mt-10 flex gap-4 justify-center flex-wrap">
            <a 
              href="https://zomedia.netlify.app/about/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-[#FFB81C] text-black px-10 py-4 text-sm font-bold uppercase tracking-wider hover:bg-[#e6a500] transition-all duration-300"
            >
              Learn More About Zo Media
            </a>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 md:px-20 py-16 md:py-24">

        {/* GIVING VOICE SECTION */}
        <section className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <div className="inline-block text-[#FFB81C] text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              — Giving Voice
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black dark:text-white leading-tight">
              Giving Voice to the <br />
              <span className="text-[#FFB81C]">Voiceless</span>
            </h2>
            <div className="w-16 h-1 bg-[#FFB81C] mb-6"></div>
            <p className="text-base leading-relaxed text-stone-700 dark:text-stone-300 mb-4">
              {givingVoiceContent || mainDescription}
            </p>
            {keyComponents.length > 0 && (
              <div className="mt-6 space-y-2">
                {keyComponents.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="text-[#FFB81C] font-bold text-lg">✦</span>
                    <span className="text-sm text-stone-700 dark:text-stone-300" dangerouslySetInnerHTML={{ __html: item }} />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="relative aspect-[4/3] w-full bg-stone-100 dark:bg-[#2a2a2a] overflow-hidden shadow-xl">
            {extracted.imageUrls.length > 0 && (
              <Image 
                src={getImageUrl(extracted.imageUrls[0], "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80")} 
                alt="Hundred Stories Bookshelf" 
                fill 
                className="object-cover hover:scale-105 transition-transform duration-700" 
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
          </div>
        </section>

        {/* THREE PILLARS SECTION */}
        <section className="mb-24">
          <div className="text-center mb-16">
            <div className="inline-block text-[#FFB81C] text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              — Our Foundation
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black dark:text-white">
              Our Three Pillars
            </h2>
            <div className="w-16 h-1 bg-[#FFB81C] mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {pillars.map((pillar, index) => (
              <div 
                key={index} 
                className="bg-stone-50 dark:bg-[#222222] p-8 text-center border border-stone-200 dark:border-stone-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-5xl mb-4">{pillar.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-black dark:text-white">{pillar.title}</h3>
                <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* EXPANDING PERSPECTIVES WITH VIDEO */}
        <section className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <div className="order-2 md:order-1">
            <div className="inline-block text-[#FFB81C] text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              — Multimedia Storytelling
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black dark:text-white leading-tight">
              Expanding Perspectives <br />
              <span className="text-[#FFB81C]">Through Storytelling</span>
            </h2>
            <div className="w-16 h-1 bg-[#FFB81C] mb-6"></div>
            <p className="text-base leading-relaxed text-stone-700 dark:text-stone-300 mb-4">
              {expandingPerspectivesContent}
            </p>
            <p className="text-sm text-stone-600 dark:text-stone-400">
              Supported by the American Council of Learned Societies, Lenski Covey Foundation, 
              and the Center for Changing Systems of Power at SBU.
            </p>
          </div>
          <div className="relative aspect-video w-full bg-stone-100 dark:bg-[#2a2a2a] overflow-hidden shadow-xl order-1 md:order-2">
            {extracted.videoUrl ? (
              <iframe
                src={extracted.videoUrl}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                title="Hundred Stories Project Video"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-stone-200 dark:bg-[#333333]">
                <div className="w-20 h-20 rounded-full bg-[#FFB81C]/20 flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-[#FFB81C]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <p className="text-stone-500 dark:text-stone-400 font-medium">Video Coming Soon</p>
                <p className="text-sm text-stone-400 dark:text-stone-500 mt-1">Watch this space for updates</p>
              </div>
            )}
          </div>
        </section>

        {/* FEATURED WORKS */}
        <section className="mb-24">
          <div className="text-center mb-16">
            <div className="inline-block text-[#FFB81C] text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              — Featured Publications
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black dark:text-white">
              Featured Works
            </h2>
            <div className="w-16 h-1 bg-[#FFB81C] mx-auto mt-4"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {books.map((book) => (
              <div 
                key={book.title} 
                className="group bg-white dark:bg-[#1a1a1a] border border-stone-200 dark:border-stone-800 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className="relative aspect-[2/3] bg-stone-100 dark:bg-[#2a2a2a] overflow-hidden">
                  <Image 
                    src={book.img} 
                    alt={book.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700" 
                    sizes="(max-width: 768px) 100vw, 33vw"
                    unoptimized={book.img.startsWith('http')}
                  />
                </div>
                <div className="p-6">
                  <p className="font-bold text-lg text-black dark:text-white mb-2">{book.title}</p>
                  <a 
                    href="https://zomediaproductions.com/store/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-[#FFB81C] font-semibold hover:text-black dark:hover:text-white transition-colors inline-flex items-center gap-2"
                  >
                    Purchase
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* WHY THIS PROJECT MATTERS */}
        <section className="bg-stone-50 dark:bg-[#1a1a1a] border border-stone-200 dark:border-stone-800 p-12 md:p-16 mb-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block text-[#FFB81C] text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              — Impact
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black dark:text-white">
              Why This Project <span className="text-[#FFB81C]">Matters</span>
            </h2>
            <div className="w-16 h-1 bg-[#FFB81C] mx-auto mb-8"></div>
            <p className="text-base leading-relaxed text-stone-700 dark:text-stone-300 mb-8">
              {whyItMattersContent}
            </p>
            {whyItMattersItems.length > 0 && (
              <div className="grid sm:grid-cols-3 gap-6 text-left">
                {whyItMattersItems.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="text-[#FFB81C] font-bold text-xl flex-shrink-0 mt-1">✦</span>
                    <span className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: item }} />
                  </div>
                ))}
              </div>
            )}
            <div className="mt-10 pt-10 border-t border-stone-200 dark:border-stone-800">
              <p className="text-stone-600 dark:text-stone-400">
                <span className="italic">
                  Submit your inquiry or learn more by filling out the form below.
                </span>
              </p>
              <a 
                href="/contact" 
                className="inline-block mt-4 bg-[#FFB81C] text-black px-10 py-4 text-sm font-bold uppercase tracking-wider hover:bg-[#e6a500] transition-all duration-300"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}