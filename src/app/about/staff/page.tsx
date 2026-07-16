// src/app/about/staff/page.tsx
import Image from "next/image";
import Link from "next/link";
import { getPageBySlug } from "@/lib/wordpress/pages";
import { getWpImageUrl } from "@/lib/wordpress/client";

// Extract ALL staff from Divi content in order
function extractStaffFromDivi(content: string) {
  const staff: Array<{ 
    name: string; 
    role: string; 
    bio: string; 
    img: string;
    sectionTitle: string;
    order: number;
  }> = [];
  
  // Clean the content - decode HTML entities
  const cleanContent = content
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8211;/g, "–")
    .replace(/&#038;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ");
  
  let globalOrder = 0;
  
  // ============================================
  // Find ALL sections in order
  // ============================================
  const sectionRegex = /\[et_pb_section[^\]]*admin_label="([^"]*)"[^\]]*\]([\s\S]*?)\[\/et_pb_section\]/g;
  let sectionMatch;
  let currentSectionTitle = "";
  
  while ((sectionMatch = sectionRegex.exec(cleanContent)) !== null) {
    const sectionLabel = sectionMatch[1] || '';
    const sectionContent = sectionMatch[2];
    
    // Determine section title
    if (sectionLabel && !sectionLabel.includes('Section') && !sectionLabel.includes('Row')) {
      currentSectionTitle = sectionLabel;
    } else {
      // Try to find a heading in the section
      const headingMatch = sectionContent.match(/title_prefix=["']([^"']+)["']/);
      if (headingMatch) {
        const heading = headingMatch[1];
        if (heading.includes('Executive') || heading.includes('Program') || 
            heading.includes('Development') || heading.includes('Operations') ||
            heading.includes('Media') || heading.includes('Web') || 
            heading.includes('Accounting') || heading.includes('R.E.B.U.I.L.D.') ||
            heading.includes('Partners') || heading.includes('Hundred') ||
            heading.includes('Chief') || heading.includes('REBUILD')) {
          currentSectionTitle = heading;
        }
      }
    }
    
    // Skip header sections
    if (sectionLabel.includes('Section') && !sectionLabel.includes('Chief') && 
        !sectionLabel.includes('Program') && !sectionLabel.includes('Development') &&
        !sectionLabel.includes('Operations') && !sectionLabel.includes('Media') &&
        !sectionLabel.includes('Web') && !sectionLabel.includes('Accounting') &&
        !sectionLabel.includes('REBUILD') && !sectionLabel.includes('SBU') &&
        !sectionLabel.includes('Partners')) {
      continue;
    }
    
    // ============================================
    // Check for et_pb_team_member first (Erena, Gianna)
    // ============================================
    const teamRegex = /\[et_pb_team_member[^\]]*name="([^"]+)"[^\]]*image_url="([^"]+)"[^\]]*\]([\s\S]*?)\[\/et_pb_team_member\]/g;
    let teamMatch;
    let hasTeamMember = false;
    
    while ((teamMatch = teamRegex.exec(sectionContent)) !== null) {
      hasTeamMember = true;
      globalOrder++;
      const name = teamMatch[1];
      const img = getWpImageUrl(teamMatch[2]);
      let bio = teamMatch[3]
        .replace(/<p>/g, '')
        .replace(/<\/p>/g, '')
        .replace(/<span[^>]*>/g, '')
        .replace(/<\/span>/g, '')
        .replace(/<br\s*\/?>/g, ' ')
        .replace(/&#8217;/g, "'")
        .replace(/&#822[01];/g, '"')
        .replace(/\s+/g, " ")
        .trim();
      
      let role = "";
      let cleanName = name;
      if (name.includes("|")) {
        const parts = name.split("|");
        cleanName = parts[0].trim();
        role = parts[1].trim();
      }
      
      if (cleanName && bio) {
        staff.push({ 
          name: cleanName, 
          role: role || "Team Member", 
          bio, 
          img,
          sectionTitle: currentSectionTitle || "Hundred Stories Project",
          order: globalOrder
        });
      }
    }
    
    // ============================================
    // If no team member, look for rows with staff
    // ============================================
    if (!hasTeamMember) {
      // Find all rows with column_structure
      const rowRegex = /\[et_pb_row[^\]]*column_structure\s*=\s*["']([^"']+)["'][^\]]*\]([\s\S]*?)\[\/et_pb_row\]/g;
      let rowMatch;
      
      while ((rowMatch = rowRegex.exec(sectionContent)) !== null) {
        const columnStructure = rowMatch[1];
        const rowContent = rowMatch[2];
        
        // Skip if not 1_3,2_3 or 2_5,3_5
        if (!columnStructure.includes('1_3,2_3') && !columnStructure.includes('2_5,3_5')) {
          continue;
        }
        
        // Skip placeholder rows
        if (rowContent.includes("Position To Be Filled") || rowContent.includes("Pending")) {
          continue;
        }
        
        globalOrder++;
        
        // Extract image
        const imgMatch = rowContent.match(/\[et_pb_image[^\]]*src=["']([^"']+)["']/);
        const img = imgMatch ? getWpImageUrl(imgMatch[1]) : "";
        
        // Extract name
        let name = "";
        let role = "";
        
        // Try title_prefix
        const nameMatch = rowContent.match(/\[dg_adh_heading[^\]]*title_prefix=["']([^"']+)["']/);
        if (nameMatch) {
          name = nameMatch[1];
        }
        
        // Try et_pb_heading
        if (!name) {
          const headingMatch = rowContent.match(/\[et_pb_heading[^\]]*title=["']([^"']+)["']/);
          if (headingMatch) {
            name = headingMatch[1];
          }
        }
        
        // Try admin_label from row
        if (!name) {
          const adminMatch = rowContent.match(/admin_label=["']([^"']+)["']/);
          if (adminMatch && !adminMatch[1].includes('Row') && !adminMatch[1].includes('Section')) {
            name = adminMatch[1];
          }
        }
        
        // Check for suffix
        const suffixMatch = rowContent.match(/title_suffix=["']([^"']+)["']/);
        if (suffixMatch) {
          role = suffixMatch[1].replace(/^\|/, '').trim();
        }
        
        // If name has "|" separator
        if (name.includes("|")) {
          const parts = name.split("|");
          name = parts[0].trim();
          if (!role) role = parts[1].trim();
        }
        
        // Extract bio
        let bio = "";
        const textMatch = rowContent.match(/\[et_pb_text[^\]]*\]([\s\S]*?)\[\/et_pb_text\]/);
        if (textMatch) {
          bio = textMatch[1]
            .replace(/<[^>]*>/g, '')
            .replace(/&#822[01];/g, '"')
            .replace(/&#8217;/g, "'")
            .replace(/&#8211;/g, "–")
            .replace(/&#038;/g, "&")
            .replace(/&amp;/g, "&")
            .replace(/\s+/g, " ")
            .trim();
        }
        
        name = name.replace(/<[^>]*>/g, '').trim();
        
        // Only add if we have a valid name and bio
        if (name && bio && name.length > 2) {
          // Check if this is actually a person's name (not a section title)
          const isSectionTitle = [
            'Staff & Volunteers', 'Program & Policy', 'Development', 'Operations',
            'Media & Marketing', 'Web Development', 'Accounting', 'R.E.B.U.I.L.D.',
            'Our Partners', 'Stony Brook', 'Executive Administrative',
            'Chief Development', 'Project Manager', 'Position To Be Filled',
            'Pending', 'Section', 'Row', 'Hundred Stories', 'REBUILD',
            'Program', 'Policy', 'Director', 'Manager'
          ].some(word => name.toLowerCase() === word.toLowerCase());
          
          // Also skip if it's a single word title
          const isSingleWordTitle = name.split(' ').length <= 1 && 
            ['Executive', 'Program', 'Development', 'Operations', 'Media', 'Web', 
             'Accounting', 'Chief', 'Project', 'Position', 'Pending'].includes(name);
          
          if (!isSectionTitle && !isSingleWordTitle) {
            const exists = staff.some(s => s.name.toLowerCase() === name.toLowerCase());
            if (!exists) {
              const finalRole = role || currentSectionTitle || "Team Member";
              staff.push({ 
                name, 
                role: finalRole, 
                bio, 
                img,
                sectionTitle: currentSectionTitle || finalRole,
                order: globalOrder
              });
            }
          }
        }
      }
    }
  }
  
  // ============================================
  // Deduplicate and sort by order
  // ============================================
  const seen = new Set();
  const uniqueStaff = staff.filter(member => {
    const key = member.name.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  
  // Sort by order to maintain WordPress order
  uniqueStaff.sort((a, b) => a.order - b.order);
  
  console.log('Total staff extracted:', uniqueStaff.length);
  console.log('Staff in order:', uniqueStaff.map(s => `${s.name} (${s.sectionTitle})`).join(' → '));
  
  return uniqueStaff;
}

export default async function StaffPage() {
  const page = await getPageBySlug("staff-and-volunteers");
  
  if (!page) {
    return (
      <main className="min-h-screen bg-white dark:bg-[#1a1a1a] text-black dark:text-[#f4f4f4] transition-colors duration-300 font-serif">
        <div className="max-w-4xl mx-auto py-16 px-6 text-center">
          <h1 className="text-3xl font-bold mb-4">Staff & Volunteers</h1>
          <p className="text-stone-500 dark:text-stone-400">Loading staff data...</p>
        </div>
      </main>
    );
  }

  const staff = extractStaffFromDivi(page.content);

  // Group staff by section title while preserving order
  const groupedStaff: { [key: string]: typeof staff } = {};
  staff.forEach(member => {
    const key = member.sectionTitle || member.role || "Team Member";
    if (!groupedStaff[key]) {
      groupedStaff[key] = [];
    }
    groupedStaff[key].push(member);
  });

  return (
    <main className="min-h-screen bg-white dark:bg-[#1a1a1a] text-black dark:text-[#f4f4f4] transition-colors duration-300 font-serif selection:bg-[#FFB81C]/30">
      
      {/* HERO SECTION */}
      <header className="relative h-[40vh] flex items-end pb-16 px-6 md:px-20 overflow-hidden border-b border-black/10 dark:border-white/10 bg-gradient-to-b from-stone-50 dark:from-stone-900 to-white dark:to-[#1a1a1a]">
        {page.featuredImageUrl && (
          <div className="absolute inset-0 z-0">
            <Image 
              src={page.featuredImageUrl} 
              alt={page.featuredImageAlt || page.title}
              fill
              className="object-cover opacity-20 grayscale"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#1a1a1a] to-transparent" />
          </div>
        )}
        
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <span className="inline-block bg-[#FFB81C] text-black px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            Our Team
          </span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85] mb-4">
            Staff & <span className="text-[#FFB81C]">Volunteers</span>
          </h1>
          <p className="text-lg md:text-xl text-stone-600 dark:text-stone-400 max-w-2xl font-light">
            Dedicated individuals working together to create meaningful change in our communities.
          </p>
        </div>
      </header>

      {/* STAFF LIST - Image Left, Text Right */}
      <section className="max-w-7xl mx-auto py-16 px-6 md:px-20">
        <div className="max-w-5xl mx-auto">
          {Object.keys(groupedStaff).length > 0 ? (
            <div className="space-y-16">
              {Object.entries(groupedStaff).map(([sectionTitle, members]) => (
                <div key={sectionTitle}>
                  {/* Section Title */}
                  {sectionTitle && !sectionTitle.includes('Team Member') && sectionTitle !== '' && (
                    <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wider mb-8 pb-4 border-b border-black/10 dark:border-white/10">
                      {sectionTitle}
                    </h2>
                  )}
                  
                  {/* Staff Cards - Image Left, Text Right */}
                  <div className="space-y-8">
                    {members.map((member, index) => {
                      const isEven = index % 2 === 0;
                      const cardBg = isEven 
                        ? 'bg-stone-50 dark:bg-[#2a2a2a] border-black/5 dark:border-white/5 text-black dark:text-[#f4f4f4]' 
                        : 'bg-stone-900 dark:bg-[#0a0a0a] border-stone-800 text-white';

                      return (
                        <div 
                          key={index} 
                          className={`rounded-2xl border overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.01] ${cardBg}`}
                        >
                          <div className="flex flex-col md:flex-row gap-8 p-8 md:p-10 items-center md:items-start">
                            
                            {/* Image - Left Column - Larger and Uncropped */}
                            <div className="w-full md:w-[200px] flex-shrink-0 flex justify-center">
                              {member.img ? (
                                <div className="relative w-48 h-48 md:w-full md:aspect-square rounded-2xl overflow-hidden bg-stone-200 dark:bg-stone-800 border-2 border-[#FFB81C]/20 shadow-inner">
                                  <Image
                                    src={member.img}
                                    alt={member.name}
                                    fill
                                    className="object-contain p-3"
                                    sizes="(max-width: 768px) 192px, 200px"
                                    unoptimized={member.img.includes('.heic')}
                                  />
                                </div>
                              ) : (
                                <div className="w-48 h-48 md:w-full md:aspect-square rounded-2xl bg-gradient-to-br from-[#FFB81C]/20 to-[#FFB81C]/5 flex items-center justify-center border-2 border-dashed border-[#FFB81C]/30">
                                  <span className="text-6xl font-black text-[#FFB81C]">
                                    {member.name.charAt(0)}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            {/* Content - Right Column */}
                            <div className="flex-grow w-full text-center md:text-left">
                              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3">
                                <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
                                  {member.name}
                                </h3>
                                {member.role && (
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFB81C] bg-[#FFB81C]/10 border border-[#FFB81C]/30 px-3 py-1 rounded-full">
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

      {/* ACTION FOOTER */}
      <section className="max-w-7xl mx-auto px-6 md:px-20 pb-16">
        <div className="pt-16 border-t border-black/10 dark:border-white/10 flex flex-wrap gap-8 items-center justify-center">
          <Link 
            href="/contact" 
            className="px-10 py-5 bg-[#FFB81C] text-black text-xs font-black uppercase tracking-widest hover:bg-yellow-500 transition-all rounded"
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