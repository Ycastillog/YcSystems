import { mkdir, readFile, writeFile } from "node:fs/promises";
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
        <img src="${prefix}assets/brand/yc-systems-logo-header-dark.png" alt="YC Systems" width="764" height="240" />
      </a>
      <button class="menu-button" type="button" data-nav-toggle aria-label="Abrir menú" aria-expanded="false" aria-controls="site-navigation"><span></span><span></span></button>
      <div class="header-panel" id="site-navigation" data-nav-panel>
        <nav class="main-nav" aria-label="Navegación principal">${nav}</nav>
        <div class="header-actions">
          <a class="nav-cta" href="${relativeHref(content.navigation.primaryAction.path, prefix)}">${content.navigation.primaryAction.label}</a>
          <button class="lang-chip" type="button" aria-label="Versión en inglés en preparación" disabled>EN</button>
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
        <p>Operación digital con alcance internacional.</p>
      </div>
      <div><strong>Empresa</strong><a href="${relativeHref("/company/", prefix)}">Información corporativa</a><a href="${relativeHref("/process/", prefix)}">Método de trabajo</a><a href="${relativeHref("/trust-center/", prefix)}">Centro de confianza</a></div>
      <div><strong>Explorar</strong><a href="${relativeHref("/solutions/", prefix)}">Soluciones</a><a href="${relativeHref("/products/", prefix)}">Productos</a><a href="${relativeHref("/case-studies/", prefix)}">Casos</a></div>
      <div><strong>Contacto</strong><a href="mailto:${content.contact.email}">${content.contact.email}</a><a href="${content.contact.whatsappUrl}" target="_blank" rel="noopener">WhatsApp ${content.contact.whatsappLabel}</a><a href="${content.contact.instagramUrl}" target="_blank" rel="noopener">Instagram</a></div>
    </div>
    <div class="container footer-bottom"><span>&copy; 2026 ${content.brand.legalName}. All rights reserved.</span><span><a href="${relativeHref("/documents/", prefix)}">Documentos</a><a href="${relativeHref("/privacy/", prefix)}">Privacidad</a><a href="${relativeHref("/terms/", prefix)}">Términos</a></span></div>
  </footer>`;
}

function pageHead({ route, prefix, title, description, noindex = false }) {
  const canonical = `https://ycsystems.io${route}`;
  return `<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="${description}" />
${noindex ? '    <meta name="robots" content="noindex, follow" />\n' : ""}    <meta name="theme-color" content="#020817" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="https://ycsystems.io/assets/previews/yc-systems-og.png" />
    <link rel="canonical" href="${canonical}" />
    <title>${title}</title>
    <link rel="icon" type="image/png" sizes="32x32" href="${prefix}assets/favicon-32.png" />
    <link rel="apple-touch-icon" href="${prefix}assets/apple-touch-icon.png" />
    <link rel="manifest" href="${prefix}site.webmanifest" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="${prefix}styles.css?v=yc-v2-foundation-20260712" />
  </head>`;
}

function renderPage({ route, title, description, body, noindex = false, bodyClass = "" }) {
  const prefix = relativePrefix(route);
  const html = `<!doctype html>
<html lang="es">
${pageHead({ route, prefix, title, description, noindex })}
<body class="${bodyClass}" data-route="${route}">
  <a class="skip-link" href="#main-content">Saltar al contenido</a>
  ${renderHeader(route, prefix)}
  <main id="main-content">${body(prefix)}</main>
  ${renderFooter(prefix)}
  <script src="${prefix}script.js?v=yc-v2-foundation-20260712"></script>
</body>
</html>
`;
  canonicalPages.set(route, html);
}

function actions(prefix, secondary = "/products/") {
  return `<div class="actions"><a class="button primary" href="${relativeHref("/contact/", prefix)}">Solicitar diagnóstico</a><a class="button secondary" href="${relativeHref(secondary, prefix)}">${secondary === "/case-studies/" ? "Ver casos" : "Ver productos"}</a></div>`;
}

function sectionHead(kicker, title, text = "") {
  return `<div class="section-head"><p class="kicker">${kicker}</p><h2>${title}</h2>${text ? `<p>${text}</p>` : ""}</div>`;
}

