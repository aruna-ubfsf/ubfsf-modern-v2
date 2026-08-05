// src/app/debug/staff-content/page.tsx
import { findPageBySlugs } from "@/lib/wordpress/pages";
import { parseStaffFromDivi } from "@/lib/wordpress/staff";

export default async function DebugStaffContentPage() {
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
  
  const staff = parseStaffFromDivi(page.content);
  
  return (
    <main className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold mb-6">Staff Content Debug</h1>
      
      <div className="border p-4 rounded mb-8 bg-blue-50">
        <h2 className="text-xl font-bold mb-2">Page Info</h2>
        <p>Title: {page.title}</p>
        <p>Slug: {page.slug}</p>
        <p>Content Length: {page.content?.length || 0}</p>
      </div>
      
      <div className="border p-4 rounded bg-green-50">
        <h2 className="text-xl font-bold mb-2">Staff Found: {staff.length}</h2>
        {staff.length > 0 ? (
          <div className="space-y-4 mt-4">
            {staff.map((member, i) => (
              <div key={i} className="border p-4 rounded bg-white">
                <p className="font-bold text-lg">{member.name}</p>
                <p className="text-sm text-blue-600">{member.role}</p>
                <p className="text-sm text-gray-600 mt-2">{member.bio}</p>
                {member.img && (
                  <p className="text-xs text-gray-500 mt-1 break-all">Image: {member.img}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-red-600">No staff members parsed from content</p>
        )}
      </div>
    </main>
  );
}