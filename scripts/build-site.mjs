import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const siteRoot = path.join(root, "site");
const content = JSON.parse(await readFile(path.join(siteRoot, "data", "site-content.json"), "utf8"));
const routesMap = JSON.parse(await readFile(path.join(root, "config", "routes-map.json"), "utf8"));
const nexusSystem = JSON.parse(await readFile(path.join(root, "config", "nexus-system.json"), "utf8"));

const canonicalPages = new Map();

function relativePrefix(route) {
  const depth = route.split("/").filter(Boolean).length;
  return depth ? "../".repeat(depth) : "./";
}

function relativeHref(target, prefix) {
  if (target === "/") return prefix;
  return `${prefix}${target.replace(/^\//, "")}`;
}

function activeRoute(current, target) {
  if (target === "/products/" && current.startsWith("/products/")) return true;
  return current === target;
}

function renderHeader(route, prefix) {
  const nav = content.navigation.primary.map((item) => {
    const current = activeRoute(route, item.path) ? ' aria-current="page"' : "";
    return `<a href="${relativeHref(item.path, prefix)}"${current}>${item.label}</a>`;
  }).join("");

  return `<header class="site-header">
    <div class="container header-inner">
      <a class="brand" href="${relativeHref("/", prefix)}" aria-label="Inicio YC Systems">
        <img src="${prefix}assets/brand/yc-systems-logo-header-dark.png" alt="YC Systems" width="574" height="116" />
      </a>
      <button class="menu-button" type="button" data-nav-toggle aria-label="Abrir menú" aria-expanded="false" aria-controls="site-navigation"><span></span><span></span></button>
      <div class="header-panel" id="site-navigation" data-nav-panel>
        <nav class="main-nav" aria-label="Navegación principal">${nav}</nav>
        <div class="header-actions">
          <a class="nav-cta" href="${relativeHref(content.navigation.primaryAction.path, prefix)}">${content.navigation.primaryAction.label}</a>
        </div>
      </div>
    </div>
  </header>`;
}

function renderFooter(prefix) {
  return `<footer class="site-footer">
    <div class="container footer-grid">
      <div class="footer-brand">
        <strong>${content.brand.legalName}</strong>
        <p>${content.brand.positioning}</p>
        <p>Software operativo para negocios modernos.</p>
      </div>
      <div><strong>Empresa</strong><a href="${relativeHref("/company/", prefix)}">Empresa</a><a href="${relativeHref("/process/", prefix)}">M&eacute;todo</a><a href="${relativeHref("/case-studies/", prefix)}">Casos autorizados</a></div>
      <div><strong>Soluciones</strong><a href="${relativeHref("/solutions/", prefix)}">Software operativo</a><a href="${relativeHref("/products/", prefix)}">Ecosistema propio</a><a href="${relativeHref("/developers/", prefix)}">Ingenier&iacute;a</a></div>
      <div><strong>Informaci&oacute;n</strong><a href="${relativeHref("/trust-center/", prefix)}">Centro de confianza</a><a href="${relativeHref("/privacy/", prefix)}">Privacidad</a><a href="${relativeHref("/terms/", prefix)}">T&eacute;rminos</a></div>
      <div><strong>Contacto</strong><a href="mailto:${content.contact.email}">${content.contact.email}</a><a href="${content.contact.whatsappUrl}" target="_blank" rel="noopener">WhatsApp</a><a href="${content.contact.instagramUrl}" target="_blank" rel="noopener">Instagram</a></div>
    </div>
    <div class="container footer-bottom"><span>&copy; 2026 ${content.brand.legalName}. Todos los derechos reservados.</span><span><a href="${relativeHref("/documents/", prefix)}">Documentos</a><a href="${relativeHref("/privacy/", prefix)}">Privacidad</a><a href="${relativeHref("/terms/", prefix)}">T&eacute;rminos</a></span></div>
  </footer>`;
}

function pageHead({ route, prefix, title, description, noindex = false, ogImage = "https://ycsystems.io/assets/previews/yc-systems-og.png" }) {
  const canonical = `https://ycsystems.io${route}`;
  const organizationData = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "YC Systems LLC",
    url: "https://ycsystems.io/",
    logo: "https://ycsystems.io/assets/previews/yc-systems-og.png",
    email: content.contact.email,
    sameAs: [content.contact.instagramUrl],
  });
  return `<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="${description}" />
${noindex ? '    <meta name="robots" content="noindex, follow" />\n' : ""}    <meta name="theme-color" content="#020817" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:locale" content="es_ES" />
    <link rel="canonical" href="${canonical}" />
    <title>${title}</title>
    <link rel="icon" type="image/png" sizes="32x32" href="${prefix}assets/favicon-32.png" />
    <link rel="apple-touch-icon" href="${prefix}assets/apple-touch-icon.png" />
    <link rel="manifest" href="${prefix}site.webmanifest" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="${prefix}styles.css?v=yc-nexus-live-20260714g" />
    <script type="application/ld+json">${organizationData}</script>
  </head>`;
}

function renderPage({ route, title, description, body, noindex = false, bodyClass = "", ogImage }) {
  const prefix = relativePrefix(route);
  const routeDefinition = routesMap.routes.find((item) => item.path === route);
  const effectiveNoindex = noindex || routeDefinition?.indexable === false;
  const bodyMarkup = body(prefix);
  const nexusConfig = bodyMarkup.includes("data-nexus")
    ? `<script type="application/json" data-nexus-config>${JSON.stringify(nexusSystem).replace(/</g, "\\u003c")}</script>`
    : "";
  const html = `<!doctype html>
<html lang="es">
${pageHead({ route, prefix, title, description, noindex: effectiveNoindex, ogImage })}
<body class="${bodyClass}" data-route="${route}">
  <a class="skip-link" href="#main-content">Saltar al contenido</a>
  ${renderHeader(route, prefix)}
  <main id="main-content">${bodyMarkup}</main>
  ${renderFooter(prefix)}
${nexusConfig ? `  ${nexusConfig}\n` : ""}  <script src="${prefix}script.js?v=yc-nexus-live-20260714g"></script>
</body>
</html>
`;
  canonicalPages.set(route, html);
}

function actions(prefix, secondary = "/products/") {
  const secondaryLabel = secondary === "/case-studies/" ? "Ver casos" : secondary === "/solutions/" ? "Ver soluciones" : "Ver productos";
  return `<div class="actions"><a class="button primary" href="${relativeHref("/contact/", prefix)}">Solicitar diagn&oacute;stico</a><a class="button secondary" href="${relativeHref(secondary, prefix)}">${secondaryLabel}</a></div>`;
}

function sectionHead(kicker, title, text = "") {
  return `<div class="section-head"><p class="kicker">${kicker}</p><h2>${title}</h2>${text ? `<p>${text}</p>` : ""}</div>`;
}

const nexusStateLabels = Object.fromEntries(Object.entries(nexusSystem.modes).map(([key, value]) => [key, value.label]));
for (const [alias, canonical] of Object.entries(nexusSystem.aliases)) nexusStateLabels[alias] = nexusStateLabels[canonical];

function nexusMode(state = nexusSystem.defaultMode) {
  const canonical = nexusSystem.aliases[state] || state;
  return nexusSystem.modes[canonical] ? canonical : nexusSystem.defaultMode;
}

function nexusStatusChip(state, modifier = "") {
  const mode = nexusMode(state);
  return `<span class="nexus-status-chip ${modifier}" data-nexus-status><i aria-hidden="true"></i><span>${nexusSystem.modes[mode].label}</span></span>`;
}

function nexusMediaAsset(pose) {
  const assetKey = pose === "designing"
    ? "nexus-pose-designing"
    : pose === "building"
      ? "nexus-pose-building"
      : pose === "confirming" || pose === "launching"
        ? "nexus-avatar-base"
        : "nexus-avatar-clean";
  const registry = nexusSystem.assetRegistry || {};
  const asset = registry[assetKey];
  const readyPath = asset?.status === "ready" && asset.path ? asset.path : null;
  const fallbackKey = asset?.fallback || "nexus-avatar-base";
  const fallbackPath = registry[fallbackKey]?.path || registry["nexus-avatar-base"]?.path || "assets/brand/nexus/nexus-avatar.webp";
  return { key: assetKey, status: readyPath ? "ready" : "fallback", path: readyPath || fallbackPath };
}

