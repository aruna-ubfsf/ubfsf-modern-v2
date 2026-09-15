import pathlib
p = pathlib.Path('/Users/giriaruna/Desktop/ubfsf-modern/src/lib/wordpress/graphql-client.ts')
lines = p.read_text().splitlines()
# lines indices 0-based
# makeAbsolute starts at line 82 (0-based)
start = 82
end = 95  # inclusive
new_lines = [
    '    const makeAbsolute = (val: string | undefined) => {',
    '      if (!val) return val;',
    '      if (/^https?:\\/\\//i.test(val)) return val;',
    '      if (val.includes(\',\')) {',
    '        return val.split(\',\').map(part => {',
    '          const [url, ...rest] = part.trim().split(/\\s+/);',
    '          const abs = /^https?:\\/\\//i.test(url) ? url : (url.startsWith(\'/\') ? `${API_URL}${url}` : `${API_URL}/${url}`);',
    '          return [abs, ...rest].join(\' \');',
    '        }).join(\',\');',
    '      }',
    '      if (val.startsWith(\'/\\')) return `${API_URL}${val}`;',
    '      return `${API_URL}/${val}`;',
    '    };',
    '',
    '    const rewriteAttr = ($el: any, attr: string) => {',
    '      const v = $el.attr(attr);',
    '      if (!v) return;',
    '      const newV = makeAbsolute(v);',
    '      if (newV !== v) $el.attr(attr, newV);',
    '    };',
]
# replace range
new_content = '\n'.join(lines[:start] + new_lines + lines[end+1:]) + '\n'
p.write_text(new_content)
print('done')
