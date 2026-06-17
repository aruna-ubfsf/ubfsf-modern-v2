export interface WordPressAsset {
  id: number;
  title: string;
  sourceUrl: string;
  mediaType: string;
  mimeType: string;
}

/**
 * Headless Data Engine: Fetches real-time media items directly from the WordPress REST API.
 * This ensures non-technical users can add/remove assets via ubfsf.org and see updates instantly.
 */
export async function fetchLiveMediaLibrary(): Promise<WordPressAsset[]> {
  const API_ENDPOINT = 'https://ubfsf.org/wp-json/wp/v2/media?per_page=100';

  try {
    const response = await fetch(API_ENDPOINT, {
      next: { revalidate: 300 } // ISR (Incremental Static Regeneration): Checks for new updates every 5 minutes
    });

    if (!response.ok) {
      throw new Error(`WordPress API returned status: ${response.status}`);
    }

    const rawData = await response.json();

    // Transform raw WordPress API payloads into a clean schema for your Next.js components
    return rawData.map((item: any) => ({
      id: item.id,
      title: item.title?.rendered || 'Untitled Asset',
      sourceUrl: item.source_url,
      mediaType: item.media_type,
      mimeType: item.mime_type
    }));

  } catch (error) {
    console.error('❌ Failed streaming live assets from WordPress Headless API:', error);
    return []; // Resilient fallback: returns empty array so your frontend components won't crash
  }
}