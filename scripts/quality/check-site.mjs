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
const expectedHtmlFiles = new Set([
  ...routesMap.routes.filter((route) => route.status !== "retired").map((route) => path.normalize(routeFile(route.path))),
  path.normalize(path.join(siteRoot, "404.html")),
]);

for (const file of htmlFiles) {
  if (!expectedHtmlFiles.has(path.normalize(file))) fail(file, "HTML file is not registered in the route map or generated 404 surface.");
}

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

const robotsFile = path.join(siteRoot, "robots.txt");
const robots = await readFile(robotsFile, "utf8");
if (!/^Disallow:\s*\/nexus-lab\/$/m.test(robots)) fail(robotsFile, "Nexus Lab must be excluded from crawler discovery.");

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

const stylesManifestFile = path.join(siteRoot, "styles.css");
const stylesManifest = await readFile(stylesManifestFile, "utf8");
const manifestVersions = [...stylesManifest.matchAll(/@import\s+["'][^"']+\.css\?v=([^"']+)["']/g)].map((match) => match[1]);
const releaseVersions = new Set(manifestVersions);
if (manifestVersions.length !== 9) fail(stylesManifestFile, "every modular stylesheet must carry the release cache version.");

const controllerVersion = script.match(/nexus-controller\.js\?v=([^"']+)/)?.[1];
if (!controllerVersion) fail(scriptFile, "Nexus controller import is missing the release cache version.");
else releaseVersions.add(controllerVersion);

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  if (/http-equiv=["']refresh/i.test(html)) continue;
  const versions = [...html.matchAll(/(?:styles\.css|script\.js)\?v=([^"']+)/g)].map((match) => match[1]);
  if (versions.length !== 2) fail(file, "must version both the public stylesheet and script.");
  for (const version of versions) releaseVersions.add(version);
}

if (releaseVersions.size !== 1) {
  fail(stylesManifestFile, `asset cache versions are not synchronized: ${[...releaseVersions].sort().join(", ")}.`);
}

const nexusConfigFile = path.join(root, "config", "nexus-system.json");
const nexusConfig = JSON.parse(await readFile(nexusConfigFile, "utf8"));
const expectedModes = {
  observe: ["Observando", "observing", "observing"],
  organize: ["Ordenando", "thinking", "analyzing"],
  design: ["Diseñando", "designing", "designing"],
  build: ["Construyendo", "building", "building"],
  support: ["Acompañando", "support-neutral", "supporting"],
};
for (const [mode, expected] of Object.entries(expectedModes)) {
  const actual = nexusConfig.modes?.[mode];
  if (!actual || actual.label !== expected[0] || actual.expression !== expected[1] || actual.pose !== expected[2]) {
    fail(nexusConfigFile, `mode ${mode} does not match the canonical label, expression, and pose.`);
  }
}
const expectedExpressions = ["neutral", "happy", "curious", "thinking", "explaining", "greeting", "waiting", "confirming", "soft-alert", "empty", "processing", "celebration"];
if (JSON.stringify(nexusConfig.expressions) !== JSON.stringify(expectedExpressions)) fail(nexusConfigFile, "expression registry is incomplete or out of order.");
for (const asset of ["nexus-avatar-clean", "nexus-pose-designing", "nexus-pose-building", "nexus-face-support-neutral", "nexus-face-confirming", "nexus-face-soft-alert", "nexus-face-waiting"]) {
  if (!nexusConfig.assetRegistry?.[asset]) fail(nexusConfigFile, `asset registry is missing ${asset}.`);
}

const nexusCssFile = path.join(siteRoot, "styles", "nexus.css");
const nexusCss = await readFile(nexusCssFile, "utf8");
if (!/\[data-reveal\]\s*\{\s*opacity:\s*1;\s*transform:\s*none;/m.test(nexusCss)) fail(nexusCssFile, "reveal elements are not visible by default.");
if (!/@media\s+print,\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?\[data-reveal\][\s\S]*?opacity:\s*1\s*!important/m.test(nexusCss)) fail(nexusCssFile, "print/reduced-motion reveal fallback is missing.");
for (const pose of nexusConfig.poses ?? []) {
  if (!nexusCss.includes(`[data-nexus-pose="${pose}"]`)) fail(nexusCssFile, `registered Nexus pose ${pose} has no visual treatment.`);
}

const nexusControllerFile = path.join(siteRoot, "nexus-controller.js");
const nexusController = await readFile(nexusControllerFile, "utf8");
for (const required of ["!(\"IntersectionObserver\" in window)", "nexus-reveal-enabled", "nexus-static-fallback", "beforeprint", "nexus-method--selector-docked"]) {
  if (!nexusController.includes(required)) fail(nexusControllerFile, `missing resilient Nexus behavior ${required}.`);
}

const methodFile = path.join(siteRoot, "process", "index.html");
const method = await readFile(methodFile, "utf8");
const methodOrder = ["nexus-method-active-head", "nexus-method-stage", "nexus-method-detail", "nexus-method-steps"].map((token) => method.indexOf(token));
if (methodOrder.some((index) => index < 0) || methodOrder.some((index, position) => position > 0 && index <= methodOrder[position - 1])) {
  fail(methodFile, "mobile method source order must be active heading, Nexus, detail, then phase selector.");
}
for (const required of ["role=\"tablist\"", "role=\"tabpanel\"", "tabindex=\"-1\"", "aria-controls=\"nexus-method-panel\""]) {
  if (!method.includes(required)) fail(methodFile, `method explorer is missing ${required}.`);
}

for (const required of ["clearBriefStatus", "clearPanelErrors", "focusBriefStep", "aria-invalid", "dataset.briefAnnouncer"]) {
  if (!script.includes(required)) fail(scriptFile, `contact validation is missing ${required}.`);
}

if (failures.length) {
  console.error("YC Systems site quality check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`YC Systems site quality check passed (${htmlFiles.length} HTML files).`);
