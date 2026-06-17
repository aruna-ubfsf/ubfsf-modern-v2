'use client';

import React, { useState } from 'react';

interface MediaAsset {
  id: number;
  title: string;
  sourceUrl: string;
  mediaType: string;
  mimeType: string;
}

interface ContributorGridProps {
  initialAssets: MediaAsset[];
}

export default function ContributorMediaGrid({ initialAssets }: ContributorGridProps) {
  const [activeAudioUrl, setActiveAudioUrl] = useState<string | null>(null);

  // Filter out headshots and audio components using precise pattern matching
  const profilePictures = initialAssets.filter(
    (asset) => asset.mediaType === 'image' && !asset.title.toLowerCase().includes('mug')
  );
  
  const audioTracks = initialAssets.filter(
    (asset) => asset.mimeType.includes('audio') || asset.sourceUrl.endsWith('.m4a') || asset.sourceUrl.endsWith('.mp3')
  );

  const handleTogglePlay = (audioUrl: string) => {
    if (activeAudioUrl === audioUrl) {
      setActiveAudioUrl(null); // Pause if clicking the currently playing file
    } else {
      setActiveAudioUrl(audioUrl); // Play selected file
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      <header className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Contributor Audio Profiles
        </h2>
        <p className="mt-4 text-lg text-slate-600">
          Stream live project audio testimonials and views over-the-air from our cloud repository.
        </p>
      </header>

      {/* Responsive Layout Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {profilePictures.slice(0, 6).map((pic, idx) => {
          // Dynamically map a corresponding audio clip if available from the stream queue
          const matchingAudio = audioTracks[idx] || audioTracks[0];

          return (
            <div 
              key={pic.id} 
              className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              {/* Media Card Headshot Window */}
              <div className="aspect-square w-full relative bg-slate-50 overflow-hidden">
                <img
                  src={pic.sourceUrl}
                  alt={pic.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Media Card Interactive Control Deck */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-800 line-clamp-1">
                  {pic.title.replace(/[-_]/g, ' ')}
                </h3>
                <p className="text-sm text-slate-500 mt-1 mb-4 uppercase tracking-wider font-medium">
                  Project Contributor
                </p>

                {matchingAudio ? (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => handleTogglePlay(matchingAudio.sourceUrl)}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                        activeAudioUrl === matchingAudio.sourceUrl
                          ? 'bg-red-600 text-white shadow-md shadow-red-100 hover:bg-red-700'
                          : 'bg-slate-900 text-white shadow-md shadow-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      {activeAudioUrl === matchingAudio.sourceUrl ? (
                        <>
                          <span className="animate-pulse">⏸</span> Pause Stream
                        </>
                      ) : (
                        <>
                          <span>▶</span> Play Testimony
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400 text-center italic">
                    Audio testimony loading...
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Central Embedded Global Audio Node Engine */}
      {activeAudioUrl && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl border border-slate-800 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300 z-50">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Streaming Audio</span>
            <span className="text-sm font-medium text-slate-100 truncate max-w-xs">
              {activeAudioUrl.split('/').pop()}
            </span>
          </div>
          <audio 
            src={activeAudioUrl} 
            autoPlay 
            controls 
            className="h-8 max-w-xs filter invert brightness-200"
            onEnded={() => setActiveAudioUrl(null)}
          />
        </div>
      )}
    </div>
  );
}