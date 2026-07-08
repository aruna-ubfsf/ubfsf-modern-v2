/**
 * src/lib/wordpress/page.ts
 * Handles Static Pages (About, Mission, Contact, etc.)
 */
import { API_URL, getAuthHeader, cleanWPContent } from './client';

/**
 * LIVE API FETCH (Dual Access)
 */
export async function getPageBySlug(slug: string) {
  try {
    const res = await fetch(`${API_URL}/wp-json/wp/v2/pages?slug=${slug}&_embed`, {
      headers: getAuthHeader(),
      next: { revalidate: 60 }
    });

    const pages = await res.json();
    
    // If live API fails to find the page, fallback to local JSON
    if (!pages || pages.length === 0) {
      return getLocalPageBySlug(slug);
    }

    const page = pages[0];
    return {
      title: cleanWPContent(page.title.rendered),
      content: page.content.rendered,
      image: page._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
    };
  } catch (error) {
    console.error(`Fetch error for slug: ${slug}, falling back to local.`);
    return getLocalPageBySlug(slug);
  }
}

/**
 * LOCAL FALLBACK (Safety Net)
 * Defined only ONCE to prevent "multiple times" error.
 */
export async function getLocalPageBySlug(slug: string) {
  try {
    const data = await import('@/data/pages.json');
    const page = data.default.find((p: any) => p.slug === slug);
    
    if (!page) return null;

    return {
      title: cleanWPContent(page.title),
      content: page.content
    };
  } catch (e) {
    return null;
  }
}
