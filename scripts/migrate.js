const fs = require('fs');

async function migrate() {
  const domain = 'https://ubfsf.org';
  const types = ['posts', 'pages'];
  
  for (const type of types) {
    console.log(`Syncing ${type}...`);
    const res = await fetch(`${domain}/wp-json/wp/v2/${type}?per_page=100&_embed`);
    const data = await res.json();
    
    const cleanData = data.map(item => ({
      id: item.id,
      slug: item.slug,
      title: item.title.rendered,
      content: item.content.rendered,
      excerpt: item.excerpt?.rendered || "",
      date: item.date,
      image: item._embedded?.['wp:featuredmedia']?.[0]?.source_url || null
    }));

    if (!fs.existsSync('./src/data')) fs.mkdirSync('./src/data', { recursive: true });
    fs.writeFileSync(`./src/data/${type}.json`, JSON.stringify(cleanData, null, 2));
    console.log(`✅ ${type} synced locally.`);
  }
}

migrate();
