// src/app/about/staff/page.tsx
import Image from "next/image";
import StaffCard from "@/components/StaffCard";
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
      <main className="min-h-screen bg-white dark:bg-[#1a1a1a] p-20 text-black dark:text-white">
        <p>Loading staff data...</p>
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
    <main className="min-h-screen bg-white dark:bg-[#1a1a1a] text-black dark:text-[#f4f4f4] py-16 px-6 md:px-20 font-serif">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-16 border-b border-black/10 dark:border-white/10 pb-8">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
            {page.title}
          </h1>
          
          {/* Featured Image */}
          {page.featuredImageUrl && (
            <div className="relative w-full h-[200px] md:h-[300px] mt-6 rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800">
              <Image
                src={page.featuredImageUrl}
                alt={page.featuredImageAlt || page.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 1200px"
              />
            </div>
          )}
        </header>

        {/* Staff Grid - Grouped by Role/Section in order */}
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
                
                {/* Staff Cards Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                  {members.map((member, index) => (
                    <StaffCard 
                      key={index} 
                      name={member.name} 
                      role={member.role || "Team Member"} 
                      bio={member.bio} 
                      img={member.img || page.featuredImageUrl || ''} 
                    />
                  ))}
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
    </main>
  );
}