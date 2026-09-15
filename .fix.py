import re
path = 'src/app/page.tsx'
lines = open(path».read().split('\n')
for i, l in enumerate(lines):
    if l.strip().startswith('.join('):
        lines[i] = '        .join(\'\\n\\n\');'
open(path, 'w').write('\n'.join(lines))
print('fixed line', [i for i,l in enumerate(lines) if '.join(' in l])