import { WordPressMediaAsset } from "@/lib/wordpress";

interface Props {
  initialAssets: WordPressMediaAsset[];
}

export default function ContributorMediaGrid({ initialAssets }: Props) {
  if (!initialAssets || initialAssets.length === 0) {
    return <div className="p-10 text-center text-zinc-400">No media assets found in the matrix.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {initialAssets.map((asset) => (
        <div key={asset.id} className="group relative aspect-video bg-zinc-100 rounded-2xl overflow-hidden border border-zinc-200">
          <img 
            src={asset.sourceUrl} 
            alt={asset.title}
            className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
            <h3 className="text-white font-black uppercase text-sm tracking-widest">{asset.title}</h3>
            <p className="text-[#FFB81C] text-[10px] font-mono mt-1">{asset.mimeType}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
