// src/components/home/Objectives.tsx
import Image from "next/image";
import Section, { SectionLabel } from "@/components/ui/Section";
import Heading, { HeadingAccent } from "@/components/ui/Heading";
import Text from "@/components/ui/Text";

export default function Objectives({
  objectives,
  formula = "💡 Ideas + ⚙️ Collective Action = 📈 Community Growth",
  image,
}: {
  objectives: { title: string; description: string }[];
  formula?: string;
  image?: string;
}) {
  return (
    <Section bg="dark">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 md:mb-14">
          <SectionLabel centered>Strategic Focus</SectionLabel>
          <Heading as="h2">
            Our <HeadingAccent>Objectives</HeadingAccent>
          </Heading>
          <p className="mt-4 text-base md:text-lg text-stone-300 font-light">
            {formula}
          </p>
        </div>

        {image && (
          <div className="mb-10 md:mb-14">
            <div className="relative w-full max-w-3xl mx-auto aspect-[16/9] rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800 shadow-md">
              <Image
                src={image}
                alt="UBFSF Bilal Tahlib Ali"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
          </div>
        )}

        {objectives.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {objectives.map((obj, idx) => (
              <div
                key={idx}
                className="bg-white/5 p-6 md:p-8 rounded-lg border-l-4 border-[#D4A017]"
              >
                <span className="text-[#D4A017] text-2xl md:text-3xl font-black block mb-3 md:mb-4">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <h3 className="text-lg md:text-xl font-bold tracking-tight mb-2 md:mb-3 text-white">
                  {obj.title}
                </h3>
                {obj.description && (
                  <Text variant="muted">{obj.description}</Text>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
