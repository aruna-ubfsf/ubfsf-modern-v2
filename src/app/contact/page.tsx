// src/app/contact/page.tsx
import Image from "next/image";
import Link from "next/link";
import { getPageBySlug } from "@/lib/wordpress/pages";
import { cleanWPContent } from "@/lib/wordpress/client";

interface SocialLink {
  network: string;
  url: string;
  icon: string;
  color: string;
}

function parseContactContent(content: string) {
  // Clean the content
  const cleanContent = content
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8211;/g, "–")
    .replace(/&#038;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ");
  
  // Extract text content from et_pb_text
  const textMatch = cleanContent.match(/\[et_pb_text[^\]]*\]([\s\S]*?)\[\/et_pb_text\]/);
  let description = '';
  if (textMatch) {
    description = textMatch[1]
      .replace(/<[^>]*>/g, '')
      .replace(/&#822[01];/g, '"')
      .replace(/&#8217;/g, "'")
      .replace(/&#8211;/g, "–")
      .replace(/&#038;/g, "&")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim();
  }
  
  // Extract social media links
  const socialLinks: SocialLink[] = [];
  const socialRegex = /\[et_pb_social_media_follow_network[^\]]*social_network="([^"]+)"[^\]]*url="([^"]+)"[^\]]*background_color="([^"]+)"[^\]]*\]/g;
  let match;
  while ((match = socialRegex.exec(cleanContent)) !== null) {
    const network = match[1];
    const url = match[2];
    const color = match[3];
    
    // Map network to icon
    const iconMap: { [key: string]: string } = {
      facebook: '📘',
      twitter: '🐦',
      linkedin: '🔗',
      youtube: '▶️',
      instagram: '📸',
    };
    
    socialLinks.push({
      network,
      url,
      icon: iconMap[network] || '🌐',
      color
    });
  }
  
  // Extract video URL
  const videoMatch = cleanContent.match(/\[et_pb_video[^\]]*src="([^"]+)"[^\]]*\]/);
  let videoUrl = '';
  if (videoMatch) {
    videoUrl = videoMatch[1];
    // Convert YouTube URL to embed format
    if (videoUrl.includes('youtu.be')) {
      const id = videoUrl.split('/').pop();
      videoUrl = `https://www.youtube.com/embed/${id}`;
    } else if (videoUrl.includes('watch?v=')) {
      const id = videoUrl.split('v=')[1]?.split('&')[0];
      videoUrl = `https://www.youtube.com/embed/${id}`;
    }
  }
  
  return { description, socialLinks, videoUrl };
}

