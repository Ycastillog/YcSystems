import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const siteRoot = path.join(root, "site");
const content = JSON.parse(await readFile(path.join(siteRoot, "data", "site-content.json"), "utf8"));
const routesMap = JSON.parse(await readFile(path.join(root, "config", "routes-map.json"), "utf8"));

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
    <link rel="stylesheet" href="${prefix}styles.css?v=yc-v2-release-20260712" />
    <script type="application/ld+json">${organizationData}</script>
  </head>`;
}

function renderPage({ route, title, description, body, noindex = false, bodyClass = "", ogImage }) {
  const prefix = relativePrefix(route);
  const routeDefinition = routesMap.routes.find((item) => item.path === route);
  const effectiveNoindex = noindex || routeDefinition?.indexable === false;
  const html = `<!doctype html>
<html lang="es">
${pageHead({ route, prefix, title, description, noindex: effectiveNoindex, ogImage })}
<body class="${bodyClass}" data-route="${route}">
  <a class="skip-link" href="#main-content">Saltar al contenido</a>
  ${renderHeader(route, prefix)}
  <main id="main-content">${body(prefix)}</main>
  ${renderFooter(prefix)}
  <script src="${prefix}script.js?v=yc-v2-release-20260712"></script>
</body>
</html>
`;
  canonicalPages.set(route, html);
}

function actions(prefix, secondary = "/products/") {
  return `<div class="actions"><a class="button primary" href="${relativeHref("/contact/", prefix)}">Solicitar diagn&oacute;stico</a><a class="button secondary" href="${relativeHref(secondary, prefix)}">${secondary === "/case-studies/" ? "Ver casos" : "Ver productos"}</a></div>`;
}

function sectionHead(kicker, title, text = "") {
  return `<div class="section-head"><p class="kicker">${kicker}</p><h2>${title}</h2>${text ? `<p>${text}</p>` : ""}</div>`;
}

const nexusStateLabels = {
  idle: "En reposo",
  observe: "Observando",
  connect: "Conectando",
  design: "Diseñando",
  build: "Construyendo",
  activate: "Activando",
  monitor: "Monitoreando",
  success: "Confirmado",
  caution: "Revisando",
  error: "Atención",
};

function nexusAvatar(prefix, state = "idle", message = "Primero entendamos el proceso.", modifier = "", action = "") {
  const label = nexusStateLabels[state] || nexusStateLabels.idle;
  return `<figure class="nexus-avatar ${modifier}" data-nexus data-nexus-state="${state}" data-nexus-label="${label}">
    <div class="nexus-signal-map" aria-hidden="true"><i></i><i></i><i></i><b></b></div>
    <div class="nexus-orbit" aria-hidden="true"><span></span><span></span><span></span></div>
    <img src="${prefix}assets/brand/nexus/nexus-avatar.webp" alt="Nexus, capa visual de YC Systems" width="720" height="720" loading="lazy" />
    <figcaption><strong>Nexus</strong><span data-nexus-message>${message}</span>${action}</figcaption>
  </figure>`;
}

const reservedCapabilities = [
  { label: "01", title: "Operaciones conectadas", text: "Flujos de trabajo, estados, responsables y seguimiento en una misma base operativa." },
  { label: "02", title: "Visibilidad ejecutiva", text: "Indicadores y lecturas claras para decidir sin depender de reportes dispersos." },
  { label: "03", title: "Arquitectura modular", text: "Cada implementaci&oacute;n puede integrar componentes distintos seg&uacute;n el contexto operativo del cliente." },
  { label: "04", title: "Automatizaci&oacute;n por fases", text: "Reglas, alertas e integraciones que reducen trabajo repetitivo sin exponer detalles internos." },
];

function reservedCapabilityCards() {
  return reservedCapabilities.map((item, index) => `<article tabindex="0" data-nexus-trigger data-nexus-state="${index === 1 ? "monitor" : index === 2 ? "design" : index === 3 ? "build" : "connect"}" data-nexus-message="${item.title}. ${item.text.replace(/"/g, "&quot;")}"><span>${item.label}</span><strong>${item.title}</strong><p>${item.text}</p></article>`).join("");
}

