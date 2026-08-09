# AI Tools Audit — 2026-08-09

**Total tools scanned:** 212
**Generated:** 2026-08-09 PT from liveness check (curl -L, 8s connect, 15s max)

## Summary
- Alive (200/403 anti-bot treated as alive): 207
- Dead / 4xx/5xx / timeout: 5
- Redirected to unrelated domain (rebrand / acquisition): 24
- Parked: 0
- Unknown/error: 0

> Note: ~10 of the 14 'dead' from raw curl were false positives — sites behind Cloudflare/ bot protection or requiring JS (midjourney, gemini, sora, sharpniq, etc). They return 0/timeout to simple curl but are live in browser. Adjusted in final table.

## Dead / High-Risk Tools

| slug | name | website | final_url | code | reason | action |
|---|---|---|---|---|---|---|
| ltx-video | LTX Video | https://ltx.studio | https://ltx.io/studio | 0 | DNS/timeout/no response | review - likely dead |
| phind | Phind | https://www.phind.com | https://www.phind.com/ | 404 | 404 client error (404/410 likely dead) | remove / update |
| tome | Tome | https://tome.app | https://tome.app/ | 404 | 404 client error (404/410 likely dead) | remove / update |
| vedic-astrology-chart | Vedic Astrology Chart | https://vedicastrologychart.net | https://vedicastrologychart.net/ | 0 | DNS/timeout/no response | review - likely dead |
| wan-video | Wan Video | https://github.com/Wan-AI/Wan2.2 | https://github.com/Wan-AI/Wan2.2 | 404 | 404 client error (404/410 likely dead) | remove / update |

### Redirected — likely rebrand / acquisition (review url update)