export default async function ContactPage() {
  // Try different slugs that might work
  let page = await getPageBySlug('contact');
  
  // If 'contact' doesn't work, try 'contact-us'
  if (!page) {
    page = await getPageBySlug('contact-us');
  }
  
  // If still not found, try 'contact-us-ubfsf'
  if (!page) {
    page = await getPageBySlug('contact-ubfsf');
  }

  // If no page found, show a fallback
  if (!page) {
    return (
      <main className="min-h-screen bg-white dark:bg-[#1a1a1a] text-black dark:text-[#f4f4f4] py-16 px-6 md:px-20 font-serif">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8">
            Contact <span className="text-[#FFB81C]">Us</span>
          </h1>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="text-lg text-stone-600 dark:text-stone-400 mb-6">
                We'd love to hear from you. Reach out with any questions, inquiries, or concerns.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📧</span>
                  <a href="mailto:info@ubfsf.org" className="text-stone-600 dark:text-stone-400 hover:text-[#FFB81C] transition-colors">
                    info@ubfsf.org
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📍</span>
                  <span className="text-stone-600 dark:text-stone-400">San Francisco, CA</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📞</span>
                  <a href="tel:+14155551234" className="text-stone-600 dark:text-stone-400 hover:text-[#FFB81C] transition-colors">
                    (415) 555-1234
                  </a>
                </div>
              </div>
              <div className="mt-8 flex gap-4">
                <a href="#" className="text-2xl hover:text-[#FFB81C] transition-colors">📘</a>
                <a href="#" className="text-2xl hover:text-[#FFB81C] transition-colors">🐦</a>
                <a href="#" className="text-2xl hover:text-[#FFB81C] transition-colors">🔗</a>
                <a href="#" className="text-2xl hover:text-[#FFB81C] transition-colors">▶️</a>
              </div>
            </div>
            <div>
              <form className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-stone-50 dark:bg-[#2a2a2a] border border-stone-200 dark:border-stone-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB81C] focus:border-transparent transition"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-stone-50 dark:bg-[#2a2a2a] border border-stone-200 dark:border-stone-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB81C] focus:border-transparent transition"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 bg-stone-50 dark:bg-[#2a2a2a] border border-stone-200 dark:border-stone-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB81C] focus:border-transparent transition resize-none"
                    placeholder="Your message here..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-[#FFB81C] text-black text-xs font-black uppercase tracking-widest hover:bg-yellow-500 transition-colors rounded-lg"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const { description, socialLinks, videoUrl } = parseContactContent(page.content);

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
            Get in Touch
          </span>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-4">
            Contact <span className="text-[#FFB81C]">Us</span>
          </h1>
          <p className="text-lg md:text-xl text-stone-600 dark:text-stone-400 max-w-2xl font-light">
            We'd love to hear from you. Reach out with any questions, inquiries, or concerns.
          </p>
        </div>
      </header>

      {/* CONTENT SECTION */}
      <section className="max-w-7xl mx-auto py-16 px-6 md:px-20">
        <div className="grid md:grid-cols-2 gap-16">
          
          {/* LEFT COLUMN - Contact Info */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6 tracking-tight">
              Let's Connect
            </h2>
            
            {description && (
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-8">
                {description}
              </p>
            )}
            
            {/* Social Media Links */}
            {socialLinks.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#FFB81C] mb-4">
                  Follow Us
                </h3>
                <div className="flex flex-wrap gap-4">
                  {socialLinks.map((social, index) => (
                    <Link
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-6 py-3 bg-stone-100 dark:bg-[#2a2a2a] hover:bg-[#FFB81C]/10 dark:hover:bg-[#FFB81C]/10 transition-colors rounded-lg group"
                    >
                      <span className="text-2xl">{social.icon}</span>
                      <span className="text-sm font-medium capitalize">{social.network}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            {/* Contact Details */}
            <div className="space-y-4 p-6 bg-stone-50 dark:bg-[#2a2a2a] rounded-2xl border border-black/5 dark:border-white/5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#FFB81C] mb-4">
                Contact Information
              </h3>
              
              <div className="flex items-start gap-4">
                <span className="text-xl">📍</span>
                <div>
                  <p className="font-semibold text-sm">Address</p>
                  <p className="text-stone-600 dark:text-stone-400 text-sm">
                    United Black Family Scholarship Foundation<br />
                    San Francisco, CA
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <span className="text-xl">📧</span>
                <div>
                  <p className="font-semibold text-sm">Email</p>
                  <a 
                    href="mailto:info@ubfsf.org" 
                    className="text-stone-600 dark:text-stone-400 text-sm hover:text-[#FFB81C] transition-colors"
                  >
                    info@ubfsf.org
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <span className="text-xl">📞</span>
                <div>
                  <p className="font-semibold text-sm">Phone</p>
                  <a 
                    href="tel:+14155551234" 
                    className="text-stone-600 dark:text-stone-400 text-sm hover:text-[#FFB81C] transition-colors"
                  >
                    (415) 555-1234
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* RIGHT COLUMN - Video and Form */}
          <div>
            {/* Video */}
            {videoUrl && (
              <div className="mb-8">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#FFB81C] mb-4">
                  Watch Our Story
                </h3>
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/5 dark:bg-white/5">
                  <iframe
                    src={videoUrl}
                    title="UBFSF Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              </div>
            )}
            
            {/* Contact Form */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#FFB81C] mb-4">
                Send Us a Message
              </h3>
              <form className="space-y-4" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="w-full px-4 py-3 bg-stone-50 dark:bg-[#2a2a2a] border border-stone-200 dark:border-stone-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB81C] focus:border-transparent transition"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="w-full px-4 py-3 bg-stone-50 dark:bg-[#2a2a2a] border border-stone-200 dark:border-stone-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB81C] focus:border-transparent transition"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    className="w-full px-4 py-3 bg-stone-50 dark:bg-[#2a2a2a] border border-stone-200 dark:border-stone-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB81C] focus:border-transparent transition resize-none"
                    placeholder="Your message here..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-[#FFB81C] text-black text-xs font-black uppercase tracking-widest hover:bg-yellow-500 transition-colors rounded-lg"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
        
        {/* ACTION FOOTER */}
        <div className="mt-24 pt-16 border-t border-black/10 dark:border-white/10 flex flex-wrap gap-8 items-center">
          <Link 
            href="/programs" 
            className="px-10 py-5 bg-[#FFB81C] text-black text-xs font-black uppercase tracking-widest hover:bg-yellow-500 transition-all"
          >
            Explore Programs
          </Link>
          <p className="text-stone-500 font-bold uppercase tracking-widest text-[10px]">
            Join us in building stronger communities.
          </p>
        </div>
      </section>
    </main>
  );
}