import { getPageBySlug } from '@/lib/wordpress/page';
import { notFound } from 'next/navigation';

export default async function ProgramsPage() {
  const page = await getPageBySlug('rebuild') || await getPageBySlug('programs');

  if (!page) return notFound();

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      <header className="bg-ubfsf-zinc text-white py-24 px-6 md:py-32">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85]">
            Our <span className="text-ubfsf-gold">Impact</span>
          </h1>
          <p className="mt-8 text-zinc-400 font-bold uppercase tracking-widest text-xs">United Black Family Scholarship Foundation Initiatives</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto py-20 px-6">
        <article className="bg-zinc-50 dark:bg-zinc-900 p-8 md:p-16 border border-zinc-100 dark:border-zinc-800 shadow-2xl">
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-8 text-ubfsf-gold">
            {page.title}
          </h2>
          <div 
            className="prose prose-zinc lg:prose-xl max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: page.content }} 
          />
        </article>
      </section>
    </main>
  );
}
