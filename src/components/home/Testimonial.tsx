// src/components/home/Testimonial.tsx
import Section from '@/components/ui/Section';

// Strip stray/unbalanced quote artifacts from WordPress text
function cleanQuote(text: string): string {
  return text
    .replace(/^[“”"'‘’\s]+/, '')
    .replace(/[“”"'‘’\s]+$/, '')
    .trim();
}

export default function Testimonial({ quote, author }: { quote: string; author: string }) {
  const cleaned = cleanQuote(quote);
  if (!cleaned) return null;
  return (
    <Section bg="transparent" className="bg-[#f4f4f4] dark:bg-[#1a1a1a]">
      <div className="max-w-4xl mx-auto text-center py-12 md:py-16">
        <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full bg-black dark:bg-white flex items-center justify-center mb-8 md:mb-10">
          <span className="text-white dark:text-black text-3xl md:text-4xl font-serif leading-none">“</span>
        </div>
        <p className="text-2xl sm:text-3xl md:text-4xl font-light italic leading-relaxed mb-8 md:mb-12 text-black dark:text-white font-serif">
          {cleaned}
        </p>
        <p className="text-black dark:text-white font-bold uppercase tracking-[0.2em] text-base md:text-lg">
          — {author}
        </p>
      </div>
    </Section>
  );
}
