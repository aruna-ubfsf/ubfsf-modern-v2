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

  // Clean the content - preserve HTML formatting
  const cleanContent = post.content
    .replace(/\[…\]/g, '')
    .replace(/\[\...\]/g, '')
    .replace(/&nbsp;/g, ' ')
    // Fix common WordPress formatting issues
    .replace(/<p><\/p>/g, '')
    .replace(/\n/g, '');

  // Extract the author from content if available
  const authorMatch = cleanContent.match(/By\s+([^<]+)/i);
  const author = authorMatch ? authorMatch[1].trim() : 'UBFSF Staff';

  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0a] text-black dark:text-[#f4f4f4] transition-colors duration-300 font-serif selection:bg-[#D4A017]/30">
      
      {/* HERO SECTION - Single Post */}
      <header className="relative h-[50vh] flex items-end pb-16 px-6 md:px-20 overflow-hidden border-b border-black/10 dark:border-white/10 bg-gradient-to-b from-stone-50 dark:from-[#141414] to-white dark:to-[#0a0a0a]">
        {post.image && (
          <div className="absolute inset-0 z-0">
            <Image 
              src={post.image} 
              alt={post.title}
              fill
              className="object-cover opacity-10 dark:opacity-20 grayscale"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0a0a0a] to-transparent" />
          </div>
        )}
        
        <div className="relative z-10 max-w-4xl mx-auto w-full">
          <Link 
            href="/blog" 
            className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#D4A017] hover:underline mb-4"
          >
            ← Back to Newsroom
          </Link>
          <time className="block text-sm text-stone-500 dark:text-stone-300 mb-3">
            {new Date(post.date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </time>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[1.1] mb-4 text-black dark:text-white">
            {post.title}
          </h1>
          <p className="text-base text-stone-600 dark:text-stone-400 font-light">
            By {author}
          </p>
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
        
        {/* Content with proper formatting */}
        <article className="prose prose-lg dark:prose-invert max-w-none font-serif
          prose-headings:font-black prose-headings:tracking-tight prose-headings:uppercase
          prose-headings:text-black dark:prose-headings:text-white
          prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
          prose-p:text-stone-700 dark:prose-p:text-stone-200
          prose-p:leading-relaxed prose-p:mb-6
          prose-a:text-[#D4A017] prose-a:no-underline hover:prose-a:underline
          prose-strong:text-black dark:prose-strong:text-white prose-strong:font-bold
          prose-ul:text-stone-700 dark:prose-ul:text-stone-200
          prose-li:text-stone-700 dark:prose-li:text-stone-200 prose-li:mb-2
          prose-blockquote:border-l-4 prose-blockquote:border-l-[#D4A017] 
          prose-blockquote:text-stone-600 dark:prose-blockquote:text-stone-300
          prose-blockquote:bg-stone-50 dark:prose-blockquote:bg-[#141414]
          prose-blockquote:p-6 prose-blockquote:rounded-lg prose-blockquote:my-8
          prose-blockquote:font-light prose-blockquote:italic
          prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-8
          prose-code:text-stone-700 dark:prose-code:text-stone-200
          prose-code:bg-stone-100 dark:prose-code:bg-[#141414]
          prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
          prose-pre:bg-stone-900 dark:prose-pre:bg-black
          prose-pre:text-stone-100 prose-pre:rounded-lg prose-pre:p-4
          prose-hr:border-stone-200 dark:prose-hr:border-stone-700 prose-hr:my-12
          [&_*]:text-black dark:[&_*]:text-white
          [&_p]:text-stone-700 dark:[&_p]:text-stone-200
          [&_li]:text-stone-700 dark:[&_li]:text-stone-200
          [&_strong]:text-black dark:[&_strong]:text-white
          [&_h1]:text-black dark:[&_h1]:text-white
          [&_h2]:text-black dark:[&_h2]:text-white
          [&_h3]:text-black dark:[&_h3]:text-white
          [&_h4]:text-black dark:[&_h4]:text-white
          [&_blockquote_p]:text-stone-600 dark:[&_blockquote_p]:text-stone-300
          [&_blockquote_p]:italic
          [&_a]:text-[#D4A017] dark:[&_a]:text-[#D4A017]
          [&_figcaption]:text-stone-500 dark:[&_figcaption]:text-stone-400
          [&_figcaption]:text-sm [&_figcaption]:text-center [&_figcaption]:mt-2
          [&_ul]:list-disc [&_ul]:pl-6
          [&_ol]:list-decimal [&_ol]:pl-6"
          dangerouslySetInnerHTML={{ __html: cleanContent }} 
        />
      </section>

      {/* ACTION FOOTER */}
      <section className="max-w-7xl mx-auto px-6 md:px-20 pb-16">
        <div className="max-w-4xl mx-auto pt-16 border-t border-black/10 dark:border-white/10 flex flex-wrap gap-8 items-center justify-center">
          <Link 
            href="/blog" 
            className="px-10 py-5 bg-[#D4A017] text-black text-xs font-black uppercase tracking-widest hover:bg-[#B98A2D] transition-all rounded"
          >
            ← Back to Newsroom
          </Link>
          <p className="text-stone-500 dark:text-stone-400 font-bold uppercase tracking-widest text-[10px]">
            Stay informed with UBFSF.
          </p>
        </div>
      </section>
    </main>
  );
}