import parse, { domToReact, HTMLReactParserOptions, Element } from 'html-react-parser';
import Link from 'next/link';

// This is where you define what happens when a "code" tag is found
const options: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (domNode instanceof Element && domNode.attribs) {
      // Example: If the WordPress code contains a specific Divi button class
      if (domNode.attribs.class?.includes('et_pb_button')) {
        return (
          <Link href="/donate" className="bg-ubfsf-gold text-black font-black px-8 py-4 uppercase text-xs tracking-widest hover:bg-yellow-500 transition-all inline-block">
            {domToReact(domNode.children, options)}
          </Link>
        );
      }
    }
  },
};

export default function ShortcodeRenderer({ content }: { content: string }) {
  // We clean the shortcodes first using your bridge logic, 
  // then parse the remaining HTML into React components.
  return <>{parse(content, options)}</>;
}
