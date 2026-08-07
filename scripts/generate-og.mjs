import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import sharp from "sharp";

const ROOT = path.resolve(process.cwd());
const OUT_DIR = path.join(ROOT, "assets", "images", "og", "category");
const OUT_TOOLS_DIR = path.join(ROOT, "assets", "images", "og", "tools");
const OUT_SITE = path.join(ROOT, "assets", "images", "og-image.png");
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

function siteOverlay({ count }) {
  const logo = vocinoLogoSvg({ accent: "#00CCFF", width: 150 * SUPERSAMPLE });
  const badge = `${count}+ tools`;
  const tagline = "Curated for builders who ship";
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${RENDER_WIDTH}" height="${RENDER_HEIGHT}" viewBox="0 0 ${RENDER_WIDTH} ${RENDER_HEIGHT}">
  <defs>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="rgba(0,0,0,0.12)"/>
      <stop offset="1" stop-color="rgba(0,0,0,0.58)"/>
    </linearGradient>
    <linearGradient id="accentLine" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#00CCFF"/>
      <stop offset="1" stop-color="#4DA3FF"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#fade)"/>
  <!-- HUD corner accents -->
  <g stroke="rgba(0,204,255,0.35)" stroke-width="${2 * SUPERSAMPLE}" fill="none">
    <path d="M ${40*SUPERSAMPLE} ${40*SUPERSAMPLE} h ${32*SUPERSAMPLE} v 0 h 0 v ${32*SUPERSAMPLE}" />
    <path d="M ${RENDER_WIDTH-40*SUPERSAMPLE} ${40*SUPERSAMPLE} h ${-32*SUPERSAMPLE} v 0 h 0 v ${32*SUPERSAMPLE}" />
    <path d="M ${40*SUPERSAMPLE} ${RENDER_HEIGHT-40*SUPERSAMPLE} h ${32*SUPERSAMPLE} v 0 h 0 v ${-32*SUPERSAMPLE}" />
    <path d="M ${RENDER_WIDTH-40*SUPERSAMPLE} ${RENDER_HEIGHT-40*SUPERSAMPLE} h ${-32*SUPERSAMPLE} v 0 h 0 v ${-32*SUPERSAMPLE}" />
  </g>
  <!-- Header: logo + wordmark -->
  <g transform="translate(${80*SUPERSAMPLE} ${72*SUPERSAMPLE})">
    ${logo}
    <g transform="translate(${210*SUPERSAMPLE} 14)">
      <text font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="${22*SUPERSAMPLE}" font-weight="700" letter-spacing="1.5" fill="rgba(230,237,243,0.95)">AI.TOOLS  //  VOCINO</text>
      <text y="${32*SUPERSAMPLE}" font-family="system-ui, sans-serif" font-size="${15*SUPERSAMPLE}" font-weight="500" letter-spacing="0.8" fill="rgba(107,119,133,0.95)">ai.vocino.com</text>
    </g>
  </g>
  <!-- Hero -->
  <g transform="translate(${80*SUPERSAMPLE} ${250*SUPERSAMPLE})">
    <text font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="${74*SUPERSAMPLE}" font-weight="900" letter-spacing="-1" fill="rgba(255,255,255,0.97)">AI Tools</text>
    <text y="${78*SUPERSAMPLE}" font-family="system-ui, sans-serif" font-size="${28*SUPERSAMPLE}" font-weight="700" letter-spacing="2" fill="#00CCFF">BY VOCINO — CURATED DIRECTORY</text>
    <text y="${118*SUPERSAMPLE}" font-family="system-ui, sans-serif" font-size="${20*SUPERSAMPLE}" font-weight="400" fill="rgba(155,167,180,0.95)">Discover the best AI tools for building, creating &amp; shipping.</text>
    <text y="${148*SUPERSAMPLE}" font-family="monospace, ui-monospace, monospace" font-size="${15*SUPERSAMPLE}" font-weight="500" letter-spacing="0.6" fill="rgba(107,119,133,0.9)">coding • video • writing • agents • chat • design • research</text>
  </g>
  <!-- Bottom bar -->
  <g transform="translate(${80*SUPERSAMPLE} ${RENDER_HEIGHT-98*SUPERSAMPLE})">
    <rect width="${210*SUPERSAMPLE}" height="${38*SUPERSAMPLE}" rx="${19*SUPERSAMPLE}" fill="rgba(0,204,255,0.14)" stroke="rgba(0,204,255,0.32)"/>
    <text x="${24*SUPERSAMPLE}" y="${25*SUPERSAMPLE}" font-family="system-ui, sans-serif" font-size="${16*SUPERSAMPLE}" font-weight="700" fill="#00CCFF">${escapeXml(badge)} — ${escapeXml(tagline)}</text>
    <g transform="translate(${860*SUPERSAMPLE} 10)">
      <text font-family="monospace, ui-monospace, monospace" font-size="${13*SUPERSAMPLE}" font-weight="600" letter-spacing="0.8" fill="rgba(107,119,133,0.9)">vocino.com</text>
    </g>
  </g>
  <rect x="0" y="${RENDER_HEIGHT - 6*SUPERSAMPLE}" width="${RENDER_WIDTH}" height="${6*SUPERSAMPLE}" fill="url(#accentLine)" opacity="0.98"/>
</svg>`.trim();
}

function toolOverlay({ name, categoryLabel, pricing, description, slug }) {
  const safeName = escapeXml(name);
  const safeCat = escapeXml(categoryLabel);
  const safePricing = escapeXml(pricing);
  const safeDesc = escapeXml(description.length > 110 ? description.slice(0, 107) + "…" : description);
  const safeSlug = escapeXml(slug);
  const logo = vocinoLogoSvg({ accent: "#00CCFF", width: 110 * SUPERSAMPLE });
  const pricingColor = pricing === "free" ? "#3DFA9A" : pricing === "freemium" ? "#00CCFF" : pricing === "paid" ? "#FFB86B" : "#9D7CFF";
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${RENDER_WIDTH}" height="${RENDER_HEIGHT}" viewBox="0 0 ${RENDER_WIDTH} ${RENDER_HEIGHT}">
  <defs>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="rgba(0,0,0,0.10)"/>
      <stop offset="1" stop-color="rgba(0,0,0,0.55)"/>
    </linearGradient>
    <linearGradient id="accentLine" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#00CCFF"/>
      <stop offset="1" stop-color="#4DA3FF"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#fade)"/>
  <g stroke="rgba(0,204,255,0.30)" stroke-width="${2 * SUPERSAMPLE}" fill="none">
    <path d="M ${40*SUPERSAMPLE} ${40*SUPERSAMPLE} h ${24*SUPERSAMPLE} v 0 h 0 v ${24*SUPERSAMPLE}" />
    <path d="M ${RENDER_WIDTH-40*SUPERSAMPLE} ${RENDER_HEIGHT-40*SUPERSAMPLE} h ${-24*SUPERSAMPLE} v 0 h 0 v ${-24*SUPERSAMPLE}" />
  </g>
  <g transform="translate(${80*SUPERSAMPLE} ${72*SUPERSAMPLE})">
    ${logo}
    <g transform="translate(${160*SUPERSAMPLE} 10)">
      <text font-family="system-ui, sans-serif" font-size="${18*SUPERSAMPLE}" font-weight="700" letter-spacing="1.2" fill="rgba(230,237,243,0.92)">AI.TOOLS  //  VOCINO</text>
      <text y="${28*SUPERSAMPLE}" font-family="system-ui, sans-serif" font-size="${14*SUPERSAMPLE}" fill="rgba(107,119,133,0.9)">ai.vocino.com/tools/${safeSlug}/</text>
    </g>
    <g transform="translate(${RENDER_WIDTH-860*SUPERSAMPLE} 6)">
      <rect x="0" y="0" width="${(safeCat.length * 10 + 40) * SUPERSAMPLE}" height="${28*SUPERSAMPLE}" rx="${14*SUPERSAMPLE}" fill="rgba(0,204,255,0.12)" stroke="rgba(0,204,255,0.24)"/>
      <text x="${20*SUPERSAMPLE}" y="${19*SUPERSAMPLE}" font-family="system-ui, sans-serif" font-size="${13*SUPERSAMPLE}" font-weight="700" fill="#00CCFF">${safeCat}</text>
    </g>
  </g>
  <g transform="translate(${80*SUPERSAMPLE} ${240*SUPERSAMPLE})">
    <text font-family="system-ui, sans-serif" font-size="${62*SUPERSAMPLE}" font-weight="900" letter-spacing="-1" fill="rgba(255,255,255,0.97)">${safeName}</text>
    <g transform="translate(0 ${62*SUPERSAMPLE})">
      <rect width="${(safePricing.length * 9 + 28) * SUPERSAMPLE}" height="${26*SUPERSAMPLE}" rx="${13*SUPERSAMPLE}" fill="rgba(255,255,255,0.08)" stroke="${pricingColor}" stroke-opacity="0.4"/>
      <text x="${14*SUPERSAMPLE}" y="${18*SUPERSAMPLE}" font-family="system-ui, sans-serif" font-size="${12*SUPERSAMPLE}" font-weight="700" fill="${pricingColor}">${safePricing.toUpperCase()}</text>
      <text x="${(safePricing.length * 9 + 44) * SUPERSAMPLE}" y="${18*SUPERSAMPLE}" font-family="system-ui, sans-serif" font-size="${15*SUPERSAMPLE}" fill="rgba(155,167,180,0.95)">curated by Vocino</text>
    </g>
    <text y="${118*SUPERSAMPLE}" font-family="system-ui, sans-serif" font-size="${20*SUPERSAMPLE}" fill="rgba(155,167,180,0.92)">${safeDesc}</text>
  </g>
  <g transform="translate(${80*SUPERSAMPLE} ${RENDER_HEIGHT-90*SUPERSAMPLE})">
    <rect width="${220*SUPERSAMPLE}" height="${30*SUPERSAMPLE}" rx="${15*SUPERSAMPLE}" fill="rgba(0,204,255,0.10)" stroke="rgba(0,204,255,0.22)"/>
    <text x="${18*SUPERSAMPLE}" y="${20*SUPERSAMPLE}" font-family="system-ui, sans-serif" font-size="${13*SUPERSAMPLE}" font-weight="600" fill="#00CCFF">ai.vocino.com  •  vocab: ai tool</text>
  </g>
  <rect x="0" y="${RENDER_HEIGHT - 6*SUPERSAMPLE}" width="${RENDER_WIDTH}" height="${6*SUPERSAMPLE}" fill="url(#accentLine)" opacity="0.98"/>
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

async function renderTool({ name, categoryLabel, pricing, description, slug, out }) {
  const bg = await buildBackground();
  const overlay = toolOverlay({ name, categoryLabel, pricing, description, slug });
  const bgPng = await bg.png().toBuffer();
  const overlayPng = await sharp(Buffer.from(overlay), { density: 72 }).resize(RENDER_WIDTH, RENDER_HEIGHT).png().toBuffer();
  const merged = await sharp(bgPng).composite([{ input: overlayPng, top: 0, left: 0 }]).png().toBuffer();
  await sharp(merged).resize(WIDTH, HEIGHT).png({ compressionLevel: 9 }).toFile(out);
}

async function renderSite({ count, out }) {
  const bg = await buildBackground();
  const overlay = siteOverlay({ count });
  const bgPng = await bg.png().toBuffer();
  const overlayPng = await sharp(Buffer.from(overlay), { density: 72 }).resize(RENDER_WIDTH, RENDER_HEIGHT).png().toBuffer();
  const merged = await sharp(bgPng).composite([{ input: overlayPng, top: 0, left: 0 }]).png().toBuffer();
  await sharp(merged).resize(WIDTH, HEIGHT).png({ compressionLevel: 9 }).toFile(out);
}

async function main() {
  const args = process.argv.slice(2);
  const only = args.includes("--categories-only");
  const skipTools = args.includes("--no-tools") || only;
  const toolsOnly = args.includes("--tools-only");
  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.mkdir(OUT_TOOLS_DIR, { recursive: true });

  const categoriesRaw = fsSync.readFileSync(path.join(DATA_DIR, "categories.yml"), "utf8");
  const categories = yaml.load(categoriesRaw);
  const catLabelMap = Object.fromEntries(categories.map(c => [c.slug, c.label]));

  // count tools per category by scanning _tools front matter
  const files = fsSync.readdirSync(TOOLS_DIR).filter(f => f.endsWith(".md") && f !== "_template.md");
  const counts = {};
  const toolEntries = [];
  for (const f of files) {
    const content = fsSync.readFileSync(path.join(TOOLS_DIR, f), "utf8");
    const m = content.match(/^---\n([\s\S]*?)\n---/);
    if (!m) continue;
    const fm = yaml.load(m[1]);
    toolEntries.push({ file: f, fm });
    if (!fm?.categories) continue;
    for (const c of fm.categories) counts[c] = (counts[c] || 0) + 1;
  }

  const totalCount = files.length;

  // Site OG — always generate unless --no-site
  if (!toolsOnly && !args.includes("--no-site")) {
    await fs.mkdir(path.dirname(OUT_SITE), { recursive: true });
    await renderSite({ count: totalCount, out: OUT_SITE });
    console.log(`OG site og-image.png (${totalCount}) → ${path.relative(ROOT, OUT_SITE)}`);
  }
  if (args.includes("--site-only")) return;
  if (toolsOnly) {
    // fallthrough to tools only below
  } else {
    for (const cat of categories) {
      const count = counts[cat.slug] || 0;
      const out = path.join(OUT_DIR, `${cat.slug}.png`);
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
    if (only) {
      console.log("Skipping tool OGs (--categories-only)");
      return;
    }
  }

  if (skipTools) {
    console.log("Skipping tool OGs (--no-tools or --categories-only)");
    return;
  }

  // Per-tool OG — generate 211 HUD images (1200×630) — check existing unless --force
  let generated = 0, skipped = 0;
  const limit = args.includes("--limit") ? parseInt(args[args.indexOf("--limit") + 1] || "0", 10) : 0;
  const force = args.includes("--force");
  let entries = toolEntries;
  if (limit > 0) entries = entries.slice(0, limit);
  for (const { fm } of entries) {
    const slug = fm.slug;
    const name = fm.name || slug;
    const catSlug = fm.categories?.[0];
    const catLabel = catLabelMap[catSlug] || catSlug || "AI Tool";
    const pricing = fm.pricing || "freemium";
    const description = fm.description || "";
    const out = path.join(OUT_TOOLS_DIR, `${slug}.png`);
    if (!force && fsSync.existsSync(out)) {
      skipped++;
      continue;
    }
    await renderTool({ name, categoryLabel: catLabel, pricing, description, slug, out });
    generated++;
    if (generated % 50 === 0) console.log(`OG tools: ${generated}/${entries.length}…`);
  }
  console.log(`OG tools: generated ${generated}, skipped ${skipped} (total ${entries.length}) → ${path.relative(ROOT, OUT_TOOLS_DIR)}/`);
}

main().catch(e => { console.error(e); process.exit(1); });
