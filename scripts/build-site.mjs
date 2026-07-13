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
        <p>Operación digital con alcance internacional.</p>
      </div>
      <div><strong>Empresa</strong><a href="${relativeHref("/company/", prefix)}">Empresa</a><a href="${relativeHref("/process/", prefix)}">Método</a><a href="${relativeHref("/case-studies/", prefix)}">Casos</a></div>
      <div><strong>Productos</strong><a href="${relativeHref("/products/cleanloop/", prefix)}">CleanLoop</a><a href="${relativeHref("/products/soc/", prefix)}">SOC</a><a href="${relativeHref("/products/brokercontrol/", prefix)}">BrokerControl</a></div>
      <div><strong>Información</strong><a href="${relativeHref("/trust-center/", prefix)}">Centro de confianza</a><a href="${relativeHref("/privacy/", prefix)}">Privacidad</a><a href="${relativeHref("/terms/", prefix)}">Términos</a></div>
      <div><strong>Contacto</strong><a href="mailto:${content.contact.email}">${content.contact.email}</a><a href="${content.contact.whatsappUrl}" target="_blank" rel="noopener">WhatsApp</a><a href="${content.contact.instagramUrl}" target="_blank" rel="noopener">Instagram</a></div>
    </div>
    <div class="container footer-bottom"><span>&copy; 2026 ${content.brand.legalName}. Todos los derechos reservados.</span><span><a href="${relativeHref("/documents/", prefix)}">Documentos</a><a href="${relativeHref("/privacy/", prefix)}">Privacidad</a><a href="${relativeHref("/terms/", prefix)}">Términos</a></span></div>
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
  return `<div class="actions"><a class="button primary" href="${relativeHref("/contact/", prefix)}">Solicitar diagnóstico</a><a class="button secondary" href="${relativeHref(secondary, prefix)}">${secondary === "/case-studies/" ? "Ver casos" : "Ver productos"}</a></div>`;
}

function sectionHead(kicker, title, text = "") {
  return `<div class="section-head"><p class="kicker">${kicker}</p><h2>${title}</h2>${text ? `<p>${text}</p>` : ""}</div>`;
}

const productImageDimensions = {
  "cleanloop": { width: 1672, height: 941 },
  "soc": { width: 1600, height: 900 },
  "brokercontrol": { width: 1672, height: 941 },
  "creditpilot": { width: 1672, height: 941 },
};

function productImage(product, prefix, className = "", loading = "lazy") {
  const dimensions = productImageDimensions[product.slug] ?? { width: 1672, height: 941 };
  const large = relativeHref(product.image, prefix);
  const small = large.replace(/\.webp$/, "-840.webp");
  const attrs = [
    `src="${large}"`,
    `srcset="${small} 840w, ${large} ${dimensions.width}w"`,
    `sizes="(max-width: 720px) calc(100vw - 36px), (max-width: 1100px) 48vw, 560px"`,
    `alt="Vista de ${product.name}"`,
    `width="${dimensions.width}"`,
    `height="${dimensions.height}"`,
    loading === "eager" ? `fetchpriority="high"` : `loading="${loading}"`,
  ];
  return `<img${className ? ` class="${className}"` : ""} ${attrs.join(" ")} />`;
}

function productBySlug(slug) {
  return content.products.find((product) => product.slug === slug);
}

function productCards(prefix, limit = content.products.length) {
  return content.products.slice(0, limit).map((product) => `<article class="product-card">
    <div class="product-card-head"><div><small>${product.market}</small><h3>${product.name}</h3></div><span class="status-badge status-${product.status}">${product.statusLabel}</span></div>
    <span class="nexus-chip">Powered by Nexus</span><strong>${product.title}</strong><p>${product.summary}</p>
    <div class="card-media">${productImage(product, prefix)}</div>
    ${product.path !== "/products/" ? `<a class="card-link" href="${relativeHref(product.path, prefix)}">Ver producto</a>` : `<span class="availability-note">Disponibilidad futura</span>`}
  </article>`).join("");
}

