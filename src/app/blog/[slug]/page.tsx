// src/app/blog/[slug]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { getPostBySlug } from '@/lib/wordpress';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  return (
    <main className="min-h-screen bg-white dark:bg-[#1a1a1a] text-black dark:text-[#f4f4f4] transition-colors duration-300 font-serif selection:bg-[#FFB81C]/30">
      
      {/* HERO SECTION - Single Post */}
      <header className="relative h-[50vh] flex items-end pb-16 px-6 md:px-20 overflow-hidden border-b border-black/10 dark:border-white/10 bg-gradient-to-b from-stone-50 dark:from-stone-900 to-white dark:to-[#1a1a1a]">
        {post.image && (
          <div className="absolute inset-0 z-0">
            <Image 
              src={post.image} 
              alt={post.title}
              fill
              className="object-cover opacity-20 grayscale"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#1a1a1a] to-transparent" />
          </div>
        )}
        
        <div className="relative z-10 max-w-4xl mx-auto w-full">
          <Link 
            href="/blog" 
            className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#FFB81C] hover:underline mb-4"
          >
            ← Back to Newsroom
          </Link>
          <time className="block text-sm text-stone-500 dark:text-stone-400 mb-3">
            {new Date(post.date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </time>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[1.1] mb-4">
            {post.title}
          </h1>
        </div>
      </header>

      {/* POST CONTENT */}
      <section className="max-w-4xl mx-auto py-16 px-6">
        {/* Featured Image at top of content if exists */}
        {post.image && (
          <div className="relative w-full h-80 md:h-[400px] rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 mb-8 shadow-lg">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1200px"
              priority
            />
          </div>
        )}
        
        {/* Content */}
        <div 
          className="prose prose-lg dark:prose-invert max-w-none font-serif
            prose-headings:font-black prose-headings:tracking-tight prose-headings:uppercase
            prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
            prose-p:text-stone-700 dark:prose-p:text-stone-300
            prose-a:text-[#FFB81C] prose-a:no-underline hover:prose-a:underline
            prose-strong:text-black dark:prose-strong:text-white
            prose-ul:text-stone-700 dark:prose-ul:text-stone-300
            prose-li:text-stone-700 dark:prose-li:text-stone-300
            prose-blockquote:border-l-[#FFB81C] prose-blockquote:text-stone-600 dark:prose-blockquote:text-stone-400
            prose-img:rounded-2xl prose-img:shadow-lg"
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
      </section>

      {/* ACTION FOOTER */}
      <section className="max-w-7xl mx-auto px-6 md:px-20 pb-16">
        <div className="max-w-4xl mx-auto pt-16 border-t border-black/10 dark:border-white/10 flex flex-wrap gap-8 items-center justify-center">
          <Link 
            href="/blog" 
            className="px-10 py-5 bg-[#FFB81C] text-black text-xs font-black uppercase tracking-widest hover:bg-yellow-500 transition-all rounded"
          >
            ← Back to Newsroom
          </Link>
          <p className="text-stone-500 font-bold uppercase tracking-widest text-[10px]">
            Stay informed with UBFSF.
          </p>
        </div>
      </section>
    </main>
  );
}