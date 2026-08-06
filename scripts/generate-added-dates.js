/**
 * Generates _data/tool_added_dates.yml from git history (deterministic) with mtime fallback.
 * Used for the "Latest" sort on the site. Run before `jekyll build` (or in CI).
 * GitHub Pages does not run custom plugins, so this data file is required.
 * Prefers `git log --follow --diff-filter=A` (first addition), falls back to mtime for untracked files.
 */
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const child_process = require("child_process");

const TOOLS_DIR = path.join(__dirname, "..", "_tools");
const DATA_DIR = path.join(__dirname, "..", "_data");
const OUT_FILE = path.join(DATA_DIR, "tool_added_dates.yml");

function getGitAddedDate(relativePath) {
  try {
    var cmd = 'git log --diff-filter=A --follow --format=%ad --date=short -- "' + relativePath.replace(/"/g, '\\"') + '"';
    var out = child_process.execSync(cmd, { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }).trim();
    if (!out) return null;
    var lines = out.split("\n").filter(Boolean);
    var first = lines[lines.length - 1].trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(first)) return first;
  } catch (_e) {}
  return null;
}

const files = fs.readdirSync(TOOLS_DIR).filter(function (f) {
  return f.endsWith(".md") && f !== "_template.md";
});

const dates = {};
files.forEach(function (file) {
  var slug = path.basename(file, ".md");
  var filePath = path.join(TOOLS_DIR, file);
  var relPath = path.join("_tools", file);
  var gitDate = getGitAddedDate(relPath);
  if (gitDate) {
    dates[slug] = gitDate;
  } else {
    var stat = fs.statSync(filePath);
    dates[slug] = stat.mtime.toISOString().slice(0, 10);
  }
});

// deterministic sorted output
var sorted = {};
Object.keys(dates).sort().forEach(function (k) { sorted[k] = dates[k]; });

var yamlOut = yaml.dump(sorted, { lineWidth: -1, sortKeys: true });
fs.mkdirSync(DATA_DIR, { recursive: true });
fs.writeFileSync(OUT_FILE, yamlOut, "utf8");
console.log("Wrote " + Object.keys(sorted).length + " entries to " + OUT_FILE);
