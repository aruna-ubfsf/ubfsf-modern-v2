// scripts/verify-founder-parse.mjs — validates homepage parsing logic against live WordPress
const res = await fetch(
  'https://ubfsf.org/wp-json/wp/v2/pages?slug=empower-communities-through-education-action-donate'
);
const page = (await res.json())[0];
const c = page.content.rendered;

// Clean entities (same as page.tsx)
const clean = c
  .replace(/&#8220;/g, '"').replace(/&#8221;/g, '"').replace(/&#8217;/g, "'")
  .replace(/&#8211;/g, '–').replace(/&#038;/g, '&').replace(/&amp;/g, '&')
  .replace(/&nbsp;/g, ' ').replace(/&#8243;/g, '"').replace(/&#8242;/g, "'")
  .replace(/&#x7b;/g, '{');

const idx = clean.indexOf('A Word From Our Founder');
const next = clean.indexOf('et_pb_section', idx + 30);
const sec = clean.substring(idx, next > -1 ? next : idx + 12000);

const img = sec.match(/<img[^>]+src="([^"]+)"/i);
const name = clean.match(/title_suffix="[^"]*\|\s*([^"]+)"/i);
const paras = (sec.match(/<p[\s\S]*?<\/p>/g) || [])
  .map(x => x.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim())
  .filter(t => t.length >= 30 && !/^[A-Z0-9\s&'.,-]+$/.test(t));

// Probe which live page holds the founder content
for (const slug of ['home', 'empower-communities-through-education-action-donate', 'ubfsf-home', 'home-page', 'front-page']) {
  const r = await fetch(`https://ubfsf.org/wp-json/wp/v2/pages?slug=${slug}`);
  const p = (await r.json())[0];
  if (p) {
    const c = p.content.rendered;
    console.log(slug.padEnd(48), `id=${p.id}`, `len=${c.length}`,
      'founder:', c.includes('A Word From Our Founder'), '| ivan-img:', /Kilgore-Ivan|Screenshot-2025/.test(c),
      '| acf founder_image:', p.acf?.founder_image, '| acf founder_name:', p.acf?.founder_name);
  } else {
    console.log(slug.padEnd(48), 'NOT FOUND');
  }
}
