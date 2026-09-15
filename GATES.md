# GATES.md

## Leaf Gates

### leaf-1: GraphQL client with auth
**CHECK:** grep -r "WORDPRESS_GRAPHQL_ENDPOINT" src/lib/wordpress/graphql-client.ts
**EXPECT:** file exists and uses process.env.WORDPRESS_GRAPHQL_ENDPOINT and getAuthHeader

### leaf-2: getPageBySlugGraphQL returns nonprofit-conference
**CHECK:** node -e "import('./src/lib/wordpress/graphql').then(m=>m.getPageBySlugGraphQL('/nonprofit-conference/')).then(p=>console.log(!!p?.title))"
**EXPECT:** true

### leaf-3: Coaching page uses GraphQL content
**CHECK:** grep -n "getPageBySlugGraphQL" src/app/programs/coaching/page.tsx
**EXPECT:** match found

### leaf-4: Nonprofit conference page uses GraphQL
**CHECK:** grep -n "getPageBySlugGraphQL" src/app/programs/nonprofit-conference/page.tsx
**EXPECT:** match found

### leaf-5: No hardcoded panelists remain
**CHECK:** grep -n "panelistAudioMap" src/app/programs/coaching/page.tsx
**EXPECT:** no match

### leaf-6: Coaching hero uses black full-width layout
**CHECK:** grep -n "h-\[60vh\]" src/app/programs/coaching/page.tsx
**EXPECT:** match found

### leaf-7: Coaching tag uses gold badge with black text
**CHECK:** grep -n "bg-\[#D4A017\] text-black" src/app/programs/coaching/page.tsx
**EXPECT:** match found

### leaf-8: Audio MIME type correction present
**CHECK:** grep -n "audio/mp4" src/components/ShortcodeRenderer.tsx
**EXPECT:** match found

### leaf-9: Build succeeds
**CHECK:** npm run build
**EXPECT:** Compiled successfully

