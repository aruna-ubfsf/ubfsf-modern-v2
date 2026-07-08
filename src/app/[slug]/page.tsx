import { getPageBySlug } from '@/lib/wordpress';
import { notFound } from 'next/navigation';

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) return notFound();

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 transition-colors">
      <header className="bg-ubfsf-zinc text-white py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-white">
            {page.title}
          </h1>
          <div className="h-2 w-24 bg-ubfsf-gold mt-10"></div>
        </div>
      </header>
      <section className="max-w-5xl mx-auto py-20 px-6">
        <div 
          className="prose prose-zinc lg:prose-xl max-w-none dark:prose-invert 
          prose-headings:text-[var(--foreground)] prose-p:text-[var(--foreground)]/80"
          dangerouslySetInnerHTML={{ __html: page.content }} 
        />
      </section>
    </main>
  );
}
