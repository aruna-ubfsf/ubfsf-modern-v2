import pathlib
p = pathlib.Path('/Users/giriaruna/Desktop/ubfsf-modern/src/lib/wordpress/graphql-client.ts')
txt = p.read_text()

# Find start and end of getPageRenderedHtml
start_marker = 'export async function getPageRenderedHtml(uri: string): Promise<string> {'
end_marker = 'export async function getPageBySlugGraphQLFallback'
start_idx = txt.find(start_marker)
end_idx = txt.find(end_marker, start_idx)
if start_idx == -1 or end_idx == -1:
    print('markers not found')
    exit(1)

before = txt[:start_idx]
after = txt[end_idx:]

new_func = """export async function getPageRenderedHtml(uri: string): Promise<string> {
  try {
    const url = `${API_URL}${uri.startsWith('/') ? uri : `/${uri}`}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return '';
    const html = await res.text();
    const $ = cheerio.load(html);

    const makeAbsolute = (val: string | undefined) => {
      if (!val) return val;
      if (/^https?:\\/\\//i.test(val)) return val;
      if (val.includes(',')) {
        return val.split(',').map(part => {
          const [url, ...rest] = part.trim().split(/\\s+/);
          const abs = /^https?:\\/\\//i.test(url) ? url : (url.startsWith('/') ? `${API_URL}${url}` : `${API_URL}/${url}`);
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
      if (el.tagName === 'video') {
        rewriteAttr($el, 'poster');
      }
      // ensure nested sources are also rewritten
      $el.find('source').each((_, s) => {
        rewriteAttr($(s), 'src');
      });
    });
    // explicit pass for all sources
    $('source').each((_, s) => rewriteAttr($(s), 'src'));

    const main = $('#main-content').html() || $('main').html() || $('body').html() || '';
    return main;
  } catch (err) {
    console.error('getPageRenderedHtml error', err);
    return '';
  }
}
"""

new_txt = before + new_func + '\n' + after
p.write_text(new_txt)
print('written')
