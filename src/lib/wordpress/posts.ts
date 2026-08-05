// src/lib/wordpress/posts.ts

import { API_URL, getAuthHeader, cleanWPContent } from './client';

export interface Post {
  id: number;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  content: string;
  image: string | null;
  author?: string;
  categories?: { id: number; name: string; slug: string }[];
}

export async function getPosts(limit = 10): Promise<Post[]> {
  try {
    const res = await fetch(`${API_URL}/wp-json/wp/v2/posts?per_page=${limit}&_embed`, {
      headers: getAuthHeader(),
      next: { revalidate: 3600 }
    });

    if (!res.ok) {
      console.error('Failed to fetch posts:', res.status);
      return [];
    }

    const posts = await res.json();
    
    if (!posts || !Array.isArray(posts)) {
      return [];
    }

    return posts.map((post: any) => ({
      id: post.id || 0,
      title: cleanWPContent(post.title?.rendered || 'Untitled'),
      slug: post.slug || '',
      date: post.date || '',
      excerpt: cleanWPContent(post.excerpt?.rendered || ''),
      content: cleanWPContent(post.content?.rendered || ''),
      image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
      author: post._embedded?.author?.[0]?.name || null,
      categories: post._embedded?.['wp:term']?.[0]?.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug
      })) || []
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const res = await fetch(`${API_URL}/wp-json/wp/v2/posts?slug=${slug}&_embed`, {
      headers: getAuthHeader(),
      next: { revalidate: 3600 }
    });

    if (!res.ok) {
      console.error('Failed to fetch post:', res.status);
      return null;
    }

    const posts = await res.json();
    
    if (!posts || !Array.isArray(posts) || posts.length === 0) {
      return null;
    }

    const post = posts[0];
    
    return {
      id: post.id || 0,
      title: cleanWPContent(post.title?.rendered || 'Untitled'),
      slug: post.slug || '',
      date: post.date || '',
      excerpt: cleanWPContent(post.excerpt?.rendered || ''),
      content: cleanWPContent(post.content?.rendered || ''),
      image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
      author: post._embedded?.author?.[0]?.name || null,
      categories: post._embedded?.['wp:term']?.[0]?.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug
      })) || []
    };
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    return null;
  }
}

// Helper to get posts by category
export async function getPostsByCategory(categorySlug: string, limit = 10): Promise<Post[]> {
  try {
    // First get the category ID
    const categoryRes = await fetch(`${API_URL}/wp-json/wp/v2/categories?slug=${categorySlug}`, {
      headers: getAuthHeader(),
      next: { revalidate: 3600 }
    });

    if (!categoryRes.ok) {
      console.error('Failed to fetch category:', categoryRes.status);
      return [];
    }

    const categories = await categoryRes.json();
    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      return [];
    }

    const categoryId = categories[0].id;

    // Then get posts in that category
    const postsRes = await fetch(`${API_URL}/wp-json/wp/v2/posts?categories=${categoryId}&per_page=${limit}&_embed`, {
      headers: getAuthHeader(),
      next: { revalidate: 3600 }
    });

    if (!postsRes.ok) {
      console.error('Failed to fetch posts by category:', postsRes.status);
      return [];
    }

    const posts = await postsRes.json();
    
    if (!posts || !Array.isArray(posts)) {
      return [];
    }

    return posts.map((post: any) => ({
      id: post.id || 0,
      title: cleanWPContent(post.title?.rendered || 'Untitled'),
      slug: post.slug || '',
      date: post.date || '',
      excerpt: cleanWPContent(post.excerpt?.rendered || ''),
      content: cleanWPContent(post.content?.rendered || ''),
      image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
      author: post._embedded?.author?.[0]?.name || null,
      categories: post._embedded?.['wp:term']?.[0]?.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug
      })) || []
    }));
  } catch (error) {
    console.error('Error fetching posts by category:', error);
    return [];
  }
}

// Helper to get a single post by ID (useful for previews)
export async function getPostById(id: number): Promise<Post | null> {
  try {
    const res = await fetch(`${API_URL}/wp-json/wp/v2/posts/${id}?_embed`, {
      headers: getAuthHeader(),
      next: { revalidate: 3600 }
    });

    if (!res.ok) {
      console.error('Failed to fetch post:', res.status);
      return null;
    }

    const post = await res.json();
    
    if (!post || !post.id) {
      return null;
    }

    return {
      id: post.id || 0,
      title: cleanWPContent(post.title?.rendered || 'Untitled'),
      slug: post.slug || '',
      date: post.date || '',
      excerpt: cleanWPContent(post.excerpt?.rendered || ''),
      content: cleanWPContent(post.content?.rendered || ''),
      image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
      author: post._embedded?.author?.[0]?.name || null,
      categories: post._embedded?.['wp:term']?.[0]?.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug
      })) || []
    };
  } catch (error) {
    console.error('Error fetching post by ID:', error);
    return null;
  }
}

// Helper to get recent posts (alias for getPosts with limit)
export async function getRecentPosts(limit = 6): Promise<Post[]> {
  return getPosts(limit);
}

// Helper to get featured posts (if you have a featured category)
export async function getFeaturedPosts(limit = 3): Promise<Post[]> {
  // You can customize this - e.g., get posts from a "featured" category
  return getPosts(limit);
}