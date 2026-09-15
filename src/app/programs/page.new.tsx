import Link from 'next/link';

const programs = [
  {
    title: 'R.E.B.U.I.L.D. (Community Reinvestment Initiative)',
    description: 'Focuses on neighborhood revitalization in Northeast Oklahoma City. It connects housing, workforce training, and local education to help rebuild communities from within.',
    href: '/programs/rebuild',
  },
  {
    title: 'The Hundred Stories Project',
    description: 'A community archive and documentary initiative. It preserves local history, oral stories, family records, and photographs to keep the community\'s memory alive.',
    href: '/programs/hundred-stories',
  },
  {
    title: 'Nonprofit Coaching & Leadership Fellowship',
    description: 'Provides coaching, training, and conferences to help local leaders build and run successful nonprofits.',
    href: '/programs/coaching',
  },
  {
    title: 'Writing Beyond the Prison',
    description: 'An initiative that works with incarcerated individuals, giving them a platform to share their stories, write, and connect with the community.',
    href: '/programs/writing',
  },
  {
    title: 'Scholarship & Community Grant Programs',
    description: 'Provides financial support, scholarships, and grants to students and local community initiatives to empower the next generation.',
    href: '/programs/grants',
  },
];

export default function ProgramsOverview() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#1a1a1a]">
      <section className="relative h-[60vh] flex items-center justify-center text-center bg-black">
        <div className="relative z-10 max-w-4xl px-6">
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6">
            Our Programs
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Five initiatives working together to empower communities, preserve history, and create lasting change in Northeast Oklahoma City.
          </p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {programs.map((program) => (
            <div key={program.href} className="border border-black/10 dark:border-white/10 p-8">
              <h2 className="font-serif text-2xl text-[#D4A017] mb-4">{program.title}</h2>
              <p className="text-black/70 dark:text-white/70 mb-6">{program.description}</p>
              <Link href={program.href} className="inline-block px-5 py-2 bg-[#D4A017] text-black font-bold">
                Learn More
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
