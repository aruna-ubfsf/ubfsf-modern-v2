import { API_URL, getAuthHeader, cleanWPContent } from './client';

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  image: string;
}

export async function getTeam(slug: 'board-of-directors-2' | 'board-of-advisory') {
  try {
    const res = await fetch(`${API_URL}/wp-json/wp/v2/pages?slug=${slug}&_embed`, {
      headers: getAuthHeader(),
      next: { revalidate: 3600 }
    });
    const data = await res.json();
    if (!data.length) return [];

    // Divi stores multiple people in one 'content' string. 
    // For the demo, we return the cleaned HTML. 
    // Senior Note: Long-term, these should be individual 'Staff' Custom Post Types.
    return {
      title: data[0].title.rendered,
      content: cleanWPContent(data[0].content.rendered)
    };
  } catch (e) {
    return null;
  }
}
