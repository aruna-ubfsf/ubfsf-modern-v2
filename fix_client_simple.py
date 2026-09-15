import pathlib
p = pathlib.Path('/Users/giriaruna/Desktop/ubfsf-modern/src/lib/wordpress/client.ts')
txt = p.read_text()
old_line = 'cleaned = cleaned.replace(/<p>\\s*<\\/p>/g, "").replace(/<p>\\s*<br\\s*\\/?>\\s*<\\/p>/g, "").replace(/\\s+/g, " ").trim();'
new_line = 'cleaned = cleaned.replace(/<p>\\s*<\\/p>/gi, "").replace(/<p>\\s*<br\\s*\\/?>\\s*<\\/p>/gi, "");'
txt = txt.replace(old_line, new_line)
p.write_text(txt)
print('done')
