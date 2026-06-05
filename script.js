const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const header = document.querySelector("[data-header]");
const langToggle = document.querySelector("[data-lang-toggle]") || document.querySelector(".language-chip");
const translatableElements = document.querySelectorAll("[data-i18n]");

const defaultTextByKey = {};
translatableElements.forEach((element) => {
  defaultTextByKey[element.dataset.i18n] = element.textContent;
});

const translations = {
  es: {
    "nav.ecosystem": "Servicios",
    "nav.products": "Proyectos",
    "nav.brands": "Casos",
    "nav.launch": "Proceso",
    "nav.technology": "Tecnología",
    "nav.contact": "Contacto",
    "hero.eyebrow": "Desarrollo de software, paginas web y sistemas de negocio",
    "hero.title": "YC Systems crea paginas web, dashboards y sistemas digitales para negocios reales.",
    "hero.lede": "Una marca de portafolio y servicios creada por Yeison Castillo, enfocada en paginas limpias, software operacional, automatizaciones y productos digitales que los clientes pueden usar de verdad.",
    "hero.cta.products": "Ver que puedo crear",
    "hero.cta.contact": "Contactar",
    "identity.label": "Resultados visibles",
    "identity.copy": "Tiendas de clientes, dashboards de negocio, sistemas operativos y experiencias web desarrolladas por YC Systems.",
    "identity.portfolio.label": "Portafolio",
    "identity.portfolio.value": "06 proyectos",
    "identity.focus.label": "Enfoque",
    "identity.focus.value": "Operaciones",
    "identity.model.label": "Caso de cliente",
    "identity.model.value": "GhostWear",
    "showcase.eyebrow": "Prueba de trabajo",
    "showcase.title": "Pantallas reales que un cliente puede entender, confiar y comprar.",
    "showcase.copy": "YC Systems muestra conceptos completados e interfaces funcionales para que un cliente vea el valor antes de iniciar: dashboards, paginas web, formularios, roles, flujos y bases listas para deploy.",
    "showcase.cta": "Ver proyecto destacado",
    "ownership.eyebrow": "Por que YC Systems",
    "ownership.title": "Una marca de desarrollo creada para que los proyectos de clientes se vean serios, utiles y listos para lanzar.",
    "ownership.one.title": "Valor claro de negocio",
    "ownership.one.copy": "Cada pagina o sistema se enfoca en lo que el negocio necesita vender, gestionar o automatizar.",
    "ownership.two.title": "Ejecucion limpia",
    "ownership.two.copy": "Interfaces modernas, layouts responsivos y flujos practicos que se sienten profesionales desde la primera visita.",
    "ownership.three.title": "Firma YC Systems",
    "ownership.three.copy": "Los proyectos pueden llevar la marca \"Desarrollado por YC Systems\" como firma confiable de desarrollo.",
    "brand.eyebrow": "Sistema de marca",
    "brand.title": "Una identidad limpia basada en tecnología, confianza y ejecución.",
    "brand.copy": "El sistema visual de YC Systems usa una marca YC precisa, contraste navy, azul principal, gris y espacio blanco para comunicar innovación sin perder seriedad.",
    "brand.blue": "Azul principal",
    "brand.navy": "Azul oscuro",
    "brand.gray": "Gris",
    "brand.white": "Blanco",
    "ecosystem.eyebrow": "Portafolio de proyectos",
    "service.identity.copy": "Esta es la identidad que aparece en paginas web, sistemas, dashboards y productos digitales desarrollados bajo YC Systems.",
    "service.identity.signature": "Firma oficial de proyecto: Desarrollado por YC Systems",
    "delivery.one": "Paginas reales, no maquetas vacias",
    "delivery.two": "Presentacion lista para movil",
    "delivery.three": "Desarrollado por YC Systems",
    "services.eyebrow": "Servicios para clientes",
    "services.title": "Lo que los clientes pueden contratar con YC Systems.",
    "services.copy": "Desde una landing page profesional hasta un dashboard de negocio, YC Systems convierte una idea en una experiencia digital limpia con estructura, diseno y logica funcional.",
    "services.web.title": "Paginas web y landing pages",
    "services.web.copy": "Paginas modernas para negocios, marcas personales, servicios, portafolios, campanas y lanzamientos de productos.",
    "services.systems.title": "Sistemas de negocio y dashboards",
    "services.systems.copy": "Herramientas a medida para ventas, clientes, reservas, documentos, reportes, operaciones y control interno.",
    "services.brand.title": "Presencia de marca y producto",
    "services.brand.copy": "Identidad digital, paginas de producto, direccion e-commerce y experiencias web de marca con estandar profesional.",
    "signature.title": "Marca principal para todos los proyectos: YC Systems",
    "signature.copy": "Firma recomendada: Built by YC Systems. En espanol: Desarrollado por YC Systems.",
    "ecosystem.title": "Ejemplos del tipo de trabajo que YC Systems puede entregar.",
    "ecosystem.copy": "Estos proyectos funcionan como casos de portafolio para clientes que necesitan sistemas operativos, dashboards, flujos de automatizacion, experiencias web o plataformas de marca.",
    "status.broker": "MVP operativo",
    "card.broker.copy": "Para equipos inmobiliarios que necesitan controlar prospectos, reservas, documentos, planes de pago y comisiones.",
    "status.soc": "Prototipo en desarrollo",
    "card.soc.copy": "Para constructoras y equipos de ventas que necesitan un centro de mando para equipos, reservas y analítica.",
    "status.clean": "Ecosistema demo construido",
    "card.clean.copy": "Para lavanderias que necesitan membresias, recogida y entrega, drivers, apps de usuarios y control administrativo.",
    "status.ghost": "Caso e-commerce de cliente",
    "card.ghost.copy": "Una tienda streetwear de cliente construida con catalogo, carrito, productos visibles y pedido por WhatsApp.",
    "common.learn": "Ver mas",
    "products.eyebrow": "Trabajos de desarrollo",
    "products.title": "Proyectos creados para mostrar software real, dashboards y ejecucion web.",
    "broker.pill": "CRM inmobiliario",
    "broker.copy": "Un sistema operativo inmobiliario que reemplaza el seguimiento en hojas de cálculo por un flujo controlado desde prospecto hasta cierre.",
    "broker.li1": "Pipeline, reservas, documentos y comisiones en un solo lugar",
    "broker.li2": "Creado para brokers, equipos inmobiliarios y salas de ventas",
    "broker.li3": "MVP operativo con pantallas reales de dashboard",
    "broker.caption": "Dashboard BrokerControl: pipeline, documentos y control comercial.",
    "soc.pill": "Prototipo de operaciones comerciales",
    "soc.copy": "Una plataforma de operaciones comerciales que da a los gerentes una vista viva de reservas, actividad de ventas y ejecucion del equipo.",
    "soc.li1": "Centro de mando para inventario, reservas y estatus comercial",
    "soc.li2": "Diseñado para equipos de ventas de constructoras y gerentes",
    "soc.li3": "Prototipo enfocado en visibilidad operacional",
    "soc.caption": "Dashboard SOC: disponibilidad, reservas y etapas operativas.",
    "clean.pill": "Ecosistema SaaS para lavanderías",
    "clean.copy": "Una plataforma SaaS de lavandería que convierte recogida, entrega, suscripciones, drivers y administración en un flujo repetible.",
    "clean.li1": "Membresías, recogida, entrega, drivers y administración",
    "clean.li2": "Construido como ecosistema demo SaaS con múltiples roles",
    "clean.li3": "Diseñado para ingresos recurrentes y logística moderna",
    "clean.caption": "Hub de roles CleanLoop: experiencia admin, usuario y driver.",
    "brands.eyebrow": "Casos de cliente",
    "brands.copy": "GhostWear es un proyecto streetwear de cliente construido por YC Systems: drops, identidad visual, catalogo, carrito y presentacion e-commerce para una tienda real.",
    "brands.point.identity": "Identidad de marca",
    "brands.point.apparel": "Ropa",
    "brands.point.vision": "Visión lifestyle",
    "launch.eyebrow": "Proceso con clientes",
    "launch.title": "Un proceso simple desde la idea hasta el lanzamiento.",
    "launch.copy": "YC Systems puede ayudar a ordenar la idea, disenar la experiencia, construir la primera version y preparar el proyecto para entrega o despliegue.",
    "launch.domains.label": "01. Descubrir",
    "launch.domains.value": "Objetivos, usuarios y necesidades del negocio",
    "launch.domains.copy": "Definimos que debe comunicar, vender, gestionar o automatizar el proyecto.",
    "launch.email.label": "02. Construir",
    "launch.email.value": "Diseno, paginas, flujos y codigo",
    "launch.email.copy": "La interfaz y la funcionalidad se crean con estructura limpia y flujo de usuario practico.",
    "launch.deploy.label": "03. Entregar",
    "launch.deploy.value": "Listo para presentar, publicar o mejorar",
    "launch.deploy.copy": "El resultado final queda preparado para revision, lanzamiento, cambios futuros y uso del cliente.",
    "about.eyebrow": "Sobre YC Systems",
    "about.title": "Un portafolio tecnologico personal creado alrededor de software, paginas web y sistemas.",
    "about.copy": "YC Systems es el espacio donde Yeison Castillo presenta trabajos de desarrollo, sistemas de negocio, paginas web, ideas SaaS, conceptos de automatizacion y marcas digitales.",
    "about.mission": "Misión",
    "about.mission.copy": "Crear software util, paginas limpias y herramientas digitales que resuelvan problemas practicos.",
    "about.vision": "Visión",
    "about.vision.copy": "Convertir YC Systems en un portafolio fuerte de proyectos de software, trabajos reales y marcas digitales.",
    "tech.eyebrow": "Tecnología",
    "tech.title": "Construido sobre un stack moderno, práctico y escalable.",
    "tech.copy": "YC Systems usa tecnologías probadas para SaaS, APIs, herramientas de negocio, infraestructura cloud y experiencias móviles.",
    "tech.mobile": "Desarrollo móvil",
    "contact.eyebrow": "Contacto",
    "contact.title": "Hablemos de tu proxima pagina web, sistema o proyecto digital.",
    "contact.copy": "Para paginas web, sistemas de negocio, dashboards, automatizaciones o consultas de proyecto, escribe por email o revisa el GitHub publico de YC Systems.",
    "footer.value": "Construyendo software. Creando marcas.",
  },
};

