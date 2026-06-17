export interface WordPressMediaAsset {
  id: number;
  title: string;
  sourceUrl: string;
  mediaType: string;
  mimeType: string;
}

export interface WordPressPageContent {
  title: string;
  content: string;
}

/**
 * HISTORICAL COMPATIBILITY: Fetches raw media library elements
 */
export async function fetchLiveMediaLibrary(): Promise<WordPressMediaAsset[]> {
  return getHeadlessMediaAssets();
}

/**
 * High-Performance Headless CMS Media Data Fetcher
 */
export async function getHeadlessMediaAssets(): Promise<WordPressMediaAsset[]> {
  const WORDPRESS_API_URL = "https://ubfsf.org/wp-json/wp/v2/media?per_page=100";

  try {
    const response = await fetch(WORDPRESS_API_URL, {
      next: { revalidate: 300 }
    });

    if (!response.ok) return [];

    const rawData = await response.json();
    return rawData.map((item: any) => ({
      id: item.id,
      title: item.title?.rendered || "Untitled Asset",
      sourceUrl: item.source_url,
      mediaType: item.media_type,
      mimeType: item.mime_type,
    }));
  } catch (error) {
    console.error("⛔ [Headless Sync Error]: Failed to fetch media data:", error);
    return [];
  }
}

/**
 * HIGH-PERFORMANCE HOMEPAGE FETCH ENGINE
 * Explicitly exported to fix the Turbopack build error
 */
export async function getHeadlessPageBySlug(slug: string): Promise<WordPressPageContent | null> {
  const API_URL = `https://ubfsf.org/wp-json/wp/v2/pages?slug=${slug}`;

  try {
    const response = await fetch(API_URL, {
      next: { revalidate: 300 }
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (!data || data.length === 0) return null;

    return {
      title: data[0].title?.rendered || "",
      content: data[0].content?.rendered || "",
    };
  } catch (error) {
    console.error(`⛔ [Headless Sync Error] Failed to fetch page slug: ${slug}`, error);
    return null;
  }
}