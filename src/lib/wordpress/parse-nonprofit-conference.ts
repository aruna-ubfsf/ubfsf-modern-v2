import { getWpImageUrl } from './client';

export interface AudioClip {
  src: string;
  title: string;
  artist: string;
}

export interface Panelist {
  name: string;
  image: string;
  clips: AudioClip[];
}

function decodeEntities(str: string) {
  return str
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&amp;/g, "&")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8243;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function attrValue(tag: string, name: string): string | null {
  const m = tag.match(new RegExp(`${name}\\s*=\\s*["']([^"']+)["']`, 'i'));
  return m ? decodeEntities(m[1]) : null;
}

export function parseConferenceContent(raw: string): { panelists: Panelist[] } {
  if (!raw) return { panelists: [] };

  const panelists: Panelist[] = [];

  // Find audio sections: [et_pb_section ... admin_label="Audio – Name" ...] ... [/et_pb_section]
  const sectionRegex = /\[et_pb_section[^\]]*admin_label\s*=\s*["']Audio\s*[-–]\s*([^"']+)["'][^\]]*\]([\s\S]*?)\[\/et_pb_section\]/gi;
  let secMatch: RegExpExecArray | null;
  while ((secMatch = sectionRegex.exec(raw)) !== null) {
    const nameRaw = secMatch[1].trim();
    const inner = secMatch[2];

    // First image in section
    const imgMatch = inner.match(/\[et_pb_image[^\]]*src\s*=\s*["']([^"']+)["'][^\]]*\]/i);
    const image = imgMatch ? getWpImageUrl(imgMatch[1]) : '';

    const clips: AudioClip[] = [];
    const audioRegex = /\[et_pb_audio[^\]]*audio\s*=\s*["']([^"']+)["'][^\]]*\]/gi;
    let audMatch: RegExpExecArray | null;
    while ((audMatch = audioRegex.exec(inner)) !== null) {
      const shortcode = audMatch[0];
      const src = attrValue(shortcode, 'audio') || '';
      const title = attrValue(shortcode, 'title') || '';
      const artist = attrValue(shortcode, 'artist_name') || nameRaw;
      if (src) {
        clips.push({ src, title, artist });
      }
    }

    if (clips.length > 0 || image) {
      panelists.push({
        name: decodeEntities(nameRaw),
        image,
        clips,
      });
    }
  }

  // Fallback: if no sections found, try to group audios by artist_name
  if (panelists.length === 0) {
    const audioRegex = /\[et_pb_audio[^\]]*audio\s*=\s*["']([^"']+)["'][^\]]*\]/gi;
    const map = new Map<string, { image: string; clips: AudioClip[] }>();
    let m: RegExpExecArray | null;
    while ((m = audioRegex.exec(raw)) !== null) {
      const shortcode = m[0];
      const src = attrValue(shortcode, 'audio') || '';
      const title = attrValue(shortcode, 'title') || '';
      const artist = attrValue(shortcode, 'artist_name') || '';
      if (!artist || !src) continue;
      if (!map.has(artist)) {
        map.set(artist, { image: '', clips: [] });
      }
      map.get(artist)!.clips.push({ src, title, artist });
    }
    // Try to find images for artists
    const imageRegex = /\[et_pb_image[^\]]*src\s*=\s*["']([^"']+)["'][^\]]*\]/gi;
    while ((m = imageRegex.exec(raw)) !== null) {
      const src = m[1];
      const before = raw.slice(0, m.index);
      const lastHeading = before.match(/admin_label\s*=\s*["']([^"']+)["']/i);
      if (lastHeading) {
        const possibleName = decodeEntities(lastHeading[1]);
        if (map.has(possibleName)) {
          map.get(possibleName)!.image = getWpImageUrl(src);
        }
      }
    }
    map.forEach((v, k) => {
      panelists.push({ name: k, image: v.image, clips: v.clips });
    });
  }

  return { panelists };
}