const textTranslations = {
  "Servicios": "Services",
  "Proyectos": "Projects",
  "Casos": "Cases",
  "Nosotros": "About",
  "Proceso": "Process",
  "Tecnologia": "Technology",
  "Contacto": "Contact",
  "Web, apps, SaaS y sistemas": "Web, apps, SaaS and systems",
  "YC Systems crea soluciones digitales para vender, operar y crecer.": "YC Systems builds digital solutions to sell, operate and grow.",
  "Paginas profesionales, tiendas online, dashboards, aplicaciones web, sistemas internos y plataformas SaaS con presentacion lista para clientes reales.": "Professional websites, online stores, dashboards, web apps, internal systems and SaaS platforms ready for real clients.",
  "Ver proyectos reales": "View real projects",
  "Solicitar una solucion": "Request a solution",
  "Que puedes contratar": "What you can hire",
  "Seis caminos claros para trabajar con YC Systems.": "Six clear ways to work with YC Systems.",
  "Elige el tipo de solucion que necesitas ahora. Luego se define alcance, contenido, tecnologia y plan de entrega.": "Choose the type of solution you need now. Then we define scope, content, technology and delivery plan.",
  "Pagina web profesional": "Professional website",
  "Tienda online": "Online store",
  "Sistema interno": "Internal system",
  "SaaS o app a medida": "Custom SaaS or app",
  "Mantenimiento web": "Website maintenance",
  "Sitios multiidioma": "Multilingual websites",
  "Servicios claros para negocios que necesitan verse mejor y operar mejor.": "Clear services for businesses that need to look better and operate better.",
  "Lo que un cliente puede contratar con YC Systems": "What a client can hire from YC Systems",
  "Soluciones presentadas como productos claros: sabes que recibes, para que sirve y como puede ayudar a vender, operar o crecer.": "Solutions presented as clear products: you know what you receive, what it is for, and how it helps you sell, operate or grow.",
  "Pagina web profesional": "Professional website",
  "Una presencia digital elegante para que tu negocio se vea serio desde la primera visita.": "An elegant digital presence so your business looks serious from the first visit.",
  "Quiero mi pagina": "I want my website",
  "Tienda online lista para vender": "Online store ready to sell",
  "Catalogo, productos, carrito y pedido por WhatsApp para convertir una marca en tienda real.": "Catalog, products, cart and WhatsApp ordering to turn a brand into a real store.",
  "Ver ejemplo real": "View real example",
  "Aplicacion web a medida": "Custom web app",
  "Herramientas con usuarios, formularios, roles y flujos que resuelven procesos del negocio.": "Tools with users, forms, roles and workflows that solve business processes.",
  "Crear mi app": "Create my app",
  "Sistema interno o CRM": "Internal system or CRM",
  "Control de clientes, reservas, documentos, ventas, pagos, tareas y seguimiento diario.": "Control clients, reservations, documents, sales, payments, tasks and daily follow-up.",
  "SaaS o MVP digital": "SaaS or digital MVP",
  "Una primera version de producto para validar, operar y crecer con clientes reales.": "A first product version to validate, operate and grow with real clients.",
  "Automatizacion y mejora digital": "Automation and digital improvement",
  "Procesos mas claros, menos trabajo manual y herramientas que hacen que el negocio fluya mejor.": "Clearer processes, less manual work and tools that help the business flow better.",
  "Mejorar mi negocio": "Improve my business",
  "Mantenimiento mensual": "Monthly maintenance",
  "Tu sitio o sistema no se queda abandonado: se mejora, se ajusta y se mantiene vivo.": "Your site or system is not abandoned: it is improved, adjusted and kept alive.",
  "Version ES / EN": "ES / EN version",
  "Contenido en espanol e ingles para presentarte mejor ante clientes locales e internacionales.": "Content in Spanish and English to present yourself better to local and international clients.",
  "Agregar idioma": "Add language",
  "Soluciones digitales": "Digital solutions",
  "Solicitar solucion": "Request solution",
  "Ver pruebas reales": "View real proof",
  "Paquetes comerciales": "Commercial packages",
  "Formas claras de contratar YC Systems.": "Clear ways to hire YC Systems.",
  "Web profesional": "Professional web",
  "Sistema interno / CRM": "Internal system / CRM",
  "SaaS o app MVP": "SaaS or app MVP",
  "Mantenimiento mensual": "Monthly maintenance",
  "Soluciones reales": "Real solutions",
  "6 soluciones reales construidas por YC Systems.": "6 real solutions built by YC Systems.",
  "Casos que muestran el crecimiento real de YC Systems.": "Cases showing the real growth of YC Systems.",
  "Cada proyecto existe en repositorios reales y demuestra una capacidad distinta: e-commerce, CRM, SaaS, operaciones, servicios locales y plataformas financieras.": "Each project exists in real repositories and proves a different capability: e-commerce, CRM, SaaS, operations, local services and financial platforms.",
  "Web-app de servicios": "Services web app",
  "Limpieza profesional, reservas, WhatsApp, chat e idioma.": "Professional cleaning, bookings, WhatsApp, chat and language.",
  "Plataforma financiera": "Financial platform",
  "Clientes, casos, documentos, cartas, portal y compliance.": "Clients, cases, documents, letters, portal and compliance.",
  "PWA de servicios": "Services PWA",
  "Web-app bilingue para limpieza profesional con servicios, cotizacion por WhatsApp, reservas, chat y experiencia movil.": "Bilingual web app for professional cleaning with services, WhatsApp quoting, bookings, chat and mobile experience.",
  "CreditPilot": "CreditPilot",
  "Prototipo documentado para gestion de clientes, casos, documentos, cartas, portal, compliance y roadmap tecnico.": "Documented prototype for clients, cases, documents, letters, portal, compliance and technical roadmap.",
  "Quiero una web de servicios": "I want a services website",
  "Quiero una plataforma": "I want a platform",
  "Proyecto real": "Real project",
  "Listo para vender": "Ready to sell",
  "Mantenimiento disponible": "Maintenance available",
  "Quiero algo como esto": "I want something like this",
  "Vitrina de soluciones": "Solution showcase",
  "Casos reales": "Real cases",
  "Casos reales listos para vender y operar.": "Real cases ready to sell and operate.",
  "Cliente real": "Real client",
  "Dominio activo": "Active domain",
  "Pedido por WhatsApp": "WhatsApp ordering",
  "Sistema funcional": "Functional system",
  "Panel / CRM": "Panel / CRM",
  "Operaciones": "Operations",
  "Dashboard operativo": "Operational dashboard",
  "Siguiente paso": "Next step",
  "Quiero una tienda": "I want a store",
  "Quiero un sistema interno": "I want an internal system",
  "Quiero un SaaS": "I want a SaaS",
  "Quiero mantenimiento": "I want maintenance",
  "Smart Solutions. Real Results.": "Smart Solutions. Real Results.",
  "Una empresa digital creada para construir soluciones reales, no solo paginas bonitas.": "A digital company built to create real solutions, not just pretty pages.",
  "Iniciar proyecto": "Start project",
  "Quienes somos": "Who we are",
  "Como trabajamos": "How we work",
  "Orden, claridad y resultados visibles.": "Order, clarity and visible results.",
  "Señales de confianza": "Trust signals",
  "Una base real para clientes, socios e inversionistas.": "A real foundation for clients, partners and investors.",
  "Contacto": "Contact",
  "Cuentame que quieres construir, mejorar o mantener.": "Tell me what you want to build, improve or maintain.",
  "Nombre o negocio": "Name or business",
  "Tipo de solucion": "Solution type",
  "Objetivo principal": "Main goal",
  "Tiempo ideal": "Ideal timeline",
  "Rango o referencia de inversion": "Investment range or reference",
  "Detalles importantes": "Important details",
  "Preparar mensaje": "Prepare message",
  "Enviar brief directo": "Send brief directly",
  "Este formulario envia tu brief directo a YC Systems sin abrir el correo. La primera vez FormSubmit puede pedir confirmacion del email receptor.": "This form sends your brief directly to YC Systems without opening email. FormSubmit may request receiver email confirmation the first time.",
  "WhatsApp pendiente": "WhatsApp pending",
  "LinkedIn pendiente": "LinkedIn pending",
  "Que puedes solicitar": "What you can request",
  "Sitio web, app, sistema, SaaS, mantenimiento o idioma.": "Website, app, system, SaaS, maintenance or language.",
  "Cotizar": "Quote",
  "Cuéntame tu idea": "Tell me your idea",
  "Responde rapido y preparo tu mensaje inicial.": "Answer quickly and I will prepare your initial message.",
  "Que quieres construir": "What do you want to build",
  "Pagina web": "Website",
  "SaaS o app": "SaaS or app",
  "Mantenimiento": "Maintenance",
  "Casos profundos": "Deep case studies",
  "Casos reales con problema, solucion, resultado y compra posible.": "Real cases with problem, solution, result and purchase path.",
  "Asi un cliente entiende rapido que se construyo y que podria contratar para su propio negocio.": "So a client quickly understands what was built and what they could hire for their own business.",
  "Problema": "Problem",
  "Solucion": "Solution",
  "Resultado": "Result",
  "Cliente similar puede comprar": "Similar client can buy",
  "Quiero una tienda como esta": "I want a store like this",
  "Quiero un dashboard": "I want a dashboard",
  "Oferta empresarial": "Business offer",
  "Soluciones digitales para empresas que necesitan operar mejor.": "Digital solutions for companies that need to operate better.",
  "Solicitar propuesta": "Request proposal",
  "Que puede contratar una empresa": "What a company can hire",
  "Cuatro lineas comerciales para crecer con orden.": "Four commercial lines to grow with order.",
  "Sistemas internos": "Internal systems",
  "Transformacion digital": "Digital transformation",
  "Material comercial": "Commercial material",
  "Documentos base para convertir clientes con orden.": "Base documents to convert clients with order.",
  "Propuesta comercial": "Commercial proposal",
  "Contrato base": "Base contract",
  "Checklist de onboarding": "Onboarding checklist",
  "Plan de mantenimiento": "Maintenance plan",
  "Privacidad": "Privacy",
  "Terminos": "Terms",
  "Terminos de servicio": "Terms of service",
};

