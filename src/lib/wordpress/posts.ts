import { API_URL, getAuthHeader, cleanWPContent } from './client';

export async function getPosts(limit = 10) {
  const fields = ['id', 'slug', 'title', 'date', 'excerpt', '_links', '_embedded'].join(',');
  try {
    const res = await fetch(`${API_URL}/wp-json/wp/v2/posts?per_page=${limit}&_embed&_fields=${fields}`, {
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
      image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
    }));
  } catch (e) {
    return [];
  }
}
