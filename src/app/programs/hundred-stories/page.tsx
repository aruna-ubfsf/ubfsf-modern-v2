import Image from "next/image";
import Link from "next/link";
import { getPageBySlug } from "@/lib/wordpress/pages";
import { getWpImageUrl } from "@/lib/wordpress/client";

export default async function HundredStoriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const page = await getPageBySlug("hundred-stories-project");

  if (!page) {
    return <main className="p-20 min-h-screen bg-white dark:bg-[#1a1a1a] text-black dark:text-white">Loading...</main>;
  }

  return (
    <main className="bg-white dark:bg-[#1a1a1a] text-black dark:text-[#f4f4f4] min-h-screen font-serif py-16 px-6 md:px-20 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        {/* HERO SECTION */}
        <header className="mb-20 text-center">
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-8 text-black dark:text-white">
            {page.title}
          </h1>
          <p className="text-xl italic text-stone-600 dark:text-stone-400 max-w-2xl mx-auto mb-12">
            "Every story deserves to be heard. One Hundred Stories. One Shared Humanity."
          </p>
          <div className="flex gap-4 justify-center">
            <a 
              href="https://zomedia.netlify.app/about/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-black dark:bg-white text-white dark:text-black px-8 py-3 text-[10px] font-black uppercase tracking-widest hover:opacity-80 transition-all"
            >
              Learn More About Zo Media
            </a>
          </div>
        </header>

        {/* GIVING VOICE SECTION */}
        <section className="grid md:grid-cols-2 gap-12 items-start mb-24">
          <div className="prose dark:prose-invert max-w-none text-black dark:text-[#d1d1d1]">
            <h2 className="text-2xl font-bold uppercase tracking-widest mb-6 text-[#FFB81C]">Giving Voice to the Voiceless</h2>
            <p className="leading-relaxed">
              The Hundred Stories Project is a groundbreaking initiative led by UBFSF in partnership with 
              Stony Brook University and HERSTORY. This pilot program empowers incarcerated individuals 
              to share their stories through a self-taught writing curriculum, resulting in the 
              publication of 100 prisoner-written manuscripts and a series of anthologies.
            </p>
          </div>
          <div className="relative aspect-video w-full border border-black/10 dark:border-white/10">
            <Image 
              src={getWpImageUrl("/wp-content/uploads/2023/10/books-shelf.jpg")} 
              alt="Hundred Stories Bookshelf" 
              fill 
              className="object-cover" 
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </section>

        {/* FEATURED WORKS */}
        <section className="mb-24">
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-12 text-black dark:text-white">Featured Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'No Rhyme or Reason', img: '/wp-content/uploads/2024/10/no_rhyme_no_reason-1.jpg' },
              { title: 'Social Justice Autobiographies', img: '/wp-content/uploads/2024/10/socialjusticeautobiographies_cover-scaled-1.jpg' },
              { title: 'Kill the Bastard', img: '/wp-content/uploads/2024/10/kill_the_bastard-scaled-1.jpg' }
            ].map((book) => (
              <div key={book.title} className="bg-stone-100 dark:bg-[#2a2a2a] p-4 border border-black/5 dark:border-white/5">
                <div className="relative aspect-[2/3] bg-stone-200 dark:bg-[#333333] mb-4">
                  <Image 
                    src={getWpImageUrl(book.img)} 
                    alt={book.title} 
                    fill 
                    className="object-cover" 
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <p className="font-bold text-sm text-black dark:text-white">{book.title}</p>
              </div>
            ))}
          </div>
        </section>
        
      </div>
    </main>
  );
}


