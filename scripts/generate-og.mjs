import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import sharp from "sharp";

const ROOT = path.resolve(process.cwd());
const OUT_DIR = path.join(ROOT, "assets", "images", "og", "category");
const DATA_DIR = path.join(ROOT, "_data");
const TOOLS_DIR = path.join(ROOT, "_tools");

const WIDTH = 1200;
const HEIGHT = 630;
const SUPERSAMPLE = 2;
const RENDER_WIDTH = WIDTH * SUPERSAMPLE;
const RENDER_HEIGHT = HEIGHT * SUPERSAMPLE;

function escapeXml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function vocinoLogoSvg({ accent = "#00CCFF", inner = "#0F1419", width = 160 }) {
  const vbW = 250, vbH = 216;
  const h = Math.round((width * vbH) / vbW);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${h}" viewBox="0 0 250 216"><path d="M125 215.909L0 0L250 2.17954e-05L125 215.909Z" fill="${accent}"/><path d="M125 71.9697L83.3334 0L166.667 7.26513e-06L125 71.9697Z" fill="${inner}"/></svg>`;
}

function categoryOverlay({ title, subtitle, description, count }) {
  const safeTitle = escapeXml(title);
  const safeSub = escapeXml(subtitle);
  const safeDesc = escapeXml(description);
  const logo = vocinoLogoSvg({ accent: "#00CCFF", width: 140 * SUPERSAMPLE });
  const countBadge = `${count} tools`;
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${RENDER_WIDTH}" height="${RENDER_HEIGHT}" viewBox="0 0 ${RENDER_WIDTH} ${RENDER_HEIGHT}">
  <defs>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="rgba(0,0,0,0.10)"/>
      <stop offset="1" stop-color="rgba(0,0,0,0.55)"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#fade)"/>
  <!-- HUD corner accents -->
  <g stroke="rgba(0,204,255,0.35)" stroke-width="${2 * SUPERSAMPLE}" fill="none">
    <path d="M ${40*SUPERSAMPLE} ${40*SUPERSAMPLE} h ${24*SUPERSAMPLE} v 0 h 0 v ${24*SUPERSAMPLE}" />
    <path d="M ${RENDER_WIDTH-40*SUPERSAMPLE} ${RENDER_HEIGHT-40*SUPERSAMPLE} h ${-24*SUPERSAMPLE} v 0 h 0 v ${-24*SUPERSAMPLE}" />
  </g>
  <g transform="translate(${80*SUPERSAMPLE} ${80*SUPERSAMPLE})">
    ${logo}
    <g transform="translate(${200*SUPERSAMPLE} 12)">
      <text font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="${22*SUPERSAMPLE}" font-weight="600" letter-spacing="1" fill="rgba(230,237,243,0.9)">AI.TOOLS  //  VOCINO</text>
      <text y="${30*SUPERSAMPLE}" font-family="system-ui, sans-serif" font-size="${16*SUPERSAMPLE}" fill="rgba(107,119,133,0.9)">ai.vocino.com</text>
    </g>
  </g>
  <g transform="translate(${80*SUPERSAMPLE} ${260*SUPERSAMPLE})">
    <text font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="${56*SUPERSAMPLE}" font-weight="800" fill="rgba(255,255,255,0.96)">${safeTitle}</text>
    <text y="${70*SUPERSAMPLE}" font-family="system-ui, sans-serif" font-size="${26*SUPERSAMPLE}" font-weight="600" fill="#00CCFF">${safeSub}</text>
    <text y="${115*SUPERSAMPLE}" font-family="system-ui, sans-serif" font-size="${20*SUPERSAMPLE}" fill="rgba(155,167,180,0.92)">${safeDesc}</text>
  </g>
  <g transform="translate(${80*SUPERSAMPLE} ${RENDER_HEIGHT-90*SUPERSAMPLE})">
    <rect width="${170*SUPERSAMPLE}" height="${36*SUPERSAMPLE}" rx="${18*SUPERSAMPLE}" fill="rgba(0,204,255,0.14)" stroke="rgba(0,204,255,0.28)"/>
    <text x="${22*SUPERSAMPLE}" y="${24*SUPERSAMPLE}" font-family="system-ui, sans-serif" font-size="${16*SUPERSAMPLE}" font-weight="700" fill="#00CCFF">${escapeXml(countBadge)} — curated by Vocino</text>
  </g>
  <rect x="0" y="${RENDER_HEIGHT - 6*SUPERSAMPLE}" width="${RENDER_WIDTH}" height="${6*SUPERSAMPLE}" fill="#00CCFF" opacity="0.95"/>
</svg>`.trim();
}

async function buildBackground() {
  const base = sharp({ create: { width: RENDER_WIDTH, height: RENDER_HEIGHT, channels: 4, background: { r: 15, g: 20, b: 25, alpha: 1 } } });
  const bgSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${RENDER_WIDTH}" height="${RENDER_HEIGHT}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0B0F14"/><stop offset="1" stop-color="#151E29"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`;
  return base.composite([{ input: Buffer.from(bgSvg), top: 0, left: 0 }]);
}

async function renderOne({ title, subtitle, description, count, out }) {
  const bg = await buildBackground();
  const overlay = categoryOverlay({ title, subtitle, description, count });
  const bgPng = await bg.png().toBuffer();
  const overlayPng = await sharp(Buffer.from(overlay), { density: 72 }).resize(RENDER_WIDTH, RENDER_HEIGHT).png().toBuffer();
  const merged = await sharp(bgPng).composite([{ input: overlayPng, top: 0, left: 0 }]).png().toBuffer();
  await sharp(merged).resize(WIDTH, HEIGHT).png({ compressionLevel: 9 }).toFile(out);
}

async function main() {
  const args = process.argv.slice(2);
  const only = args.includes("--categories-only");
  await fs.mkdir(OUT_DIR, { recursive: true });

  const categoriesRaw = fsSync.readFileSync(path.join(DATA_DIR, "categories.yml"), "utf8");
  const categories = yaml.load(categoriesRaw);

  // count tools per category by scanning _tools front matter
  const files = fsSync.readdirSync(TOOLS_DIR).filter(f => f.endsWith(".md") && f !== "_template.md");
  const counts = {};
  for (const f of files) {
    const content = fsSync.readFileSync(path.join(TOOLS_DIR, f), "utf8");
    const m = content.match(/^---\n([\s\S]*?)\n---/);
    if (!m) continue;
    const fm = yaml.load(m[1]);
    if (!fm?.categories) continue;
    for (const c of fm.categories) counts[c] = (counts[c] || 0) + 1;
  }

  for (const cat of categories) {
    const count = counts[cat.slug] || 0;
    // skip generating if count 0 and not requested? still generate for completeness
    const out = path.join(OUT_DIR, `${cat.slug}.png`);
    if (fsSync.existsSync(out) && process.env.CI && !args.includes("--force")) {
      // in CI skip if exists unless forced — but for categories we want deterministic
    }
    const subtitle = "AI " + cat.label;
    await renderOne({
      title: cat.label,
      subtitle,
      description: cat.description,
      count,
      out,
    });
    console.log(`OG ${cat.slug}.png (${count})`);
  }
  if (!only) console.log("Note: tool OGs not generated in --categories-only mode");
}

main().catch(e => { console.error(e); process.exit(1); });
