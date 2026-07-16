// src/app/programs/page.tsx
import Image from "next/image";
import Link from "next/link";
import { getPageBySlug } from "@/lib/wordpress/pages";
import { getWpImageUrl } from "@/lib/wordpress/client";

interface ProgramSection {
  title: string;
  description: string;
  image?: string;
  buttonText?: string;
  buttonUrl?: string;
  items?: string[];
}

function parseProgramSections(content: string): ProgramSection[] {
  const sections: ProgramSection[] = [];
  
  // Clean the content
  const cleanContent = content
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8211;/g, "–")
    .replace(/&#038;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ");
  
  // Find all sections with admin_label
  const sectionRegex = /\[et_pb_section[^\]]*admin_label="([^"]*)"[^\]]*\]([\s\S]*?)\[\/et_pb_section\]/g;
  let match;
  
  while ((match = sectionRegex.exec(cleanContent)) !== null) {
    const sectionLabel = match[1] || '';
    const sectionContent = match[2];
    
    // Skip if it's a header or empty section
    if (!sectionLabel || sectionLabel.includes('Section')) continue;
    
    // Extract section title from admin_label or heading
    let title = sectionLabel;
    
    // Try to find a more specific title
    const titleMatch = sectionContent.match(/title_suffix=["']([^"']+)["']/);
    if (titleMatch) {
      title = titleMatch[1].replace(/^\|/, '').trim();
    }
    
    // Extract description (text content)
    const textMatch = sectionContent.match(/\[et_pb_text[^\]]*\]([\s\S]*?)\[\/et_pb_text\]/);
    let description = '';
    let items: string[] = [];
    
    if (textMatch) {
      let text = textMatch[1]
        .replace(/<[^>]*>/g, '')
        .replace(/&#822[01];/g, '"')
        .replace(/&#8217;/g, "'")
        .replace(/&#8211;/g, "–")
        .replace(/&#038;/g, "&")
        .replace(/&amp;/g, "&")
        .replace(/\s+/g, " ")
        .trim();
      
      // Check for lists (items with • or numbers)
      const listItems = text.match(/[•●]\s*([^\n]+)/g) || text.match(/\d+\.\s*([^\n]+)/g);
      if (listItems) {
        items = listItems.map(item => item.replace(/^[•●\d.]\s*/, '').trim());
        // Remove list items from description
        text = text.replace(/[•●]\s*[^\n]+/g, '').replace(/\d+\.\s*[^\n]+/g, '').trim();
      }
      
      description = text;
    }
    
    // Extract image
    const imgMatch = sectionContent.match(/\[et_pb_image[^\]]*src=["']([^"']+)["']/);
    const image = imgMatch ? getWpImageUrl(imgMatch[1]) : '';
    
    // Extract button
    const buttonMatch = sectionContent.match(/\[et_pb_button[^\]]*button_text=["']([^"']+)["'][^\]]*button_url=["']([^"']+)["']/);
    let buttonText = '';
    let buttonUrl = '';
    if (buttonMatch) {
      buttonText = buttonMatch[1];
      buttonUrl = buttonMatch[2];
    }
    
    // Only add if we have content
    if (description || items.length > 0) {
      sections.push({
        title,
        description: description || '',
        image: image || '',
        buttonText,
        buttonUrl,
        items
      });
    }
  }
  
  return sections;
}

export default async function ProgramsPage() {
  const page = await getPageBySlug('programs');

  if (!page) {
    return (
      <main className="min-h-screen bg-white dark:bg-[#1a1a1a] flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </main>
    );
  }

  const sections = parseProgramSections(page.content);

  return (
    <main className="min-h-screen bg-white dark:bg-[#1a1a1a] text-black dark:text-[#f4f4f4] transition-colors duration-300 font-serif">
      
      {/* HERO SECTION */}
      <header className="relative h-[50vh] flex items-end pb-20 px-6 md:px-20 overflow-hidden border-b border-black/10 dark:border-white/10">
        {page.featuredImageUrl && (
          <div className="absolute inset-0 z-0">
            <Image 
              src={page.featuredImageUrl} 
              alt={page.title}
              fill
              className="object-cover opacity-30 grayscale"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#1a1a1a] to-transparent" />
          </div>
        )}
        
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <span className="inline-block bg-[#FFB81C] text-black px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            UBFSF Initiatives
          </span>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-6">
            Our <span className="text-[#FFB81C]">Programs</span>
          </h1>
          <p className="text-lg md:text-xl text-stone-600 dark:text-stone-400 max-w-2xl font-light">
            Building stronger communities through education, opportunity, and empowerment.
          </p>
        </div>
      </header>

      {/* PROGRAM SECTIONS */}
      <section className="max-w-7xl mx-auto py-16 px-6 md:px-20">
        {sections.length > 0 ? (
          <div className="space-y-24">
            {sections.map((section, index) => (
              <div 
                key={index}
                className={`grid md:grid-cols-2 gap-12 items-start ${
                  index % 2 === 1 ? 'md:grid-flow-dense' : ''
                }`}
              >
                {/* Image - Using object-contain to prevent cropping */}
                {section.image && (
                  <div className={`relative h-80 md:h-96 rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 ${
                    index % 2 === 1 ? 'md:col-start-2' : ''
                  }`}>
                    <Image
                      src={section.image}
                      alt={section.title}
                      fill
                      className="object-contain" // Changed from object-cover to object-contain
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={index === 0}
                    />
                  </div>
                )}

                {/* Content */}
                <div className={`${index % 2 === 1 ? 'md:col-start-1 md:row-start-1' : ''}`}>
                  <div className="inline-block mb-4 px-4 py-1 bg-[#FFB81C]/10 border border-[#FFB81C]/20 rounded-full">
                    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#FFB81C]">
                      Program
                    </span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                    {section.title}
                  </h2>
                  
                  {section.description && (
                    <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-6">
                      {section.description}
                    </p>
                  )}
                  
                  {section.items && section.items.length > 0 && (
                    <ul className="space-y-2 mb-6">
                      {section.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-stone-600 dark:text-stone-400">
                          <span className="text-[#FFB81C] mt-1">✦</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  {section.buttonText && section.buttonUrl && (
                    <Link
                      href={section.buttonUrl}
                      className="inline-block px-8 py-3 bg-[#FFB81C] text-black text-xs font-black uppercase tracking-widest hover:bg-yellow-500 transition-colors"
                    >
                      {section.buttonText}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Fallback: Show raw content if parsing fails
          <div 
            className="prose dark:prose-invert max-w-none leading-relaxed text-lg"
            dangerouslySetInnerHTML={{ __html: page.content }} 
          />
        )}
        
       
      </section>
    </main>
  );
}