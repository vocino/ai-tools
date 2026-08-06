const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const TOOLS_DIR = path.join(__dirname, "_tools");
const DATA_DIR = path.join(__dirname, "_data");

const REQUIRED_FIELDS = ["name", "slug", "website", "description", "categories", "use_cases", "modalities", "pricing", "api", "self_hosted"];
const PRICING_VALUES = ["free", "freemium", "paid", "open-source"];
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function loadTaxonomy(filename) {
  const raw = fs.readFileSync(path.join(DATA_DIR, filename), "utf8");
  return yaml.load(raw).map(function (item) { return item.slug; });
}

function extractFrontMatter(content) {
  const normalized = content.replace(/\r\n/g, "\n");
  const match = normalized.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  return yaml.load(match[1]);
}

function validate() {
  const categories = loadTaxonomy("categories.yml");
  const useCases = loadTaxonomy("use_cases.yml");
  const modalities = loadTaxonomy("modalities.yml");

  const files = fs.readdirSync(TOOLS_DIR).filter(function (f) {
    return f.endsWith(".md") && f !== "_template.md";
  });

  let errors = [];

  files.forEach(function (file) {
    const filePath = path.join(TOOLS_DIR, file);
    const content = fs.readFileSync(filePath, "utf8");
    const fm = extractFrontMatter(content);

    if (!fm) {
      errors.push(file + ": Missing or invalid YAML front matter");
      return;
    }

    REQUIRED_FIELDS.forEach(function (field) {
      if (fm[field] === undefined || fm[field] === null || fm[field] === "") {
        errors.push(file + ": Missing required field '" + field + "'");
      }
    });

    if (fm.slug && fm.slug + ".md" !== file) {
      errors.push(file + ": Filename must match slug (expected '" + fm.slug + ".md')");
    }

    if (fm.slug && !SLUG_RE.test(fm.slug)) {
      errors.push(file + ": Invalid slug '" + fm.slug + "' — must be lowercase hyphenated (a-z0-9-)");
    }

    if (fm.website) {
      try {
        var u = new URL(fm.website);
        if (u.protocol !== "https:" && u.protocol !== "http:") {
          errors.push(file + ": website must be http(s) — got '" + fm.website + "'");
        } else if (u.protocol !== "https:") {
          // warn but allow http — prefer https
          errors.push(file + ": website should use https — got '" + fm.website + "'");
        }
        if (fm.website.indexOf("javascript:") !== -1 || fm.website.indexOf("data:") !== -1) {
          errors.push(file + ": website contains disallowed scheme");
        }
      } catch (_e) {
        errors.push(file + ": Invalid website URL '" + fm.website + "'");
      }
    }

    if (fm.pricing && PRICING_VALUES.indexOf(fm.pricing) === -1) {
      errors.push(file + ": Invalid pricing '" + fm.pricing + "'. Must be one of: " + PRICING_VALUES.join(", "));
    }

    if (fm.categories && Array.isArray(fm.categories)) {
      fm.categories.forEach(function (cat) {
        if (categories.indexOf(cat) === -1) {
          errors.push(file + ": Unknown category '" + cat + "'");
        }
      });
    }

    if (fm.use_cases && Array.isArray(fm.use_cases)) {
      fm.use_cases.forEach(function (uc) {
        if (useCases.indexOf(uc) === -1) {
          errors.push(file + ": Unknown use_case '" + uc + "'");
        }
      });
    }

    if (fm.modalities && Array.isArray(fm.modalities)) {
      fm.modalities.forEach(function (mod) {
        if (modalities.indexOf(mod) === -1) {
          errors.push(file + ": Unknown modality '" + mod + "'");
        }
      });
    }

    if (fm.description && fm.description.length > 160) {
      errors.push(file + ": Description exceeds 160 characters (" + fm.description.length + ")");
    }

    // taxonomy length guards
    if (fm.categories && Array.isArray(fm.categories) && fm.categories.length > 3) {
      errors.push(file + ": categories must be 1–3 (got " + fm.categories.length + ")");
    }
    if (fm.use_cases && Array.isArray(fm.use_cases) && fm.use_cases.length > 3) {
      errors.push(file + ": use_cases must be 1–3 (got " + fm.use_cases.length + ")");
    }
    if (fm.modalities && Array.isArray(fm.modalities) && fm.modalities.length > 5) {
      errors.push(file + ": modalities must be 1–5 (got " + fm.modalities.length + ")");
    }
    if (fm.api !== undefined && typeof fm.api !== "boolean") {
      errors.push(file + ": api must be boolean");
    }
    if (fm.self_hosted !== undefined && typeof fm.self_hosted !== "boolean") {
      errors.push(file + ": self_hosted must be boolean");
    }
  });

  // soft warnings (not failing)
  var warnings = [];
  files.forEach(function (file) {
    var raw = fs.readFileSync(path.join(TOOLS_DIR, file), "utf8");
    var fm = extractFrontMatter(raw);
    if (!fm) return;
    if (fm.description && fm.description.length < 80) {
      warnings.push(file + ": Description short (" + fm.description.length + " chars) — aim 120–160 for SEO");
    }
    if (fm.description && fm.description.length > 140 && fm.description.length <= 160) {
      // near-limit notice — not error
    }
  });

  // Evergreen guard: tool_added_dates.yml freshness (prevents stale “Latest” sort like the 211 → 200+ churn fix)
  try {
    var datesPath = path.join(DATA_DIR, "tool_added_dates.yml");
    if (fs.existsSync(datesPath)) {
      var datesContent = fs.readFileSync(datesPath, "utf8");
      var datesData = yaml.load(datesContent) || {};
      var dateCount = Object.keys(datesData).length;
      if (dateCount !== files.length) {
        warnings.push("tool_added_dates.yml has " + dateCount + " entries but _tools has " + files.length + " files — run node scripts/generate-added-dates.js");
      }
      files.forEach(function (f) {
        var slug = f.replace(/\.md$/, "");
        if (!datesData[slug]) {
          warnings.push(f + ": missing entry in tool_added_dates.yml — run generate-added-dates");
        }
      });
    } else {
      warnings.push("tool_added_dates.yml missing — run node scripts/generate-added-dates.js");
    }
  } catch (_e) {
    warnings.push("could not check tool_added_dates.yml freshness: " + _e.message);
  }

  if (errors.length > 0) {
    console.error("Validation failed with " + errors.length + " error(s):\n");
    errors.forEach(function (e) { console.error("  - " + e); });
    if (warnings.length) {
      console.error("\nWarnings (" + warnings.length + "):");
      warnings.slice(0, 20).forEach(function (w) { console.error("  ! " + w); });
      if (warnings.length > 20) console.error("  ... and " + (warnings.length - 20) + " more");
    }
    process.exit(1);
  } else {
    console.log("All " + files.length + " tool listings are valid.");
    if (warnings.length) {
      console.log("\nWarnings (" + warnings.length + "):");
      warnings.slice(0, 20).forEach(function (w) { console.log("  ! " + w); });
      if (warnings.length > 20) console.log("  ... and " + (warnings.length - 20) + " more");
    }
  }
}

validate();
