import { getEntry } from 'astro:content';

export const LOCALE = 'en';

export async function getUi() {
  const entry = await getEntry('ui', LOCALE);
  if (!entry) throw new Error(`Missing UI strings for ${LOCALE}`);
  return entry.data;
}

export async function getDiagram(id: string) {
  const entry = await getEntry('diagrams', LOCALE);
  const d = entry?.data[id];
  if (!d) throw new Error(`Missing diagram labels: ${id}`);
  return d;
}

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Inline Markdown for short strings in YAML: **bold**, `code`, [text](href), and TODO(yasmine) markers. */
export function md(s: string): string {
  return escape(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a class="link" href="$2">$1</a>')
    .replace(/(TODO\(yasmine\):[^<]*)/g, '<span class="todo">$1</span>');
}
