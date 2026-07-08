import { getPageBySlug } from '@/lib/wordpress';
import { notFound } from 'next/navigation';

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) return notFound();

  return (
    <main className="min-h-screen">
      <header className="bg-ubfsf-zinc text-white py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85]">{page.title}</h1>
          <div className="h-2 w-24 bg-ubfsf-gold mt-10"></div>
        </div>
      </header>
      <section className="max-w-5xl mx-auto py-20 px-6">
        {/* The 'prose' class now works with the nuclear cleaner to show ONLY text/images */}
        <div 
          className="prose prose-zinc lg:prose-xl max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: page.content }} 
        />
      </section>
    </main>
  );
}
