// src/app/programs/writing-beyond-the-prison/page.tsx
import Image from "next/image";
import Link from "next/link";
import { getPageBySlug } from "@/lib/wordpress/pages";
import { getWpImageUrl } from "@/lib/wordpress/client";

export default async function WritingBeyondThePrisonPage() {
  // Try to get the page from WordPress if it exists
  const page = await getPageBySlug('writing-beyond-the-prison');
  
  // If page exists in WordPress, use that content
  // Otherwise, use the provided data
  const pageData = {
    title: "Writing Beyond the Prison",
    description: "Writing Beyond the Prison: A Struggle for Freedom is a feature-length documentary that tells the story of Ivan Kilgore, an incarcerated writer and legal scholar whose journey into writing began while facing the death penalty and has continued through decades of incarceration.",
    featuredImage: null
  };

  // If WordPress page exists, use its data
  const content = page || pageData;

  // Project data from the provided information
  const projectData = {
    title: "Writing Beyond the Prison: A Struggle for Freedom",
    type: "Documentary Film",
    fundraisingGoal: "$500,000",
    goalDueDate: "August 1, 2026",
    description: "A feature-length documentary that tells the story of Ivan Kilgore, an incarcerated writer and legal scholar whose journey into writing began while facing the death penalty and has continued through decades of incarceration. The film uses a hybrid documentary style—combining cinéma vérité footage, archival materials, and narration drawn from Ivan's own writings—to create an intimate, character-driven narrative.",
    needs: "The proposed documentary builds directly on the ongoing work of Zo Media Productions and the United Black Family Scholarship Foundation (UBFSF), which already amplify incarcerated voices through writing, academic partnerships, and media projects. Currently, Ivan Kilgore's writing is being produced, published, and taught in universities, while also informing advocacy and public discourse around incarceration. Additionally, a teaser reel has already been completed, and partnerships with scholars, students, and institutions are actively in place. However, funding is needed to scale this existing work into a full-length, high-impact documentary film. Resources will support filming during a critical legal window, capturing real-time developments in Ivan's case, and expanding production, editing, and distribution capacity.",
    successCriteria: [
      "Centers an incarcerated intellectual as both subject and narrative voice",
      "Integrates writing as a core storytelling mechanism (letters, essays, legal documents)",
      "Captures a rare, time-sensitive moment—potential release following decades of incarceration",
      "Completion and distribution of the feature-length documentary",
      "Screenings at universities, cultural institutions, and community organizations",
      "Engagement from target audiences (students, educators, policymakers, justice advocates)",
      "Integration into academic curricula and public discourse",
      "Measurable audience reach through screenings and digital platforms"
    ],
    objectives: [
      "Amplify the intellectual and creative contributions of incarcerated individuals",
      "Bridge gaps between academia, advocacy, and lived experience through storytelling",
      "Develop an educational and impact campaign that supports dialogue on mass incarceration and justice reform",
      "Document Ivan Kilgore's lived experience and legal journey during a critical period of potential release",
      "Produce a 90-minute feature documentary highlighting the transformative power of writing in prison"
    ],
    activities: [
      { title: "Film Production", description: "Capture observational footage, interviews, and real-time developments related to Ivan's legal case (8–12 months)" },
      { title: "Narrative Development", description: "Integrate Ivan's writings (letters, essays, legal filings) as voiceover and narrative structure" },
      { title: "Archival & Visual Research", description: "Collect court documents, historical materials, and prison-related media to provide context" },
      { title: "Interviews & Collaboration", description: "Engage students, scholars, journalists, and advocacy partners" },
      { title: "Post-Production", description: "Editing, sound design, and finalization of the feature-length film" },
      { title: "Distribution & Outreach", description: "Organize university screenings, community events, and digital distribution partnerships" },
      { title: "Educational Resource Development", description: "Create discussion guides, curriculum modules, and writing prompts to accompany the film" }
    ],
    impactMetrics: [
      "Number of screenings at universities and community organizations",
      "Audience reach through digital platforms",
      "Integration into academic curricula",
      "Engagement from policymakers and justice advocates",
      "Public discourse and media coverage"
    ],
  };

  return (
    <main className="min-h-screen bg-white dark:bg-[#1a1a1a] text-black dark:text-[#f4f4f4] transition-colors duration-300 font-serif">
      
      {/* HERO SECTION */}
      <header className="relative h-[50vh] flex items-end pb-20 px-6 md:px-20 overflow-hidden border-b border-black/10 dark:border-white/10">
        {content.featuredImageUrl && (
          <div className="absolute inset-0 z-0">
            <Image 
              src={content.featuredImageUrl} 
              alt={content.title}
              fill
              className="object-cover opacity-20 grayscale"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#1a1a1a] to-transparent" />
          </div>
        )}
        
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <span className="inline-block bg-[#FFB81C] text-black px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            UBFSF Initiative
          </span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85] mb-4">
            Writing Beyond <span className="text-[#FFB81C]">the Prison</span>
          </h1>
          <p className="text-lg md:text-xl text-stone-600 dark:text-stone-400 max-w-3xl font-light leading-relaxed">
            A feature-length documentary following Ivan Kilgore's journey from death row to becoming a prolific writer, thinker, and mentor.
          </p>
        </div>
      </header>

      {/* CONTENT SECTION */}
      <section className="max-w-7xl mx-auto py-16 px-6 md:px-20">
        
        {/* Project Summary */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-stone-50 dark:bg-[#2a2a2a] p-6 rounded-2xl border border-black/5 dark:border-white/5 text-center">
              <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider font-bold">Project Type</p>
              <p className="text-lg font-bold text-[#FFB81C]">{projectData.type}</p>
            </div>
            <div className="bg-stone-50 dark:bg-[#2a2a2a] p-6 rounded-2xl border border-black/5 dark:border-white/5 text-center">
              <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider font-bold">Fundraising Goal</p>
              <p className="text-lg font-bold text-[#FFB81C]">{projectData.fundraisingGoal}</p>
            </div>
            <div className="bg-stone-50 dark:bg-[#2a2a2a] p-6 rounded-2xl border border-black/5 dark:border-white/5 text-center">
              <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider font-bold">Goal Due Date</p>
              <p className="text-lg font-bold text-[#FFB81C]">{projectData.goalDueDate}</p>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-lg">
              {projectData.description}
            </p>
          </div>
        </div>

        {/* Why This Project Matters */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center border-b border-black/10 dark:border-white/10 pb-4">
            Why This Project Matters
          </h2>
          <div className="bg-stone-50 dark:bg-[#2a2a2a] p-8 rounded-2xl border border-black/5 dark:border-white/5">
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
              {projectData.needs}
            </p>
          </div>
        </div>

        {/* Success Criteria */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center border-b border-black/10 dark:border-white/10 pb-4">
            What Makes This Project Unique
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {projectData.successCriteria.slice(0, 3).map((criteria, i) => (
              <div key={i} className="bg-stone-50 dark:bg-[#2a2a2a] p-4 rounded-xl border border-black/5 dark:border-white/5 flex items-start gap-3">
                <span className="text-[#FFB81C] text-xl">✦</span>
                <span className="text-stone-600 dark:text-stone-400">{criteria}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Objectives */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center border-b border-black/10 dark:border-white/10 pb-4">
            Project Objectives
          </h2>
          <div className="space-y-3">
            {projectData.objectives.map((objective, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-stone-50 dark:bg-[#2a2a2a] rounded-xl border border-black/5 dark:border-white/5">
                <span className="text-[#FFB81C] font-bold text-lg min-w-[24px]">{i + 1}.</span>
                <span className="text-stone-600 dark:text-stone-400">{objective}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Project Activities */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center border-b border-black/10 dark:border-white/10 pb-4">
            Project Activities
          </h2>
          <div className="space-y-4">
            {projectData.activities.map((activity, i) => (
              <div key={i} className="bg-stone-50 dark:bg-[#2a2a2a] p-6 rounded-xl border border-black/5 dark:border-white/5">
                <h3 className="text-lg font-bold text-[#FFB81C] mb-2">{activity.title}</h3>
                <p className="text-stone-600 dark:text-stone-400">{activity.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Metrics */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center border-b border-black/10 dark:border-white/10 pb-4">
            Impact Metrics
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {projectData.impactMetrics.map((metric, i) => (
              <div key={i} className="bg-stone-50 dark:bg-[#2a2a2a] p-4 rounded-xl border border-black/5 dark:border-white/5 flex items-center gap-3">
                <span className="text-[#FFB81C] text-xl">✦</span>
                <span className="text-stone-600 dark:text-stone-400">{metric}</span>
              </div>
            ))}
          </div>
        </div>

       
        
        {/* ACTION FOOTER */}
        <div className="mt-16 pt-16 border-t border-black/10 dark:border-white/10 flex flex-wrap gap-8 items-center justify-center">
          <Link 
            href="/donate" 
            className="px-10 py-5 bg-[#FFB81C] text-black text-xs font-black uppercase tracking-widest hover:bg-yellow-500 transition-all"
          >
            Support This Project
          </Link>
          <p className="text-stone-500 font-bold uppercase tracking-widest text-[10px]">
            Help bring this story to the world.
          </p>
        </div>
      </section>
    </main>
  );
}