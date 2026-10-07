# ai-tools craft audit — 2026-10-07

Repo: `~/workspace/ai-tools` (vocino/ai-tools, live at ai.vocino.com). Jekyll, ~221 published tools.
Scope: craft + usability against V's bar (Karpathy minimalism, zero AI slop, respect the visitor's attention). No changes implemented — proposals only.

## New listings verification (merged today)

| Listing | Status | Notes |
|---|---|---|
| YYLO (`_tools/yylo.md`) | ✅ Live, renders correctly | Data quality good: concrete description, real GitHub repo + npm package verified independently |
| Fomrix (`_tools/fomrix.md`) | ✅ Live (200) | Concrete description, no filler |
| Yeri AI (`_tools/yeri-ai.md`) | ✅ Live (200) | Model-name-dense but factual description |
| Durofy (`_tools/durofy.md`) | ❌ Merged but invisible | Has `published: false` → 404s at `/tools/durofy/`. Also: em dash in description, "scroll-stopping" hype in body |

Also verified: today's 4 merges initially failed to deploy — GitHub Pages runs collided ("deployment already in progress") because 4 pushes landed minutes apart. The queue drained and the site is now current (homepage shows "Updated 2026-10-07", all three published listings live). See finding 11.

---

## Quick wins (<30 min each)

### 1. Durofy is merged but 404s — publish or remove it
**Where:** `_tools/durofy.md` line 2 (`published: false`)
**Why it matters:** A contributor's merged PR produces nothing. The site silently accepts work and shows no result — the worst kind of broken.
**Fix:** Either delete the `published: false` line to publish it, or delete the file if you don't want the listing. Don't leave a merged-but-invisible page.

### 2. "a open-source" grammar bug on 29 tool pages
**Where:** `_layouts/tool.html`, the "Why X is on ai.vocino.com" enrichment block (`is a {{ pricing_human | downcase }}`)
**Why it matters:** Every open-source tool page reads "**YYLO** is a open-source **coding & development** tool". 29 pages with broken grammar is embarrassing on a curated directory.
**Fix:** Add a/an handling in the template (`{% if page.pricing == "open-source" %}an{% else %}a{% endif %}`). One-line Liquid change. (This whole block should probably go — see finding 8 — but the grammar fix is independent.)

### 3. Hardcoded "209" tool counts are stale everywhere
**Where:** `index.html` (title, meta description, hero intro: "Search 209 tools"), `_config.yml` (title, description), `best/*/index.html` front matter ("36 in open directory")
**Why it matters:** The real count is 221 and changes on every merge. Stale numbers in titles and meta descriptions erode trust and look unmaintained. The site already uses `{{ site.tools | size }}` dynamically in half the places — the hardcoded ones are just the ones that drift.
**Fix:** Drop the number from titles/descriptions entirely ("AI Tools Directory — Coding, Video, Writing & More"), or keep it only where Liquid renders it. Front matter doesn't process Liquid, so deletion beats cleverness here.

### 4. Durofy copy cleanup (if published)
**Where:** `_tools/durofy.md`
**Why it matters:** Em dash in the description and "scroll-stopping visuals" in the body — both violate the zero-slop bar, and it's the newest listing, so it sets the tone for contributors.
**Fix:** Description → "Turn photos into cover-style promo graphics and thumbnails in seconds. AI art direction for creators and marketers. First 3 free." Body → replace "scroll-stopping visuals" with something concrete, e.g. "finished-looking visuals".

### 5. Em dashes in 37 listings' description/body copy
**Where:** `_tools/*.md` — e.g. `fireworks-ai`, `joyfusion`, `magnific` (description); 34 more in body copy
**Why it matters:** Site-wide no-em-dash rule. The `title:` front-matter uses ("Ada — Customer Service AI Tool") are fine — that's a title separator convention, not body copy.
**Fix:** Scriptable: replace ` — ` with `, ` or `. ` in description and body fields only. ~10 minutes with a script + review.

### 6. Hype words in 7 listings
**Where:** `deepl` ("best-in-class"), `elevenlabs` / `google-veo` / `vllm` ("state-of-the-art"), `openai-chatgpt` / `quizlet-ai` ("unlock"), `durofy` ("scroll-stopping")
**Why it matters:** Same bar as finding 4. "State-of-the-art" and "unlock" are press-release words, not curator words.
**Fix:** Rewrite each to say what the thing concretely does. Small, manual, high-signal.