function relatedProductCards(prefix, slugs) {
  return slugs.map((slug) => productBySlug(slug)).filter(Boolean).map((product) => `<article class="related-product-card">
    <div class="related-product-copy"><div class="product-card-head"><div><small>${product.market}</small><h3>${product.name}</h3></div><span class="status-badge status-${product.status}">${product.statusLabel}</span></div><span class="nexus-chip">Powered by Nexus</span><strong>${product.title}</strong><p>${product.summary}</p><a class="card-link" href="${relativeHref(product.path, prefix)}">Ver producto</a></div>
    <figure class="related-product-media">${productImage(product, prefix)}</figure>
  </article>`).join("");
}

function homeProductHighlight(prefix) {
  const product = productBySlug("cleanloop");
  return `<div class="home-product-highlight"><div class="home-product-copy"><p class="kicker">Producto destacado</p><div class="product-card-head"><div><small>${product.market}</small><h2>${product.name} convierte una operaci&oacute;n diaria en un flujo visible</h2></div><span class="status-badge status-${product.status}">${product.statusLabel}</span></div><p>${product.summary}</p><div class="actions"><a class="button primary" href="${relativeHref(product.path, prefix)}">Ver CleanLoop</a><a class="button secondary" href="${relativeHref("/products/", prefix)}">Ver cat&aacute;logo</a></div></div><figure class="home-product-media">${productImage(product, prefix)}</figure></div>`;
}


function caseCards(prefix, limit = content.cases.length, offset = 0) {
  return content.cases.slice(offset, offset + limit).map((item) => `<article class="case-card">
    <div class="card-media"><img src="${relativeHref(item.image, prefix)}" alt="Sitio publicado de ${item.name}" width="1440" height="1000" loading="lazy" /></div>
    <div class="case-card-copy"><span>${item.category}</span><h3>${item.name}</h3><p>${item.summary}</p><div class="case-actions">${item.internalPath ? `<a class="button secondary" href="${relativeHref(item.internalPath, prefix)}">Ver caso completo</a>` : ""}<a class="text-link" href="${item.url}" target="_blank" rel="noopener">Visitar sitio</a></div></div>
  </article>`).join("");
}

function finalCta(prefix, title = "Define la primera fase de tu sistema") {
  return `<section class="section cta-section"><div class="container cta-panel"><div><p class="kicker">Siguiente paso</p><h2>${title}</h2><p>Cuéntanos qué proceso necesitas controlar, medir o automatizar y recibe una recomendación inicial de alcance y prioridades.</p></div><a class="button primary" href="${relativeHref("/contact/", prefix)}">Solicitar diagnóstico</a></div></section>`;
}

