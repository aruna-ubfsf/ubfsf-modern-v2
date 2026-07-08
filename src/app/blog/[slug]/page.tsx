import { getPosts } from '@/lib/wordpress';
import Link from 'next/link';

export default async function BlogArchive() {
  const posts = await getPosts(12); // Fetch recent 12 posts

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      <header className="bg-ubfsf-zinc text-white py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-6xl font-black uppercase tracking-tighter">Newsroom</h1>
          <div className="h-2 w-20 bg-ubfsf-gold mt-6"></div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto py-20 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group">
              <article className="border-t border-zinc-100 dark:border-zinc-800 pt-8 flex flex-col h-full hover:border-ubfsf-gold transition-all">
                <time className="text-ubfsf-gold text-[10px] font-bold uppercase tracking-widest mb-4">
                  {new Date(post.date).toLocaleDateString()}
                </time>
                <h2 className="text-2xl font-black uppercase tracking-tighter leading-tight mb-4 group-hover:text-ubfsf-gold transition-colors">
                  {post.title}
                </h2>
                <div 
                  className="text-zinc-500 text-sm line-clamp-3 leading-relaxed mb-6"
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