const translatedTextNodes = new WeakMap();
const translatedAttributes = new WeakMap();

function translatePlainText(lang) {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || ["SCRIPT", "STYLE", "TEXTAREA"].includes(parent.tagName)) {
        return NodeFilter.FILTER_REJECT;
      }
      return node.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    },
  });

  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach((node) => {
    if (!translatedTextNodes.has(node)) translatedTextNodes.set(node, node.textContent);
    const original = translatedTextNodes.get(node);
    const trimmed = original.trim();
    const translated = textTranslations[trimmed];
    node.textContent = lang === "en" && translated ? original.replace(trimmed, translated) : original;
  });

  document.querySelectorAll("input[placeholder], textarea[placeholder], option").forEach((element) => {
    const key = element.tagName === "OPTION" ? "text" : "placeholder";
    if (!translatedAttributes.has(element)) {
      translatedAttributes.set(element, {
        text: element.textContent,
        placeholder: element.getAttribute("placeholder"),
      });
    }
    const original = translatedAttributes.get(element)[key];
    if (!original) return;
    const translated = textTranslations[original.trim()];
    if (key === "text") element.textContent = lang === "en" && translated ? translated : original;
    else element.setAttribute("placeholder", lang === "en" && translated ? translated : original);
  });
}

function applyLanguage(lang) {
  document.documentElement.lang = lang;
  document.body.classList.toggle("lang-es", lang === "es");
  document.body.classList.toggle("lang-en", lang === "en");

  translatableElements.forEach((element) => {
    const key = element.dataset.i18n;
    element.textContent = translations[lang]?.[key] ?? defaultTextByKey[key] ?? element.textContent;
  });

  translatePlainText(lang);

  if (langToggle) {
    langToggle.textContent = lang === "es" ? "EN" : "ES";
    langToggle.setAttribute("aria-label", lang === "es" ? "Switch to English" : "Cambiar a español");
  }
}

navToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open");
  document.body.classList.toggle("nav-open", Boolean(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    navToggle?.setAttribute("aria-label", "Open navigation");
  });
});

const animatedElements = document.querySelectorAll(
  ".product-card, .brand-story, .apparel-showcase, .about-grid, .stack-grid"
);

animatedElements.forEach((element) => element.setAttribute("data-animate", ""));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

animatedElements.forEach((element) => observer.observe(element));

window.addEventListener("scroll", () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 8);
});

const savedLang = localStorage.getItem("yc-lang");
applyLanguage(savedLang === "en" ? "en" : "es");

if (langToggle) {
  langToggle.setAttribute("role", "button");
  langToggle.setAttribute("tabindex", "0");
}

langToggle?.addEventListener("click", () => {
  const nextLang = document.documentElement.lang === "es" ? "en" : "es";
  localStorage.setItem("yc-lang", nextLang);
  applyLanguage(nextLang);
});

langToggle?.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    langToggle.click();
  }
});

const currentScript = document.currentScript || document.querySelector('script[src*="script.js"]');
const siteRoot = currentScript ? new URL(".", currentScript.src) : new URL("/", window.location.href);
const contactUrl = new URL("contact/", siteRoot).href;

function trackYCEvent(eventName, payload = {}) {
  const eventPayload = {
    page: window.location.pathname,
    language: document.documentElement.lang || "es",
    timestamp: new Date().toISOString(),
    ...payload,
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...eventPayload });

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, eventPayload);
  }

  if (typeof window.plausible === "function") {
    window.plausible(eventName, { props: eventPayload });
  }

  try {
    localStorage.setItem("yc-last-event", JSON.stringify({ event: eventName, ...eventPayload }));
  } catch {
    // Analytics should never block the visitor experience.
  }
}

