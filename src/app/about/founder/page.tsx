// src/app/about/ivan-kilgore/page.tsx
import Image from "next/image";
import Link from "next/link";
import { getPageBySlug } from "@/lib/wordpress/pages";
import { getWpImageUrl } from "@/lib/wordpress/client";

interface Book {
  title: string;
  image: string;
  url: string;
}

function parseIvanContent(content: string) {
  const cleanContent = content
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8211;/g, "–")
    .replace(/&#038;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ");

  let name = "Ivan Kilgore";
  let role = "Author, Activist, and Founder of UBFSF";
  let bio = "";
  let books: Book[] = [];
  let messageTitle = "";
  let messageContent = "";
  let videoUrl = "";
  let imageUrl = "";

  // Extract image
  const imgMatch = cleanContent.match(/\[et_pb_image[^\]]*src=["']([^"']+)["']/);
  if (imgMatch) {
    imageUrl = getWpImageUrl(imgMatch[1]);
  }

  // Extract name and role from heading
  const nameMatch = cleanContent.match(/title_prefix=["']([^"']+)["']/);
  if (nameMatch) {
    name = nameMatch[1];
  }

  const roleMatch = cleanContent.match(/title_suffix=["']([^"']+)["']/);
  if (roleMatch) {
    role = roleMatch[1].replace(/^\|/, '').trim();
  }

  // Extract bio from text blocks
  const textMatches = cleanContent.match(/\[et_pb_text[^\]]*\]([\s\S]*?)\[\/et_pb_text\]/g) || [];
  let bioTexts: string[] = [];

  for (const textMatch of textMatches) {
    const text = textMatch
      .replace(/\[et_pb_text[^\]]*\]/, '')
      .replace(/\[\/et_pb_text\]/, '')
      .replace(/<[^>]*>/g, '')
      .replace(/&#822[01];/g, '"')
      .replace(/&#8217;/g, "'")
      .replace(/&#8211;/g, "–")
      .replace(/&#038;/g, "&")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim();

    if (text && text.length > 50) {
      bioTexts.push(text);
    }
  }

  bio = bioTexts.slice(0, 2).join('\n\n');

  // Extract message section
  const messageMatch = cleanContent.match(/A Message from Ivan[\s\S]*?<p>([\s\S]*?)<\/p>/);
  if (messageMatch) {
    messageTitle = "A Message from Ivan";
    messageContent = messageMatch[1]
      .replace(/<[^>]*>/g, '')
      .replace(/&#822[01];/g, '"')
      .replace(/&#8217;/g, "'")
      .replace(/&#8211;/g, "–")
      .replace(/&#038;/g, "&")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim();
  }

  // Extract video
  const videoMatch = cleanContent.match(/\[et_pb_video[^\]]*src="([^"]+)"[^\]]*\]/);
  if (videoMatch) {
    videoUrl = videoMatch[1];
    if (videoUrl.includes('watch?v=')) {
      const id = videoUrl.split('v=')[1]?.split('&')[0];
      videoUrl = `https://www.youtube.com/embed/${id}`;
    } else if (videoUrl.includes('youtu.be')) {
      const id = videoUrl.split('/').pop();
      videoUrl = `https://www.youtube.com/embed/${id}`;
    }
  }

  // Extract books - look for images with URLs (Amazon links)
  const bookRegex = /\[et_pb_image[^\]]*src=["']([^"']+)["'][^\]]*url=["']([^"']+)["'][^\]]*\]/g;
  let bookMatch;
  
  const bookTitles = [
    "Domestic Genocide: The Institutionalization of Society",
    "My Comrades' Thoughts on Black Lives Matter: A Collection of Essays & Poems",
    "Mayhem, Murder & Magnificence: A Memoir",
    "King: The Early Years"
  ];
  
  const fallbackUrls = [
    "https://www.amazon.com/Domestic-Genocide-Institutionalization-Ivan-Kilgore/dp/1494485729",
    "https://www.amazon.com/Comrades-Thoughts-Black-Lives-Matter-ebook/dp/B0CW19149J",
    "https://www.amazon.com/Mayhem-Murder-Magnificence-Ivan-Kilgore-ebook/dp/B084V3JS14",
    "https://www.amazon.com/King-Early-Years-Ivan-Kilgore/dp/1074457838"
  ];
  
  let bookIndex = 0;
  while ((bookMatch = bookRegex.exec(cleanContent)) !== null) {
    const img = getWpImageUrl(bookMatch[1]);
    const url = bookMatch[2];
    
    if (bookIndex < bookTitles.length) {
      books.push({
        title: bookTitles[bookIndex],
        image: img,
        url: url || fallbackUrls[bookIndex]
      });
      bookIndex++;
    }
  }

  // If no books were extracted, use fallback data
  if (books.length === 0) {
    // Try to find images without URLs
    const imageOnlyRegex = /\[et_pb_image[^\]]*src=["']([^"']+)["'][^\]]*\]/g;
    let imgOnlyMatch;
    let imgIndex = 0;
    
    while ((imgOnlyMatch = imageOnlyRegex.exec(cleanContent)) !== null && imgIndex < bookTitles.length) {
      const img = getWpImageUrl(imgOnlyMatch[1]);
      // Skip if this is the profile image
      if (img !== imageUrl) {
        books.push({
          title: bookTitles[imgIndex],
          image: img,
          url: fallbackUrls[imgIndex]
        });
        imgIndex++;
      }
    }
  }

  return {
    name,
    role,
    bio,
    books,
    messageTitle,
    messageContent,
    videoUrl,
    imageUrl
  };
}

