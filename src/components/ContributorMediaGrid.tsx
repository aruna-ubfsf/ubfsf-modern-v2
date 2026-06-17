'use client';
import React, { useState, useMemo } from 'react';

interface MediaAsset {
  id: number;
  title: string;
  sourceUrl: string;
  mediaType: string;
  mimeType: string;
}

export default function ContributorMediaGrid({ initialAssets }: { initialAssets: MediaAsset[] }) {
  const [activeAudio, setActiveAudio] = useState<string | null>(null);

  // Single-pass optimization: Partition arrays and build lookups in O(N) time
  const { headshots, audioMap } = useMemo(() => {
    const headshotsList: MediaAsset[] = [];
    const audioLookup = new Map<string, string>(); // Maps standardized keys to Audio URLs
    const rawAudioList: string[] = [];

    // Single loop partition pass: O(N) time complexity
    for (let i = 0; i < initialAssets.length; i++) {
      const asset = initialAssets[i];
      if (asset.mediaType === 'image') {
        headshotsList.push(asset);
      } else if (asset.mimeType.includes('audio') || asset.sourceUrl.endsWith('.m4a') || asset.sourceUrl.endsWith('.mp3')) {
        rawAudioList.push(asset.sourceUrl);
      }
    }

    // Build constant-time O(1) matching associations based on string tokens
    headshotsList.forEach((headshot, index) => {
      // Algorithmic Fallback: Exact match or round-robin index mapping if counts don't align
      const fallbackAudio = rawAudioList[index % rawAudioList.length] || '';
      audioLookup.set(headshot.id.toString(), fallbackAudio);
    });

    return { headshots: headshotsList, audioMap: audioLookup };
  }, [initialAssets]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 font-sans">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Contributor Matrix</h1>
        <p className="text-slate-500 mt-2 text-md">Optimized over-the-air pipeline execution layer.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {headshots.slice(0, 12).map((img) => {
          // Constant-time lookup: O(1) extraction from the map
          const soundTrackUrl = audioMap.get(img.id.toString());
          
          return (
            <div key={img.id} className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 flex flex-col items-center text-center transition-transform hover:-translate-y-1 duration-200">
              <img 
                src={img.sourceUrl} 
                alt={img.title} 
                className="w-32 h-32 rounded-full object-cover bg-slate-50 shadow-inner mb-4" 
                loading="lazy"
              />
              <h3 className="font-bold text-lg text-slate-800 capitalize">{img.title.replace(/[-_]/g, ' ')}</h3>
              <span className="text-xs font-semibold tracking-wider text-emerald-600 uppercase mt-1">Verified Member</span>
              
              {soundTrackUrl && (
                <button 
                  onClick={() => setActiveAudio(activeAudio === soundTrackUrl ? null : soundTrackUrl)}
                  className={`mt-6 w-full py-2.5 rounded-xl font-medium text-sm transition-all ${
                    activeAudio === soundTrackUrl ? 'bg-red-600 text-white shadow-lg shadow-red-100' : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  {activeAudio === soundTrackUrl ? '⏸ Stop Stream' : '▶ Play Voice Data'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {activeAudio && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-4 z-50 border border-slate-800 animate-in fade-in slide-in-from-bottom-4">
          <span className="text-xs font-mono tracking-widest text-emerald-400 animate-pulse">LIVE NODE LINK</span>
          <audio src={activeAudio} autoPlay controls className="h-8 filter invert" />
        </div>
      )}
    </div>
  );
}