function productCards(prefix, limit = content.products.length) {
  return content.products.slice(0, limit).map((product) => `<a class="product-card" href="${relativeHref(product.path, prefix)}">
    <img src="${relativeHref(product.image, prefix)}" alt="Vista de ${product.name}" width="1672" height="941" loading="lazy" />
    <div class="card-meta"><span class="status-badge status-${product.status}">${product.statusLabel}</span><small>${product.market}</small></div>
    <h3>${product.name}</h3><strong>${product.title}</strong><p>${product.summary}</p><span class="card-link">Conocer ${product.name}</span>
  </a>`).join("");
}

function caseCards(prefix, limit = content.cases.length) {
  return content.cases.slice(0, limit).map((item) => `<a class="case-card" href="${item.url}" target="_blank" rel="noopener">
    <img src="${relativeHref(item.image, prefix)}" alt="Sitio publicado de ${item.name}" width="1440" height="1000" loading="lazy" />
    <span>${item.category}</span><h3>${item.name}</h3><p>${item.summary}</p><small>Ver sitio publicado</small>
  </a>`).join("");
}

function finalCta(prefix, title = "Convierte tu operación en un sistema claro") {
  return `<section class="section cta-section"><div class="container cta-panel"><div><p class="kicker">Siguiente paso</p><h2>${title}</h2><p>Cuéntanos qué necesitas controlar, medir o automatizar y recibe una ruta inicial con alcance y prioridades.</p></div><a class="button primary" href="${relativeHref("/contact/", prefix)}">Solicitar diagnóstico</a></div></section>`;
}

renderPage({
  route: "/",
  title: "YC Systems LLC | Software operativo para negocios reales",
  description: "YC Systems construye productos SaaS, sistemas internos, CRM, dashboards y automatización para empresas que necesitan control y crecimiento.",
  body: (prefix) => `<section class="hero"><div class="container hero-grid"><div class="hero-copy"><p class="kicker">YC Systems LLC · Software operativo</p><h1>Software operativo para empresas que necesitan control y crecimiento</h1><p class="lead">Diseñamos productos SaaS, sistemas internos, CRM, dashboards y automatizaciones para convertir operaciones dispersas en flujos claros y medibles.</p>${actions(prefix, "/case-studies/")}<p class="trust-line">Producto propio · implementación por fases · soporte continuo</p></div><div class="hero-panel"><img src="${prefix}assets/brand/nexus/nexus-hero.webp" alt="Nexus, asistente visual de YC Systems" width="720" height="720" fetchpriority="high" /><div class="system-list"><span><b>01</b> CleanLoop</span><span><b>02</b> SOC</span><span><b>03</b> BrokerControl</span><span><b>04</b> CreditPilot</span></div></div></div></section>
  <section class="authority-band"><div class="container authority-list"><span>Empresa de software</span><span>Sistemas para operaciones reales</span><span>Entrega por fases</span><span>Soporte para evolución</span></div></section>
  <section class="section"><div class="container">${sectionHead("Elige tu ruta", "Empieza por el resultado que tu negocio necesita", "No necesitas llegar con una especificación técnica. Elige el punto de partida más cercano y construimos la ruta contigo.")}<div class="choice-grid"><a class="choice" href="${relativeHref("/products/", prefix)}"><span>01</span><strong>Quiero usar un producto YC Systems</strong><p>Explora plataformas enfocadas en operaciones específicas y conoce su disponibilidad.</p></a><a class="choice" href="${relativeHref("/solutions/", prefix)}"><span>02</span><strong>Necesito software para mi operación</strong><p>CRM, portal, dashboard, automatización o sistema interno diseñado por fases.</p></a><a class="choice" href="${relativeHref("/contact/", prefix)}"><span>03</span><strong>Necesito definir el primer paso</strong><p>Solicita un diagnóstico para ordenar problema, alcance, prioridad y siguiente decisión.</p></a></div></div></section>
  <section class="section section-alt"><div class="container">${sectionHead("Productos", "Software propio construido alrededor de operaciones reales", "Cada producto comunica con precisión su alcance y estado actual.")}<div class="product-grid">${productCards(prefix)}</div><div class="section-action"><a class="button secondary" href="${relativeHref("/products/", prefix)}">Ver productos</a></div></div></section>
  <section class="section"><div class="container split"><div>${sectionHead("Nexus", "Una capa de inteligencia que ayuda a observar, decidir y mejorar", "Nexus representa cómo YC Systems conecta contexto, flujo de trabajo y decisiones dentro de sus productos.")}<a class="text-link" href="${relativeHref("/operating-systems/", prefix)}">Explorar la arquitectura operativa</a></div><img class="feature-image" src="${prefix}assets/brand/nexus/nexus-process.webp" alt="Nexus explica el proceso operativo de YC Systems" width="1254" height="1254" loading="lazy" /></div></section>
  <section class="section section-alt"><div class="container">${sectionHead("Casos", "Ejecución visible en negocios reales", "Una muestra de experiencias publicadas para comercio, servicios, bienes raíces y presencia corporativa.")}<div class="case-grid">${caseCards(prefix, 3)}</div><div class="section-action"><a class="button secondary" href="${relativeHref("/case-studies/", prefix)}">Ver casos</a></div></div></section>${finalCta(prefix)}`,
});

