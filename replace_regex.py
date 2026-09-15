import pathlib, re
p = pathlib.Path('/Users/giriaruna/Desktop/ubfsf-modern/src/lib/wordpress/graphql-client.ts')
txt = p.read_text()

pattern = re.compile(r'const makeAbsolute = \(val: string \| undefined\) => \{\s+if \(!val\) return val;\s+return val\.replace\(.*?\\s+?\}\;\n\n    const rewriteAttr = \(\$el: any, attr: string\) => \{\s+const v = \$el\.attr\(attr\);\s+if \(v && v\.startsWith\(\'/wp-content/\'\)\) \{\s+\$el\.attr\(attr, `\$\{API_URL\}\$\{v\}`\);\s+\} else if \(v\) \{\s+\$el\.attr\(attr, makeAbsolute\(v\)\);\s+\}\s+\};', re.DOTALL)

new_block = """    const makeAbsolute = (val: string | undefined) => {
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

if pattern.search(txt):
    txt = pattern.sub(new_block, txt)
    p.write_text(txt)
    print('replaced')
else:
    print('no match')
