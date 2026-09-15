import pathlib
p = pathlib.Path('/Users/giriaruna/Desktop/ubfsf-modern/src/lib/wordpress/graphql-client.ts')
txt = p.read_text().splitlines()
for i in range(82,96):
    print(i+1, repr(txt[i]))
