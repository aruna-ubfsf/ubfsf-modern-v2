import parse, { domToReact, HTMLReactParserOptions, Element } from 'html-react-parser';
import Link from 'next/link';

// 1. Add a function to strip Divi shortcodes
function stripShortcodes(content: string): string {
  // This regex removes common Divi shortcodes like [et_pb_...], [/et_pb_...], [dg_adh_...]
  return content.replace(/\[\/?(et_pb_|dg_adh_)[^\]]*\]/g, '');
}

// 1b. Remove tags with explicitly empty src attributes before parsing to avoid React warnings
function sanitizeEmptySrc(html: string): string {
  // Remove img/iframe/source/embed/track tags where src="" or src=' '
  // Do NOT strip <audio> or <video> here – they are valid with nested <source>
  return html
    .replace(/<img\b[^>]*\ssrc\s*=\s*["']\s*["'][^>]*>/gi, '')
    .replace(/<iframe\b[^>]*\ssrc\s*=\s*["']\s*["'][^>]*>/gi, '')
    .replace(/<source\b[^>]*\ssrc\s*=\s*["']\s*["'][^>]*>/gi, '')
    .replace(/<embed\b[^>]*\ssrc\s*=\s*["']\s*["'][^>]*>/gi, '')
    .replace(/<track\b[^>]*\ssrc\s*=\s*["']\s*["'][^>]*>/gi, '');
}

const options: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (domNode instanceof Element && domNode.attribs) {
      // Handle img src
      if (domNode.name === 'img') {
        const src = domNode.attribs.src;
        if (!src || src.trim() === '') {
          // Try lazy-load fallback attributes
          const dataSrc = domNode.attribs['data-src'] || domNode.attribs['data-lazy-src'] || domNode.attribs['data-original'];
          if (dataSrc && dataSrc.trim()) {
            domNode.attribs.src = dataSrc.trim();
          } else {
            // No valid src, skip node to avoid React empty src warning
            return null;
          }
        }
      }

      // Fix WordPress audio source MIME types based on extension
      if (domNode.name === 'source') {
        const src = domNode.attribs.src || '';
        const type = domNode.attribs.type || '';
        const srcNoQuery = src.split('?')[0].split('#')[0].toLowerCase();
        const mimeByExt: Record<string, string> = {
          '.m4a': 'audio/mp4',
          '.aac': 'audio/aac',
          '.ogg': 'audio/ogg',
          '.oga': 'audio/ogg',
          '.opus': 'audio/ogg',
          '.wav': 'audio/wav',
          '.flac': 'audio/flac',
          '.mp3': 'audio/mpeg',
        };
        const ext = srcNoQuery.match(/\.[a-z0-9]+$/)?.[0];
        if (ext && mimeByExt[ext]) {
          const current = type.toLowerCase();
          const correct = mimeByExt[ext];
          if (!current || (current === 'audio/mpeg' && correct !== 'audio/mpeg')) {
            domNode.attribs.type = correct;
          }
        }
        if (!src || src.trim() === '') return null;
      }

      // Media elements that require a direct src attribute
      if (['iframe', 'embed', 'track'].includes(domNode.name)) {
        const src = domNode.attribs.src;
        if (!src || src.trim() === '') return null;
      }

      // Audio and Video: Only drop if BOTH direct src and child nodes are missing
      if (['audio', 'video'].includes(domNode.name)) {
        const src = domNode.attribs.src;
        const hasChildren = domNode.children && domNode.children.length > 0;
        if ((!src || src.trim() === '') && !hasChildren) return null;
        // Ensure controls attribute is present for accessibility
        if (!domNode.attribs.controls) {
          domNode.attribs.controls = 'controls';
        }
      }

      if (domNode.attribs.class?.includes('et_pb_button')) {
        return (
          <Link href="/donate" className="bg-[#D4A017] text-black font-black px-8 py-4 uppercase text-xs tracking-widest hover:bg-[#B98A2D] transition-all inline-block">
            {domToReact(domNode.children as any, options)}
          </Link>
        );
      }
    }
  },
};

export default function ShortcodeRenderer({ content }: { content: string }) {
  // 2. Clean the content first
  let cleanContent = stripShortcodes(content);
  cleanContent = sanitizeEmptySrc(cleanContent);
  
  // 3. Parse the clean HTML
  return <>{parse(cleanContent, options)}</>;
}
