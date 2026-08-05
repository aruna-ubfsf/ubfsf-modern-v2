// src/app/debug/page.tsx
import { API_URL } from '@/lib/wordpress/client';

export default async function DebugPage() {
  // Fetch the raw page data from WordPress
  const res = await fetch(`${API_URL}/wp-json/wp/v2/pages?slug=home`, {
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });
  
  const pages = await res.json();
  const page = pages?.[0] || null;
  
  return (
    <div className="p-8 max-w-6xl mx-auto bg-white dark:bg-black text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-6">WordPress Debug Info</h1>
      
      <div className="mb-8 p-4 bg-yellow-100 dark:bg-yellow-900 rounded">
        <h2 className="font-bold">🔍 What to look for:</h2>
        <ul className="list-disc pl-4 mt-2">
          <li>Do you see an <code>acf</code> object in the response?</li>
          <li>If NOT: ACF is not exposing data to REST API</li>
          <li>If YES: Check if the fields have content</li>
        </ul>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">📄 Page Data:</h2>
        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto text-sm max-h-96">
          {JSON.stringify(page, null, 2)}
        </pre>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">📦 ACF Fields:</h2>
        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto text-sm max-h-96">
          {JSON.stringify(page?.acf || '❌ No ACF data found!', null, 2)}
        </pre>
      </div>
      
      <div className="p-4 bg-red-100 dark:bg-red-900 rounded">
        <h3 className="font-bold">⚠️ If you see "No ACF data found":</h3>
        <ol className="list-decimal pl-4 mt-2">
          <li>Go to WordPress Admin → ACF → Field Groups</li>
          <li>Edit your "Homepage Content" field group</li>
          <li>Scroll to Settings → "Show in REST API" → Set to <strong>Yes</strong></li>
          <li>Save and refresh this page</li>
        </ol>
      </div>
    </div>
  );
}