function homeProductHighlight(prefix) {
  return `<div class="home-product-highlight reserved-product-highlight"><div class="home-product-copy"><p class="kicker">Ecosistema propio</p><h2>Soluciones disponibles para clientes y operaciones reales</h2><p>Nuestro ecosistema incluye soluciones p&uacute;blicas y desarrollos implementados exclusivamente para organizaciones y clientes.</p><div class="actions"><a class="button primary" href="${relativeHref("/contact/", prefix)}">Solicitar diagn&oacute;stico</a><a class="button secondary" href="${relativeHref("/solutions/", prefix)}">Ver soluciones</a></div></div><div class="reserved-system-card" aria-label="Capacidades de producto YC Systems"><span>Nexus</span><strong>Capa de orientaci&oacute;n operativa</strong><small>Diagn&oacute;stico &middot; arquitectura &middot; ejecuci&oacute;n</small><div><em>OS</em><em>CRM</em><em>BI</em><em>API</em></div></div></div>`;
}

function reservedProductsSection(prefix) {
  return `<section class="section"><div class="container">${sectionHead("Ecosistema propio", "Soluciones para operaciones que necesitan control", "Nuestro ecosistema incluye soluciones p&uacute;blicas y desarrollos implementados exclusivamente para organizaciones y clientes. La web muestra la direcci&oacute;n comercial sin exponer arquitectura, interfaces o informaci&oacute;n privada.")}<div class="value-grid reserved-capability-grid">${reservedCapabilityCards()}</div><div class="conversion-panel"><p><strong>Si tu empresa necesita algo similar</strong><span>Podemos evaluar tu operaci&oacute;n y definir una primera fase con alcance claro, acceso controlado y confidencialidad.</span></p><a class="button primary" href="${relativeHref("/contact/", prefix)}">Solicitar diagn&oacute;stico</a></div></div></section>`;
}

function privateAcceleratorsSection(prefix) {
  return `<section class="section section-alt"><div class="container">${sectionHead("Productos relacionados", "Capacidades propias aplicadas al problema del cliente", "Cuando una soluci&oacute;n necesita componentes internos, los evaluamos durante el diagn&oacute;stico y los usamos solo si aportan claridad, velocidad o control operativo.")}<div class="nexus-guide" data-nexus-guide>${nexusAvatar(prefix, "connect", "Nexus conecta cada capacidad con un resultado operativo.", "nexus-guide-avatar")}<div><p class="kicker">Nexus Guide</p><h3>Elige una capacidad para ver qu&eacute; aporta a la operaci&oacute;n</h3><p data-nexus-guide-text>Nexus conecta cada capacidad con un resultado operativo.</p></div></div><div class="value-grid reserved-capability-grid">${reservedCapabilityCards()}</div><div class="section-action"><a class="button secondary" href="${relativeHref("/products/", prefix)}">Ver enfoque de producto</a></div></div></section>`;
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
  body: (prefix) => `<section class="hero"><div class="container hero-grid"><div class="hero-copy"><p class="kicker">YC Systems LLC &middot; Software operativo</p><h1>Software operativo para empresas que necesitan control, velocidad y crecimiento</h1><p class="lead">Dise&ntilde;amos plataformas empresariales que centralizan operaciones, automatizan procesos y convierten informaci&oacute;n en decisiones.</p>${actions(prefix)}<p class="trust-line">Software empresarial &middot; procesos digitalizados &middot; implementaci&oacute;n guiada</p></div><div class="identity-showcase" aria-label="Identidad y propuesta de YC Systems"><div class="identity-message"><p class="identity-label">YC Systems</p><h2>Operaciones reales convertidas en sistemas claros</h2><p>Ordenamos procesos, datos y decisiones para que el equipo pueda vender, operar y crecer con una base confiable.</p><ul><li>Software empresarial</li><li>Automatizaci&oacute;n por fases</li><li>Soporte continuo</li></ul></div>${nexusAvatar(prefix, "observe", "Nexus est&aacute; observando tu operaci&oacute;n.", "nexus-home", `<a class="nexus-action text-link" href="${relativeHref("/contact/", prefix)}">Descubre d&oacute;nde comenzar</a>`)}</div></div></section>
  <section class="authority-band mini-proof-band" aria-label="Se&ntilde;ales de confianza"><div class="container authority-list"><span><small>OK</small><strong>Software empresarial</strong></span><span><small>OK</small><strong>Procesos digitalizados</strong></span><span><small>OK</small><strong>Informaci&oacute;n centralizada</strong></span><span><small>OK</small><strong>Implementaci&oacute;n guiada</strong></span></div></section>
  <section class="section route-section"><div class="container">${sectionHead("Elige tu ruta", "Dos formas claras de empezar", "Revisa la direcci&oacute;n del ecosistema YC Systems o define una primera fase para tu propia operaci&oacute;n.")}<div class="choice-grid"><a class="choice" href="${relativeHref("/products/", prefix)}"><span>01</span><strong>Entender el ecosistema propio</strong><p>Conoce la direcci&oacute;n de nuestras capacidades internas sin exponer detalles prematuros.</p><small>Ver ecosistema</small></a><a class="choice" href="${relativeHref("/contact/", prefix)}"><span>02</span><strong>Construir un sistema para mi empresa</strong><p>Ordena un proceso comercial, administrativo u operativo mediante una primera fase clara.</p><small>Solicitar diagn&oacute;stico</small></a></div><p class="route-note">&iquest;Todav&iacute;a no sabes qu&eacute; necesitas? El diagn&oacute;stico inicial ayuda a definir el primer paso.</p></div></section>
  <section class="section section-alt"><div class="container">${homeProductHighlight(prefix)}</div></section>
  <section class="section nexus-section"><div class="container nexus-panel"><figure class="nexus-portrait"><img src="${prefix}assets/brand/nexus/nexus-avatar.webp" alt="Nexus, gu&iacute;a visual de YC Systems" width="720" height="720" loading="lazy" /></figure><div class="nexus-copy"><p class="kicker">Nexus Operational Guidance</p><h2>Una gu&iacute;a visual para observar, ordenar y decidir</h2><p>Nexus representa la forma en que YC Systems entiende una operaci&oacute;n antes de construir: primero observa, luego conecta y finalmente orienta el siguiente paso.</p><div class="nexus-steps"><span><strong>Observa</strong><small>Procesos y se&ntilde;ales</small></span><span><strong>Orienta</strong><small>Prioridades y alcance</small></span><span><strong>Conecta</strong><small>Datos y decisiones</small></span></div><a class="text-link" href="${relativeHref("/process/", prefix)}">Ver c&oacute;mo trabajamos</a></div></div></section>
  <section class="section section-alt"><div class="container">${sectionHead("Casos", "Proyectos publicados para negocios reales", "Una selecci&oacute;n de experiencias digitales entregadas para comercio, bienes ra&iacute;ces y presencia corporativa.")}<div class="case-grid case-feature-list">${caseCards(prefix, 2)}</div><div class="section-action"><a class="text-link" href="${relativeHref("/case-studies/", prefix)}">Ver casos</a></div></div></section>${finalCta(prefix)}`,
});