export default async function IvanKilgorePage() {
  const page = await getPageBySlug('ivan-kilgore');

  if (!page) {
    return (
      <main className="min-h-screen bg-white dark:bg-[#1a1a1a] flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </main>
    );
  }

  const {
    name,
    role,
    bio,
    books,
    messageTitle,
    messageContent,
    videoUrl,
    imageUrl
  } = parseIvanContent(page.content);

  return (
    <main className="min-h-screen bg-white dark:bg-[#1a1a1a] text-black dark:text-[#f4f4f4] transition-colors duration-300 font-serif">
      
      {/* HERO / PROFILE SECTION */}
      <header className="relative py-16 px-6 md:px-20 border-b border-black/10 dark:border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 items-start">
            {/* Image - Using object-contain to prevent cropping */}
            {imageUrl && (
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 shadow-xl">
                <Image
                  src={imageUrl}
                  alt={name}
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            )}
            
            {/* Name and Bio */}
            <div className="md:col-span-2">
              <span className="inline-block bg-[#FFB81C] text-black px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                Founder
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{name}</h1>
              <p className="text-[#FFB81C] font-semibold text-lg mb-6">{role}</p>
              
              {bio && (
                <div className="text-stone-600 dark:text-stone-400 leading-relaxed space-y-4">
                  {bio.split('\n').map((paragraph, i) => (
                    paragraph.trim() && <p key={i}>{paragraph.trim()}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* A MESSAGE FROM IVAN - Black Section */}
      {(messageContent || videoUrl) && (
        <section className="bg-black dark:bg-[#0a0a0a] text-white py-16 px-6 md:px-20">
          <div className="max-w-4xl mx-auto">
            {messageTitle && (
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-[#FFB81C]">
                {messageTitle}
              </h2>
            )}
            
            {messageContent && (
              <div className="text-white/80 leading-relaxed space-y-4 mb-8">
                {messageContent.split('\n').map((paragraph, i) => (
                  paragraph.trim() && <p key={i}>{paragraph.trim()}</p>
                ))}
              </div>
            )}
            
            {videoUrl && (
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/5 dark:bg-white/5 border-2 border-[#FFB81C]">
                <iframe
                  src={videoUrl}
                  title="Ivan Kilgore Message"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* LITERATURE / BOOKS SECTION */}
      {books.length > 0 && (
        <section className="py-16 px-6 md:px-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center border-b border-black/10 dark:border-white/10 pb-6">
              Literature
            </h2>
            <p className="text-stone-600 dark:text-stone-400 text-center max-w-3xl mx-auto mb-12">
              Ivan Kilgore, a prolific author and activist, has published four influential books. 
              His writings have been adapted into Emmy-nominated films, incorporated into university 
              curricula worldwide, and utilized by advocacy organizations across the United States.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {books.map((book, index) => (
                <a
                  key={index}
                  href={book.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-stone-50 dark:bg-[#2a2a2a] rounded-2xl overflow-hidden border border-black/5 dark:border-white/5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative aspect-[2/3] bg-stone-100 dark:bg-stone-800">
                    {book.image && (
                      <Image
                        src={book.image}
                        alt={book.title}
                        fill
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold leading-tight group-hover:text-[#FFB81C] transition-colors line-clamp-3">
                      {book.title}
                    </h3>
                    <span className="inline-block mt-2 text-xs text-[#FFB81C] font-bold uppercase tracking-wider">
                      Buy on Amazon →
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* ACTION FOOTER */}
      <section className="max-w-7xl mx-auto px-6 md:px-20 pb-16">
        <div className="pt-16 border-t border-black/10 dark:border-white/10 flex flex-wrap gap-8 items-center justify-center">
          <Link 
            href="/about/staff" 
            className="px-10 py-5 bg-[#FFB81C] text-black text-xs font-black uppercase tracking-widest hover:bg-yellow-500 transition-all"
          >
            Meet Our Team
          </Link>
          <p className="text-stone-500 font-bold uppercase tracking-widest text-[10px]">
            Learn more about the people behind UBFSF.
          </p>
        </div>
      </section>
    </main>
  );
}