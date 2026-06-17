import * as fs from 'fs';
import * as path from 'path';

const RAW_MEDIA_PATH = path.join(__dirname, 'data', 'wp_raw_media.json');
const TARGET_ASSET_DIR = path.join(process.cwd(), 'public', 'assets');

async function runDynamicHarvest() {
  console.log("🚀 Initializing Production Media Crawler...");

  if (!fs.existsSync(RAW_MEDIA_PATH)) {
    console.error("❌ wp_raw_media.json missing!");
    return;
  }

  const mediaData = JSON.parse(fs.readFileSync(RAW_MEDIA_PATH, 'utf8'));
  
  console.log(`📊 Found ${mediaData.length} assets in metadata. Starting harvest...\n`);

  for (const item of mediaData) {
    // Get the highest resolution version of the file
    const url = item.source_url;
    const filename = path.basename(url);
    const destination = path.join(TARGET_ASSET_DIR, filename);

    try {
      const response = await fetch(url);
      if (response.ok) {
        const buffer = await response.arrayBuffer();
        fs.writeFileSync(destination, Buffer.from(buffer));
        console.log(`✅ Harvested: ${filename}`);
      } else {
        console.log(`⚠️  Skipped: ${filename} (HTTP ${response.status})`);
      }
    } catch (err) {
      console.log(`❌ Failed: ${filename}`);
    }
  }
  console.log("\n✨ Asset Synchronization Complete.");
}

runDynamicHarvest();