trackYCEvent("page_view");

document.addEventListener("click", (event) => {
  const link = event.target.closest("a[href]");
  if (!link) return;
  const href = link.getAttribute("href") || "";
  if (!href.includes("contact") && !href.includes("projects") && !href.includes("partners") && !href.includes("documents") && !href.startsWith("mailto:")) {
    return;
  }
  trackYCEvent("cta_click", {
    label: link.textContent.trim().slice(0, 80),
    href,
  });
});

const projectBriefForm = document.querySelector("[data-project-brief]");
projectBriefForm?.addEventListener("submit", (event) => {
  const data = new FormData(projectBriefForm);
  trackYCEvent("contact_submit", {
    solution: data.get("solution") || "Pendiente",
    timeline: data.get("timeline") || "Pendiente",
    budget: data.get("budget") || "Pendiente",
  });

  if (projectBriefForm.dataset.directSubmit === "true") {
    const status = projectBriefForm.querySelector("[data-brief-status]");
    if (status) status.textContent = "Enviando brief directo a YC Systems...";
    return;
  }

  event.preventDefault();
  const message = [
    "Hola YC Systems, quiero iniciar una propuesta.",
    "",
    `Nombre o negocio: ${data.get("name") || "Pendiente"}`,
    `Tipo de solucion: ${data.get("solution")}`,
    `Objetivo principal: ${data.get("goal") || "Pendiente"}`,
    `Tiempo ideal: ${data.get("timeline")}`,
    `Rango o referencia de inversion: ${data.get("budget")}`,
    "",
    "Detalles:",
    data.get("details") || "Pendiente",
  ].join("\n");
  const subject = encodeURIComponent("Brief de proyecto para YC Systems");
  const body = encodeURIComponent(message);
  const status = projectBriefForm.querySelector("[data-brief-status]");
  if (status) status.textContent = "Mensaje preparado. Se abrira tu correo para enviarlo a YC Systems.";
  window.location.href = `mailto:yeicastillog@gmail.com?subject=${subject}&body=${body}`;
});

