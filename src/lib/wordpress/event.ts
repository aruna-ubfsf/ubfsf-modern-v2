import { API_URL, getAuthHeader, cleanWPContent } from './client';

export async function getEvents() {
  try {
    const res = await fetch(`${API_URL}/wp-json/wp/v2/posts?categories=EVENTS_ID`, {
      headers: getAuthHeader(),
      next: { revalidate: 600 }
    });
    const data = await res.json();
    return data.map((event: any) => ({
      id: event.id,
      title: cleanWPContent(event.title.rendered),
      date: event.date,
      location: event.acf?.location || "TBD"
    }));
  } catch (e) {
    return [];
  }
}
