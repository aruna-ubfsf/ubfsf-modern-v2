import Image from "next/image";
import Link from "next/link";
import { getPageBySlug } from "@/lib/wordpress/pages";
import { getWpImageUrl } from "@/lib/wordpress/client";

// Helper function to clean HTML content and extract structured data
function extractContentFromWordPress(content: string) {
  // Extract the main text content
  const textMatches = content.match(/<p>(.*?)<\/p>/g) || [];
  const textContent = textMatches
    .map(p => p.replace(/<[^>]+>/g, '').trim())
    .filter(Boolean);

  // Extract list items
  const listMatches = content.match(/<li[^>]*>(.*?)<\/li>/g) || [];
  const listItems = listMatches
    .map(li => li.replace(/<[^>]+>/g, '').trim())
    .filter(Boolean);

  // Extract headings/sections
  const headingMatches = content.match(/<[^>]*heading[^>]*title_suffix="([^"]*)"[^>]*>/g) || [];
  const sections = headingMatches
    .map(h => {
      const match = h.match(/title_suffix="([^"]*)"/);
      return match ? match[1] : null;
    })
    .filter(Boolean);

  // Extract image URLs - properly filter out null/undefined
  const imageMatches = content.match(/src="([^"]*\.(jpg|jpeg|png|webp))"/g) || [];
  const imageUrls: string[] = [];
  for (const img of imageMatches) {
    const match = img.match(/src="([^"]*)"/);
    if (match && match[1]) {
      imageUrls.push(match[1]);
    }
  }

  // Extract video URL
  const videoMatch = content.match(/src="(https:\/\/youtu\.be\/[^"]*)"/);
  const videoUrl = videoMatch ? videoMatch[1] : null;

  // Extract book information
  const bookTitles: string[] = [];
  const bookImages: string[] = [];
  
  const bookRegex = /title_suffix="([^"]*)"[^>]*>[\s\S]*?src="([^"]*\.(jpg|jpeg|png))"/g;
  let bookMatch;
  while ((bookMatch = bookRegex.exec(content)) !== null) {
    if (bookMatch[1]) bookTitles.push(bookMatch[1]);
    if (bookMatch[2]) bookImages.push(bookMatch[2]);
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

// AI-generated placeholder images for when WordPress images aren't available
const placeholderImages = {
  hero: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&q=80",
  bookshelf: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80",
  writing: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80",
  justice: "https://images.unsplash.com/photo-1589578527966-fdac0f44566c?w=800&q=80",
  community: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80",
};

export default async function HundredStoriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const page = await getPageBySlug("hundred-stories-project");

  if (!page) {
    return <main className="p-20 min-h-screen bg-white dark:bg-[#1a1a1a] text-black dark:text-white">Loading...</main>;
  }

  const content = page.content || '';
  const extracted = extractContentFromWordPress(content);

  // Organize extracted content into sections
  const heroTitle = page.title || "Hundred Stories Project";
  
  const mainDescription = extracted.textContent[0] || "";
  const givingVoiceContent = extracted.textContent.slice(1, 3).join(" ");
  const expandingPerspectivesContent = extracted.textContent.slice(3, 5).join(" ");
  const whyItMattersContent = extracted.textContent.slice(5, 8).join(" ");
  const keyComponents = extracted.listItems.slice(0, 3);
  const whyItMattersItems = extracted.listItems.slice(3, 6);

  // Get the first image URL safely
  const firstImageUrl = extracted.imageUrls.length > 0 ? extracted.imageUrls[0] : null;

  // Get book data with fallback images
  const books = [
    { 
      title: extracted.bookTitles[0] || 'No Rhyme or Reason', 
      img: extracted.bookImages[0] || null,
      fallback: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80"
    },
    { 
      title: extracted.bookTitles[1] || 'Social Justice Autobiographies', 
      img: extracted.bookImages[1] || null,
      fallback: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&q=80"
    },
    { 
      title: extracted.bookTitles[2] || 'Kill the Bastard', 
      img: extracted.bookImages[2] || null,
      fallback: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&q=80"
    }
  ];

  // Three pillars data
  const pillars = [
    {
      icon: "✍️",
      title: "Write",
      description: "Empowering incarcerated individuals to share their stories through a self-taught writing curriculum.",
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&q=80"
    },
    {
      icon: "📚",
      title: "Publish",
      description: "Transforming personal narratives into published manuscripts and anthologies that reach the world.",
      image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&q=80"
    },
    {
      icon: "🌍",
      title: "Transform",
      description: "Changing perspectives and inspiring solutions to systemic issues in the carceral ecosystem.",
      image: "https://images.unsplash.com/photo-1589578527966-fdac0f44566c?w=600&q=80"
    }
  ];

  // Safe function to get image URL
  function getImageUrl(imagePath: string | null | undefined, fallback: string): string {
    if (!imagePath) return fallback;
    try {
      const url = getWpImageUrl(imagePath);
      return url || fallback;
    } catch {
      return fallback;
    }
  }

  return (
    <main className="bg-white dark:bg-[#1a1a1a] text-black dark:text-[#f4f4f4] min-h-screen font-serif">
      
      {/* HERO SECTION */}
      <section className="relative bg-black dark:bg-[#0a0a0a] text-white py-24 md:py-32 px-6 md:px-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image 
            src={placeholderImages.hero}
            alt="Background"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter mb-6 leading-[1.1]">
            {heroTitle}
          </h1>
          <div className="w-20 h-1 bg-[#FFB81C] mx-auto mb-8"></div>
          <p className="text-xl md:text-2xl text-stone-300 max-w-3xl mx-auto leading-relaxed font-light">
            "Every story deserves to be heard. One Hundred Stories. One Shared Humanity."
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
            <Image 
              src={getImageUrl(firstImageUrl, placeholderImages.bookshelf)} 
              alt="Hundred Stories Bookshelf" 
              fill 
              className="object-cover hover:scale-105 transition-transform duration-700" 
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </section>

        {/* THREE PILLARS SECTION */}
        <section className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black dark:text-white">
              Our Three Pillars
            </h2>
            <div className="w-16 h-1 bg-[#FFB81C] mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {pillars.map((pillar, index) => (
              <div 
                key={index} 
                className="group bg-white dark:bg-[#1a1a1a] rounded-lg overflow-hidden border border-stone-200 dark:border-stone-800 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={pillar.image}
                    alt={pillar.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-4xl">{pillar.icon}</div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-3 text-black dark:text-white">{pillar.title}</h3>
                  <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* EXPANDING PERSPECTIVES WITH VIDEO */}
        <section className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <div className="order-2 md:order-1">
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
                src={extracted.videoUrl.replace('youtu.be/', 'www.youtube.com/embed/')}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full relative">
                <Image
                  src={placeholderImages.writing}
                  alt="Video placeholder - Storytelling"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-20 h-20 rounded-full bg-[#FFB81C]/80 flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl">▶</span>
                    </div>
                    <p className="text-sm font-light">Watch the Story</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* FEATURED WORKS */}
        <section className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black dark:text-white">
              Featured Works
            </h2>
            <p className="text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
              by Ivan Kilgore, UBFSF Founder
            </p>
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
                    src={getImageUrl(book.img, book.fallback)} 
                    alt={book.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700" 
                    sizes="(max-width: 768px) 100vw, 33vw"
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
                href="https://ubfsf.org/contact/" 
                target="_blank" 
                rel="noopener noreferrer"
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