// src/app/programs/hundred-stories/page.tsx

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useAnimation, AnimatePresence } from "framer-motion";
import { getPageBySlug } from "@/lib/wordpress/pages";
import { getWpImageUrl } from "@/lib/wordpress/client";
import {
  BookOpen,
  PenTool,
  Globe,
  Users,
  MessageSquare,
  GraduationCap,
  Book,
  Video,
  Mic,
  FileText,
  Film,
  Library,
  Archive,
  Building2,
  School,
  ScrollText,
  Sparkles,
  MapPin,
  Heart,
  Award,
  Star,
  ChevronRight,
  Play,
  Target,
  Lightbulb,
  TrendingUp,
  Calendar,
  Rocket,
  Zap,
  Shield,
  Handshake,
  Globe2,
  Languages,
  Landmark,
  Music,
  Camera,
  Edit,
  BookMarked,
  MessageCircle,
  Feather,
  PenLine,
  Quote,
  User,
  Users2,
  Infinity,
  BookOpenCheck,
  Newspaper,
  Podcast,
  MonitorPlay,
  FileArchive,
  GraduationCap as GraduationIcon,
  Building,
  Sparkle,
  Crown,
  Trophy,
  Flame,
  Compass,
  Map,
  Send,
  Mail,
  Phone,
  ExternalLink,
  ArrowRight,
  CheckCircle,
  Circle,
  ChevronDown,
  Menu,
  X,
  Sun,
  Moon,
  Plus,
  Minus,
  Search,
  Filter,
  Settings,
  UserCircle,
  LogOut,
  Home,
  CalendarDays,
  Clock,
  Bell,
  HeartHandshake,
  HandHeart,
  HelpingHand,
  Target as TargetIcon,
  Lightbulb as LightbulbIcon,
  TrendingUp as TrendingUpIcon,
  Calendar as CalendarIcon,
  Rocket as RocketIcon,
  Zap as ZapIcon,
  Shield as ShieldIcon,
  Handshake as HandshakeIcon,
  Globe2 as Globe2Icon,
  Languages as LanguagesIcon,
  Landmark as LandmarkIcon,
  Music as MusicIcon,
  Camera as CameraIcon,
  Edit as EditIcon,
  BookMarked as BookMarkedIcon,
  MessageCircle as MessageCircleIcon,
  Feather as FeatherIcon,
  PenLine as PenLineIcon,
  Quote as QuoteIcon,
  User as UserIcon,
  Users2 as Users2Icon,
  Infinity as InfinityIcon,
  BookOpenCheck as BookOpenCheckIcon,
  Newspaper as NewspaperIcon,
  Podcast as PodcastIcon,
  MonitorPlay as MonitorPlayIcon,
  FileArchive as FileArchiveIcon,
  GraduationCap as GraduationCapIcon,
  Building as BuildingIcon,
  Sparkle as SparkleIcon,
  Crown as CrownIcon,
  Trophy as TrophyIcon,
  Flame as FlameIcon,
  Compass as CompassIcon,
  Map as MapIcon,
  Send as SendIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  ExternalLink as ExternalLinkIcon,
  ArrowRight as ArrowRightIcon,
  CheckCircle as CheckCircleIcon,
  Circle as CircleIcon,
  ChevronDown as ChevronDownIcon,
  Menu as MenuIcon,
  X as XIcon,
  Sun as SunIcon,
  Moon as MoonIcon,
  Plus as PlusIcon,
  Minus as MinusIcon,
  Search as SearchIcon,
  Filter as FilterIcon,
  Settings as SettingsIcon,
  UserCircle as UserCircleIcon,
  LogOut as LogOutIcon,
  Home as HomeIcon,
  CalendarDays as CalendarDaysIcon,
  Clock as ClockIcon,
  Bell as BellIcon,
  HeartHandshake as HeartHandshakeIcon,
  HandHeart as HandHeartIcon,
  HelpingHand as HelpingHandIcon,
} from "lucide-react";

// ============================================================
// SECTION: UTILITY FUNCTIONS
// ============================================================
// These helper functions process WordPress content and extract data.
// If you need to parse different content structures, modify these.

/**
 * Decodes HTML entities from WordPress content
 * Example: "&#8221;" becomes '"'
 * If you see strange characters, add new replacements here
 */
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

/**
 * Extracts structured data from WordPress HTML content.
 * This looks for paragraphs, lists, images, videos, and book data.
 * 
 * TO EDIT: If you want to extract different data, modify the regex patterns
 * or add new extraction logic here.
 */
