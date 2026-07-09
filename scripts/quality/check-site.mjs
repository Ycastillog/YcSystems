import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("../..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const ignoredDirs = new Set([".git", "dist", "node_modules", "output"]);
const failures = [];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!ignoredDirs.has(entry.name)) {
        files.push(...await walk(path.join(dir, entry.name)));
      }
    } else {
      files.push(path.join(dir, entry.name));
    }
  }

  return files;
}

function rel(file) {
  return path.relative(root, file).replaceAll(path.sep, "/");
}

function fail(file, message) {
  failures.push(`${rel(file)}: ${message}`);
}

const files = await walk(root);
const htmlFiles = files.filter((file) => file.endsWith(".html"));

for (const file of htmlFiles) {
  const text = await readFile(file, "utf8");

  const headingWithPeriod = text.match(/<h[1-3][^>]*>[^<]*\.\s*<\/h[1-3]>/i);
  if (headingWithPeriod) {
    fail(file, `heading ends with a period: ${headingWithPeriod[0]}`);
  }

  if (text.includes('aria-label="Switch to English"')) {
    fail(file, 'Spanish default page uses aria-label="Switch to English"; use "Cambiar a inglés".');
  }
}

const processPage = path.join(root, "process", "index.html");
const processText = await readFile(processPage, "utf8");
if (processText.includes('content="noindex, follow"')) {
  fail(processPage, "/process/ is in primary navigation and sitemap, so it must be indexable.");
}

const sitemap = path.join(root, "sitemap.xml");
const sitemapText = await readFile(sitemap, "utf8");
for (const requiredUrl of [
  "https://ycsystems.io/operating-systems/",
  "https://ycsystems.io/industries/",
  "https://ycsystems.io/process/",
]) {
  if (!sitemapText.includes(`<loc>${requiredUrl}</loc>`)) {
    fail(sitemap, `missing canonical URL ${requiredUrl}`);
  }
}

const script = path.join(root, "script.js");
const scriptText = await readFile(script, "utf8");
if (/style\.setProperty\([^)]*,\s*["']important["']\s*\)/.test(scriptText)) {
  fail(script, "avoid runtime CSS overrides with style.setProperty(..., \"important\").");
}

if (failures.length) {
  console.error("YC Systems site quality check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("YC Systems site quality check passed.");
