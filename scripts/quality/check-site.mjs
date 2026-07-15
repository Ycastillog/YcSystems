import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const siteRoot = path.join(root, "site");
const routesMap = JSON.parse(await readFile(path.join(root, "config", "routes-map.json"), "utf8"));
const content = JSON.parse(await readFile(path.join(siteRoot, "data", "site-content.json"), "utf8"));
const siteUrl = content.brand.siteUrl.replace(/\/$/, "");
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

function tagAttributes(html, tagName) {
  return [...html.matchAll(new RegExp(`<${tagName}\\b([^>]*)>`, "gi"))].map((match) => match[1]);
}

function attribute(attributes, name) {
  return attributes.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']*)["']`, "i"))?.[1];
}

function relTokens(attributes) {
  return new Set((attribute(attributes, "rel") || "").toLowerCase().split(/\s+/).filter(Boolean));
}

function metaContents(html, key, value) {
  return tagAttributes(html, "meta")
    .filter((attributes) => attribute(attributes, key)?.toLowerCase() === value.toLowerCase())
    .map((attributes) => attribute(attributes, "content"));
}

function canonicalHrefs(html) {
  return tagAttributes(html, "link")
    .filter((attributes) => relTokens(attributes).has("canonical"))
    .map((attributes) => attribute(attributes, "href"));
}

function validateMetadata(file, html, expectedCanonical, isRedirect) {
  const canonicals = canonicalHrefs(html);
  if (canonicals.length !== 1) fail(file, `must contain exactly one canonical link; found ${canonicals.length}.`);
  else if (canonicals[0] !== expectedCanonical) fail(file, `canonical must be ${expectedCanonical}, found ${canonicals[0]}.`);

  const robots = metaContents(html, "name", "robots");
  if (robots.length !== 1 || !robots[0]?.trim()) fail(file, "must contain exactly one non-empty robots directive.");
  if (isRedirect) return;

  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  const descriptions = metaContents(html, "name", "description");
  if (descriptions.length !== 1 || !descriptions[0]?.trim()) fail(file, "must contain exactly one non-empty meta description.");

  const requiredMeta = [
    ["name", "referrer", "strict-origin-when-cross-origin"],
    ["name", "theme-color", "#020817"],
    ["property", "og:title", title],
    ["property", "og:description", descriptions[0]],
    ["property", "og:type", "website"],
    ["property", "og:url", expectedCanonical],
    ["property", "og:image", null],
    ["property", "og:image:width", "1200"],
    ["property", "og:image:height", "630"],
    ["property", "og:image:alt", null],
    ["property", "og:site_name", content.brand.name],
    ["property", "og:locale", "es_ES"],
    ["name", "twitter:card", "summary_large_image"],
    ["name", "twitter:title", title],
    ["name", "twitter:description", descriptions[0]],
    ["name", "twitter:image", null],
  ];
  for (const [key, name, expected] of requiredMeta) {
    const values = metaContents(html, key, name);
    if (values.length !== 1 || !values[0]?.trim()) {
      fail(file, `must contain exactly one non-empty ${name} meta value.`);
    } else if (expected !== null && values[0] !== expected) {
      fail(file, `${name} must match ${expected}.`);
    }
  }

  const ogImage = metaContents(html, "property", "og:image")[0];
  const twitterImage = metaContents(html, "name", "twitter:image")[0];
  if (ogImage && !/^https:\/\//i.test(ogImage)) fail(file, "og:image must be an absolute HTTPS URL.");
  if (ogImage && twitterImage && twitterImage !== ogImage) fail(file, "twitter:image must match og:image.");

  for (const language of ["es", "x-default"]) {
    const alternates = tagAttributes(html, "link").filter((attributes) =>
      relTokens(attributes).has("alternate") && attribute(attributes, "hreflang")?.toLowerCase() === language
    );
    if (alternates.length !== 1 || attribute(alternates[0], "href") !== expectedCanonical) {
      fail(file, `alternate ${language} link must match the canonical URL.`);
    }
  }

  const jsonLd = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter((match) => attribute(match[1], "type")?.toLowerCase() === "application/ld+json");
  if (!jsonLd.length) {
    fail(file, "missing JSON-LD structured data.");
  } else {
    let matchingPage = false;
    const structuredTypes = new Set();
    for (const block of jsonLd) {
      try {
        const parsed = JSON.parse(block[2]);
        if (parsed["@context"] !== "https://schema.org") fail(file, "JSON-LD context must be https://schema.org.");
        const graph = Array.isArray(parsed["@graph"]) ? parsed["@graph"] : [parsed];
        for (const node of graph) {
          const types = Array.isArray(node?.["@type"]) ? node["@type"] : [node?.["@type"]];
          types.filter(Boolean).forEach((type) => structuredTypes.add(type));
        }
        matchingPage ||= graph.some((node) => {
          const types = Array.isArray(node?.["@type"]) ? node["@type"] : [node?.["@type"]];
          return types.some((type) => type === "WebPage" || type === "ContactPage") && node.url === expectedCanonical;
        });
      } catch (error) {
        fail(file, `invalid JSON-LD: ${error.message}`);
      }
    }
    if (!matchingPage) fail(file, "JSON-LD is missing a page node with the canonical URL.");
    if ([`${siteUrl}/`, `${siteUrl}/company/`].includes(expectedCanonical) && !structuredTypes.has("Organization")) {
      fail(file, "home and company pages must identify the Organization.");
    }
    if (expectedCanonical === `${siteUrl}/` && !structuredTypes.has("WebSite")) fail(file, "home page must identify the WebSite.");
    if (expectedCanonical !== `${siteUrl}/` && !structuredTypes.has("BreadcrumbList")) fail(file, "non-home pages must include breadcrumbs.");
  }
}

const files = await walk(siteRoot);
const htmlFiles = files.filter((file) => file.endsWith(".html"));
const textFiles = files.filter((file) => /\.(html|css|js|mjs|json|md|xml|txt)$/i.test(file));
const expectedHtmlFiles = new Set([
  ...routesMap.routes.filter((route) => route.status !== "retired").map((route) => path.normalize(routeFile(route.path))),
  path.normalize(path.join(siteRoot, "404.html")),
]);
const routesByHtmlFile = new Map(
  routesMap.routes
    .filter((route) => route.status !== "retired")
    .map((route) => [path.normalize(routeFile(route.path)), route]),
);

for (const file of htmlFiles) {
  if (!expectedHtmlFiles.has(path.normalize(file))) fail(file, "HTML file is not registered in the route map or generated 404 surface.");
}

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  const isRedirect = /http-equiv=["']refresh/i.test(html);
  const route = routesByHtmlFile.get(path.normalize(file));
  const expectedCanonical = path.normalize(file) === path.normalize(path.join(siteRoot, "404.html"))
    ? `${siteUrl}/404.html`
    : route
      ? `${siteUrl}${route.status === "redirect" ? route.redirectTo : route.path}`
      : null;

  if (!/<html\s+lang=["']es["']/i.test(html)) fail(file, "missing Spanish document language.");
  if (!/<meta\s+name=["']viewport["'][^>]+width=device-width/i.test(html)) fail(file, "missing responsive viewport.");
  if (!/<title>[^<]+<\/title>/i.test(html)) fail(file, "missing title.");
  if (expectedCanonical) validateMetadata(file, html, expectedCanonical, isRedirect);

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

  const articleOpenCount = count(html, /<article\b/gi);
  const articleCloseCount = count(html, /<\/article>/gi);
  if (articleOpenCount !== articleCloseCount) fail(file, `article elements are unbalanced: ${articleOpenCount} open and ${articleCloseCount} closed.`);
  for (const match of html.matchAll(/<article\b([^>]*)>([\s\S]*?)<\/article>/gi)) {
    const named = attribute(match[1], "aria-label") || attribute(match[1], "aria-labelledby") || /<h[2-6]\b|<strong\b/i.test(match[2]);
    if (!visibleText(match[2]).trim()) fail(file, "article must not be empty.");
    if (!named) fail(file, "article must contain a heading, a strong label, or an accessible name.");
  }
  if (/<article\b[^>]*\btabindex=/i.test(html)) fail(file, "article elements must not create an extra keyboard stop.");

  for (const attributes of tagAttributes(html, "a")) {
    if (attribute(attributes, "target")?.toLowerCase() !== "_blank") continue;
    if (!relTokens(attributes).has("noopener")) fail(file, `target=_blank link is missing rel=noopener: ${attribute(attributes, "href") || "unknown"}`);
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
    let clean;
    try {
      clean = decodeURIComponent(reference.split(/[?#]/)[0]);
    } catch {
      fail(file, `contains malformed encoded reference ${reference}`);
      continue;
    }
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
const expectedUrls = new Set(routesMap.routes.filter((route) => route.sitemap).map((route) => `${siteUrl}${route.path}`));
for (const url of expectedUrls) if (!actualUrls.has(url)) fail(sitemapFile, `missing ${url}.`);
for (const url of actualUrls) if (!expectedUrls.has(url)) fail(sitemapFile, `unapproved URL ${url}.`);

const robotsFile = path.join(siteRoot, "robots.txt");
const robots = await readFile(robotsFile, "utf8");
if (!/^Disallow:\s*\/nexus-lab\/$/m.test(robots)) fail(robotsFile, "Nexus Lab must be excluded from crawler discovery.");
if (!robots.includes(`Sitemap: ${siteUrl}/sitemap.xml`)) fail(robotsFile, "sitemap directive must use the configured site URL.");

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
  if (route.status === "redirect") {
    const refresh = metaContents(html, "http-equiv", "refresh");
    if (refresh.length !== 1 || refresh[0] !== `0; url=${route.redirectTo}`) fail(file, `redirect refresh must point exactly to ${route.redirectTo}.`);
    if (!html.includes(`location.replace(${JSON.stringify(route.redirectTo)})`)) fail(file, `redirect script must point exactly to ${route.redirectTo}.`);
    if (!new RegExp(`<a\\s+href=["']${route.redirectTo.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`).test(html)) fail(file, `redirect fallback link must point exactly to ${route.redirectTo}.`);
  }
}

