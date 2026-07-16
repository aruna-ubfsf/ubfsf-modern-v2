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

      // Extract bio
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

      // Extract image
      let img = '';
      const imgMatch = row.match(/\[et_pb_image[^\]]*src=["']([^"']+)["']/);
      if (imgMatch) {
        img = imgMatch[1];
      }

      // Extract name
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

      // Extract role
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
  // Fetch from WordPress using the correct slug
  const page = await getPageBySlug('board-of-directors-2');

  // If no page found
  if (!page) {
    return (
      <main className="min-h-screen bg-[#141414] text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#1e1e1e] border border-stone-800 p-8 rounded-2xl text-center shadow-2xl">
          <span className="text-[#FFB81C] text-xs font-bold tracking-[0.25em] uppercase block mb-3">Notice</span>
          <h1 className="text-2xl font-black uppercase mb-3 tracking-tight">Page Not Found</h1>
          <p className="text-stone-400 text-sm mb-6 leading-relaxed">
            Could not retrieve Board of Directors data from WordPress.
          </p>
          <p className="text-stone-500 text-xs mb-6">
            Trying to fetch: <span className="text-[#FFB81C] font-mono">board-of-directors-2</span>
          </p>
          <Link 
            href="/" 
            className="inline-block w-full py-3 bg-[#FFB81C] hover:bg-yellow-500 text-black text-xs font-bold tracking-widest uppercase transition-all rounded-lg text-center"
          >
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  const { members } = parseBoardContent(page.content);

  // If no members found
  if (members.length === 0) {
    return (
      <main className="min-h-screen bg-[#141414] text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#1e1e1e] border border-stone-800 p-8 rounded-2xl text-center shadow-2xl">
          <span className="text-[#FFB81C] text-xs font-bold tracking-[0.25em] uppercase block mb-3">Notice</span>
          <h1 className="text-2xl font-black uppercase mb-3 tracking-tight">No Data Found</h1>
          <p className="text-stone-400 text-sm mb-6 leading-relaxed">
            Page "{page.title}" was found but no board members could be parsed.
          </p>
          <Link 
            href="/" 
            className="inline-block w-full py-3 bg-[#FFB81C] hover:bg-yellow-500 text-black text-xs font-bold tracking-widest uppercase transition-all rounded-lg text-center"
          >
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-950 text-white font-sans selection:bg-[#FFB81C]/30">
      
      {/* HEADER HERO */}
      <header className="relative py-20 px-6 border-b border-stone-900 bg-gradient-to-b from-stone-900 to-stone-950">
        <div className="max-w-5xl mx-auto">
          <span className="inline-block bg-[#FFB81C] text-black px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] mb-4 rounded-sm">
            Leadership & Governance
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold uppercase tracking-tight leading-none mb-4">
            Board <span className="text-[#FFB81C]">of Directors</span>
          </h1>
          <p className="text-base md:text-lg text-stone-400 max-w-2xl font-light leading-relaxed">
            Restorative leaders, advocates, and practitioners guiding our mission live from WordPress.
          </p>
        </div>
      </header>

      {/* BOARD CARDS LIST */}
      <section className="max-w-5xl mx-auto py-16 px-6">
        <div className="space-y-10">
          {members.map((member, index) => {
            const cardBgClass = member.isDarkBg 
              ? "bg-stone-900/40 border-stone-850" 
              : "bg-stone-900/80 border-stone-800";

            return (
              <div 
                key={index} 
                className={`rounded-2xl border overflow-hidden shadow-xl transition-all duration-300 hover:border-stone-700 hover:translate-y-[-2px] ${cardBgClass}`}
              >
                <div className="flex flex-col md:flex-row gap-8 p-8 items-start">
                  
                  {/* Portrait Image Container */}
                  <div className="w-full md:w-[180px] flex-shrink-0 flex justify-center md:justify-start">
                    {member.img ? (
                      <div className="relative w-36 h-36 md:w-full md:aspect-[3/4] rounded-xl overflow-hidden bg-stone-850 border border-stone-700 shadow-inner">
                        <Image
                          src={member.img}
                          alt={member.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 144px, 180px"
                          unoptimized={member.img.includes('.heic')}
                        />
                      </div>
                    ) : (
                      <div className="w-36 h-36 md:w-full md:aspect-square rounded-xl bg-gradient-to-br from-[#FFB81C]/20 to-transparent flex items-center justify-center border border-dashed border-[#FFB81C]/30 flex-shrink-0">
                        <span className="text-5xl font-black text-[#FFB81C]">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bio Detail Section */}
                  <div className="flex-grow w-full">
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white mb-1">
                      {member.name}
                    </h2>
                    <p className="text-[#FFB81C] font-semibold text-xs uppercase tracking-widest mb-4">
                      {member.role}
                    </p>
                    
                    <div className="leading-relaxed text-sm md:text-base text-stone-300 font-light space-y-4 whitespace-pre-line">
                      {member.bio}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ACTION FOOTER */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="pt-16 border-t border-stone-800 flex flex-wrap gap-8 items-center justify-center">
          <Link 
            href="/about/staff" 
            className="px-10 py-5 bg-[#FFB81C] text-black text-xs font-black uppercase tracking-widest hover:bg-yellow-500 transition-all rounded-lg"
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