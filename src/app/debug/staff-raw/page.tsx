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
  
  // Find ALL occurrences of "dg_adh_heading" with their context
  const headingMatches = [];
  const headingRegex = /dg_adh_heading[^\]]*title_prefix="([^"]+)"[^\]]*title_suffix="([^"]*)"?/g;
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const prefix = match[1];
    const suffix = match[2] || '';
    const start = Math.max(0, match.index - 200);
    const end = Math.min(content.length, match.index + 300);
    headingMatches.push({
      prefix,
      suffix,
      context: content.substring(start, end)
    });
  }
  
  // Find ALL occurrences of "et_pb_team_member"
  const teamMatches = [];
  const teamRegex = /\[et_pb_team_member[^\]]*name="([^"]+)"[^\]]*image_url="([^"]+)"[^\]]*\]/g;
  let teamMatch;
  while ((teamMatch = teamRegex.exec(content)) !== null) {
    teamMatches.push({
      name: teamMatch[1],
      image: teamMatch[2]
    });
  }
  
  // Find ALL occurrences of "admin_label" in rows
  const rowLabels = [];
  const rowRegex = /et_pb_row[^\]]*admin_label="([^"]+)"/g;
  let rowMatch;
  while ((rowMatch = rowRegex.exec(content)) !== null) {
    rowLabels.push(rowMatch[1]);
  }
  
  return (
    <main className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold mb-6">🔍 Raw HTML Debug</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="border p-4 rounded bg-blue-50">
          <h2 className="font-bold">Page Info</h2>
          <p>Content Length: {content.length}</p>
        </div>
        <div className="border p-4 rounded bg-green-50">
          <h2 className="font-bold">Staff Indicators</h2>
          <p>dg_adh_heading: {headingMatches.length}</p>
          <p>et_pb_team_member: {teamMatches.length}</p>
          <p>admin_label rows: {rowLabels.length}</p>
        </div>
        <div className="border p-4 rounded bg-yellow-50">
          <h2 className="font-bold">Found</h2>
          <p className="text-2xl font-bold">{headingMatches.length + teamMatches.length}</p>
          <p className="text-sm">Potential staff entries</p>
        </div>
      </div>
      
      {/* Team Members */}
      {teamMatches.length > 0 && (
        <div className="mb-8 border p-4 rounded bg-green-100">
          <h2 className="text-xl font-bold mb-4">✅ Team Members Found ({teamMatches.length})</h2>
          <div className="space-y-2">
            {teamMatches.map((tm, i) => (
              <div key={i} className="border-b pb-2">
                <p className="font-bold">{tm.name}</p>
                <p className="text-sm text-gray-600 break-all">{tm.image}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Headings */}
      {headingMatches.length > 0 && (
        <div className="mb-8 border p-4 rounded bg-blue-100">
          <h2 className="text-xl font-bold mb-4">📝 Headings Found ({headingMatches.length})</h2>
          <div className="space-y-4">
            {headingMatches.map((h, i) => (
              <div key={i} className="border p-2 rounded bg-white">
                <p className="font-bold">Prefix: {h.prefix}</p>
                {h.suffix && <p className="text-sm text-gray-600">Suffix: {h.suffix}</p>}
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm text-blue-600">Show context</summary>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto whitespace-pre-wrap mt-1">
                    {h.context}
                  </pre>
                </details>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Row Labels */}
      {rowLabels.length > 0 && (
        <div className="mb-8 border p-4 rounded bg-purple-100">
          <h2 className="text-xl font-bold mb-4">🏷️ Row Labels ({rowLabels.length})</h2>
          <div className="flex flex-wrap gap-2">
            {rowLabels.map((label, i) => (
              <span key={i} className="bg-white px-3 py-1 rounded text-sm border">
                {label}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* No matches found */}
      {headingMatches.length === 0 && teamMatches.length === 0 && (
        <div className="border p-4 rounded bg-red-100">
          <h2 className="text-xl font-bold text-red-600">❌ No staff patterns found!</h2>
          <p className="mt-2">The content doesn't contain any recognizable staff patterns.</p>
          <details className="mt-4">
            <summary className="cursor-pointer text-blue-600">Show first 2000 characters</summary>
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto whitespace-pre-wrap text-xs max-h-96 overflow-y-auto mt-2">
              {content.substring(0, 2000)}
            </pre>
          </details>
        </div>
      )}
    </main>
  );
}