import { API_URL, getAuthHeader, cleanWPContent } from './client';

export async function getPrograms() {
  try {
    const res = await fetch(`${API_URL}/wp-json/wp/v2/pages?slug=programs&_embed`, {
      headers: getAuthHeader(),
      next: { revalidate: 3600 }
    });
    const data = await res.json();
    return data.map((program: any) => ({
      id: program.id,
      title: cleanWPContent(program.title.rendered),
      description: cleanWPContent(program.content.rendered),
    }));
  } catch (e) {
    return [];
  }
}
