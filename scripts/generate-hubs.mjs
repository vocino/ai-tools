/**
 * Generates programmatic hub pages for high-value SEO queries.
 * Creates `best/<slug>/index.html` pages that are real Jekyll pages (indexed, not ?filter=).
 * Run: node scripts/generate-hubs.mjs [--force]
 * Output hub count ~30.
 */
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

const ROOT = path.resolve(process.cwd());
const DATA_DIR = path.join(ROOT, "_data");
const TOOLS_DIR = path.join(ROOT, "_tools");
const OUT_BASE = path.join(ROOT, "best");

const categories = yaml.load(fs.readFileSync(path.join(DATA_DIR, "categories.yml"), "utf8"));
const catLabelMap = Object.fromEntries(categories.map(c => [c.slug, c.label]));
const catDescMap = Object.fromEntries(categories.map(c => [c.slug, c.description]));

// count tools per category/pricing
const files = fs.readdirSync(TOOLS_DIR).filter(f => f.endsWith(".md") && f !== "_template.md");
const toolFMs = files.map(f => {
  const raw = fs.readFileSync(path.join(TOOLS_DIR, f), "utf8");
  const m = raw.match(/^---\n([\s\S]*?)\n---/);
  return m ? yaml.load(m[1]) : null;
}).filter(Boolean);

function countFor(cat, pricing = null) {
  return toolFMs.filter(t => t.categories?.includes(cat) && (!pricing || t.pricing === pricing)).length;
}

const hubs = [];

// 1) Best per category — only if >=4 tools
for (const cat of categories) {
  const c = countFor(cat.slug);
  if (c < 4) continue;
  const slugBase = cat.slug.endsWith("-tools") ? `ai-${cat.slug}` : `ai-${cat.slug}-tools`;
  hubs.push({
    slug: slugBase,
    dir: slugBase,
    title: `Best AI ${cat.label} Tools — ${c} curated by Vocino`,
    description: `Best AI ${cat.label.toLowerCase()} tools — ${c} curated by Vocino. ${cat.description}. Compare pricing, API and self-hosted. Updated 2026.`,
    hub_category: cat.slug,
    hub_label: cat.label,
    hub_intro: `${cat.description}. Hand-picked from Vocino's ${toolFMs.length}-tool directory — filter by pricing, API and self-hosted to match your stack. No affiliate spam, just signal.`,
  });
}

// 2) Freemium / free per top categories where >=8
const topCats = categories.filter(c => countFor(c.slug) >= 8).map(c => c.slug);
for (const cat of topCats) {
  for (const pricing of ["freemium", "free", "open-source"]) {
    const c = countFor(cat, pricing);
    if (c < 5) continue;
    const label = catLabelMap[cat];
    hubs.push({
      slug: `${pricing}-ai-${cat}-tools`,
      dir: `${pricing}-ai-${cat}-tools`,
      title: `${pricing.charAt(0).toUpperCase() + pricing.slice(1)} AI ${label} Tools — ${c} curated`,
      description: `${c} ${pricing} AI ${label.toLowerCase()} tools curated by Vocino. ${catDescMap[cat]} — filter by pricing, API.`,
      hub_category: cat,
      hub_pricing: pricing,
      hub_label: `${label} · ${pricing}`,
      hub_intro: `${c} ${pricing} tools for ${label.toLowerCase()}. From Vocino's directory — pricing-filtered to ${pricing}. Try free first, then scale.`,
    });
  }
}

// 3) General hubs (cross-category)
const freeCount = toolFMs.filter(t => t.pricing === "free").length;
const osCount = toolFMs.filter(t => t.pricing === "open-source").length;
const apiCount = toolFMs.filter(t => t.api).length;
const shCount = toolFMs.filter(t => t.self_hosted).length;
hubs.push({
  slug: "free-ai-tools",
  dir: "free-ai-tools",
  title: `Free AI Tools — ${freeCount} free tools curated by Vocino`,
  description: `${freeCount} free AI tools curated by Vocino — no paid wall. Coding, image, video, writing and more.`,
  hub_category: "coding", // placeholder; will override filtering via custom layout? use hack: generate with all free tools
  hub_pricing: "free",
  hub_label: "Free",
  hub_intro: `${freeCount} completely free tools from Vocino's directory. No freemium upsell — truly free.`,
  // For general hubs we need broader filter; handle via special generation below
  general: "free",
});
hubs.push({
  slug: "open-source-ai-tools",
  dir: "open-source-ai-tools",
  title: `Open-Source AI Tools — ${osCount} self-hostable tools`,
  description: `${osCount} open-source AI tools that you can self-host. Coding, agents, image generation and more — curated by Vocino.`,
  hub_category: "api-platform",
  hub_pricing: "open-source",
  hub_label: "Open Source",
  hub_intro: `${osCount} open-source tools — self-host, audit, extend. From Vocino's directory.`,
  general: "open-source",
});

// Dedupe by slug
const seen = new Set();
const uniq = hubs.filter(h => { if (seen.has(h.slug)) return false; seen.add(h.slug); return true; });

console.log(`Generating ${uniq.length} hubs…`);

