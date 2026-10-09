import type { ImageMetadata } from 'astro';

const all = import.meta.glob<{ default: ImageMetadata }>('/src/assets/**/*.{png,jpg,jpeg,webp,svg}', { eager: true });

/** Resolve "loopview/screenshot-cost.png" to the imported image, so it goes through Astro's image pipeline. */
export function image(src: string): ImageMetadata {
  const hit = tryImage(src);
  if (!hit) throw new Error(`Image not found in src/assets: ${src}`);
  return hit;
}

/** Same as image(), but returns undefined when the file isn't there yet (for placeholders). */
export function tryImage(src: string): ImageMetadata | undefined {
  return all[`/src/assets/${src}`]?.default;
}
