// src/app/about/board-advisory/page.tsx
import Image from "next/image";
import Link from "next/link";
import { getBoardAdvisoryPage } from "@/lib/wordpress/staff";

export default async function BoardAdvisoryPage() {
  const page = await getBoardAdvisoryPage();
  const members = page?.staff || [];

  return (
    <main className="min-h-screen bg-white dark:bg-[#1a1a1a] text-black dark:text-[#f4f4f4] transition-colors duration-300 font-serif selection:bg-[#D4A017]/30">
      <header className="relative h-[40vh] flex items-end pb-16 px-6 md:px-20 overflow-hidden border-b border-black/10 dark:border-white/10 bg-gradient-to-b from-stone-50 dark:from-stone-900 to-white dark:to-[#1a1a1a]">
        {page?.featuredImageUrl && (
          <div className="absolute inset-0 z-0">
            <Image
              src={page.featuredImageUrl}
              alt={page.title}
              fill
              className="object-cover opacity-20 grayscale"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#1a1a1a] to-transparent" />
          </div>
        )}

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <span className="inline-block bg-[#D4A017] text-black px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            Leadership
          </span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85] mb-4">
            Board of <span className="text-[#D4A017]">Advisory</span>
          </h1>
          <p className="text-lg md:text-xl text-stone-600 dark:text-stone-400 max-w-2xl font-light">
            Distinguished advisors guiding our mission and vision.
          </p>
        </div>
      </header>

      <section className="max-w-7xl mx-auto py-16 px-6 md:px-20">
        <div className="max-w-5xl mx-auto">
          {!page ? (
            <div className="bg-stone-50 dark:bg-[#2a2a2a] p-8 rounded-2xl border border-black/5 dark:border-white/5 text-center">
              <h2 className="text-xl font-bold mb-4 text-[#D4A017]">Page Not Found</h2>
              <p className="text-stone-600 dark:text-stone-400">
                The Board of Advisory page could not be found in WordPress.
              </p>
            </div>
          ) : members.length === 0 ? (
            <div className="bg-stone-50 dark:bg-[#2a2a2a] p-12 text-center rounded-2xl border border-black/5 dark:border-white/5">
              <h2 className="text-xl font-bold mb-4 text-[#D4A017]">No Advisory Members Found</h2>
              <p className="text-stone-600 dark:text-stone-400">
                Successfully found the WordPress page but could not extract member profiles.
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {members.map((member, index) => {
                const isEven = index % 2 === 0;
                const cardBg = isEven
                  ? "bg-stone-50 dark:bg-[#2a2a2a] border-black/5 dark:border-white/5 text-black dark:text-[#f4f4f4]"
                  : "bg-stone-900 dark:bg-[#0a0a0a] border-stone-800 text-white";

                return (
                  <div
                    key={member.id || index}
                    className={`rounded-2xl border overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.01] ${cardBg}`}
                  >
                    <div className="flex flex-col md:flex-row gap-8 p-8 md:p-10 items-center md:items-start">
                      <div className="w-full md:w-[200px] flex-shrink-0 flex justify-center">
                        {member.img ? (
                          <div className="relative w-48 h-48 md:w-full md:aspect-square rounded-2xl overflow-hidden bg-stone-200 dark:bg-stone-800 border-2 border-[#D4A017]/20 shadow-inner">
                            <Image
                              src={member.img}
                              alt={member.name}
                              fill
                              className="object-contain p-3"
                              sizes="(max-width: 768px) 192px, 200px"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <div className="w-48 h-48 md:w-full md:aspect-square rounded-2xl bg-gradient-to-br from-[#D4A017]/20 to-[#D4A017]/5 flex items-center justify-center border-2 border-dashed border-[#D4A017]/30">
                            <span className="text-6xl font-black text-[#D4A017]">
                              {member.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex-grow w-full text-center md:text-left">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3">
                          <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
                            {member.name}
                          </h3>
                          {member.role && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4A017] bg-[#D4A017]/10 border border-[#D4A017]/30 px-3 py-1 rounded-full">
                              {member.role}
                            </span>
                          )}
                        </div>

                        <div
                          className={`text-sm md:text-base leading-relaxed font-light space-y-4 whitespace-pre-line ${
                            isEven
                              ? "text-stone-600 dark:text-stone-300"
                              : "text-stone-300"
                          }`}
                        >
                          {member.bio}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-20 pb-16">
        <div className="pt-16 border-t border-black/10 dark:border-white/10 flex flex-wrap gap-8 items-center justify-center">
          <Link
            href="/about/staff"
            className="px-10 py-5 bg-[#D4A017] text-black text-xs font-black uppercase tracking-widest hover:bg-[#B98A2D] transition-all rounded"
          >
            Meet Our Staff
          </Link>
          <p className="text-stone-500 font-bold uppercase tracking-widest text-[10px]">
            Learn more about the people behind UBFSF.
          </p>
        </div>
      </section>
    </main>
  );
}