renderPage({
  route: "/products/",
  title: "Ecosistema propio | YC Systems",
  description: "YC Systems construye soluciones p&uacute;blicas y desarrollos implementados exclusivamente para organizaciones y clientes.",
  body: (prefix) => `<section class="page-hero products-hero"><div class="container interior-hero-grid"><div><p class="kicker">Productos YC Systems</p><h1>Ecosistema propio para operaciones reales</h1><p class="lead">Nuestro ecosistema incluye soluciones p&uacute;blicas y desarrollos implementados exclusivamente para organizaciones y clientes.</p><div class="actions"><a class="button primary" href="${relativeHref("/contact/", prefix)}">Solicitar diagn&oacute;stico</a><a class="button secondary" href="${relativeHref("/solutions/", prefix)}">Ver soluciones</a></div></div><div class="hero-status-guide" aria-label="Principios de exposici&oacute;n"><span><b>Direcci&oacute;n clara</b> Software operativo para negocios reales</span><span><b>Acceso controlado</b> Validaci&oacute;n bajo diagn&oacute;stico</span><span><b>Arquitectura modular</b> Componentes seg&uacute;n contexto</span><span><b>Nexus</b> Capa de orientaci&oacute;n operativa</span></div></div></section>${reservedProductsSection(prefix)}${finalCta(prefix)}`,
});

