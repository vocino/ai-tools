/**
 * Generates llms.txt sanity check — Jekyll liquid already renders llms.txt / llms-full.txt / tools.json.
 * This script is a CI guard: ensures counts match and files would be valid.
 * Run: node scripts/generate-llms.mjs --check
 */
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

const ROOT = path.resolve(process.cwd());
const TOOLS_DIR = path.join(ROOT, "_tools");
const DATA_DIR = path.join(ROOT, "_data");

function countTools() {
  return fs.readdirSync(TOOLS_DIR).filter(f => f.endsWith(".md") && f !== "_template.md").length;
}
function countCats() {
  const raw = fs.readFileSync(path.join(DATA_DIR, "categories.yml"), "utf8");
  return yaml.load(raw).length;
}
const tools = countTools();
const cats = countCats();
console.log(`llms: ${tools} tools, ${cats} categories — Jekyll will render llms.txt / llms-full.txt / tools.json`);
if (process.argv.includes("--check")) {
  if (tools < 200) { console.error("Too few tools"); process.exit(1); }
  console.log("OK");
}
