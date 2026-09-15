import pathlib
p = pathlib.Path('/Users/giriaruna/Desktop/ubfsf-modern/src/lib/wordpress/graphql-client.ts')
txt = p.read_text()

old_block = """    const makeAbsolute = (val: string | undefined) => {
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

new_block = """    const makeAbsolute = (val: string | undefined) => {
      if (!val) return val;
      // Already absolute
      if (/^https?:\\/\\//i.test(val)) return val;
      // srcset may contain multiple URLs separated by commas
      if (val.includes(',')) {
        return val.split(',').map(part => {
          const [url, ...rest] = part.trim().split(/\\s+/);
          const abs = /^https?:\\/\\//i.test(url) ? url : (url.startsWith('/') ? `${API_URL}${url}` : `${API_URL}/${url}`);
          return [abs, ...rest].join(' ');
        }).join(',');
      }
      // Relative path
      if (val.startsWith('/')) return `${API_URL}${val}`;
      return `${API_URL}/${val}`;
    };

    const rewriteAttr = ($el: any, attr: string) => {
      const v = $el.attr(attr);
      if (!v) return;
      const newV = makeAbsolute(v);
      if (newV !== v) $el.attr(attr, newV);
    };"""

txt = txt.replace(old_block, new_block)
p.write_text(txt)
print('done')
