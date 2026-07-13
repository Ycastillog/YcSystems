import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const siteRoot = path.join(root, "site");
const routesMap = JSON.parse(await readFile(path.join(root, "config", "routes-map.json"), "utf8"));
const failures = [];

async function exists(file) {
  try { await access(file); return true; } catch { return false; }
}

async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(target));
    else files.push(target);
  }
  return files;
}

function relative(file) {
  return path.relative(root, file).replaceAll(path.sep, "/");
}

function fail(file, message) {
  failures.push(`${relative(file)}: ${message}`);
}

function routeFile(route) {
  return route === "/" ? path.join(siteRoot, "index.html") : path.join(siteRoot, route.replace(/^\//, ""), "index.html");
}

function count(text, pattern) {
  return [...text.matchAll(pattern)].length;
}

function visibleText(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
}

const files = await walk(siteRoot);
const htmlFiles = files.filter((file) => file.endsWith(".html"));
const textFiles = files.filter((file) => /\.(html|css|js|mjs|json|md|xml|txt)$/i.test(file));

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  const isRedirect = /http-equiv=["']refresh/i.test(html);

  if (!/<html\s+lang=["']es["']/i.test(html)) fail(file, "missing Spanish document language.");
  if (!/<meta\s+name=["']viewport["'][^>]+width=device-width/i.test(html)) fail(file, "missing responsive viewport.");
  if (!/<title>[^<]+<\/title>/i.test(html)) fail(file, "missing title.");
  if (!/<link\s+rel=["']canonical["']/i.test(html)) fail(file, "missing canonical URL.");

  if (!isRedirect) {
    if (count(html, /<main\b/gi) !== 1) fail(file, "must contain exactly one main element.");
    if (count(html, /<h1\b/gi) !== 1) fail(file, "must contain exactly one h1.");
    if (!/<meta\s+name=["']description["']/i.test(html)) fail(file, "missing meta description.");
    if (!/class=["'][^"']*skip-link/i.test(html)) fail(file, "missing skip link.");
  }

  for (const match of html.matchAll(/<img\b([^>]*)>/gi)) {
    const attributes = match[1];
    if (!/\balt=["'][^"']*["']/i.test(attributes)) fail(file, "image is missing alt text.");
    if (!/\bwidth=["']\d+["']/i.test(attributes) || !/\bheight=["']\d+["']/i.test(attributes)) fail(file, "image is missing intrinsic dimensions.");
  }

  const visible = visibleText(html);
  for (const term of ["responsive", "Dashboard", "Dashboards", "Pipeline", "Workflow"]) {
    if (new RegExp(`\\b${term}\\b`, "i").test(visible)) fail(file, `customer-facing copy contains ${term}.`);
  }
  if (/<h[1-3][^>]*>[^<]*\.\s*<\/h[1-3]>/i.test(html)) fail(file, "heading ends with a period.");
  if (/\bEN\b/.test(visible) || /Switch to English/i.test(html)) fail(file, "incomplete English control is public.");

  const references = [...html.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)].map((match) => match[1]);
  for (const reference of references) {
    if (/^(?:https?:|mailto:|tel:|data:|#)/i.test(reference)) continue;
    const clean = decodeURIComponent(reference.split(/[?#]/)[0]);
    if (!clean) continue;
    const base = clean.startsWith("/") ? siteRoot : path.dirname(file);
    let target = path.resolve(base, clean.replace(/^\//, ""));
    if (clean.endsWith("/")) target = path.join(target, "index.html");
    if (!(await exists(target))) fail(file, `broken local reference ${reference}`);
  }
}

const exposureRules = [
  [/github\.com\/Ycastillog|\bGitHub\b/i, "exposes GitHub or repository details."],
  [/\b(repo|repositorio|repository|commit|deploy)\b|GitHub Pages|Netlify|Vercel/i, "exposes source-control or hosting internals."],
  [/\bEIN\b|Operating Agreement|porcentajes societarios|ownership percentages/i, "exposes sensitive legal or ownership details."],
];

for (const file of htmlFiles) {
  const visible = visibleText(await readFile(file, "utf8"));
  for (const [pattern, message] of exposureRules) if (pattern.test(visible)) fail(file, message);
}

for (const file of textFiles) {
  const text = await readFile(file, "utf8");
  const suspiciousEncoding = [0xc3, 0xc2, 0xfffd].some((code) => text.includes(String.fromCharCode(code)));
  if (suspiciousEncoding) fail(file, "contains mojibake or replacement characters.");
}

const sitemapFile = path.join(siteRoot, "sitemap.xml");
const sitemap = await readFile(sitemapFile, "utf8");
const actualUrls = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]));
const expectedUrls = new Set(routesMap.routes.filter((route) => route.sitemap).map((route) => `https://ycsystems.io${route.path}`));
for (const url of expectedUrls) if (!actualUrls.has(url)) fail(sitemapFile, `missing ${url}.`);
for (const url of actualUrls) if (!expectedUrls.has(url)) fail(sitemapFile, `unapproved URL ${url}.`);

for (const route of routesMap.routes) {
  const file = routeFile(route.path);
  const fileExists = await exists(file);
  if (route.status === "retired") {
    if (fileExists) fail(file, "retired route still has a public file.");
    continue;
  }
  if (!fileExists) {
    fail(file, "registered route was not generated.");
    continue;
  }

  const html = await readFile(file, "utf8");
  const hasNoindex = /name=["']robots["'][^>]+noindex/i.test(html);
  if (route.indexable === false && !hasNoindex) fail(file, "non-indexable route is missing noindex.");
  if (route.indexable === true && hasNoindex) fail(file, "indexable route has noindex.");
  if (route.status === "redirect" && !html.includes(route.redirectTo)) fail(file, `redirect does not point to ${route.redirectTo}.`);
}

const contactFile = path.join(siteRoot, "contact", "index.html");
const contact = await readFile(contactFile, "utf8");
for (const required of ["_honey", "source_product", "source_path", "name=\"consent\"", "data-brief-status", "data-brief-success"]) {
  if (!contact.includes(required)) fail(contactFile, `contact form is missing ${required}.`);
}
if (visibleText(contact).includes("FormSubmit")) fail(contactFile, "commercial page exposes the form provider.");

const privacyFile = path.join(siteRoot, "privacy", "index.html");
if (!visibleText(await readFile(privacyFile, "utf8")).includes("FormSubmit")) fail(privacyFile, "privacy policy must name the form provider.");

const notFound = path.join(siteRoot, "404.html");
if (!(await exists(notFound))) fail(notFound, "missing branded 404 page.");

const scriptFile = path.join(siteRoot, "script.js");
const script = await readFile(scriptFile, "utf8");
for (const required of ["briefSending", "data-source-product", "formsubmit.co/ajax/", "aria-live"]) {
  if (!script.includes(required) && !contact.includes(required)) fail(scriptFile, `missing form behavior ${required}.`);
}
if (/style\.setProperty\([^)]*,\s*["']important["']\s*\)/.test(script)) fail(scriptFile, "uses runtime !important overrides.");

if (failures.length) {
  console.error("YC Systems site quality check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`YC Systems site quality check passed (${htmlFiles.length} HTML files).`);
