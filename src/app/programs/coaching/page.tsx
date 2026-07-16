// src/app/programs/nonprofit-conference/page.tsx
import Image from "next/image";
import Link from "next/link";
import { getPageBySlug } from "@/lib/wordpress/pages";
import { getWpImageUrl } from "@/lib/wordpress/client";

interface Panelist {
  name: string;
  role?: string;
  bio: string;
  img: string;
  audioClips: AudioClip[];
}

interface AudioClip {
  title: string;
  url: string;
  artist: string;
}

function parseConferenceContent(content: string) {
  // Clean common character encodings
  const cleanContent = content
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8211;/g, "–")
    .replace(/&#038;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ");

  let mainDescription = '';
  let whyThisMattersTitle = '';
  let whyThisMattersDescription = '';
  let raisingTheBarText = '';
  let objectives: string[] = [];
  let topics: string[] = [];
  let panelists: Panelist[] = [];
  let videoUrl = '';
  let mainImage = '';
  let mainImageCaption = '';
  let conferencePanelistsTitle = '';
  let januaryPanelistsTitle = '';

  const wpDomain = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://ubfsf.org';

  // Extract Main Image
  const mainImageMatch = cleanContent.match(/\[et_pb_image[^\]]*src=["']([^"']+)["'][^\]]*\]/);
  if (mainImageMatch) {
    mainImage = getWpImageUrl(mainImageMatch[1]);
  }

  // Extract Caption
  const captionMatch = cleanContent.match(/\[et_pb_text[^\]]*text_text_color="#666666"[^\]]*\]([\s\S]*?)\[\/et_pb_text\]/);
  if (captionMatch) {
    mainImageCaption = captionMatch[1]
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Extract Titles
  const panelEventMatch = cleanContent.match(/title_prefix=["'](December 2023 Panel Event[^"']+)["']/);
  if (panelEventMatch) {
    conferencePanelistsTitle = panelEventMatch[1];
  }

  const januaryMatch = cleanContent.match(/title_prefix=["'](January 2024 Conference Panelists[^"']+)["']/);
  if (januaryMatch) {
    januaryPanelistsTitle = januaryMatch[1];
  }

  // ============================================
  // STEP 1: Extract ALL audio clips first
  // ============================================
  const allAudioClips: { panelistName: string; clips: AudioClip[] }[] = [];
  
  const audioSectionRegex = /\[et_pb_section[^\]]*admin_label="([^"]*)"[^\]]*\]([\s\S]*?)\[\/et_pb_section\]/g;
  let sectionMatch;
  
  while ((sectionMatch = audioSectionRegex.exec(cleanContent)) !== null) {
    const sectionLabel = sectionMatch[1] || '';
    const sectionContent = sectionMatch[2];
    
    if (!sectionLabel.includes('Audio')) continue;
    
    let panelistName = sectionLabel.replace('Audio – ', '').trim();
    
    const imgMatch = sectionContent.match(/\[et_pb_image[^\]]*src=["']([^"']+)["']/);
    const img = imgMatch ? getWpImageUrl(imgMatch[1]) : '';
    
    const audioRegex = /\[et_pb_audio[^\]]*audio="([^"]+)"[^\]]*title="([^"]+)"[^\]]*artist_name="([^"]+)"[^\]]*\]/g;
    const clips: AudioClip[] = [];
    let audioMatch;
    
    while ((audioMatch = audioRegex.exec(sectionContent)) !== null) {
      let audioUrl = audioMatch[1];
      if (audioUrl.startsWith('/')) {
        audioUrl = `${wpDomain}${audioUrl}`;
      }
      clips.push({
        url: audioUrl,
        title: audioMatch[2],
        artist: audioMatch[3]
      });
    }
    
    if (panelistName && clips.length > 0) {
      allAudioClips.push({ panelistName, clips });
    }
  }

  // ============================================
  // STEP 2: Extract panelists from rows (1_3,2_3)
  // ============================================
  const rowStarts: number[] = [];
  let pos = 0;
  while ((pos = cleanContent.indexOf('[et_pb_row', pos)) !== -1) {
    rowStarts.push(pos);
    pos += 10;
  }

  for (let i = 0; i < rowStarts.length; i++) {
    const start = rowStarts[i];
    const end = rowStarts[i + 1] ? rowStarts[i + 1] : cleanContent.length;
    const segment = cleanContent.substring(start, end);

    // Skip global section headers
    if (segment.includes('title_prefix="UBFSF"') || segment.includes('Conference Objectives')) {
      continue;
    }

    // Skip rows without 1_3,2_3 or 2_5,3_5 structure
    if (!segment.includes('1_3,2_3') && !segment.includes('2_5,3_5')) {
      continue;
    }

    // Extract image
    const imgMatch = segment.match(/\[et_pb_image[^\]]*src=["']([^"']+)["']/);
    const img = imgMatch ? getWpImageUrl(imgMatch[1]) : '';

    // Extract Name
    let name = '';
    const titlePrefixMatch = segment.match(/title_prefix=["']([^"']+)["']/);
    if (titlePrefixMatch) {
      name = titlePrefixMatch[1];
    } else {
      const adminLabelMatch = segment.match(/admin_label=["']([^"']+)["']/);
      if (adminLabelMatch) name = adminLabelMatch[1];
    }

    if (name) {
      name = name.split('|')[0].trim();
    }

    // Extract Role
    const roleMatch = segment.match(/title_suffix=["']([^"']+)["']/);
    const role = roleMatch ? roleMatch[1].replace(/^\|/, '').trim() : '';

    // Extract Biography
    const bioMatch = segment.match(/\[et_pb_text[^\]]*\]([\s\S]*?)(?:\[\/et_pb_text\]|$)/);
    const bio = bioMatch ? bioMatch[1]
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim() : '';

    // Find matching audio clips for this panelist
    let matchingClips: AudioClip[] = [];
    const matchingAudio = allAudioClips.find(a => 
      a.panelistName.toLowerCase().includes(name.toLowerCase()) ||
      name.toLowerCase().includes(a.panelistName.toLowerCase())
    );
    if (matchingAudio) {
      matchingClips = matchingAudio.clips;
    }

    // Save Panelist
    if (name && (bio || img || matchingClips.length > 0)) {
      const existingIdx = panelists.findIndex(p => p.name.toLowerCase() === name.toLowerCase());
      if (existingIdx > -1) {
        if (bio) panelists[existingIdx].bio = bio;
        if (role) panelists[existingIdx].role = role;
        if (img) panelists[existingIdx].img = img;
        if (matchingClips.length > 0) panelists[existingIdx].audioClips = matchingClips;
      } else {
        panelists.push({
          name,
          role: role || '',
          bio: bio || '',
          img: img || '',
          audioClips: matchingClips
        });
      }
    }
  }

  // ============================================
  // STEP 3: Add any panelists that only have audio (no row)
  // ============================================
  for (const audioData of allAudioClips) {
    const exists = panelists.some(p => 
      p.name.toLowerCase().includes(audioData.panelistName.toLowerCase()) ||
      audioData.panelistName.toLowerCase().includes(p.name.toLowerCase())
    );
    
    if (!exists) {
      panelists.push({
        name: audioData.panelistName,
        role: '',
        bio: '',
        img: '',
        audioClips: audioData.clips
      });
    }
  }

  // ============================================
  // STEP 4: Extract text content
  // ============================================
  const textMatches = cleanContent.match(/\[et_pb_text[^\]]*\]([\s\S]*?)\[\/et_pb_text\]/g) || [];
  for (const textMatch of textMatches) {
    const text = textMatch
      .replace(/\[et_pb_text[^\]]*\]/, '')
      .replace(/\[\/et_pb_text\]/, '')
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, " ")
      .trim();

    if (text && !mainDescription && text.length > 100 && !text.includes('Credit:') && !text.includes('Conference Objectives')) {
      mainDescription = text;
    }

    if (text.includes('Conference Objectives')) {
      const items = textMatch.match(/<li[^>]*>([\s\S]*?)<\/li>/g);
      if (items) {
        objectives = items.map(item => item.replace(/<[^>]*>/g, '').trim());
      }
    }

    if (text.includes('Conference Topics Include')) {
      const items = textMatch.match(/<li[^>]*>([\s\S]*?)<\/li>/g);
      if (items) {
        topics = items.map(item => item.replace(/<[^>]*>/g, '').trim());
      }
    }
  }

  // Extract Why This Conference Matters
  const mattersSectionRegex = /\[et_pb_section[^\]]*admin_label="Conference Panelists"[^\]]*\]([\s\S]*?)\[\/et_pb_section\]/;
  const mattersMatch = mattersSectionRegex.exec(cleanContent);
  if (mattersMatch) {
    const mattersContent = mattersMatch[1];
    const headingMatch = mattersContent.match(/title_suffix=["']([^"']+)["']/);
    if (headingMatch) {
      whyThisMattersTitle = headingMatch[1];
    }
    
    const textMatch = mattersContent.match(/\[et_pb_text[^\]]*\]([\s\S]*?)\[\/et_pb_text\]/g);
    if (textMatch) {
      let descriptions: string[] = [];
      for (const t of textMatch) {
        const text = t
          .replace(/\[et_pb_text[^\]]*\]/, '')
          .replace(/\[\/et_pb_text\]/, '')
          .replace(/<[^>]*>/g, '')
          .replace(/\s+/g, " ")
          .trim();
        if (text) descriptions.push(text);
      }
      if (descriptions.length > 0) {
        whyThisMattersDescription = descriptions[0] || '';
      }
      const raisingText = descriptions.find(d => d.includes('Raising the Bar') || d.includes('Watch our'));
      if (raisingText) {
        raisingTheBarText = raisingText;
      }
    }
  }

  // Extract Video
  const videoMatch = cleanContent.match(/\[et_pb_video[^\]]*src="([^"]+)"[^\]]*\]/);
  if (videoMatch) {
    videoUrl = videoMatch[1];
    if (videoUrl.includes('watch?v=')) {
      const id = videoUrl.split('v=')[1]?.split('&')[0];
      videoUrl = `https://www.youtube.com/embed/${id}`;
    } else if (videoUrl.includes('youtu.be')) {
      const id = videoUrl.split('/').pop();
      videoUrl = `https://www.youtube.com/embed/${id}`;
    }
  }

  console.log('Total panelists found:', panelists.length);
  console.log('Panelists with audio:', panelists.filter(p => p.audioClips.length > 0).map(p => p.name));
  console.log('Panelists with images:', panelists.filter(p => p.img).map(p => p.name));

  return {
    panelists,
    videoUrl,
    objectives,
    topics,
    mainDescription,
    mainImage,
    mainImageCaption,
    whyThisMattersTitle,
    whyThisMattersDescription,
    raisingTheBarText,
    conferencePanelistsTitle,
    januaryPanelistsTitle
  };
}

