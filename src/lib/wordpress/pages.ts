// src/lib/wordpress/pages.ts

// Import from client.ts (which exports API_URL)
import { API_URL } from './client';

export interface HomePageACF {
  hero_title?: string;
  hero_subtitle?: string;
  hero_button_donate?: string;
  hero_button_learn?: string;
  mission_title?: string;
  mission_text?: string;
  mission_video_url?: string;
  quote_text?: string;
  quote_author?: string;
  vision_title?: string;
  vision_text?: string;
  objectives_title?: string;
  objectives_subtitle?: string;
  objectives_image?: number;
  objective_1_title?: string;
  objective_1_description?: string;
  objective_2_title?: string;
  objective_2_description?: string;
  objective_3_title?: string;
  objective_3_description?: string;
  donate_title?: string;
  donate_description?: string;
  donate_items?: { item: string }[];
  donate_background_image?: number;
  donate_logo_image?: number;
  donate_button_text?: string;
  donate_button_url?: string;
  founder_title?: string;
  founder_name?: string;
  founder_message?: string;
  founder_image?: number;
  founder_button_text?: string;
  news_title?: string;
  news_subtitle?: string;
  news_view_all?: string;
  cta_title?: string;
  cta_description?: string;
  cta_button_donate?: string;
  cta_button_contact?: string;
}

// Get page by slug using REST API, with slug fallback handling for WordPress sites
// that use legacy or alternate page slugs for the homepage.
export async function getPageBySlug(slug: string) {
  const slugCandidates = Array.from(new Set([
    slug,
    ...(slug === 'home' ? ['empower-communities-through-education-action-donate', 'ubfsf-home', 'home-page', 'front-page'] : []),
  ]));

  try {
    for (const candidate of slugCandidates) {
      const res = await fetch(
        `${API_URL}/wp-json/wp/v2/pages?slug=${encodeURIComponent(candidate)}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          next: { revalidate: 60 },
        }
      );

      if (!res.ok) continue;

      const pages = await res.json();
      if (pages && pages.length > 0) {
        const page = pages[0];
        // Get featured image URL if available
        let featuredImageUrl = null;
        let featuredImageAlt = '';

        if (page.featured_media) {
          try {
            const mediaRes = await fetch(
              `${API_URL}/wp-json/wp/v2/media/${page.featured_media}`,
              {
                headers: {
                  'Content-Type': 'application/json',
                },
                next: { revalidate: 60 },
              }
            );
            if (mediaRes.ok) {
              const media = await mediaRes.json();
              featuredImageUrl = media.source_url || media.media_details?.sizes?.full?.source_url || null;
              featuredImageAlt = media.alt_text || '';
            }
          } catch (error) {
            console.error('Error fetching featured image:', error);
          }
        }

        return {
          id: page.id,
          title: page.title?.rendered || '',
          content: page.content?.rendered || '',
          slug: page.slug || '',
          acf: page.acf || {},
          featuredImageUrl: featuredImageUrl,
          featuredImageAlt: featuredImageAlt,
        };
      }
    }

    if (slug === 'home') {
      const searchCandidates = ['UBFSF Home', 'UBFSF', 'Home', 'United Black Family Scholarship Foundation'];
      for (const search of searchCandidates) {
        const res = await fetch(
          `${API_URL}/wp-json/wp/v2/pages?search=${encodeURIComponent(search)}`,
          {
            headers: { 'Content-Type': 'application/json' },
            next: { revalidate: 60 },
          }
        );

        if (!res.ok) continue;

        const pages = await res.json();
        if (pages && pages.length > 0) {
          const page = pages[0];
          return {
            id: page.id,
            title: page.title?.rendered || '',
            content: page.content?.rendered || '',
            slug: page.slug || '',
            acf: page.acf || {},
            featuredImageUrl: null,
            featuredImageAlt: '',
          };
        }
      }
    }

    console.log('Page not found:', slug);
    return null;
  } catch (error) {
    console.error('Error fetching page:', error);
    return null;
  }
}

// ADD THIS FUNCTION - getMediaUrl
export async function getMediaUrl(mediaId: number): Promise<string> {
  if (!mediaId) return '';
  try {
    const res = await fetch(
      `${API_URL}/wp-json/wp/v2/media/${mediaId}`,
      {
        headers: { 'Content-Type': 'application/json' },
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return '';
    const media = await res.json();
    return media.source_url || '';
  } catch (error) {
    console.error('Error fetching media:', error);
    return '';
  }
}

// Helper to get pages by title (useful for debugging)
export async function getPageByTitle(title: string) {
  try {
    const res = await fetch(
      `${API_URL}/wp-json/wp/v2/pages?search=${encodeURIComponent(title)}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      console.error('Failed to fetch page:', res.status);
      return null;
    }

    const pages = await res.json();
    
    if (!pages || pages.length === 0) {
      return null;
    }

    const page = pages[0];
    
    return {
      title: page.title?.rendered || '',
      content: page.content?.rendered || '',
      slug: page.slug || '',
      acf: page.acf || null,
    };
  } catch (error) {
    console.error('Error fetching page:', error);
    return null;
  }
}

// Helper to get all pages (for debugging)
export async function getAllPages() {
  try {
    const res = await fetch(
      `${API_URL}/wp-json/wp/v2/pages?per_page=100`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      console.error('Failed to fetch pages:', res.status);
      return [];
    }

    const pages = await res.json();
    return pages.map((page: any) => ({
      title: page.title?.rendered || '',
      slug: page.slug || '',
      uri: page.link || '',
      status: page.status || '',
    }));
  } catch (error) {
    console.error('Error fetching pages:', error);
    return [];
  }
}

// Helper to get pages with a specific pattern in the slug
export async function getPagesBySlugPattern(pattern: string) {
  const allPages = await getAllPages();
  return allPages.filter((page: any) => 
    page.slug && page.slug.toLowerCase().includes(pattern.toLowerCase())
  );
}

// Helper to find page by trying multiple slugs
export async function findPageBySlugs(slugs: string[]) {
  for (const slug of slugs) {
    const page = await getPageBySlug(slug);
    if (page) return page;
  }
  return null;
}