| slug | name | website | final | reason | suggested |
|---|---|---|---|---|---|
| anthropic-api | Anthropic API | https://docs.anthropic.com | https://platform.claude.com/docs/en/home | Redirects to unrelated domain platform.claude.com from docs.anthropic.com (200) | update website -> final_url |
| anything-llm | AnythingLLM | https://useanything.com | https://anythingllm.com/ | Redirects to unrelated domain anythingllm.com from useanything.com (200) | update website -> final_url |
| claude-code | Claude Code | https://docs.anthropic.com/en/docs/claude-code | https://code.claude.com/docs | Redirects to unrelated domain code.claude.com from docs.anthropic.com (200) | update website -> final_url |
| codeium | Codeium | https://codeium.com | https://devin.ai/desktop | Redirects to unrelated domain devin.ai from codeium.com (200) | update website -> final_url |
| fathom | Fathom | https://fathom.video | https://www.fathom.ai/ | Redirects to unrelated domain www.fathom.ai from fathom.video (200) | update website -> final_url |
| flux | Flux | https://blackforestlabs.ai | https://bfl.ai/ | Redirects to unrelated domain bfl.ai from blackforestlabs.ai (200) | update website -> final_url |
| galileo-ai | Galileo AI | https://www.usegalileo.ai | https://stitch.withgoogle.com/ | Redirects to unrelated domain stitch.withgoogle.com from www.usegalileo.ai (200) | update website -> final_url |
| google-gemma | Google Gemma | https://ai.google.dev/gemma | https://deepmind.google/models/gemma/ | Redirects to unrelated domain deepmind.google from ai.google.dev (200) | update website -> final_url |
| gpt4all | GPT4All | https://gpt4all.io | https://www.nomic.ai/gpt4all | Redirects to unrelated domain www.nomic.ai from gpt4all.io (200) | update website -> final_url |
| intercom-fin | Intercom Fin | https://www.intercom.com/fin | https://fin.ai/ | Redirects to unrelated domain fin.ai from www.intercom.com (200) | update website -> final_url |
| kimi | Kimi | https://kimi.moonshot.cn | https://www.kimi.com/ | Redirects to unrelated domain www.kimi.com from kimi.moonshot.cn (200) | update website -> final_url |
| kling-ai | Kling AI | https://klingai.com | https://kling.ai/ | Redirects to unrelated domain kling.ai from klingai.com (200) | update website -> final_url |
| lex | Lex | https://lex.new | https://lex.page/ | Redirects to unrelated domain lex.page from lex.new (200) | update website -> final_url |
| meta-ai | Meta AI | https://dev.meta.ai/ | https://auth.meta.com/?waterfall_id=04980b9c-5c77-4016-b314-11a645ec6a6f&redirect_uri=https%3A%2F%2Fauth.meta.com%2Foidc%2F%3Fapp_id%3D2403310080153219%26nonce%3DAdRTmckhVvPFP0frHm3Gl8VMSMA%26redirect_uri%3Dhttps%253A%252F%252Fdev.meta.ai%252Foidc%252Fcallback%252F%26response_type%3Dcode%26scope%3Dopenid%26state%3DATpcSpE2KTeddfwY6PuIA-gxQfxObGPyqDdOTw5qeZQL79UVc-Vu9FfNMy5gQiJcDRJ1IIyoMQVT-dQNmFSlPhqrXgMAnBLVgGUluWuHY9iHFaJP1HZCzljKra42uWCGCryCry1hGGKBTEMqzylCkdUbpL8yPw_ElIJzcarnHDe6iFT-gbtCle96z-_zGHU-YoHlR9P_Z6YlxahUJrRjyxMamtyRdayasZqgRTkG_0rFMmUewURrOGccuIkOzoHHx_xt8blFL5Bv1oRGmAFwkpgYVpUQZAJhZaQE2RCILnc%26waterfall_id%3D04980b9c-5c77-4016-b314-11a645ec6a6f&source_app_id=2403310080153219&force_reauth=0&rcs=AToHZOZacNYx_aE9KPNddHlnUpwIm_8-YkQrcsVT4FCJYWahuVquRAtj3vIrJ27W8f_IzwNjI9pmgWSOxSKRhU2-aUu9EoZXV_0wASmhngwcvQVxxx0yN1Y41kHmWuiktRe7kdKGuM7FmmfFZxlT5I4Lvy-96dRv767Vh4jO7Eg7dKNNZgNcrmnZutY | Redirects to unrelated domain auth.meta.com from dev.meta.ai (200) | update website -> final_url |
| meta-llama | Meta Llama | https://llama.meta.com | https://developer.meta.com/ai/ | Redirects to unrelated domain developer.meta.com from llama.meta.com (200) | update website -> final_url |
| notebooklm | NotebookLM | https://notebooklm.google.com | https://accounts.google.com/v3/signin/identifier?continue=https%3A%2F%2Fnotebook.google.com%2Flogin%3Fcontinue%3Dhttps%3A%2F%2Fnotebook.google.com%2F&dsh=S-719787865%3A1786299171711609&followup=https%3A%2F%2Fnotebook.google.com%2Flogin%3Fcontinue%3Dhttps%3A%2F%2Fnotebook.google.com%2F&osid=1&passive=1209600&flowName=WebLiteSignIn&flowEntry=ServiceLogin&ifkv=Ac50bxu4m4awifB2EPDo4JLCfyzyjkP6x6q-lubmcioB9q5F-nrkFq3lnz2dSOfZMYRdnSk_MTIT | Redirects to unrelated domain accounts.google.com from notebooklm.google.com (200) | update website -> final_url |
| notion-ai | Notion AI | https://notion.so/product/ai | https://www.notion.com/product/ai | Redirects to unrelated domain www.notion.com from notion.so (200) | update website -> final_url |
| playground-ai | Playground AI | https://playground.com | https://playgroundai.com/ | Redirects to unrelated domain playgroundai.com from playground.com (200) | update website -> final_url |
| podcastle | Podcastle | https://podcastle.ai | https://async.com/ | Redirects to unrelated domain async.com from podcastle.ai (200) | update website -> final_url |
| roocode | RooCode | https://roocode.com | https://roomote.dev/ | Redirects to unrelated domain roomote.dev from roocode.com (200) | update website -> final_url |
| runway | Runway | https://runwayml.com | https://runway.com/ | Redirects to unrelated domain runway.com from runwayml.com (200) | update website -> final_url |
| v0 | v0 | https://v0.dev | https://v0.app/ | Redirects to unrelated domain v0.app from v0.dev (200) | update website -> final_url |
| vercel-ai-sdk | Vercel AI SDK | https://sdk.vercel.ai | https://ai-sdk.dev/ | Redirects to unrelated domain ai-sdk.dev from sdk.vercel.ai (200) | update website -> final_url |
| windsurf | Windsurf | https://windsurf.com | https://devin.ai/desktop | Redirects to unrelated domain devin.ai from windsurf.com (200) | update website -> final_url |

## Staleness Sample (manual spot-check)

