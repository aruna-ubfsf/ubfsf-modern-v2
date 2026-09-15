// src/components/home/UBFSFDefinition.tsx
import Section from "@/components/ui/Section";
import Heading, { HeadingAccent } from "@/components/ui/Heading";
import Text from "@/components/ui/Text";

export default function UBFSFDefinition() {
  return (
    <Section bg="light" className="border-t border-black/5 dark:border-white/5">
      <div className="max-w-4xl mx-auto text-center">
        <Heading as="h2">
          What <HeadingAccent>UBFSF</HeadingAccent> Stands For
        </Heading>
        <Text variant="lead" className="mt-6 md:mt-8">
          <strong className="font-bold text-black dark:text-white">UBFSF</strong> stands for the{" "}
          <strong className="font-bold text-black dark:text-white">
            United Black Family Scholarship Foundation
          </strong>
          .
        </Text>
        <p className="mt-4 md:mt-5 text-base md:text-lg text-stone-600 dark:text-stone-400 font-light">
          A 501(c)(3) Non-Profit Organization — Rebuilding the Community from Within.
        </p>
      </div>
    </Section>
  );
}
