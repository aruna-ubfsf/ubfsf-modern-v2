// src/app/blog/page.tsx
import Image from "next/image";
import Link from "next/link";
import { getPosts } from '@/lib/wordpress';

// Helper to clean and truncate text
function truncateText(text: string, maxLength: number = 200): string {
  if (!text) return '';
  // Remove HTML tags
  const cleanText = text.replace(/<[^>]*>/g, '');
  // Remove [...] and other artifacts
  const cleaned = cleanText.replace(/\[…\]/g, '').replace(/\[\...\]/g, '').trim();
  if (cleaned.length <= maxLength) return cleaned;
  return cleaned.substring(0, maxLength) + '...';
}

export default async function BlogArchive() {
  const posts = await getPosts(12);

  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0a] text-black dark:text-[#f4f4f4] transition-colors duration-300 font-serif selection:bg-[#D4A017]/30">
      
      {/* HERO SECTION */}
      <header className="relative h-[40vh] flex items-end pb-16 px-6 md:px-20 overflow-hidden border-b border-black/10 dark:border-white/10 bg-gradient-to-b from-stone-50 dark:from-[#141414] to-white dark:to-[#0a0a0a]">
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <span className="inline-block bg-[#D4A017] text-black px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            Latest Updates
          </span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85] mb-4 text-black dark:text-white">
            <span className="text-[#D4A017]">News</span>room
          </h1>
          <p className="text-lg md:text-xl text-stone-600 dark:text-stone-300 max-w-2xl font-light">
            Stories, updates, and insights from the United Black Family Scholarship Foundation.
          </p>
        </div>
      </header>

      {/* BLOG GRID */}
      <section className="max-w-7xl mx-auto py-16 px-6 md:px-20">
        <div className="max-w-6xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-stone-500 dark:text-stone-400">No posts found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => {
                // Get clean excerpt or use truncated content
                let excerptText = post.excerpt || post.content || '';
                // Clean the excerpt
                const cleanExcerpt = truncateText(excerptText, 180);
                
                return (
                  <Link 
                    key={post.id} 
                    href={`/blog/${post.slug}`} 
                    className="group"
                  >
                    <article className="bg-stone-50 dark:bg-[#141414] rounded-2xl border border-black/5 dark:border-white/10 overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] h-full flex flex-col">
                      
                      {/* Featured Image */}
                      {post.image && (
                        <div className="relative w-full h-56 overflow-hidden bg-stone-200 dark:bg-stone-800">
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        </div>
                      )}
                      
                      <div className="p-6 flex flex-col flex-grow">
                        {/* Date */}
                        <time className="text-[10px] font-bold uppercase tracking-widest text-[#D4A017] mb-2">
                          {new Date(post.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </time>
                        
                        {/* Title */}
                        <h2 className="text-xl font-bold tracking-tight mb-2 text-black dark:text-white group-hover:text-[#D4A017] transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                        
                        {/* Excerpt - Show clean text */}
                        {cleanExcerpt && (
                          <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed flex-grow">
                            {cleanExcerpt}
                          </p>
                        )}
                        
                        {/* Read More */}
                        <span className="inline-block mt-4 text-xs font-bold uppercase tracking-widest text-[#D4A017] group-hover:underline">
                          Read More →
                        </span>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ACTION FOOTER */}
      <section className="max-w-7xl mx-auto px-6 md:px-20 pb-16">
        <div className="pt-16 border-t border-black/10 dark:border-white/10 flex flex-wrap gap-8 items-center justify-center">
          <Link 
            href="/contact" 
            className="px-10 py-5 bg-[#D4A017] text-black text-xs font-black uppercase tracking-widest hover:bg-[#B98A2D] transition-all rounded"
          >
            Get Involved
          </Link>
          <p className="text-stone-500 dark:text-stone-400 font-bold uppercase tracking-widest text-[10px]">
            Join us in building stronger communities.
          </p>
        </div>
      </section>
    </main>
  );
}