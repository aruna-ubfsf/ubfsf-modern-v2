// src/app/debug/staff-detailed/page.tsx
import { findPageBySlugs } from "@/lib/wordpress/pages";

export default async function DebugStaffDetailedPage() {
  const page = await findPageBySlugs([
    "staff-and-volunteers",
    "staff",
    "volunteers",
    "our-staff",
    "team"
  ]);
  
  if (!page) {
    return <div className="p-8">Page not found</div>;
  }
  
  const content = page.content || '';
  
  // Find Divi team member modules
  const teamMemberRegex = /\[et_pb_team_member[^\]]*name="([^"]+)"[^\]]*image_url="([^"]+)"[^\]]*\]/g;
  const teamMembers: { name: string; image: string }[] = [];
  let tmMatch;
  while ((tmMatch = teamMemberRegex.exec(content)) !== null) {
    teamMembers.push({
      name: tmMatch[1],
      image: tmMatch[2]
    });
  }
  
  // Find all headings
  const headingRegex = /<h[1-6][^>]*>([^<]+)<\/h[1-6]>/gi;
  const headings: string[] = [];
  let headingMatch;
  while ((headingMatch = headingRegex.exec(content)) !== null) {
    headings.push(headingMatch[1].trim());
  }
  
  // Find all images
  const imageRegex = /<img[^>]*src=["']([^"']+)["'][^>]*>/gi;
  const images: string[] = [];
  let imgMatch;
  while ((imgMatch = imageRegex.exec(content)) !== null) {
    images.push(imgMatch[1]);
  }
  
  // Find Divi modules
  const diviModules: string[] = content.match(/\[et_pb_[^\]]*\]/g) || [];
  const uniqueModules = [...new Set(diviModules)];
  
  // Find all paragraphs with possible names
  const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  const paragraphs: string[] = [];
  let pMatch;
  while ((pMatch = pRegex.exec(content)) !== null) {
    const text = pMatch[1].replace(/<[^>]*>/g, '').trim();
    if (text.length > 0 && text.length < 200) {
      paragraphs.push(text);
    }
  }
  
  return (
    <main className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold mb-6">🔍 Detailed Staff Debug</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="border p-4 rounded bg-blue-50">
          <h2 className="font-bold">Page Info</h2>
          <p>Title: {page.title}</p>
          <p>Slug: {page.slug}</p>
          <p>Content: {content.length} chars</p>
        </div>
        <div className="border p-4 rounded bg-green-50">
          <h2 className="font-bold">HTML Elements</h2>
          <p>Images: {images.length}</p>
          <p>Headings: {headings.length}</p>
          <p>Paragraphs: {paragraphs.length}</p>
        </div>
        <div className="border p-4 rounded bg-yellow-50">
          <h2 className="font-bold">Divi Modules</h2>
          <p>Total: {diviModules.length}</p>
          <p>Unique: {uniqueModules.length}</p>
          <p>Team Members: {teamMembers.length}</p>
        </div>
      </div>
      
      {teamMembers.length > 0 && (
        <div className="mb-8 border p-4 rounded bg-green-100">
          <h2 className="text-2xl font-bold mb-4">✅ Divi Team Members Found: {teamMembers.length}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teamMembers.map((tm, i) => (
              <div key={i} className="border p-3 rounded bg-white">
                <p className="font-bold">{tm.name}</p>
                <p className="text-sm text-gray-600 break-all">Image: {tm.image}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mb-8 border p-4 rounded">
        <h2 className="text-xl font-bold mb-2">Headings ({headings.length})</h2>
        <div className="flex flex-wrap gap-2">
          {headings.map((h, i) => (
            <span key={i} className={`px-3 py-1 rounded text-sm ${
              ['Staff', 'Volunteers', 'Team', 'About', 'Contact', 'Mission', 'Vision'].includes(h) 
                ? 'bg-red-100 text-red-700 font-bold' 
                : 'bg-gray-100'
            }`}>
              {h}
            </span>
          ))}
        </div>
      </div>
      
      <div className="mb-8 border p-4 rounded">
        <h2 className="text-xl font-bold mb-2">Divi Modules ({uniqueModules.length})</h2>
        <div className="flex flex-wrap gap-2">
          {uniqueModules.slice(0, 20).map((module, i) => (
            <span key={i} className="bg-gray-100 px-2 py-1 rounded text-xs font-mono break-all">
              {module}
            </span>
          ))}
          {uniqueModules.length > 20 && <p className="mt-2">... and {uniqueModules.length - 20} more</p>}
        </div>
      </div>
      
      <div className="mb-8 border p-4 rounded">
        <h2 className="text-xl font-bold mb-2">Images ({images.length})</h2>
        <div className="flex flex-wrap gap-2">
          {images.slice(0, 10).map((img, i) => (
            <div key={i} className="bg-gray-100 p-2 rounded text-xs break-all max-w-xs">
              {img}
            </div>
          ))}
          {images.length > 10 && <p className="mt-2">... and {images.length - 10} more</p>}
        </div>
      </div>
      
      <div className="border p-4 rounded">
        <h2 className="text-xl font-bold mb-2">First 2000 Characters</h2>
        <details>
          <summary className="cursor-pointer text-blue-600 mb-2">Show content</summary>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto whitespace-pre-wrap text-xs max-h-96 overflow-y-auto">
            {content.substring(0, 2000)}
          </pre>
        </details>
      </div>
    </main>
  );
}