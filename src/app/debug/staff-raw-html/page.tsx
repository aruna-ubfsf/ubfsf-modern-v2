// src/app/debug/staff-raw-html/page.tsx
import { findPageBySlugs } from "@/lib/wordpress/pages";

export default async function DebugStaffRawHtmlPage() {
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
  
  // Find ALL staff-related patterns
  const patterns = {
    teamMember: content.match(/\[et_pb_team_member[^\]]*\]/g) || [],
    adminLabel: content.match(/admin_label="([^"]+)"/g) || [],
    titlePrefix: content.match(/title_prefix="([^"]+)"/g) || [],
    titleSuffix: content.match(/title_suffix="([^"]+)"/g) || [],
    imageSrc: content.match(/src="([^"]+)"/g) || [],
    etPbText: content.match(/et_pb_text[^\]]*\]([\s\S]*?)\[\/et_pb_text\]/g) || [],
  };
  
  return (
    <main className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold mb-6">🔍 Raw HTML Staff Debug</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="border p-4 rounded bg-blue-50">
          <h2 className="font-bold">Page Info</h2>
          <p>Content Length: {content.length}</p>
        </div>
        <div className="border p-4 rounded bg-green-50">
          <h2 className="font-bold">Staff Indicators</h2>
          <p>et_pb_team_member: {patterns.teamMember.length}</p>
          <p>admin_label: {patterns.adminLabel.length}</p>
          <p>title_prefix: {patterns.titlePrefix.length}</p>
          <p>title_suffix: {patterns.titleSuffix.length}</p>
        </div>
        <div className="border p-4 rounded bg-yellow-50">
          <h2 className="font-bold">Found</h2>
          <p className="text-2xl font-bold">{patterns.adminLabel.length + patterns.teamMember.length}</p>
          <p className="text-sm">Potential staff entries</p>
        </div>
      </div>
      
      {/* Team Members */}
      {patterns.teamMember.length > 0 && (
        <div className="mb-8 border p-4 rounded bg-green-100">
          <h2 className="text-xl font-bold mb-4">✅ Team Members Found ({patterns.teamMember.length})</h2>
          <div className="space-y-2">
            {patterns.teamMember.map((tm, i) => (
              <div key={i} className="border-b pb-2">
                <pre className="text-sm whitespace-pre-wrap break-all">{tm}</pre>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Admin Labels */}
      {patterns.adminLabel.length > 0 && (
        <div className="mb-8 border p-4 rounded bg-purple-100">
          <h2 className="text-xl font-bold mb-4">🏷️ Admin Labels ({patterns.adminLabel.length})</h2>
          <div className="flex flex-wrap gap-2">
            {patterns.adminLabel.map((label, i) => {
              const name = label.replace('admin_label="', '').replace('"', '');
              return (
                <span key={i} className="bg-white px-3 py-1 rounded text-sm border">
                  {name}
                </span>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Title Prefix */}
      {patterns.titlePrefix.length > 0 && (
        <div className="mb-8 border p-4 rounded bg-blue-100">
          <h2 className="text-xl font-bold mb-4">📝 Title Prefixes ({patterns.titlePrefix.length})</h2>
          <div className="flex flex-wrap gap-2">
            {patterns.titlePrefix.map((prefix, i) => {
              const name = prefix.replace('title_prefix="', '').replace('"', '');
              return (
                <span key={i} className="bg-white px-3 py-1 rounded text-sm border">
                  {name}
                </span>
              );
            })}
          </div>
        </div>
      )}
      
      {/* First 3000 chars */}
      <div className="border p-4 rounded">
        <h2 className="text-xl font-bold mb-4">First 3000 Characters</h2>
        <details>
          <summary className="cursor-pointer text-blue-600">Show raw content</summary>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto whitespace-pre-wrap text-xs max-h-96 overflow-y-auto mt-2">
            {content.substring(0, 3000)}
          </pre>
        </details>
      </div>
    </main>
  );
}