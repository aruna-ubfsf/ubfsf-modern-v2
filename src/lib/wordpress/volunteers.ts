// src/lib/wordpress/volunteers.ts
import { API_URL, getAuthHeader, cleanWPContent } from "./client";

export interface Volunteer {
  id: number;
  name: string;
  role: string;
  bio: string;
  img: string;
  sectionTitle: string;
}

export interface VolunteerPageData {
  id: number;
  title: string;
  slug: string;
  content: string;
  featuredImageUrl: string | null;
  featuredImageAlt: string;
  volunteers: Volunteer[];
}

const VOLUNTEER_PAGE_SLUGS = {
  volunteers: "volunteer-opportunities",
} as const;

const VOLUNTEER_SECTIONS = new Set([
  "volunteers",
  "volunteer",
  "volunteer opportunities",
  "our volunteers",
  "volunteer team",
  "team",
]);

const SKIP_HEADINGS = new Set([
  "position to be filled",
  "pending",
  "join our newsletter",
  "united black family scholarship foundation",
  "volunteer opportunities",
  "volunteer",
]);

function decodeWPEntities(content: string): string {
  if (!content) return "";
  return content
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&/g, "&")
    .replace(/&#038;/g, "&")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8243;/g, '"')
    .replace(/&#8242;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&lsquo;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/^["']+|["']+$/g, "")
    .trim();
}

function stripHtml(html: string): string {
  return decodeWPEntities(
    html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
  );
}

function normalizeHeading(value: string): string {
  return decodeWPEntities(value).replace(/\s+/g, " ").trim();
}

function isVolunteerSection(name: string): boolean {
  const key = name.toLowerCase();
  return VOLUNTEER_SECTIONS.has(key) || key.includes("volunteer");
}

function shouldSkipHeading(name: string): boolean {
  const key = name.toLowerCase();
  return SKIP_HEADINGS.has(key) || key.includes("position to be filled");
}

function splitNameAndRole(raw: string): { name: string; role: string } {
  const cleaned = normalizeHeading(raw);
  if (cleaned.includes("|")) {
    const [namePart, ...roleParts] = cleaned.split("|");
    return { name: namePart.trim(), role: roleParts.join("|").trim() };
  }
  // Some WP entries use "Name I Role" (capital i) instead of "|"
  const iSep = cleaned.match(/^(.+?)\s+I\s+(.+)$/);
  if (iSep) {
    return { name: iSep[1].trim(), role: iSep[2].trim() };
  }
  return { name: cleaned, role: "" };
}

function extractBioFromHtml(html: string): string {
  const textInners = [
    ...html.matchAll(/et_pb_text_inner[^>]*>([\s\S]*?)<\/div>\s*<\/div>/gi),
  ];
  if (textInners.length > 0) {
    return stripHtml(textInners.map((m) => m[1]).join("\n\n"));
  }
  const teamDesc = html.match(
    /et_pb_team_member_description[\s\S]*?<div>([\s\S]*?)<\/div>\s*<\/div>/i
  );
  if (teamDesc?.[1]) return stripHtml(teamDesc[1]);
  return [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((m) => stripHtml(m[1]))
    .filter((t) => t.length > 20)
    .join("\n\n");
}

function extractImageFromHtml(html: string): string {
  const imgs = [...html.matchAll(/<img[^>]+src=["'](https?:\/\/[^"']+)["']/gi)];
  for (const match of imgs) {
    const cleaned = cleanImageUrl(match[1]);
    if (cleaned) return cleaned;
  }
  return "";
}

function extractHeadingFromBlock(block: string): {
  raw: string;
  suffix: string;
} {
  const prefix = block.match(
    /dg_adh_heading[\s\S]{0,400}?class="prefix">([^<]*)/i
  )?.[1];
  const suffix =
    block.match(
      /dg_adh_heading[\s\S]{0,600}?class="suffix">([^<]*)/i
    )?.[1] || "";
  if (prefix) {
    return {
      raw: normalizeHeading(prefix),
      suffix: normalizeHeading(suffix).replace(/^[|I]\s*/, "").trim(),
    };
  }

  const heading = block.match(
    /et_pb_heading[\s\S]{0,300}?et_pb_module_heading">([^<]+)/i
  )?.[1];
  if (heading) return { raw: normalizeHeading(heading), suffix: "" };

  const teamHeader = block.match(
    /et_pb_team_member[\s\S]{0,400}?et_pb_module_header">([^<]+)/i
  )?.[1];
  if (teamHeader) return { raw: normalizeHeading(teamHeader), suffix: "" };

  return { raw: "", suffix: "" };
}

function cleanImageUrl(src: string): string {
  if (!src) return "";
  let url = decodeWPEntities(src).replace(/&/g, "&");
  url = url.replace(/^https:\/\/i[0-9]\.wp\.com\//, "https://");
  url = url.replace(/\?.*$/, "");
  if (url.includes("UBFSF-logo") || url.includes("logo_clr")) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/")) return `${API_URL}${url}`;
  return "";
}

function addVolunteer(
  volunteers: Omit<Volunteer, "id">[],
  member: Omit<Volunteer, "id">
) {
  if (!member.name || member.bio.length < 20) return;
  if (member.bio.toLowerCase() === "pending") return;
  if (shouldSkipHeading(member.name)) return;
  if (isVolunteerSection(member.name)) return;
  if (
    !volunteers.some(
      (existing) => existing.name.toLowerCase() === member.name.toLowerCase()
    )
  ) {
    volunteers.push(member);
  }
}

function defaultRoleForSection(defaultSection: string): string {
  return "Volunteer";
}

/**
 * Parse volunteer data from Divi page content
 * Supports the same layouts as staff parsing:
 * 1. Advanced Heading (dg_adh_heading) + text + image columns
 * 2. Standard Heading (et_pb_heading) + text
 * 3. Team Member module (et_pb_team_member)
 */
export function parseVolunteersFromDivi(
  content: string,
  defaultSection = "Volunteers"
): Omit<Volunteer, "id">[] {
  const volunteers: Omit<Volunteer, "id">[] = [];
  if (!content) return volunteers;

  let currentSection = defaultSection;
  let pendingRole = "";
  const fallbackRole = defaultRoleForSection(defaultSection);

  const rowBlocks = content.split(/(?=<div class="[^"]*et_pb_row)/g);

  for (const row of rowBlocks) {
    const columns = row.split(/(?=<div class="[^"]*et_pb_column)/g);
    let rowImage = "";

    for (const col of columns) {
      const imgInCol = extractImageFromHtml(col);
      if (imgInCol) rowImage = imgInCol;

      // Team member modules are self-contained
      const teamContainers = [
        ...col.matchAll(
          /<div[^>]*class="[^"]*et_pb_team_member[^"]*"[^>]*>[\s\S]*?<\/div>\s*<\/div>/gi
        ),
      ];
      for (const match of teamContainers) {
        const containerHtml = match[0];
        const { raw, suffix } = extractHeadingFromBlock(containerHtml);
        if (!raw) continue;

        if (shouldSkipHeading(raw)) {
          pendingRole = "";
          continue;
        }
        if (isVolunteerSection(raw)) {
          currentSection = raw;
          pendingRole = "";
          continue;
        }

        const bio = extractBioFromHtml(containerHtml);
        const img = extractImageFromHtml(containerHtml) || rowImage;
        const { name: namePart, role: roleFromName } = splitNameAndRole(raw);
        const roleFromSuffix = suffix.replace(/^[|I]\s*/, "").trim();

        addVolunteer(volunteers, {
          name: namePart,
          role:
            roleFromName || roleFromSuffix || pendingRole || fallbackRole,
          bio,
          img,
          sectionTitle: currentSection,
        });
        pendingRole = "";
      }

      if (teamContainers.length > 0) continue;

      // Advanced / standard headings (most of the roster)
      const headingBlocks: RegExpMatchArray[] = [
        ...col.matchAll(
          /<div[^>]*class="[^"]*(?:dg_adh_heading|et_pb_heading)[^"]*"[^>]*>[\s\S]*?<\/div>\s*<\/div>/gi
        ),
      ];

      // Fallback: prefix span may exist even if outer div regex fails
      if (headingBlocks.length === 0 && /class="prefix">/i.test(col)) {
        // Create a minimal match array-like object with the full column as the match
        const fallbackMatch = [col] as unknown as RegExpMatchArray;
        headingBlocks.push(fallbackMatch);
      }

      for (const match of headingBlocks) {
        const block = match[0];
        const { raw, suffix } = extractHeadingFromBlock(block);
        if (!raw) continue;

        const displayRaw = suffix ? `${raw} | ${suffix}` : raw;
        const bio = extractBioFromHtml(col);

        // Skip nav/footer labels before treating anything as a section
        if (shouldSkipHeading(raw)) {
          pendingRole = "";
          continue;
        }

        if (isVolunteerSection(raw) || isVolunteerSection(displayRaw)) {
          currentSection = isVolunteerSection(raw) ? raw : displayRaw;
          pendingRole = "";
          continue;
        }

        // Role-only label (no bio in this column): apply to the next person
        if (bio.length < 20) {
          pendingRole = splitNameAndRole(displayRaw).role || raw;
          continue;
        }

        const { name: namePart, role: roleFromName } =
          splitNameAndRole(displayRaw);
        const roleFromSuffix = suffix.replace(/^[|I]\s*/, "").trim();
        const img = extractImageFromHtml(col) || rowImage;

        addVolunteer(volunteers, {
          name: namePart,
          role:
            roleFromName || roleFromSuffix || pendingRole || fallbackRole,
          bio,
          img,
          sectionTitle: currentSection,
        });
        pendingRole = "";
      }
    }
  }

  return volunteers;
}

async function fetchPublicPageHtml(slug: string): Promise<string> {
  try {
    const res = await fetch(`${API_URL}/${slug}/`, {
      headers: { Accept: "text/html", "User-Agent": "UBFSF-Next/1.0" },
      next: { revalidate: 3600 },
    });
    return res.ok ? await res.text() : "";
  } catch {
    return "";
  }
}

async function fetchPageMeta(slug: string) {
  try {
    const res = await fetch(
      `${API_URL}/wp-json/wp/v2/pages?slug=${slug}&_embed`,
      {
        headers: getAuthHeader(),
        next: { revalidate: 3600 },
      }
    );
    return res.ok ? (await res.json())?.[0] : null;
  } catch {
    return null;
  }
}

export async function getVolunteerPage(
  slug: string,
  defaultSection = "Volunteers"
): Promise<VolunteerPageData | null> {
  try {
    const [meta, publicHtml] = await Promise.all([
      fetchPageMeta(slug),
      fetchPublicPageHtml(slug),
    ]);

    // Public HTML includes rendered <img> tags; REST is a fallback
    const restContent = meta?.content?.rendered || "";
    const content = publicHtml || restContent;

    if (!content && !meta) return null;

    const parsed = parseVolunteersFromDivi(content, defaultSection);
    const volunteers = parsed.map((member, index) => ({
      ...member,
      id: (meta?.id || 0) * 1000 + index + 1,
    }));

    return {
      id: meta?.id || 0,
      title: cleanWPContent(meta?.title?.rendered || defaultSection),
      slug: meta?.slug || slug,
      content: content,
      featuredImageUrl:
        meta?._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null,
      featuredImageAlt:
        meta?._embedded?.["wp:featuredmedia"]?.[0]?.alt_text || "",
      volunteers,
    };
  } catch (error) {
    console.error(`Error fetching volunteer page ${slug}:`, error);
    return null;
  }
}

export async function getVolunteers(): Promise<Volunteer[]> {
  return (await getVolunteerPage(VOLUNTEER_PAGE_SLUGS.volunteers))?.volunteers || [];
}

export async function getVolunteerPageData(): Promise<VolunteerPageData | null> {
  return getVolunteerPage(VOLUNTEER_PAGE_SLUGS.volunteers, "Volunteers");
}