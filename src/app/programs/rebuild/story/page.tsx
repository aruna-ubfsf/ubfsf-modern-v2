// src/app/programs/rebuild/story/page.tsx

import Link from 'next/link';

export default function RebuildStoryPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="max-w-4xl mx-auto px-6 md:px-20 py-20">
        <Link href="/programs/rebuild" className="text-sm text-stone-500 hover:text-black mb-8 inline-block">← Back to R.E.B.U.I.L.D.</Link>
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">Interactive Story</h1>
        <p className="text-stone-600 text-lg leading-relaxed mb-8">
          This is a placeholder for the interactive volunteer story experience. Connect this page to WordPress content for the community archives and oral histories program.
        </p>
        <div className="bg-stone-100 rounded-2xl p-12 text-center text-stone-500">
          Story module coming soon
        </div>
      </section>
    </main>
  );
}