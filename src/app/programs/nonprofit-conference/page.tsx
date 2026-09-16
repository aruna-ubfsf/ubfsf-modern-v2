import { getPageBySlugGraphQL, getPageRenderedHtml } from "@/lib/wordpress/graphql-client";
import * as cheerio from 'cheerio';
import { parseConferenceContent } from "@/lib/wordpress/parse-nonprofit-conference";
import ConferenceAudioPlayer from "@/components/ConferenceAudioPlayer";

export const revalidate = 60;

function getDescription(renderedHtml: string): string {
  if (renderedHtml) {
    const $ = cheerio.load(renderedHtml);
    const firstPara = $('p').first().text().trim();
    if (firstPara) return firstPara.slice(0, 160);
    const text = $("body").text().replace(/\s+/g, ' ').trim();
    return text.slice(0, 160);
  }
  return '';
}

export default async function NonprofitConferencePage() {
  const page = await getPageBySlugGraphQL("nonprofit-conference");
  if (!page) {
    return (
      <main className="min-h-screen bg-white dark:bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-stone-600">Content not available</div>
      </main>
    );
  }
  const renderedHtml = await getPageRenderedHtml(page.uri || '/nonprofit-conference/');
  const description = getDescription(renderedHtml);
  const { panelists } = parseConferenceContent(page.content || '');

  return (
    <main className="min-h-screen bg-white dark:bg-[#1a1a1a]">
      <section className="relative h-[60vh] flex items-center justify-center text-center bg-black">
        <div className="relative z-10 max-w-4xl px-6">
          <div className="inline-block bg-[#D4A017] text-black px-4 py-1 text-xs font-bold uppercase tracking-widest mb-4">
            Programs
          </div>
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6">
            {page.title}
          </h1>
          {description && (
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
              {description}
            </p>
          )}
          <a href="#content" className="inline-block bg-[#D4A017] text-black font-black px-8 py-4 uppercase text-xs tracking-widest hover:bg-[#B98A2D] transition-all">
            Learn More
          </a>
        </div>
      </section>

      <section className="py-20 px-6" id="content">
        <div className="max-w-6xl mx-auto space-y-20">
          {panelists.length > 0 ? (
            panelists.map((p, idx) => (
              <div key={idx} className={`${idx % 2 === 1 ? 'bg-black text-white' : 'bg-white dark:bg-[#1a1a1a]'} rounded-2xl p-8 md:p-12`}>
                <div className="grid md:grid-cols-3 gap-8 items-start">
                  {p.image && (
                    <div className="md:col-span-1">
                      <img src={p.image} alt={p.name} className="w-full rounded-lg object-cover" />
                    </div>
                  )}
                  <div className="md:col-span-2">
                    <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">{p.name}</h2>
                    <audio controls preload="metadata">
                      {p.clips.map((c, i) => (
                        <source key={i} src={c.src} type={c.src.split('?')[0].toLowerCase().endsWith('.m4a') ? 'audio/mp4' : undefined} />
                      ))}
                    </audio>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p>No audio panelists found.</p>
            </div>
          )}
          <div className="mt-12 flex gap-4">
            <a href="/programs" className="px-6 py-3 bg-[#D4A017] text-black font-bold">
              View All Programs
            </a>
            <a href="/donate" className="px-6 py-3 border border-[#D4A017] text-[#D4A017] font-bold">
              Donate Now
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
