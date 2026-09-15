"use client";

import { useEffect, useState } from "react";
import { getPageBySlug } from "@/lib/wordpress/pages";
import { getWpImageUrl } from "@/lib/wordpress/client";
import Link from "next/link";

export default function HRDevelopmentPage() {
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchData() {
      try {
        const page = await getPageBySlug("hr-development");
        if (isMounted) {
          setPageData(page);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load page");
          setLoading(false);
        }
      }
    }
    
    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  function getImageUrl(imagePath: string, fallback: string): string {
    if (!imagePath) return fallback;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    try {
      const url = getWpImageUrl(imagePath);
      return url || fallback;
    } catch {
      return fallback;
    }
  }

  if (loading) {
    return (
      <main className="p-20 min-h-screen bg-white dark:bg-[#1a1a1a] text-black dark:text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#D4A017] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-stone-600 dark:text-stone-400">Loading...</p>
        </div>
      </main>
    );
  }

  if (error || !pageData) {
    return (
      <main className="p-20 min-h-screen bg-white dark:bg-[#1a1a1a] text-black dark:text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">Error: {error || "Page not found"}</p>
        </div>
      </main>
    );
  }

  const content = pageData.content || '';
  const title = pageData.title || "HR Development";

  return (
    <main className="min-h-screen bg-white dark:bg-[#1a1a1a]">
      <section className="relative h-[60vh] flex items-center justify-center text-center bg-black">
        <div className="relative z-10 max-w-4xl px-6">
          <div className="inline-block bg-[#D4A017] text-black px-4 py-1 text-xs font-bold uppercase tracking-widest mb-4">
            Internship Program
          </div>
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6">
            {title}
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Collaborate with incarcerated leaders and support community reintegration.
          </p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: content }} />
            <div className="mt-12 flex gap-4">
              <Link href="/programs" className="px-6 py-3 bg-[#D4A017] text-black font-bold">
                View All Programs
              </Link>
              <Link href="/donate" className="px-6 py-3 border border-[#D4A017] text-[#D4A017] font-bold">
                Donate Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}