import Link from "next/link";
import { getHeadlessPageBySlug } from "@/lib/wordpress";

export default async function HomePage() {
  // Pull live layout arrays directly from the Headless CMS
  const pageData = await getHeadlessPageBySlug("home");

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 flex flex-col items-center">
      <span className="text-xs font-bold tracking-widest text-brand-gold uppercase bg-brand-black text-white px-3 py-1 rounded mb-6">
        Platform Launch Matrix
      </span>

      {/* Renders your live official title text directly */}
      <h1 className="text-4xl md:text-6xl font-black tracking-tight text-brand-black text-center mb-6 uppercase">
        {pageData?.title || "United Black Family Scholarship Foundation"}
      </h1>

      {/* Native Server Insertion: Outputs your layout copy directly while keeping standard styling */}
      {pageData?.content ? (
        <div 
          className="prose prose-slate max-w-xl mx-auto text-center text-slate-600 mb-10 font-sans normal-case leading-relaxed"
          dangerouslySetInnerHTML={{ __html: pageData.content }}
        />
      ) : (
        <p className="text-slate-600 text-lg max-w-xl mx-auto mb-10 text-center leading-relaxed font-sans normal-case">
          Welcome to the modernized media archive pipeline. Access verified high-fidelity assets, 
          contributor matrix lookups, and edge-cached streaming audio data natively.
        </p>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
        <Link 
          href="/contributors" 
          className="w-full sm:w-auto text-center px-8 py-4 bg-brand-black text-white font-bold rounded-xl tracking-wide shadow-lg hover:bg-brand-gray transition-all uppercase text-sm"
        >
          Enter Media Matrix
        </Link>
        <a 
          href="https://ubfsf.org/" 
          target="_blank" 
          rel="noreferrer"
          className="w-full sm:w-auto text-center px-8 py-4 bg-white text-brand-black border-2 border-brand-black font-bold rounded-xl tracking-wide hover:bg-slate-50 transition-all uppercase text-sm"
        >
          Official Portal
        </a>
      </div>
    </div>
  );
}