import { getPosts, getPageBySlug } from '@/lib/wordpress';
import Link from 'next/link';

export default async function HomePage() {
  // Fetching the refactored data from the live API
  const posts = await getPosts(6);
  
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 transition-colors">
      <section className="py-32 px-6 text-center border-b border-zinc-100 dark:border-zinc-900">
        <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] text-[var(--foreground)]">
          Rebuilding <br /> <span className="text-ubfsf-gold">Community</span>
        </h1>
        <p className="mt-10 text-zinc-500 max-w-xl mx-auto font-medium uppercase tracking-widest text-[10px]">
          United Black Family Scholarship Foundation — Established 2014
        </p>
      </section>

      <section className="max-w-7xl mx-auto py-24 px-8">
        <div className="flex items-center justify-between mb-16">
          <h2 className="text-4xl font-black uppercase tracking-tighter">Latest Updates</h2>
          <Link href="/blog" className="text-[10px] font-black uppercase tracking-widest text-ubfsf-gold border-b-2 border-ubfsf-gold">
            View All News
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group">
              <article className="h-full flex flex-col border-t border-zinc-100 dark:border-zinc-800 pt-8 hover:border-ubfsf-gold transition-all">
                <time className="text-ubfsf-gold text-[10px] font-bold uppercase mb-4">
                  {new Date(post.date).toLocaleDateString()}
                </time>
                <h3 className="text-2xl font-black uppercase tracking-tighter leading-tight mb-4 group-hover:text-ubfsf-gold transition-colors">
                  {post.title}
                </h3>
                <div 
                  className="text-zinc-500 dark:text-zinc-400 text-sm line-clamp-3" 
                  dangerouslySetInnerHTML={{ __html: post.excerpt }} 
                />
              </article>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
