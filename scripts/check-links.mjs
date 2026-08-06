/**
 * Advisory link checker for _tools/*.md websites.
 * No failure on broken links — reports only. Intended for weekly cron (`link-check.yml`).
 * Usage: node scripts/check-links.mjs [--check=10] [--timeout=15000]
 */
import fs from "fs";
import path from "path";
import yaml from "js-yaml";

const TOOLS_DIR = path.join(process.cwd(), "_tools");
const TIMEOUT_MS = 15000;
const CONCURRENCY = 10;
const ALLOW = new Set([
  // add domains known to block bots if needed
]);

function extractFrontMatter(content) {
  const m = content.replace(/\r\n/g, "\n").match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  return yaml.load(m[1]);
}

async function checkUrl(url) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    let res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "ai.vocino.com-link-check/1.0 (+https://ai.vocino.com)" },
    });
    if (!res.ok && (res.status === 405 || res.status === 403)) {
      res = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: { "User-Agent": "ai.vocino.com-link-check/1.0 (+https://ai.vocino.com)" },
      });
    }
    return { ok: res.ok, status: res.status };
  } catch (e) {
    return { ok: false, status: 0, error: e.message || String(e) };
  } finally {
    clearTimeout(t);
  }
}

async function main() {
  const args = Object.fromEntries(process.argv.slice(2).map(a => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? "true"];
  }));
  const limit = args.check ? parseInt(args.check, 10) : Infinity;

  const files = fs.readdirSync(TOOLS_DIR).filter(f => f.endsWith(".md") && f !== "_template.md");
  const entries = files.map(f => {
    const fm = extractFrontMatter(fs.readFileSync(path.join(TOOLS_DIR, f), "utf8"));
    return fm ? { file: f, slug: fm.slug, name: fm.name, website: fm.website } : null;
  }).filter(Boolean).filter(e => e.website && !ALLOW.has(new URL(e.website).hostname));

  const sample = entries.slice(0, limit);
  console.log(`Checking ${sample.length} of ${entries.length} tools (concurrency ${CONCURRENCY}, timeout ${TIMEOUT_MS}ms)`);

  let ok = 0, fail = 0;
  const failures = [];
  let idx = 0;

  async function worker() {
    while (idx < sample.length) {
      const entry = sample[idx++];
      const res = await checkUrl(entry.website);
      if (res.ok) {
        ok++;
        process.stdout.write(".");
      } else {
        fail++;
        process.stdout.write("x");
        failures.push({ ...entry, status: res.status, error: res.error || "" });
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, sample.length) }, worker));
  console.log(`\nOK: ${ok}  Fail: ${fail}`);

  if (failures.length) {
    console.log("\nFailures:");
    failures.forEach(f => console.log(`  - ${f.slug} (${f.name}): ${f.website} → ${f.status}${f.error ? " " + f.error : ""}`));
    // summary file for GH Actions
    if (process.env.GITHUB_STEP_SUMMARY) {
      fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `## Link check: ${fail} failures\n\n` + failures.map(f => `- **${f.slug}** ${f.website} → ${f.status} ${f.error}`).join("\n") + "\n");
    }
  }

  // advisory only — never exit 1 unless --strict
  if (args.strict && fail > 0) process.exit(1);
}

main();
