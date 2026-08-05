// src/app/debug/staff-api/page.tsx
import { getStaff, getStaffPage } from "@/lib/wordpress/staff";

export default async function DebugStaffApiPage() {
  const staff = await getStaff();
  const staffPage = await getStaffPage();
  
  return (
    <main className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold mb-6">Staff API Debug</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="border p-4 rounded bg-blue-50">
          <h2 className="font-bold">Staff Page</h2>
          {staffPage ? (
            <>
              <p>Title: {staffPage.title}</p>
              <p>Slug: {staffPage.slug}</p>
              <p>Featured Image: {staffPage.featuredImageUrl ? '✅' : '❌'}</p>
              <p>Content Length: {staffPage.content?.length || 0}</p>
            </>
          ) : (
            <p className="text-red-600">Page not found</p>
          )}
        </div>
        
        <div className="border p-4 rounded bg-green-50">
          <h2 className="font-bold">Staff Members</h2>
          <p className="text-2xl font-bold">{staff.length}</p>
          <p className="text-sm">Found</p>
        </div>
      </div>
      
      <div className="border p-4 rounded">
        <h2 className="text-xl font-bold mb-4">Staff List</h2>
        {staff.length > 0 ? (
          <div className="grid grid-cols-1 gap-2">
            {staff.map((member, i) => (
              <div key={i} className="border-b py-2 flex items-center gap-4">
                {member.img && (
                  <img src={member.img} alt={member.name} className="w-12 h-12 object-cover rounded-full" />
                )}
                <div>
                  <p className="font-bold">{member.name}</p>
                  <p className="text-sm text-gray-600">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-red-600">No staff found</p>
        )}
      </div>
    </main>
  );
}