import React from 'react';
import { fetchLiveMediaLibrary } from '../../lib/wordpress';
import ContributorMediaGrid from '../../components/ContributorMediaGrid';

// Force the runtime engine to fetch live updates from the cloud endpoint dynamically
export const revalidate = 300; 

export default async function ContributorsPage() {
  // Feed live database markers over-the-air from the headless layer
  const liveAssets = await fetchLiveMediaLibrary();

  return (
    <main className="min-h-screen bg-slate-50/50 py-8">
      <ContributorMediaGrid initialAssets={liveAssets} />
    </main>
  );
}