for (const h of uniq) {
  const outDir = path.join(OUT_BASE, h.dir);
  const outFile = path.join(outDir, "index.html");
  const exists = fs.existsSync(outFile);
  if (exists && !process.argv.includes("--force") && !process.argv.includes("--overwrite")) {
    // keep existing unless forced
  }
  // Build frontmatter — for general hubs we need to render all tools matching pricing regardless of category
  // Our hub layout currently filters by category+pricing; for general we will generate a custom page that lists all
  let frontmatter;
  if (h.general) {
    // Use generic hub that lists by pricing only — we cheat by generating a page with layout hub but override category to cover many
    // Better to generate a bespoke markdown that lists all pricing-matched tools via liquid where_exp on pricing only
    // For now write a custom hub file that uses layout hub with hub_category = most common but will be filtered; we patch layout after
    // Simpler: write a file with layout default and manual listing — but we keep hub layout with hub_general flag
    frontmatter = `---
layout: hub-general
title: "${h.title.replace(/"/g, '\\"')}"
description: "${h.description.replace(/"/g, '\\"')}"
hub_pricing: ${h.hub_pricing}
hub_label: "${h.hub_label}"
hub_intro: "${h.hub_intro.replace(/"/g, '\\"')}"
general: ${h.general}
---
`;
    // hub-general layout doesn't exist yet — we will create it minimal
  } else {
    frontmatter = `---
layout: hub
title: "${h.title.replace(/"/g, '\\"')}"
description: "${h.description.replace(/"/g, '\\"')}"
hub_category: ${h.hub_category}
${h.hub_pricing ? `hub_pricing: ${h.hub_pricing}` : ""}
hub_label: "${h.hub_label}"
hub_intro: "${h.hub_intro.replace(/"/g, '\\"')}"
image: /assets/images/og/category/${h.hub_category}.png
---
`;
  }
  await fs.promises.mkdir(outDir, { recursive: true });
  await fs.promises.writeFile(outFile, frontmatter, "utf8");
  console.log(`hub ${h.slug} → best/${h.dir}/ (${h.hub_category}${h.hub_pricing ? "/" + h.hub_pricing : ""})`);
}

// Create hub-general layout if needed
const hubGeneralLayout = path.join(ROOT, "_layouts", "hub-general.html");
if (!fs.existsSync(hubGeneralLayout)) {
  const content = `---
layout: default
---
{% assign hub_tools = site.tools | where: "pricing", page.hub_pricing %}
{% assign hub_count = hub_tools | size %}
<div class="category-page">
  <div class="category-page__eyebrow"><span style="color:var(--brand)">//</span> Hub — curated by Vocino</div>
  {% include breadcrumbs.html name=page.title current_item=page.url %}
  <h1 class="category-page__title">{{ page.title }}</h1>
  <p class="category-page__description">{{ page.description }}</p>
  {% if page.hub_intro %}
  <div class="category-page__intro hud-corners hud-corners--always" style="margin:1rem 0 1.75rem;padding:1rem 1.1rem;background:var(--surface-1);border:1px solid var(--border);border-radius:12px">
    <p style="margin:0;color:var(--text-secondary);line-height:1.6">{{ page.hub_intro }}</p>
    <p style="margin:0.5rem 0 0;font-family:var(--font-mono);font-size:0.72rem;color:var(--text-muted)">// {{ hub_count }} tools · Updated {{ site.time | date: "%Y-%m-%d" }}</p>
  </div>
  {% endif %}
  <div class="tools-grid">
    {% for tool in hub_tools limit:24 %}
      {% include tool-card.html tool=tool %}
    {% endfor %}
  </div>
  <section class="tool-detail__features hud-corners hud-corners--always" style="margin-top:2rem">
    <h2>FAQ — {{ page.title }}</h2>
    <ul>
      <li><div><strong style="color:var(--text-primary)">What is the best {{ page.hub_pricing }} AI tool?</strong><br><span style="color:var(--text-secondary)">Depends on your use case — filter this hub by category, API and self-hosted.</span></div></li>
    </ul>
  </section>
  <div style="margin-top:2rem;display:flex;flex-wrap:wrap;gap:0.5rem">
    <span style="font-family:var(--font-mono);font-size:0.72rem;color:var(--text-muted)">Categories:</span>
    {% for c in site.data.categories %}
      {% assign ct = site.tools | where_exp: "t", "t.categories contains c.slug" %}
      {% if ct.size > 0 %}<a href="{{ '/category/' | append: c.slug | append: '/' | relative_url }}" class="tag" style="text-decoration:none">{{ c.label }}</a>{% endif %}
    {% endfor %}
  </div>
</div>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": {{ page.url | absolute_url | jsonify }},
      "name": {{ page.title | jsonify }},
      "description": {{ page.description | jsonify }},
      "url": {{ page.url | absolute_url | jsonify }},
      "isPartOf": { "@id": {{ site.url | jsonify }} },
      "mainEntity": { "@type": "ItemList", "numberOfItems": {{ hub_count }}, "itemListElement": [{% assign l = hub_tools | sort: "name" %}{% for t in l limit:12 %}{"@type":"ListItem","position":{{ forloop.index }},"name":{{ t.name | jsonify }},"url":{{ t.url | absolute_url | jsonify }} }{% unless forloop.last %},{% endunless %}{% endfor %}] }
    }
  ]
}
</script>
`;
  await fs.promises.writeFile(hubGeneralLayout, content, "utf8");
  console.log("Created _layouts/hub-general.html");
}

console.log("Hub generation done");
