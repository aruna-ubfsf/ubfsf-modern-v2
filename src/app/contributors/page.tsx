import { getTeam } from '@/lib/wordpress/staff';
import { notFound } from 'next/navigation';

export default async function ContributorsPage() {
  const [directors, advisory] = await Promise.all([
    getTeam('board-of-directors-2'),
    getTeam('board-of-advisory')
  ]);

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      <header className="bg-ubfsf-zinc text-white py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter">Leadership</h1>
          <div className="h-2 w-24 bg-ubfsf-gold mt-10"></div>
        </div>
      </header>

      <section className="max-w-5xl mx-auto py-20 px-6 space-y-32">
        {/* BOARD OF DIRECTORS */}
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-12 border-l-8 border-ubfsf-gold pl-6">
            Board of Directors
          </h2>
          <div className="prose prose-zinc lg:prose-xl max-w-none dark:prose-invert" 
               dangerouslySetInnerHTML={{ __html: directors?.content || "" }} />
        </div>

        {/* ADVISORY BOARD */}
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-12 border-l-8 border-zinc-200 pl-6">
            Advisory Board
          </h2>
          <div className="prose prose-zinc lg:prose-xl max-w-none dark:prose-invert" 
               dangerouslySetInnerHTML={{ __html: advisory?.content || "" }} />
        </div>
      </section>
    </main>
  );
}