function nexusCharacter(prefix, {
  state = "observe",
  expression,
  pose,
  size = "bust",
  message = "",
  modifier = "",
  priority = false,
  caption = "",
  action = "",
} = {}) {
  const mode = nexusMode(state);
  const modeConfig = nexusSystem.modes[mode];
  const selectedExpression = expression || modeConfig.expression;
  const selectedPose = pose || modeConfig.pose;
  const mediaAsset = nexusMediaAsset(selectedPose);
  return `<figure class="nexus-character nexus-character--${size} ${modifier}" data-nexus data-reveal data-nexus-state="${mode}" data-nexus-expression="${selectedExpression}" data-nexus-pose="${selectedPose}" data-nexus-asset="${mediaAsset.key}" data-nexus-asset-status="${mediaAsset.status}" data-nexus-label="${modeConfig.label}">
    ${nexusStatusChip(mode)}
    <div class="nexus-character-stage">
      <div class="nexus-character-media">
        <img src="${prefix}${mediaAsset.path}" alt="Nexus, guía visual de YC Systems" width="520" height="520" ${priority ? 'fetchpriority="high"' : 'loading="lazy"'} />
        <span class="nexus-visor" aria-hidden="true"><i class="nexus-eye nexus-eye--left"></i><i class="nexus-eye nexus-eye--right"></i><b class="nexus-mouth"></b></span>
      </div>
      <div class="nexus-context-signals" aria-hidden="true"><span></span><span></span><span></span><i></i></div>
    </div>
${caption || message || action ? `    <figcaption>${caption ? `<strong>${caption}</strong>` : ""}${message ? `<span data-nexus-message>${message}</span>` : ""}${action}</figcaption>\n` : ""}  </figure>`;
}

function nexusAvatar(prefix, state = "idle", message = "Primero entendamos el proceso.", modifier = "", action = "") {
  return nexusCharacter(prefix, { state, message, modifier: `nexus-avatar ${modifier}`, size: "half", caption: "Nexus", action });
}

function nexusCore(state = "idle", message = "Primero entendamos el proceso.", modifier = "", action = "", options = {}) {
  const mode = nexusMode(state);
  const label = options.label || nexusStateLabels[state] || nexusStateLabels.observe;
  const expression = options.expression || (state === "caution" || state === "error" ? "soft-alert" : nexusSystem.modes[mode].expression);
  const pose = options.pose || nexusSystem.modes[mode].pose;
  return `<div class="nexus-core ${modifier}" data-nexus data-nexus-state="${mode}" data-nexus-expression="${expression}" data-nexus-pose="${pose}" data-nexus-label="${label}">
    <div class="nexus-core-visual" aria-hidden="true">
      <span class="nexus-core-scan"></span>
      <span class="nexus-core-node node-a"></span>
      <span class="nexus-core-node node-b"></span>
      <span class="nexus-core-node node-c"></span>
      <span class="nexus-core-line line-a"></span>
      <span class="nexus-core-line line-b"></span>
      <span class="nexus-core-face"><i></i><i></i><b></b></span>
    </div>
    <div class="nexus-core-copy"><strong>Nexus</strong><span data-nexus-message>${message}</span>${action}</div>
  </div>`;
}

function nexusGuideCard(state, title, message, modifier = "") {
  return `<aside class="nexus-guide-card ${modifier}" data-reveal data-nexus-guide data-nexus-state="${nexusMode(state)}">${nexusCore(state, message, "nexus-guide-core")}<div><p class="kicker">Nexus &middot; Gu&iacute;a operativa</p><h3>${title}</h3><p data-nexus-guide-text>${message}</p></div></aside>`;
}

function nexusInsightCard(state, title, message) {
  return `<article class="nexus-insight-card" data-reveal data-nexus-state="${nexusMode(state)}"><span>Lectura Nexus</span><h3>${title}</h3><p>${message}</p></article>`;
}

function nexusConfirmation(message = "Ruta inicial recibida") {
  return `<div class="nexus-confirmation" data-reveal data-nexus-confirmation>${nexusCore("support", message, "nexus-confirmation-core", "", { expression: "confirming", pose: "confirming", label: "Confirmado" })}<div><strong>${message}</strong><p>Revisaremos el contexto y responderemos con el siguiente paso recomendado.</p></div></div>`;
}

function nexusLoader(label = "Organizando información") {
  return `<div class="nexus-loader" role="status"><span aria-hidden="true"><i></i><i></i><i></i></span><strong>${label}</strong></div>`;
}

function nexusEmptyState(prefix) {
  return `<div class="nexus-empty-state">${nexusCore("observe", "Aún no hay señales suficientes para proponer una ruta.", "nexus-empty-core")}<a class="button secondary" href="${relativeHref("/contact/", prefix)}">Iniciar diagnóstico</a></div>`;
}

const reservedCapabilities = [
  { label: "01", title: "Operaciones conectadas", text: "Flujos de trabajo, estados, responsables y seguimiento en una misma base operativa." },
  { label: "02", title: "Visibilidad ejecutiva", text: "Indicadores y lecturas claras para decidir sin depender de reportes dispersos." },
  { label: "03", title: "Arquitectura modular", text: "Cada implementaci&oacute;n puede integrar componentes distintos seg&uacute;n el contexto operativo del cliente." },
  { label: "04", title: "Automatizaci&oacute;n por fases", text: "Reglas, alertas e integraciones que reducen trabajo repetitivo sin exponer detalles internos." },
];

function reservedCapabilityCards() {
  return reservedCapabilities.map((item, index) => `<article tabindex="0" data-nexus-trigger data-nexus-state="${index === 1 ? "support" : index === 2 ? "design" : index === 3 ? "build" : "organize"}" data-nexus-message="${item.title}. ${item.text.replace(/"/g, "&quot;")}"><span>${item.label}</span><strong>${item.title}</strong><p>${item.text}</p></article>`).join("");
}

function homeProductHighlight(prefix) {
  return `<div class="home-product-highlight reserved-product-highlight"><div class="home-product-copy"><p class="kicker">Ecosistema propio</p><h2>Soluciones disponibles para clientes y operaciones reales</h2><p>Nuestro ecosistema incluye soluciones p&uacute;blicas y desarrollos implementados exclusivamente para organizaciones y clientes.</p><div class="actions"><a class="button primary" href="${relativeHref("/contact/", prefix)}">Solicitar diagn&oacute;stico</a><a class="button secondary" href="${relativeHref("/solutions/", prefix)}">Ver soluciones</a></div></div><div class="reserved-system-card" aria-label="Capacidades de producto YC Systems"><span>Nexus</span><strong>Capa de orientaci&oacute;n operativa</strong><small>Diagn&oacute;stico &middot; arquitectura &middot; ejecuci&oacute;n</small><div><em>OS</em><em>CRM</em><em>BI</em><em>API</em></div></div></div>`;
}

function homeFrictionSection() {
  const items = [
    ["Informaci&oacute;n dispersa", "Los datos est&aacute;n en demasiados lugares y no hay una vista completa.", "signal-nodes"],
    ["Procesos manuales", "Tareas repetitivas que consumen tiempo y generan errores.", "signal-steps"],
    ["Decisiones sin contexto", "Falta visibilidad para decidir con rapidez y seguridad.", "signal-chart"],
    ["Herramientas desconectadas", "Sistemas que no comparten datos ni procesos.", "signal-links"],
  ];
  return `<section class="section home-friction"><div class="container">${sectionHead("Se&ntilde;ales operativas", "Cuando la operaci&oacute;n crece, tambi&eacute;n crece la fricci&oacute;n")}<div class="operational-grid">${items.map(([title, text, visual]) => `<article class="operational-card"><div class="operational-signal ${visual}" aria-hidden="true"><i></i><i></i><i></i><i></i></div><h3>${title}</h3><p>${text}</p></article>`).join("")}</div></div></section>`;
}

function homeSolutionsSection(prefix) {
  const items = [
    ["Software empresarial", "Plataformas internas que concentran operaciones, usuarios, tareas y decisiones.", "system"],
    ["Automatizaci&oacute;n de procesos", "Flujos que reducen seguimiento manual y hacen visible cada estado.", "automation"],
    ["Datos e integraciones", "Herramientas conectadas mediante una base de informaci&oacute;n confiable.", "data"],
    ["Portales y herramientas internas", "Experiencias adaptadas a clientes, equipos, proveedores y socios.", "portal"],
  ];
  return `<section class="section section-alt home-solutions"><div class="container">${sectionHead("Lo que construimos", "Una base operativa dise&ntilde;ada alrededor de tu empresa")}<div class="operational-grid solution-preview-grid">${items.map(([title, text, visual], index) => `<a class="operational-card solution-preview-card" href="${relativeHref("/solutions/", prefix)}"><div class="solution-symbol ${visual}" aria-hidden="true"><span></span><span></span><span></span></div><span class="card-index">${String(index + 1).padStart(2, "0")}</span><h3>${title}</h3><p>${text}</p><small>Ver soluci&oacute;n</small></a>`).join("")}</div></div></section>`;
}

