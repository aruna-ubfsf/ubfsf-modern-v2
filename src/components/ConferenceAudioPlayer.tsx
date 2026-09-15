import { AudioClip } from '@/lib/wordpress/parse-nonprofit-conference';

function getMimeFromSrc(src: string): string {
  const srcNoQuery = src.split('?')[0].split('#')[0].toLowerCase();
  const ext = srcNoQuery.match(/\.([a-z0-9]+)$/)?.[1];
  const map: Record<string, string> = {
    m4a: 'audio/mp4',
    aac: 'audio/aac',
    ogg: 'audio/ogg',
    oga: 'audio/ogg',
    opus: 'audio/ogg',
    wav: 'audio/wav',
    flac: 'audio/flac',
    mp3: 'audio/mpeg',
  };
  return ext && map[ext] ? map[ext] : 'audio/mpeg';
}

export default function ConferenceAudioPlayer({ clips }: { clips: AudioClip[] }) {
  if (!clips || clips.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {clips.map((clip, i) => {
        const mime = getMimeFromSrc(clip.src);
        return (
          <div key={i} className="rounded-lg border border-white/10 bg-[#1a1a1a] p-4">
            <div className="mb-2">
              <div className="text-sm text-stone-400">{clip.artist}</div>
              <div className="font-medium text-white">{clip.title || 'Audio clip'}</div>
            </div>
            <audio controls preload="metadata" className="w-full">
              <source src={clip.src} type={mime} />
              Your browser does not support the audio element.
            </audio>
          </div>
        );
      })}
    </div>
  );
}
