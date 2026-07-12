import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("../..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const siteRoot = path.join(root, "site");
const ignoredDirs = new Set([".git", "android", "content", "dist", "meta", "node_modules", "output", "social", "tmp"]);
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

async function fileExists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

function routeToFile(routePath) {
  if (routePath === "/") return path.join(siteRoot, "index.html");
  return path.join(siteRoot, routePath.replace(/^\/|\/$/g, ""), "index.html");
}

function hasNoindex(text) {
  return /<meta[^>]+name=["']robots["'][^>]+content=["']noindex,\s*follow["']/i.test(text);
}

const files = await walk(siteRoot);
const htmlFiles = files.filter((file) => file.endsWith(".html"));
const textFiles = files.filter((file) => /\.(html|css|js|mjs|json|md|xml|txt)$/i.test(file));
const publicScript = path.join(siteRoot, "script.js");

for (const file of htmlFiles) {
  const text = await readFile(file, "utf8");

  const headingWithPeriod = text.match(/<h[1-3][^>]*>[^<]*\.\s*<\/h[1-3]>/i);
  if (headingWithPeriod) {
    fail(file, `heading ends with a period: ${headingWithPeriod[0]}`);
  }

  if (text.includes('aria-label="Switch to English"')) {
    fail(file, 'Spanish default page uses aria-label="Switch to English"; use Spanish text.');
  }

  if (/href=["'][^"']*services\//i.test(text)) {
    fail(file, "navigation or links still point to the legacy /services/ route.");
  }

  if (!/[/\\](projects|about)[/\\]index\.html$/i.test(file) && /href=["'][^"']*projects\//i.test(text)) {
    fail(file, "links still point to the legacy /projects/ route; use /case-studies/.");
  }

  for (const oldLabel of ["Servicios", "Trabajo de clientes", "Cómo construimos", "Propuesta"]) {
    if (text.includes(`>${oldLabel}</a>`)) {
      fail(file, `old navigation label remains: ${oldLabel}`);
    }
  }

  for (const oldVisibleCopy of ["Trabajo de clientes | YC Systems", "Ver proyectos activos"]) {
    if (text.includes(oldVisibleCopy)) {
      fail(file, `old case-study copy remains: ${oldVisibleCopy}`);
    }
  }
}

const publicExposureRules = [
  {
    pattern: /github\.com\/Ycastillog|GitHub|data-yc-contact-github|YC_CONTACT\.github/i,
    message: "public site exposes GitHub or repository contact details.",
  },
  {
    pattern: /\b(repo|repos|repositorio|repositorios|repository|repositories)\b/i,
    message: "public site mentions repositories; keep source-control details out of customer-facing copy.",
  },
  {
    pattern: /\b(deploy|deploys|commit)\b|GitHub Pages|Netlify|Vercel/i,
    message: "public site mentions deployment internals or hosting providers.",
  },
  {
    pattern: /despliegue privado|despliegues privados|l[ií]nea privada|private deployment|private product line/i,
    message: "public product copy uses private/internal wording; use controlled access or selected implementation language.",
  },
  {
    pattern: /\bEIN\b|Operating Agreement|direcci[oó]n personal|porcentajes societarios|ownership percentages|unprotected products/i,
    message: "public site mentions sensitive legal or ownership details.",
  },
  {
    pattern: /demo\s+SaaS|vertical\s+MVP|prototipo en desarrollo|MVP operativo|ecosistema demo/i,
    message: "public product copy uses demo/prototype wording; use controlled access and phased implementation language.",
  },
];

for (const file of [...htmlFiles, publicScript]) {
  const text = await readFile(file, "utf8");
  for (const rule of publicExposureRules) {
    if (rule.pattern.test(text)) {
      fail(file, rule.message);
    }
  }
}

const brokenEncodingPattern = new RegExp(
  [
    "Diagn\\?stico",
    "diagn\\?stico",
    "M\\?todo",
    "m\\?todo",
    "C\\?mo",
    "c\\?mo",
    "Automatizaci\\?n",
    "automatizaci\\?n",
    "operaci\\?n",
    "publicaci\\?n",
    "implementaci\\?n",
    "documentaci\\?n",
    "evaluaci\\?n",
    "comunicaci\\?n",
    "soluci\\?n",
    "L\\?nea",
    "l\\?nea",
    "r\\?pidos",
    "anal\\?tica",
    "est\\?n",
    "tecnolog\\?a",
    String.fromCharCode(0xc3),
    String.fromCharCode(0xc2),
  ].join("|"),
);

for (const file of textFiles) {
  const text = await readFile(file, "utf8");
  if (brokenEncodingPattern.test(text)) {
    fail(file, "text contains mojibake or replacement characters.");
  }
}

const routesMapPath = path.join(root, "config", "routes-map.json");
const routesMap = JSON.parse(await readFile(routesMapPath, "utf8"));
const routes = routesMap.routes ?? [];

const sitemap = path.join(siteRoot, "sitemap.xml");
const sitemapText = await readFile(sitemap, "utf8");
const sitemapUrls = new Set([...sitemapText.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]));
const expectedSitemapUrls = new Set(
  routes
    .filter((route) => route.sitemap)
    .map((route) => `https://ycsystems.io${route.path}`),
);

for (const expectedUrl of expectedSitemapUrls) {
  if (!sitemapUrls.has(expectedUrl)) {
    fail(sitemap, `missing canonical URL ${expectedUrl}`);
  }
}

for (const url of sitemapUrls) {
  if (!expectedSitemapUrls.has(url)) {
    fail(sitemap, `URL is not approved by routes-map.json: ${url}`);
  }
}

for (const route of routes) {
  const file = routeToFile(route.path);
  if (!(await fileExists(file))) continue;

  const text = await readFile(file, "utf8");
  if (route.index === false && !hasNoindex(text)) {
    fail(file, `${route.path} is non-indexable in routes-map.json but is missing noindex.`);
  }

  if (route.index === true && hasNoindex(text)) {
    fail(file, `${route.path} is indexable in routes-map.json but has noindex.`);
  }

  if (route.status === "legacy-redirect" && route.target && !text.includes(route.target)) {
    fail(file, `${route.path} legacy redirect does not point to ${route.target}.`);
  }
}

const script = publicScript;
const scriptText = await readFile(script, "utf8");
if (/style\.setProperty\([^)]*,\s*["']important["']\s*\)/.test(scriptText)) {
  fail(script, "avoid runtime CSS overrides with style.setProperty(..., \"important\").");
}

if (scriptText.includes('href.includes("projects")')) {
  fail(script, "CTA analytics still tracks the legacy /projects/ route instead of /case-studies/.");
}

if (scriptText.includes("yc-last-event")) {
  fail(script, "analytics events must not be persisted in localStorage as yc-last-event.");
}

if (scriptText.includes("installFloatingProposalCta") || scriptText.includes("floating-proposal-cta")) {
  fail(script, "only the concept chat floating conversion widget should be installed.");
}

if (scriptText.includes("Enviar por Gmail")) {
  fail(script, 'use neutral email copy instead of "Enviar por Gmail".');
}

if (scriptText.includes('<pre class="chat-summary">${summary}</pre>')) {
  fail(script, "chat summary must be assigned with textContent, not interpolated into innerHTML.");
}

for (const staleCopy of [
  "YC Systems construye productos de software que resuelven problemas operativos reales.",
  "Un proceso simple desde la idea hasta el lanzamiento.",
  '"nav.products": "Proyectos"',
  '"products.eyebrow": "Trabajos de desarrollo"',
  "Trabajo de clientes",
  "Ver trabajo de clientes",
  "Empresa de producto + trabajo de clientes",
  "Productos propios, trabajo de clientes, procesos reales y activos publicados verificables.",
]) {
  if (scriptText.includes(staleCopy)) {
    fail(script, `stale copy remains in script.js: ${staleCopy}`);
  }
}

const contact = path.join(siteRoot, "contact", "index.html");
const contactText = await readFile(contact, "utf8");
if (/name=["']_captcha["'][^>]+value=["']false["']/i.test(contactText)) {
  fail(contact, "FormSubmit captcha is disabled; remove _captcha=false or replace the form endpoint.");
}

if (contactText.includes("formsubmit.co") && !contactText.includes("FormSubmit")) {
  fail(contact, "FormSubmit forms must disclose FormSubmit before submission.");
}

if (/brief directo|diagn[oó]stico directo/i.test(contactText)) {
  fail(contact, "FormSubmit forms must not describe submissions as direct to YC Systems.");
}

const privacy = path.join(siteRoot, "privacy", "index.html");
const privacyText = await readFile(privacy, "utf8");
if (!privacyText.includes("FormSubmit")) {
  fail(privacy, "privacy policy must name FormSubmit while the contact form uses it.");
}

if (!privacyText.includes("yc-lang") || !privacyText.includes("localStorage")) {
  fail(privacy, "privacy policy must disclose localStorage language preference.");
}

if (failures.length) {
  console.error("YC Systems site quality check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("YC Systems site quality check passed.");
