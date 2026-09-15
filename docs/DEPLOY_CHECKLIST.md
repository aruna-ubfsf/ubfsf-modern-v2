# Deploy-Ready Checklist – ubfsf.org

## Code Quality
- [ ] All AI-generated images replaced with SmartPlaceholder or verified assets
- [ ] Zo Media placeholder replaced with SmartPlaceholder component
- [ ] Writing Beyond the Prison placeholder replaced with SmartPlaceholder
- [ ] Framer-motion animations added to Rebuild page matching Hundred Stories pattern
- [ ] Program Objectives section displayed on Rebuild page extracted from Summary REBUILD.docx
- [ ] Programs dropdown cleaned to 3 active programs + Overview
- [ ] SmartPlaceholder component available at src/components/SmartPlaceholder.tsx
- [ ] No navigation items changed: Home | About | Programs | Blog | Contact preserved

## Accessibility
- [ ] All images have alt text or aria-label via SmartPlaceholder
- [ ] Heading hierarchy h1 → h2 → h3 maintained
- [ ] Contrast meets WCAG AA for text on zinc backgrounds
- [ ] Keyboard focus visible on all interactive elements
- [ ] Links have descriptive text

## Content Accuracy
- [ ] Program structure reflects confirmed active programs only
- [ ] Writing Beyond the Prison shown only as sub-project under 100 Stories
- [ ] Scholarship & Community Grants pages marked on hold

## Performance & SEO
- [ ] Next.js images use next/image where applicable
- [ ] No console errors in dev build
- [ ] Metadata titles/descriptions present for program pages

## Deploy Steps
1. npm run build
2. npm run lint
3. Run accessibility audit: npm run a11y
4. Deploy to staging
5. Verify Programs dropdown and Rebuild page animations
6. Deploy to production

Signed off: Senior Staff Engineer
Date: 2026-09-01
