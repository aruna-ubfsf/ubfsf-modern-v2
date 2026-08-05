// src/app/about/ivan-kilgore/page.tsx
import Image from "next/image";
import Link from "next/link";
import { getPageBySlug } from "@/lib/wordpress/pages";

interface Book {
  title: string;
  image: string;
  url: string;
}

function parseIvanContent(content: string) {
  // 1. Decode HTML entities
  let html = content
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
  let messageContent = "";
  let videoUrl = "";
  let imageUrl = "";

  // 2. Extract Headshot Image (Direct HTML tag)
  const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
  if (imgMatch) {
    imageUrl = imgMatch[1];
    // ⭐️ CRITICAL FIX: Clean the URL before giving it to Next.js Image
    imageUrl = imageUrl.replace(/&amp;/g, '&');
  }

  // 3. Extract Name and Role
  const nameMatch = html.match(/title_prefix=["']([^"']+)["']/i);
  if (nameMatch) name = nameMatch[1];

  const roleMatch = html.match(/title_suffix=["']([^"']+)["']/i);
  if (roleMatch) role = roleMatch[1].replace(/^\|/, '').trim();

  // 4. Extract Bio
  const bioSection = html.match(/title_suffix=["'][^"']+["'][\s\S]*?(?=A Message from Ivan)/i)?.[0] || "";
  const cleanBio = bioSection
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/&amp;/g, '&')
    .trim();
  
  const sentences = cleanBio.split(/(?<=\.)\s+/);
  let formattedBio = [];
  let currentParagraph = "";
  
  for (const sentence of sentences) {
    if (sentence.includes("published four impactful books") || 
        sentence.includes("His works are required reading") ||
        sentence.includes("Ivan’s impact extends")) {
      if (currentParagraph) formattedBio.push(currentParagraph.trim());
      currentParagraph = sentence + " ";
    } else {
      currentParagraph += sentence + " ";
    }
  }
  if (currentParagraph) formattedBio.push(currentParagraph.trim());
  bio = formattedBio.join("\n\n");

  // 5. Extract Video URL
  const videoMatch = html.match(/<iframe[^>]+src=["']([^"']+)["']/i);
  if (videoMatch) {
    let vUrl = videoMatch[1];
    if (vUrl.includes('watch?v=')) {
      const id = vUrl.split('v=')[1]?.split('&')[0];
      vUrl = `https://www.youtube.com/embed/${id}`;
    } else if (vUrl.includes('youtu.be')) {
      const id = vUrl.split('/').pop();
      vUrl = `https://www.youtube.com/embed/${id}`;
    }
    videoUrl = vUrl;
  }

  // 6. Extract Books
  const bookRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>[\s\S]*?<img[^>]+src=["']([^"']+)["'][^>]*>[\s\S]*?<\/a>/gi;
  let bookMatch;
  const bookTitles = [
    "Domestic Genocide: The Institutionalization of Society",
    "My Comrades' Thoughts on Black Lives Matter",
    "Mayhem, Murder & Magnificence: A Memoir",
    "King: The Early Years"
  ];
  
  let i = 0;
  while ((bookMatch = bookRegex.exec(html)) !== null && i < 4) {
    if (bookMatch[2]) {
      let imgSrc = bookMatch[2].replace(/&amp;/g, '&'); // ⭐️ Clean the book URL too
      books.push({
        title: bookTitles[i] || `Book ${i + 1}`,
        image: imgSrc,
        url: bookMatch[1]
      });
      i++;
    }
  }

  // 7. Extract Volunteer Message
  const messageMatch = html.match(/A Message from Ivan[\s\S]*?<p>([\s\S]*?)<\/p>/i);
  if (messageMatch) {
    messageContent = messageMatch[1]
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  return { name, role, bio, books, messageContent, videoUrl, imageUrl };
}

export default async function IvanKilgorePage() {
  const page = await getPageBySlug('ivan-kilgore');

  if (!page) return <div className="p-10 text-center">Founder page not found.</div>;

  const { name, role, bio, books, messageContent, videoUrl, imageUrl } = parseIvanContent(page.content);

  return (
    <main className="min-h-screen bg-white text-black font-sans">
      
      {/* 1. HERO / PROFILE SECTION */}
      <header className="max-w-7xl mx-auto px-6 md:px-20 py-16 md:py-24">
        <div className="grid md:grid-cols-3 gap-12 items-start">
          {/* Image */}
          <div className="md:col-span-1 flex justify-center md:justify-start">
            {imageUrl && (
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden shadow-2xl border-4 border-[#FFB81C]/20">
                <Image
                  src={imageUrl}
                  alt={name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
          </div>
          
          {/* Name and Bio */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <span className="inline-block bg-[#FFB81C] text-black px-4 py-1 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                Founder
              </span>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-2">{name}</h1>
              <p className="text-[#FFB81C] font-semibold text-lg md:text-xl">{role}</p>
            </div>
            
            <div className="prose prose-lg max-w-none text-stone-700 leading-relaxed space-y-6">
              {bio.split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* 2. A MESSAGE FROM IVAN & VIDEO */}
      {(messageContent || videoUrl) && (
        <section className="bg-[#1a1a1a] text-white py-20 px-6 md:px-20">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#FFB81C]">
                A Message from Ivan
              </h2>
              <div className="text-stone-300 leading-relaxed space-y-4 text-lg">
                <p>{messageContent}</p>
                <p className="mt-4">
                  <Link 
                    href="https://ubfsf.org/volunteer-opportunities/" 
                    target="_blank"
                    className="inline-block bg-[#FFB81C] text-black px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-yellow-500 transition-all rounded"
                  >
                    Apply Today &rarr;
                  </Link>
                </p>
              </div>
            </div>

            {/* Video */}
            {videoUrl && (
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border-2 border-[#FFB81C]/50">
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

      {/* 3. LITERATURE / BOOKS GRID */}
      {books.length > 0 && (
        <section className="py-20 px-6 md:px-20 bg-stone-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
                Literature
              </h2>
              <p className="text-stone-600 max-w-2xl mx-auto text-lg">
                Ivan Kilgore has published four influential books, adapted into Emmy-nominated films and incorporated into university curricula worldwide.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {books.map((book, index) => (
                <a
                  key={index}
                  href={book.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-black/5"
                >
                  <div className="relative aspect-[2/3] bg-white p-4">
                    {book.image && (
                      <Image
                        src={book.image}
                        alt={book.title}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    )}
                  </div>
                  <div className="p-6 border-t border-black/5">
                    <h3 className="text-sm font-bold leading-tight line-clamp-2 group-hover:text-[#FFB81C] transition-colors">
                      {book.title}
                    </h3>
                    <span className="inline-block mt-3 text-[10px] text-[#FFB81C] font-bold uppercase tracking-wider">
                      Buy on Amazon &rarr;
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* 4. BOTTOM CTA */}
      <section className="max-w-7xl mx-auto px-6 md:px-20 py-16">
        <div className="pt-12 border-t border-black/10 flex flex-wrap gap-6 items-center justify-center">
          <Link 
            href="/about/staff" 
            className="px-10 py-4 bg-[#FFB81C] text-black text-xs font-black uppercase tracking-widest hover:bg-yellow-500 transition-all rounded"
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