### 7. 16 descriptions redundantly restate the pricing badge
**Where:** e.g. `aider` ("Open-source AI pair programming tool…" + open-source badge), `autogpt`, `browser-use`, `chroma`, `continue`, `jan`, `langchain`, `weaviate`
**Why it matters:** The card already shows the pricing badge; the description repeating it wastes the most-read line on the card.
**Fix:** Strip the leading "Open-source"/"Free" from those descriptions so the first words say what the tool does.

---

## Medium lifts

### 8. Delete the "Why X is on ai.vocino.com" auto-generated filler (all 221 tool pages)
**Where:** `_layouts/tool.html`, the "Deterministic enrichment" block
**Why it matters:** This is the single biggest craft violation on the site. Every tool page carries ~100 words of templated filler: "**Claude Code** is a paid **coding & development** tool with API featuring 5 capabilities… Useful for development, automation… Pick if you need coding & development on a paid plan with text, code I/O." It reads as AI slop because it is — no human would write "featuring 5 capabilities" or "with text, code I/O". It also directly contradicts the CONTRIBUTING.md line "not SEO filler". 221 pages × ~100 words = ~22,000 words of filler.
**Fix options (V picks):** (a) delete the block entirely — the page already answers what/cost/where in the header; (b) replace with one honest line, e.g. "Tracked for my agents. Not my product." The JSON-LD already covers SEO structure.

### 9. Category pages: cut the auto-generated intro filler
**Where:** `_layouts/category.html` (intro box + templated FAQ)
**Why it matters:** Same slop class, smaller surface. "From **Agent QA** to **Aider**, find the tools that help you ship" — the "From X to Y" is just the first two alphabetical names, pure noise. The FAQ ("How do I choose the right coding & development AI tool?") is generic advice that could be on any site.
**Fix:** Keep the count + curated-by line, delete the "From X to Y" clause and the FAQ block. Category pages then do one job: list the tools.

### 10. Stop appending UTM params to outbound "Visit" links
**Where:** `_layouts/tool.html` (`utm_source=ai.vocino.com&utm_medium=referral&utm_campaign=vocino-tools`)
**Why it matters:** V's standing link rule is naked-domain links. Injecting tracking params into every outbound link is the opposite — and it can break tools whose onboarding is URL-sensitive.
**Fix:** Link to `page.website` as-is. If referral attribution matters, do it server-side or drop it.

### 11. Add deploy concurrency to pages.yml
**Where:** `.github/workflows/pages.yml`
**Why it matters:** Today's 4 merges produced 3 failed Pages runs from deployment collisions. The site sat stale for ~an hour with 404s on the new listings. Any future batch of merges repeats this.
**Fix:** Add `concurrency: { group: "pages", cancel-in-progress: true }` to the workflow. One block, permanent fix.

### 12. The `verified` flag is dead schema — use it or remove it
**Where:** `_tools/_template.md`, `validate.js`, all 213 tool files
**Why it matters:** 0 of 213 tools have `verified: true`. A trust signal that's never set is worse than no signal — it implies curation rigor that doesn't exist. (Karpathy: delete > add.)
**Fix:** Either define what "verified" means (V or an agent actually checked the site/pricing this quarter) and start setting it, or remove the field from the template and validator.

---

## Bigger bets

### 13. Search that understands intent, not just substrings
**Where:** `assets/js/filter.js`, `_includes/sidebar.html` search box
**Why it matters:** The 30-second test mostly passes — search + category pills + filters are all present and client-side-fast. But search only matches name/description substrings via data attributes. "Video editor for YouTube" won't find Captions unless those words appear. The data to do better (use_cases, categories) already exists in the front matter.
**Fix:** Weight matches across name, categories, use_cases, and description instead of a flat substring scan. Still client-side, no new deps.

### 14. Pricing accuracy is unverified across the directory
**Why it matters:** Pricing is the highest-value filter on the site and it's contributor-reported with no recheck. The Aug 9 audit covered link rot; pricing drift is the same rot in a different field (freemium tiers change constantly).
**Fix:** Quarterly agent pass: sample N listings, check current pricing pages, flag mismatches. Could reuse the audit harness in `audit/check.py`.

---

## What I deliberately didn't flag

- **Card "missing names"**: the live category page text extraction appeared to drop some tool names, but all 213 files have valid `name` fields — extraction artifact, not a bug.
- **"Duplicate FAQ" on category pages**: the second FAQ block in page text extraction is the JSON-LD schema being rendered as text, not visible duplicate content.
- **CSS/JS weight**: 39KB CSS + 16KB JS, media queries for 1024/768/480px present. No bloat problem. (Didn't render mobile viewport directly — worth a glance on a phone, but nothing in the code suggests breakage.)
- **Link rot**: covered by the 2026-08-09 audit (`audit/report.md`); not re-run here.
