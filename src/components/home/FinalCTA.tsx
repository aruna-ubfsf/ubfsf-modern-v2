// src/components/home/FinalCTA.tsx
import Button from '@/components/ui/Button';

export default function FinalCTA({
  description = 'Together, we can create lasting change and build a brighter future for all underserved communities.',
  donateUrl,
}: {
  description?: string;
  donateUrl: string;
}) {
  return (
    <section className="py-16 md:py-24 lg:py-32 px-4 sm:px-6 md:px-12 lg:px-20 bg-black text-white text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight mb-6 md:mb-8 text-white">
          Join Us in <br />
          <span className="text-[#D4A017]">Rebuilding Community</span>
        </h2>
        <p className="text-base md:text-lg lg:text-xl text-white/70 max-w-2xl mx-auto mb-8 md:mb-12 font-light leading-relaxed px-2">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 md:gap-6 justify-center">
          <Button href={donateUrl} variant="primary" size="lg" external>
            Donate Now
          </Button>
          <Button href="/contact" variant="outlineLight" size="lg">
            Get Involved
          </Button>
        </div>
      </div>
    </section>
  );
}