const solutions = [
  { title: "Sistemas internos", problem: "La operaci&oacute;n depende de hojas, mensajes y decisiones dispersas.", result: "Mayor trazabilidad" },
  { title: "CRM operativo", problem: "El equipo vende, pero no tiene una lectura clara de prospectos, tareas y cierres.", result: "Seguimiento comercial visible" },
  { title: "Paneles ejecutivos", problem: "Los indicadores llegan tarde o viven en reportes que nadie revisa a tiempo.", result: "Decisiones m&aacute;s r&aacute;pidas" },
  { title: "Automatizaci&oacute;n", problem: "El equipo repite tareas manuales que consumen tiempo y aumentan errores.", result: "Menos errores operativos" },
  { title: "Portales y plataformas", problem: "Clientes, socios o equipos necesitan acceder a informaci&oacute;n sin depender de conversaciones sueltas.", result: "Acceso ordenado por rol" },
  { title: "Productos SaaS", problem: "Existe una oportunidad de producto, pero falta convertirla en una primera versi&oacute;n usable.", result: "Primera versi&oacute;n validable" },
];

renderPage({
  route: "/solutions/",
  title: "Soluciones | YC Systems",
  description: "Soluciones de software dise&ntilde;adas para resolver operaciones reales.",
  body: (prefix) => `<section class="page-hero solutions-hero"><div class="container interior-hero-grid"><div><p class="kicker">Soluciones</p><h1>Soluciones dise&ntilde;adas para resolver operaciones reales</h1><p class="lead">Desde procesos internos hasta plataformas completas, construimos software adaptado al funcionamiento de cada empresa.</p><div class="actions"><a class="button primary" href="${relativeHref("/contact/", prefix)}">Solicitar diagn&oacute;stico</a><a class="text-link" href="${relativeHref("/case-studies/", prefix)}">Ver casos</a></div></div><div class="capability-map" data-nexus-scope><span tabindex="0" data-nexus-trigger data-nexus-state="observe" data-nexus-message="Nexus identifica usuarios, permisos y responsabilidades antes de construir.">Usuarios y roles</span><span tabindex="0" data-nexus-trigger data-nexus-state="connect" data-nexus-message="Nexus conecta los datos que la operaci&oacute;n necesita para decidir.">Datos operativos</span><span tabindex="0" data-nexus-trigger data-nexus-state="design" data-nexus-message="Nexus ordena estados, pasos y reglas para que el flujo sea claro.">Flujos y estados</span><span tabindex="0" data-nexus-trigger data-nexus-state="build" data-nexus-message="Nexus ayuda a convertir tareas repetidas en acciones controladas.">Automatizaci&oacute;n</span><span tabindex="0" data-nexus-trigger data-nexus-state="monitor" data-nexus-message="Nexus mantiene visibles las se&ntilde;ales que importan.">Indicadores</span><span tabindex="0" data-nexus-trigger data-nexus-state="activate" data-nexus-message="Nexus acompa&ntilde;a el uso, soporte y evoluci&oacute;n por fases.">Soporte y evoluci&oacute;n</span><strong>Una arquitectura compartida</strong></div></div></section><section class="section"><div class="container">${sectionHead("Problemas que resolvemos", "Selecciona el &aacute;rea que deseas transformar", "Cada bloque parte de una fricci&oacute;n operativa concreta y termina en un resultado de negocio comprensible.")}<div class="nexus-guide" data-nexus-guide>${nexusAvatar(prefix, "connect", "Selecciona una capacidad y Nexus mostrar&aacute; qu&eacute; resultado operativo produce.", "nexus-guide-avatar")}<div><p class="kicker">Nexus Guide</p><h3>La soluci&oacute;n se entiende por problema, intervenci&oacute;n y resultado</h3><p data-nexus-guide-text>Selecciona una capacidad y Nexus mostrar&aacute; qu&eacute; resultado operativo produce.</p></div></div><div class="solution-grid">${solutions.map((item, index) => `<article class="solution-card" tabindex="0" data-nexus-trigger data-nexus-state="${index === 3 ? "build" : index === 2 ? "monitor" : index === 5 ? "activate" : "connect"}" data-nexus-message="${item.result}. ${item.problem.replace(/"/g, "&quot;")}"><span>${String(index + 1).padStart(2, "0")}</span><h2>${item.title}</h2><p class="solution-problem"><strong>Problema</strong>${item.problem}</p><p><strong>Resultado esperado</strong>${item.result}</p></article>`).join("")}</div><div class="conversion-panel"><p><strong>&iquest;Tu necesidad cruza varias &aacute;reas?</strong><span>Nexus ayuda a traducir la operaci&oacute;n en una primera fase clara antes de elegir producto o tecnolog&iacute;a.</span></p><a class="button primary" href="${relativeHref("/contact/", prefix)}">Solicitar diagn&oacute;stico</a></div></div></section>${privateAcceleratorsSection(prefix)}<section class="section"><div class="container">${sectionHead("Criterio de construcci&oacute;n", "Nexus ordena la conversaci&oacute;n antes de construir", "Antes de elegir tecnolog&iacute;a, definimos usuarios, decisiones, informaci&oacute;n, riesgos y resultado esperado.")}<div class="value-grid"><article><strong>Alcance claro</strong><p>Una primera fase que el equipo puede entender, usar y medir.</p></article><article><strong>Arquitectura mantenible</strong><p>Una base preparada para cambios sin rehacer toda la soluci&oacute;n.</p></article><article><strong>Entrega responsable</strong><p>Versiones, validaci&oacute;n y acompa&ntilde;amiento despu&eacute;s del lanzamiento.</p></article></div></div></section>${finalCta(prefix)}`,
});

