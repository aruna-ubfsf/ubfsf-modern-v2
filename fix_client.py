import pathlib, re
p = pathlib.Path('/Users/giriaruna/Desktop/ubfsf-modern/src/lib/wordpress/client.ts')
content = p.read_text()

new_clean = '''export function cleanWPContent(content: string): string {
  if (!content) return '';
  let cleaned = content;
  cleaned = cleaned.replace(/<script\\\\b[^<]*(?:(?!<\\\\/script>)<[^<]*)*<\\\\/script>/gi, '');

  // Decode entities
  const entities: Record<string, string> = {
    '&#8217;': "'", '&#8216;': "'", '&#8211;': '–', '&#8212;': '—',
    '&amp;': '&', '&#8220;': '"', '&#8221;': '"', '&#8243;': '"',
    '&#8242;': "'", '&nbsp;': ' ', '&lt;': '<', '&gt;': '>',
    '&ldquo;': '"', '&rdquo;': '"', '&lsquo;': "'", '&rsquo;': "'",
  };
  cleaned = cleaned.replace(/&#?\\w+;/g, (m) => entities[m] ?? m);

  // Strip Divi shortcodes
  cleaned = cleaned.replace(/\\[\\/?et_pb.*?\\]/g, '').replace(/\\[\\/?dg_adh.*?\\]/g, '');

  // Collapse only empty paragraphs — NOT global whitespace
  cleaned = cleaned.replace(/<p>\\s*<\\/p>/gi, '').replace(/<p>\\s*<br\\s*\\/?>\\s*<\\/p>/gi, '');

  return cleaned.trim();
}'''

pattern = re.compile(r'export function cleanWPContent\(content: string\): string \{.*?return cleaned;\n\}', re.DOTALL)
new_content = pattern.sub(new_clean, content)
p.write_text(new_content)
print('done')
