import { getPostBySlug } from '@/lib/wordpress';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 py-24 px-6 text-zinc-900 dark:text-zinc-50">
      <article className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">{post.title}</h1>
        <time className="text-sm text-zinc-400 block mb-12">{new Date(post.date).toLocaleDateString()}</time>
        <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </main>
  );
}