renderPage({
  route: "/",
  title: "YC Systems LLC | Software operativo para negocios reales",
  description: "YC Systems construye productos SaaS, sistemas internos, CRM, paneles y automatización para empresas que necesitan control y crecimiento.",
  bodyClass: "home-page",
  body: (prefix) => `<section class="hero"><div class="container hero-grid"><div class="hero-copy"><p class="kicker">YC Systems LLC · Software operativo</p><h1>Software operativo para empresas que quieren crecer con control</h1><p class="lead">Centralizamos procesos, clientes y datos en sistemas que tu equipo puede operar, medir y mejorar.</p>${actions(prefix)}<p class="trust-line">Producto propio · implementación por fases · soporte continuo</p></div><div class="identity-showcase" aria-label="Identidad y propuesta de YC Systems"><div class="identity-message"><p class="identity-label">YC Systems</p><h2>Convertimos operaciones reales en sistemas claros</h2><p>Diseñamos software para que equipos y empresas puedan vender, operar y crecer con una base confiable.</p><ul><li>Productos propios</li><li>Sistemas para empresas</li><li>Automatización y evolución</li></ul></div><figure class="identity-nexus"><img src="${prefix}assets/brand/nexus/nexus-hero.webp" alt="Nexus, identidad visual de YC Systems" width="720" height="720" fetchpriority="high" /><figcaption><strong>Nexus</strong><span>Asistente visual de YC Systems</span></figcaption></figure></div></div></section>
  <section class="authority-band" aria-label="Señales de confianza"><div class="container authority-list"><span><small>Entidad</small><strong>YC Systems LLC</strong></span><span><small>Alcance</small><strong>Operación internacional</strong></span><span><small>Proceso</small><strong>Alcance y entrega por fases</strong></span><span><small>Continuidad</small><strong>Soporte y evolución</strong></span></div></section>
  <section class="section route-section"><div class="container">${sectionHead("Elige tu ruta", "Dos formas claras de empezar", "Selecciona un producto existente o define una primera fase para tu propia operación.")}<div class="choice-grid"><a class="choice" href="${relativeHref("/products/", prefix)}"><span>01</span><strong>Explorar productos propios</strong><p>Conoce plataformas desarrolladas para operaciones específicas y revisa su disponibilidad.</p><small>Ver productos</small></a><a class="choice" href="${relativeHref("/contact/", prefix)}"><span>02</span><strong>Construir un sistema para mi empresa</strong><p>Ordena un proceso comercial, administrativo u operativo mediante una primera fase clara.</p><small>Solicitar diagnóstico</small></a></div><p class="route-note">¿Todavía no sabes qué necesitas? El diagnóstico inicial ayuda a definir el primer paso.</p></div></section>
  <section class="section section-alt"><div class="container">${homeProductHighlight(prefix)}</div></section>
  <section class="section nexus-section"><div class="container nexus-panel"><figure class="nexus-portrait"><img src="${prefix}assets/brand/nexus/nexus-avatar.webp" alt="Nexus, capa visual de inteligencia operativa de YC Systems" width="720" height="720" loading="lazy" /></figure><div class="nexus-copy"><p class="kicker">Nexus Operational Intelligence</p><h2>Una forma clara de observar, ordenar y decidir</h2><p>Nexus no se presenta como chatbot. Es la capa visual y narrativa que une cada producto de YC Systems alrededor de una misma filosof&iacute;a: claridad antes que complejidad.</p><div class="nexus-steps"><span><strong>Observe</strong><small>Procesos y se&ntilde;ales</small></span><span><strong>Organize</strong><small>Datos y prioridades</small></span><span><strong>Recommend</strong><small>Siguiente decisi&oacute;n</small></span><span><strong>Execute</strong><small>Flujo operable</small></span></div><a class="text-link" href="${relativeHref("/process/", prefix)}">Ver c&oacute;mo trabajamos</a></div></div></section>
  <section class="section section-alt"><div class="container">${sectionHead("Casos", "Proyectos publicados para negocios reales", "Una selección de experiencias digitales entregadas para comercio, bienes raíces y presencia corporativa.")}<div class="case-grid case-feature-list">${caseCards(prefix, 2)}</div><div class="section-action"><a class="text-link" href="${relativeHref("/case-studies/", prefix)}">Casos</a></div></div></section>${finalCta(prefix)}`,
});

renderPage({
  route: "/products/",
  title: "Productos | YC Systems",
  description: "Conoce los productos de software operativo de YC Systems y su estado de disponibilidad.",
  body: (prefix) => `<section class="page-hero products-hero"><div class="container interior-hero-grid"><div><p class="kicker">Productos YC Systems</p><h1>Software propio para operaciones que necesitan control</h1><p class="lead">Plataformas enfocadas en problemas concretos, con una disponibilidad pública y verificable.</p></div><div class="hero-status-guide" aria-label="Estados de producto"><span><b>Acceso temprano</b> Operadores seleccionados</span><span><b>Piloto seleccionado</b> Implementación guiada</span><span><b>Prototipo</b> Validación funcional</span><span><b>En desarrollo</b> Línea futura</span></div></div></section><section class="section"><div class="container"><div class="product-grid product-grid-full">${productCards(prefix)}</div></div></section>${finalCta(prefix)}`,
});

const solutions = [
  {
    title: "Sistemas internos",
    problem: "La operaci&oacute;n depende de hojas, mensajes y decisiones dispersas.",
    result: "Centralizamos usuarios, roles, tareas, estados, documentos y seguimiento dentro de un flujo &uacute;nico.",
  },
  {
    title: "CRM operativo",
    problem: "El equipo vende, pero no tiene una lectura clara de prospectos, tareas y cierres.",
    result: "Convertimos el seguimiento comercial en una operaci&oacute;n visible, medible y accionable.",
  },
  {
    title: "Paneles ejecutivos",
    problem: "Los indicadores llegan tarde o viven en reportes que nadie revisa a tiempo.",
    result: "Dise&ntilde;amos paneles visuales que muestran actividad, prioridades y resultados para decidir m&aacute;s r&aacute;pido.",
  },
  {
    title: "Automatizaci&oacute;n",
    problem: "El equipo repite tareas manuales que consumen tiempo y aumentan errores.",
    result: "Conectamos reglas, alertas e integraciones para reducir fricci&oacute;n operativa.",
  },
  {
    title: "Portales y plataformas",
    problem: "Clientes, socios o equipos necesitan acceder a informaci&oacute;n sin depender de conversaciones sueltas.",
    result: "Creamos portales con roles, datos y acciones claras para cada tipo de usuario.",
  },
  {
    title: "Productos SaaS",
    problem: "Existe una oportunidad de producto, pero falta convertirla en una primera versi&oacute;n usable.",
    result: "Definimos alcance, arquitectura y una primera fase preparada para evolucionar.",
  },
];