renderPage({
  route: "/case-studies/",
  title: "Casos | YC Systems",
  description: "Casos publicados de sitios y experiencias digitales construidos por YC Systems.",
  body: (prefix) => `<section class="page-hero cases-hero"><div class="container interior-hero-grid"><div><p class="kicker">Casos</p><h1>Proyectos publicados para negocios reales</h1><p class="lead">Trabajos autorizados que muestran enfoque comercial, claridad visual y canales digitales listos para operar.</p><a class="text-link" href="${relativeHref("/brands/ghostwear/", prefix)}">Ver enfoque GhostWear</a></div><figure class="featured-case-preview"><img src="${prefix}assets/screenshots/ghostwear-live-2026.webp" alt="Experiencia publicada de GhostWear" width="1440" height="1000" fetchpriority="high" /><figcaption><span>Caso destacado</span><strong>GhostWear</strong></figcaption></figure></div></section><section class="section"><div class="container">${sectionHead("Caso de estudio", "Una presencia comercial convertida en canal de confianza")}<div class="case-grid case-feature-list">${caseCards(prefix, 1, 1)}</div></div></section><section class="section section-alt"><div class="container">${sectionHead("Trabajos publicados", "Experiencias activas construidas por YC Systems", "Una muestra compacta del trabajo entregado para empresas y marcas reales.")}<div class="case-grid case-archive-grid">${caseCards(prefix, 3, 2)}</div></div></section>${finalCta(prefix)}`,
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
    title: "Diagnóstico",
    summary: "Entendemos operación, usuarios, prioridades, riesgo y resultado esperado.",
    deliverable: "Mapa inicial del problema, prioridad y primera decisión de alcance.",
    risk: "Reduce construir algo bonito que no resuelve la operación real.",
    message: "Primero entendamos el proceso."
  },
  {
    id: "arquitectura",
    state: "connect",
    title: "Arquitectura",
    summary: "Definimos módulos, datos, integraciones y límites de la primera versión.",
    deliverable: "Estructura del sistema, módulos, datos y conexiones principales.",
    risk: "Reduce rehacer la base cuando el sistema empiece a crecer."
  },
  {
    id: "diseno",
    state: "design",
    title: "Diseño",
    summary: "Convertimos el flujo en una experiencia clara para cada tipo de usuario.",
    deliverable: "Flujos, pantallas clave y reglas de interacción listas para validar.",
    risk: "Reduce confusión, pantallas innecesarias y adopción débil."
  },
  {
    id: "desarrollo",
    state: "build",
    title: "Desarrollo",
    summary: "Construimos, validamos y entregamos por versiones controladas.",
    deliverable: "Primera versión funcional con componentes, datos y pruebas esenciales.",
    risk: "Reduce entregas incompletas, deuda temprana y cambios sin control."
  },
  {
    id: "lanzamiento",
    state: "activate",
    title: "Lanzamiento",
    summary: "Preparamos publicación, adopción, uso inicial y soporte de salida.",
    deliverable: "Checklist de activación, acceso, capacitación y seguimiento inicial.",
    risk: "Reduce lanzar sin operación, sin responsables y sin ruta de soporte."
  },
  {
    id: "soporte",
    state: "monitor",
    title: "Soporte",
    summary: "Medimos uso, corregimos fricción y priorizamos la siguiente fase.",
    deliverable: "Plan de mejora, soporte y evolución con señales de uso reales.",
    risk: "Reduce abandono, errores repetidos y crecimiento sin dirección."
  },
];

