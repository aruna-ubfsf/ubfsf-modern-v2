import pathlib
p = pathlib.Path('/Users/giriaruna/Desktop/ubfsf-modern/src/lib/wordpress/graphql-client.ts')
content = p.read_text()

old = """    const makeAbsolute = (val: string | undefined) => {
      if (!val) return val;
      return val.replace(/(\\\\s|^)\\\\/wp-content\\\\//g, `$1${API_URL}/wp-content/`);
    };

    const rewriteAttr = ($el: any, attr: string) => {
      const v = $el.attr(attr);
      if (v && v.startsWith('/wp-content/')) {
        $el.attr(attr, `${API_URL}${v}`);
      } else if (v) {
        $el.attr(attr, makeAbsolute(v));
      }
    };"""

new = """    const makeAbsolute = (val: string | undefined) => {
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
    };"""

if old in content:
    content = content.replace(old, new)
    p.write_text(content)
    print('replaced')
else:
    print('old not found')
    # debug snippet
    idx = content.find('const makeAbsolute')
    print(content[idx:idx+300])
