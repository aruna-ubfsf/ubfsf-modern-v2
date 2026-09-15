import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Scholarship & Community Grant Programs | UBFSF',
  description: 'Scholarship and Community Grant programs are currently on hold.',
  robots: { index: false, follow: false },
};

export default function GrantsPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#1a1a1a]">
      <section className="relative h-[60vh] flex items-center justify-center text-center bg-black">
        <div className="relative z-10 max-w-4xl px-6">
          <div className="inline-block bg-[#D4A017] text-black px-4 py-1 text-xs font-bold uppercase tracking-widest mb-4">
            Empowerment
          </div>
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6">
            Scholarship & Community Grant Programs
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Provides financial support, scholarships, and grants to students and local community initiatives to empower the next generation.
          </p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2 className="font-serif text-3xl text-[#D4A017]">Our Commitment</h2>
            <p>
              The UBFSF Scholarship & Community Grant Programs are designed to remove financial barriers and invest in the people and projects that build stronger communities. We believe that access to education and resources is a foundation for lasting change.
            </p>
            <h2 className="font-serif text-3xl text-[#D4A017]">Scholarships</h2>
            <p>
              We provide scholarships to students pursuing higher education, vocational training, and leadership development. Our scholarship recipients are chosen based on community involvement, academic promise, and commitment to service.
            </p>
            <h2 className="font-serif text-3xl text-[#D4A017]">Community Grants</h2>
            <p>
              Community grants support local initiatives, nonprofits, and grassroots projects that align with our mission of neighborhood revitalization and community empowerment. Grants range from small seed funding to larger project support.
            </p>
            <div className="mt-12 flex gap-4">
              <Link href="/programs" className="px-6 py-3 bg-[#D4A017] text-black font-bold">
                View All Programs
              </Link>
              <Link href="/donate" className="px-6 py-3 border border-[#D4A017] text-[#D4A017] font-bold">
                Donate Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