function nexusMethodExplorer(prefix) {
  const first = processSteps[0];
  return `<section class="section nexus-method-section"><div class="container nexus-method" data-nexus-method>
    <div class="nexus-method-steps" role="tablist" aria-label="Estados del método YC Systems">${processSteps.map((step, index) => `<button type="button" role="tab" data-nexus-step="${index}" data-state="${step.state}" data-message="${step.message || step.summary}" aria-selected="${index === 0 ? "true" : "false"}"${index === 0 ? ' aria-current="step"' : ""}><span>${String(index + 1).padStart(2, "0")}</span><strong>${step.title}</strong><small>${step.summary}</small></button>`).join("")}</div>
    <div class="nexus-method-stage">${nexusAvatar(prefix, first.state, first.message, "nexus-method-avatar")}<div class="nexus-method-diagram" aria-hidden="true"><span></span><span></span><span></span><span></span><i></i></div></div>
    <article class="nexus-method-detail" data-nexus-detail aria-live="polite"><p class="nexus-method-progress" data-nexus-progress>Fase 1 de ${processSteps.length}</p><p class="kicker" data-nexus-detail-state>${first.state}</p><h2 data-nexus-detail-title>${first.title}</h2><p data-nexus-detail-summary>${first.summary}</p><dl><div><dt>Entregable</dt><dd data-nexus-detail-deliverable>${first.deliverable}</dd></div><div><dt>Riesgo que reduce</dt><dd data-nexus-detail-risk>${first.risk}</dd></div></dl><div class="nexus-method-controls"><button class="button secondary" type="button" data-nexus-prev>Anterior</button><button class="button secondary" type="button" data-nexus-next>Siguiente</button></div></article>
    <script type="application/json" data-nexus-steps>${JSON.stringify(processSteps).replace(/</g, "\u003c")}</script>
  </div></section>`;
}


