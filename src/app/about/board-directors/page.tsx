// src/app/about/board-of-directors/page.tsx
import Image from "next/image";
import Link from "next/link";
import { getPageBySlug } from "@/lib/wordpress/pages";

interface BoardMember {
  name: string;
  role: string;
  bio: string;
  img: string;
  isDarkBg: boolean;
}

function sanitizeString(str: string): string {
  return str
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, ' ')
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#8216;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8243;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&#038;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ");
}

function parseBoardContent(content: string) {
  const cleanContent = sanitizeString(content);
  const members: BoardMember[] = [];

  const sections = cleanContent.split(/\[et_pb_section/g);

  for (const section of sections) {
    if (!section.trim()) continue;

    const isDarkBg = section.includes('background_color="#000000"') || 
                     section.includes('background_color="black"');

    const rows = section.split(/\[et_pb_row/g);

    for (const row of rows) {
      if (!row.trim()) continue;

      const bioTextMatch = row.match(/\[et_pb_text[^\]]*\]([\s\S]*?)\[\/et_pb_text\]/);
      let bio = '';
      if (bioTextMatch) {
        bio = bioTextMatch[1]
          .replace(/<div[^>]*>/g, '')
          .replace(/<\/div>/g, '\n')
          .replace(/<p[^>]*>/g, '')
          .replace(/<\/p>/g, '\n\n')
          .replace(/<span[^>]*>/g, '')
          .replace(/<\/span>/g, '')
          .replace(/<[^>]*>/g, '')
          .trim();
      }

      if (!bio) continue;

      let img = '';
      const imgMatch = row.match(/\[et_pb_image[^\]]*src=["']([^"']+)["']/);
      if (imgMatch) {
        img = imgMatch[1];
      }

      let name = '';
      const nameMatch = row.match(/\[dg_adh_heading[^\]]*title_prefix=["']([^"']+)["']/);
      if (nameMatch) {
        name = nameMatch[1];
      }

      if (!name) {
        const adminMatch = row.match(/admin_label=["']([^"']+)["']/);
        if (adminMatch && !adminMatch[1].includes('Row') && !adminMatch[1].includes('Section')) {
          name = adminMatch[1];
        }
      }

      if (!name || ['BOARD MEMBER', 'Staff & Volunteers', 'BOARD OF ADVISOR'].includes(name.toUpperCase())) {
        continue;
      }

      let role = 'Board Member';
      const roleMatch = section.match(/title_prefix=["']([^"']+)["']/);
      if (roleMatch && !roleMatch[1].includes('BOARD MEMBER') && !roleMatch[1].includes('Staff')) {
        role = roleMatch[1];
      }

      if (name.includes('|')) {
        name = name.split('|')[0].trim();
      }

      members.push({
        name,
        role,
        bio,
        img,
        isDarkBg
      });
    }
  }

  return { members };
}

export default async function BoardOfDirectorsPage() {
  const page = await getPageBySlug('board-of-directors-2');

  if (!page) {
    return (
      <main className="min-h-screen bg-white dark:bg-[#1a1a1a] text-black dark:text-[#f4f4f4] transition-colors duration-300 font-serif">
        <header className="relative h-[40vh] flex items-end pb-16 px-6 md:px-20 overflow-hidden border-b border-black/10 dark:border-white/10">
          <div className="relative z-10 max-w-7xl mx-auto w-full">
            <span className="inline-block bg-[#FFB81C] text-black px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              Leadership
            </span>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85] mb-4">
              Board of <span className="text-[#FFB81C]">Directors</span>
            </h1>
            <p className="text-lg md:text-xl text-stone-600 dark:text-stone-400 max-w-2xl font-light">
              Dedicated leaders guiding our mission and vision.
            </p>
          </div>
        </header>
        
        <section className="max-w-4xl mx-auto py-16 px-6 md:px-20 text-center">
          <div className="bg-stone-50 dark:bg-[#2a2a2a] p-8 rounded-2xl border border-black/5 dark:border-white/5">
            <h2 className="text-xl font-bold mb-4 text-[#FFB81C]">Page Not Found</h2>
            <p className="text-stone-600 dark:text-stone-400">
              The Board of Directors page could not be found in WordPress.
            </p>
          </div>
        </section>
      </main>
    );
  }

  const { members } = parseBoardContent(page.content);

  if (members.length === 0) {
    return (
      <main className="min-h-screen bg-white dark:bg-[#1a1a1a] text-black dark:text-[#f4f4f4] transition-colors duration-300 font-serif">
        <header className="relative h-[40vh] flex items-end pb-16 px-6 md:px-20 overflow-hidden border-b border-black/10 dark:border-white/10">
          <div className="relative z-10 max-w-7xl mx-auto w-full">
            <span className="inline-block bg-[#FFB81C] text-black px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              Leadership
            </span>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85] mb-4">
              Board of <span className="text-[#FFB81C]">Directors</span>
            </h1>
            <p className="text-lg md:text-xl text-stone-600 dark:text-stone-400 max-w-2xl font-light">
              Dedicated leaders guiding our mission and vision.
            </p>
          </div>
        </header>
        
        <section className="max-w-4xl mx-auto py-16 px-6 md:px-20 text-center">
          <div className="bg-stone-50 dark:bg-[#2a2a2a] p-8 rounded-2xl border border-black/5 dark:border-white/5">
            <h2 className="text-xl font-bold mb-4 text-[#FFB81C]">No Board Members Found</h2>
            <p className="text-stone-600 dark:text-stone-400">
              Page "{page.title}" was found but no board members could be parsed.
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-[#1a1a1a] text-black dark:text-[#f4f4f4] transition-colors duration-300 font-serif selection:bg-[#FFB81C]/30">
      
      {/* HERO SECTION */}
      <header className="relative h-[40vh] flex items-end pb-16 px-6 md:px-20 overflow-hidden border-b border-black/10 dark:border-white/10 bg-gradient-to-b from-stone-50 dark:from-stone-900 to-white dark:to-[#1a1a1a]">
        {page.featuredImageUrl && (
          <div className="absolute inset-0 z-0">
            <Image 
              src={page.featuredImageUrl} 
              alt={page.title}
              fill
              className="object-cover opacity-20 grayscale"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#1a1a1a] to-transparent" />
          </div>
        )}
        
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <span className="inline-block bg-[#FFB81C] text-black px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            Leadership
          </span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85] mb-4">
            Board of <span className="text-[#FFB81C]">Directors</span>
          </h1>
          <p className="text-lg md:text-xl text-stone-600 dark:text-stone-400 max-w-2xl font-light">
            Dedicated leaders guiding our mission and vision.
          </p>
        </div>
      </header>

      {/* BOARD MEMBERS SECTION - Image Left, Text Right */}
      <section className="max-w-7xl mx-auto py-16 px-6 md:px-20">
        <div className="max-w-5xl mx-auto">
          <div className="space-y-12">
            {members.map((member, index) => {
              const isEven = index % 2 === 0;
              const cardBg = isEven 
                ? 'bg-stone-50 dark:bg-[#2a2a2a] border-black/5 dark:border-white/5 text-black dark:text-[#f4f4f4]' 
                : 'bg-stone-900 dark:bg-[#0a0a0a] border-stone-800 text-white';

              return (
                <div 
                  key={index} 
                  className={`rounded-2xl border overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.01] ${cardBg}`}
                >
                  <div className="flex flex-col md:flex-row gap-8 p-8 md:p-10 items-center md:items-start">
                    
                    {/* Image - Left Column - Larger and Uncropped */}
                    <div className="w-full md:w-[200px] flex-shrink-0 flex justify-center">
                      {member.img ? (
                        <div className="relative w-48 h-48 md:w-full md:aspect-square rounded-2xl overflow-hidden bg-stone-200 dark:bg-stone-800 border-2 border-[#FFB81C]/20 shadow-inner">
                          <Image
                            src={member.img}
                            alt={member.name}
                            fill
                            className="object-contain p-3"
                            sizes="(max-width: 768px) 192px, 200px"
                            unoptimized={member.img.includes('.heic')}
                          />
                        </div>
                      ) : (
                        <div className="w-48 h-48 md:w-full md:aspect-square rounded-2xl bg-gradient-to-br from-[#FFB81C]/20 to-[#FFB81C]/5 flex items-center justify-center border-2 border-dashed border-[#FFB81C]/30">
                          <span className="text-6xl font-black text-[#FFB81C]">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Content - Right Column */}
                    <div className="flex-grow w-full text-center md:text-left">
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3">
                        <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
                          {member.name}
                        </h3>
                        {member.role && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFB81C] bg-[#FFB81C]/10 border border-[#FFB81C]/30 px-3 py-1 rounded-full">
                            {member.role}
                          </span>
                        )}
                      </div>
                      
                      <div className={`text-sm md:text-base leading-relaxed font-light space-y-4 whitespace-pre-line ${
                        isEven ? 'text-stone-600 dark:text-stone-300' : 'text-stone-300'
                      }`}>
                        {member.bio}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ACTION FOOTER */}
      <section className="max-w-7xl mx-auto px-6 md:px-20 pb-16">
        <div className="pt-16 border-t border-black/10 dark:border-white/10 flex flex-wrap gap-8 items-center justify-center">
          <Link 
            href="/about/staff" 
            className="px-10 py-5 bg-[#FFB81C] text-black text-xs font-black uppercase tracking-widest hover:bg-yellow-500 transition-all rounded"
          >
            Meet Our Staff
          </Link>
          <p className="text-stone-500 font-bold uppercase tracking-widest text-[10px]">
            Learn more about the people behind UBFSF.
          </p>
        </div>
      </section>
    </main>
  );
}