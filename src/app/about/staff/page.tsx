// src/app/about/staff/page.tsx - MAKE THIS A SERVER COMPONENT
import Image from "next/image";
import Link from "next/link";
import { getStaffPage } from "@/lib/wordpress/staff";

interface StaffMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  img: string;
  sectionTitle: string;
}

export default async function StaffPage() {
  // Fetch directly on the server (No loading states, faster, better SEO)
  const staffData = await getStaffPage();

  if (!staffData || !staffData.staff) {
    return (
      <main className="min-h-screen bg-white dark:bg-[#1a1a1a] text-black dark:text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">Staff page not found or failed to load.</p>
        </div>
      </main>
    );
  }

  const { staff, title, featuredImageUrl, featuredImageAlt } = staffData;

  // Group staff by section
  const groupedStaff: { [key: string]: StaffMember[] } = {};
  staff.forEach((member: StaffMember) => {
    const key = member.sectionTitle || "Team";
    if (!groupedStaff[key]) {
      groupedStaff[key] = [];
    }
    groupedStaff[key].push(member);
  });

  return (
    <main className="min-h-screen bg-white dark:bg-[#1a1a1a] text-black dark:text-[#f4f4f4] transition-colors duration-300 font-serif selection:bg-[#D4A017]/30">
      
      {/* HERO */}
      <header className="relative h-[40vh] flex items-end pb-16 px-6 md:px-20 overflow-hidden border-b border-black/10 dark:border-white/10 bg-gradient-to-b from-stone-50 dark:from-stone-900 to-white dark:to-[#1a1a1a]">
        {featuredImageUrl && (
          <div className="absolute inset-0 z-0">
            <Image 
              src={featuredImageUrl} 
              alt={featuredImageAlt || title}
              fill
              className="object-cover opacity-20 grayscale"
              priority
            />
          </div>
        )}
        
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <span className="inline-block bg-[#D4A017] text-black px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            Our Team
          </span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85] mb-4">
            Staff & <span className="text-[#D4A017]">Volunteers</span>
          </h1>
          <p className="text-lg md:text-xl text-stone-600 dark:text-stone-400 max-w-2xl font-light">
            Dedicated individuals working together to create meaningful change in our communities.
          </p>
        </div>
      </header>

      {/* STAFF GRID */}
      <section className="max-w-7xl mx-auto py-16 px-6 md:px-20">
        <div className="max-w-5xl mx-auto">
          {staff.length > 0 ? (
            <div className="space-y-16">
              {Object.entries(groupedStaff).map(([sectionTitle, members]) => (
                <div key={sectionTitle}>
                  <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wider mb-8 pb-4 border-b border-black/10 dark:border-white/10">
                    {sectionTitle}
                  </h2>
                  
                  <div className="space-y-8">
                    {members.map((member, index) => {
                      const isEven = index % 2 === 0;
                      const cardBg = isEven 
                        ? 'bg-stone-50 dark:bg-[#2a2a2a] border-black/5 dark:border-white/5' 
                        : 'bg-stone-900 dark:bg-[#0a0a0a] border-stone-800 text-white';

                      return (
                        <div 
                          key={member.id || index} 
                          className={`rounded-2xl border overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.01] ${cardBg}`}
                        >
                          <div className="flex flex-col md:flex-row gap-8 p-8 md:p-10 items-center md:items-start">
                            
                            {/* Image */}
                            <div className="w-full md:w-[200px] flex-shrink-0 flex justify-center">
                              {member.img ? (
                                <div className="relative w-48 h-48 md:w-full md:aspect-square rounded-2xl overflow-hidden bg-stone-200 dark:bg-stone-800 border-2 border-[#D4A017]/20 shadow-inner">
                                  <Image
                                    src={member.img}
                                    alt={member.name}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 192px, 200px"
                                    unoptimized
                                  />
                                </div>
                              ) : (
                                <div className="w-48 h-48 md:w-full md:aspect-square rounded-2xl bg-gradient-to-br from-[#D4A017]/20 to-[#D4A017]/5 flex items-center justify-center border-2 border-dashed border-[#D4A017]/30">
                                  <span className="text-6xl font-black text-[#D4A017]">
                                    {member.name.charAt(0)}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            {/* Content */}
                            <div className="flex-grow w-full text-center md:text-left">
                              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3">
                                <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
                                  {member.name}
                                </h3>
                                {member.role && member.role !== "Team Member" && (
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4A017] bg-[#D4A017]/10 border border-[#D4A017]/30 px-3 py-1 rounded-full">
                                    {member.role}
                                  </span>
                                )}
                              </div>
                              
                              {member.bio && (
                                <div className={`text-sm md:text-base leading-relaxed font-light space-y-4 whitespace-pre-line ${
                                  isEven ? 'text-stone-600 dark:text-stone-300' : 'text-stone-300'
                                }`}>
                                  {member.bio}
                                </div>
                              )}
                            </div>

                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-stone-500 dark:text-stone-400">No staff members found.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 md:px-20 pb-16">
        <div className="pt-16 border-t border-black/10 dark:border-white/10 flex flex-wrap gap-8 items-center justify-center">
          <Link 
            href="/contact" 
            className="px-10 py-5 bg-[#D4A017] text-black text-xs font-black uppercase tracking-widest hover:bg-[#B98A2D] transition-all rounded"
          >
            Get Involved
          </Link>
          <p className="text-stone-500 font-bold uppercase tracking-widest text-[10px]">
            Join us in building stronger communities.
          </p>
        </div>
      </section>
    </main>
  );
}