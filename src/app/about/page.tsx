import { getLocalPageBySlug } from '@/lib/wordpress';
import { notFound } from 'next/navigation';

export default async function AboutPage() {
  const page = await getLocalPageBySlug('about-ubfsf'); 

  if (!page) return notFound();

  return (
    <main className="max-w-4xl mx-auto py-24 px-6">
      <h1 className="text-6xl font-black uppercase tracking-tighter mb-12 text-zinc-900 leading-none">
        {page.title}
      </h1>
      <div 
        className="prose prose-zinc lg:prose-xl max-w-none prose-img:rounded-2xl prose-img:shadow-2xl"
        dangerouslySetInnerHTML={{ __html: page.content }} 
      />
    </main>
  );
}
