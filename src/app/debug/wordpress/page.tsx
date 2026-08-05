// src/app/debug/wordpress/page.tsx
import { API_URL } from "@/lib/wordpress/client";

export default async function DebugWordPressPage() {
  // Test fetching all pages
  const res = await fetch(`${API_URL}/wp-json/wp/v2/pages?per_page=100`, {
    cache: 'no-store'
  });
  const pages = await res.json();
  
  return (
    <main className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-bold mb-4">WordPress API Test</h1>
      <p className="mb-4">API URL: {API_URL}</p>
      <p className="mb-4">Total pages: {pages.length}</p>
      <div className="space-y-2">
        {pages.map((page: any) => (
          <div key={page.id} className="border-b pb-2">
            <strong>{page.title?.rendered || 'Untitled'}</strong> - 
            slug: <code>{page.slug}</code> - 
            status: {page.status}
          </div>
        ))}
      </div>
    </main>
  );
}