renderPage({
  route: "/solutions/",
  title: "Soluciones | YC Systems",
  description: "Software a medida, CRM, paneles ejecutivos, automatizaci&oacute;n y productos SaaS para operaciones reales.",
  body: (prefix) => `<section class="page-hero solutions-hero"><div class="container interior-hero-grid"><div><p class="kicker">Soluciones</p><h1>Construimos la primera versi&oacute;n del sistema que tu operaci&oacute;n necesita</h1><p class="lead">Traducimos un problema de negocio en una soluci&oacute;n clara, medible y preparada para crecer por fases.</p><div class="actions"><a class="button primary" href="${relativeHref("/contact/", prefix)}">Solicitar diagn&oacute;stico</a><a class="text-link" href="${relativeHref("/case-studies/", prefix)}">Ver casos</a></div></div><div class="capability-map"><span>Usuarios y roles</span><span>Datos operativos</span><span>Flujos y estados</span><span>Automatizaci&oacute;n</span><span>Indicadores</span><span>Soporte y evoluci&oacute;n</span><strong>Una arquitectura compartida</strong></div></div></section><section class="section"><div class="container">${sectionHead("Problemas que resolvemos", "Soluciones organizadas por intenci&oacute;n de compra", "Cada bloque parte de una fricci&oacute;n operativa concreta y termina en una primera fase construible.")}<div class="solution-grid">${solutions.map((item, index) => `<article class="solution-card"><span>${String(index + 1).padStart(2, "0")}</span><h2>${item.title}</h2><p class="solution-problem"><strong>Problema</strong>${item.problem}</p><p><strong>Resultado</strong>${item.result}</p></article>`).join("")}</div><div class="conversion-panel"><p><strong>&iquest;Tu necesidad cruza varias &aacute;reas?</strong><span>Nexus ayuda a traducir la operaci&oacute;n en una primera fase clara antes de elegir producto o tecnolog&iacute;a.</span></p><a class="button primary" href="${relativeHref("/contact/", prefix)}">Solicitar diagn&oacute;stico</a></div></div></section><section class="section section-alt"><div class="container">${sectionHead("Productos relacionados", "Productos propios que aceleran operaciones espec&iacute;ficas", "CleanLoop y SOC muestran c&oacute;mo YC Systems convierte problemas reales en software operable. El cat&aacute;logo completo vive en Productos.")}<div class="related-product-grid">${relatedProductCards(prefix, ["cleanloop", "soc"])}</div><div class="section-action"><a class="button secondary" href="${relativeHref("/products/", prefix)}">Ver cat&aacute;logo completo</a></div></div></section><section class="section"><div class="container">${sectionHead("Criterio de construcci&oacute;n", "Nexus ordena la conversaci&oacute;n antes de construir", "Antes de elegir tecnolog&iacute;a, definimos usuarios, decisiones, informaci&oacute;n, riesgos y resultado esperado.")}<div class="value-grid"><article><strong>Alcance claro</strong><p>Una primera fase que el equipo puede entender, usar y medir.</p></article><article><strong>Arquitectura mantenible</strong><p>Una base preparada para cambios sin rehacer toda la soluci&oacute;n.</p></article><article><strong>Entrega responsable</strong><p>Versiones, validaci&oacute;n y acompa&ntilde;amiento despu&eacute;s del lanzamiento.</p></article></div></div></section>${finalCta(prefix)}`,
});