renderPage({
  route: "/products/",
  title: "Productos | YC Systems",
  description: "Conoce los productos de software operativo de YC Systems y su estado de disponibilidad.",
  body: (prefix) => `<section class="page-hero"><div class="container narrow"><p class="kicker">Productos YC Systems</p><h1>Software propio para operaciones que necesitan control</h1><p class="lead">Construimos plataformas enfocadas en problemas concretos y comunicamos con claridad su estado, alcance y forma de acceso.</p></div></section><section class="section"><div class="container"><div class="product-grid product-grid-full">${productCards(prefix)}</div></div></section><section class="section section-alt"><div class="container split"><div>${sectionHead("Disponibilidad", "Un estado claro para cada producto", "Acceso temprano, piloto seleccionado, prototipo o desarrollo: cada etiqueta describe lo que una empresa puede esperar hoy.")}</div><div class="status-list"><span><b>Acceso temprano</b> Disponible para operadores seleccionados</span><span><b>Piloto seleccionado</b> Implementación guiada con alcance definido</span><span><b>Prototipo</b> Validación funcional y comercial</span><span><b>En desarrollo</b> Línea futura sin promesa de disponibilidad inmediata</span></div></div></section>${finalCta(prefix, "Encuentra el producto o la ruta correcta para tu operación")}`,
});

const solutions = [
  ["Sistemas internos", "Centraliza usuarios, roles, tareas, estados, documentos y decisiones del día a día."],
  ["CRM operativo", "Convierte prospectos, seguimiento, tareas y cierres en un flujo comercial visible."],
  ["Dashboards ejecutivos", "Presenta indicadores, actividad y prioridades sin depender de reportes dispersos."],
  ["Automatización", "Conecta reglas, alertas e integraciones para reducir trabajo repetitivo y errores."],
  ["Productos SaaS", "Define y construye una primera versión con arquitectura preparada para evolucionar."],
  ["Presencia comercial", "Crea un sitio claro, rápido y orientado a convertir visitas en oportunidades."],
];

renderPage({
  route: "/solutions/",
  title: "Soluciones | YC Systems",
  description: "Software a medida, CRM, dashboards, automatización y productos SaaS para operaciones reales.",
  body: (prefix) => `<section class="page-hero"><div class="container narrow"><p class="kicker">Soluciones</p><h1>Construimos la primera versión del sistema que tu operación necesita</h1><p class="lead">Traducimos un problema de negocio en una solución clara, medible y preparada para crecer por fases.</p>${actions(prefix, "/case-studies/")}</div></section><section class="section"><div class="container"><div class="solution-grid">${solutions.map((item, index) => `<article class="solution-card"><span>${String(index + 1).padStart(2, "0")}</span><h2>${item[0]}</h2><p>${item[1]}</p><a class="text-link" href="${relativeHref("/contact/", prefix)}">Solicitar diagnóstico</a></article>`).join("")}</div></div></section><section class="section section-alt"><div class="container">${sectionHead("Criterio de construcción", "El sistema se diseña alrededor de la operación", "Antes de elegir tecnología, definimos usuarios, decisiones, información, riesgos y resultado esperado.")}<div class="value-grid"><article><strong>Alcance claro</strong><p>Una primera fase que el equipo puede entender, usar y medir.</p></article><article><strong>Arquitectura mantenible</strong><p>Una base preparada para cambios sin rehacer toda la solución.</p></article><article><strong>Entrega responsable</strong><p>Versiones, validación y acompañamiento después del lanzamiento.</p></article></div></div></section>${finalCta(prefix)}`,
});

