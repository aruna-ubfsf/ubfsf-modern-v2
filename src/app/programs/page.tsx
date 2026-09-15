/* src/app/programs/page.tsx
 * Programs Overview - Showcase all programs + volunteer & internship opportunities
 * Integrated with WordPress content via REST API
 */

import Image from 'next/image';
import Link from 'next/link';
import { getPageBySlug } from '@/lib/wordpress/pages';
import { getWpImageUrl } from '@/lib/wordpress/client';
import { Briefcase, Users, Award, BookOpen, MapPin, GraduationCap } from 'lucide-react';

export const metadata = {
  title: 'Our Programs | UBFSF',
  description: 'Explore UBFSF\'s active programs: R.E.B.U.I.L.D., The Hundred Stories Project, and the Nonprofit Coaching and Leadership Program.',
};

// Confirmed active programs only (per program status review)
const corePrograms = [
  {
    title: 'R.E.B.U.I.L.D.',
    subtitle: 'Community Reinvestment Initiative',
    description: 'Focuses on neighborhood revitalization in Northeast Oklahoma City. It connects housing, workforce training, and local education to help rebuild communities from within.',
    href: '/programs/rebuild',
    icon: MapPin,
  },
  {
    title: 'The Hundred Stories Project',
    subtitle: 'Community Archive & Publishing',
    description: 'Empowers incarcerated writers to develop, publish, and receive compensation for their creative work — preserving stories that challenge stereotypes and foster empathy.',
    href: '/programs/hundred-stories',
    icon: BookOpen,
    subProjects: [
      { title: 'Zo Media', note: '' },
      { title: 'Cages', note: '' },
    ],
  },
  {
    title: 'Nonprofit Coaching and Leadership Program',
    subtitle: 'Education & Mentorship',
    description: 'Empowers incarcerated citizens to become nonprofit leaders through workshops, panel discussions, coaching, and mentorship with university partners.',
    href: '/programs/coaching',
    icon: Users,
  },
];

const internshipPrograms = [
  {
    title: 'Program & Public Policy',
    description: 'Address policies that disproportionately affect underserved communities.',
    href: '/programs/public-policy',
  },
  {
    title: 'HR Development',
    description: 'Collaborate with incarcerated leaders and learn how to support community reintegration.',
    href: '/programs/hr-development',
  },
  {
    title: 'Resource Development',
    description: 'Gain experience in grant writing, corporate sponsorships, and policy advocacy.',
    href: '/programs/resource-development',
  },
  {
    title: 'Media & Marketing',
    description: 'Learn how to amplify stories that highlight social justice issues and advocate for change.',
    href: '/programs/media-marketing',
  },
];

