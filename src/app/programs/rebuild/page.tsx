// src/app/programs/rebuild/page.tsx
import Image from "next/image";
import Link from "next/link";
import { getPageBySlug } from "@/lib/wordpress/pages";
import { getWpImageUrl } from "@/lib/wordpress/client";
import RebuildCinematicScrollerWrapper from "@/components/RebuildCinematicScrollerWrapper";
import { RebuildCyclist } from "@/components/RebuildCyclist";
import FadeIn from "@/components/FadeIn";

interface TeamMember { name: string; role?: string; image: string; link: string; }
interface Volunteer { name: string; bio: string; image: string; }
interface RebuildData { title: string; subtitle: string; description: string; heroImage: string; programObjectives: string[]; whyItMatters: string; goals: string[]; teamMembers: TeamMember[]; corePillars: { title: string; description: string }[]; communityChallenges: string[]; volunteers: Volunteer[]; contactInfo: { phone: string; address: string; email: string; }; }

function parseRebuildContent(content: string): RebuildData {
  const cleanContent = content.replace(/&#8220;/g, '"').replace(/&#8221;/g, '"').replace(/&#8217;/g, "'").replace(/&#8211;/g, "–").replace(/&#038;/g, "&").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ");
  const data: RebuildData = { title: 'R.E.B.U.I.L.D.', subtitle: 'Reinvesting in Every Black and Underserved Institution', description: '', heroImage: '', programObjectives: [], whyItMatters: '', goals: [], teamMembers: [], corePillars: [{ title: 'Community Preservation', description: 'Understanding neighborhood needs.' }, { title: 'Housing & Revitalization', description: 'Expanding beyond new construction.' }, { title: 'Youth Workforce', description: 'Youth as participants.' }, { title: 'Legacy & Home Preservation', description: 'Preserving generational wealth.' }], communityChallenges: ['Historic housing discrimination.', 'Vacant properties.', 'Affordability concerns.'], volunteers: [], contactInfo: { phone: '1-918-924-5872', address: 'P.O. BOX 862 BRISTOW OK 74010', email: 'news@ubfsf.org' } };
  const imageMatch = cleanContent.match(/\[et_pb_image[^\]]*src=["']([^"']+)["']/); if (imageMatch) data.heroImage = getWpImageUrl(imageMatch[1]);
  const titleMatch = cleanContent.match(/title_suffix=["'']+["']/); if (titleMatch) data.title = titleMatch[1];
  const textMatches = cleanContent.match(/\[et_pb_text[^\]]*\]([\s\S]*?)\[\/et_pb_text\]/g) || []; let desc: string[] = [];
  for (const t of textMatches) { const txt = t.replace(/\[et_pb_text[^\]]*\]/, '').replace(/\[\/et_pb_text\]/, '').replace(/<[^>]*>/g, '').replace(/\s+/g, " ").trim(); if (txt) desc.push(txt); }
  if (desc.length > 0) data.description = desc.slice(1).join('\n\n');
  const objMatch = cleanContent.match(/Program Objectives[\s\S]*?<ul>([\s\S]*?)<\/ul>/); if (objMatch) { const items = objMatch[1].match(/<li[^>]*>([\s\S]*?)<\/li>/g); if (items) data.programObjectives = items.map(i => i.replace(/<[^>]*>/g, '').trim()); }
  const whyMatch = cleanContent.match(/Why R\.E\.B\.U\.I\.L\.D\. Matters[\s\S]*?<p>([\s\S]*?)<\/p>/); if (whyMatch) data.whyItMatters = whyMatch[1].replace(/<[^>]*>/g, '').trim();
  const goalsMatch = cleanContent.match(/Program Goals[\s\S]*?<ul>([\s\S]*?)<\/ul>/); if (goalsMatch) { const items = goalsMatch[1].match(/<li[^>]*>([\s\S]*?)<\/li>/g); if (items) data.goals = items.map(i => i.replace(/<[^>]*>/g, '').trim()); }
  return data;
}

export const metadata = { title: 'R.E.B.U.I.L.D. | UBFSF', description: 'R.E.B.U.I.L.D. is UBFSF initiative.' };

export default async function RebuildPage() {
  const page = await getPageBySlug('rebuild');
  if (!page) return (<main className="min-h-screen bg-white dark:bg-[#1a1a1a] flex items-center justify-center"><div className="animate-pulse text-stone-600">Loading...</div></main>);
  const data = parseRebuildContent(page.content);
  const paras = data.description.split('\n\n').filter(Boolean);
  const scrollerSections = [
    { id: 'act-1', label: 'What it stands for', start: 0.0, end: 0.22, title: data.title, description: data.subtitle },
    { id: 'act-2', label: 'The mission', start: 0.25, end: 0.52, title: 'Community Preservation', description: paras[0] || '' },
    { id: 'act-3', label: 'The framework', start: 0.55, end: 0.82, title: 'Four Pillars', description: 'Community — Housing — Youth — Legacy.' },
    { id: 'act-4', label: 'Call to Action', start: 0.85, end: 1.0, title: 'Join Us', description: 'Partner with REBUILD.' }
  ];
  return (
    <main className="min-h-screen bg-white dark:bg-[#1a1a1a] text-black dark:text-[#f4f4f4]">
      <header className="relative h-[50vh] flex items-end pb-20 px-6 md:px-20 overflow-hidden border-b border-black/10 dark:border-white/10">
        {data.heroImage && (<div className="absolute inset-0 z-0"><Image src={data.heroImage} alt={data.title} fill className="object-cover" priority /><div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#1a1a1a] via-white/60 dark:via-[#1a1a1a]/60 to-transparent" /></div>)}
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <span className="inline-block bg-[#D4A017] text-black px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] mb-6">UBFSF Initiative</span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85] mb-4 text-black dark:text-white">{data.title}</h1>
          <p className="text-lg md:text-xl text-stone-600 dark:text-stone-400 max-w-2xl font-light">{data.subtitle}</p>
        </div>
      </header>
      <RebuildCinematicScrollerWrapper sections={scrollerSections} />

      <section className="max-w-7xl mx-auto px-6 md:px-20 py-20">
        <div className="max-w-4xl mx-auto">
          {data.description && (<FadeIn><div className="mb-16"><h2 className="text-2xl md:text-3xl font-bold mb-6 text-black dark:text-white">About R.E.B.U.I.L.D.</h2><div className="h-px w-12 bg-[#D4A017] mb-8" /><div className="space-y-6 text-stone-700 dark:text-stone-300 leading-relaxed">{paras.map((p, i) => (<p key={i} className="text-lg">{p}</p>))}</div></div></FadeIn>)}
          <FadeIn><div className="mb-16"><h2 className="text-2xl md:text-3xl font-bold mb-6 text-black dark:text-white">Core Pillars</h2><div className="h-px w-12 bg-[#D4A017] mb-8" /><div className="grid md:grid-cols-2 gap-8">{data.corePillars.map((p, i) => (<div key={i} className="p-6 bg-stone-50 dark:bg-[#2a2a2a] rounded-xl border border-black/10 dark:border-white/10"><h3 className="text-xl font-bold mb-3 text-[#D4A017]">{p.title}</h3><p className="text-stone-600 dark:text-stone-400 leading-relaxed">{p.description}</p></div>))}</div></div></FadeIn>
          {data.programObjectives.length > 0 && (<FadeIn><div className="bg-stone-50 dark:bg-[#2a2a2a] rounded-2xl p-8 md:p-12 mb-16"><h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#D4A017]">Program Objectives</h2><div className="grid md:grid-cols-2 gap-4">{data.programObjectives.map((o, i) => (<div key={i} className="flex items-start gap-3 p-3"><span className="text-[#D4A017] text-xl">✦</span><span className="text-stone-700 dark:text-stone-300">{o}</span></div>))}</div></div></FadeIn>)}
          {data.whyItMatters && (<FadeIn><div className="mb-16"><h2 className="text-2xl md:text-3xl font-bold mb-6 text-center border-b border-black/10 dark:border-white/10 pb-4 text-black dark:text-white">Why R.E.B.U.I.L.D. Matters</h2><p className="text-stone-600 dark:text-stone-400 leading-relaxed text-lg">{data.whyItMatters}</p></div></FadeIn>)}
          {data.goals.length > 0 && (<FadeIn><div className="mb-16"><h2 className="text-2xl md:text-3xl font-bold mb-6 text-center border-b border-black/10 dark:border-white/10 pb-4 text-black dark:text-white">Program Goals</h2><div className="space-y-4">{data.goals.map((g, i) => (<div key={i} className="flex items-start gap-4 p-4 bg-stone-50 dark:bg-[#2a2a2a] rounded-xl border border-black/5 dark:border-white/5"><span className="text-[#D4A017] text-2xl font-bold">{i + 1}.</span><span className="text-stone-600 dark:text-stone-400">{g}</span></div>))}</div></div></FadeIn>)}
          <FadeIn><div className="mb-16"><h2 className="text-2xl md:text-3xl font-bold mb-6 text-black dark:text-white">Community Challenges</h2><div className="h-px w-12 bg-[#D4A017] mb-8" /><div className="space-y-4">{data.communityChallenges.map((c, i) => (<div key={i} className="flex items-start gap-3 p-4 bg-stone-50 dark:bg-[#2a2a2a] rounded-xl border border-black/5 dark:border-white/5"><span className="text-[#D4A017]">•</span><span className="text-stone-600 dark:text-stone-400">{c}</span></div>))}</div></div></FadeIn>
          <div className="mt-16 pt-16 border-t border-black/10 dark:border-white/10 flex flex-wrap gap-8 items-center justify-center"><Link href="/contact" className="px-10 py-5 bg-[#D4A017] text-black text-xs font-black uppercase tracking-widest hover:bg-[#B98A2D]">Get Involved</Link><p className="text-stone-500 font-bold uppercase tracking-widest text-[10px]">Help us rebuild communities from within.</p></div>
        </div>
      </section>
      <RebuildCyclist />
    </main>
  );
}