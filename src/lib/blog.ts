import { getCollection, type CollectionEntry } from 'astro:content';

/** Published posts, newest first. Drafts show in `npm run dev` only. */
export async function getPosts() {
  const posts = await getCollection('blog', (p) => import.meta.env.DEV || !p.data.draft);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function formatDate(d: Date) {
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

/** Rough reading time from the raw post body, at about 220 words a minute. */
export function readingMinutes(post: CollectionEntry<'blog'>) {
  const words = (post.body ?? '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
