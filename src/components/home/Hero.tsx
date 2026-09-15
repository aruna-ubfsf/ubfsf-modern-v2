// src/components/home/Hero.tsx
// Pure cinematic video hero — no added copy (content comes from WordPress sections below)
export default function Hero({ videoUrl }: { videoUrl?: string }) {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={videoUrl || 'https://ubfsf.org/wp-content/uploads/2023/04/ivan-headspin.mp4'} type="video/mp4" />
      </video>

      <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/60 animate-bounce z-10">
        <span className="text-[6px] md:text-[8px] uppercase tracking-[0.3em] font-semibold mb-2">Scroll to explore</span>
        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
