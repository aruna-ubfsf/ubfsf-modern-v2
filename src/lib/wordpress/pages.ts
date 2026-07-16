// src/lib/wordpress/pages.ts

import { API_URL } from './client';

export async function getPageBySlug(slug: string) {
  const query = `
    query GetPageBySlug($slug: String!) {
      pageBy(uri: $slug) {
        title
        content
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
        slug
        uri
        date
        modified
        status
      }
    }
  `;
  
  try {
    // Log the slug being queried
    console.log('Fetching page with slug:', slug);
    
    const res = await fetch(process.env.WORDPRESS_GRAPHQL_ENDPOINT!, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ 
        query, 
        variables: { slug } 
      }),
      next: { revalidate: 60 }
    });
    
    if (!res.ok) {
      console.error('Response not OK:', res.status, res.statusText);
      return null;
    }
    
    const json = await res.json();
    
    if (json.errors) {
      console.error('GraphQL Errors:', json.errors);
      return null;
    }

    const page = json.data.pageBy;
    if (!page) {
      console.log('Page not found for slug:', slug);
      return null;
    }

    // Return all available page data
    return {
      title: page.title || '',
      content: page.content || '',
      slug: page.slug || slug,
      uri: page.uri || '',
      date: page.date || '',
      modified: page.modified || '',
      status: page.status || 'publish',
      featuredImage: page.featuredImage?.node || null,
      featuredImageUrl: page.featuredImage?.node?.sourceUrl || null,
      featuredImageAlt: page.featuredImage?.node?.altText || page.title || '',
      featuredImageWidth: page.featuredImage?.node?.mediaDetails?.width || null,
      featuredImageHeight: page.featuredImage?.node?.mediaDetails?.height || null,
    };
  } catch (error) {
    console.error('Fetch error for slug:', slug, error);
    return null;
  }
}

// Helper to get pages by title (useful for debugging)
export async function getPageByTitle(title: string) {
  const query = `
    query GetPageByTitle($title: String!) {
      pages(where: { title: $title }) {
        nodes {
          title
          content
          slug
          uri
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
    }
  `;
  
  try {
    const res = await fetch(process.env.WORDPRESS_GRAPHQL_ENDPOINT!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        query, 
        variables: { title } 
      }),
      next: { revalidate: 60 }
    });
    
    const json = await res.json();
    
    if (json.errors) {
      console.error('GraphQL Errors:', json.errors);
      return null;
    }

    const pages = json.data.pages.nodes;
    if (!pages || pages.length === 0) return null;

    const page = pages[0];
    return {
      title: page.title || '',
      content: page.content || '',
      slug: page.slug || '',
      uri: page.uri || '',
      featuredImageUrl: page.featuredImage?.node?.sourceUrl || null,
      featuredImageAlt: page.featuredImage?.node?.altText || page.title || '',
    };
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}

// Helper to get all pages (for debugging)
export async function getAllPages() {
  const query = `
    query GetAllPages {
      pages {
        nodes {
          title
          slug
          uri
          status
        }
      }
    }
  `;
  
  try {
    const res = await fetch(process.env.WORDPRESS_GRAPHQL_ENDPOINT!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
      next: { revalidate: 3600 }
    });
    
    const json = await res.json();
    
    if (json.errors) {
      console.error('GraphQL Errors:', json.errors);
      return [];
    }

    return json.data.pages.nodes || [];
  } catch (error) {
    console.error('Fetch error:', error);
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

// Helper to get the correct page by trying multiple slug variations
export async function findPageBySlugs(slugs: string[]) {
  for (const slug of slugs) {
    const page = await getPageBySlug(slug);
    if (page) return page;
  }
  return null;
}