const contactFile = path.join(siteRoot, "contact", "index.html");
const contact = await readFile(contactFile, "utf8");
for (const required of ["_honey", "consent_version", "source_product", "source_path", "name=\"consent\"", "aria-errormessage", "data-field-error", "data-brief-status", "data-brief-success"]) {
  if (!contact.includes(required)) fail(contactFile, `contact form is missing ${required}.`);
}
if (!/<form\b[^>]*\bnovalidate\b/i.test(contact)) fail(contactFile, "contact form must use the custom accessible validation flow.");
if (/<input\b[^>]*type=["']hidden["'][^>]*name=["']_honey["']/i.test(contact)) fail(contactFile, "honeypot must be a visually hidden text control, not type=hidden.");
for (const [name, limit] of [["name", 120], ["email", 254], ["company", 160], ["role", 160], ["current_process", 2000], ["tools", 300], ["desired_result", 2000]]) {
  const field = contact.match(new RegExp(`<(?:input|textarea)\\b[^>]*name=["']${name}["'][^>]*>`, "i"))?.[0];
  if (!field || !new RegExp(`\\bmaxlength=["']${limit}["']`, "i").test(field)) fail(contactFile, `${name} must enforce maxlength=${limit}.`);
}
if (visibleText(contact).includes("FormSubmit")) fail(contactFile, "commercial page exposes the form provider.");

const privacyFile = path.join(siteRoot, "privacy", "index.html");
const privacyText = visibleText(await readFile(privacyFile, "utf8"));
if (!privacyText.includes("FormSubmit")) fail(privacyFile, "privacy policy must name the form provider.");
if (!privacyText.includes("ruta de origen")) fail(privacyFile, "privacy policy must disclose form attribution data.");

const notFound = path.join(siteRoot, "404.html");
if (!(await exists(notFound))) {
  fail(notFound, "missing branded 404 page.");
} else {
  const notFoundHtml = await readFile(notFound, "utf8");
  const notFoundReferences = [...notFoundHtml.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)].map((match) => match[1]);
  for (const reference of notFoundReferences) {
    if (/^(?:https?:|mailto:|tel:|data:|#)/i.test(reference)) continue;
    if (!reference.startsWith("/")) fail(notFound, `404 references must be root-relative: ${reference}`);
  }
  if (!/name=["']robots["'][^>]+noindex/i.test(notFoundHtml)) fail(notFound, "404 page must be noindex.");
}

const cnameFile = path.join(siteRoot, "CNAME");
const expectedHost = new URL(siteUrl).hostname;
if (!(await exists(cnameFile))) fail(cnameFile, "missing CNAME file.");
else if ((await readFile(cnameFile, "utf8")).trim() !== expectedHost) fail(cnameFile, `CNAME must match ${expectedHost}.`);

const securityFile = path.join(siteRoot, ".well-known", "security.txt");
if (!(await exists(securityFile))) {
  fail(securityFile, "missing RFC 9116 security.txt.");
} else {
  const security = await readFile(securityFile, "utf8");
  const field = (name) => security.split(/\r?\n/)
    .filter((line) => line.startsWith(`${name}:`))
    .map((line) => line.slice(name.length + 1).trim());
  const contactFields = field("Contact");
  const canonicalFields = field("Canonical");
  const policyFields = field("Policy");
  const languageFields = field("Preferred-Languages");
  const expiresFields = field("Expires");
  if (contactFields.length !== 1 || contactFields[0] !== `mailto:${content.contact.legalEmail}`) fail(securityFile, "Contact must use the configured legal email.");
  if (canonicalFields.length !== 1 || canonicalFields[0] !== `${siteUrl}/.well-known/security.txt`) fail(securityFile, "Canonical must point to the published security.txt.");
  if (policyFields.length !== 1 || policyFields[0] !== `${siteUrl}/trust-center/`) fail(securityFile, "Policy must point to the trust center.");
  if (languageFields.length !== 1 || !/^es(?:,\s*en)?$/i.test(languageFields[0])) fail(securityFile, "Preferred-Languages must begin with es.");
  const expiresAt = expiresFields.length === 1 ? Date.parse(expiresFields[0]) : Number.NaN;
  if (!Number.isFinite(expiresAt)) fail(securityFile, "Expires must contain one valid ISO date.");
  else {
    const now = Date.now();
    if (expiresAt <= now) fail(securityFile, "security.txt has expired.");
    if (expiresAt > now + (366 * 24 * 60 * 60 * 1000)) fail(securityFile, "security.txt expiry must be less than one year away.");
  }
}

const scriptFile = path.join(siteRoot, "script.js");
const script = await readFile(scriptFile, "utf8");
for (const required of ["briefSending", "data-source-product", "formsubmit.co/ajax/", "aria-live", "allowedSourceParams", "AbortController", "aria-errormessage"]) {
  if (!script.includes(required) && !contact.includes(required)) fail(scriptFile, `missing form behavior ${required}.`);
}
if (/style\.setProperty\([^)]*,\s*["']important["']\s*\)/.test(script)) fail(scriptFile, "uses runtime !important overrides.");

const stylesManifestFile = path.join(siteRoot, "styles.css");
const stylesManifest = await readFile(stylesManifestFile, "utf8");
const manifestVersions = [...stylesManifest.matchAll(/@import\s+["'][^"']+\.css\?v=([^"']+)["']/g)].map((match) => match[1]);
const releaseVersions = new Set(manifestVersions);
if (manifestVersions.length !== 9) fail(stylesManifestFile, "every modular stylesheet must carry the release cache version.");

const stylesBundleFile = path.join(siteRoot, "styles.bundle.css");
if (!(await exists(stylesBundleFile))) {
  fail(stylesBundleFile, "missing generated public stylesheet bundle.");
} else {
  const stylesBundle = await readFile(stylesBundleFile, "utf8");
  if (!stylesBundle.startsWith("/* Generated by scripts/build-site.mjs.")) fail(stylesBundleFile, "bundle must identify its generator.");
  for (const layer of ["reset", "tokens", "base", "layout", "components", "nexus", "pages", "utilities", "responsive"]) {
    if (!stylesBundle.includes(`@layer ${layer} {`)) fail(stylesBundleFile, `bundle is missing the ${layer} layer.`);
  }
  if (/@import\b/i.test(stylesBundle)) fail(stylesBundleFile, "public bundle must not contain blocking CSS imports.");
}

const controllerVersion = script.match(/nexus-controller\.js\?v=([^"']+)/)?.[1];
if (!controllerVersion) fail(scriptFile, "Nexus controller import is missing the release cache version.");
else releaseVersions.add(controllerVersion);

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  if (/http-equiv=["']refresh/i.test(html)) continue;
  const versions = [...html.matchAll(/(?:styles\.bundle\.css|script\.js)\?v=([^"']+)/g)].map((match) => match[1]);
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
