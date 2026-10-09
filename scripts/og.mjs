// Renders public/og.png (1200x630) from the name and headline in the home content.
// Usage: node scripts/og.mjs   (rerun after changing the headline)
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const yaml = readFileSync('src/content/home/en.yaml', 'utf8');
const pick = (key) => yaml.match(new RegExp(`^\\s+${key}: "(.*)"$`, 'm'))[1];
const name = pick('name');
const headline = pick('headline');
const availability = pick('availability');
const font = (p) => `data:font/woff2;base64,${readFileSync(resolve('node_modules', p)).toString('base64')}`;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: Inter; src: url(${font('@fontsource-variable/inter/files/inter-latin-wght-normal.woff2')}); font-weight: 100 900; }
@font-face { font-family: Mono; src: url(${font('@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2')}); font-weight: 100 900; }
* { margin: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; background: #fafaf8; color: #16171b; font-family: Inter; padding: 80px 88px; display: flex; flex-direction: column; }
.top { display: flex; align-items: center; gap: 16px; font: 500 22px Mono; color: #565a63; }
.mark { width: 44px; height: 44px; border-radius: 10px; background: #0b6e64; color: #fff; display: grid; place-items: center; font: 700 19px Mono; }
h1 { margin-top: auto; font-size: 92px; font-weight: 650; letter-spacing: -0.035em; line-height: 1; }
p { margin-top: 28px; font-size: 38px; line-height: 1.25; color: #3d4048; max-width: 960px; letter-spacing: -0.01em; }
.bar { margin-top: 48px; height: 4px; width: 72px; background: #0b6e64; }
</style></head><body>
<div class="top"><div class="mark">YZ</div>${availability}</div>
<h1>${name}</h1><p>${headline}</p><div class="bar"></div>
</body></html>`;

const browser = await chromium.launch({ channel: process.env.PW_CHANNEL ?? 'chrome' });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: 'public/og.png' });
await browser.close();
console.log('Wrote public/og.png');
