// src/lib/wordpress/staff.ts
import { getWpImageUrl } from "./client";

export interface StaffMember {
  name: string;
  role: string;
  bio: string;
  img: string;
  sectionTitle: string;
}

/**
 * Parse staff from Divi content - simple and maintainable
 * This uses a simpler approach that's less brittle
 */
export function parseStaffFromDivi(content: string): StaffMember[] {
  const staff: StaffMember[] = [];
  
  // Clean the content
  const cleanContent = content
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8211;/g, "–")
    .replace(/&#038;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ");
  
  // Extract all staff from et_pb_team_member (Erena, Gianna)
  const teamRegex = /\[et_pb_team_member[^\]]*name="([^"]+)"[^\]]*image_url="([^"]+)"[^\]]*\]([\s\S]*?)\[\/et_pb_team_member\]/g;
  let match;
  while ((match = teamRegex.exec(cleanContent)) !== null) {
    const name = match[1];
    const img = getWpImageUrl(match[2]);
    const bio = match[3]
      .replace(/<[^>]*>/g, '')
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
      staff.push({ name: cleanName, role, bio, img, sectionTitle: "Hundred Stories Project" });
    }
  }
  
  // Extract from rows with 1_3,2_3 structure
  const rowRegex = /\[et_pb_row[^\]]*column_structure\s*=\s*["']1_3,\s*2_3["'][^\]]*\]([\s\S]*?)\[\/et_pb_row\]/g;
  while ((match = rowRegex.exec(cleanContent)) !== null) {
    const rowContent = match[1];
    if (rowContent.includes("Position To Be Filled") || rowContent.includes("Pending")) continue;
    
    const img = rowContent.match(/src=["']([^"']+)["']/)?.[1] || '';
    const name = rowContent.match(/title_prefix=["']([^"']+)["']/)?.[1] || '';
    const role = rowContent.match(/title_suffix=["']([^"']+)["']/)?.[1]?.replace(/^\|/, '').trim() || '';
    const bio = rowContent.match(/\[et_pb_text[^\]]*\]([\s\S]*?)\[\/et_pb_text\]/)?.[1]
      ?.replace(/<[^>]*>/g, '')
      .replace(/&#822[01];/g, '"')
      .replace(/&#8217;/g, "'")
      .replace(/\s+/g, " ")
      .trim() || '';
    
    if (name && bio && name.length > 2 && !name.includes('Staff & Volunteers')) {
      staff.push({ 
        name, 
        role: role || "Team Member", 
        bio, 
        img: getWpImageUrl(img),
        sectionTitle: "Staff"
      });
    }
  }
  
  // Extract from 2_5,3_5 structure (Ian Wilson)
  const rowRegex2 = /\[et_pb_row[^\]]*column_structure\s*=\s*["']2_5,\s*3_5["'][^\]]*\]([\s\S]*?)\[\/et_pb_row\]/g;
  while ((match = rowRegex2.exec(cleanContent)) !== null) {
    const rowContent = match[1];
    const img = rowContent.match(/src=["']([^"']+)["']/)?.[1] || '';
    const name = rowContent.match(/title=["']([^"']+)["']/)?.[1] || '';
    const bio = rowContent.match(/\[et_pb_text[^\]]*\]([\s\S]*?)\[\/et_pb_text\]/)?.[1]
      ?.replace(/<[^>]*>/g, '')
      .replace(/&#822[01];/g, '"')
      .replace(/&#8217;/g, "'")
      .replace(/\s+/g, " ")
      .trim() || '';
    
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
        img: getWpImageUrl(img),
        sectionTitle: "Staff"
      });
    }
  }
  
  // Deduplicate
  const seen = new Set();
  return staff.filter(m => {
    const key = m.name.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}