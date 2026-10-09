// Full-page screenshots of every page at 375px and 1440px, light and dark, plus overflow checks.
// Usage: npm run build && npm run preview, then in another terminal: node scripts/screenshots.mjs
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const base = process.env.BASE_URL ?? 'http://localhost:4321';
const out = '.screenshots';
const pages = ['/', '/work/beekeeper', '/work/loopview', '/work/multi-agent-support', '/404'];
const widths = [375, 1440];
const themes = ['light', 'dark'];

mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: process.env.PW_CHANNEL ?? 'chrome' });
let problems = 0;

for (const theme of themes) {
  for (const width of widths) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: theme, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    for (const path of pages) {
      await page.goto(base + path, { waitUntil: 'networkidle' });
      // Scroll through the page so lazy images load, then show every revealed block.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForLoadState('networkidle');
      await page.evaluate(() => document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible')));
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (overflow > 0) {
        problems++;
        console.log(`OVERFLOW ${overflow}px  ${path} @${width} ${theme}`);
      }
      const name = `${path === '/' ? 'home' : path.replaceAll('/', '_').replace(/^_/, '')}-${width}-${theme}.png`;
      await page.screenshot({ path: `${out}/${name}`, fullPage: true });
    }
    await ctx.close();
  }
}
await browser.close();
console.log(problems ? `${problems} overflow problem(s)` : 'No horizontal overflow on any page.');
