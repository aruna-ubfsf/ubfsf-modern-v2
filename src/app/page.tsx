import Link from "next/link";

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center flex flex-col items-center justify-center min-h-[70vh]">
      <span className="text-xs font-bold tracking-widest text-brand-gold uppercase bg-brand-black text-white px-3 py-1 rounded mb-6">
        Platform Launch Matrix
      </span>
      
      <h1 className="text-4xl md:text-6xl font-black tracking-tight text-brand-black mb-6 uppercase">
        United Black Family <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-yellow-600">
          Scholarship Foundation
        </span>
      </h1>
      
      <p className="text-slate-600 text-lg max-w-xl mx-auto mb-10 leading-relaxed font-sans normal-case">
        Welcome to the modernized media archive pipeline. Access verified high-fidelity assets, 
        contributor matrix lookups, and edge-cached streaming audio data natively.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link 
          href="/contributors" 
          className="w-full sm:w-auto px-8 py-4 bg-brand-black text-white font-bold rounded-xl tracking-wide shadow-lg hover:bg-brand-gray transition-all uppercase text-sm"
        >
          Enter Media Matrix
        </Link>
        <a 
          href="https://ubfsf.org/" 
          target="_blank" 
          rel="noreferrer"
          className="w-full sm:w-auto px-8 py-4 bg-white text-brand-black border-2 border-brand-black font-bold rounded-xl tracking-wide hover:bg-slate-50 transition-all uppercase text-sm"
        >
          Official Portal
        </a>
      </div>
    </div>
  );
}