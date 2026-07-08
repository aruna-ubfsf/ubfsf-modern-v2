export function cleanWPContent(content: string): string {
  if (!content) return "";
  return content
    .replace(/&#8217;/g, "'").replace(/&#8211;/g, "–").replace(/&amp;/g, "&")
    .replace(/&#8220;/g, '"').replace(/&#8221;/g, '"')
    // THE NUCLEAR FIX: Strips all bracketed code from your JSON dump
    .replace(/\[[\s\S]*?\]/g, "") 
    .replace(/href="https?:\/\/(www\.)?ubfsf\.org/g, 'href="')
    .replace(/<p>&nbsp;<\/p>/g, "").replace(/\s\s+/g, ' ').trim();
}