function homeEcosystemSection(prefix) {
  const nodes = ["Experiencia", "Procesos", "Automatizaciones", "Datos", "Integraciones", "M&eacute;tricas"];
  return `<section class="section home-ecosystem-preview"><div class="container ecosystem-preview-grid"><div>${sectionHead("Ecosistema", "Sistemas que comparten contexto, datos y decisiones", "Cada m&oacute;dulo puede comenzar de forma independiente y conectarse gradualmente con el resto de la operaci&oacute;n.")}<div class="nexus-system-note">${nexusCore("organize", "Una operaci&oacute;n conectada comienza con una base clara.", "ecosystem-note-core")}</div><a class="text-link" href="${relativeHref("/products/", prefix)}">Explorar el ecosistema</a></div><div class="system-map" aria-label="Mapa del ecosistema operativo"><strong>Base operativa</strong>${nodes.map((node, index) => `<span style="--node:${index}">${node}</span>`).join("")}<i></i><i></i><i></i></div></div></section>`;
}

function homeMethodSection(prefix) {
  const phases = [
    ["01", "Diagn&oacute;stico", "Observa", "Problema y prioridad"],
    ["02", "Arquitectura", "Ordena", "M&oacute;dulos y l&iacute;mites"],
    ["03", "Dise&ntilde;o", "Dise&ntilde;a", "Flujos validados"],
    ["04", "Desarrollo", "Construye", "Versi&oacute;n funcional"],
    ["05", "Lanzamiento", "Construye", "Operaci&oacute;n activada"],
    ["06", "Soporte", "Acompa&ntilde;a", "Mejora priorizada"],
  ];
  return `<section class="section section-alt home-method-preview"><div class="container">${sectionHead("M&eacute;todo YC Systems", "Una ruta visible desde el problema hasta la operaci&oacute;n", "Cada fase toma una decisi&oacute;n, produce un entregable y reduce un riesgo antes de avanzar.")}<ol class="method-preview-grid">${phases.map(([number, title, state, output]) => `<li><span>${number}</span><div><strong>${title}</strong><small>${output}</small></div><em>${state}</em></li>`).join("")}</ol><div class="section-action"><a class="text-link" href="${relativeHref("/process/", prefix)}">Ver c&oacute;mo trabajamos</a></div></div></section>`;
}

function reservedProductsSection(prefix) {
  return `<section class="section"><div class="container">${sectionHead("Ecosistema propio", "Soluciones para operaciones que necesitan control", "Nuestro ecosistema incluye soluciones p&uacute;blicas y desarrollos implementados exclusivamente para organizaciones y clientes. La web muestra la direcci&oacute;n comercial sin exponer arquitectura, interfaces o informaci&oacute;n privada.")}<div class="value-grid reserved-capability-grid">${reservedCapabilityCards()}</div><div class="conversion-panel"><p><strong>Si tu empresa necesita algo similar</strong><span>Podemos evaluar tu operaci&oacute;n y definir una primera fase con alcance claro, acceso controlado y confidencialidad.</span></p><a class="button primary" href="${relativeHref("/contact/", prefix)}">Solicitar diagn&oacute;stico</a></div></div></section>`;
}

function privateAcceleratorsSection(prefix) {
  return `<section class="section section-alt"><div class="container">${sectionHead("Productos relacionados", "Capacidades propias aplicadas al problema del cliente", "Cuando una soluci&oacute;n necesita componentes internos, los evaluamos durante el diagn&oacute;stico y los usamos solo si aportan claridad, velocidad o control operativo.")}<div class="nexus-guide" data-nexus-guide>${nexusCore("organize", "Nexus conecta cada capacidad con un resultado operativo.", "nexus-guide-core")}<div><p class="kicker">Nexus &middot; Gu&iacute;a operativa</p><h3>Elige una capacidad para ver qu&eacute; aporta a la operaci&oacute;n</h3><p data-nexus-guide-text>Nexus conecta cada capacidad con un resultado operativo.</p></div></div><div class="value-grid reserved-capability-grid">${reservedCapabilityCards()}</div><div class="section-action"><a class="button secondary" href="${relativeHref("/products/", prefix)}">Ver enfoque de producto</a></div></div></section>`;
}

function caseCards(prefix, limit = content.cases.length, offset = 0) {
  return content.cases.slice(offset, offset + limit).map((item) => `<article class="case-card" data-card-link>
    <div class="card-media"><img src="${relativeHref(item.image, prefix)}" alt="Sitio publicado de ${item.name}" width="1440" height="1000" loading="lazy" /></div>
    <div class="case-card-copy"><span>${item.category}</span><h3>${item.name}</h3><dl class="case-facts"><div><dt>Industria</dt><dd>${item.category}</dd></div><div><dt>Objetivo</dt><dd>Presencia comercial clara</dd></div><div><dt>Resultado</dt><dd>Canal digital publicado</dd></div></dl><p>${item.summary}</p><div class="case-actions">${item.internalPath ? `<a class="button secondary" href="${relativeHref(item.internalPath, prefix)}">Ver enfoque</a>` : ""}<a class="text-link" href="${item.url}" target="_blank" rel="noopener">Visitar sitio</a></div></div>
  </article>`).join("");
}

function finalCta(prefix, title = "Define la primera fase de tu sistema") {
  return `<section class="section cta-section"><div class="container cta-panel"><div><p class="kicker">Siguiente paso</p><h2>${title}</h2><p>Cu&eacute;ntanos qu&eacute; proceso necesitas controlar, medir o automatizar y recibe una recomendaci&oacute;n inicial de alcance y prioridades.</p></div><a class="button primary" href="${relativeHref("/contact/", prefix)}">Solicitar diagn&oacute;stico</a></div></section>`;
}

renderPage({
  route: "/",
  title: "YC Systems LLC | Software operativo para negocios reales",
  description: "YC Systems dise&ntilde;a plataformas empresariales que centralizan operaciones, automatizan procesos y convierten informaci&oacute;n en decisiones.",
  bodyClass: "home-page",
  body: (prefix) => `<section class="hero"><div class="container hero-grid"><div class="hero-copy"><p class="kicker">YC Systems LLC &middot; Software operativo</p><h1>Software operativo para empresas que necesitan control, velocidad y crecimiento</h1><p class="lead">Dise&ntilde;amos plataformas empresariales que centralizan operaciones, automatizan procesos y convierten informaci&oacute;n dispersa en decisiones claras.</p>${actions(prefix, "/solutions/")}<p class="trust-line">Software empresarial &middot; implementaci&oacute;n por fases &middot; soporte continuo</p></div>${nexusCharacter(prefix, { state: "observe", expression: "observing", pose: "observing", size: "hero", modifier: "home-hero-visual", priority: true, caption: "Operaciones reales convertidas en sistemas claros.", message: "Primero entendemos c&oacute;mo trabaja tu empresa.", action: `<a class="text-link" href="${relativeHref("/contact/", prefix)}">Descubre d&oacute;nde comenzar</a>` })}</div></section>
  <section class="authority-band mini-proof-band" aria-label="Capacidades principales"><div class="container authority-list"><span><small>01</small><strong>Software empresarial</strong></span><span><small>02</small><strong>Implementaci&oacute;n por fases</strong></span><span><small>03</small><strong>Datos conectados</strong></span><span><small>04</small><strong>Soporte continuo</strong></span></div></section>
  ${homeFrictionSection()}${homeSolutionsSection(prefix)}
  <section class="section nexus-section"><div class="container nexus-panel nexus-core-panel"><div class="nexus-system-visual">${nexusCore("observe", "Nexus identifica se&ntilde;ales y hace visible el siguiente paso.", "nexus-home-core")}<div class="nexus-mode-flow" aria-label="Modos de Nexus"><span>Observa</span><i></i><span>Ordena</span><i></i><span>Dise&ntilde;a</span><i></i><span>Construye</span><i></i><span>Acompa&ntilde;a</span></div></div><div class="nexus-copy"><p class="kicker">Nexus &middot; Gu&iacute;a operativa</p><h2>Una forma visual de observar, ordenar y avanzar</h2><p>Nexus representa c&oacute;mo YC Systems entiende una operaci&oacute;n antes de construir: identifica las se&ntilde;ales, organiza la prioridad y hace visible el siguiente paso.</p><a class="text-link" href="${relativeHref("/process/", prefix)}">Ver c&oacute;mo trabaja Nexus</a></div></div></section>
  ${homeEcosystemSection(prefix)}${homeMethodSection(prefix)}
  <section class="section"><div class="container">${sectionHead("Casos", "Operaciones reales, sistemas claros y cambios observables", "Evidencia publicada de experiencias entregadas para negocios y marcas reales.")}<div class="case-grid case-feature-list">${caseCards(prefix, 2)}</div><div class="section-action"><a class="text-link" href="${relativeHref("/case-studies/", prefix)}">Ver todos los casos</a></div></div></section>${finalCta(prefix, "Antes de construir, definamos qu&eacute; necesita m&aacute;s control")}`,
});

