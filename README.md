# AI Tools — Open Directory — ai.vocino.com

[![Website](https://img.shields.io/badge/Website-ai.vocino.com-00CCFF?style=flat-square&labelColor=161B22)](https://ai.vocino.com)
[![Tools](https://img.shields.io/badge/Tools-200%2B-4DA3FF?style=flat-square&labelColor=161B22)](https://ai.vocino.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-3DFA9A?style=flat-square&labelColor=161B22)](LICENSE)
[![Built with Jekyll](https://img.shields.io/badge/Built%20with-Jekyll-%23CC0000?style=flat-square&labelColor=161B22)](https://jekyllrb.com/)
[![Curated by Vocino](https://img.shields.io/badge/Curated%20by-Vocino-00CCFF?style=flat-square&labelColor=161B22)](https://vocino.com)

An open directory of **200+ AI tools** — I maintain this list for my own coding agents, shared because you might find it useful. These are third-party tools, not mine.

**[Browse at ai.vocino.com →](https://ai.vocino.com)**

---

## What is this?

`ai.vocino.com` is an open directory I keep for my agents. One file per tool, no database, no bullshit. These are all third-party products (not mine) — if it helps you ship something useful — writing, coding, designing, researching, automating — it belongs here. Contributions welcome.

Built with Jekyll, hosted on GitHub Pages. Open directory, community contributions welcome. I maintain it for my own use.

This is the successor to **8ai.ac** — same spirit, more *Vocino*.

## Why Vocino's directory?

I build AI products, I invest in AI companies, I live in Claude Code every day. I'm picky. This list is the tools I actually track and recommend — not SEO spam.

Every tool has my taxonomy (categories, use cases, modalities, pricing) and is searchable/filterable. No affiliate theater, just signal.

## Add a Tool

1. Copy `_tools/_template.md`
2. Rename to `your-tool-slug.md`
3. Fill in front matter (see CONTRIBUTING.md)
4. PR it

See [CONTRIBUTING.md](CONTRIBUTING.md) for full instructions, AI-assisted prompt, and taxonomy.

## How It Works

- **One file per tool** — `_tools/*.md` with YAML front matter
- **Jekyll + GitHub Pages** — static, fast, free
- **Client-side filtering** — JS sidebar filters (categories, use cases, modalities, pricing)
- **200+ tools validated** — `node validate.js` on every PR
- **Vocino-ish design** — `--bg #0F1419 / --brand #00CCFF` dark hacker theme, HUD corners, V brandmark

## Local Development

```bash
gem install bundler
bundle install
bundle exec jekyll serve
# http://localhost:4000
```

With Node (for validation & build):

```bash
npm install
npm run build        # generate-added-dates + jekyll build (evergreen)
npm run validate     # front matter + dates freshness
# or: node scripts/generate-added-dates.js && node validate.js
```

## Project Structure

```
_tools/        → Tool listings (one .md per tool)
_data/         → Taxonomies (categories, use_cases, modalities)
_layouts/      → Page layouts (default, tool, category)
_includes/     → Components (nav, sidebar, cards, brandmark)
assets/        → CSS (vocino.com tokens) + JS
```

## The Vocino Ecosystem

- **[vocino.com](https://vocino.com)** — home
- **[ai.vocino.com](https://ai.vocino.com)** — this directory (200+ tools)
- **[@vocino on Threads](https://threads.com/@vocino)** — daily updates
- **GitHub: [vocino/ai-tools](https://github.com/vocino/ai-tools)**

Part of my path to building great AI-tools in public — Karpathy-style deep dives, from-scratch primitives, ambient agents (claude-hue/govee), autonomous forge.

## Contributors

<!-- readme: contributors -start -->
<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center">
<a href="https://github.com/vocino" title="Vocino — curator"><img src="https://avatars.githubusercontent.com/u/65593?v=4" width="36" alt="Vocino" style="border-radius:50%"/></a>
</div>
<!-- readme: contributors -end -->

## License

MIT — see [LICENSE](LICENSE). Listings are community contributed.
