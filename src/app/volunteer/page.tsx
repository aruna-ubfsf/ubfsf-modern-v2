"use client";

import { useEffect, useState } from "react";
import { getVolunteers, Volunteer } from "@/lib/wordpress/volunteers";
import Link from "next/link";

export default function VolunteerPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchData() {
      try {
        const data = await getVolunteers();
        if (isMounted) {
          setVolunteers(data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load volunteers");
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
    return fallback;
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

  if (error) {
    return (
      <main className="p-20 min-h-screen bg-white dark:bg-[#1a1a1a] text-black dark:text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">Error: {error}</p>
        </div>
      </main>
    );
  }

  // Group volunteers by section
  const sections = volunteers.reduce((acc, volunteer) => {
    const section = volunteer.sectionTitle || "Volunteers";
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(volunteer);
    return acc;
  }, {} as Record<string, Volunteer[]>);

  return (
    <main className="min-h-screen bg-white dark:bg-[#1a1a1a]">
      <section className="relative h-[60vh] flex items-center justify-center text-center bg-black">
        <div className="relative z-10 max-w-4xl px-6">
          <div className="inline-block bg-[#D4A017] text-black px-4 py-1 text-xs font-bold uppercase tracking-widest mb-4">
            Get Involved
          </div>
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6">
            Volunteer Opportunities
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Join us in making a difference. Your time and skills can transform lives.
          </p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          {volunteers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-stone-600 dark:text-stone-400 text-lg">
                No volunteers found. Please check back later.
              </p>
            </div>
          ) : (
            Object.entries(sections).map(([sectionTitle, sectionVolunteers]) => (
              <div key={sectionTitle} className="mb-16">
                <h2 className="font-serif text-3xl font-bold text-black dark:text-white mb-8 border-b-2 border-[#D4A017] pb-2 inline-block">
                  {sectionTitle}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {sectionVolunteers.map((volunteer) => (
                    <article
                      key={volunteer.id}
                      className="group bg-white dark:bg-[#2a2a2a] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-stone-200 dark:border-stone-700"
                    >
                      <div className="relative h-64 bg-stone-100 dark:bg-stone-800 overflow-hidden">
                        {volunteer.img ? (
                          <img
                            src={getImageUrl(volunteer.img, "/assets/logo.png")}
                            alt={volunteer.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg
                              className="w-16 h-16 text-stone-400 dark:text-stone-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M14 20c-2.987 0-5.74-1.42-7.5-3.57"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="font-serif text-xl font-bold text-black dark:text-white mb-1">
                          {volunteer.name}
                        </h3>
                        {volunteer.role && (
                          <p className="text-[#D4A017] font-medium text-sm mb-3">
                            {volunteer.role}
                          </p>
                        )}
                        <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed line-clamp-4">
                          {volunteer.bio}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))
          )}
          
          <div className="mt-12 flex gap-4 justify-center">
            <Link href="/programs" className="px-6 py-3 bg-[#D4A017] text-black font-bold">
              View All Programs
            </Link>
            <Link href="/donate" className="px-6 py-3 border border-[#D4A017] text-[#D4A017] font-bold">
              Donate Now
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}