function extractContentFromWordPress(rawContent: string) {
  const content = decodeEntities(rawContent);

  // Extract all paragraph text
  const textMatches = content.match(/<p>(.*?)<\/p>/g) || [];
  const textContent = textMatches
    .map(p => p.replace(/<[^>]+>/g, '').trim())
    .filter(Boolean);

  // Extract list items
  const listMatches = content.match(/<li[^>]*>(.*?)<\/li>/g) || [];
  const listItems = listMatches
    .map(li => li.replace(/<[^>]+>/g, '').trim())
    .filter(Boolean);

  // Extract section titles
  const sections = [
    ...content.matchAll(/title_suffix="([^"]+)"/g),
  ].map(m => m[1]);

  // Extract image URLs
  const imageUrls = [
    ...content.matchAll(/src="([^"]+\.(?:jpg|jpeg|png|webp))/gi),
  ].map(m => m[1]);

  // Extract YouTube video URL
  let videoUrl: string | null = null;
  const videoMatch = content.match(
    /src="https?:\/\/(?:www\.)?(?:youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/)([^"?&]+)/i
  );
  if (videoMatch) {
    videoUrl = `https://www.youtube.com/embed/${videoMatch[1]}`;
  }

  // Extract book titles and images from WordPress
  // TO EDIT: If you want to change which books appear, modify the title filter
  const bookTitles: string[] = [];
  const bookImages: string[] = [];
  
  const bookSectionRegex = /dg_adh_heading[^>]*title_suffix="([^"]*)"[^>]*>[\s\S]*?et_pb_image[^>]*src="([^"]*\.(jpg|jpeg|png))"/g;
  let bookMatch;
  while ((bookMatch = bookSectionRegex.exec(content)) !== null) {
    if (bookMatch[1] && bookMatch[2]) {
      const title = bookMatch[1];
      // Filter for specific books - change these keywords to match your books
      if (title.includes('No Rhyme') || title.includes('Social Justice') || title.includes('Kill the Bastard')) {
        bookTitles.push(title);
        bookImages.push(bookMatch[2]);
      }
    }
  }

  // Fallback extraction if the main regex didn't find books
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
// These components add scroll-triggered animations to sections.
// TO EDIT: Change animation duration, delay, or easing here.

/**
 * FadeIn - Wrapper that fades elements in when they scroll into view
 * @param delay - Delay in seconds before animation starts
 * TO EDIT: Change 'duration: 0.7' for speed, 'y: 40' for distance
 */
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

/**
 * StaggerContainer - Container that staggers animation of child items
 * TO EDIT: Change 'staggerChildren: 0.12' for more/less stagger
 */
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

/**
 * StaggerItem - Individual item within a StaggerContainer
 * TO EDIT: Change 'y: 30' for more/less slide distance
 */
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

/**
 * Gets image URL with WordPress path handling.
 * TO EDIT: Change fallback image URL if needed
 */
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
// This is the main page component. Each section below is clearly marked.
// TO EDIT CONTENT: Look for the specific section you want to change.
// TO EDIT IMAGES: Find the Image component in that section.

export default function HundredStoriesPage() {
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const heroRef = useRef<HTMLElement>(null);

  // Fetch page data from WordPress on mount
  useEffect(() => {
    let isMounted = true;
    
    async function fetchData() {
      try {
        const page = await getPageBySlug("hundred-stories-project");
        if (isMounted) {
          setPageData(page);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load page");
          setLoading(false);
        }
      }
    }
    
    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Smooth scroll to content section
  const scrollToContent = () => {
    const contentSection = document.getElementById('hsp-content');
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Loading state
  if (loading) {
    return (
      <main className="p-20 min-h-screen bg-white dark:bg-[#1a1a1a] text-black dark:text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FFB81C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-stone-600 dark:text-stone-400">Loading...</p>
        </div>
      </main>
    );
  }

  // Error state
  if (error || !pageData) {
    return (
      <main className="p-20 min-h-screen bg-white dark:bg-[#1a1a1a] text-black dark:text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">Error: {error || "Page not found"}</p>
        </div>
      </main>
    );
  }

  // ============================================================
  // SECTION: DATA EXTRACTION
  // ============================================================
  // This extracts content from WordPress. 
  // TO EDIT: If you want to change what shows, modify the values below.
  
  const content = pageData.content || '';
  const extracted = extractContentFromWordPress(content);

  const heroTitle = pageData.title || "Hundred Stories Project";
  
  const mainDescription = extracted.textContent[0] || "";
  const expandingPerspectivesContent = extracted.textContent.slice(3, 5).join(" ");
  const whyItMattersContent = extracted.textContent.slice(5, 8).join(" ");
  const keyComponents = extracted.listItems.slice(0, 3);
  const whyItMattersItems = extracted.listItems.slice(3, 6);

  // ============================================================
  // SECTION: BOOKS DATA
  // ============================================================
  // TO EDIT BOOKS: Change the title, img URL, or add/remove books here.
  // Each book needs a title and image URL.
  
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

  // ============================================================
  // SECTION: THREE PILLARS DATA
  // ============================================================
  // TO EDIT PILLARS: Change title, description, or icon here.
  // Each pillar needs: icon (from lucide-react), title, description, gradient
  
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
      gradient: "from-blue-500/20 to-purple-500/20"
    },
    {
      icon: Globe,
      title: "Transform",
      description: "Changing perspectives and inspiring solutions to systemic issues in the carceral ecosystem.",
      gradient: "from-emerald-500/20 to-teal-500/20"
    }
  ];

  // ============================================================
  // SECTION: TESTIMONIALS DATA
  // ============================================================
  // TO EDIT TESTIMONIALS: Add/remove testimonials here.
  // Each needs: quote, author, location
  
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

  // ============================================================
  // SECTION: STATS DATA
  // ============================================================
  // TO EDIT STATS: Change the numbers, labels, or icons here.
  // Each stat needs: number (string), label, icon
  
  const stats = [
    { number: "100+", label: "Stories Collected", icon: BookOpen },
    { number: "15+", label: "States Represented", icon: MapPin },
    { number: "3", label: "Books Published", icon: Library },
    { number: "∞", label: "Lives Impacted", icon: Infinity }
  ];

  // ============================================================
  // SECTION: CAGES COMPONENTS DATA
  // ============================================================
  // TO EDIT CAGES: Change title, description, or icon here.
  
  const cagesComponents = [
    {
      icon: Globe2,
      title: "International Exchange",
      description: "Connecting incarcerated people in France and the United States through writing, translation, testimony, and media.",
      gradient: "from-cyan-500/20 to-blue-500/20"
    },
    {
      icon: Handshake,
      title: "Cross-Cultural Collaboration",
      description: "Bringing together prisoners, university students, educators, and creative professionals to explore shared human experiences.",
      gradient: "from-violet-500/20 to-purple-500/20"
    },
    {
      icon: MessageSquare,
      title: "Amplify Voices",
      description: "Creating opportunities for incarcerated writers to share and publish their work across borders.",
      gradient: "from-rose-500/20 to-red-500/20"
    }
  ];

  // ============================================================
  // SECTION: CAGES OUTPUTS DATA
  // ============================================================
  // TO EDIT CAGES OUTPUTS: Add/remove output types here.
  
  const cagesOutputs = [
    { icon: PenTool, label: "Bilingual Workshops" },
    { icon: Mic, label: "Podcasts" },
    { icon: MonitorPlay, label: "Video Exchanges" },
    { icon: BookOpen, label: "Annual Anthology" },
    { icon: Film, label: "Documentary Content" },
    { icon: Library, label: "Publications" }
  ];

  const generalSupporters = [
    "Countless student volunteers",
  ];

  // ============================================================
  // SECTION: VIDEO CONFIGURATION
  // ============================================================
  // TO EDIT VIDEO: Change the videoUrl variable below.
  // This controls the hero video background.
  
  const videoUrl = extracted.videoUrl || "https://www.youtube.com/embed/pawEixUGK60";

  // ============================================================
  // SECTION: RENDER - THE PAGE LAYOUT
  // ============================================================
  // Each section below is clearly marked. 
  // TO REORDER SECTIONS: Move the <section> elements around.
  // TO REMOVE A SECTION: Delete its <section> element.
  // TO EDIT IMAGES: Find the <Image> component in that section and change src.
  // TO EDIT TEXT: Find the text inside the section and change it.

  return (
    <main className="bg-white dark:bg-[#0a0a0a] text-black dark:text-[#f4f4f4] min-h-screen font-serif overflow-x-hidden">
      
      {/* ============================================================
          SECTION 1: VIDEO HERO
          ============================================================ */}
      {/* This is the full-screen hero with YouTube video background.
          TO EDIT: Change videoUrl above or modify the overlay content. */}
      
      <section ref={heroRef} className="relative w-full h-screen overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <iframe
            src={`${videoUrl}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoUrl.split('/embed/')[1] || ''}&rel=0`}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ 
              width: '100%', 
              height: '100%',
              pointerEvents: 'none',
              border: 'none',
              transform: 'scale(1.1)',
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            title="Hundred Stories Project - Writing Beyond Prison"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Hero Overlay Content */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6 md:px-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block bg-[#FFB81C] text-black px-8 py-3 text-[11px] font-black uppercase tracking-[0.25em] mb-8 hover:scale-105 transition-transform duration-300">
              Writing Beyond Prison
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter mb-6 leading-[1.05] text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {heroTitle}
          </motion.h1>
          
          <motion.div 
            className="w-24 h-1 bg-[#FFB81C] mx-auto mb-8"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 1, delay: 0.4 }}
          />
          
          {/* TO EDIT HERO TAGLINE: Change this text */}
          <motion.p 
            className="text-xl md:text-3xl text-stone-200 max-w-3xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            "Amplifying the voices that have been silenced. One story at a time."
          </motion.p>

          {/* Hero Buttons */}
          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                onClick={scrollToContent}
                className="bg-[#FFB81C] text-black px-10 py-4 text-sm font-bold uppercase tracking-wider hover:bg-[#e6a500] transition-all duration-300 rounded-full shadow-lg hover:shadow-[#FFB81C]/30 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore the Stories
                <ArrowRight className="w-5 h-5" strokeWidth={2} />
              </motion.button>
              <motion.a
                href="#workflow"
                className="border-2 border-white/40 text-white px-10 py-4 text-sm font-bold uppercase tracking-wider hover:bg-white/10 transition-all duration-300 rounded-full flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-5 h-5" strokeWidth={2} />
                Watch Our Work
              </motion.a>
            </div>
          </motion.div>

          {/* Scroll Down Button */}
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
                className="w-1.5 h-1.5 bg-[#FFB81C] rounded-full"
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
        {/* This section introduces the project.
            TO EDIT TEXT: Change the paragraphs below.
            TO EDIT IMAGE: Change the src prop in the Image component. */}
        
        <section className="grid md:grid-cols-2 gap-16 items-center mb-20">
          <FadeIn>
            <div className="inline-block text-[#FFB81C] text-[11px] font-black uppercase tracking-[0.25em] mb-4">
              — Giving Voice
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black dark:text-white leading-tight">
              Giving Voice to the <br />
              <span className="text-[#FFB81C]">Voiceless</span>
            </h2>
            
            <p className="text-base leading-relaxed text-stone-600 dark:text-stone-300 mb-4">
              The <span className="font-semibold text-[#FFB81C]">Hundred Stories Project (HSP)</span> empowers incarcerated writers to develop, publish, and receive compensation for their creative work.
            </p>
            
            <p className="text-base leading-relaxed text-stone-600 dark:text-stone-300 mb-4">
              Through writing and storytelling, incarcerated individuals gain opportunities to share their experiences and connect with communities beyond prison walls.
            </p>
            
            <p className="text-base leading-relaxed text-stone-600 dark:text-stone-300">
              HSP creates platforms where writers tell their own stories, retain ownership, and reach broader audiences—challenging stereotypes and fostering empathy.
            </p>

            {/* Quick Highlights */}
            <div className="mt-6 grid grid-cols-1 gap-3">
              <div className="flex items-start gap-3 p-3 bg-stone-50 dark:bg-[#1a1a1a] rounded-xl border border-stone-200 dark:border-stone-800">
                <BookOpen className="w-5 h-5 text-[#FFB81C] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <span className="font-semibold text-black dark:text-white">Writing Beyond Prison:</span>
                  <span className="text-sm text-stone-600 dark:text-stone-400"> A curriculum and anthology series reimagining the carceral ecosystem.</span>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-stone-50 dark:bg-[#1a1a1a] rounded-xl border border-stone-200 dark:border-stone-800">
                <Archive className="w-5 h-5 text-[#FFB81C] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <span className="font-semibold text-black dark:text-white">Living Archive:</span>
                  <span className="text-sm text-stone-600 dark:text-stone-400"> Materials accessible for universities, scholars, and advocacy organizations.</span>
                </div>
              </div>
            </div>
          </FadeIn>
          
          <FadeIn>
            <div className="relative aspect-[4/3] w-full bg-stone-100 dark:bg-[#1a1a1a] overflow-hidden shadow-2xl rounded-2xl group">
              {/* TO EDIT THIS IMAGE: Change the src URL below */}
              <Image 
                src="/image/Preferred HSP Image 2.png" 
                alt="Hundred Stories Bookshelf" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700" 
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-6 left-6 bg-black/70 text-white px-4 py-2 rounded-lg text-sm backdrop-blur-sm">
                <span className="font-semibold text-[#FFB81C]">100+</span> Stories Collected
              </div>
            </div>
          </FadeIn>
        </section>

        {/* ============================================================
            SECTION 3: THREE PILLARS
            ============================================================ */}
        {/* This section shows the three main pillars of the project.
            TO EDIT: Modify the pillars array above. */}
        
        <section className="mb-32">
          <FadeIn>
            <div className="text-center mb-16">
              <div className="inline-block text-[#FFB81C] text-[11px] font-black uppercase tracking-[0.25em] mb-4">
                — Our Foundation
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black dark:text-white">
                Our Three Pillars
              </h2>
              <div className="w-20 h-1 bg-[#FFB81C] mx-auto"></div>
            </div>
          </FadeIn>
          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <StaggerItem key={index}>
                  <div className={`group bg-gradient-to-br ${pillar.gradient} bg-stone-50 dark:bg-[#111111] p-10 text-center border border-stone-200 dark:border-stone-800 rounded-2xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-[#FFB81C]/30`}>
                    <Icon className="w-16 h-16 text-[#FFB81C] mx-auto mb-5 group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
                    <h3 className="text-2xl font-bold mb-3 text-black dark:text-white">{pillar.title}</h3>
                    <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                      {pillar.description}
                    </p>
                    <div className="w-12 h-0.5 bg-[#FFB81C]/50 mx-auto mt-4 group-hover:w-20 transition-all duration-300"></div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </section>

        {/* ============================================================
            SECTION 4: WORKFLOW / PROCESS
            ============================================================ */}
        {/* This section shows the 8-step process flowchart.
            TO EDIT STEPS: Change the text inside each step.
            TO EDIT ICONS: Change the icon import. */}
        
        <section id="workflow" className="mb-32">
          <FadeIn>
            <div className="text-center mb-16">
              <div className="inline-block text-[#FFB81C] text-[11px] font-black uppercase tracking-[0.25em] mb-4">
                — Our Process
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black dark:text-white">
                How Stories Come to Life
              </h2>
              <div className="w-20 h-1 bg-[#FFB81C] mx-auto"></div>
              <p className="text-stone-600 dark:text-stone-400 mt-4 max-w-2xl mx-auto">
                From prison walls to the world stage — a collaborative journey of transformation
              </p>
            </div>
          </FadeIn>

          <div className="relative max-w-4xl mx-auto">
            {/* Vertical Flowchart Steps - 8 Step Process */}
            
            {/* STEP 1: Author Submits Work */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 mb-4"
            >
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-[#FFB81C]/10 flex items-center justify-center border-2 border-[#FFB81C]/20">
                <span className="text-lg font-black text-[#FFB81C]">1</span>
              </div>
              <div className="flex-1 bg-stone-50 dark:bg-[#1a1a1a] p-6 rounded-2xl border border-stone-200 dark:border-stone-800 hover:shadow-xl transition-all duration-300 hover:border-[#FFB81C]/30 group w-full">
                <div className="flex items-center gap-3 mb-2">
                  <PenTool className="w-5 h-5 text-[#FFB81C]" strokeWidth={1.5} />
                  <h4 className="font-bold text-black dark:text-white">Author Submits Work</h4>
                </div>
                <p className="text-sm text-stone-600 dark:text-stone-400">An incarcerated author submits original written work for consideration.</p>
              </div>
            </motion.div>

            {/* Arrow Down */}
            <div className="flex justify-center py-2 text-[#FFB81C]">
              <ChevronDown className="w-6 h-6" strokeWidth={2} />
            </div>

            {/* STEP 2: Acquisition Committee Review */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 mb-4"
            >
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-[#FFB81C]/10 flex items-center justify-center border-2 border-[#FFB81C]/20">
                <span className="text-lg font-black text-[#FFB81C]">2</span>
              </div>
              <div className="flex-1 bg-stone-50 dark:bg-[#1a1a1a] p-6 rounded-2xl border border-stone-200 dark:border-stone-800 hover:shadow-xl transition-all duration-300 hover:border-[#FFB81C]/30 group w-full">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-[#FFB81C]" strokeWidth={1.5} />
                  <h4 className="font-bold text-black dark:text-white">Acquisition Committee Review</h4>
                </div>
                <p className="text-sm text-stone-600 dark:text-stone-400">The work is reviewed to determine whether it will be accepted.</p>
              </div>
            </motion.div>

            {/* Arrow Down */}
            <div className="flex justify-center py-2 text-[#FFB81C]">
              <ChevronDown className="w-6 h-6" strokeWidth={2} />
            </div>

            {/* STEP 3: Author Chooses a Path */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 mb-4"
            >
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-[#FFB81C]/10 flex items-center justify-center border-2 border-[#FFB81C]/20">
                <span className="text-lg font-black text-[#FFB81C]">3</span>
              </div>
              <div className="flex-1 bg-stone-50 dark:bg-[#1a1a1a] p-6 rounded-2xl border border-stone-200 dark:border-stone-800 hover:shadow-xl transition-all duration-300 hover:border-[#FFB81C]/30 group w-full">
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="w-5 h-5 text-[#FFB81C]" strokeWidth={1.5} />
                  <h4 className="font-bold text-black dark:text-white">Author Chooses a Path</h4>
                </div>
                <p className="text-sm text-stone-600 dark:text-stone-400">If accepted, the author can pursue a traditional publishing or production contract, or join the Zo Media cooperative.</p>
              </div>
            </motion.div>

            {/* Arrow Down */}
            <div className="flex justify-center py-2 text-[#FFB81C]">
              <ChevronDown className="w-6 h-6" strokeWidth={2} />
            </div>

            {/* STEP 4: Editorial Support */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 mb-4"
            >
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-[#FFB81C]/10 flex items-center justify-center border-2 border-[#FFB81C]/20">
                <span className="text-lg font-black text-[#FFB81C]">4</span>
              </div>
              <div className="flex-1 bg-stone-50 dark:bg-[#1a1a1a] p-6 rounded-2xl border border-stone-200 dark:border-stone-800 hover:shadow-xl transition-all duration-300 hover:border-[#FFB81C]/30 group w-full">
                <div className="flex items-center gap-3 mb-2">
                  <Edit className="w-5 h-5 text-[#FFB81C]" strokeWidth={1.5} />
                  <h4 className="font-bold text-black dark:text-white">Editorial Support</h4>
                </div>
                <p className="text-sm text-stone-600 dark:text-stone-400">The work enters the editorial process, with the USC Readers' Circle providing free editing support.</p>
              </div>
            </motion.div>

            {/* Arrow Down */}
            <div className="flex justify-center py-2 text-[#FFB81C]">
              <ChevronDown className="w-6 h-6" strokeWidth={2} />
            </div>

            {/* STEP 5: Student Collaboration */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 mb-4"
            >
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-[#FFB81C]/10 flex items-center justify-center border-2 border-[#FFB81C]/20">
                <span className="text-lg font-black text-[#FFB81C]">5</span>
              </div>
              <div className="flex-1 bg-stone-50 dark:bg-[#1a1a1a] p-6 rounded-2xl border border-stone-200 dark:border-stone-800 hover:shadow-xl transition-all duration-300 hover:border-[#FFB81C]/30 group w-full">
                <div className="flex items-center gap-3 mb-2">
                  <Users2 className="w-5 h-5 text-[#FFB81C]" strokeWidth={1.5} />
                  <h4 className="font-bold text-black dark:text-white">Student Collaboration</h4>
                </div>
                <p className="text-sm text-stone-600 dark:text-stone-400">Student volunteers help prepare and develop the written work for production.</p>
              </div>
            </motion.div>

            {/* Arrow Down */}
            <div className="flex justify-center py-2 text-[#FFB81C]">
              <ChevronDown className="w-6 h-6" strokeWidth={2} />
            </div>

            {/* STEP 6: Publishing or Film Production */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 mb-4"
            >
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-[#FFB81C]/10 flex items-center justify-center border-2 border-[#FFB81C]/20">
                <span className="text-lg font-black text-[#FFB81C]">6</span>
              </div>
              <div className="flex-1 bg-stone-50 dark:bg-[#1a1a1a] p-6 rounded-2xl border border-stone-200 dark:border-stone-800 hover:shadow-xl transition-all duration-300 hover:border-[#FFB81C]/30 group w-full">
                <div className="flex items-center gap-3 mb-2">
                  <Film className="w-5 h-5 text-[#FFB81C]" strokeWidth={1.5} />
                  <h4 className="font-bold text-black dark:text-white">Publishing or Film Production</h4>
                </div>
                <p className="text-sm text-stone-600 dark:text-stone-400 mb-3">Once editing is complete, the work moves into either the publishing pipeline, film/media production, or if the work is an article or essay, there's an opportunity for publication through Public Wire or New Wave.</p>
                
                {/* Bullet points for Step 6 */}
                <div className="space-y-2 pl-2">
                  <div className="flex items-start gap-2 text-sm text-stone-600 dark:text-stone-400 bg-stone-100/50 dark:bg-stone-800/50 p-2 rounded-lg">
                    <span className="text-[#FFB81C] font-bold">a</span>
                    <span><span className="font-semibold text-black dark:text-white">Books & manuscripts</span> → Publishing pipeline</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-stone-600 dark:text-stone-400 bg-stone-100/50 dark:bg-stone-800/50 p-2 rounded-lg">
                    <span className="text-[#FFB81C] font-bold">b</span>
                    <span><span className="font-semibold text-black dark:text-white">Film & multimedia projects</span> → Film production pipeline</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-stone-600 dark:text-stone-400 bg-stone-100/50 dark:bg-stone-800/50 p-2 rounded-lg">
                    <span className="text-[#FFB81C] font-bold">c</span>
                    <span><span className="font-semibold text-black dark:text-white">Articles & essays</span> → Opportunity for publication through Phuckin' Wire or New Wave</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Arrow Down */}
            <div className="flex justify-center py-2 text-[#FFB81C]">
              <ChevronDown className="w-6 h-6" strokeWidth={2} />
            </div>

            {/* STEP 7: Distribution */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 mb-4"
            >
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-[#FFB81C]/10 flex items-center justify-center border-2 border-[#FFB81C]/20">
                <span className="text-lg font-black text-[#FFB81C]">7</span>
              </div>
              <div className="flex-1 bg-stone-50 dark:bg-[#1a1a1a] p-6 rounded-2xl border border-stone-200 dark:border-stone-800 hover:shadow-xl transition-all duration-300 hover:border-[#FFB81C]/30 group w-full">
                <div className="flex items-center gap-3 mb-2">
                  <Globe className="w-5 h-5 text-[#FFB81C]" strokeWidth={1.5} />
                  <h4 className="font-bold text-black dark:text-white">Distribution</h4>
                </div>
                <p className="text-sm text-stone-600 dark:text-stone-400">The completed or self-published work is distributed through Zo Media's network of distribution partners.</p>
              </div>
            </motion.div>

            {/* Arrow Down */}
            <div className="flex justify-center py-2 text-[#FFB81C]">
              <ChevronDown className="w-6 h-6" strokeWidth={2} />
            </div>

            {/* STEP 8: Artists Receive Proceeds */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6"
            >
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-[#FFB81C] flex items-center justify-center border-2 border-[#FFB81C] shadow-lg shadow-[#FFB81C]/20">
                <span className="text-lg font-black text-black">8</span>
              </div>
              <div className="flex-1 bg-[#FFB81C]/10 dark:bg-[#FFB81C]/5 p-6 rounded-2xl border-2 border-[#FFB81C] hover:shadow-xl transition-all duration-300 group w-full">
                <div className="flex items-center gap-3 mb-2">
                  <Award className="w-5 h-5 text-[#FFB81C]" strokeWidth={1.5} />
                  <h4 className="font-bold text-black dark:text-white">Artists Receive Proceeds</h4>
                </div>
                <p className="text-sm text-stone-600 dark:text-stone-400">Any proceeds generated are paid directly to the artist according to their contract and/or cooperative membership status.</p>
              </div>
            </motion.div>

            {/* Supporting text */}
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
        {/* This section describes the CAGES international project.
            TO EDIT: Modify the cagesComponents array above. */}
        
        <section className="mb-32">
          <FadeIn>
            <div className="text-center mb-16">
              <div className="inline-block text-[#FFB81C] text-[11px] font-black uppercase tracking-[0.25em] mb-4">
                — Global Impact
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black dark:text-white">
                CAGES: The Global Impact <br />
                <span className="text-[#FFB81C]">of Incarceration</span>
              </h2>
              <div className="w-20 h-1 bg-[#FFB81C] mx-auto"></div>
            </div>
          </FadeIn>

          <FadeIn>
            <div className="bg-gradient-to-br from-stone-50 to-white dark:from-[#111111] dark:to-[#0a0a0a] border border-stone-200 dark:border-stone-800 p-10 md:p-14 rounded-3xl mb-12 shadow-xl">
              {/* TO EDIT CAGES DESCRIPTION: Change this text */}
              <p className="text-lg leading-relaxed text-stone-700 dark:text-stone-300">
                Cages is an international storytelling and cultural exchange project connecting incarcerated people in France and the United States through writing, translation, testimony, and media. The project brings together prisoners, university students, educators, and creative professionals to explore the shared human experiences of incarceration across borders. Its broader goal is to amplify incarcerated voices, encourage dialogue about justice and rehabilitation, and create opportunities for incarcerated writers to share and publish their work.
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            {cagesComponents.map((component, index) => {
              const Icon = component.icon;
              return (
                <StaggerItem key={index}>
                  <div className={`group bg-gradient-to-br ${component.gradient} bg-stone-50 dark:bg-[#111111] p-10 border border-stone-200 dark:border-stone-800 rounded-2xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-[#FFB81C]/30`}>
                    <Icon className="w-14 h-14 text-[#FFB81C] mx-auto mb-5 group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
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
        {/* This section describes the media partner.
            TO EDIT: Change text and image as needed. */}
        
        <section id="zo-media" className="mb-32">
          <FadeIn>
            <div className="text-center mb-16">
              <div className="inline-block text-[#FFB81C] text-[11px] font-black uppercase tracking-[0.25em] mb-4">
                — Media Partner
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black dark:text-white">
                Zo Media <span className="text-[#FFB81C]">Productions</span>
              </h2>
              <div className="w-20 h-1 bg-[#FFB81C] mx-auto"></div>
            </div>
          </FadeIn>

          {/* Layout: Image on top, content below (stacked) */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image first (left side) */}
            <FadeIn>
              <div className="relative aspect-[4/3] w-full bg-stone-100 dark:bg-[#1a1a1a] overflow-hidden shadow-2xl rounded-2xl group order-1 md:order-1">
                <Image 
                  src="/image/Zo Media Image 1.png" 
                  alt="Zo Media Productions - From Page to Screen" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700" 
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur-sm text-white px-4 py-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Film className="w-4 h-4 text-[#FFB81C]" strokeWidth={2} />
                    <span className="text-sm font-semibold">Zo Media Productions</span>
                  </div>
                  <p className="text-xs text-stone-300 mt-1">From page to screen — cooperative media model</p>
                </div>
              </div>
            </FadeIn>

            {/* Content second (right side) */}
            <FadeIn>
              <div className="space-y-6 order-2 md:order-2">
                <div className="inline-flex items-center gap-2 bg-[#FFB81C]/10 text-[#FFB81C] px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full">
                  <Film className="w-4 h-4" strokeWidth={2} />
                  Media Cooperative Model
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold text-black dark:text-white leading-tight">
                  From Page to Screen — <br />
                  <span className="text-[#FFB81C]">Ownership & Compensation</span>
                </h3>
                
                <p className="text-lg leading-relaxed text-stone-600 dark:text-stone-300">
                  <span className="font-semibold text-[#FFB81C]">Zo Media Productions</span> is the multimedia subsidiary of UBFSF, extending incarcerated voices beyond the printed page through a <span className="font-semibold">cooperative model</span> ensuring creators retain ownership and receive compensation.
                </p>
                
                <p className="text-base leading-relaxed text-stone-600 dark:text-stone-300">
                  Transforming stories into <span className="font-semibold">films, documentaries, and animated shorts</span> that bring incarcerated writers' experiences to life for audiences worldwide.
                </p>

                {/* Media Types Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Film, label: "Documentaries", color: "from-blue-500/20 to-blue-600/20" },
                    { icon: MonitorPlay, label: "Animated Shorts", color: "from-purple-500/20 to-purple-600/20" },
                    { icon: Mic, label: "Podcasts", color: "from-green-500/20 to-green-600/20" },
                    { icon: Camera, label: "Theatrical Works", color: "from-orange-500/20 to-orange-600/20" }
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className={`p-4 bg-gradient-to-br ${item.color} bg-white dark:bg-[#0a0a0a] rounded-xl border border-stone-200 dark:border-stone-800 text-center group hover:border-[#FFB81C]/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
                        <Icon className="w-8 h-8 text-[#FFB81C] mx-auto mb-2 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                        <div className="text-sm font-semibold text-black dark:text-white">{item.label}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap gap-4 pt-4">
                  <motion.a 
                    href="https://zomediaproductions.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#FFB81C] text-black px-8 py-4 text-sm font-bold uppercase tracking-wider hover:bg-[#e6a500] transition-all duration-300 rounded-full shadow-lg hover:shadow-[#FFB81C]/30"
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
                    className="inline-flex items-center gap-2 border-2 border-[#FFB81C] text-[#FFB81C] px-8 py-4 text-sm font-bold uppercase tracking-wider hover:bg-[#FFB81C] hover:text-black transition-all duration-300 rounded-full"
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
            SECTION 7: LIVING ARCHIVE
            ============================================================ */}
        {/* This section describes the Living Archive project.
            TO EDIT: Change text and image as needed. */}
        
        <section className="mb-32">
          <FadeIn>
            <div className="text-center mb-16">
              <div className="inline-block text-[#FFB81C] text-[11px] font-black uppercase tracking-[0.25em] mb-4">
                — Featured Archive
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black dark:text-white">
                The <span className="text-[#FFB81C]">Living Archive</span>
              </h2>
              <div className="w-20 h-1 bg-[#FFB81C] mx-auto"></div>
            </div>
          </FadeIn>

          {/* Layout: Content on top, image below (reversed) with cards */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Content first (left side) */}
            <FadeIn>
              <div className="space-y-6 order-1 md:order-1">
                <div className="inline-flex items-center gap-2 bg-[#FFB81C]/10 text-[#FFB81C] px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full">
                  <Award className="w-4 h-4" strokeWidth={2} />
                  Sustaining Public Engagement Grant
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold text-black dark:text-white leading-tight">
                  Writing Beyond <br />
                  <span className="text-[#FFB81C]">Prison</span>
                </h3>
                
                <div className="bg-gradient-to-r from-[#FFB81C]/5 to-transparent p-4 rounded-xl border-l-4 border-[#FFB81C]">
                  <p className="text-base leading-relaxed text-stone-600 dark:text-stone-300">
                    A living digital archive giving voice to those bound to mass incarceration and the carceral state, supported by the <span className="font-semibold text-[#FFB81C]">Sustaining Public Engagement grant</span> from the American Council of Learned Societies (ACLS).
                  </p>
                </div>

                {/* Grant Supporters - Cards style */}
                <div className="mt-6 p-6 bg-gradient-to-br from-stone-50 to-white dark:from-[#111111] dark:to-[#0a0a0a] border border-stone-200 dark:border-stone-800 rounded-2xl">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-4 text-center">
                    Made possible with support from
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#FFB81C]/5 transition-all duration-300 group hover:shadow-md">
                      <BookOpen className="w-5 h-5 text-[#FFB81C] flex-shrink-0 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                      <p className="font-semibold text-black dark:text-white text-xs">The Lois Lenski Covey Foundation</p>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#FFB81C]/5 transition-all duration-300 group hover:shadow-md">
                      <Landmark className="w-5 h-5 text-[#FFB81C] flex-shrink-0 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                      <p className="font-semibold text-black dark:text-white text-xs">National Endowment for the Humanities</p>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#FFB81C]/5 transition-all duration-300 group hover:shadow-md">
                      <Award className="w-5 h-5 text-[#FFB81C] flex-shrink-0 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                      <p className="font-semibold text-black dark:text-white text-xs">American Council of Learned Societies</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap gap-4">
                  <motion.a 
                    href="/living-archive" 
                    className="inline-flex items-center gap-2 bg-[#FFB81C] text-black px-8 py-4 text-sm font-bold uppercase tracking-wider hover:bg-[#e6a500] transition-all duration-300 rounded-full shadow-lg hover:shadow-[#FFB81C]/30"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Explore the Archive
                    <ArrowRight className="w-5 h-5" strokeWidth={2} />
                  </motion.a>
                </div>
              </div>
            </FadeIn>

            {/* Image second (right side) */}
            <FadeIn>
              <div className="relative aspect-[4/3] w-full bg-gradient-to-br from-stone-100 to-stone-200 dark:from-[#1a1a1a] dark:to-[#111111] overflow-hidden shadow-2xl rounded-2xl group order-2 md:order-2">
                <Image 
                  src="/image/theLivingArchive.png" 
                  alt="Living Archive - Writing Beyond Prison" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700" 
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Stats overlay */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-black/80 backdrop-blur-sm text-white px-4 py-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Archive className="w-4 h-4 text-[#FFB81C]" strokeWidth={2} />
                          <span className="text-sm font-semibold">Living Digital Archive</span>
                        </div>
                        <p className="text-xs text-stone-300 mt-1">Preserving stories from the carceral system</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[#FFB81C] font-bold text-lg">100+</span>
                        <p className="text-xs text-stone-400">Stories</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ============================================================
            SECTION 8: FEATURED BOOKS
            ============================================================ */}
        {/* This section displays the featured books.
            TO EDIT BOOKS: Modify the books array above.
            TO EDIT BOOK IMAGES: Change the img URL in the books array. */}
        
        <section className="mb-32">
          <FadeIn>
            <div className="text-center mb-16">
              <div className="inline-block text-[#FFB81C] text-[11px] font-black uppercase tracking-[0.25em] mb-4">
                — Featured Publications
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black dark:text-white">
                Featured Works
              </h2>
              <div className="w-20 h-1 bg-[#FFB81C] mx-auto"></div>
            </div>
          </FadeIn>
          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            {books.map((book, index) => (
              <StaggerItem key={index}>
                <div className="group bg-white dark:bg-[#0a0a0a] border border-stone-200 dark:border-stone-800 overflow-hidden rounded-2xl hover:shadow-3xl transition-all duration-700 hover:-translate-y-3 hover:border-[#FFB81C]/30">
                  <div className="relative aspect-[2/3] bg-stone-100 dark:bg-[#1a1a1a] overflow-hidden">
                    {/* TO EDIT BOOK IMAGE: Change the src prop */}
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
                      className="inline-flex items-center gap-2 text-[#FFB81C] font-semibold hover:text-black dark:hover:text-white transition-colors group/link"
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