// Audio Player Component
function AudioPlayer({ src, title, artist }: { src: string; title: string; artist: string }) {
  return (
    <div className="bg-white dark:bg-[#1a1a1a] p-4 rounded-xl border border-black/10 dark:border-white/10 my-3 shadow-md hover:shadow-lg transition-shadow">
      <p className="text-base font-semibold text-black dark:text-white mb-1 line-clamp-2">
        {title}
      </p>
      <p className="text-sm text-[#FFB81C] font-medium mb-3">
        by {artist}
      </p>
      <div className="w-full">
        <audio controls className="w-full h-12 rounded-lg" preload="metadata">
          <source src={src} type="audio/mpeg" />
          <source src={src} type="audio/mp3" />
          <source src={src} type="audio/m4a" />
          <source src={src} type="audio/aac" />
          Your browser does not support the audio element.
        </audio>
      </div>
    </div>
  );
}

export default async function NonprofitConferencePage() {
  const page = await getPageBySlug('nonprofit-conference');

  if (!page) {
    return (
      <main className="min-h-screen bg-white dark:bg-[#1a1a1a] flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </main>
    );
  }

  const {
    panelists,
    videoUrl,
    objectives,
    topics,
    mainDescription,
    mainImage,
    mainImageCaption,
    whyThisMattersTitle,
    whyThisMattersDescription,
    raisingTheBarText,
    conferencePanelistsTitle,
    januaryPanelistsTitle
  } = parseConferenceContent(page.content);

  const validPanelists = panelists.filter(p => p.name && (p.bio || p.img || p.audioClips.length > 0));

  return (
    <main className="min-h-screen bg-white dark:bg-[#1a1a1a] text-black dark:text-[#f4f4f4] transition-colors duration-300 font-serif">
      
      {/* HERO SECTION */}
      <header className="relative h-[40vh] flex items-end pb-16 px-6 md:px-20 overflow-hidden border-b border-black/10 dark:border-white/10">
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
            UBFSF Initiative
          </span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85] mb-4">
            Nonprofit <span className="text-[#FFB81C]">Conference</span>
          </h1>
          <p className="text-lg md:text-xl text-stone-600 dark:text-stone-400 max-w-2xl font-light">
            Empowering incarcerated citizens to become nonprofit leaders and community changemakers.
          </p>
        </div>
      </header>

      {/* CONTENT SECTION */}
      <section className="max-w-7xl mx-auto py-16 px-6 md:px-20">
        
        {/* Main Description */}
        {mainDescription && (
          <div className="max-w-4xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Raising the Bar!</h2>
            <div className="text-stone-600 dark:text-stone-400 leading-relaxed text-lg space-y-4">
              {mainDescription.split('\n').map((paragraph, i) => (
                paragraph.trim() && <p key={i}>{paragraph.trim()}</p>
              ))}
            </div>
          </div>
        )}

        {/* Main Image */}
        {mainImage && (
          <div className="max-w-4xl mx-auto mb-12">
            <div className="relative rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800">
              <Image
                src={mainImage}
                alt="Conference image"
                width={1200}
                height={600}
                className="w-full h-auto object-cover"
                sizes="(max-width: 768px) 100vw, 1200px"
              />
            </div>
            {mainImageCaption && (
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 text-center italic">
                {mainImageCaption}
              </p>
            )}
          </div>
        )}

        {/* WHY THIS CONFERENCE MATTERS */}
        {whyThisMattersTitle && (
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center border-b border-black/10 dark:border-white/10 pb-6">
              {whyThisMattersTitle}
            </h2>
            
            {whyThisMattersDescription && (
              <div className="text-stone-600 dark:text-stone-400 leading-relaxed text-lg space-y-4 mb-6">
                {whyThisMattersDescription.split('\n').map((paragraph, i) => (
                  paragraph.trim() && <p key={i}>{paragraph.trim()}</p>
                ))}
              </div>
            )}
            
            {raisingTheBarText && (
              <div className="bg-stone-50 dark:bg-[#2a2a2a] p-8 rounded-2xl border border-black/5 dark:border-white/5">
                <h3 className="text-2xl font-bold mb-3 text-[#FFB81C]">"Raising the Bar!"</h3>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                  {raisingTheBarText.replace('Raising the Bar!', '').trim()}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Video Section */}
        {videoUrl && (
          <div className="mb-16 max-w-4xl mx-auto">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/5 dark:bg-white/5 border-2 border-[#FFB81C]">
              <iframe
                src={videoUrl}
                title="UBFSF Conference Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        )}

        {/* Objectives & Topics */}
        {(objectives.length > 0 || topics.length > 0) && (
          <div className="grid md:grid-cols-2 gap-12 mb-16 max-w-4xl mx-auto">
            {objectives.length > 0 && (
              <div className="bg-stone-50 dark:bg-[#2a2a2a] p-8 rounded-2xl border border-black/5 dark:border-white/5">
                <h3 className="text-xl font-bold mb-4 text-[#FFB81C]">Conference Objectives</h3>
                <ul className="space-y-3">
                  {objectives.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-stone-600 dark:text-stone-400">
                      <span className="text-[#FFB81C] mt-1">✦</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {topics.length > 0 && (
              <div className="bg-stone-50 dark:bg-[#2a2a2a] p-8 rounded-2xl border border-black/5 dark:border-white/5">
                <h3 className="text-xl font-bold mb-4 text-[#FFB81C]">Conference Topics</h3>
                <ul className="space-y-3">
                  {topics.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-stone-600 dark:text-stone-400">
                      <span className="text-[#FFB81C] mt-1">✦</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* DECEMBER 2023 PANEL EVENT */}
        {conferencePanelistsTitle && (
          <div className="max-w-4xl mx-auto mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center border-b border-black/10 dark:border-white/10 pb-6">
              {conferencePanelistsTitle}
            </h3>
          </div>
        )}

        {/* PANELISTS with Images and Audio - December + January Combined */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {validPanelists.map((panelist, index) => (
              <div key={index} className="bg-stone-50 dark:bg-[#2a2a2a] rounded-2xl border border-black/5 dark:border-white/5 overflow-hidden">
                <div className="grid md:grid-cols-4 gap-6 p-6">
                  {/* Image - Left side */}
                  {panelist.img ? (
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-stone-200 dark:bg-stone-800">
                      <Image
                        src={panelist.img}
                        alt={panelist.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 25vw"
                        unoptimized={panelist.img.includes('.heic')}
                      />
                    </div>
                  ) : (
                    <div className="aspect-square rounded-xl bg-gradient-to-br from-[#FFB81C]/20 to-[#FFB81C]/5 flex items-center justify-center border-2 border-dashed border-[#FFB81C]/30">
                      <span className="text-4xl font-bold text-[#FFB81C]/50">
                        {panelist.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  
                  {/* Content - Right side */}
                  <div className="md:col-span-3">
                    <h3 className="text-2xl font-bold mb-2">{panelist.name}</h3>
                    {panelist.role && (
                      <p className="text-[#FFB81C] font-semibold text-sm uppercase tracking-wider mb-3">
                        {panelist.role}
                      </p>
                    )}
                    {panelist.bio && (
                      <p className="text-stone-600 dark:text-stone-400 leading-relaxed whitespace-pre-line">
                        {panelist.bio}
                      </p>
                    )}
                    
                    {/* Audio Clips */}
                    {panelist.audioClips.length > 0 && (
                      <div className="mt-6 space-y-4">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-[#FFB81C] border-b border-black/10 dark:border-white/10 pb-2">
                          Testimonials
                        </h4>
                        {panelist.audioClips.map((clip, clipIndex) => (
                          <AudioPlayer
                            key={clipIndex}
                            src={clip.url}
                            title={clip.title}
                            artist={clip.artist}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* JANUARY 2024 PANEL EVENT - Title Section */}
        {januaryPanelistsTitle && (
          <div className="max-w-4xl mx-auto mt-16">
            <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center border-b border-black/10 dark:border-white/10 pb-6">
              {januaryPanelistsTitle}
            </h3>
            <p className="text-stone-500 dark:text-stone-400 text-center mb-8">
              Below are our discussion event panelists.
            </p>
          </div>
        )}
        
        {/* ACTION FOOTER */}
        <div className="mt-16 pt-16 border-t border-black/10 dark:border-white/10 flex flex-wrap gap-8 items-center justify-center">
          <Link 
            href="/contact" 
            className="px-10 py-5 bg-[#FFB81C] text-black text-xs font-black uppercase tracking-widest hover:bg-yellow-500 transition-all"
          >
            Get Involved
          </Link>
          <p className="text-stone-500 font-bold uppercase tracking-widest text-[10px]">
            Help us build stronger communities.
          </p>
        </div>
      </section>
    </main>
  );
}