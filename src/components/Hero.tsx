import Link from 'next/link';

export default function Hero() {
  return (
    <section className="py-32 px-6 text-center border-b border-zinc-100 dark:border-zinc-900 overflow-hidden">
      <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] text-zinc-900 dark:text-white">
          Rebuilding <br /> <span className="text-ubfsf-gold">Community</span>
        </h1>
        <p className="mt-10 text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto font-medium uppercase tracking-widest text-[10px]">
          United Black Family Scholarship Foundation — Established 2014
        </p>
        <div className="mt-12 flex justify-center gap-4">
          <Link href="/donate" className="bg-ubfsf-gold text-black font-black px-10 py-5 uppercase text-xs tracking-widest hover:bg-yellow-500 transition-all shadow-xl active:scale-95">
            Donate Now
          </Link>
          <Link href="/programs" className="border-2 border-zinc-900 dark:border-white font-black px-10 py-5 uppercase text-xs tracking-widest hover:bg-zinc-900 hover:text-white transition-all">
            Our Programs
          </Link>
        </div>
      </div>
    </section>
  );
}
