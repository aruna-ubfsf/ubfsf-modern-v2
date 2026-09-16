// src/lib/wordpress/graphql-client.ts
import { getAuthHeader, API_URL } from './client';
import * as cheerio from 'cheerio';

const GRAPHQL_ENDPOINT = process.env.WORDPRESS_GRAPHQL_ENDPOINT || `${API_URL}/graphql`;

export async function graphqlRequest<T = any>(query: string, variables?: Record<string, any>) {
  const auth = getAuthHeader();
  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...auth,
    },
    body: JSON.stringify({ query, variables }),
    // Next.js caching
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    console.error('GraphQL request failed', res.status, await res.text());
    throw new Error(`GraphQL request failed: ${res.status}`);
  }

  const json = await res.json();
  if (json.errors) {
    console.error('GraphQL errors', json.errors);
    throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
  }
  return json.data as T;
}

export interface GraphQLPage {
  title: string;
  content: string;
  slug?: string;
  uri?: string;
  featuredImage?: {
    node?: {
      sourceUrl: string;
      altText?: string;
    };
  };
}

export async function getPageBySlugGraphQL(slug: string): Promise<GraphQLPage | null> {
  // WPGraphQL pageBy uses uri with leading/trailing slash
  const normalizedSlug = slug.startsWith('/') ? slug : `/${slug}/`;
  const query = `
    query GetPageByUri($uri: String!) {
      pageBy(uri: $uri) {
        title
        content
        uri
        slug
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  `;

  try {
    const data = await graphqlRequest<{ pageBy: GraphQLPage | null }>(query, { uri: normalizedSlug });
    return data.pageBy ?? null;
  } catch (err) {
    console.error('getPageBySlugGraphQL error', err);
    return null;
  }
}

export async function getPageRenderedHtml(uri: string): Promise<string> {
  try {
    const url = `${API_URL}${uri.startsWith('/') ? uri : `/${uri}`}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return '';
    const html = await res.text();
    console.log('[AUDIO] raw length:', html.length);
    console.log('[AUDIO] raw <audio>:', (html.match(/<audio/gi) || []).length);
    console.log('[AUDIO] raw <source>:', (html.match(/<source/gi) || []).length);
    console.log('[AUDIO] raw .m4a/.mp3 refs:', (html.match(/\.(m4a|mp3)/gi) || []).length);
    const $ = cheerio.load(html);

    const makeAbsolute = (val: string | undefined) => {
      if (!val) return val;
      if (/^https?:\/\//i.test(val)) return val;
      if (val.includes(',')) {
        return val.split(',').map(part => {
          const [url, ...rest] = part.trim().split(/\s+/);
          const abs = /^https?:\/\//i.test(url) ? url : (url.startsWith('/') ? `${API_URL}${url}` : `${API_URL}/${url}`);
          return [abs, ...rest].join(' ');
        }).join(',');
      }
      if (val.startsWith('/')) return `${API_URL}${val}`;
      return `${API_URL}/${val}`;
    };

    const rewriteAttr = ($el: any, attr: string) => {
      const v = $el.attr(attr);
      if (!v) return;
      const newV = makeAbsolute(v);
      if (newV !== v) $el.attr(attr, newV);
    };

    $('img').each((_, el) => {
      const $el = $(el);
      ['src', 'data-src', 'data-lazy-src', 'data-orig-file', 'srcset'].forEach(a => rewriteAttr($el, a));
    });

    $('source, audio, video, iframe, embed, track').each((_, el) => {
      const $el = $(el);
      rewriteAttr($el, 'src');
      if ($el.is('video')) {
        rewriteAttr($el, 'poster');
      }
      // ensure nested sources are also rewritten
      $el.find('source').each((_, s) => {
        rewriteAttr($(s), 'src');
      });
    });
    // explicit pass for all sources
    $('source').each((_, s) => rewriteAttr($(s), 'src'));

    console.log('[AUDIO] post-rewrite <audio>:', $('audio').length);
    console.log('[AUDIO] post-rewrite <source>:', $('source').length);
    console.log('[AUDIO] #main-content:', $('#main-content').length, 'main:', $('main').length, 'body:', $('body').length);
    $('audio').each((i, el) => console.log(`[AUDIO] node ${i}:`, $.html(el)));

    const main = $('#main-content').html() || $('main').html() || $('body').html() || '';
    return main;
  } catch (err) {
    console.error('getPageRenderedHtml error', err);
    return '';
  }
}

export async function getPageBySlugGraphQLFallback(slug: string): Promise<GraphQLPage | null> {
  // Fallback using pageBy with uri variable
  const normalizedSlug = slug.startsWith('/') ? slug : `/${slug}/`;
  const query = `
    query GetPageByUriFallback($uri: String!) {
      pageBy(uri: $uri) {
        title
        content
        uri
        slug
      }
    }
  `;

  try {
    const data = await graphqlRequest<{ pageBy: GraphQLPage | null }>(query, { uri: normalizedSlug });
    return data.pageBy ?? null;
  } catch (err) {
    console.error('getPageBySlugGraphQLFallback error', err);
    return null;
  }
}
