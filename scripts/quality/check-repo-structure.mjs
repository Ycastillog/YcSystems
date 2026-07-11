import { execFileSync } from "node:child_process";
import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("../..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const siteRoot = path.join(root, "site");
const failures = [];
const ignoredDirs = new Set([".git", ".cache", "dist", "node_modules", "output", "tmp"]);
const textExtensions = new Set([".css", ".html", ".js", ".json", ".md", ".mjs", ".txt", ".xml", ".yml", ".yaml"]);
const replacementChar = String.fromCharCode(0xfffd);

function rel(file) {
  return path.relative(root, file).replaceAll(path.sep, "/");
}

function fail(message) {
  failures.push(message);
}

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!ignoredDirs.has(entry.name)) {
        files.push(...await walk(path.join(dir, entry.name)));
      }
      continue;
    }

    files.push(path.join(dir, entry.name));
  }

  return files;
}

function gitLsFiles(args = []) {
  return execFileSync("git", ["ls-files", ...args], { cwd: root, encoding: "utf8" })
    .split(/\r?\n/)
    .filter(Boolean);
}

const rootLegacy = path.join(root, "styles.legacy.css");
const siteLegacy = path.join(siteRoot, "styles.legacy.css");
const quarantinedLegacy = path.join(siteRoot, "styles", "legacy-quarantine.css");
const stylesManifest = path.join(siteRoot, "styles.css");
const envExample = path.join(root, ".env.example");
const workflow = path.join(root, ".github", "workflows", "deploy-pages.yml");
const publicRootEntries = [
  "about",
  "ai-automation",
  "assets",
  "brands",
  "brokercontrol",
  "careers",
  "case-studies",
  "cleanloop",
  "company",
  "contact",
  "crm-development",
  "custom-software",
  "dashboard-development",
  "developers",
  "documentation",
  "documents",
  "ghostwear",
  "index.html",
  "industries",
  "internal-systems",
  "mvp-development",
  "operating-systems",
  "partners",
  "press",
  "privacy",
  "process",
  "products",
  "projects",
  "robots.txt",
  "saas-development",
  "script.js",
  "services",
  "site.webmanifest",
  "sitemap.xml",
  "soc",
  "solutions",
  "start",
  "styles.css",
  "styles",
  "technology",
  "terms",
  "trust-center",
];

for (const entry of publicRootEntries) {
  if (await exists(path.join(root, entry))) {
    fail(`${entry} must live under site/, not the repository root.`);
  }
}

if (await exists(rootLegacy)) {
  fail("styles.legacy.css must not live in the repository root. Use styles/legacy-quarantine.css.");
}

if (await exists(siteLegacy)) {
  fail("site/styles.legacy.css must not exist. Use site/styles/legacy-quarantine.css.");
}

if (!(await exists(quarantinedLegacy))) {
  fail("site/styles/legacy-quarantine.css is missing.");
}

if (!(await exists(envExample))) {
  fail(".env.example is missing.");
}

const stylesManifestText = await readFile(stylesManifest, "utf8");
if (!stylesManifestText.includes("./styles/legacy-quarantine.css")) {
  fail("styles.css must import ./styles/legacy-quarantine.css while migration is active.");
}

if (stylesManifestText.includes("./styles.legacy.css")) {
  fail("styles.css still imports the root legacy stylesheet.");
}

for (const file of [
  "styles/tokens.css",
  "styles/reset.css",
  "styles/base.css",
  "styles/layout.css",
  "styles/components.css",
  "styles/pages.css",
  "styles/utilities.css",
  "styles/responsive.css",
]) {
  if (!stylesManifestText.includes(`./${file}`)) {
    fail(`styles.css is missing ${file}.`);
  }
}

const trackedEnvFiles = gitLsFiles([".env", ".env.*"]).filter((file) => file !== ".env.example");
if (trackedEnvFiles.length) {
  fail(`tracked environment files are not allowed: ${trackedEnvFiles.join(", ")}`);
}

const workflowText = await readFile(workflow, "utf8");
if (!workflowText.includes("cp -R site/. dist/")) {
  fail("GitHub Pages workflow must publish from site/ into dist.");
}

if (!workflowText.includes("check-repo-structure.mjs") || !workflowText.includes("check-site.mjs")) {
  fail("GitHub Pages workflow must run both repo and site quality checks.");
}

const trackedFiles = gitLsFiles();
const secretPatterns = [
  /\bMETA_PAGE_ACCESS_TOKEN\s*=\s*\S+/i,
  /\bMETA_APP_SECRET\s*=\s*\S+/i,
  /\b[A-Z0-9_]*(TOKEN|SECRET|PASSWORD|PRIVATE_KEY)\s*=\s*["']?[A-Za-z0-9_\-./+=]{12,}/i,
  /-----BEGIN (RSA |EC |OPENSSH |)PRIVATE KEY-----/,
  /\bsk-[A-Za-z0-9_-]{20,}/,
  /\bghp_[A-Za-z0-9]{20,}/,
  /\bEAGA[A-Za-z0-9_-]{20,}/,
];

for (const file of trackedFiles) {
  const fullPath = path.join(root, file);
  if (!textExtensions.has(path.extname(file).toLowerCase())) continue;

  const text = await readFile(fullPath, "utf8");
  if (text.includes(replacementChar)) {
    fail(`${file} contains replacement characters.`);
  }

  if (file !== ".env.example") {
    for (const pattern of secretPatterns) {
      if (pattern.test(text)) {
        fail(`${file} appears to contain a secret or credential.`);
        break;
      }
    }
  }
}

const allFiles = await walk(root);
for (const file of allFiles) {
  if (!textExtensions.has(path.extname(file).toLowerCase())) continue;
  const text = await readFile(file, "utf8");

  if (text.includes(replacementChar)) {
    fail(`${rel(file)} contains replacement characters.`);
  }
}

if (failures.length) {
  console.error("YC Systems repository structure check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("YC Systems repository structure check passed.");
