// src/app/programs/hundred-stories/page.tsx
// Server component: fetches WordPress content at request time (no client "Loading..." flash)
import { getPageBySlug } from "@/lib/wordpress/pages";
import HundredStoriesClient from "./HundredStoriesClient";

export const revalidate = 60;

export const metadata = {
  title: "The Hundred Stories Project | UBFSF",
  description:
    "Empowering incarcerated writers to develop, publish, and receive compensation for their creative work.",
};

export default async function HundredStoriesPage() {
  const page = await getPageBySlug("hundred-stories-project");

  // Hero image: WordPress featured image, else first image in page content
  const heroImage =
    page?.featuredImageUrl ||
    page?.content?.match(/<img[^>]+src="([^"]+\.(?:jpg|jpeg|png|webp))"/i)?.[1] ||
    "";

  if (!page) {
    return (
      <main className="min-h-screen bg-white dark:bg-[#1a1a1a] flex items-center justify-center">
        <p className="text-stone-500">The Hundred Stories Project page could not be loaded.</p>
      </main>
    );
  }

  return (
    <HundredStoriesClient
      content={page.content || ""}
      title={page.title || ""}
      heroImage={heroImage}
    />
  );
}