export default async function ProgramsOverview() {
  // Optionally fetch the Programs page from WordPress for additional intro content
  const page = await getPageBySlug('programs');

  return (
    <main className="min-h-screen bg-white dark:bg-[#1a1a1a] text-black dark:text-[#f4f4f4] transition-colors duration-300 font-serif">

      {/* ===== HERO SECTION ===== */}
      <header className="relative h-[50vh] flex items-end pb-16 px-6 md:px-20 overflow-hidden border-b border-black/10 dark:border-white/10 bg-gradient-to-b from-stone-50 dark:from-stone-900 to-white dark:to-[#1a1a1a]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#1a1a1a] to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <span className="inline-block bg-[#D4A017] text-black px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            Core Initiatives
          </span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85] mb-4 text-black dark:text-white">
            Our <span className="text-[#D4A017]">Programs</span>
          </h1>
          <p className="text-lg md:text-xl text-stone-600 dark:text-stone-400 max-w-3xl font-light">
            Multiple initiatives working together to empower communities, preserve history, and create lasting change in Northeast Oklahoma City and beyond.
          </p>
        </div>
      </header>

      {/* ===== CORE PROGRAMS ===== */}
      <section className="max-w-7xl mx-auto py-20 md:py-28 px-6 md:px-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-3 text-black dark:text-white">
            Core Programs
          </h2>
          <div className="h-px w-12 bg-[#D4A017] mx-auto mb-6" />
          <p className="text-stone-600 dark:text-stone-400 max-w-3xl mx-auto">
            UBFSF's core programs are designed to rebuild the community from within the community through education, empowerment, and systemic change.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {corePrograms.map((program) => {
            const Icon = program.icon;
            return (
              <Link
                key={program.href}
                href={program.href}
                className="group"
              >
                <div className="bg-white dark:bg-[#1a1a1a] border-2 border-black/10 dark:border-white/10 rounded-2xl p-6 h-full hover:border-[#D4A017]/50 hover:shadow-xl transition-all duration-300 flex flex-col">
                  {/* Icon */}
                  <div className="mb-4">
                    <div className="w-12 h-12 rounded-lg bg-[#D4A017]/10 flex items-center justify-center group-hover:bg-[#D4A017]/20 transition-colors">
                      <Icon className="w-6 h-6 text-[#D4A017]" strokeWidth={1.5} />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-black uppercase tracking-tight text-black dark:text-white mb-1 leading-tight">
                    {program.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-xs uppercase tracking-widest text-[#D4A017] font-semibold mb-4">
                    {program.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed flex-grow mb-4">
                    {program.description}
                  </p>

                  {/* Sub-projects (100 Stories) */}
                  {program.subProjects && (
                    <ul className="mt-4 mb-2 space-y-1.5 border-t border-black/5 dark:border-white/5 pt-4">
                      <li className="text-[10px] font-black uppercase tracking-widest text-stone-500 mb-1">Sub-projects</li>
                      {program.subProjects.map((sp) => (
                        <li key={sp.title} className="text-sm text-stone-700 dark:text-stone-300 flex items-start gap-2">
                          <span className="text-[#D4A017] mt-0.5">–</span>
                          <span>
                            {sp.title}
                            {sp.note && <span className="text-stone-400"> ({sp.note})</span>}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* CTA */}
                  <div className="inline-block text-xs font-black uppercase tracking-widest text-[#D4A017] group-hover:text-[#B98A2D] transition-colors mt-auto">
                    Learn More →
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ===== NONPROFIT COACHING PROGRAMS - DETAILED SECTION ===== */}
      <section className="py-20 md:py-28 bg-stone-50 dark:bg-[#2a2a2a] border-y border-black/10 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-3 text-black dark:text-white">
              Nonprofit Coaching and <span className="text-[#D4A017]">Leadership Program</span>
            </h2>
            <div className="h-px w-12 bg-[#D4A017] mx-auto mb-6" />
            <p className="text-stone-600 dark:text-stone-400 max-w-3xl mx-auto">
              Developing nonprofit leadership among incarcerated and formerly incarcerated individuals through conferences, coaching, and mentorship.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {/* Coaching & Leadership Program */}
            <div className="bg-white dark:bg-[#1a1a1a] border-2 border-black/10 dark:border-white/10 rounded-2xl p-8 hover:border-[#D4A017]/50 hover:shadow-xl transition-all duration-300">
              <div className="mb-4">
                <div className="w-12 h-12 rounded-lg bg-[#D4A017]/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#D4A017]" strokeWidth={1.5} />
                </div>
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-black dark:text-white mb-2 leading-tight">
                Nonprofit Coaching and Leadership Program
              </h3>
              <p className="text-xs uppercase tracking-widest text-[#D4A017] font-semibold mb-4">
                Conferences, Coaching &amp; Mentorship
              </p>
              <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed mb-6">
                Bringing together incarcerated individuals, university partners, and experts for workshops, panel discussions, and an ongoing 12-month coaching and mentorship fellowship — including tablet-based Edovo courses and university partnerships.
              </p>
              <ul className="space-y-2 mb-6 text-sm text-stone-700 dark:text-stone-300">
                <li className="flex items-start gap-2">
                  <span className="text-[#D4A017] font-black mt-0.5">✓</span>
                  <span>Panel discussions with university partners</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D4A017] font-black mt-0.5">✓</span>
                  <span>Workshops on nonprofit leadership</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D4A017] font-black mt-0.5">✓</span>
                  <span>12-month mentorship &amp; internship fellowship</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D4A017] font-black mt-0.5">✓</span>
                  <span>University partners including Georgetown, UPenn, UofA, UHD</span>
                </li>
              </ul>
              <Link href="/programs/coaching" className="inline-block px-6 py-3 bg-[#D4A017] text-black text-xs font-black uppercase tracking-[0.2em] hover:bg-[#B98A2D] transition-all">
                View the Program
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* ===== INTERNSHIP PROGRAMS ===== */}
      <section className="max-w-7xl mx-auto py-20 md:py-28 px-6 md:px-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-3 text-black dark:text-white">
            Internship <span className="text-[#D4A017]">Programs</span>
          </h2>
          <div className="h-px w-12 bg-[#D4A017] mx-auto mb-6" />
          <p className="text-stone-600 dark:text-stone-400 max-w-3xl mx-auto">
            Our internship programs offer students the opportunity to gain hands-on experience in nonprofit operations while working remotely from anywhere in the U.S.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {internshipPrograms.map((internship) => (
            <Link
              key={internship.title}
              href={internship.href}
              className="group"
            >
              <div className="bg-stone-50 dark:bg-[#2a2a2a] border-2 border-black/10 dark:border-white/10 rounded-xl p-6 h-full hover:border-[#D4A017]/50 hover:shadow-xl transition-all">
                <h3 className="font-black text-black dark:text-white uppercase tracking-tight mb-3">
                  {internship.title}
                </h3>
                <p className="text-sm text-stone-700 dark:text-stone-300 mb-4 leading-relaxed">
                  {internship.description}
                </p>
                <div className="text-xs font-black uppercase tracking-widest text-[#D4A017] group-hover:text-[#B98A2D] transition-colors">
                  Learn More →
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 p-8 bg-stone-50 dark:bg-[#2a2a2a] border border-black/10 dark:border-white/10 rounded-xl">
          <h3 className="font-black text-black dark:text-white uppercase tracking-tight mb-4">Why Intern with UBFSF</h3>
          <ul className="grid md:grid-cols-3 gap-6">
            <li className="flex items-start gap-3">
              <span className="text-[#D4A017] font-black">✓</span>
              <span className="text-stone-700 dark:text-stone-300">Flexible, remote opportunities designed for students across the U.S.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#D4A017] font-black">✓</span>
              <span className="text-stone-700 dark:text-stone-300">Work on real projects that contribute to systemic change.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#D4A017] font-black">✓</span>
              <span className="text-stone-700 dark:text-stone-300">Mentorship from leaders in education, policy, and advocacy.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* ===== VOLUNTEER OPPORTUNITIES ===== */}
      <section className="py-20 md:py-28 bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-3 text-white">
              Volunteer <span className="text-[#D4A017]">Opportunities</span>
            </h2>
            <div className="h-px w-12 bg-[#D4A017] mx-auto mb-6" />
            <p className="text-white/70 max-w-3xl mx-auto">
              Be the change in your community. Use your skills and talents to create positive change while building professional experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white/5 border border-white/10 rounded-xl p-8">
              <h3 className="text-xl font-black uppercase tracking-tight text-white mb-4">Current Volunteer Roles</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-[#D4A017] font-black">•</span>
                  <div>
                    <p className="font-black text-white">Chief Development Officer</p>
                    <p className="text-sm text-white/70">Lead fundraising and development strategies</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4A017] font-black">•</span>
                  <div>
                    <p className="font-black text-white">Program Director</p>
                    <p className="text-sm text-white/70">Oversee and implement impactful programs</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4A017] font-black">•</span>
                  <div>
                    <p className="font-black text-white">HR Director</p>
                    <p className="text-sm text-white/70">Manage volunteer engagement and HR processes</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4A017] font-black">•</span>
                  <div>
                    <p className="font-black text-white">Publication Technician</p>
                    <p className="text-sm text-white/70">Support media, communications, and digital outreach</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-8">
              <h3 className="text-xl font-black uppercase tracking-tight text-white mb-4">Why Volunteer with UBFSF</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-[#D4A017] font-black">✓</span>
                  <span className="text-white/80">Develop professional skills while contributing to meaningful causes.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4A017] font-black">✓</span>
                  <span className="text-white/80">Flexible volunteer roles with opportunities for leadership and growth.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4A017] font-black">✓</span>
                  <span className="text-white/80">Participation in Public Service Loan Forgiveness (PSLF) program eligibility.</span>
                </li>
              </ul>
              <div className="mt-8 pt-8 border-t border-white/10">
                <p className="text-sm text-white/70 mb-3">
                  <span className="text-[#D4A017] font-black">*</span> You might be eligible for the Public Service Loan Forgiveness Program.
                </p>
                <a 
                  href="https://studentaid.gov/manage-loans/forgiveness-cancellation/public-service" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block text-[#D4A017] font-black hover:text-[#B98A2D] transition-colors"
                >
                  Learn More About PSLF →
                </a>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link href="/volunteer" className="inline-block px-8 py-3 bg-[#D4A017] text-black text-xs font-black uppercase tracking-[0.2em] hover:bg-[#B98A2D] transition-all">
              View All Volunteer Opportunities
            </Link>
          </div>
        </div>
      </section>

      {/* ===== BOTTOM CTA ===== */}
      <section className="py-16 md:py-20 bg-stone-50 dark:bg-[#2a2a2a] border-t border-black/10 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-20 text-center">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-4 text-black dark:text-white">
            Ready to Make an Impact?
          </h2>
          <p className="text-stone-600 dark:text-stone-400 max-w-2xl mx-auto mb-8">
            Whether you want to volunteer, intern, or support our mission through donations, there are many ways to get involved.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link 
              href="/volunteer" 
              className="px-8 py-3 bg-[#D4A017] text-black text-xs font-black uppercase tracking-[0.2em] hover:bg-[#B98A2D] transition-all"
            >
              Get Involved
            </Link>
            <Link href="/donate" className="px-8 py-3 border-2 border-[#D4A017] text-[#D4A017] text-xs font-black uppercase tracking-[0.2em] hover:bg-[#D4A017]/10 transition-all">
              Make a Donation
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}