renderPage({
  route: "/case-studies/",
  title: "Casos | YC Systems",
  description: "Casos publicados de sitios y experiencias digitales construidos por YC Systems.",
  body: (prefix) => `<section class="page-hero"><div class="container narrow"><p class="kicker">Casos</p><h1>Resultados visibles para marcas y operaciones reales</h1><p class="lead">Proyectos publicados que demuestran criterio comercial, diseño responsive y capacidad de ejecución.</p></div></section><section class="section"><div class="container"><div class="case-grid case-grid-full">${caseCards(prefix)}</div></div></section>${finalCta(prefix, "Construyamos el siguiente caso con una base más sólida")}`,
});

renderPage({
  route: "/brands/ghostwear/",
  title: "GhostWear | Caso de YC Systems",
  description: "Caso publicado de comercio electrónico construido por YC Systems para GhostWear.",
  noindex: true,
  body: (prefix) => `<section class="product-hero"><div class="container product-hero-grid"><div><p class="kicker">Caso de cliente</p><h1>GhostWear convirtió su catálogo en una experiencia de venta directa</h1><p class="lead">Una tienda responsive con catálogo, carrito y pedidos conectados a WhatsApp para reducir fricción entre descubrimiento y conversación de compra.</p><div class="actions"><a class="button primary" href="https://ghostwear1.com/" target="_blank" rel="noopener">Ver sitio publicado</a><a class="button secondary" href="${relativeHref("/case-studies/", prefix)}">Ver casos</a></div></div><div class="product-visual"><img src="${prefix}assets/screenshots/ghostwear-live-2026.webp" alt="Sitio publicado de GhostWear" width="1440" height="1000" fetchpriority="high" /></div></div></section><section class="section"><div class="container value-grid"><article><strong>Necesidad</strong><p>Presentar productos y facilitar pedidos desde móvil.</p></article><article><strong>Solución</strong><p>Catálogo, carrito y contacto comercial integrado.</p></article><article><strong>Experiencia</strong><p>Navegación rápida y jerarquía orientada a compra.</p></article><article><strong>Resultado</strong><p>Una tienda activa y lista para recibir oportunidades.</p></article></div></section>${finalCta(prefix, "Convierte tu oferta en una experiencia lista para vender")}`,
});

const processSteps = [
  ["Diagnóstico", "Entendemos operación, usuarios, prioridades, riesgo y resultado esperado."],
  ["Arquitectura", "Definimos módulos, datos, integraciones y límites de la primera versión."],
  ["Diseño", "Convertimos el flujo en una experiencia clara para cada tipo de usuario."],
  ["Construcción", "Desarrollamos, validamos y entregamos por versiones controladas."],
  ["Evolución", "Medimos el uso, corregimos fricción y priorizamos la siguiente fase."],
];

