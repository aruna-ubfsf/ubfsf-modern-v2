// src/components/home/Founder.tsx
import Image from 'next/image';
import Link from 'next/link';
import Section, { SectionLabel } from '@/components/ui/Section';
import Heading, { HeadingAccent } from '@/components/ui/Heading';
import Text from '@/components/ui/Text';

export default function Founder({
  name,
  message,
  image,
}: {
  name: string;
  message: string;
  image?: string;
}) {
  const paragraphs = message ? message.split('\n\n').filter(Boolean) : [];
  // Numbered focus areas ("1. …", "2. …", "3. …") render as a bulleted list;
  // everything else as body paragraphs. Includes item #3 (Disrupt the School-to-Prison
  // Pipeline) which was previously cut off by slicing.
  const listItems = paragraphs.filter(p => /^\s*\d+[.)]\s*/.test(p));
  const bodyParas = paragraphs.filter(p => !/^\s*\d+[.)]\s*/.test(p));
  return (
    <Section bg="light">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-14 lg:gap-20 items-center">
        <div className="order-last md:order-first">
          <SectionLabel>Founder&rsquo;s Vision</SectionLabel>
          <Heading as="h2">
            Meet <HeadingAccent>{name || 'Ivan Kilgore'}</HeadingAccent>
          </Heading>
          {bodyParas.length > 0 ? (
            <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
              {bodyParas.slice(0, 2).map((para, idx) => (
                <Text key={idx} variant="lead">{para}</Text>
              ))}
            </div>
          ) : (
            <Text variant="lead" className="mb-8 md:mb-10">
              {name || 'Ivan Kilgore'} is an incarcerated author, activist, and visionary founder of
              the United Black Family Scholarship Foundation, dedicated to empowering communities and
              creating lasting change through education and grassroots movements.
            </Text>
          )}

          {listItems.length > 0 && (
            <ul className="mb-8 md:mb-10 space-y-3 md:space-y-4">
              {listItems.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#D4A017]/15 text-[#D4A017] flex items-center justify-center flex-shrink-0 mt-1 text-sm font-bold">
                    {idx + 1}
                  </span>
                  <Text variant="lead">{item.replace(/^\s*\d+[.)]\s*/, '').trim()}</Text>
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/about/founder"
            className="inline-block px-8 md:px-10 lg:px-12 py-4 md:py-5 bg-[#D4A017] text-black font-black uppercase text-sm md:text-base tracking-[0.15em] hover:bg-[#B98A2D] transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            Read His Story
          </Link>
        </div>
        <div className="relative w-full">
          <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-stone-200 dark:bg-stone-800 shadow-2xl">
            <Image
              src={image || 'https://ubfsf.org/wp-content/uploads/2025/01/Screenshot-2025-01-24-at-22.11.12.png'}
              alt={`${name || 'Ivan Kilgore'} - Founder`}
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </Section>
  );
}