renderPage({
  route: "/process/",
  title: "M&eacute;todo | YC Systems",
  description: "El m&eacute;todo de YC Systems para diagnosticar, dise&ntilde;ar, construir y mejorar software operativo.",
  body: (prefix) => `<section class="page-hero method-hero"><div class="container interior-hero-grid"><div><p class="kicker">M&eacute;todo</p><h1>Conoce c&oacute;mo trabajamos</h1><p class="lead">Nexus acompa&ntilde;a este recorrido como una capa de orientaci&oacute;n visual: observa el contexto, conecta decisiones y ayuda a mantener clara cada fase.</p><div class="nexus-mini-system"><span><strong>Nexus observa</strong><small>Procesos y fricci&oacute;n</small></span><span><strong>Nexus orienta</strong><small>Prioridad y alcance</small></span><span><strong>Nexus conecta</strong><small>Datos y decisiones</small></span></div></div><ol class="process-preview">${processSteps.map((step, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span>${step.title}</li>`).join("")}</ol></div></section>${nexusMethodExplorer(prefix)}<section class="section"><div class="container"><ol class="process-list">${processSteps.map((step, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span><div><h2>${step.title}</h2><p>${step.summary}</p></div></li>`).join("")}</ol></div></section><section class="section section-alt"><div class="container">${sectionHead("Qu&eacute; recibe el cliente", "Una ruta de trabajo entendible desde el inicio")}<div class="value-grid"><article><strong>Prioridades</strong><p>Qu&eacute; resolver primero y qu&eacute; puede esperar.</p></article><article><strong>Alcance</strong><p>Qu&eacute; incluye la fase y cu&aacute;les son sus l&iacute;mites.</p></article><article><strong>Entregables</strong><p>Qu&eacute; se dise&ntilde;a, construye, valida y publica.</p></article><article><strong>Continuidad</strong><p>C&oacute;mo se mantiene y evoluciona despu&eacute;s.</p></article></div></div></section>${finalCta(prefix)}`,
});

renderPage({
  route: "/company/",
  title: "Empresa | YC Systems",
  description: "Informaci&oacute;n corporativa, enfoque y principios de YC Systems LLC.",
  body: (prefix) => `<section class="page-hero company-hero"><div class="container interior-hero-grid"><div><p class="kicker">Empresa</p><h1>Creamos software porque las empresas necesitan operar mejor</h1><p class="lead">No se trata solo de digitalizar procesos. YC Systems construye sistemas claros para que equipos reales trabajen con m&aacute;s control, colaboraci&oacute;n y continuidad.</p></div><div class="company-signals"><span><small>Entidad</small><strong>YC Systems LLC</strong></span><span><small>Operaci&oacute;n</small><strong>Digital e internacional</strong></span><span><small>Enfoque</small><strong>Software operativo</strong></span></div></div></section><section class="section"><div class="container split"><div>${sectionHead("Direcci&oacute;n", "Claridad, colaboraci&oacute;n y mejora continua", "Nuestra forma de trabajar se basa en entender la operaci&oacute;n antes de construir y acompa&ntilde;ar la evoluci&oacute;n despu&eacute;s del lanzamiento.")}<p>Combinamos producto, ingenier&iacute;a y negocio para crear sistemas que conectan informaci&oacute;n, personas y decisiones.</p></div><div class="company-scope"><span><small>Pilar 01</small><strong>Claridad</strong></span><span><small>Pilar 02</small><strong>Confiabilidad</strong></span><span><small>Pilar 03</small><strong>Evoluci&oacute;n continua</strong></span></div></div></section><section class="section section-alt"><div class="container">${sectionHead("Principios", "La forma en que decidimos qu&eacute; construir")}<div class="value-grid"><article><strong>Claridad</strong><p>El cliente y el equipo deben entender el sistema.</p></article><article><strong>Confiabilidad</strong><p>La confianza se protege con procesos, l&iacute;mites y comunicaci&oacute;n clara.</p></article><article><strong>Evoluci&oacute;n continua</strong><p>Una soluci&oacute;n &uacute;til hoy debe poder mejorar ma&ntilde;ana.</p></article></div></div></section>${finalCta(prefix)}`,
});

renderPage({
  route: "/contact/",
  title: "Solicitar diagn&oacute;stico | YC Systems",
  description: "Solicita un diagn&oacute;stico inicial para definir el software, producto o sistema que tu empresa necesita.",
  bodyClass: "contact-page",
  body: (prefix) => `<section class="page-hero compact-hero"><div class="container narrow"><p class="kicker">Solicitar diagn&oacute;stico</p><h1>Cu&eacute;ntanos el desaf&iacute;o</h1><p class="lead">Nos pondremos en contacto para entender tu operaci&oacute;n y evaluar la mejor forma de ayudarte.</p><p class="response-time">Respuesta habitual: 24&ndash;48 horas laborales.</p></div></section><section class="section contact-section"><div class="container contact-grid"><form class="brief-form" action="https://formsubmit.co/${content.contact.email}" method="post" data-brief-form data-step="1"><input type="hidden" name="_subject" value="Nuevo diagn&oacute;stico desde ycsystems.io" /><input type="hidden" name="_honey" value="" /><input type="hidden" name="source_product" data-source-product /><input type="hidden" name="source_path" data-source-path /><p class="form-step" data-brief-step>Paso 1 de 2</p><div class="nexus-form-companion compact" data-nexus-form>${nexusAvatar(prefix, "observe", "Primero entendamos qu&eacute; proceso necesita m&aacute;s control.", "nexus-form-avatar")}<p data-nexus-form-text>Primero entendamos qu&eacute; proceso necesita m&aacute;s control.</p></div><div data-step="1"><label>Nombre<input name="name" autocomplete="name" required /></label><label>Correo de trabajo<input type="email" name="email" autocomplete="email" required /></label><label>Empresa<input name="company" autocomplete="organization" required /></label><label>Tel&eacute;fono <small>Opcional</small><input type="tel" name="phone" autocomplete="tel" /></label><label>&iquest;Qu&eacute; necesitas mejorar?<select name="need" required><option value="">Selecciona una opci&oacute;n</option><option>Sistema interno</option><option>CRM o ventas</option><option>Panel o reportes</option><option>Automatizaci&oacute;n</option><option>Producto SaaS</option><option>Sitio comercial</option><option>No estoy seguro</option></select></label><button class="button primary" type="button" data-brief-next>Continuar</button></div><div data-step="2" hidden><label>Industria<input name="industry" autocomplete="organization-title" required /></label><label>Proceso actual<textarea name="current_process" rows="3" required placeholder="&iquest;C&oacute;mo resuelven esta operaci&oacute;n hoy?"></textarea></label><label>Tama&ntilde;o del equipo<select name="team_size" required><option value="">Selecciona una opci&oacute;n</option><option>1 a 5 personas</option><option>6 a 20 personas</option><option>21 a 50 personas</option><option>M&aacute;s de 50 personas</option></select></label><label>Resultado esperado<textarea name="desired_result" rows="3" required placeholder="&iquest;Qu&eacute; deber&iacute;a mejorar con la primera fase?"></textarea></label><label>Canal preferido<select name="preferred_channel" required><option value="">Selecciona una opci&oacute;n</option><option>Correo</option><option>WhatsApp</option><option>Videollamada</option></select></label><label>Contexto adicional <small>Opcional</small><textarea name="message" rows="4"></textarea></label><label class="consent-field"><input type="checkbox" name="consent" value="accepted" required /><span>Acepto que YC Systems use esta informaci&oacute;n para responder mi solicitud, conforme a la <a href="${relativeHref("/privacy/", prefix)}">Pol&iacute;tica de privacidad</a>.</span></label><div class="form-actions"><button class="button secondary" type="button" data-brief-back>Volver</button><button class="button primary" type="submit" data-brief-submit>Enviar diagn&oacute;stico</button></div></div><p class="form-status" data-brief-status aria-live="polite"></p><div class="form-success" data-brief-success hidden><strong>Solicitud enviada</strong><p>Recibimos tu informaci&oacute;n. Te responderemos por el canal indicado.</p></div></form><div class="contact-copy"><h2>Qu&eacute; puedes esperar</h2><ol><li><span>01</span>Entendemos el problema operativo</li><li><span>02</span>Ordenamos prioridad y primera fase</li><li><span>03</span>Respondemos con el siguiente paso recomendado</li></ol><div class="contact-options"><a href="mailto:${content.contact.email}">${content.contact.email}</a><a href="${content.contact.whatsappUrl}" target="_blank" rel="noopener">WhatsApp ${content.contact.whatsappLabel}</a></div></div></div></section>`,
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
  body: () => `<section class="page-hero compact-hero"><div class="container narrow"><p class="kicker">Privacidad</p><h1>Política de privacidad</h1><p class="lead">Esta política explica qué información puede recibir YC Systems LLC a través de su sitio web y cómo se utiliza.</p></div></section><section class="section"><article class="container prose"><h2>Información que podemos recibir</h2><p>Podemos recibir nombre, empresa, correo, teléfono opcional, industria, tamaño del equipo, proceso actual, necesidad, canal preferido y el contexto que decidas compartir al solicitar un diagnóstico.</p><h2>Cómo utilizamos la información</h2><p>La utilizamos para responder solicitudes, evaluar necesidades, preparar una ruta inicial, mantener comunicaciones comerciales y cumplir obligaciones aplicables.</p><h2>Procesamiento del formulario</h2><p>El formulario de diagnóstico utiliza FormSubmit como proveedor técnico para transmitir la información a YC Systems. Los datos se envían con el propósito de gestionar tu solicitud comercial. No incluyas contraseñas, datos financieros ni otra información sensible. Si prefieres no utilizar el formulario, puedes escribir directamente a ${content.contact.email}.</p><h2>Conservación y derechos</h2><p>Conservamos la información durante el tiempo necesario para responder, prestar el servicio o cumplir obligaciones. Puedes solicitar acceso, corrección o eliminación escribiendo a legal@ycsystems.io.</p><h2>Contacto</h2><p>YC Systems LLC · ${content.contact.email} · Operación digital internacional.</p><p>Última actualización: 12 de julio de 2026.</p></article></section>`,
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
const notFound = `<!doctype html><html lang="es">${pageHead({ route: "/404.html", prefix: notFoundPrefix, title: "Página no encontrada | YC Systems", description: "La página solicitada no existe o ya no está disponible.", noindex: true })}<body class="not-found-page"><a class="skip-link" href="#main-content">Saltar al contenido</a>${renderHeader("/404.html", notFoundPrefix)}<main id="main-content"><section class="page-hero"><div class="container narrow"><p class="kicker">Error 404</p><h1>Esta página no está disponible</h1><p class="lead">Puedes volver al inicio, explorar productos o solicitar un diagnóstico.</p><div class="actions"><a class="button primary" href="./">Volver al inicio</a><a class="button secondary" href="./products/">Ver productos</a></div></div></section></main>${renderFooter(notFoundPrefix)}<script src="./script.js?v=yc-v2-release-20260712"></script></body></html>\n`;
await writeFile(path.join(siteRoot, "404.html"), notFound, "utf8");

console.log(`Built ${canonicalPages.size} YC Systems V2 pages.`);