renderPage({
  route: "/products/",
  title: "Ecosistema propio | YC Systems",
  description: "YC Systems construye soluciones p&uacute;blicas y desarrollos implementados exclusivamente para organizaciones y clientes.",
  body: (prefix) => `<section class="page-hero products-hero"><div class="container interior-hero-grid"><div><p class="kicker">Ecosistema YC Systems</p><h1>Un ecosistema modular para operar, conectar y crecer</h1><p class="lead">Cada soluci&oacute;n puede comenzar de forma independiente y conectarse gradualmente con el resto de la operaci&oacute;n.</p><div class="actions"><a class="button primary" href="${relativeHref("/contact/", prefix)}">Solicitar diagn&oacute;stico</a><a class="button secondary" href="${relativeHref("/solutions/", prefix)}">Ver soluciones</a></div></div><div class="system-map compact-system-map" aria-label="Mapa del ecosistema operativo"><strong>Base operativa</strong>${["Procesos", "Usuarios", "Datos", "Automatizaciones", "Integraciones", "M&eacute;tricas"].map((node, index) => `<span style="--node:${index}">${node}</span>`).join("")}<i></i><i></i><i></i></div></div></section><section class="section"><div class="container">${sectionHead("C&oacute;mo se conecta", "Tres niveles, un mismo contexto operativo", "Cada nivel conserva su funci&oacute;n mientras comparte datos, reglas y decisiones con el resto del sistema.")}<div class="ecosystem-layers"><article><span>01</span><strong>Experiencia</strong><p>Lo que ven clientes, empleados, proveedores y socios.</p></article><article><span>02</span><strong>Operaci&oacute;n</strong><p>Procesos, permisos, estados, validaciones y automatizaciones.</p></article><article><span>03</span><strong>Base</strong><p>Datos, integraciones, seguridad, continuidad y m&eacute;tricas.</p></article></div><div class="nexus-guide ecosystem-guide">${nexusCore("connect", "Cada m&oacute;dulo conserva su funci&oacute;n, pero comparte el mismo contexto operativo.", "nexus-guide-core")}<div><p class="kicker">Nexus &middot; Vista del sistema</p><h3>Una base clara permite conectar sin reemplazar todo de una vez</h3><p>Cada implementaci&oacute;n avanza por m&oacute;dulos y prioridades verificables.</p></div></div></div></section><section class="section section-alt"><div class="container">${sectionHead("Puntos de entrada", "No todas las empresas necesitan comenzar por el mismo lugar")}<div class="entry-route-grid">${[["Centralizar una operaci&oacute;n", "Reunir estados, responsables e informaci&oacute;n en una base visible."], ["Automatizar un proceso cr&iacute;tico", "Reducir seguimiento manual sin perder control ni trazabilidad."], ["Conectar sistemas existentes", "Compartir datos y decisiones entre herramientas que ya utiliza el equipo."], ["Crear un portal", "Dar a cada grupo acceso claro a la informaci&oacute;n y acciones que necesita."]].map(([title, text], index) => `<a href="${relativeHref("/contact/", prefix)}"><span>${String(index + 1).padStart(2, "0")}</span><strong>${title}</strong><p>${text}</p><small>Ver primera fase recomendada</small></a>`).join("")}</div></div></section>${finalCta(prefix)}`,
});

const solutions = [
  { title: "Software empresarial", problem: "La operaci&oacute;n depende de hojas, mensajes y decisiones dispersas.", build: "Plataformas internas para centralizar operaciones, usuarios, tareas y decisiones.", result: "Mayor trazabilidad y una vista operativa compartida" },
  { title: "Automatizaci&oacute;n de procesos", problem: "El equipo repite tareas manuales que consumen tiempo y aumentan errores.", build: "Flujos, reglas, alertas e integraciones que hacen visible cada estado.", result: "Menos seguimiento manual y mayor consistencia" },
  { title: "Datos e integraciones", problem: "Las herramientas existentes no comparten informaci&oacute;n ni contexto.", build: "Una base confiable que conecta fuentes, permisos, indicadores y decisiones.", result: "Informaci&oacute;n disponible donde la operaci&oacute;n la necesita" },
  { title: "Portales y herramientas internas", problem: "Clientes, socios o equipos dependen de conversaciones sueltas para acceder a informaci&oacute;n.", build: "Interfaces adaptadas por rol para consultar, solicitar y completar acciones.", result: "Acceso ordenado y menos dependencia de intermediarios" },
];

renderPage({
  route: "/solutions/",
  title: "Soluciones | YC Systems",
  description: "Soluciones de software dise&ntilde;adas para resolver operaciones reales.",
  body: (prefix) => `<section class="page-hero solutions-hero"><div class="container interior-hero-grid"><div><p class="kicker">Soluciones</p><h1>Del proceso disperso al sistema operativo</h1><p class="lead">Dise&ntilde;amos soluciones empresariales alrededor de c&oacute;mo trabajan realmente tus equipos, clientes y operaciones.</p><div class="actions"><a class="button primary" href="${relativeHref("/contact/", prefix)}">Solicitar diagn&oacute;stico</a><a class="text-link" href="${relativeHref("/case-studies/", prefix)}">Ver casos</a></div></div><div class="before-after-map" aria-label="Del proceso disperso al sistema conectado"><div><small>Antes</small><span>Hojas</span><span>Mensajes</span><span>Tareas manuales</span></div><i></i><div><small>Despu&eacute;s</small><strong>Base operativa</strong><span>Estados</span><span>Datos</span><span>Decisiones</span></div></div></div></section><section class="section"><div class="container">${sectionHead("Lo que construimos", "Cuatro formas de ordenar una operaci&oacute;n", "Cada soluci&oacute;n parte del problema, define qu&eacute; se construye y hace visible el cambio esperado.")}<div class="nexus-guide" data-nexus-guide>${nexusCore("connect", "No comenzamos por la tecnolog&iacute;a. Comenzamos por el proceso, la prioridad y el resultado esperado.", "nexus-guide-core")}<div><p class="kicker">Nexus &middot; Ordenando</p><h3>Primero definimos qu&eacute; necesita cambiar</h3><p data-nexus-guide-text>No comenzamos por la tecnolog&iacute;a. Comenzamos por el proceso, la prioridad y el resultado esperado.</p></div></div><div class="solution-grid solution-detail-grid">${solutions.map((item, index) => `<article class="solution-card" tabindex="0" data-nexus-trigger data-nexus-state="${index === 1 ? "build" : index === 2 ? "connect" : index === 3 ? "design" : "observe"}" data-nexus-message="${item.result}. ${item.problem.replace(/"/g, "&quot;")}"><span>${String(index + 1).padStart(2, "0")}</span><h2>${item.title}</h2><p class="solution-problem"><strong>Qu&eacute; ordena</strong>${item.problem}</p><p><strong>Qu&eacute; construimos</strong>${item.build}</p><p><strong>Qu&eacute; cambia</strong>${item.result}</p><a class="text-link" href="${relativeHref("/contact/", prefix)}">Definir primera fase</a></article>`).join("")}</div></div></section><section class="section section-alt"><div class="container">${sectionHead("Criterio de construcci&oacute;n", "No necesitas reemplazar toda tu operaci&oacute;n para empezar", "Una primera fase debe ser comprensible, medible y suficientemente s&oacute;lida para evolucionar.")}<div class="value-grid"><article><strong>Alcance claro</strong><p>Qu&eacute; entra, qu&eacute; queda fuera y qu&eacute; resultado debe observarse.</p></article><article><strong>Arquitectura mantenible</strong><p>Una base preparada para cambios sin rehacer toda la soluci&oacute;n.</p></article><article><strong>Entrega responsable</strong><p>Versiones, validaci&oacute;n y acompa&ntilde;amiento despu&eacute;s del lanzamiento.</p></article></div></div></section>${finalCta(prefix, "Definamos una primera fase")}`,
});

renderPage({
  route: "/case-studies/",
  title: "Casos | YC Systems",
  description: "Casos publicados de sitios y experiencias digitales construidos por YC Systems.",
  body: (prefix) => `<section class="page-hero cases-hero"><div class="container interior-hero-grid"><div><p class="kicker">Casos</p><h1>Operaciones reales, sistemas claros y cambios observables</h1><p class="lead">Cada caso muestra el punto de partida, la primera fase construida y la evidencia que hoy puede verificarse.</p><a class="text-link" href="${relativeHref("/brands/ghostwear/", prefix)}">Ver caso GhostWear</a></div><figure class="featured-case-preview"><img src="${prefix}assets/screenshots/ghostwear-live-2026.webp" alt="Experiencia publicada de GhostWear" width="1440" height="1000" fetchpriority="high" /><figcaption><span>Caso destacado</span><strong>GhostWear</strong></figcaption></figure></div></section><section class="section"><div class="container">${sectionHead("Caso de estudio", "Del objetivo comercial a una experiencia publicada", "Sin cifras inventadas: mostramos alcance, estado y evidencia disponible.")}<div class="case-grid case-feature-list">${caseCards(prefix, 1, 1)}</div></div></section><section class="section section-alt"><div class="container">${sectionHead("Trabajos publicados", "Experiencias activas construidas por YC Systems", "Una muestra compacta del trabajo entregado para empresas y marcas reales.")}<div class="case-grid case-archive-grid">${caseCards(prefix, 3, 2)}</div></div></section>${finalCta(prefix)}`,
});

