// src/app/programs/rebuild/page.tsx
import Image from "next/image";
import Link from "next/link";
import { getPageBySlug } from "@/lib/wordpress/pages";
import { getWpImageUrl } from "@/lib/wordpress/client";

interface TeamMember {
  name: string;
  role?: string;
  image: string;
  link: string;
}

function parseRebuildContent(content: string) {
  const cleanContent = content
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8211;/g, "–")
    .replace(/&#038;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ");

  let title = '';
  let description = '';
  let programObjectives: string[] = [];
  let whyItMatters = '';
  let goals: string[] = [];
  let teamMembers: TeamMember[] = [];
  let heroImage = '';

  // Extract Hero Image
  const imageMatch = cleanContent.match(/\[et_pb_image[^\]]*src=["']([^"']+)["']/);
  if (imageMatch) {
    heroImage = getWpImageUrl(imageMatch[1]);
  }

  // Extract Title from heading
  const titleMatch = cleanContent.match(/title_suffix=["']([^"']+)["']/);
  if (titleMatch) {
    title = titleMatch[1];
  }

  // Extract description from first text block
  const textMatches = cleanContent.match(/\[et_pb_text[^\]]*\]([\s\S]*?)\[\/et_pb_text\]/g) || [];
  let descriptionTexts: string[] = [];

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

    if (text) {
      descriptionTexts.push(text);
    }
  }

  // Combine description texts
  if (descriptionTexts.length > 0) {
    // Skip the first one if it's just the title
    let startIdx = 0;
    if (descriptionTexts[0].includes('Reinvesting in Every Black')) {
      startIdx = 1;
    }
    description = descriptionTexts.slice(startIdx).join('\n\n');
  }

  // Extract Program Objectives (from the black section)
  const objectivesMatch = cleanContent.match(/Program Objectives[\s\S]*?<ul>([\s\S]*?)<\/ul>/);
  if (objectivesMatch) {
    const items = objectivesMatch[1].match(/<li[^>]*>([\s\S]*?)<\/li>/g);
    if (items) {
      programObjectives = items.map(item => 
        item.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()
      );
    }
  }

  // Extract Why It Matters
  const mattersMatch = cleanContent.match(/Why R\.E\.B\.U\.I\.L\.D\. Matters[\s\S]*?<p>([\s\S]*?)<\/p>/);
  if (mattersMatch) {
    whyItMatters = mattersMatch[1]
      .replace(/<[^>]*>/g, '')
      .replace(/&#822[01];/g, '"')
      .replace(/&#8217;/g, "'")
      .replace(/&#8211;/g, "–")
      .replace(/&#038;/g, "&")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim();
  }

  // Extract Goals
  const goalsMatch = cleanContent.match(/Program Goals[\s\S]*?<ul>([\s\S]*?)<\/ul>/);
  if (goalsMatch) {
    const items = goalsMatch[1].match(/<li[^>]*>([\s\S]*?)<\/li>/g);
    if (items) {
      goals = items.map(item => 
        item.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()
      );
    }
  }

  // Extract Team Members from et_pb_team_member
  const teamRegex = /\[et_pb_team_member[^\]]*name="([^"]+)"[^\]]*image_url="([^"]+)"[^\]]*link_option_url="([^"]+)"[^\]]*\]/g;
  let teamMatch;
  while ((teamMatch = teamRegex.exec(cleanContent)) !== null) {
    teamMembers.push({
      name: teamMatch[1],
      image: getWpImageUrl(teamMatch[2]),
      link: teamMatch[3] || '#'
    });
  }

  return {
    title,
    description,
    programObjectives,
    whyItMatters,
    goals,
    teamMembers,
    heroImage
  };
}

