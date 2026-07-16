import parse, { domToReact, HTMLReactParserOptions, Element } from 'html-react-parser';
import Link from 'next/link';

// 1. Add a function to strip Divi shortcodes
function stripShortcodes(content: string): string {
  // This regex removes common Divi shortcodes like [et_pb_...], [/et_pb_...], [dg_adh_...]
  return content.replace(/\[\/?(et_pb_|dg_adh_)[^\]]*\]/g, '');
}

const options: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (domNode instanceof Element && domNode.attribs) {
      if (domNode.attribs.class?.includes('et_pb_button')) {
        return (
          <Link href="/donate" className="bg-[#FFB81C] text-black font-black px-8 py-4 uppercase text-xs tracking-widest hover:bg-yellow-500 transition-all inline-block">
            {domToReact(domNode.children as any, options)}
          </Link>
        );
      }
    }
  },
};

export default function ShortcodeRenderer({ content }: { content: string }) {
  // 2. Clean the content first
  const cleanContent = stripShortcodes(content);
  
  // 3. Parse the clean HTML
  return <>{parse(cleanContent, options)}</>;
}
