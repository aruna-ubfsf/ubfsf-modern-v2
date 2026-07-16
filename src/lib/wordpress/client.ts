// src/lib/wordpress/client.ts

export const API_URL = process.env.WORDPRESS_URL || 'https://ubfsf.org';
const USER = process.env.WORDPRESS_USER;
const PASS = process.env.WORDPRESS_APP_PASSWORD;

// Helper to construct WordPress image URLs dynamically from .env
export const getWpImageUrl = (path: string) => {
  if (!path) return '';
  
  // If it's already a full URL, return it as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // If it starts with a slash, append to API_URL
  if (path.startsWith('/')) {
    return `${API_URL}${path}`;
  }
  
  // Otherwise, add a slash between API_URL and path
  return `${API_URL}/${path}`;
};

export function cleanWPContent(content: string): string {
  if (!content) return "";
  
  let cleaned = content;
  const wpBaseUrl = API_URL.replace(/\/$/, "");

  // 1. STRIP SCRIPTS
  cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

  // 2. Decode Entities - Comprehensive
  cleaned = cleaned
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&amp;/g, "&")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8243;/g, '"')
    .replace(/&#8242;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&lsquo;/g, "'")
    .replace(/&rsquo;/g, "'");

  // 3. NUCLEAR IMAGE FIX - Fix WordPress image URLs
  cleaned = cleaned.replace(
    /(src|srcset|data-src|data-lazy-src|data-orig-file)=["']\/wp-content/g, 
    (match, attr) => `${attr}="${wpBaseUrl}/wp-content`
  );

  // 4. Fix WordPress shortcodes
  cleaned = cleaned.replace(/\[\/?et_pb.*?\]/g, "").replace(/\[\/?dg_adh.*?\]/g, "");
  
  // 5. Remove empty paragraphs and fix spacing
  cleaned = cleaned
    .replace(/<p>\s*<\/p>/g, "")
    .replace(/<p>\s*<br\s*\/?>\s*<\/p>/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned;
}

export const getAuthHeader = (): Record<string, string> => {
  if (!USER || !PASS) return {};
  const auth = Buffer.from(`${USER}:${PASS}`).toString('base64');
  return { 
    'Authorization': `Basic ${auth}`,
    'Content-Type': 'application/json'
  };
};

// Helper to fetch raw content (useful for debugging)
export async function fetchRawPage(slug: string) {
  const query = `
    query GetPageRaw($slug: String!) {
      pageBy(uri: $slug) {
        title
        content
        slug
        uri
        status
      }
    }
  `;
  
  try {
    const res = await fetch(process.env.WORDPRESS_GRAPHQL_ENDPOINT!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        query, 
        variables: { slug } 
      })
    });
    
    const json = await res.json();
    return json;
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}

// Helper to check if an image exists
export async function checkImageExists(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return res.ok;
  } catch {
    return false;
  }
}

// Helper to get a fallback image URL
export const getFallbackImageUrl = (name: string): string => {
  // Generate a consistent avatar color based on name
  const colors = ['#FFB81C', '#E09900', '#FF6B35', '#E63946', '#2A9D8F', '#264653', '#287271', '#6B4E71'];
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  const color = colors[index].replace('#', '');
  
  // Return a placeholder image URL (you can use a service like ui-avatars.com)
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${color}&color=fff&size=200&font-size=0.5`;
};