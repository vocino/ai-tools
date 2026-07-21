# AI Tools by Vocino — ai.vocino.com

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]](LICENSE)

A curated directory of **205+ AI tools** — built and maintained by **[Vocino](https://vocino.com)**. Part of the [vocino.com](https://vocino.com) ecosystem.

**[Browse at ai.vocino.com →](https://ai.vocino.com)**

---

## What is this?

`ai.vocino.com` is where I collect the best AI tools worth using. One file per tool, no database, no bullshit. If it helps you ship something useful — writing, coding, designing, researching, automating — it belongs here.

Built with Jekyll, hosted on GitHub Pages. Community-driven, curated by me.

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
- **205+ tools validated** — `node validate.js` on every PR
- **Vocino design system** — `--bg #0F1419 / --brand #00CCFF` dark hacker theme, HUD corners, V brandmark

## Local Development

```bash
gem install bundler
bundle install
bundle exec jekyll serve
# http://localhost:4000
```

With Node (for validation):

```bash
npm install
node scripts/generate-added-dates.js
node validate.js
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
- **[ai.vocino.com](https://ai.vocino.com)** — this directory (205 tools)
- **[@vocino on Threads](https://threads.com/@vocino)** — daily updates
- **GitHub: [vocino/ai-tools](https://github.com/vocino/ai-tools)**

Part of my path to building great AI-tools in public — Karpathy-style deep dives, from-scratch primitives, ambient agents (claude-hue/govee), autonomous forge.

## Contributors

<!-- readme: contributors -start --><div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center">
<a href="https://github.com/vocino" title="Vocino"><img src="https://avatars.githubusercontent.com/u/65593?v=4" width="36;" alt="Vocino"/></a>
<a href="https://github.com/claude" title="Claude"><img src="https://avatars.githubusercontent.com/u/81847?v=4" width="36;" alt="Claude"/></a>
<a href="https://github.com/CJWTRUST" title="CJWTRUST"><img src="https://avatars.githubusercontent.com/u/235565898?v=4" width="36;" alt="CJWTRUST"/></a>

</div><!-- readme: contributors -end -->

## License

MIT — see [LICENSE](LICENSE). Listings are community contributed.

[contributors-shield]: https://img.shields.io/github/contributors/vocino/ai-tools?style=flat-square&color=00CCFF&labelColor=161B22
[contributors-url]: https://github.com/vocino/ai-tools/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/vocino/ai-tools?style=flat-square&color=4DA3FF&labelColor=161B22
[forks-url]: https://github.com/vocino/ai-tools/network/members
[stars-shield]: https://img.shields.io/github/stars/vocino/ai-tools?style=flat-square&color=00CCFF&labelColor=161B22
[stars-url]: https://github.com/vocino/ai-tools/stargazers
[issues-shield]: https://img.shields.io/github/issues/vocino/ai-tools?style=flat-square&color=FF5C5C&labelColor=161B22
[issues-url]: https://github.com/vocino/ai-tools/issues
[license-shield]: https://img.shields.io/github/license/vocino/ai-tools?style=flat-square&color=3DFA9A&labelColor=161B22
