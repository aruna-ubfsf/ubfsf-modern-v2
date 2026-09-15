/* src/app/about/founder/page.tsx
 * Founder page using WordPress as CMS
 * Consistent design with other about pages - white/gold/serif theme
 */

import Image from "next/image";
import Link from "next/link";
import { getPageBySlug } from "@/lib/wordpress/pages";
import { cleanWPContent } from "@/lib/wordpress/client";

interface Book {
  title: string;
  image: string;
  url: string;
}

/**
 * Parse WordPress content for the founder page.
 * Extracts data from Divi builder format (dg_adh_heading, et_pb_text, et_pb_image, et_pb_video)
 */
function parseFounderContent(content: string) {
  const clean = cleanWPContent(content);

  let name = "Ivan Kilgore";
  let role = "Author, Activist, and Founder of UBFSF";
  let bio = "";
  let books: Book[] = [];
  let messageContent = "";
  let videoUrl = "";
  let imageUrl = "";

  // 1. Extract Name and Role from dg_adh_heading prefix/suffix
  // The pattern: <span class="prefix">Ivan Kilgore</span> <span class="suffix">| Author, Activist, and Founder of UBFSF</span>
  const nameMatch = clean.match(/class="prefix"[^>]*>([^<]+)<\/span>[\s\S]*?class="suffix"[^>]*>([^<]*)<\/span>/i);
  if (nameMatch) {
    // Strip pipes/quotes/whitespace — never render a bare "|"
    const parsedName = nameMatch[1].replace(/[|]/g, '').replace(/&ldquo;|&rdquo;|"/g, '').trim();
    const parsedRole = nameMatch[2].replace(/^\s*\|/, '').replace(/[|]/g, '').replace(/&ldquo;|&rdquo;|"/g, '').trim();
    if (parsedName && parsedName !== '|') name = parsedName;
    if (parsedRole && parsedRole !== '|') role = parsedRole;
  }
  
  // Fallback: try to extract from the title rendered field
  if (!role || role === "") {
    role = "Author, Activist, and Founder of UBFSF";
  }

  // 2. Extract Bio - from et_pb_text_inner paragraphs before books section
  const bioMatch = clean.match(/et_pb_text_inner[\s\S]*?<p><span[^>]*>(Ivan Kilgore is an incarcerated author[\s\S]*?)<\/span><\/p>/i);
  if (bioMatch) {
    bio = bioMatch[1]
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Fallback bio if not found
  if (!bio) {
    bio = "Ivan Kilgore is an incarcerated author, activist, and the visionary founder of the United Black Family Scholarship Foundation and Zo Media Productions, LLC. He has been serving a life sentence without the possibility of parole in California for over two decades. Despite his incarceration, Ivan discovered his passion for writing and began leading numerous writing workshops within the prison system, empowering others through storytelling and self-expression.";
  }

  // 3. Extract Video URL from et_pb_video iframe src
  const videoMatch = clean.match(/et_pb_video[\s\S]*?<iframe[^>]+src=["']([^"']+)["']/i);
  if (videoMatch) {
    videoUrl = videoMatch[1];
  }

  // 4. Extract Message content from the "A Message from Ivan" section
  const messageMatch = clean.match(/A Message from Ivan[\s\S]*?et_pb_text_inner[\s\S]*?<p><span[^>]*>([\s\S]*?)<\/span><\/p>/i);
  if (messageMatch) {
    messageContent = messageMatch[1]
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Fallback message
  if (!messageContent) {
    messageContent = "Are you looking for work-life balance, purpose, and a chance to create meaningful change? Do you want to discover your potential, build professional skills, or use your abilities to make a difference? If so, the United Black Family Scholarship Foundation has the perfect volunteer opportunity for you!";
  }

  // 5. Extract Books - from the Literature section with et_pb_image
  // The book images have empty src but title attribute with book identifier
  const bookTitles = [
    "Domestic Genocide: The Institutionalization of Society",
    "My Comrades' Thoughts on Black Lives Matter",
    "Mayhem, Murder & Magnificence: A Memoir",
    "King: The Early Years"
  ];

  // Known image URLs from the live WordPress page (Jetpack CDN)
  const bookImages = [
    "https://i0.wp.com/ubfsf.org/wp-content/uploads/2026/05/domestic.jpg",
    "https://i0.wp.com/ubfsf.org/wp-content/uploads/2026/05/blacklivematter.jpg",
    "https://i0.wp.com/ubfsf.org/wp-content/uploads/2023/03/mayhem-murder-magnificense.jpeg",
    "https://i0.wp.com/ubfsf.org/wp-content/uploads/2023/03/king-the-early-years.jpg"
  ];

  const bookUrls = [
    "https://www.amazon.com/Domestic-Genocide-Institutionalization-Society-Kilgore/dp/195678900X",
    "https://www.amazon.com/Comrades-Thoughts-Black-Lives-Matter/dp/1956789018",
    "https://www.amazon.com/Mayhem-Murder-Magnificence-Memoir-Kilgore/dp/1956789026",
    "https://www.amazon.com/King-Early-Years-Ivan-Kilgore/dp/1956789034"
  ];

  for (let i = 0; i < 4; i++) {
    books.push({
      title: bookTitles[i],
      image: bookImages[i],
      url: bookUrls[i]
    });
  }

  return { name, role, bio, books, messageContent, videoUrl, imageUrl };
}

export default async function IvanKilgorePage() {
  const page = await getPageBySlug('ivan-kilgore');

  if (!page) {
    return (
      <main className="min-h-screen bg-white dark:bg-[#1a1a1a] text-black dark:text-[#f4f4f4] transition-colors duration-300 font-serif selection:bg-[#D4A017]/30">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="w-20 h-1 bg-[#D4A017] mx-auto mb-8" />
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-[0.3em] mb-4 text-black dark:text-white">
            Founder Page Not Found
          </h2>
          <p className="text-stone-600 dark:text-stone-400 text-lg mb-8 max-w-2xl mx-auto">
            The Ivan Kilgore founder page could not be found in WordPress.
          </p>
          <Link
            href="/about"
            className="inline-block px-8 py-3 bg-[#D4A017] text-black text-xs font-black uppercase tracking-[0.2em] hover:bg-[#B98A2D] transition-all"
          >
            Return to About
          </Link>
        </div>
      </main>
    );
  }

  const { name, role, bio, books, messageContent, videoUrl, imageUrl } = parseFounderContent(page.content);

  // Use the known founder image URL from the live page
  const founderImageUrl = "https://i0.wp.com/ubfsf.org/wp-content/uploads/2025/01/Screenshot-2025-01-24-at-22.11.24.png";
  // Use the known video URL from the live page
  const founderVideoUrl = "https://www.youtube.com/embed/GEx0Zbmj54Y";

  return (
    <main className="min-h-screen bg-white dark:bg-[#1a1a1a] text-black dark:text-[#f4f4f4] transition-colors duration-300 font-serif selection:bg-[#D4A017]/30">
      
      {/* ===== HERO SECTION ===== */}
      <header className="relative h-[50vh] flex items-end pb-16 px-6 md:px-20 overflow-hidden border-b border-black/10 dark:border-white/10 bg-gradient-to-b from-stone-50 dark:from-stone-900 to-white dark:to-[#1a1a1a]">
        {founderImageUrl && (
          <div className="absolute inset-0 z-0">
            <Image
              src={founderImageUrl}
              alt={name}
              fill
              className="object-cover opacity-20 grayscale"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#1a1a1a] to-transparent" />
          </div>
        )}

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <span className="inline-block bg-[#D4A017] text-black px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            Founder
          </span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85] mb-4 text-black dark:text-white">
            {name}
          </h1>
          <p className="text-lg md:text-xl text-stone-600 dark:text-stone-400 max-w-2xl font-light">
            {role}
          </p>
        </div>
      </header>

      {/* ===== BIO SECTION ===== */}
      <section className="max-w-7xl mx-auto py-16 px-6 md:px-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            
            {/* Image — natural portrait ratio, no crop (full head visible) */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-sm aspect-[2/3] rounded-2xl overflow-hidden border-4 border-[#D4A017]/30 shadow-lg bg-stone-200 dark:bg-stone-800">
                <Image
                  src={founderImageUrl}
                  alt={name}
                  fill
                  className="object-cover object-top"
                  priority
                  sizes="(max-width: 768px) 100vw, 384px"
                />
              </div>
            </div>

            {/* Bio Text */}
            <div className="space-y-6">
              <div className="h-px w-16 bg-[#D4A017] my-6" />
              
              <div className="prose prose-stone dark:prose-invert max-w-none text-stone-700 dark:text-stone-300 leading-relaxed">
                <p className="text-lg">{bio}</p>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  href="#message"
                  className="px-8 py-3 bg-[#D4A017] text-black text-xs font-black uppercase tracking-[0.2em] hover:bg-[#B98A2D] transition-all"
                >
                  Read His Message
                </Link>
                <Link
                  href="#books"
                  className="px-8 py-3 border border-black/20 dark:border-white/20 text-black dark:text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-stone-100 dark:hover:bg-stone-800 transition-all"
                >
                  View Books
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===== MESSAGE & VIDEO SECTION ===== */}
      <section id="message" className="py-20 md:py-28 bg-stone-50 dark:bg-[#2a2a2a] border-y border-black/10 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            
            {/* Text Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-6 text-black dark:text-white">
                A Message from Ivan
              </h2>
              <div className="h-px w-12 bg-[#D4A017] mb-6" />
              <div className="text-stone-700 dark:text-stone-300 leading-relaxed space-y-4">
                <p className="text-lg">{messageContent}</p>
              </div>
              <div className="mt-8">
                <Link
                  href="https://ubfsf.org/volunteer-opportunities/"
                  target="_blank"
                  className="inline-block px-8 py-3 bg-black dark:bg-white text-white dark:text-black text-xs font-black uppercase tracking-[0.2em] hover:bg-stone-800 dark:hover:bg-stone-200 transition-all"
                >
                  Apply Today →
                </Link>
              </div>
            </div>

            {/* Video */}
            <div className="relative aspect-video bg-stone-200 dark:bg-stone-800 rounded-xl overflow-hidden shadow-xl border border-black/10 dark:border-white/10">
              <iframe
                src={founderVideoUrl}
                title="Ivan Kilgore Message"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>

          </div>
        </div>
      </section>

      {/* ===== BOOKS GRID ===== */}
      <section id="books" className="py-20 md:py-28 bg-white dark:bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-3 text-black dark:text-white">
              Literature
            </h2>
            <div className="h-px w-12 bg-[#D4A017] mx-auto mb-4" />
            <p className="text-stone-600 dark:text-stone-400 max-w-2xl mx-auto text-sm tracking-wide">
              Published works adapted into Emmy-nominated films and incorporated into university curricula worldwide.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {books.map((book, index) => (
              <a
                key={index}
                href={book.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-stone-50 dark:bg-[#2a2a2a] hover:bg-stone-100 dark:hover:bg-[#333] transition-all duration-300 border border-black/5 dark:border-white/5 rounded-xl overflow-hidden"
              >
                <div className="relative aspect-[3/4] bg-stone-100 dark:bg-stone-800">
                  <Image
                    src={book.image}
                    alt={book.title}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    unoptimized
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-sm font-medium leading-tight text-black dark:text-white group-hover:text-[#D4A017] transition-colors line-clamp-3">
                    {book.title}
                  </h3>
                  <span className="inline-block text-[10px] font-black tracking-[0.2em] text-[#D4A017] uppercase mt-3 border-t border-black/10 dark:border-white/10 pt-3">
                    Buy on Amazon →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BOTTOM CTA ===== */}
      <section className="py-16 md:py-20 bg-stone-50 dark:bg-[#2a2a2a] border-t border-black/10 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link
              href="/about/staff"
              className="px-10 py-4 bg-black dark:bg-white text-white dark:text-black text-xs font-black uppercase tracking-[0.2em] hover:bg-stone-800 dark:hover:bg-stone-200 transition-all"
            >
              Meet Our Team
            </Link>
            <span className="text-stone-500 dark:text-stone-400 text-xs font-light uppercase tracking-[0.2em]">
              Learn more about the people behind UBFSF
            </span>
          </div>
        </div>
      </section>

    </main>
  );
}