// src/components/home/WhoWeAre.tsx
import Image from 'next/image';
import Section, { SectionLabel } from '@/components/ui/Section';
import Heading, { HeadingAccent } from '@/components/ui/Heading';
import Text from '@/components/ui/Text';

export default function WhoWeAre({
  vision,
  logoImage,
}: {
  vision: string;
  logoImage?: string;
}) {
  return (
    <Section bg="white" className="border-t border-black/5 dark:border-white/5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-14 lg:gap-20 items-start">
        {/* Left: logo + intro */}
        <div>
          <SectionLabel>United Black Family Scholarship Foundation</SectionLabel>
          {logoImage && (
            <div className="relative w-32 h-32 md:w-40 md:h-40 mb-6">
              <Image
                src={logoImage}
                alt="UBFSF Logo"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 128px, 160px"
              />
            </div>
          )}
          <Heading as="h2">
            Who <HeadingAccent>We Are</HeadingAccent>
          </Heading>
          <Text variant="lead">
            A student- and volunteer-led 501(c)(3) nonprofit serving communities in Oklahoma,
            California, and New York — using quality education as a powerful tool to challenge
            systemic poverty and dismantle structures of racism.
          </Text>
        </div>

        {/* Right: Vision (mission statement lives in its own section below) */}
        <div className="bg-stone-50 dark:bg-[#141414] p-6 md:p-8 rounded-lg border-l-4 border-[#D4A017]">
          <h3 className="text-lg md:text-xl font-bold mb-3 text-black dark:text-white">
            Our Vision
          </h3>
          <Text variant="muted">{vision}</Text>
        </div>
      </div>
    </Section>
  );
}
