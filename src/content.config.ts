import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const link = z.object({ label: z.string(), href: z.string() });

// One file per locale: src/content/home/en.yaml (a French version would be fr.yaml).
const color = z.enum(['peach', 'mint', 'lilac', 'sky']);

// One file per locale: src/content/home/en.yaml (a French version would be fr.yaml).
const home = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/home' }),
  schema: z.object({
    meta: z.object({ title: z.string(), description: z.string() }),
    hero: z.object({
      greeting: z.string(),
      name: z.string(),
      photo_alt: z.string(),
      roles_prefix: z.string(),
      roles: z.array(z.string()),
      headline: z.string(),
      intro: z.string(),
      proof: z.array(z.object({ count: z.number(), suffix: z.string(), label: z.string(), color })),
      availability: z.string(),
      buttons: z.array(link),
    }),
    work: z.object({
      heading: z.string(),
      intro: z.string(),
      cards: z.array(
        z.object({
          slug: z.string(),
          color,
          kicker: z.string(),
          title: z.string(),
          logo: z.string().optional(),
          visual: z.object({
            kind: z.enum(['diagram', 'image', 'collage']),
            layout: z.enum(['side', 'stack']).optional(),
            id: z.string().optional(),
            src: z.string().optional(),
            alt: z.string(),
            images: z.array(z.object({ src: z.string(), alt: z.string(), position: z.string().optional(), fit: z.enum(['cover', 'contain']).optional(), bg: z.string().optional() })).optional(),
          }),
          summary: z.string(),
          badges: z.array(z.string()),
          proof: z.array(z.string()),
          stack: z.array(z.string()),
          cta: z.string(),
          links: z.array(link).optional(),
        }),
      ),
    }),
    looking: z.object({
      heading: z.string(),
      title: z.string(),
      text: z.string(),
      chips: z.array(z.object({ label: z.string(), color })),
    }),
    experience: z.object({
      heading: z.string(),
      items: z.array(
        z.object({ dates: z.string(), role: z.string(), org: z.string(), logo: z.string().optional(), color, text: z.string(), tags: z.array(z.string()) }),
      ),
    }),
    education: z.object({ heading: z.string(), school: z.string(), degree: z.string(), dates: z.string(), details: z.string() }),
    skills: z.object({
      heading: z.string(),
      intro: z.string(),
      groups: z.array(z.object({ name: z.string(), color, items: z.array(z.string()) })),
    }),
    contact: z.object({
      heading: z.string(),
      title: z.string(),
      text: z.string(),
      email: z.string(),
      copy_label: z.string(),
      copied_label: z.string(),
      links: z.array(link),
    }),
  }),
});

const work = defineCollection({
  loader: glob({ pattern: '*.mdx', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    order: z.number(),
    color,
    logo: z.string().optional(),
    facts: z.array(z.object({ label: z.string(), value: z.string() })),
    next: z.string(),
  }),
});

// Diagram labels, captions and alt text, so diagrams can be translated like the rest.
const diagrams = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/diagrams' }),
  schema: z.record(
    z.string(),
    z.object({ title: z.string(), caption: z.string(), alt: z.string(), labels: z.record(z.string(), z.any()) }),
  ),
});

// UI strings (nav, buttons, small labels), also per locale.
const ui = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/ui' }),
  schema: z.record(z.string(), z.string()),
});

// Blog posts: src/content/blog/<slug>.mdx, served at /blog/<slug>.
const blog = defineCollection({
  loader: glob({ pattern: '*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    subtitle: z.string().optional(),
    tags: z.array(z.string()).default([]),
    color: z.enum(['peach', 'mint', 'lilac', 'sky']).default('lilac'),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { home, work, diagrams, ui, blog };