const intakeQuestions = [
  {
    key: "solution",
    label: "Que quieres construir",
    options: ["Tienda online", "Pagina web", "Sistema interno / CRM", "SaaS o app", "Mantenimiento"],
  },
  {
    key: "stage",
    label: "En que etapa estas",
    options: ["Solo tengo la idea", "Ya tengo contenido", "Ya existe y quiero mejorarlo", "Necesito lanzarlo pronto"],
  },
  {
    key: "priority",
    label: "Que es lo mas importante",
    options: ["Vender mas", "Organizar operaciones", "Automatizar procesos", "Verse mas profesional"],
  },
  {
    key: "timeline",
    label: "Tiempo ideal",
    options: ["Esta semana", "Este mes", "1 a 3 meses", "Estoy explorando"],
  },
];

function createConceptChat() {
  if (document.querySelector("[data-concept-chat]")) return;

  const chat = document.createElement("section");
  chat.className = "concept-chat";
  chat.dataset.conceptChat = "";
  chat.innerHTML = `
    <button class="concept-chat-launcher" type="button" aria-expanded="false" aria-controls="concept-chat-panel">
      <span>YC</span>
      <strong>Cotizar</strong>
    </button>
    <div class="concept-chat-panel" id="concept-chat-panel" aria-live="polite">
      <div class="concept-chat-head">
        <div>
          <span>YC Systems</span>
          <strong>Cuéntame tu idea</strong>
        </div>
        <button type="button" aria-label="Cerrar chat" data-chat-close>×</button>
      </div>
      <div class="concept-chat-body" data-chat-body></div>
    </div>
  `;

  document.body.appendChild(chat);

  const launcher = chat.querySelector(".concept-chat-launcher");
  const panel = chat.querySelector(".concept-chat-panel");
  const close = chat.querySelector("[data-chat-close]");
  const body = chat.querySelector("[data-chat-body]");
  const answers = {};
  let step = 0;

  function setOpen(isOpen) {
    chat.classList.toggle("is-open", isOpen);
    launcher.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) trackYCEvent("chat_open");
  }

  function renderQuestion() {
    const question = intakeQuestions[step];
    const progress = `${step + 1} / ${intakeQuestions.length}`;
    body.innerHTML = `
      <div class="chat-message chat-message-yc">Responde rapido y preparo tu mensaje inicial.</div>
      <div class="chat-question">
        <span>${progress}</span>
        <strong>${question.label}</strong>
      </div>
      <div class="chat-options">
        ${question.options.map((option) => `<button type="button" data-chat-answer="${option}">${option}</button>`).join("")}
      </div>
    `;
  }

  function renderContactStep() {
    body.innerHTML = `
      <div class="chat-message chat-message-yc">Perfecto. Ahora deja un contacto o una nota corta para incluirla en el correo.</div>
      <label class="chat-field">
        <span>Contacto o nota</span>
        <textarea rows="4" data-chat-note placeholder="Ej: Soy Carlos, quiero una tienda para ropa y puedo hablar esta semana."></textarea>
      </label>
      <button class="chat-primary" type="button" data-chat-finish>Preparar mensaje</button>
    `;
  }

  function buildSummary(note = "") {
    const lines = [
      "Hola YC Systems, quiero iniciar una propuesta.",
      "",
      `Tipo de solucion: ${answers.solution}`,
      `Etapa actual: ${answers.stage}`,
      `Prioridad: ${answers.priority}`,
      `Tiempo ideal: ${answers.timeline}`,
    ];

    if (note.trim()) {
      lines.push("", `Nota/contacto: ${note.trim()}`);
    }

    return lines.join("\n");
  }

  function renderResult() {
    const note = body.querySelector("[data-chat-note]")?.value || "";
    const summary = buildSummary(note);
    const mailSubject = encodeURIComponent("Nueva idea para YC Systems");
    const mailBody = encodeURIComponent(summary);

    body.innerHTML = `
      <div class="chat-message chat-message-yc">Listo. Este es el concepto inicial que recibire para responder con una propuesta.</div>
      <pre class="chat-summary">${summary}</pre>
      <div class="chat-actions">
        <a class="chat-primary" href="mailto:yeicastillog@gmail.com?subject=${mailSubject}&body=${mailBody}">Enviar por Gmail</a>
        <a href="${contactUrl}">Ver contacto</a>
      </div>
    `;
  }

  launcher.addEventListener("click", () => {
    setOpen(!chat.classList.contains("is-open"));
    if (!body.dataset.ready) {
      body.dataset.ready = "true";
      renderQuestion();
    }
  });

  close.addEventListener("click", () => setOpen(false));

  body.addEventListener("click", (event) => {
    const answer = event.target.closest("[data-chat-answer]");
    if (answer) {
      answers[intakeQuestions[step].key] = answer.dataset.chatAnswer;
      trackYCEvent("chat_answer", {
        step: intakeQuestions[step].key,
        answer: answer.dataset.chatAnswer,
      });
      step += 1;
      if (step < intakeQuestions.length) renderQuestion();
      else renderContactStep();
      return;
    }

    if (event.target.closest("[data-chat-finish]")) {
      trackYCEvent("chat_finish", answers);
      renderResult();
    }
  });

  if (new URLSearchParams(window.location.search).get("chat") === "open") {
    body.dataset.ready = "true";
    renderQuestion();
    setOpen(true);
  }
}

createConceptChat();
