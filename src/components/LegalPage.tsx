// src/components/LegalPage.tsx
// Shared shell for the site's legal & policy pages (privacy, terms, cookies, refunds).
// Matches the site's white/serif/gold editorial style.
import Link from "next/link";

type Section = { title: string; body: string[]; bullets?: string[] };

export default function LegalPage({
  title,
  subtitle,
  updated,
  sections,
}: {
  title: string;
  subtitle: string;
  updated: string;
  sections: Section[];
}) {
  return (
    <main id="main" tabIndex={-1} className="min-h-screen bg-white dark:bg-[#1a1a1a] text-black dark:text-[#f4f4f4] transition-colors duration-300 font-serif">
      {/* HERO */}
      <header className="relative bg-black text-white py-16 md:py-20 px-6 md:px-20 overflow-hidden">
        <div className="relative max-w-5xl mx-auto">
          <span className="inline-block bg-[#D4A017] text-black px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            Legal &amp; Compliance
          </span>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-4 text-white">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-stone-300 max-w-3xl leading-relaxed font-light">{subtitle}</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto py-16 px-6 md:px-20">
        <p className="text-sm text-stone-500 dark:text-stone-400 italic mb-12">
          Last updated: {updated}
        </p>

        {sections.map((section, i) => (
          <article key={i} className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-black dark:text-white">{section.title}</h2>
            <div className="text-stone-700 dark:text-stone-300 leading-relaxed text-base space-y-4">
              {section.body.map((paragraph, p) => (paragraph.trim() && <p key={p}>{paragraph}</p>))}
              {section.bullets && section.bullets.length > 0 && (
                <ul className="list-disc space-y-2 pl-6">
                  {section.bullets.map((bullet, b) => <li key={b}>{bullet}</li>)}
                </ul>
              )}
            </div>
          </article>
        ))}

        <div className="border-t border-stone-200 dark:border-white/10 pt-8 text-sm text-stone-600 dark:text-stone-400">
          Questions about this policy? Email{" "}
          <a href="mailto:news@ubfsf.org" className="text-[#D4A017] underline underline-offset-2">news@ubfsf.org</a>
          {" "}or call{" "}
          <a href="tel:+19189245872" className="text-[#D4A017] underline underline-offset-2">1-918-924-5872</a>.
          <br />
          <Link href="/" className="text-stone-600 dark:text-stone-400 underline underline-offset-2">← Back to Home</Link>
        </div>
      </section>
    </main>
  );
}