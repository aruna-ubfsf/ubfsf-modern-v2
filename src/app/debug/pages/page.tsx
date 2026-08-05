// src/app/debug/pages/page.tsx
import { getAllPages } from "@/lib/wordpress/pages";

export default async function DebugPagesPage() {
  const pages = await getAllPages();
  
  return (
    <main className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-bold mb-4">All WordPress Pages</h1>
      <div className="space-y-2">
        {pages.map((page: any) => (
          <div key={page.slug} className="border-b pb-2">
            <strong>{page.title}</strong> - slug: <code>{page.slug}</code> - status: {page.status}
          </div>
        ))}
      </div>
    </main>
  );
}