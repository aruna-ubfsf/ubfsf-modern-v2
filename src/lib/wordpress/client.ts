// src/lib/wordpress/client.ts

export const API_URL = process.env.WORDPRESS_URL || 'https://ubfsf.org';
const USER = process.env.WORDPRESS_USER;
const PASS = process.env.WORDPRESS_APP_PASSWORD;

export const getWpImageUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/')) return `${API_URL}${path}`;
  return `${API_URL}/${path}`;
};

export function cleanWPContent(content: string): string {
  if (!content) return '';
  let cleaned = content;
  cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  cleaned = cleaned.replace(/&#8217;/g, "'").replace(/&#8216;/g, "'").replace(/&#8211;/g, "–").replace(/&#8212;/g, "—").replace(/&amp;/g, "&").replace(/&#8220;/g, '"').replace(/&#8221;/g, '"').replace(/&#8243;/g, '"').replace(/&#8242;/g, "'").replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&ldquo;/g, '"').replace(/&rdquo;/g, '"').replace(/&lsquo;/g, "'").replace(/&rsquo;/g, "'");
  cleaned = cleaned.replace(/\[\/?et_pb.*?\]/g, "").replace(/\[\/?dg_adh.*?\]/g, "");
  cleaned = cleaned.replace(/<p>\s*<\/p>/gi, "").replace(/<p>\s*<br\s*\/?>\s*<\/p>/gi, "");
  return cleaned;
}

export const getAuthHeader = (): Record<string,string> => {
  if (!USER||!PASS) return {};
  const auth = Buffer.from(`${USER}:${PASS}`).toString('base64');
  return { Authorization: `Basic ${auth}`, 'Content-Type':'application/json' };
};

export function getFallbackImageUrl(name: string): string {
  // Simple placeholder fallback; can be replaced with a real placeholder service
  const encoded = encodeURIComponent(name);
  return `https://ui-avatars.com/api/?name=${encoded}&background=D4A017&color=000&size=512`;
}