export default async function RebuildPage() {
  const page = await getPageBySlug('rebuild');

  if (!page) {
    return (
      <main className="min-h-screen bg-white dark:bg-[#1a1a1a] flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </main>
    );
  }

  const {
    title,
    description,
    programObjectives,
    whyItMatters,
    goals,
    teamMembers,
    heroImage
  } = parseRebuildContent(page.content);

  return (
    <main className="min-h-screen bg-white dark:bg-[#1a1a1a] text-black dark:text-[#f4f4f4] transition-colors duration-300 font-serif">
      
      {/* HERO SECTION */}
      <header className="relative h-[50vh] flex items-end pb-20 px-6 md:px-20 overflow-hidden border-b border-black/10 dark:border-white/10">
        {heroImage && (
          <div className="absolute inset-0 z-0">
            <Image 
              src={heroImage} 
              alt="R.E.B.U.I.L.D. Program"
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
            UBFSF Initiative
          </span>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-4">
            R.E.B.U.I.L.D.
          </h1>
          <p className="text-lg md:text-xl text-stone-600 dark:text-stone-400 max-w-2xl font-light">
            Reinvesting in Every Black and Underserved Institution to Liberate and Diversify
          </p>
        </div>
      </header>

      {/* CONTENT SECTION */}
      <section className="max-w-7xl mx-auto py-16 px-6 md:px-20">
        
        {/* Description */}
        {description && (
          <div className="max-w-4xl mx-auto mb-16">
            <div className="text-stone-600 dark:text-stone-400 leading-relaxed text-lg space-y-4">
              {description.split('\n').map((paragraph, i) => (
                paragraph.trim() && <p key={i}>{paragraph.trim()}</p>
              ))}
            </div>
          </div>
        )}

        {/* Program Objectives - Black Section */}
        {programObjectives.length > 0 && (
          <div className="bg-black dark:bg-[#0a0a0a] text-white rounded-2xl p-8 md:p-12 mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#FFB81C]">Program Objectives</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {programObjectives.map((objective, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                  <span className="text-[#FFB81C] text-xl mt-1">✦</span>
                  <span className="text-white/90">{objective}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Why It Matters */}
        {whyItMatters && (
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center border-b border-black/10 dark:border-white/10 pb-4">
              Why R.E.B.U.I.L.D. Matters
            </h2>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-lg">
              {whyItMatters}
            </p>
          </div>
        )}

        {/* Program Goals */}
        {goals.length > 0 && (
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center border-b border-black/10 dark:border-white/10 pb-4">
              Program Goals
            </h2>
            <div className="space-y-4">
              {goals.map((goal, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-stone-50 dark:bg-[#2a2a2a] rounded-xl border border-black/5 dark:border-white/5">
                  <span className="text-[#FFB81C] text-2xl font-bold">{i + 1}.</span>
                  <span className="text-stone-600 dark:text-stone-400 leading-relaxed">{goal}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Team Members */}
        {teamMembers.length > 0 && (
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center border-b border-black/10 dark:border-white/10 pb-4">
              R.E.B.U.I.L.D. Program &amp; Public Policy Volunteers
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {teamMembers.map((member, index) => (
                <Link
                  key={index}
                  href={member.link}
                  className="group flex flex-col items-center text-center"
                >
                  <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-stone-200 dark:bg-stone-800 border-2 border-transparent group-hover:border-[#FFB81C] transition-all duration-300">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 128px, 160px"
                    />
                  </div>
                  <span className="mt-2 text-sm font-semibold text-black dark:text-white group-hover:text-[#FFB81C] transition-colors">
                    {member.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {/* ACTION FOOTER */}
        <div className="mt-16 pt-16 border-t border-black/10 dark:border-white/10 flex flex-wrap gap-8 items-center justify-center">
          <Link 
            href="/contact" 
            className="px-10 py-5 bg-[#FFB81C] text-black text-xs font-black uppercase tracking-widest hover:bg-yellow-500 transition-all"
          >
            Get Involved
          </Link>
          <p className="text-stone-500 font-bold uppercase tracking-widest text-[10px]">
            Help us rebuild communities from within.
          </p>
        </div>
      </section>
    </main>
  );
}