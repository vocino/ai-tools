# Contributing to AI Tools by Vocino

Thanks for contributing to **ai.vocino.com** — a curated directory by **[Vocino](https://vocino.com)**.

This is community-driven but curated with taste. I include tools that help you ship something real — not SEO filler.

## Scope

Every tool should **help you do something useful**. We list AI tools that enable a productive outcome — coding, creating, designing, researching, automating. We exclude passive entertainment (character chat with no work outcome). Ask: does this tool help someone accomplish a task?

Curated by Vocino = you get my filter. I build AI products daily, I live in Claude Code. If it's on here, it's worth tracking.

## Adding a New Tool

### 1. Copy template

Copy `_tools/_template.md` → `_tools/your-tool-slug.md` (lowercase hyphens).

### 2. Fill front matter

Required fields:

| Field | Type | Notes |
|-------|------|-------|
| `name` | string | Official name |
| `slug` | string | Must match filename |
| `website` | string | Clean URL (we add UTM) |
| `description` | string | <160 chars, one sentence |
| `categories` | list | 1–3 from list below |
| `use_cases` | list | 1–3 from list below |
| `modalities` | list | text, image, video, audio, code |
| `pricing` | string | free, freemium, paid, open-source |
| `api` | bool | Has public API? |
| `self_hosted` | bool | Self-hostable? |

### 3. Write description

2–4 sentences, natural, includes keywords like "AI writing assistant" without stuffing.

### 4. PR it

- One file to `_tools/`
- CI validates via `node validate.js`
- I merge if it passes and fits my bar

## Contributing with AI — fast path

Use Claude/ChatGPT to draft:

```
I'm contributing to ai.vocino.com (https://github.com/vocino/ai-tools) — curated by Vocino.

Create tool listing for:
- Name: [Name]
- Website: [URL]
- Description: [what it does]

Use template:
[Paste _tools/_template.md]

Valid values:
- Categories: chat, image-generation, image-editing, video-generation, video-editing, audio-generation, audio-editing, speech, coding, writing, productivity, research, search, customer-service, design, marketing, education, data-analysis, 3d, agents, api-platform, prompt-tools
- Use cases: content-creation, development, design, research, automation, support, sales, marketing, education, personal, data-analysis, video-production, audio-production, legal, healthcare, finance, enterprise
- Modalities: text, image, video, audio, code
- Pricing: free, freemium, paid, open-source

Output complete .md with YAML front matter. Slug hyphenated, matches filename.
```

Then `npm install && node validate.js` → PR.

## Categories / Use Cases / Modalities

**Categories:** chat, image-generation, image-editing, video-generation, video-editing, audio-generation, audio-editing, speech, coding, writing, productivity, research, search, customer-service, design, marketing, education, data-analysis, 3d, agents, api-platform, prompt-tools

**Use cases:** content-creation, development, design, research, automation, support, sales, marketing, education, personal, data-analysis, video-production, audio-production, legal, healthcare, finance, enterprise

**Modalities:** text, image, video, audio, code

## Evergreen Counts — Don't Hardcode Exact Numbers

Like the `211 → 200+` fix: never hardcode exact tool counts (`211`, `210`, `205+`). Use:

- **In Jekyll templates:** `{{ site.tools | size }}` (nav, footer, sidebar, category intros, 404 link) — renders exact at build, no manual bump.
- **In prose/SEO/README/package.json:** rounded bucket `200+` (stable 200–299; bump only at 300). Keeps CTR without churn.
- **Generated data:** `_data/tool_added_dates.yml` and `assets/images/og/**.png` are built by `node scripts/generate-added-dates.js` and `node scripts/generate-og.mjs` — CI runs them on `pages.yml`; locally run `npm run build` or `npm run generate-added-dates`. `validate.js` warns if `tool_added_dates.yml` is stale.

If you add a category, create `category/<slug>/index.html` + OG via `generate-og.mjs` — or open an issue.

## About This Project

- **URL:** https://ai.vocino.com
- **Repo:** https://github.com/vocino/ai-tools (formerly 8ai.ac)
- **Built by:** [Vocino](https://vocino.com) — indie AI builder, part of vocino.com ecosystem
- **Stack:** Jekyll + GitHub Pages, 200+ tools, vocino.com design system (--bg #0F1419 / --brand #00CCFF)
- **Legacy:** 8ai.ac → ai.vocino.com — same curation, more brand equity with vocino

Be respectful. No spam, fake tools, or affiliate-heavy descriptions.
