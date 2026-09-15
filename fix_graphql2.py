import pathlib
p = pathlib.Path('/Users/giriaruna/Desktop/ubfsf-modern/src/lib/wordpress/graphql-client.ts')
lines = p.read_text().splitlines(True)
# Find start index
start = None
end = None
for i,line in enumerate(lines):
    if 'const makeAbsolute = (val: string | undefined) =>' in line:
        start = i
    if start is not None and 'const rewriteAttr = ($el: any, attr: string) =>' in line:
        # find end of rewriteAttr
        # we will replace until '};'
        # find line with '};' after rewriteAttr
        for j in range(i, min(i+20, len(lines))):
            if '};' in lines[j] and 'const' not in lines[j]:
                end = j
                break
        break

if start is not None and end is not None:
    new_lines = [
        '    const makeAbsolute = (val: string | undefined) => {\n',
        '      if (!val) return val;\n',
        '      if (/^https?:\\/\\//i.test(val)) return val;\n',
        '      if (val.includes(\',\')) {\n',
        '        return val.split(\',\').map(part => {\n',
        '          const [url, ...rest] = part.trim().split(/\\s+/);\n',
        '          const abs = /^https?:\\/\\//i.test(url) ? url : (url.startsWith(\'/\') ? `${API_URL}${url}` : `${API_URL}/${url}`);\n',
        '          return [abs, ...rest].join(\' \');\n',
        '        }).join(\',\');\n',
        '      }\n',
        '      if (val.startsWith(\'/\\')) return `${API_URL}${val}`;\n',
        '      return `${API_URL}/${val}`;\n',
        '    };\n',
        '\n',
        '    const rewriteAttr = ($el: any, attr: string) => {\n',
        '      const v = $el.attr(attr);\n',
        '      if (!v) return;\n',
        '      const newV = makeAbsolute(v);\n',
        '      if (newV !== v) $el.attr(attr, newV);\n',
        '    };\n',
    ]
    new_content = ''.join(lines[:start] + new_lines + lines[end+1:])
    p.write_text(new_content)
    print('done')
else:
    print('not found')
