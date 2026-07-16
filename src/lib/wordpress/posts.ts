import { API_URL, getAuthHeader, cleanWPContent } from './client';

export interface Post {
  id: number;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  content: string;
  image: string | null;
}

export async function getPosts(limit = 10): Promise<Post[]> {
  try {
    const res = await fetch(`${API_URL}/wp-json/wp/v2/posts?per_page=${limit}&_embed`, {
      headers: getAuthHeader(),
      next: { revalidate: 3600 }
    });
    const posts = await res.json();
    return posts.map((post: any) => ({
      id: post.id,
      title: cleanWPContent(post.title.rendered),
      slug: post.slug,
      date: post.date,
      excerpt: cleanWPContent(post.excerpt.rendered),
      content: cleanWPContent(post.content?.rendered || ''),
      image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
    }));
  } catch (e) {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const res = await fetch(`${API_URL}/wp-json/wp/v2/posts?slug=${slug}&_embed`, {
      headers: getAuthHeader(),
      next: { revalidate: 3600 }
    });
    const posts = await res.json();
    if (!posts || posts.length === 0) return null;
    
    const post = posts[0];
    return {
      id: post.id,
      title: cleanWPContent(post.title.rendered),
      slug: post.slug,
      date: post.date,
      excerpt: cleanWPContent(post.excerpt?.rendered || ''),
      content: cleanWPContent(post.content.rendered),
      image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
    };
  } catch (e) {
    return null;
  }
}
