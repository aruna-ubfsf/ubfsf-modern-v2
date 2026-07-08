import { getPageBySlug } from '@/lib/wordpress';

export default async function ContactPage() {
  const page = await getPageBySlug('contact-ubfsf') || await getPageBySlug('contact');

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      <header className="bg-ubfsf-zinc text-white py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter">Contact</h1>
          <div className="h-2 w-24 bg-ubfsf-gold mt-10"></div>
        </div>
      </header>
      <section className="max-w-5xl mx-auto py-20 px-6 grid md:grid-cols-2 gap-20">
        <div 
          className="prose prose-zinc dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: page?.content || "Contact information loading..." }} 
        />
        <div className="bg-zinc-50 dark:bg-zinc-900 p-10 border border-zinc-100 dark:border-zinc-800">
           <h3 className="font-black uppercase tracking-widest text-xs mb-8">Inquiry Form</h3>
        </div>
      </section>
    </main>
  );
}
