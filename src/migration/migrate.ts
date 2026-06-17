import fs from 'fs';
import path from 'path';

interface LegacyPagePayload {
  title: { rendered: string };
  content: { rendered: string };
}

function executeTransformationPipeline() {
  const sourcePath = path.join(process.cwd(), 'src/migration/data/wp_raw_pages.json');
  
  console.log("🚀 Extracting legacy unstructured JSON from:", sourcePath);
  
  const rawBuffer = fs.readFileSync(sourcePath, 'utf-8');
  const payload: LegacyPagePayload[] = JSON.parse(rawBuffer);
  
  payload.forEach((record) => {
    const rawTitle = record.title.rendered;
    const rawContent = record.content.rendered;
    
    // Regular Expression: Target opening and closing Divi shortcode brackets
    let cleanBio = rawContent.replace(/\[\/?et_pb.*?\]/g, "");
    // Regular Expression: Target leftover raw layout HTML tag structures
    cleanBio = cleanBio.replace(/<\/?[^>]+(>|$)/g, "").trim();
    
    // Regular Expression: Isolate the source asset URI from the profile image tag
    const imgUrlMatch = rawContent.match(/src=\u201d(https:\/\/.*?)\u201d/);
    const extractedImageUrl = imgUrlMatch ? imgUrlMatch[1] : "N/A";
    
    console.log("\n--- ✨ Transformation Complete ---");
    console.log(`Name:   ${rawTitle}`);
    console.log(`Image:  ${extractedImageUrl}`);
    console.log(`Bio:    ${cleanBio}`);
  });
}

executeTransformationPipeline();
