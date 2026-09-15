// src/app/programs/hundred-stories/page.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { getPageBySlug } from "@/lib/wordpress/pages";
import { getWpImageUrl } from "@/lib/wordpress/client";
import { SmartPlaceholder } from "@/components/SmartPlaceholder";
import {
  BookOpen,
  PenTool,
  Globe,
  Users,
  MessageSquare,
  Film,
  Library,
  Archive,
  MapPin,
  Award,
  ChevronRight,
  Play,
  ArrowRight,
  ChevronDown,
  ExternalLink,
  MonitorPlay,
  Mic,
  Camera,
  Edit,
  Users2,
  Infinity,
  Globe2,
  Handshake,
  Landmark,
} from "lucide-react";

// ============================================================
// SECTION: UTILITY FUNCTIONS
// ============================================================

function decodeEntities(str: string): string {
  return str
    .replace(/&#8221;/g, '"')
    .replace(/&#8243;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#038;/g, "&")
    .replace(/&#8220;/g, '"')
    .replace(/&#8230;/g, "…")
    .replace(/&#160;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–");
}

function extractContentFromWordPress(rawContent: string) {
  const content = decodeEntities(rawContent);

  const textMatches = content.match(/<p>(.*?)<\/p>/g) || [];
  const textContent = textMatches
    .map(p => p.replace(/<[^>]+>/g, '').trim())
    .filter(Boolean);

  const listMatches = content.match(/<li[^>]*>(.*?)<\/li>/g) || [];
  const listItems = listMatches
    .map(li => li.replace(/<[^>]+>/g, '').trim())
    .filter(Boolean);

  const sections = [
    ...content.matchAll(/title_suffix="([^"]+)"/g),
  ].map(m => m[1]);

  const imageUrls = [
    ...content.matchAll(/src="([^"]+\.(?:jpg|jpeg|png|webp))/gi),
  ].map(m => m[1]);

  let videoUrl: string | null = null;
  const videoMatch = content.match(
    /src="https?:\/\/(?:www\.)?(?:youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/)([^"?&]+)/i
  );
  if (videoMatch) {
    videoUrl = `https://www.youtube.com/embed/${videoMatch[1]}`;
  }

  const bookTitles: string[] = [];
  const bookImages: string[] = [];
  
  const bookSectionRegex = /dg_adh_heading[^>]*title_suffix="([^"]*)"[^>]*>[\s\S]*?et_pb_image[^>]*src="([^"]*\.(jpg|jpeg|png))"/g;
  let bookMatch;
  while ((bookMatch = bookSectionRegex.exec(content)) !== null) {
    if (bookMatch[1] && bookMatch[2]) {
      const title = bookMatch[1];
      if (title.includes('No Rhyme') || title.includes('Social Justice') || title.includes('Kill the Bastard')) {
        bookTitles.push(title);
        bookImages.push(bookMatch[2]);
      }
    }
  }

  if (bookTitles.length === 0) {
    const fallbackRegex = /title_suffix="([^"]*)"[^>]*>[\s\S]*?src="([^"]*\.(jpg|jpeg|png))"/g;
    let fallbackMatch;
    while ((fallbackMatch = fallbackRegex.exec(content)) !== null) {
      if (fallbackMatch[1] && fallbackMatch[2]) {
        const title = fallbackMatch[1];
        if (title.includes('No Rhyme') || title.includes('Social Justice') || title.includes('Kill the Bastard')) {
          bookTitles.push(title);
          bookImages.push(fallbackMatch[2]);
        }
      }
    }
  }

  return {
    textContent,
    listItems,
    sections,
    imageUrls,
    videoUrl,
    bookTitles,
    bookImages,
  };
}

// ============================================================
// SECTION: ANIMATION COMPONENTS
// ============================================================

const FadeIn = ({ children, delay = 0, className = "" }: any) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.45, 0.27, 0.9] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const StaggerContainer = ({ children, className = "" }: any) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.12,
            delayChildren: 0.2,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const StaggerItem = ({ children, className = "" }: any) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.6, ease: [0.21, 0.45, 0.27, 0.9] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

function getImageUrl(imagePath: string, fallback: string): string {
  if (!imagePath) return fallback;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  try {
    const url = getWpImageUrl(imagePath);
    return url || fallback;
  } catch {
    return fallback;
  }
}

