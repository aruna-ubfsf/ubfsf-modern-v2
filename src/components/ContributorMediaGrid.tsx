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

  // Algorithmic O(N) single-pass partition map
  const { headshots, audioMap } = useMemo(() => {
    const headshotsList: MediaAsset[] = [];
    const audioLookup = new Map<string, string>();
    const rawAudioList: string[] = [];

    for (let i = 0; i < initialAssets.length; i++) {
      const asset = initialAssets[i];
      if (asset.mediaType === 'image') {
        headshotsList.push(asset);
      } else if (asset.mimeType.includes('audio') || asset.sourceUrl.endsWith('.m4a') || asset.sourceUrl.endsWith('.mp3')) {
        rawAudioList.push(asset.sourceUrl);
      }
    }

    headshotsList.forEach((headshot, index) => {
      const fallbackAudio = rawAudioList[index % rawAudioList.length] || '';
      audioLookup.set(headshot.id.toString(), fallbackAudio);
    });

    return { headshots: headshotsList, audioMap: audioLookup };
  }, [initialAssets]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 font-sans selection:bg-brand-gold/30">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-brand-black tracking-tight">
          Contributor Matrix
        </h1>
        <p className="text-brand-black/70 mt-2 text-md font-medium normal-case">
          Unified Black Family Scholarship Foundation Media Portal
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {headshots.slice(0, 12).map((img) => {
          const soundTrackUrl = audioMap.get(img.id.toString());
          
          return (
            <div key={img.id} className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 flex flex-col items-center text-center transition-all hover:shadow-xl hover:-translate-y-1 duration-200">
              <img 
                src={img.sourceUrl} 
                alt={img.title} 
                className="w-32 h-32 rounded-full object-cover bg-slate-50 shadow-inner mb-4 border-2 border-brand-gold/20" 
                loading="lazy"
              />
              <h3 className="font-bold text-lg text-brand-black capitalize tracking-normal">
                {img.title.replace(/[-_]/g, ' ')}
              </h3>
              <span className="text-xs font-bold tracking-wider text-brand-gold uppercase mt-1">
                Verified Member
              </span>
              
              {soundTrackUrl && (
                <button 
                  onClick={() => setActiveAudio(activeAudio === soundTrackUrl ? null : soundTrackUrl)}
                  className={`mt-6 w-full py-2.5 rounded-xl font-medium text-sm tracking-wide transition-all duration-150 ${
                    activeAudio === soundTrackUrl 
                      ? 'bg-red-600 text-white shadow-lg shadow-red-100' 
                      : 'bg-brand-black text-white hover:bg-brand-gold hover:text-brand-black'
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
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-brand-black text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-4 z-50 border border-brand-gray animate-in fade-in slide-in-from-bottom-4">
          <span className="text-xs font-mono tracking-widest text-brand-gold animate-pulse font-bold">
            LIVE NODE LINK
          </span>
          <audio src={activeAudio} autoPlay controls className="h-8 filter invert" />
        </div>
      )}
    </div>
  );
}