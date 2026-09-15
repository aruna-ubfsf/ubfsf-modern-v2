import pathlib
p = pathlib.Path('/Users/giriaruna/Desktop/ubfsf-modern/src/lib/wordpress/graphql-client.ts')
content = p.read_text()
start = content.find('const makeAbsolute')
snippet = content[start:start+400]
print(repr(snippet))
