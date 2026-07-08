export default function Mission({ content }: { content: string }) {
  return (
    <section className="max-w-7xl mx-auto py-24 px-8 grid md:grid-cols-2 gap-20 items-center">
      <div className="relative">
        <div className="rounded-full overflow-hidden border-[12px] border-zinc-50 dark:border-zinc-900 shadow-2xl aspect-square">
          <img src="/assets/mission.jpg" alt="Foundation Mission" className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-700" />
        </div>
        <div className="absolute -bottom-6 -right-6 bg-white dark:bg-ubfsf-zinc p-8 shadow-2xl max-w-[240px] border-l-8 border-ubfsf-gold">
          <p className="font-black italic text-zinc-800 dark:text-zinc-200 text-sm leading-tight uppercase tracking-tighter">
            "The ones who are not afraid to challenge the status quo"
          </p>
        </div>
      </div>
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="h-px w-12 bg-ubfsf-gold"></div>
          <h2 className="text-xs font-black uppercase tracking-[0.4em] text-ubfsf-gold">Mission Statement</h2>
        </div>
        <h3 className="text-5xl font-black uppercase tracking-tighter leading-none">From Within.</h3>
        <div 
          className="prose prose-zinc lg:prose-xl dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: content }} 
        />
      </div>
    </section>
  );
}