renderPage({
  route: "/brands/ghostwear/",
  title: "GhostWear | Caso de YC Systems",
  description: "Caso publicado de comercio electrónico construido por YC Systems para GhostWear.",
  noindex: true,
  body: (prefix) => `<section class="product-hero case-detail-hero"><div class="container product-hero-grid"><div><p class="kicker">Caso de cliente</p><h1>GhostWear convirtió su catálogo en una experiencia de venta directa</h1><p class="lead">Una tienda adaptable con catálogo, carrito y pedidos conectados a WhatsApp para reducir fricción entre descubrimiento y conversación de compra.</p><div class="actions"><a class="text-link" href="https://ghostwear1.com/" target="_blank" rel="noopener">Visitar sitio</a><a class="button secondary" href="${relativeHref("/case-studies/", prefix)}">Casos</a></div></div><div class="product-visual"><img src="${prefix}assets/screenshots/ghostwear-live-2026.webp" alt="Sitio publicado de GhostWear" width="1440" height="1000" fetchpriority="high" /></div></div></section><section class="section"><div class="container value-grid"><article><strong>Situación</strong><p>La marca necesitaba presentar su oferta y facilitar pedidos desde móvil.</p></article><article><strong>Primera fase</strong><p>Catálogo, carrito y contacto comercial integrado.</p></article><article><strong>Evidencia</strong><p>Navegación publicada y flujo de compra accesible en dispositivos reales.</p></article><article><strong>Estado actual</strong><p>Tienda activa y disponible para recibir oportunidades.</p></article></div></section>${finalCta(prefix)}`,
});

renderPage({
  route: "/case-studies/antony-real-estate/",
  title: "Antony Real Estate | Caso de YC Systems",
  description: "Caso publicado de presencia comercial inmobiliaria construida por YC Systems para Antony Real Estate.",
  noindex: true,
  body: (prefix) => `<section class="product-hero case-detail-hero"><div class="container product-hero-grid"><div><p class="kicker">Caso de cliente</p><h1>Antony Real Estate convirtió su presencia digital en un canal de confianza</h1><p class="lead">Una experiencia adaptable para presentar propiedades, fortalecer credibilidad y facilitar el contacto directo con compradores interesados.</p><div class="actions"><a class="text-link" href="https://antonyrealestate.com/" target="_blank" rel="noopener">Visitar sitio</a><a class="button secondary" href="${relativeHref("/case-studies/", prefix)}">Casos</a></div></div><div class="product-visual"><img src="${prefix}assets/screenshots/antonyrealestate-live.webp" alt="Sitio publicado de Antony Real Estate" width="1440" height="1000" fetchpriority="high" /></div></div></section><section class="section"><div class="container value-grid"><article><strong>Situación</strong><p>La operación necesitaba una presencia clara para presentar oferta y generar confianza.</p></article><article><strong>Primera fase</strong><p>Estructura comercial, propiedades destacadas y canales de contacto directo.</p></article><article><strong>Evidencia</strong><p>Experiencia publicada con navegación adaptable y jerarquía orientada a consultas.</p></article><article><strong>Estado actual</strong><p>Sitio activo como punto de entrada para compradores y oportunidades.</p></article></div></section>${finalCta(prefix)}`,
});

const processSteps = [
  {
    id: "diagnostico",
    state: "observe",
    expression: "observing",
    pose: "analyzing",
    title: "Diagnóstico",
    summary: "Entendemos operación, usuarios, prioridades, riesgo y resultado esperado.",
    deliverable: "Mapa inicial del problema, prioridad y primera decisión de alcance.",
    risk: "Reduce construir algo bonito que no resuelve la operación real.",
    decision: "Qué problema y qué resultado deben entrar en la primera fase.",
    message: "Primero entendamos el proceso."
  },
  {
    id: "arquitectura",
    state: "organize",
    expression: "thinking",
    pose: "pointing",
    title: "Arquitectura",
    summary: "Definimos módulos, datos, integraciones y límites de la primera versión.",
    deliverable: "Estructura del sistema, módulos, datos y conexiones principales.",
    risk: "Reduce rehacer la base cuando el sistema empiece a crecer.",
    decision: "Qué arquitectura permite avanzar sin sobredimensionar la solución."
  },
  {
    id: "diseno",
    state: "design",
    expression: "designing",
    pose: "designing",
    title: "Diseño",
    summary: "Convertimos el flujo en una experiencia clara para cada tipo de usuario.",
    deliverable: "Flujos, pantallas clave y reglas de interacción listas para validar.",
    risk: "Reduce confusión, pantallas innecesarias y adopción débil.",
    decision: "Qué experiencia entiende y puede adoptar cada tipo de usuario."
  },
  {
    id: "desarrollo",
    state: "build",
    expression: "building",
    pose: "building",
    title: "Desarrollo",
    summary: "Construimos, validamos y entregamos por versiones controladas.",
    deliverable: "Primera versión funcional con componentes, datos y pruebas esenciales.",
    risk: "Reduce entregas incompletas, deuda temprana y cambios sin control.",
    decision: "Qué versión está lista para validarse en una operación real."
  },
  {
    id: "lanzamiento",
    state: "build",
    expression: "confirming",
    pose: "launching",
    title: "Lanzamiento",
    summary: "Preparamos publicación, adopción, uso inicial y soporte de salida.",
    deliverable: "Checklist de activación, acceso, capacitación y seguimiento inicial.",
    risk: "Reduce lanzar sin operación, sin responsables y sin ruta de soporte.",
    decision: "Cuándo el sistema y el equipo están listos para comenzar a operar."
  },
  {
    id: "soporte",
    state: "support",
    expression: "support-neutral",
    pose: "supporting",
    title: "Soporte",
    summary: "Medimos uso, corregimos fricción y priorizamos la siguiente fase.",
    deliverable: "Plan de mejora, soporte y evolución con señales de uso reales.",
    risk: "Reduce abandono, errores repetidos y crecimiento sin dirección.",
    decision: "Qué corregir, mantener o priorizar en la siguiente fase."
  },
];

function nexusMethodExplorer(prefix) {
  const first = processSteps[0];
  return `<section class="section nexus-method-section"><div class="container nexus-method" data-nexus-method>
    <header class="nexus-method-active-head" role="status" aria-live="polite" aria-atomic="true"><p class="nexus-method-progress" data-nexus-progress>Fase 1 de ${processSteps.length}</p><p class="kicker" data-nexus-detail-state>${nexusStateLabels[first.state]}</p><h2 data-nexus-detail-title>${first.title}</h2></header>
    <div class="nexus-method-stage">${nexusCharacter(prefix, { state: first.state, expression: first.expression, pose: first.pose, size: "half", message: first.message, modifier: "nexus-method-avatar", caption: "Nexus" })}<div class="nexus-method-diagram" aria-hidden="true"><span></span><span></span><span></span><span></span><i></i></div></div>
    <article id="nexus-method-panel" class="nexus-method-detail" role="tabpanel" aria-labelledby="nexus-method-tab-0" data-nexus-detail><dl><div><dt>Prop&oacute;sito</dt><dd data-nexus-detail-summary>${first.summary}</dd></div><div><dt>Entregable</dt><dd data-nexus-detail-deliverable>${first.deliverable}</dd></div><div><dt>Riesgo que reduce</dt><dd data-nexus-detail-risk>${first.risk}</dd></div><div><dt>Decisi&oacute;n para avanzar</dt><dd data-nexus-detail-decision>${first.decision}</dd></div></dl><div class="nexus-method-controls"><button class="button secondary" type="button" data-nexus-prev>Anterior</button><button class="button secondary" type="button" data-nexus-next>Siguiente</button></div></article>
    <div class="nexus-method-steps" role="tablist" aria-label="Fases del método YC Systems">${processSteps.map((step, index) => `<button id="nexus-method-tab-${index}" type="button" role="tab" data-nexus-step="${index}" data-state="${step.state}" data-message="${step.message || step.summary}" aria-controls="nexus-method-panel" aria-selected="${index === 0 ? "true" : "false"}"${index === 0 ? ' aria-current="step" tabindex="0"' : ' tabindex="-1"'}><span>${String(index + 1).padStart(2, "0")}</span><strong>${step.title}</strong><small>${step.summary}</small></button>`).join("")}</div>
    <script type="application/json" data-nexus-steps>${JSON.stringify(processSteps).replace(/</g, "\u003c")}</script>
  </div></section>`;
}


