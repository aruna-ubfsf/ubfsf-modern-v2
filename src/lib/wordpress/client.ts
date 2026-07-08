export const API_URL = process.env.WORDPRESS_URL;
const USER = process.env.WORDPRESS_USER;
const PASS = process.env.WORDPRESS_APP_PASSWORD;

/**
 * RECURSIVE NUCLEAR CLEANER
 * Senior Engineer Fix: Strips nested, multi-line shortcodes.
 */
export function cleanWPContent(content: string): string {
  if (!content) return "";
  
  let cleaned = content;

  // 1. Decode HTML Entities
  cleaned = cleaned
    .replace(/&#8217;/g, "'").replace(/&#8211;/g, "–").replace(/&amp;/g, "&")
    .replace(/&#8220;/g, '"').replace(/&#8221;/g, '"');

  // 2. THE FIX: Recursive stripping for nested [et_pb][et_pb][/et_pb][/et_pb]
  const shortcodeRegex = /\[[\s\S]*?\]/g;
  while (shortcodeRegex.test(cleaned)) {
    cleaned = cleaned.replace(shortcodeRegex, "");
  }

  // 3. Link Interceptor
  cleaned = cleaned.replace(/href="https?:\/\/(www\.)?ubfsf\.org/g, 'href="');

  // 4. Whitespace Cleanup
  return cleaned
    .replace(/<p>&nbsp;<\/p>/g, "")
    .replace(/\s\s+/g, ' ')
    .trim();
}

export const getAuthHeader = () => {
  if (!USER || !PASS) return {};
  const auth = Buffer.from(`${USER}:${PASS}`).toString('base64');
  return { 'Authorization': `Basic ${auth}` };
};
