import { getPageBySlugGraphQL, getPageRenderedHtml } from "@/lib/wordpress/graphql-client";
import { cleanWPContent } from "@/lib/wordpress/client";
import ShortcodeRenderer from "@/components/ShortcodeRenderer";
import * as cheerio from 'cheerio';

export const revalidate = 60;

function extractFirstImageFromHtml(html: string): string | null {
  if (!html) return null;
  const imgMatch = html.match(/<img[^>]+src=[\"']([^\"']+)[\"']/i);
  if (imgMatch) return imgMatch[1];
  return null;
}

function getDescription(page: any, renderedHtml: string): string {
  if (renderedHtml) {
    const $ = cheerio.load(renderedHtml);
    const firstPara = $('p').first().text().trim();
    if (firstPara) return firstPara.slice(0, 160);
    const text = $("body").text().replace(/\s+/g, ' ').trim();
    return text.slice(0, 160);
  }
  return '';
}

export default async function CoachingPage() {
  const page = await getPageBySlugGraphQL("nonprofit-conference");
  
  if (!page) {
    return (
      <main className="min-h-screen bg-white dark:bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-stone-600">Content not available</div>
      </main>
    );
  }

  const renderedHtml = await getPageRenderedHtml(page.uri || '/nonprofit-conference/');
  const content = cleanWPContent(renderedHtml || page.content || "");

  const description = getDescription(page, renderedHtml);

  return (
    <main className="min-h-screen bg-white dark:bg-[#1a1a1a]">
      {/* HERO */}
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

      {/* CONTENT */}
      <section className="py-20 px-6" id="content">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
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