renderPage({
  route: "/process/",
  title: "Método | YC Systems",
  description: "El método de YC Systems para diagnosticar, diseñar, construir y mejorar software operativo.",
  body: (prefix) => `<section class="page-hero"><div class="container narrow"><p class="kicker">Método</p><h1>Primero entendemos la operación y después construimos el sistema</h1><p class="lead">Cada fase reduce incertidumbre y convierte una idea amplia en decisiones, entregables y resultados observables.</p></div></section><section class="section"><div class="container"><ol class="process-list">${processSteps.map((step, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span><div><h2>${step[0]}</h2><p>${step[1]}</p></div></li>`).join("")}</ol></div></section><section class="section section-alt"><div class="container">${sectionHead("Qué recibe el cliente", "Una ruta de trabajo entendible desde el inicio")}<div class="value-grid"><article><strong>Prioridades</strong><p>Qué resolver primero y qué puede esperar.</p></article><article><strong>Alcance</strong><p>Qué incluye la fase y cuáles son sus límites.</p></article><article><strong>Entregables</strong><p>Qué se diseña, construye, valida y publica.</p></article><article><strong>Continuidad</strong><p>Cómo se mantiene y evoluciona después.</p></article></div></div></section>${finalCta(prefix)}`,
});

renderPage({
  route: "/company/",
  title: "Empresa | YC Systems",
  description: "Información corporativa, enfoque y principios de YC Systems LLC.",
  body: (prefix) => `<section class="page-hero"><div class="container narrow"><p class="kicker">Empresa</p><h1>YC Systems LLC construye software para operaciones reales</h1><p class="lead">Somos una empresa de software constituida en New York, con operación digital y capacidad para trabajar con negocios en distintos mercados.</p></div></section><section class="section"><div class="container split"><div>${sectionHead("Dirección", "Producto, ingeniería y negocio dentro de una misma conversación", "No construimos pantallas aisladas. Diseñamos sistemas que conectan información, personas y decisiones.")}<p>YC Systems combina productos propios con implementación de software para clientes. Esa combinación mantiene la empresa cerca de problemas reales y obliga a construir con criterio de largo plazo.</p></div><div class="company-facts"><article><span>Entidad</span><strong>YC Systems LLC</strong><p>New York Domestic Limited Liability Company</p></article><article><span>Operación</span><strong>Digital e internacional</strong><p>Atención remota para empresas y socios</p></article><article><span>Contacto</span><strong>${content.contact.email}</strong><p>Canal corporativo principal</p></article></div></div></section><section class="section section-alt"><div class="container">${sectionHead("Principios", "La forma en que decidimos qué construir")}<div class="value-grid"><article><strong>Claridad</strong><p>El cliente y el equipo deben entender el sistema.</p></article><article><strong>Responsabilidad</strong><p>La confianza se protege con procesos y límites claros.</p></article><article><strong>Evolución</strong><p>Una solución útil hoy debe poder mejorar mañana.</p></article><article><strong>Resultados</strong><p>La tecnología debe cambiar una operación, no decorar una propuesta.</p></article></div></div></section>${finalCta(prefix)}`,
});

renderPage({
  route: "/contact/",
  title: "Solicitar diagnóstico | YC Systems",
  description: "Solicita un diagnóstico inicial para definir el software, producto o sistema que tu empresa necesita.",
  bodyClass: "contact-page",
  body: (prefix) => `<section class="page-hero compact-hero"><div class="container narrow"><p class="kicker">Solicitar diagnóstico</p><h1>Cuéntanos qué necesitas controlar, medir o automatizar</h1><p class="lead">Completa un brief breve y recibe una ruta inicial para definir prioridad, alcance y siguiente decisión.</p></div></section><section class="section contact-section"><div class="container contact-grid"><div class="contact-copy"><h2>Qué puedes esperar</h2><ol><li><span>01</span>Entendemos el problema operativo</li><li><span>02</span>Ordenamos prioridad y primera fase</li><li><span>03</span>Respondemos con el siguiente paso recomendado</li></ol><div class="contact-options"><a href="mailto:${content.contact.email}">${content.contact.email}</a><a href="${content.contact.whatsappUrl}" target="_blank" rel="noopener">WhatsApp ${content.contact.whatsappLabel}</a></div></div><form class="brief-form" action="https://formsubmit.co/${content.contact.email}" method="post" data-brief-form data-step="1"><input type="hidden" name="_subject" value="Nuevo diagnóstico desde ycsystems.io" /><p class="form-step" data-brief-step>Paso 1 de 2</p><div data-step="1"><label>Nombre<input name="name" autocomplete="name" required /></label><label>Correo de trabajo<input type="email" name="email" autocomplete="email" required /></label><label>Empresa<input name="company" autocomplete="organization" required /></label><label>¿Qué necesitas mejorar?<select name="need" required><option value="">Selecciona una opción</option><option>Sistema interno</option><option>CRM o ventas</option><option>Dashboard o reportes</option><option>Automatización</option><option>Producto SaaS</option><option>Sitio comercial</option><option>No estoy seguro</option></select></label><button class="button primary" type="button" data-brief-next>Continuar</button></div><div data-step="2" hidden><label>Prioridad<select name="priority" required><option value="">Selecciona una opción</option><option>Necesito resolverlo ahora</option><option>Durante los próximos 3 meses</option><option>Estoy evaluando opciones</option></select></label><label>Cuéntanos el contexto<textarea name="message" rows="6" required placeholder="Describe el proceso actual, el problema y el resultado que buscas"></textarea></label><label>Referencia de presupuesto<select name="budget" required><option value="">Selecciona una opción</option><option>Necesito orientación</option><option>US$1,000 - US$3,000</option><option>US$3,000 - US$10,000</option><option>US$10,000 o más</option></select></label><div class="form-actions"><button class="button secondary" type="button" data-brief-back>Volver</button><button class="button primary" type="submit">Enviar diagnóstico</button></div></div><p class="form-note">El formulario es procesado por FormSubmit. También puedes escribir directamente a ${content.contact.email}.</p></form></div></section>`,
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
  body: (prefix) => `<section class="page-hero"><div class="container narrow"><p class="kicker">Industrias</p><h1>Software adaptable a operaciones con necesidades concretas</h1><p class="lead">Partimos del flujo de trabajo de cada empresa y reutilizamos principios sólidos de producto, datos y automatización.</p></div></section><section class="section"><div class="container"><div class="solution-grid">${[["Lavanderías", "Pedidos, rutas, entregas y pagos"], ["Bienes raíces", "Prospectos, reservas, propiedades y comisiones"], ["Comercio", "Catálogo, ventas y seguimiento de clientes"], ["Servicios", "Agenda, solicitudes, estados y comunicación"], ["Operaciones comerciales", "Pipeline, actividad, inventario e indicadores"], ["Nuevos productos", "Validación y construcción de una primera versión"]].map((item, i) => `<article class="solution-card"><span>${String(i + 1).padStart(2, "0")}</span><h2>${item[0]}</h2><p>${item[1]}</p></article>`).join("")}</div></div></section>${finalCta(prefix)}`,
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
  body: () => `<section class="page-hero compact-hero"><div class="container narrow"><p class="kicker">Privacidad</p><h1>Política de privacidad</h1><p class="lead">Esta política explica qué información puede recibir YC Systems LLC a través de su sitio web y cómo se utiliza.</p></div></section><section class="section"><article class="container prose"><h2>Información que podemos recibir</h2><p>Podemos recibir nombre, empresa, correo, tipo de necesidad, prioridad, referencia de presupuesto y el contexto que decidas compartir al solicitar un diagnóstico.</p><h2>Cómo utilizamos la información</h2><p>La utilizamos para responder solicitudes, evaluar necesidades, preparar una ruta inicial, mantener comunicaciones comerciales y cumplir obligaciones aplicables.</p><h2>Procesamiento del formulario</h2><p>El formulario de diagnóstico utiliza FormSubmit para transmitir la información a YC Systems. Si prefieres no utilizarlo, puedes escribir directamente a ${content.contact.email}.</p><h2>Preferencias del sitio</h2><p>Cuando se habilite el selector bilingüe, la preferencia podrá guardarse en localStorage bajo la clave yc-lang. No utilizamos esa preferencia para publicidad.</p><h2>Conservación y derechos</h2><p>Conservamos la información durante el tiempo necesario para responder, prestar el servicio o cumplir obligaciones. Puedes solicitar acceso, corrección o eliminación escribiendo a legal@ycsystems.io.</p><h2>Contacto</h2><p>YC Systems LLC · ${content.contact.email} · Operación digital internacional.</p><p>Última actualización: 12 de julio de 2026.</p></article></section>`,
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

const productDetails = {
  cleanloop: {
    kicker: "Acceso temprano",
    title: "CleanLoop organiza la operación completa de una lavandería",
    lead: "Pedidos, clientes, recogidas, entregas, rutas y pagos conectados en una plataforma diseñada para el trabajo diario.",
    features: [["Pedidos", "Estados, servicios, prendas, precios y pagos"], ["Rutas", "Recogidas, entregas y asignación operativa"], ["Clientes", "Direcciones, historial y preferencias"], ["Control", "Vista administrativa de actividad y prioridades"]],
  },
  soc: {
    kicker: "Prototipo",
    title: "SOC convierte actividad comercial en visibilidad ejecutiva",
    lead: "Una línea de producto para equipos que necesitan reunir pipeline, operación, indicadores y seguimiento dentro de una misma lectura.",
    features: [["Pipeline", "Prospectos, etapas, tareas y próximos pasos"], ["Actividad", "Movimientos del equipo y prioridades"], ["Indicadores", "Lectura ejecutiva de resultados"], ["Operación", "Roles, estados y seguimiento centralizado"]],
  },
  brokercontrol: {
    kicker: "Piloto seleccionado",
    title: "BrokerControl ordena la operación comercial inmobiliaria",
    lead: "Un CRM operativo para prospectos, propiedades, reservas, documentos, agenda y comisiones de equipos inmobiliarios.",
    features: [["Prospectos", "Seguimiento claro desde el primer contacto"], ["Propiedades", "Inventario, disponibilidad y relación comercial"], ["Documentos", "Información importante dentro del flujo"], ["Comisiones", "Visibilidad de cierres, asesores y pagos"]],
  },
};

for (const product of content.products.filter((item) => productDetails[item.slug])) {
  const detail = productDetails[product.slug];
  renderPage({
    route: product.path,
    title: `${product.name} | YC Systems`,
    description: product.summary,
    noindex: true,
    bodyClass: "product-page",
    body: (prefix) => `<section class="product-hero"><div class="container product-hero-grid"><div><p class="kicker">${detail.kicker}</p><h1>${detail.title}</h1><p class="lead">${detail.lead}</p><div class="actions"><a class="button primary" href="${relativeHref("/contact/", prefix)}">Solicitar acceso</a><a class="button secondary" href="${relativeHref("/products/", prefix)}">Ver productos</a></div></div><div class="product-visual"><img src="${relativeHref(product.image, prefix)}" alt="Vista de ${product.name}" width="1672" height="941" fetchpriority="high" /><span class="status-badge status-${product.status}">${product.statusLabel}</span></div></div></section><section class="section"><div class="container">${sectionHead("Capacidades", `Una vista operativa diseñada para ${product.market.toLowerCase()}`)}<div class="value-grid">${detail.features.map((feature) => `<article><strong>${feature[0]}</strong><p>${feature[1]}</p></article>`).join("")}</div></div></section><section class="section section-alt"><div class="container split"><div>${sectionHead("Modalidad", "Implementación guiada con alcance definido", "Revisamos ajuste, prioridades y condiciones antes de confirmar acceso o piloto.")}</div><a class="button primary" href="${relativeHref("/contact/", prefix)}">Solicitar acceso</a></div></section>`,
  });
}

const supportPages = [
  ["/technology/", "Tecnología", "Tecnología aplicada a operaciones", "Arquitectura, automatización y asistencia inteligente con un propósito operativo."],
  ["/partners/", "Socios", "Construyamos mejores soluciones juntos", "Colaboramos con especialistas y empresas que complementan producto, implementación o distribución."],
  ["/careers/", "Carreras", "Ayuda a construir software para operaciones reales", "Publicaremos oportunidades cuando exista una posición activa y un proceso definido."],
  ["/press/", "Prensa", "Información pública de YC Systems", "Consultas de medios, marca y comunicación corporativa."],
  ["/start/", "Empezar", "Elige el punto de partida correcto", "Producto, solución o diagnóstico: te ayudamos a convertir una necesidad amplia en una primera decisión."],
];

for (const [route, kicker, title, lead] of supportPages) {
  renderPage({
    route,
    title: `${kicker} | YC Systems`,
    description: lead,
    noindex: true,
    body: (prefix) => `<section class="page-hero"><div class="container narrow"><p class="kicker">${kicker}</p><h1>${title}</h1><p class="lead">${lead}</p>${actions(prefix)}</div></section>`,
  });
}

const intentPages = [
  ["/custom-software/", "Software a medida", "Sistemas diseñados alrededor de una operación real"],
  ["/crm-development/", "CRM operativo", "Seguimiento comercial visible y accionable"],
  ["/dashboard-development/", "Dashboards", "Indicadores para decidir con más claridad"],
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
  return `<!doctype html><html lang="es"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><meta name="robots" content="noindex, follow" /><meta http-equiv="refresh" content="0; url=${relativeHref(target, prefix)}" /><link rel="canonical" href="https://ycsystems.io${target}" /><title>Redirigiendo | YC Systems</title></head><body><p>Esta página se movió. <a href="${relativeHref(target, prefix)}">Continuar</a></p></body></html>\n`;
}

for (const route of routesMap.routes) {
  const output = route.path === "/"
    ? path.join(siteRoot, "index.html")
    : path.join(siteRoot, route.path.replace(/^\//, ""), "index.html");
  await mkdir(path.dirname(output), { recursive: true });

  if (route.status === "legacy-redirect" && route.target) {
    await writeFile(output, redirectDocument(route.path, route.target), "utf8");
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

console.log(`Built ${canonicalPages.size} YC Systems V2 pages.`);