renderPage({
  route: "/process/",
  title: "M&eacute;todo | YC Systems",
  description: "El m&eacute;todo de YC Systems para diagnosticar, dise&ntilde;ar, construir y mejorar software operativo.",
  body: (prefix) => `<section class="page-hero method-hero"><div class="container interior-hero-grid"><div><p class="kicker">M&eacute;todo YC Systems</p><h1>Una ruta visible desde el problema hasta la operaci&oacute;n</h1><p class="lead">Cada fase toma una decisi&oacute;n concreta, produce un entregable y reduce un riesgo antes de avanzar.</p><div class="nexus-mini-system"><span><strong>Observa</strong><small>Procesos y fricci&oacute;n</small></span><span><strong>Ordena</strong><small>Prioridad y alcance</small></span><span><strong>Orienta</strong><small>Decisiones y siguiente paso</small></span></div></div><ol class="process-preview">${processSteps.map((step, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span>${step.title}</li>`).join("")}</ol></div></section>${nexusMethodExplorer(prefix)}<section class="section section-alt"><div class="container">${sectionHead("Qu&eacute; recibe el cliente", "Una ruta de trabajo entendible desde el inicio")}<div class="value-grid"><article><strong>Prioridades</strong><p>Qu&eacute; resolver primero y qu&eacute; puede esperar.</p></article><article><strong>Alcance</strong><p>Qu&eacute; incluye la fase y cu&aacute;les son sus l&iacute;mites.</p></article><article><strong>Entregables</strong><p>Qu&eacute; se dise&ntilde;a, construye, valida y publica.</p></article><article><strong>Continuidad</strong><p>C&oacute;mo se mantiene y evoluciona despu&eacute;s.</p></article></div></div></section>${finalCta(prefix)}`,
});

renderPage({
  route: "/company/",
  title: "Empresa | YC Systems",
  description: "Informaci&oacute;n corporativa, enfoque y principios de YC Systems LLC.",
  body: (prefix) => `<section class="page-hero company-hero"><div class="container interior-hero-grid"><div><p class="kicker">Empresa</p><h1>Construimos software desde la operaci&oacute;n, no desde la moda</h1><p class="lead">YC Systems dise&ntilde;a sistemas claros para que equipos reales trabajen con m&aacute;s control, colaboraci&oacute;n y continuidad.</p></div><div class="company-signals"><span><small>Entidad</small><strong>YC Systems LLC</strong></span><span><small>Forma de trabajo</small><strong>Digital e internacional</strong></span><span><small>Enfoque</small><strong>Software operativo</strong></span></div></div></section><section class="section"><div class="container split"><div>${sectionHead("Qui&eacute;nes somos", "Producto, ingenier&iacute;a y negocio alrededor de un problema real", "Entendemos primero el proceso, definimos una primera fase y construimos una base que pueda mantenerse y evolucionar.")}<p>No publicamos biograf&iacute;as, fotograf&iacute;as ni cifras de equipo que no podamos respaldar. La confianza se construye mostrando c&oacute;mo decidimos y qu&eacute; entregamos.</p></div><div class="company-scope"><span><small>01 &middot; Pensamiento</small><strong>Entender antes de construir</strong></span><span><small>02 &middot; Ejecuci&oacute;n</small><strong>Entregar por fases verificables</strong></span><span><small>03 &middot; Continuidad</small><strong>Acompa&ntilde;ar despu&eacute;s del lanzamiento</strong></span></div></div></section><section class="section section-alt"><div class="container">${sectionHead("Qu&eacute; nos diferencia", "Decisiones visibles durante todo el proyecto")}<div class="value-grid"><article><strong>Claridad operativa</strong><p>El cliente y el equipo entienden el problema, el alcance y el siguiente paso.</p></article><article><strong>Arquitectura mantenible</strong><p>La primera fase se construye para evolucionar sin sobredimensionarla.</p></article><article><strong>Entrega responsable</strong><p>Cada fase tiene un resultado, una validaci&oacute;n y l&iacute;mites conocidos.</p></article><article><strong>Continuidad</strong><p>El lanzamiento abre una etapa de uso, soporte y aprendizaje.</p></article></div><div class="company-human-panel"><div><p class="kicker">Las personas y el criterio</p><h2>La tecnolog&iacute;a apoya el trabajo; no sustituye la responsabilidad</h2><p>Nexus representa nuestro m&eacute;todo para observar, ordenar, dise&ntilde;ar, construir y acompa&ntilde;ar. No reemplaza al equipo ni presenta una identidad humana ficticia.</p></div>${nexusCore("monitor", "Una gu&iacute;a visual para hacer visible el criterio de trabajo.", "company-nexus-core")}</div></div></section>${finalCta(prefix)}`,
});

renderPage({
  route: "/nexus-lab/",
  title: "Nexus Lab | YC Systems",
  description: "Galería interna de estados, expresiones, tamaños y componentes del sistema visual Nexus.",
  noindex: true,
  bodyClass: "nexus-lab-page",
  body: (prefix) => `<section class="page-hero compact-hero"><div class="container"><p class="kicker">Nexus Lab &middot; Control interno</p><h1>Sistema visual vivo</h1><p class="lead">Galería no indexable para validar identidad, estados, expresiones, componentes y movimiento antes de publicarlos en una página.</p></div></section>
  <section class="section"><div class="container nexus-lab-section"><div class="section-head"><p class="kicker">Cinco modos operativos</p><h2>Un solo sistema, estados reconocibles</h2></div><div class="nexus-lab-grid nexus-lab-grid--modes">${Object.entries(nexusSystem.modes).map(([mode, config]) => nexusCharacter(prefix, { state: mode, expression: config.expression, pose: config.pose, size: "bust", caption: config.label, message: config.message })).join("")}</div></div></section>
  <section class="section section-alt"><div class="container nexus-lab-section"><div class="section-head"><p class="kicker">Expresiones</p><h2>Doce respuestas dentro de la misma identidad</h2></div><div class="nexus-expression-grid">${nexusSystem.expressions.map((expression, index) => `<article>${nexusCharacter(prefix, { state: index === 8 ? "observe" : index === 7 || index === 11 ? "support" : "organize", expression, pose: expression === "confirming" || expression === "celebration" ? "confirming" : "observing", size: "avatar" })}<strong>${nexusSystem.expressionLabels?.[expression] || expression}</strong></article>`).join("")}</div></div></section>
  <section class="section"><div class="container nexus-lab-section"><div class="section-head"><p class="kicker">Componentes</p><h2>Piezas reutilizables y fallbacks</h2></div><div class="nexus-component-grid">${nexusGuideCard("organize", "Prioridad antes de tecnología", "Primero definimos qué necesita cambiar y cómo observar el resultado.")}${nexusInsightCard("design", "Una primera fase visible", "El alcance debe poder explicarse, medirse y validarse sin depender de promesas vagas.")}${nexusConfirmation()}${nexusLoader()}${nexusEmptyState(prefix)}</div></div></section>`,
});

renderPage({
  route: "/contact/",
  title: "Solicitar diagn&oacute;stico | YC Systems",
  description: "Solicita un diagn&oacute;stico inicial para definir el software, producto o sistema que tu empresa necesita.",
  bodyClass: "contact-page",
  body: (prefix) => `<section class="page-hero compact-hero"><div class="container narrow"><p class="kicker">Contacto &middot; Diagn&oacute;stico</p><h1>Cu&eacute;ntanos qu&eacute; parte de tu operaci&oacute;n necesita m&aacute;s control</h1><p class="lead">Dos pasos breves para entender el contexto y recomendar una primera conversaci&oacute;n &uacute;til.</p><p class="response-time">Respuesta habitual: 24&ndash;48 horas laborales.</p></div></section><section class="section contact-section"><div class="container contact-grid"><form class="brief-form" action="https://formsubmit.co/${content.contact.email}" method="post" data-brief-form data-step="1"><input type="hidden" name="_subject" value="Nuevo diagn&oacute;stico desde ycsystems.io" /><input type="hidden" name="_honey" value="" /><input type="hidden" name="source_product" data-source-product /><input type="hidden" name="source_path" data-source-path /><p class="form-step" data-brief-step>Paso 1 de 2 &middot; Contexto</p><div class="nexus-form-companion compact" data-nexus-form>${nexusCore("observe", "Cu&eacute;ntanos qui&eacute;n eres y desde qu&eacute; operaci&oacute;n nos contactas.", "nexus-form-core")}<p data-nexus-form-text>Cu&eacute;ntanos qui&eacute;n eres y desde qu&eacute; operaci&oacute;n nos contactas.</p></div><div data-step="1"><label>Nombre<input name="name" autocomplete="name" required /></label><label>Correo de trabajo<input type="email" name="email" autocomplete="email" required /></label><label>Empresa<input name="company" autocomplete="organization" required /></label><label>Rol o responsabilidad <small>Opcional</small><input name="role" autocomplete="organization-title" /></label><button class="button primary" type="button" data-brief-next>Siguiente paso</button></div><div data-step="2" hidden><label>&Aacute;rea o proceso<select name="need" required><option value="">Selecciona una opci&oacute;n</option><option>Operaci&oacute;n interna</option><option>Ventas o CRM</option><option>Datos y reportes</option><option>Automatizaci&oacute;n</option><option>Portal para clientes o socios</option><option>Producto digital</option><option>No estoy seguro</option></select></label><label>Principal fricci&oacute;n<textarea name="current_process" rows="3" required placeholder="&iquest;Qu&eacute; est&aacute; frenando hoy al equipo?"></textarea></label><label>Herramientas actuales <small>Opcional</small><input name="tools" placeholder="Hojas, correo, CRM u otras" /></label><label>Resultado esperado<textarea name="desired_result" rows="3" required placeholder="&iquest;Qu&eacute; cambio deber&iacute;a hacer visible la primera fase?"></textarea></label><label>Prioridad<select name="priority" required><option value="">Selecciona una opci&oacute;n</option><option>Explorando opciones</option><option>Necesidad de este trimestre</option><option>Proceso cr&iacute;tico</option></select></label><label class="consent-field"><input type="checkbox" name="consent" value="accepted" required /><span>Acepto que YC Systems use esta informaci&oacute;n para responder mi solicitud, conforme a la <a href="${relativeHref("/privacy/", prefix)}">Pol&iacute;tica de privacidad</a>.</span></label><div class="form-actions"><button class="button secondary" type="button" data-brief-back>Volver</button><button class="button primary" type="submit" data-brief-submit>Enviar diagn&oacute;stico</button></div></div><p class="form-status" data-brief-status aria-live="polite"></p><div class="form-success" data-brief-success hidden><strong>Solicitud enviada</strong><p>Recibimos tu informaci&oacute;n. Te responderemos por correo con el siguiente paso recomendado.</p></div></form><div class="contact-copy"><p class="kicker">Qu&eacute; puedes esperar</p><h2>Una respuesta concreta, no una venta gen&eacute;rica</h2><ol><li><span>01</span>Entendemos el problema operativo</li><li><span>02</span>Ordenamos prioridad y primera fase</li><li><span>03</span>Respondemos con el siguiente paso recomendado</li></ol><div class="contact-options"><a href="mailto:${content.contact.email}">${content.contact.email}</a><a href="${content.contact.whatsappUrl}" target="_blank" rel="noopener">WhatsApp ${content.contact.whatsappLabel}</a></div></div></div></section>`,
});

renderPage({
  route: "/operating-systems/",
  title: "Arquitectura operativa | YC Systems",
  description: "Cómo YC Systems conecta procesos, datos, automatización y decisiones en una arquitectura operativa.",
  body: (prefix) => `<section class="page-hero"><div class="container narrow"><p class="kicker">Arquitectura operativa</p><h1>Una base compartida para operar, medir y mejorar</h1><p class="lead">Los productos de YC Systems conectan módulos, datos, automatización y asistencia inteligente alrededor de una misma forma de pensar la operación.</p>${actions(prefix)}</div></section><section class="section"><div class="container architecture"><div class="architecture-core"><span>Nexus</span><strong>Capa de inteligencia</strong><small>Contexto · flujo · decisiones</small></div><div class="architecture-grid"><article><span>01</span><strong>Usuarios y roles</strong></article><article><span>02</span><strong>Datos operativos</strong></article><article><span>03</span><strong>Flujos y estados</strong></article><article><span>04</span><strong>Alertas e integraciones</strong></article><article><span>05</span><strong>Indicadores</strong></article><article><span>06</span><strong>Soporte y evolución</strong></article></div></div></section>${finalCta(prefix)}`,
});

renderPage({
  route: "/industries/",
  title: "Industrias | YC Systems",
  description: "Mercados donde YC Systems aplica software operativo y automatización.",
  body: (prefix) => `<section class="page-hero"><div class="container narrow"><p class="kicker">Industrias</p><h1>Software adaptable a operaciones con necesidades concretas</h1><p class="lead">Partimos del flujo de trabajo de cada empresa y reutilizamos principios sólidos de producto, datos y automatización.</p></div></section><section class="section"><div class="container"><div class="solution-grid">${[["Lavanderías", "Pedidos, rutas, entregas y pagos"], ["Bienes raíces", "Prospectos, reservas, propiedades y comisiones"], ["Comercio", "Catálogo, ventas y seguimiento de clientes"], ["Servicios", "Agenda, solicitudes, estados y comunicación"], ["Operaciones comerciales", "Proceso comercial, actividad, inventario e indicadores"], ["Nuevos productos", "Validación y construcción de una primera versión"]].map((item, i) => `<article class="solution-card"><span>${String(i + 1).padStart(2, "0")}</span><h2>${item[0]}</h2><p>${item[1]}</p></article>`).join("")}</div></div></section>${finalCta(prefix)}`,
});

renderPage({
  route: "/trust-center/",
  title: "Centro de confianza | YC Systems",
  description: "Principios públicos de seguridad, privacidad y confianza de YC Systems LLC.",
  body: (prefix) => `<section class="page-hero compact-hero"><div class="container narrow"><p class="kicker">Centro de confianza</p><h1>Seguridad y confianza desde el diseño</h1><p class="lead">YC Systems aplica controles proporcionales al alcance de cada producto y proyecto, con atención a acceso, privacidad, continuidad y comunicación responsable.</p></div></section><section class="section"><div class="container"><div class="value-grid"><article><strong>Acceso</strong><p>Permisos definidos por función y autenticación reforzada cuando corresponde.</p></article><article><strong>Datos</strong><p>Recopilación limitada a la información necesaria para operar el servicio.</p></article><article><strong>Continuidad</strong><p>Respaldos, monitoreo y recuperación definidos según el alcance contratado.</p></article><article><strong>Incidentes</strong><p>Evaluación, contención y comunicación responsable ante eventos relevantes.</p></article></div><div class="trust-contact"><h2>Contacto de seguridad y privacidad</h2><p>Para consultas escribe a <a href="mailto:legal@ycsystems.io">legal@ycsystems.io</a> o a <a href="mailto:${content.contact.email}">${content.contact.email}</a>.</p><p>Última actualización: 12 de julio de 2026.</p></div></div></section>`,
});

renderPage({
  route: "/documents/",
  title: "Documentos | YC Systems",
  description: "Documentos públicos y políticas corporativas de YC Systems LLC.",
  body: (prefix) => `<section class="page-hero compact-hero"><div class="container narrow"><p class="kicker">Documentos</p><h1>Información pública para trabajar con claridad</h1><p class="lead">Consulta las políticas y recursos corporativos disponibles para clientes, socios y visitantes.</p></div></section><section class="section"><div class="container document-grid"><a class="document-card" href="${relativeHref("/privacy/", prefix)}"><span>Política</span><h2>Privacidad</h2><p>Qué información recopilamos y cómo la utilizamos.</p></a><a class="document-card" href="${relativeHref("/terms/", prefix)}"><span>Política</span><h2>Términos</h2><p>Condiciones generales para el uso del sitio y los servicios.</p></a><a class="document-card" href="${relativeHref("/trust-center/", prefix)}"><span>Confianza</span><h2>Centro de confianza</h2><p>Principios de seguridad, acceso, datos y continuidad.</p></a><a class="document-card" href="${relativeHref("/company/", prefix)}"><span>Empresa</span><h2>Información corporativa</h2><p>Identidad legal, enfoque y canales oficiales.</p></a></div></section>`,
});

renderPage({
  route: "/privacy/",
  title: "Privacidad | YC Systems",
  description: "Política de privacidad del sitio web de YC Systems LLC.",
  body: () => `<section class="page-hero compact-hero"><div class="container narrow"><p class="kicker">Privacidad</p><h1>Política de privacidad</h1><p class="lead">Esta política explica qué información puede recibir YC Systems LLC a través de su sitio web y cómo se utiliza.</p></div></section><section class="section"><article class="container prose"><h2>Información que podemos recibir</h2><p>Podemos recibir nombre, empresa, correo, rol opcional, área o proceso, fricción actual, herramientas opcionales, resultado esperado y prioridad al solicitar un diagnóstico.</p><h2>Cómo utilizamos la información</h2><p>La utilizamos para responder solicitudes, evaluar necesidades, preparar una ruta inicial, mantener comunicaciones comerciales y cumplir obligaciones aplicables.</p><h2>Procesamiento del formulario</h2><p>El formulario de diagnóstico utiliza FormSubmit como proveedor técnico para transmitir la información a YC Systems. Los datos se envían con el propósito de gestionar tu solicitud comercial. No incluyas contraseñas, datos financieros ni otra información sensible. Si prefieres no utilizar el formulario, puedes escribir directamente a ${content.contact.email}.</p><h2>Conservación y derechos</h2><p>Conservamos la información durante el tiempo necesario para responder, prestar el servicio o cumplir obligaciones. Puedes solicitar acceso, corrección o eliminación escribiendo a legal@ycsystems.io.</p><h2>Contacto</h2><p>YC Systems LLC · ${content.contact.email} · Operación digital internacional.</p><p>Última actualización: 14 de julio de 2026.</p></article></section>`,
});

renderPage({
  route: "/terms/",
  title: "Términos | YC Systems",
  description: "Términos generales del sitio web y los servicios de YC Systems LLC.",
  body: () => `<section class="page-hero compact-hero"><div class="container narrow"><p class="kicker">Términos</p><h1>Términos generales</h1><p class="lead">Estas condiciones regulan el uso del sitio público de YC Systems LLC y establecen principios generales para futuras relaciones de servicio.</p></div></section><section class="section"><article class="container prose"><h2>Uso del sitio</h2><p>El contenido se ofrece con fines informativos y comerciales. No constituye una garantía de disponibilidad, precio, resultado o alcance específico.</p><h2>Productos y servicios</h2><p>La disponibilidad de productos puede estar limitada por estado, mercado o modalidad de acceso. Los proyectos para clientes se rigen por una propuesta o acuerdo escrito con alcance, tiempos, pagos y responsabilidades.</p><h2>Propiedad intelectual</h2><p>La identidad, contenido, diseños y materiales propios de YC Systems están protegidos por las leyes aplicables. Los activos de clientes pertenecen a sus respectivos titulares.</p><h2>Responsabilidad</h2><p>Cada solución depende de requisitos, integraciones y decisiones del cliente. YC Systems define compromisos específicos únicamente en documentos aceptados por las partes.</p><h2>Contacto</h2><p>Para consultas escribe a legal@ycsystems.io o ${content.contact.email}.</p><p>Última actualización: 12 de julio de 2026.</p></article></section>`,
});

renderPage({
  route: "/documentation/",
  title: "Documentación | YC Systems",
  description: "Recursos públicos para entender el proceso, los productos y el soporte de YC Systems.",
  body: (prefix) => `<section class="page-hero compact-hero"><div class="container narrow"><p class="kicker">Documentación</p><h1>Recursos para clientes y equipos</h1><p class="lead">Una entrada pública a proceso, productos, confianza y canales de soporte.</p></div></section><section class="section"><div class="container document-grid"><a class="document-card" href="${relativeHref("/process/", prefix)}"><span>Proceso</span><h2>Método de trabajo</h2><p>Cómo se define y entrega una primera fase.</p></a><a class="document-card" href="${relativeHref("/products/", prefix)}"><span>Productos</span><h2>Disponibilidad</h2><p>Estados y formas de acceso a productos YC Systems.</p></a><a class="document-card" href="${relativeHref("/trust-center/", prefix)}"><span>Confianza</span><h2>Seguridad y privacidad</h2><p>Principios públicos para clientes y visitantes.</p></a><a class="document-card" href="${relativeHref("/contact/", prefix)}"><span>Soporte</span><h2>Canales oficiales</h2><p>Solicita orientación o comparte una necesidad.</p></a></div></section>`,
});

renderPage({
  route: "/developers/",
  title: "Ingeniería de producto | YC Systems",
  description: "Principios públicos de ingeniería de producto aplicados por YC Systems.",
  body: (prefix) => `<section class="page-hero"><div class="container narrow"><p class="kicker">Ingeniería de producto</p><h1>Software mantenible, medible y preparado para evolucionar</h1><p class="lead">Nuestra práctica conecta arquitectura, experiencia, datos, automatización y operación sin exponer detalles sensibles de implementación.</p></div></section><section class="section"><div class="container value-grid"><article><strong>Arquitectura modular</strong><p>Responsabilidades claras y cambios con impacto controlado.</p></article><article><strong>Calidad continua</strong><p>Validación funcional, visual y técnica antes de publicar.</p></article><article><strong>Accesibilidad</strong><p>Interfaces utilizables con teclado, contraste y estructura semántica.</p></article><article><strong>Observabilidad</strong><p>Indicadores y señales operativas para detectar problemas.</p></article></div></section>${finalCta(prefix)}`,
});


const intentPages = [
  ["/custom-software/", "Software a medida", "Sistemas diseñados alrededor de una operación real"],
  ["/crm-development/", "CRM operativo", "Seguimiento comercial visible y accionable"],
  ["/dashboard-development/", "Paneles ejecutivos", "Indicadores para decidir con más claridad"],
  ["/internal-systems/", "Sistemas internos", "Procesos, roles y datos dentro de un solo flujo"],
  ["/saas-development/", "Producto SaaS", "Una primera versión preparada para evolucionar"],
  ["/ai-automation/", "Automatización", "Menos trabajo repetitivo y más control operativo"],
  ["/mvp-development/", "Primera versión", "Valida alcance, uso y dirección sin perder la base"],
];

for (const [route, kicker, title] of intentPages) {
  renderPage({
    route,
    title: `${kicker} | YC Systems`,
    description: `${title}. Soluciones de software operativo de YC Systems.`,
    noindex: true,
    body: (prefix) => `<section class="page-hero"><div class="container narrow"><p class="kicker">${kicker}</p><h1>${title}</h1><p class="lead">Definimos el problema, ordenamos la primera fase y construimos una solución mantenible con criterios claros de éxito.</p>${actions(prefix, "/case-studies/")}</div></section><section class="section"><div class="container value-grid"><article><strong>Diagnóstico</strong><p>Usuarios, proceso, prioridad y resultado esperado.</p></article><article><strong>Primera fase</strong><p>Alcance suficiente para generar valor y aprender.</p></article><article><strong>Evolución</strong><p>Una base que puede recibir nuevas capacidades.</p></article></div></section>`,
  });
}

function redirectDocument(route, target) {
  const prefix = relativePrefix(route);
  const destination = relativeHref(target, prefix);
  return `<!doctype html><html lang="es"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><meta name="robots" content="noindex, follow" /><meta http-equiv="refresh" content="0; url=${destination}" /><link rel="canonical" href="https://ycsystems.io${target}" /><title>Redirigiendo | YC Systems</title><script>location.replace(${JSON.stringify(destination)});</script></head><body><p>Esta página se movió. <a href="${destination}">Continuar</a></p></body></html>\n`;
}

for (const route of routesMap.routes) {
  const output = route.path === "/"
    ? path.join(siteRoot, "index.html")
    : path.join(siteRoot, route.path.replace(/^\//, ""), "index.html");
  if (route.status === "retired") {
    await rm(path.dirname(output), { recursive: true, force: true });
    continue;
  }

  await mkdir(path.dirname(output), { recursive: true });

  if (route.status === "redirect" && route.redirectTo) {
    await writeFile(output, redirectDocument(route.path, route.redirectTo), "utf8");
    continue;
  }

  const html = canonicalPages.get(route.path);
  if (html) await writeFile(output, html, "utf8");
}

const sitemapEntries = routesMap.routes
  .filter((route) => route.sitemap)
  .map((route) => `  <url><loc>https://ycsystems.io${route.path}</loc></url>`)
  .join("\n");
await writeFile(path.join(siteRoot, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</urlset>\n`, "utf8");

const notFoundPrefix = "./";
const notFound = `<!doctype html><html lang="es">${pageHead({ route: "/404.html", prefix: notFoundPrefix, title: "Página no encontrada | YC Systems", description: "La página solicitada no existe o ya no está disponible.", noindex: true })}<body class="not-found-page"><a class="skip-link" href="#main-content">Saltar al contenido</a>${renderHeader("/404.html", notFoundPrefix)}<main id="main-content"><section class="page-hero"><div class="container narrow"><p class="kicker">Error 404</p><h1>Esta página no está disponible</h1><p class="lead">Puedes volver al inicio, explorar productos o solicitar un diagnóstico.</p><div class="actions"><a class="button primary" href="./">Volver al inicio</a><a class="button secondary" href="./products/">Ver productos</a></div></div></section></main>${renderFooter(notFoundPrefix)}<script src="./script.js?v=yc-nexus-live-20260714g"></script></body></html>\n`;
await writeFile(path.join(siteRoot, "404.html"), notFound, "utf8");

console.log(`Built ${canonicalPages.size} YC Systems V2 pages.`);