renderPage({
  route: "/case-studies/",
  title: "Casos | YC Systems",
  description: "Casos publicados de sitios y experiencias digitales construidos por YC Systems.",
  body: (prefix) => `<section class="page-hero cases-hero"><div class="container interior-hero-grid"><div><p class="kicker">Casos</p><h1>Proyectos publicados para negocios reales</h1><p class="lead">Una selección de experiencias digitales entregadas para comercio, bienes raíces y presencia corporativa.</p><a class="text-link" href="${relativeHref("/brands/ghostwear/", prefix)}">Ver caso GhostWear</a></div><figure class="featured-case-preview"><img src="${prefix}assets/screenshots/ghostwear-live-2026.webp" alt="Experiencia publicada de GhostWear" width="1440" height="1000" fetchpriority="high" /><figcaption><span>Caso destacado</span><strong>GhostWear</strong></figcaption></figure></div></section><section class="section"><div class="container">${sectionHead("Caso de estudio", "Una presencia comercial convertida en canal de confianza")}<div class="case-grid case-feature-list">${caseCards(prefix, 1, 1)}</div></div></section><section class="section section-alt"><div class="container">${sectionHead("Trabajos publicados", "Más experiencias activas construidas por YC Systems", "Una muestra del trabajo entregado para empresas y marcas reales.")}<div class="case-grid case-archive-grid">${caseCards(prefix, 3, 2)}</div></div></section>${finalCta(prefix)}`,
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
  body: (prefix) => `<section class="page-hero method-hero"><div class="container interior-hero-grid"><div><p class="kicker">Método</p><h1>Primero entendemos la operación y después construimos el sistema</h1><p class="lead">Cada fase reduce incertidumbre y convierte una idea amplia en decisiones, entregables y resultados observables.</p></div><ol class="process-preview">${processSteps.map((step, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span>${step[0]}</li>`).join("")}</ol></div></section><section class="section"><div class="container"><ol class="process-list">${processSteps.map((step, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span><div><h2>${step[0]}</h2><p>${step[1]}</p></div></li>`).join("")}</ol></div></section><section class="section section-alt"><div class="container">${sectionHead("Qué recibe el cliente", "Una ruta de trabajo entendible desde el inicio")}<div class="value-grid"><article><strong>Prioridades</strong><p>Qué resolver primero y qué puede esperar.</p></article><article><strong>Alcance</strong><p>Qué incluye la fase y cuáles son sus límites.</p></article><article><strong>Entregables</strong><p>Qué se diseña, construye, valida y publica.</p></article><article><strong>Continuidad</strong><p>Cómo se mantiene y evoluciona después.</p></article></div></div></section>${finalCta(prefix)}`,
});

renderPage({
  route: "/company/",
  title: "Empresa | YC Systems",
  description: "Información corporativa, enfoque y principios de YC Systems LLC.",
  body: (prefix) => `<section class="page-hero company-hero"><div class="container interior-hero-grid"><div><p class="kicker">Empresa</p><h1>YC Systems LLC construye software para operaciones reales</h1><p class="lead">Empresa de software constituida en Nueva York, con operación digital y capacidad para trabajar con negocios en distintos mercados.</p></div><div class="company-signals"><span><small>Entidad</small><strong>YC Systems LLC</strong></span><span><small>Operación</small><strong>Digital e internacional</strong></span><span><small>Enfoque</small><strong>Productos y sistemas operativos</strong></span></div></div></section><section class="section"><div class="container split"><div>${sectionHead("Dirección", "Producto, ingeniería y negocio dentro de una misma conversación", "No construimos pantallas aisladas. Diseñamos sistemas que conectan información, personas y decisiones.")}<p>YC Systems combina productos propios con implementación de software para clientes. Esa combinación mantiene la empresa cerca de problemas reales y obliga a construir con criterio de largo plazo.</p></div><div class="company-scope"><span><small>Qué construimos</small><strong>Productos propios</strong></span><span><strong>Sistemas para clientes</strong></span><span><strong>Evolución y soporte</strong></span></div></div></section><section class="section section-alt"><div class="container">${sectionHead("Principios", "La forma en que decidimos qué construir")}<div class="value-grid"><article><strong>Claridad</strong><p>El cliente y el equipo deben entender el sistema.</p></article><article><strong>Responsabilidad</strong><p>La confianza se protege con procesos y límites claros.</p></article><article><strong>Evolución</strong><p>Una solución útil hoy debe poder mejorar mañana.</p></article><article><strong>Resultados</strong><p>La tecnología debe cambiar una operación, no decorar una propuesta.</p></article></div></div></section>${finalCta(prefix)}`,
});

renderPage({
  route: "/contact/",
  title: "Solicitar diagnóstico | YC Systems",
  description: "Solicita un diagnóstico inicial para definir el software, producto o sistema que tu empresa necesita.",
  bodyClass: "contact-page",
  body: (prefix) => `<section class="page-hero compact-hero"><div class="container narrow"><p class="kicker">Solicitar diagnóstico</p><h1>Cuéntanos qué necesitas controlar, medir o automatizar</h1><p class="lead">Completa un breve formulario y recibe una ruta inicial para definir prioridad, alcance y siguiente decisión.</p></div></section><section class="section contact-section"><div class="container contact-grid"><div class="contact-copy"><h2>Qué puedes esperar</h2><ol><li><span>01</span>Entendemos el problema operativo</li><li><span>02</span>Ordenamos prioridad y primera fase</li><li><span>03</span>Respondemos con el siguiente paso recomendado</li></ol><div class="contact-options"><a href="mailto:${content.contact.email}">${content.contact.email}</a><a href="${content.contact.whatsappUrl}" target="_blank" rel="noopener">WhatsApp ${content.contact.whatsappLabel}</a></div></div><form class="brief-form" action="https://formsubmit.co/${content.contact.email}" method="post" data-brief-form data-step="1"><input type="hidden" name="_subject" value="Nuevo diagnóstico desde ycsystems.io" /><input type="hidden" name="_honey" value="" /><input type="hidden" name="source_product" data-source-product /><input type="hidden" name="source_path" data-source-path /><p class="form-step" data-brief-step>Paso 1 de 2</p><div data-step="1"><label>Nombre<input name="name" autocomplete="name" required /></label><label>Correo de trabajo<input type="email" name="email" autocomplete="email" required /></label><label>Empresa<input name="company" autocomplete="organization" required /></label><label>Teléfono <small>Opcional</small><input type="tel" name="phone" autocomplete="tel" /></label><label>¿Qué necesitas mejorar?<select name="need" required><option value="">Selecciona una opción</option><option>Sistema interno</option><option>CRM o ventas</option><option>Panel o reportes</option><option>Automatización</option><option>Producto SaaS</option><option>Sitio comercial</option><option>No estoy seguro</option></select></label><button class="button primary" type="button" data-brief-next>Continuar</button></div><div data-step="2" hidden><label>Industria<input name="industry" autocomplete="organization-title" required /></label><label>Proceso actual<textarea name="current_process" rows="3" required placeholder="¿Cómo resuelven esta operación hoy?"></textarea></label><label>Tamaño del equipo<select name="team_size" required><option value="">Selecciona una opción</option><option>1 a 5 personas</option><option>6 a 20 personas</option><option>21 a 50 personas</option><option>Más de 50 personas</option></select></label><label>Resultado esperado<textarea name="desired_result" rows="3" required placeholder="¿Qué debería mejorar con la primera fase?"></textarea></label><label>Canal preferido<select name="preferred_channel" required><option value="">Selecciona una opción</option><option>Correo</option><option>WhatsApp</option><option>Videollamada</option></select></label><label>Contexto adicional <small>Opcional</small><textarea name="message" rows="4"></textarea></label><label class="consent-field"><input type="checkbox" name="consent" value="accepted" required /><span>Acepto que YC Systems use esta información para responder mi solicitud, conforme a la <a href="${relativeHref("/privacy/", prefix)}">Política de privacidad</a>.</span></label><div class="form-actions"><button class="button secondary" type="button" data-brief-back>Volver</button><button class="button primary" type="submit" data-brief-submit>Enviar diagnóstico</button></div></div><p class="form-status" data-brief-status aria-live="polite"></p><div class="form-success" data-brief-success hidden><strong>Solicitud enviada</strong><p>Recibimos tu información. Te responderemos por el canal indicado.</p></div></form></div></section>`,
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

const productDetails = {
  cleanloop: {
    kicker: "Acceso temprano",
    title: "CleanLoop organiza la operación completa de una lavandería",
    lead: "Pedidos, clientes, recogidas, entregas, rutas y pagos conectados en una plataforma diseñada para el trabajo diario.",
    features: [["Pedidos", "Estados, servicios, prendas, precios y pagos"], ["Rutas", "Recogidas, entregas y asignación operativa"], ["Clientes", "Direcciones, historial y preferencias"], ["Control", "Vista administrativa de actividad y prioridades"]],
    evidenceImage: "/assets/screenshots/cleanloop-role-demo.webp",
    evidenceSize: [1400, 943],
    evidenceTitle: "Una operación visible desde el pedido hasta la entrega",
    evidenceText: "La vista combina actividad diaria, responsables y estados para que el equipo pueda decidir sin depender de conversaciones dispersas.",
  },
  soc: {
    kicker: "Prototipo",
    title: "SOC convierte actividad comercial en visibilidad ejecutiva",
    lead: "Una línea de producto para equipos que necesitan reunir proceso comercial, operación, indicadores y seguimiento dentro de una misma lectura.",
    features: [["Proceso comercial", "Prospectos, etapas, tareas y próximos pasos"], ["Actividad", "Movimientos del equipo y prioridades"], ["Indicadores", "Lectura ejecutiva de resultados"], ["Operación", "Roles, estados y seguimiento centralizado"]],
    evidenceImage: "/assets/screenshots/soc-dashboard.webp",
    evidenceSize: [1400, 984],
    evidenceTitle: "Lectura ejecutiva sin perder el detalle operativo",
    evidenceText: "SOC reúne indicadores, actividad y prioridades para convertir el seguimiento comercial en decisiones visibles.",
  },
  brokercontrol: {
    kicker: "Piloto seleccionado",
    title: "BrokerControl ordena la operación comercial inmobiliaria",
    lead: "Un CRM operativo para prospectos, propiedades, reservas, documentos, agenda y comisiones de equipos inmobiliarios.",
    features: [["Prospectos", "Seguimiento claro desde el primer contacto"], ["Propiedades", "Inventario, disponibilidad y relación comercial"], ["Documentos", "Información importante dentro del flujo"], ["Comisiones", "Visibilidad de cierres, asesores y pagos"]],
    evidenceImage: "/assets/screenshots/brokercontrol-dashboard.webp",
    evidenceSize: [1400, 1081],
    evidenceTitle: "El proceso inmobiliario dentro de una sola vista",
    evidenceText: "BrokerControl relaciona prospectos, propiedades, documentos y comisiones para mantener la operación comercial bajo control.",
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
    ogImage: `https://ycsystems.io${product.image}`,
    body: (prefix) => `<section class="product-hero"><div class="container product-hero-grid"><div><p class="kicker">${detail.kicker}</p><h1>${detail.title}</h1><p class="lead">${detail.lead}</p><div class="actions"><a class="button primary" href="${relativeHref(`/contact/?product=${encodeURIComponent(product.name)}`, prefix)}">Solicitar acceso</a><a class="button secondary" href="${relativeHref("/products/", prefix)}">Ver productos</a></div></div><div class="product-visual">${productImage(product, prefix, "", "eager")}<span class="status-badge status-${product.status}">${product.statusLabel}</span></div></div></section><section class="section"><div class="container">${sectionHead("Capacidades", `Una vista operativa diseñada para ${product.market.toLowerCase()}`)}<div class="value-grid">${detail.features.map((feature) => `<article><strong>${feature[0]}</strong><p>${feature[1]}</p></article>`).join("")}</div></div></section><section class="section section-alt product-evidence"><div class="container product-evidence-grid"><figure><img src="${relativeHref(detail.evidenceImage, prefix)}" alt="Evidencia visual de ${product.name}" width="${detail.evidenceSize[0]}" height="${detail.evidenceSize[1]}" loading="lazy" /></figure><div>${sectionHead("Evidencia de producto", detail.evidenceTitle, detail.evidenceText)}<a class="text-link" href="${relativeHref(`/contact/?product=${encodeURIComponent(product.name)}`, prefix)}">Evaluar acceso</a></div></div></section><section class="section"><div class="container split"><div>${sectionHead("Modalidad", "Implementación guiada con alcance definido", "Revisamos ajuste, prioridades y condiciones antes de confirmar acceso o piloto.")}</div><a class="button primary" href="${relativeHref(`/contact/?product=${encodeURIComponent(product.name)}`, prefix)}">Solicitar acceso</a></div></section>`,
  });
}

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