- **anthropic-api** (https://docs.anthropic.com -> https://platform.claude.com/docs/en/home) [redirected] — Redirects to unrelated domain platform.claude.com from docs.anthropic.com (200)
  - desc: Developer platform and API for Claude models with long context, tool use, and enterprise features.

- **codeium** (https://codeium.com -> https://devin.ai/desktop) [redirected] — Redirects to unrelated domain devin.ai from codeium.com (200)
  - desc: Free AI code completion and in-editor chat for developers, supporting 70+ programming languages and all major IDEs.
  - note: Codeium → Windsurf → acquired by Cognition (Devin). Codeium.com now redirects to devin.ai/desktop. Listing is historically accurate but stale — should update to Windsurf/Devin or retitle.

- **galileo-ai** (https://www.usegalileo.ai -> https://stitch.withgoogle.com/) [redirected] — Redirects to unrelated domain stitch.withgoogle.com from www.usegalileo.ai (200)
  - desc: AI tool that generates high-fidelity UI designs from text prompts or reference images.
  - note: usegalileo.ai → stitch.withgoogle.com (Google Stitch). Galileo was acquired? Stitch is Google Labs. Recommend update website + description.

- **phind** (https://www.phind.com -> https://www.phind.com/) [dead] — 404 client error (404/410 likely dead)
  - desc: AI-powered search engine for developers that delivers technical answers and code solutions in seconds.
  - note: phind.com 404 in audit but phind.com may be blocking. Manual browser check shows Phind alive? Need manual verify — may be bot block disguised as 404.

- **poe** (https://poe.com -> https://poe.com/login?redirect_url=%2F) [alive] — 200 -> https://poe.com/login?redirect_url=%2F (redirects 1)
  - desc: Multi-model chat platform by Quora with access to Claude, GPT-4, Llama, and dozens of AI models in one interface.


- **tome** (https://tome.app -> https://tome.app/) [dead] — 404 client error (404/410 likely dead)
  - desc: AI-native presentation and storytelling tool for creating decks, docs, and product narratives from prompts.
  - note: Tome.app shut down Sep 2024. 404. Should remove or mark sunset. Keep for SEO? Better to remove — dead product trusts signal.

- **wan-video** (https://github.com/Wan-AI/Wan2.2 -> https://github.com/Wan-AI/Wan2.2) [dead] — 404 client error (404/410 likely dead)
  - desc: Alibaba's open-source AI video generation models using Mixture-of-Experts architecture for text-to-video and image-to-video synthesis.
  - note: GitHub path Wan-AI/Wan2.2 404 — repo now Wan-AI/Wan2.1 or Wan2.2 moved? Check latest tag.

- **windsurf** (https://windsurf.com -> https://devin.ai/desktop) [redirected] — Redirects to unrelated domain devin.ai from windsurf.com (200)
  - desc: AI-powered code editor with deep agentic capabilities for autonomous multi-file coding workflows.
  - note: Windsurf similarly redirects to devin.ai/desktop. Same acquisition.

## SEO Trade-off

Keeping 212 pages inflates 'directory of X tools' count (currently marketed as 212). Benefits:
- Long-tail SEO: each /tools/<slug>/ ranks for 'tool X alternative' queries even if tool is dead.
- Topical authority: raw count signals coverage, used in H1 'curated directory of 212 tools'.

Costs:
- Trust / bounce: user clicks to dead 404 / parked domain → high bounce, low dwell, hurts E-E-A-T.
- Google Helpful Content / quality rater: dead outbound links = thin aggregator signal.
- Maintenance drag: stale descriptions = misinformation when acquired (Codeium, Galileo).
- Index bloat: >15% dead = wasted crawl budget on 404s, sitemap with dead URLs triggers GSC warnings.

Recommendation: **curated-prune, not hard keep**. Policy:
- Immediate remove: 404/parked/ shutdown (Tome, confirmed parked).
- Update in place: rebrands where final_url is same product (AnythingLLM useanything.com → anythingllm.com, v0.dev → v0.app, runwayml.com → runway.com, etc) — just change website field, keep slug for SEO.
- Acquisition: if product sunset into acquiring product (Codeium/Windsurf → Devin, Galileo → Stitch), keep page but mark as 'Acquired / Now part of X' and point to successor, or merge listings.
- Keep but annotate: true 200-but-bot-blocked (Midjourney, Sora, Gemini) — keep, no action.
This keeps count ~210 but improves trust. Add 'Last verified: YYYY-MM-DD' front matter in future.

## Recommended Next Steps

**Batch 1 — Remove (high confidence dead):**
- `tome` — Tome shut down 2024, 404.
- `wan-video` — GitHub 404, path wrong; fix or remove.
- `phind` — verify manually in browser, if 404 then remove / update to new domain.
- `vedic-astrology-chart` — timeout, likely dead niche — manual check.

**Batch 2 — Update website field (safe auto-fix):**
- `anything-llm` useanything.com → anythingllm.com
- `v0` v0.dev → v0.app
- `runway` runwayml.com → runway.com
- `vercel-ai-sdk` sdk.vercel.ai → ai-sdk.dev
- `fathom` fathom.video → fathom.ai
- `flux` blackforestlabs.ai → bfl.ai
- `gpt4all` gpt4all.io → nomic.ai/gpt4all
- `notion-ai` notion.so → notion.com
- `playground-ai` playground.com → playgroundai.com
- `kling-ai` klingai.com → kling.ai
- `lex` lex.new → lex.page
- `intercom-fin` intercom.com/fin → fin.ai
- and 10 others listed in redirected table

**Batch 3 — Manual review acquisition / complex:**
- `codeium` + `windsurf` → Devin (acquisition). Decide: keep two pages and cross-link, or single Devin page with alias.
- `galileo-ai` → stitch.withgoogle.com — Google Stitch is successor, update.
- `anthropic-api` docs.anthropic.com → platform.claude.com — update.
- `claude-code` docs.anthropic.com → code.claude.com — update.
- `podcastle` → async.com — rebrand, verify.
- `roocode` → roomote.dev — rebrand.

**Process:**
1. Run `node validate.js` after each batch — website must be https, slug match.
2. `npm run generate-added-dates` after removals (tool_added_dates.yml currently 212 entries).
3. Rebuild sitemap: custom sitemap.xml will auto-exclude removed tools on next GHP build — verify 278→~210 URLs, no unescaped &.
4. Consider adding `sunset: true` front matter support for SEO-friendly 200 with 'This tool has shut down' banner instead of 404 — preserves link equity.

## Raw Results

Full JSON saved at `audit/results.json` (212 entries) and `audit/tools.json` for reproducibility.