// ============================================================
// SECTION: MAIN PAGE COMPONENT
// ============================================================

export default function HundredStoriesClient({
  content,
  title,
  heroImage,
}: {
  content: string;
  title: string;
  heroImage: string;
}) {
  const heroRef = useRef<HTMLElement>(null);

  const scrollToContent = () => {
    const contentSection = document.getElementById('hsp-content');
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const extracted = extractContentFromWordPress(content);

  const heroTitle = title || "Hundred Stories Project";
  const mainDescription = extracted.textContent[0] || "";
  const expandingPerspectivesContent = extracted.textContent.slice(3, 5).join(" ");
  const whyItMattersContent = extracted.textContent.slice(5, 8).join(" ");
  const keyComponents = extracted.listItems.slice(0, 3);
  const whyItMattersItems = extracted.listItems.slice(3, 6);

  const books = [
    { 
      title: extracted.bookTitles[0] || 'No Rhyme or Reason', 
      img: extracted.bookImages[0] || 'https://ubfsf.org/wp-content/uploads/2024/10/no_rhyme_no_reason-1.jpg' 
    },
    { 
      title: extracted.bookTitles[1] || 'Social Justice Autobiographies', 
      img: extracted.bookImages[1] || 'https://ubfsf.org/wp-content/uploads/2024/10/socialjusticeautobiographies_cover-scaled-1.jpg' 
    },
    { 
      title: extracted.bookTitles[2] || 'Kill the Bastard', 
      img: extracted.bookImages[2] || 'https://ubfsf.org/wp-content/uploads/2024/10/kill_the_bastard-scaled-1.jpg' 
    }
  ];

  const pillars = [
    {
      icon: PenTool,
      title: "Write",
      description: "Empowering incarcerated individuals to share their stories through a self-taught writing curriculum.",
      gradient: "from-amber-500/20 to-orange-500/20"
    },
    {
      icon: BookOpen,
      title: "Publish",
      description: "Transforming personal narratives into published manuscripts and anthologies that reach the world.",
      gradient: "from-amber-500/20 to-orange-500/20"
    },
    {
      icon: Globe,
      title: "Transform",
      description: "Changing perspectives and inspiring solutions to systemic issues in the carceral ecosystem.",
      gradient: "from-amber-500/20 to-orange-500/20"
    }
  ];

  const testimonials = [
    {
      quote: "The Hundred Stories Project gave me a voice when I had none. Writing my story helped me heal and find purpose.",
      author: "Michael R.",
      location: "Correctional Facility, NY",
    },
    {
      quote: "This project changed how I see the world. Reading these stories opened my eyes to the humanity behind the statistics.",
      author: "Sarah J.",
      location: "Community Advocate",
    },
    {
      quote: "Through writing, I discovered parts of myself I never knew existed. This project saved my life.",
      author: "David W.",
      location: "Former Incarcerated Individual",
    }
  ];

  const stats = [
    { number: "100+", label: "Stories Collected", icon: BookOpen },
    { number: "15+", label: "States Represented", icon: MapPin },
    { number: "3", label: "Books Published", icon: Library },
    { number: "∞", label: "Lives Impacted", icon: Infinity }
  ];

  const cagesComponents = [
    {
      icon: Globe2,
      title: "International Exchange",
      description: "Connecting incarcerated people in France and the United States through writing, translation, testimony, and media.",
      gradient: "from-amber-500/20 to-orange-500/20"
    },
    {
      icon: Handshake,
      title: "Cross-Cultural Collaboration",
      description: "Bringing together prisoners, university students, educators, and creative professionals to explore shared human experiences.",
      gradient: "from-yellow-500/20 to-amber-500/20"
    },
    {
      icon: MessageSquare,
      title: "Amplify Voices",
      description: "Creating opportunities for incarcerated writers to share and publish their work across borders.",
      gradient: "from-orange-500/20 to-red-500/20"
    }
  ];

  const cagesOutputs = [
    { icon: PenTool, label: "Bilingual Workshops" },
    { icon: Mic, label: "Podcasts" },
    { icon: MonitorPlay, label: "Video Exchanges" },
    { icon: BookOpen, label: "Annual Anthology" },
    { icon: Film, label: "Documentary Content" },
    { icon: Library, label: "Publications" }
  ];

  const videoUrl = extracted.videoUrl || "https://www.youtube.com/embed/pawEixUGK60";

  return (
    <main className="bg-white dark:bg-[#0a0a0a] text-black dark:text-[#f4f4f4] min-h-screen font-serif overflow-x-hidden">
      
      {/* ============================================================
          SECTION 1: VIDEO HERO
          ============================================================ */}
      
      <section ref={heroRef} className="relative w-full h-screen overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          {heroImage ? (
            <Image
              src={heroImage}
              alt={heroTitle}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-ubfsf-black" />
          )}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6 md:px-20 text-center">
          <motion.h1 
            className="text-5xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter mb-6 leading-[1.05] text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {heroTitle}
          </motion.h1>
          
          <motion.div 
            className="w-24 h-1 bg-[#D4A017] mx-auto mb-8"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 1, delay: 0.4 }}
          />

          <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.button
              onClick={scrollToContent}
              className="bg-[#D4A017] text-black px-10 py-4 text-sm font-bold uppercase tracking-wider hover:bg-[#B98A2D] transition-all duration-300 rounded-full shadow-lg hover:shadow-[#D4A017]/30 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore the Stories
              <ArrowRight className="w-5 h-5" strokeWidth={2} />
            </motion.button>
          </motion.div>

          <motion.button
            onClick={scrollToContent}
            className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3 text-white/70 hover:text-white transition-colors group cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            whileHover={{ y: 4 }}
          >
            <span className="text-xs uppercase tracking-[0.2em] font-medium">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1 group-hover:border-white/70 transition-colors">
              <motion.div 
                className="w-1.5 h-1.5 bg-[#D4A017] rounded-full"
                animate={{ y: [0, 12, 0] }}
              />
            </div>
            <ChevronDown className="w-5 h-5 animate-bounce" strokeWidth={1.5} />
          </motion.button>
        </div>
      </section>

      <div id="hsp-content" className="max-w-7xl mx-auto px-6 md:px-20 py-20 md:py-32">

        {/* ============================================================
            SECTION 2: GIVING VOICE
            ============================================================ */}
        
        <section className="grid md:grid-cols-2 gap-16 items-center mb-20">
          <FadeIn>
            <div className="inline-block text-[#D4A017] text-[11px] font-black uppercase tracking-[0.25em] mb-4">
              — Giving Voice
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black dark:text-white leading-tight">
              Giving Voice to the <br />
              <span className="text-[#D4A017]">Voiceless</span>
            </h2>
            
            <p className="text-base leading-relaxed text-stone-600 dark:text-stone-300 mb-4">
              The <span className="font-semibold text-[#D4A017]">Hundred Stories Project (HSP)</span> empowers incarcerated writers to develop, publish, and receive compensation for their creative work.
            </p>
            
            <p className="text-base leading-relaxed text-stone-600 dark:text-stone-300 mb-4">
              Through writing and storytelling, incarcerated individuals gain opportunities to share their experiences and connect with communities beyond prison walls.
            </p>
            
            <p className="text-base leading-relaxed text-stone-600 dark:text-stone-300">
              HSP creates platforms where writers tell their own stories, retain ownership, and reach broader audiences—challenging stereotypes and fostering empathy.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-3">
             
              <div className="flex items-start gap-3 p-3 bg-stone-50 dark:bg-[#1a1a1a] rounded-xl border border-stone-200 dark:border-stone-800">
                <Archive className="w-5 h-5 text-[#D4A017] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <span className="font-semibold text-black dark:text-white">Living Archive:</span>
                  <span className="text-sm text-stone-600 dark:text-stone-400"> Materials accessible for universities, scholars, and advocacy organizations.</span>
                </div>
              </div>
            </div>
          </FadeIn>
          
          <FadeIn>
            <div className="relative aspect-[4/3] w-full bg-stone-100 dark:bg-[#1a1a1a] overflow-hidden shadow-2xl rounded-2xl group">
              <Image 
                src="/image/Preferred HSP Image 2.png" 
                alt="Hundred Stories Bookshelf" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700" 
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-6 left-6 bg-black/70 text-white px-4 py-2 rounded-lg text-sm backdrop-blur-sm">
                <span className="font-semibold text-[#D4A017]">100+</span> Stories Collected
              </div>
            </div>
          </FadeIn>
        </section>

        {/* ============================================================
            SECTION 3: THREE PILLARS
            ============================================================ */}
        
        <section className="mb-32">
          <FadeIn>
            <div className="text-center mb-16">
              <div className="inline-block text-[#D4A017] text-[11px] font-black uppercase tracking-[0.25em] mb-4">
                — Our Foundation
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black dark:text-white">
                Our Three Pillars
              </h2>
              <div className="w-20 h-1 bg-[#D4A017] mx-auto"></div>
            </div>
          </FadeIn>
          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <StaggerItem key={index}>
                  <div className={`group bg-gradient-to-br ${pillar.gradient} bg-stone-50 dark:bg-[#111111] p-10 text-center border border-stone-200 dark:border-stone-800 rounded-2xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-[#D4A017]/30`}>
                    <Icon className="w-16 h-16 text-[#D4A017] mx-auto mb-5 group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
                    <h3 className="text-2xl font-bold mb-3 text-black dark:text-white">{pillar.title}</h3>
                    <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                      {pillar.description}
                    </p>
                    <div className="w-12 h-0.5 bg-[#D4A017]/50 mx-auto mt-4 group-hover:w-20 transition-all duration-300"></div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </section>

        {/* ============================================================
            SECTION 4: WORKFLOW / PROCESS
            ============================================================ */}
        
        <section id="workflow" className="mb-32">
          <FadeIn>
            <div className="text-center mb-16">
              <div className="inline-block text-[#D4A017] text-[11px] font-black uppercase tracking-[0.25em] mb-4">
                — Our Process
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black dark:text-white">
                How Stories Come to Life
              </h2>
              <div className="w-20 h-1 bg-[#D4A017] mx-auto"></div>
              <p className="text-stone-600 dark:text-stone-400 mt-4 max-w-2xl mx-auto">
                From prison walls to the world stage — a collaborative journey of transformation
              </p>
            </div>
          </FadeIn>

          <div className="relative max-w-4xl mx-auto">
            {/* STEP 1 */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 mb-4"
            >
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-[#D4A017]/10 flex items-center justify-center border-2 border-[#D4A017]/20">
                <span className="text-lg font-black text-[#D4A017]">1</span>
              </div>
              <div className="flex-1 bg-stone-50 dark:bg-[#1a1a1a] p-6 rounded-2xl border border-stone-200 dark:border-stone-800 hover:shadow-xl transition-all duration-300 hover:border-[#D4A017]/30 group w-full">
                <div className="flex items-center gap-3 mb-2">
                  <PenTool className="w-5 h-5 text-[#D4A017]" strokeWidth={1.5} />
                  <h4 className="font-bold text-black dark:text-white">Author Submits Work</h4>
                </div>
                <p className="text-sm text-stone-600 dark:text-stone-400">An incarcerated author submits original written work for consideration.</p>
              </div>
            </motion.div>

            <div className="flex justify-center py-2 text-[#D4A017]">
              <ChevronDown className="w-6 h-6" strokeWidth={2} />
            </div>

            {/* STEP 2 */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 mb-4"
            >
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-[#D4A017]/10 flex items-center justify-center border-2 border-[#D4A017]/20">
                <span className="text-lg font-black text-[#D4A017]">2</span>
              </div>
              <div className="flex-1 bg-stone-50 dark:bg-[#1a1a1a] p-6 rounded-2xl border border-stone-200 dark:border-stone-800 hover:shadow-xl transition-all duration-300 hover:border-[#D4A017]/30 group w-full">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-[#D4A017]" strokeWidth={1.5} />
                  <h4 className="font-bold text-black dark:text-white">Acquisition Committee Review</h4>
                </div>
                <p className="text-sm text-stone-600 dark:text-stone-400">The work is reviewed to determine whether it will be accepted.</p>
              </div>
            </motion.div>

            <div className="flex justify-center py-2 text-[#D4A017]">
              <ChevronDown className="w-6 h-6" strokeWidth={2} />
            </div>

            {/* STEP 3 */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 mb-4"
            >
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-[#D4A017]/10 flex items-center justify-center border-2 border-[#D4A017]/20">
                <span className="text-lg font-black text-[#D4A017]">3</span>
              </div>
              <div className="flex-1 bg-stone-50 dark:bg-[#1a1a1a] p-6 rounded-2xl border border-stone-200 dark:border-stone-800 hover:shadow-xl transition-all duration-300 hover:border-[#D4A017]/30 group w-full">
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="w-5 h-5 text-[#D4A017]" strokeWidth={1.5} />
                  <h4 className="font-bold text-black dark:text-white">Author Chooses a Path</h4>
                </div>
                <p className="text-sm text-stone-600 dark:text-stone-400">If accepted, the author can pursue a traditional publishing or production contract, or join the Zo Media cooperative.</p>
              </div>
            </motion.div>

            <div className="flex justify-center py-2 text-[#D4A017]">
              <ChevronDown className="w-6 h-6" strokeWidth={2} />
            </div>

            {/* STEP 4 */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 mb-4"
            >
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-[#D4A017]/10 flex items-center justify-center border-2 border-[#D4A017]/20">
                <span className="text-lg font-black text-[#D4A017]">4</span>
              </div>
              <div className="flex-1 bg-stone-50 dark:bg-[#1a1a1a] p-6 rounded-2xl border border-stone-200 dark:border-stone-800 hover:shadow-xl transition-all duration-300 hover:border-[#D4A017]/30 group w-full">
                <div className="flex items-center gap-3 mb-2">
                  <Edit className="w-5 h-5 text-[#D4A017]" strokeWidth={1.5} />
                  <h4 className="font-bold text-black dark:text-white">Editorial Support</h4>
                </div>
                <p className="text-sm text-stone-600 dark:text-stone-400">The work enters the editorial process, with the USC Readers' Circle providing free editing support.</p>
              </div>
            </motion.div>

            <div className="flex justify-center py-2 text-[#D4A017]">
              <ChevronDown className="w-6 h-6" strokeWidth={2} />
            </div>

            {/* STEP 5 */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 mb-4"
            >
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-[#D4A017]/10 flex items-center justify-center border-2 border-[#D4A017]/20">
                <span className="text-lg font-black text-[#D4A017]">5</span>
              </div>
              <div className="flex-1 bg-stone-50 dark:bg-[#1a1a1a] p-6 rounded-2xl border border-stone-200 dark:border-stone-800 hover:shadow-xl transition-all duration-300 hover:border-[#D4A017]/30 group w-full">
                <div className="flex items-center gap-3 mb-2">
                  <Users2 className="w-5 h-5 text-[#D4A017]" strokeWidth={1.5} />
                  <h4 className="font-bold text-black dark:text-white">Student Collaboration</h4>
                </div>
                <p className="text-sm text-stone-600 dark:text-stone-400">Student volunteers help prepare and develop the written work for production.</p>
              </div>
            </motion.div>

            <div className="flex justify-center py-2 text-[#D4A017]">
              <ChevronDown className="w-6 h-6" strokeWidth={2} />
            </div>

            {/* STEP 6 */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 mb-4"
            >
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-[#D4A017]/10 flex items-center justify-center border-2 border-[#D4A017]/20">
                <span className="text-lg font-black text-[#D4A017]">6</span>
              </div>
              <div className="flex-1 bg-stone-50 dark:bg-[#1a1a1a] p-6 rounded-2xl border border-stone-200 dark:border-stone-800 hover:shadow-xl transition-all duration-300 hover:border-[#D4A017]/30 group w-full">
                <div className="flex items-center gap-3 mb-2">
                  <Film className="w-5 h-5 text-[#D4A017]" strokeWidth={1.5} />
                  <h4 className="font-bold text-black dark:text-white">Publishing or Film Production</h4>
                </div>
                <p className="text-sm text-stone-600 dark:text-stone-400 mb-3">Once editing is complete, the work moves into either the publishing pipeline, film/media production, or if the work is an article or essay, there's an opportunity for publication through Public Wire or New Wave.</p>
                
                <div className="space-y-2 pl-2">
                  <div className="flex items-start gap-2 text-sm text-stone-600 dark:text-stone-400 bg-stone-100/50 dark:bg-stone-800/50 p-2 rounded-lg">
                    <span className="text-[#D4A017] font-bold">a</span>
                    <span><span className="font-semibold text-black dark:text-white">Books & manuscripts</span> → Publishing pipeline</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-stone-600 dark:text-stone-400 bg-stone-100/50 dark:bg-stone-800/50 p-2 rounded-lg">
                    <span className="text-[#D4A017] font-bold">b</span>
                    <span><span className="font-semibold text-black dark:text-white">Film & multimedia projects</span> → Film production pipeline</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-stone-600 dark:text-stone-400 bg-stone-100/50 dark:bg-stone-800/50 p-2 rounded-lg">
                    <span className="text-[#D4A017] font-bold">c</span>
                    <span><span className="font-semibold text-black dark:text-white">Articles & essays</span> → Opportunity for publication through Phuckin' Wire or New Wave</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="flex justify-center py-2 text-[#D4A017]">
              <ChevronDown className="w-6 h-6" strokeWidth={2} />
            </div>

            {/* STEP 7 */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 mb-4"
            >
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-[#D4A017]/10 flex items-center justify-center border-2 border-[#D4A017]/20">
                <span className="text-lg font-black text-[#D4A017]">7</span>
              </div>
              <div className="flex-1 bg-stone-50 dark:bg-[#1a1a1a] p-6 rounded-2xl border border-stone-200 dark:border-stone-800 hover:shadow-xl transition-all duration-300 hover:border-[#D4A017]/30 group w-full">
                <div className="flex items-center gap-3 mb-2">
                  <Globe className="w-5 h-5 text-[#D4A017]" strokeWidth={1.5} />
                  <h4 className="font-bold text-black dark:text-white">Distribution</h4>
                </div>
                <p className="text-sm text-stone-600 dark:text-stone-400">The completed or self-published work is distributed through Zo Media's network of distribution partners.</p>
              </div>
            </motion.div>

            <div className="flex justify-center py-2 text-[#D4A017]">
              <ChevronDown className="w-6 h-6" strokeWidth={2} />
            </div>

            {/* STEP 8 */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6"
            >
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-black flex items-center justify-center border-2 border-[#D4A017] shadow-lg shadow-[#D4A017]/20">
                <span className="text-lg font-black text-[#D4A017]">8</span>
              </div>
              <div className="flex-1 bg-black/5 dark:bg-black/80 p-6 rounded-2xl border-2 border-[#D4A017] hover:shadow-xl transition-all duration-300 group w-full">
                <div className="flex items-center gap-3 mb-2">
                  <Award className="w-5 h-5 text-[#D4A017]" strokeWidth={1.5} />
                  <h4 className="font-bold text-black dark:text-white">Artists Receive Proceeds</h4>
                </div>
                <p className="text-sm text-stone-600 dark:text-stone-400">Any proceeds generated are paid directly to the artist according to their contract and/or cooperative membership status.</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              viewport={{ once: true }}
              className="mt-12 text-center"
            >
              <div className="inline-block bg-stone-50 dark:bg-[#1a1a1a] px-8 py-4 rounded-2xl border border-stone-200 dark:border-stone-800">
                <p className="text-sm text-stone-600 dark:text-stone-400 max-w-3xl">
                  Supported by student volunteers from the <span className="font-semibold text-black dark:text-white">University of California, Santa Cruz</span>, 
                  <span className="font-semibold text-black dark:text-white"> University of New Mexico</span>, and 
                  <span className="font-semibold text-black dark:text-white"> Stony Brook University</span> who edit, transcribe, and prepare these stories for publication.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ============================================================
            SECTION 5: CAGES - GLOBAL IMPACT
            ============================================================ */}
        
        <section className="mb-32">
          <FadeIn>
            <div className="text-center mb-16">
              <div className="inline-block text-[#D4A017] text-[11px] font-black uppercase tracking-[0.25em] mb-4">
                — Global Impact
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black dark:text-white">
                CAGES: The Global Impact <br />
                <span className="text-[#D4A017]">of Incarceration</span>
              </h2>
              <div className="w-20 h-1 bg-[#D4A017] mx-auto"></div>
            </div>
          </FadeIn>

          <FadeIn>
            <div className="bg-gradient-to-br from-stone-50 to-white dark:from-[#111111] dark:to-[#0a0a0a] border border-stone-200 dark:border-stone-800 p-10 md:p-14 rounded-3xl mb-12 shadow-xl">
              <p className="text-lg leading-relaxed text-stone-700 dark:text-stone-300">
                Cages is an international storytelling and cultural exchange project connecting incarcerated people in France and the United States through writing, translation, testimony, and media. The project brings together prisoners, university students, educators, and creative professionals to explore the shared human experiences of incarceration across borders. Its broader goal is to amplify incarcerated voices, encourage dialogue about justice and rehabilitation, and create opportunities for incarcerated writers to share and publish their work. This project is in collaboration with the <span className="font-semibold text-[#D4A017]">Santa Clara University Department of Modern Languages and Literatures, specifically the French and Francophone Studies Program</span>.
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            {cagesComponents.map((component, index) => {
              const Icon = component.icon;
              return (
                <StaggerItem key={index}>
                  <div className={`group bg-gradient-to-br ${component.gradient} bg-stone-50 dark:bg-[#111111] p-10 border border-stone-200 dark:border-stone-800 rounded-2xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-[#D4A017]/30`}>
                    <Icon className="w-14 h-14 text-[#D4A017] mx-auto mb-5 group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
                    <h3 className="text-2xl font-bold mb-3 text-black dark:text-white">{component.title}</h3>
                    <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                      {component.description}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </section>

        {/* ============================================================
            SECTION 6: ZO MEDIA PRODUCTIONS
            ============================================================ */}
        
        <section id="zo-media" className="mb-32">
          <FadeIn>
            <div className="text-center mb-16">
              <div className="inline-block text-[#D4A017] text-[11px] font-black uppercase tracking-[0.25em] mb-4">
                — Media Partner
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black dark:text-white">
                Zo Media <span className="text-[#D4A017]">Productions</span>
              </h2>
              <div className="w-20 h-1 bg-[#D4A017] mx-auto"></div>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <div className="relative aspect-[4/3] w-full bg-white overflow-hidden shadow-lg rounded-2xl group order-1 md:order-1 flex items-center justify-center border border-stone-200">
                <Image
                  src="/log/zologo.png"
                  alt="Zo Media Productions logo"
                  width={480}
                  height={480}
                  className="object-contain p-8"
                />
              </div>
            </FadeIn>

            <FadeIn>
              <div className="space-y-6 order-2 md:order-2">
                <div className="inline-flex items-center gap-2 bg-[#D4A017]/10 text-[#D4A017] px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full">
                  <Film className="w-4 h-4" strokeWidth={2} />
                  Media Cooperative Model
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold text-black dark:text-white leading-tight">
                  From Page to Screen — <br />
                  <span className="text-[#D4A017]">Ownership & Compensation</span>
                </h3>
                
                <p className="text-lg leading-relaxed text-stone-600 dark:text-stone-300">
                  <span className="font-semibold text-[#D4A017]">Zo Media Productions</span> is the multimedia subsidiary of UBFSF, extending incarcerated voices beyond the printed page through a <span className="font-semibold">cooperative model</span> ensuring creators retain ownership and receive compensation.
                </p>
                
                <p className="text-base leading-relaxed text-stone-600 dark:text-stone-300">
                  Transforming stories into <span className="font-semibold">films, documentaries, and animated shorts</span> that bring incarcerated writers' experiences to life for audiences worldwide.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Film, label: "Documentaries", color: "from-amber-500/20 to-orange-500/20" },
                    { icon: MonitorPlay, label: "Animated Shorts", color: "from-yellow-500/20 to-amber-500/20" },
                    { icon: Mic, label: "Podcasts", color: "from-orange-500/20 to-red-500/20" },
                    { icon: Camera, label: "Theatrical Works", color: "from-amber-500/20 to-yellow-500/20" }
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className={`p-4 bg-gradient-to-br ${item.color} bg-white dark:bg-[#0a0a0a] rounded-xl border border-stone-200 dark:border-stone-800 text-center group hover:border-[#D4A017]/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
                        <Icon className="w-8 h-8 text-[#D4A017] mx-auto mb-2 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                        <div className="text-sm font-semibold text-black dark:text-white">{item.label}</div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                  <motion.a 
                    href="https://zomediaproductions.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#D4A017] text-black px-8 py-4 text-sm font-bold uppercase tracking-wider hover:bg-[#B98A2D] transition-all duration-300 rounded-full shadow-lg hover:shadow-[#D4A017]/30"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Visit Zo Media
                    <ExternalLink className="w-4 h-4" strokeWidth={2} />
                  </motion.a>
                  
                  <motion.a 
                    href="https://zomediaproductions.com/store/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border-2 border-[#D4A017] text-[#D4A017] px-8 py-4 text-sm font-bold uppercase tracking-wider hover:bg-[#D4A017] hover:text-black transition-all duration-300 rounded-full"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Shop Publications
                    <ArrowRight className="w-4 h-4" strokeWidth={2} />
                  </motion.a>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ============================================================
            SECTION 7: THE LIVING ARCHIVE (Writing Beyond the Prison)
            ============================================================ */}
        
        <section className="mb-32">
          <FadeIn>
            <div className="text-center mb-16">
              <div className="inline-block text-[#D4A017] text-[11px] font-black uppercase tracking-[0.25em] mb-4">
                — Featured Archive
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black dark:text-white">
                The <span className="text-[#D4A017]">Writing Beyond the Prison</span> Archive
              </h2>
              <div className="w-20 h-1 bg-[#D4A017] mx-auto"></div>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <div className="space-y-6 order-1 md:order-1">
                <div className="inline-flex items-center gap-2 bg-[#D4A017]/10 text-[#D4A017] px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full">
                  <Archive className="w-4 h-4" strokeWidth={2} />
                  Living Digital Archive
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold text-black dark:text-white leading-tight">
                  Writing Beyond <br />
                  <span className="text-[#D4A017]">the Prison</span>
                </h3>
                
                <div className="bg-gradient-to-r from-[#D4A017]/5 to-transparent p-4 rounded-xl border-l-4 border-[#D4A017]">
                  <p className="text-base leading-relaxed text-stone-600 dark:text-stone-300">
                    <span className="font-semibold text-[#D4A017]">Writing Beyond the Prison</span> is a living digital archive giving voice to those bound to mass incarceration and the carceral state. This archive is the heart of the Hundred Stories Project — it is not a separate project, but the very repository where all of these stories live and grow.
                  </p>
                </div>

                <div className="pt-4 flex flex-wrap gap-4">
                  <motion.a 
                    href="https://writingbeyondtheprison.org" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#D4A017] text-black px-8 py-4 text-sm font-bold uppercase tracking-wider hover:bg-[#B98A2D] transition-all duration-300 rounded-full shadow-lg hover:shadow-[#D4A017]/30"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Explore the Archive
                    <ArrowRight className="w-5 h-5" strokeWidth={2} />
                  </motion.a>
                </div>
              </div>
            </FadeIn>

            <FadeIn>
              <div className="relative aspect-[4/3] w-full bg-black overflow-hidden shadow-2xl rounded-2xl group order-2 md:order-2 flex items-center justify-center border-2 border-[#D4A017]">
                <SmartPlaceholder
                  title="Writing Beyond the Prison Graphic"
                  description="Official graphic pending approval. Project under 100 Stories."
                  className="bg-black border-[#D4A017] text-white"
                />
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ============================================================
            SECTION 8: FEATURED BOOKS
            ============================================================ */}
        
        <section className="mb-32">
          <FadeIn>
            <div className="text-center mb-16">
              <div className="inline-block text-[#D4A017] text-[11px] font-black uppercase tracking-[0.25em] mb-4">
                — Featured Publications
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black dark:text-white">
                Featured Works
              </h2>
              <div className="w-20 h-1 bg-[#D4A017] mx-auto"></div>
            </div>
          </FadeIn>
          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            {books.map((book, index) => (
              <StaggerItem key={index}>
                <div className="group bg-white dark:bg-[#0a0a0a] border border-stone-200 dark:border-stone-800 overflow-hidden rounded-2xl hover:shadow-3xl transition-all duration-700 hover:-translate-y-3 hover:border-[#D4A017]/30">
                  <div className="relative aspect-[2/3] bg-stone-100 dark:bg-[#1a1a1a] overflow-hidden">
                    <Image 
                      src={book.img} 
                      alt={book.title} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700" 
                      sizes="(max-width: 768px) 100vw, 33vw"
                      unoptimized={book.img.startsWith('http')}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <div className="p-8">
                    <p className="font-bold text-xl text-black dark:text-white mb-3">{book.title}</p>
                    <a 
                      href="https://zomediaproductions.com/store/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[#D4A017] font-semibold hover:text-black dark:hover:text-white transition-colors group/link"
                    >
                      Purchase
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-2 transition-transform" strokeWidth={2} />
                    </a>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

      </div>
    </main>
  );
}