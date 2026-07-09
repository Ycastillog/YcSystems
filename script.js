const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const header = document.querySelector("[data-header]");
const langToggle = document.querySelector("[data-lang-toggle]") || document.querySelector(".language-chip");
const langToggles = document.querySelectorAll("[data-lang-toggle], .language-chip");
const translatableElements = document.querySelectorAll("[data-i18n]");

const YC_CONTACT = Object.freeze({
  email: "contact@ycsystems.io",
  futureEmail: "support@ycsystems.io",
  adminEmail: "admin@ycsystems.io",
  helloEmail: "hello@ycsystems.io",
  whatsapp: "",
  instagram: "https://www.instagram.com/yc.systems",
  facebook: "https://www.facebook.com/profile.php?id=61590842845172",
  github: "https://github.com/Ycastillog",
});

globalThis.YC_CONTACT = YC_CONTACT;

function lockMobileNavigationButton() {
  if (!navToggle) return;

  navToggle.innerHTML = '<span aria-hidden="true"></span><span aria-hidden="true"></span>';

  const mobileQuery = window.matchMedia("(max-width: 760px)");
  const lines = () => navToggle.querySelectorAll("span");

  const setImportant = (property, value) => {
    navToggle.style.setProperty(property, value, "important");
  };

  const applyLock = () => {
    if (!mobileQuery.matches) {
      navToggle.removeAttribute("style");
      lines().forEach((line) => line.removeAttribute("style"));
      return;
    }

    setImportant("display", "inline-flex");
    setImportant("position", "fixed");
    setImportant("top", "10px");
    setImportant("right", "14px");
    setImportant("z-index", "140");
    setImportant("width", "46px");
    setImportant("height", "46px");
    setImportant("align-items", "center");
    setImportant("justify-content", "center");
    setImportant("border", "1px solid rgba(0, 216, 255, 0.34)");
    setImportant("border-radius", "14px");
    setImportant("background", "rgba(8, 20, 38, 0.92)");
    setImportant("opacity", "1");
    setImportant("visibility", "visible");
    setImportant("font-size", "0");
    setImportant("color", "transparent");

    lines().forEach((line, index) => {
      line.style.setProperty("position", "absolute", "important");
      line.style.setProperty("left", "12px", "important");
      line.style.setProperty("top", index === 0 ? "16px" : "28px", "important");
      line.style.setProperty("display", "block", "important");
      line.style.setProperty("width", "22px", "important");
      line.style.setProperty("height", "2px", "important");
      line.style.setProperty("border-radius", "999px", "important");
      line.style.setProperty("background", "#f8fbff", "important");
      line.style.setProperty("opacity", "1", "important");
    });
  };

  applyLock();
  mobileQuery.addEventListener?.("change", applyLock);
}

lockMobileNavigationButton();

function resolveSitePath(path) {
  const base = document.querySelector('base')?.href || window.location.href;
  return new URL(path, base).href;
}

function installFloatingProposalCta() {
  if (document.querySelector(".floating-proposal-cta")) return;
  const currentPath = window.location.pathname.replace(/\/index\.html$/, "/");
  if (currentPath === "/contact/") return;
  const link = document.createElement("a");
  link.className = "floating-proposal-cta";
  link.href = resolveSitePath("/contact/");
  link.textContent = "Solicitar propuesta";
  link.setAttribute("data-floating-proposal", "");
  document.body.appendChild(link);

  const updateFloatingProposalVisibility = () => {
    document.body.classList.toggle("show-floating-proposal", window.scrollY > 460);
  };

  window.addEventListener("scroll", updateFloatingProposalVisibility, { passive: true });
  updateFloatingProposalVisibility();
}

installFloatingProposalCta();

nav?.querySelectorAll("a[href]").forEach((link) => {
  const href = link.getAttribute("href") || "";
  const linkUrl = new URL(href, window.location.href);
  const linkPath = linkUrl.pathname.replace(/\/index\.html$/, "/");
  const currentPath = window.location.pathname.replace(/\/index\.html$/, "/");
  const isSamePageAnchor = linkUrl.pathname.replace(/\/index\.html$/, "/") === currentPath && Boolean(linkUrl.hash);
  if (href.startsWith("#") || isSamePageAnchor) return;
  const isHome = linkPath === "/";
  const isActive = isHome ? currentPath === linkPath : currentPath.startsWith(linkPath);

  if (isActive) {
    link.setAttribute("aria-current", "page");
  }
});

const defaultTextByKey = {};
translatableElements.forEach((element) => {
  defaultTextByKey[element.dataset.i18n] = element.textContent;
});

const translations = {
  es: {
    "nav.ecosystem": "Productos",
    "nav.products": "Proyectos",
    "nav.brands": "Casos",
    "nav.launch": "Proceso",
    "nav.technology": "Tecnología",
    "nav.contact": "Contacto",
    "hero.eyebrow": "Software Products & Digital Brands",
    "hero.title": "YC Systems construye productos de software que resuelven problemas operativos reales.",
    "hero.lede": "SOC, BrokerControl y CleanLoop son el centro del ecosistema: plataformas para operaciones, CRM inmobiliario y gestion de lavanderías, junto a casos de cliente y marcas digitales.",
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
    "showcase.copy": "YC Systems muestra conceptos completados e interfaces funcionales para que un cliente vea el valor antes de iniciar: dashboards, páginas web, formularios, roles, flujos y bases listas para deploy.",
    "showcase.cta": "Ver proyecto destacado",
    "ownership.eyebrow": "Por que YC Systems",
    "ownership.title": "Una marca de desarrollo creada para que los proyectos de clientes se vean serios, útiles y listos para lanzar.",
    "ownership.one.title": "Valor claro de negocio",
    "ownership.one.copy": "Cada página o sistema se enfoca en lo que el negocio necesita vender, gestionar o automatizar.",
    "ownership.two.title": "Ejecucion limpia",
    "ownership.two.copy": "Interfaces modernas, layouts responsivos y flujos prácticos que se sienten profesionales desde la primera visita.",
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
    "service.identity.copy": "Esta es la identidad que aparece en páginas web, sistemas, dashboards y productos digitales desarrollados bajo YC Systems.",
    "service.identity.signature": "Firma oficial de proyecto: Desarrollado por YC Systems",
    "delivery.one": "Páginas reales, no maquetas vacías",
    "delivery.two": "Presentación lista para móvil",
    "delivery.three": "Desarrollado por YC Systems",
    "services.eyebrow": "Servicios para clientes",
    "services.title": "Lo que los clientes pueden contratar con YC Systems",
    "services.copy": "Desde una landing page profesional hasta un producto SaaS, YC Systems convierte una idea en una experiencia digital limpia con estructura, diseño y lógica funcional.",
    "services.web.title": "Páginas web y landing pages",
    "services.web.copy": "Páginas modernas para negocios, marcas personales, servicios, portafolios, campañas y lanzamientos de productos.",
    "services.systems.title": "Sistemas de negocio y dashboards",
    "services.systems.copy": "Herramientas a medida para ventas, clientes, reservas, documentos, reportes, operaciones y control interno.",
    "services.brand.title": "Presencia de marca y producto",
    "services.brand.copy": "Identidad digital, páginas de producto, dirección e-commerce y experiencias web de marca con estandar profesional.",
    "signature.title": "Marca principal para todos los proyectos: YC Systems",
    "signature.copy": "Firma recomendada: Built by YC Systems. En español: Desarrollado por YC Systems.",
    "ecosystem.title": "Ejemplos del tipo de trabajo que YC Systems puede entregar.",
    "ecosystem.copy": "Estos proyectos funcionan como casos de portafolio para clientes que necesitan sistemas operativos, dashboards, flujos de automatización, experiencias web o plataformas de marca.",
    "status.broker": "MVP operativo",
    "card.broker.copy": "Para equipos inmobiliarios que necesitan controlar prospectos, reservas, documentos, planes de pago y comisiones.",
    "status.soc": "Prototipo en desarrollo",
    "card.soc.copy": "Para constructoras y equipos de ventas que necesitan un centro de mando para equipos, reservas y analítica.",
    "status.clean": "Ecosistema demo construido",
    "card.clean.copy": "Para lavanderías que necesitan membresías, recogida y entrega, drivers, apps de usuarios y control administrativo.",
    "status.ghost": "Caso e-commerce de cliente",
    "card.ghost.copy": "Una tienda streetwear de cliente construida con catálogo, carrito, productos visibles y pedido por WhatsApp.",
    "common.learn": "Ver mas",
    "products.eyebrow": "Trabajos de desarrollo",
    "products.title": "Proyectos creados para mostrar software real, dashboards y ejecución web.",
    "broker.pill": "CRM inmobiliario",
    "broker.copy": "Un sistema operativo inmobiliario que reemplaza el seguimiento en hojas de cálculo por un flujo controlado desde prospecto hasta cierre.",
    "broker.li1": "Pipeline, reservas, documentos y comisiones en un solo lugar",
    "broker.li2": "Creado para brokers, equipos inmobiliarios y salas de ventas",
    "broker.li3": "MVP operativo con pantallas reales de dashboard",
    "broker.caption": "Dashboard BrokerControl: pipeline, documentos y control comercial.",
    "soc.pill": "Prototipo de operaciones comerciales",
    "soc.copy": "Una plataforma de operaciones comerciales que da a los gerentes una vista viva de reservas, actividad de ventas y ejecución del equipo.",
    "soc.li1": "Centro de mando para inventario, reservas y estatus comercial",
    "soc.li2": "Disenado para equipos de ventas de constructoras y gerentes",
    "soc.li3": "Prototipo enfocado en visibilidad operaciónal",
    "soc.caption": "Dashboard SOC: disponibilidad, reservas y etapas operativas.",
    "clean.pill": "Ecosistema SaaS para lavanderías",
    "clean.copy": "Una plataforma SaaS de lavanderia que convierte recogida, entrega, suscripciones, drivers y administracion en un flujo repetible.",
    "clean.li1": "Membresías, recogida, entrega, drivers y administracion",
    "clean.li2": "Construido como ecosistema demo SaaS con multiples roles",
    "clean.li3": "Disenado para ingresos recurrentes y logistica moderna",
    "clean.caption": "Hub de roles CleanLoop: experiencia admin, usuario y driver.",
    "brands.eyebrow": "Casos de cliente",
    "brands.copy": "GhostWear es un proyecto streetwear de cliente construido por YC Systems: drops, identidad visual, catálogo, carrito y presentación e-commerce para una tienda real.",
    "brands.point.identity": "Identidad de marca",
    "brands.point.apparel": "Ropa",
    "brands.point.visión": "Visión lifestyle",
    "launch.eyebrow": "Proceso con clientes",
    "launch.title": "Un proceso simple desde la idea hasta el lanzamiento.",
    "launch.copy": "YC Systems puede ayudar a ordenar la idea, diseñar la experiencia, construir la primera version y preparar el proyecto para entrega o despliegue.",
    "launch.domains.label": "01. Descubrir",
    "launch.domains.value": "Objetivos, usuarios y necesidades del negocio",
    "launch.domains.copy": "Definimos que debe comunicar, vender, gestionar o automatizar el proyecto.",
    "launch.email.label": "02. Construir",
    "launch.email.value": "Diseño, páginas, flujos y código",
    "launch.email.copy": "La interfaz y la funcionalidad se crean con estructura limpia y flujo de usuario practico.",
    "launch.deploy.label": "03. Entregar",
    "launch.deploy.value": "Listo para presentar, publicar o mejorar",
    "launch.deploy.copy": "El resultado final queda preparado para revisión, lanzamiento, cambios futuros y uso del cliente.",
    "about.eyebrow": "Sobre YC Systems",
    "about.title": "Una empresa tecnológica enfocada en productos de software, SaaS y soluciónes digitales.",
    "about.copy": "YC Systems desarrolla líneas internas, sistemas operativos por industria, dashboards, marcas digitales y soluciónes para negocios reales.",
    "about.mission": "Misión",
    "about.mission.copy": "Crear software util, páginas limpias y herramientas digitales que resuelvan problemas prácticos.",
    "about.visión": "Visión",
    "about.visión.copy": "Convertir YC Systems en un portafolio fuerte de proyectos de software, trabajos reales y marcas digitales.",
    "tech.eyebrow": "Tecnología",
    "tech.title": "Construido sobre un stack moderno, practico y escalable.",
    "tech.copy": "YC Systems usa tecnologías probadas para SaaS, APIs, herramientas de negocio, infraestructura cloud y experiencias móviles.",
    "tech.mobile": "Desarrollo móvil",
    "contact.eyebrow": "Contacto",
    "contact.title": "Hablemos de tu próxima página web, sistema o proyecto digital.",
    "contact.copy": "Para páginas web, sistemas de negocio, dashboards, automatizaciones o consultas de proyecto, escribe por email o revisa el GitHub público de YC Systems.",
    "footer.value": "Construyendo software. Creando marcas.",
  },
};

const textTranslations = {
  "Productos": "Products",
  "Proyectos de clientes": "Client Projects",
  "Proyectos": "Projects",
  "Casos": "Cases",
  "Nosotros": "About",
  "Proceso": "Process",
  "Tecnología": "Technology",
  "Contacto": "Contact",
  "Desarrollamos productos SaaS, plataformas operativas y soluciónes digitales que ayudan a empresas a crecer, vender mejor y operar con mas control.": "We develop SaaS products, operational platforms and digital solutions that help companies grow, sell better and operate with more control.",
  "YC Systems en numeros": "YC Systems in Numbers",
  "4 productos. 4 proyectos de clientes. 3 dominios activos. 1 empresa tecnológica.": "4 Products. 4 Client Projects. 3 Active Domains. 1 Technology Company.",
  "Productos de software con mercados claros.": "Software products with clear markets.",
  "Casos de cliente en una vista clara.": "Client projects in one clear view.",
  "Sobre YC Systems": "About YC Systems",
  "Misión, visión y valores construidos alrededor de productos de software.": "Mission, vision and values built around software products.",
  "Construimos productos de software que ayudan a las empresas a operar, crecer y escalar.": "We build software products that help companies operate, grow and scale.",
  "Hablemos de tu próxima página, aplicación, sistema o plataforma.": "Let's talk about your next website, app, system or platform.",
  "Ver productos": "View products",
  "Ver líneas internas": "View internal lines",
  "Ver proyectos de clientes": "View client projects",
  "Explorar productos": "Explore products",
  "Productos de software construidos alrededor de problemas operativos reales.": "Software products built around real operational problems.",
  "YC Systems desarrolla productos SaaS, plataformas operativas y soluciónes digitales que pueden convertirse en activos escalables para industrias reales.": "YC Systems develops SaaS products, operational platforms and digital solutions that can become scalable assets for real industries.",
  "Ecosistema de productos": "Product Ecosystem",
  "Tres productos fuertes y una plataforma en camino definen la dirección de YC Systems.": "Three strong products and one platform on the way define YC Systems direction.",
  "Empresa de productos": "Product company",
  "Trabajo de clientes entregados para marcas, empresas y operaciones en crecimiento.": "Client work delivered for brands, companies and growing operations.",
  "GhostWear, Antony Real Estate, LucianoWash y LPS Company muestran la capacidad de YC Systems para construir presencia digital, e-commerce, branding y flujos comerciales reales.": "GhostWear, Antony Real Estate, LucianoWash and LPS Company show YC Systems' ability to build digital presence, e-commerce, branding and real commercial flows.",
  "Trabajo de clientes": "Client Work",
  "Client projects con problema, solución, entrega y resultado.": "Client projects with problem, solution, delivery and result.",
  "Casos de estudio": "Case Studies",
  "Prueba de producto": "Product Proof",
  "Cual de estos proyectos se parece a lo que necesitas?": "Which of these projects looks like what you need?",
  "YC Systems es una empresa tecnológica enfocada en productos de software, plataformas SaaS y soluciónes digitales.": "YC Systems is a technology company focused on software products, SaaS platforms and digital solutions.",
  "YC Systems convierte operaciones reales en productos digitales.": "YC Systems turns real operations into digital products.",
  "YC Systems desarrolla productos SaaS, plataformas operativas y soluciónes digitales para empresas que necesitan vender mejor, operar con mas control y escalar con tecnología.": "YC Systems develops SaaS products, operational platforms and digital solutions for companies that need to sell better, operate with more control and scale with technology.",
  "Construimos líneas internas y soluciónes digitales para operaciones reales: CleanLoop, SOC, BrokerControl, sistemas internos, dashboards, marcas digitales y plataformas por industria.": "We build internal lines and digital solutions for real operations: CleanLoop, SOC, BrokerControl, internal systems, dashboards, digital brands and industry platforms.",
  "Quienes somos": "Who we are",
  "Una empresa tecnológica con productos, casos reales y capacidad de ejecución.": "A technology company with products, real cases and execution capacity.",
  "YC Systems nace de construir, probar y mejorar software con problemas reales delante.": "YC Systems was born from building, testing and improving software around real problems.",
  "La empresa combina líneas internas, casos de cliente y experiencia tecnica para crear soluciónes que no se quedan en una pantalla bonita: deben ordenar operaciones, generar confianza comercial y abrir oportunidades de crecimiento.": "The company combines internal lines, client cases and technical experience to create solutions that do not stop at a pretty screen: they must organize operations, build commercial trust and open growth opportunities.",
  "Convertir procesos complejos en productos digitales claros, útiles y escalables.": "Turn complex processes into clear, useful and scalable digital products.",
  "Construir una empresa global de software con productos SaaS y soluciónes digitales para multiples industrias.": "Build a global software company with SaaS products and digital solutions for multiple industries.",
  "Valores principales": "Core Values",
  "Los valores que guian YC Systems.": "The values that guide YC Systems.",
  "Software Products & Digital Brands": "Software Products & Digital Brands",
  "YC Systems construye productos de software que resuelven problemas operativos reales.": "YC Systems builds software products that solve real operational problems.",
  "SOC, BrokerControl y CleanLoop son el centro del ecosistema: plataformas para operaciones, CRM inmobiliario y gestion de lavanderías, junto a casos de cliente y marcas digitales.": "SOC, BrokerControl and CleanLoop are the center of the ecosystem: platforms for operations, real estate CRM and laundry management, alongside client cases and digital brands.",
  "Ver productos": "View products",
  "Ver ecosistema": "View ecosystem",
  "6 casos reales": "6 real cases",
  "Web-apps": "Web apps",
  "SaaS MVP": "SaaS MVP",
  "portafolio actualizado": "updated portfolio",
  "repos y capturas reales": "real repos and screenshots",
  "Digital Brands": "Digital Brands",
  "Solicitar una solución": "Request a solution",
  "Que puedes contratar": "What you can hire",
  "YC Systems Ecosystem": "YC Systems Ecosystem",
  "Productos primero. Servicios como capacidad de construcción.": "Products first. Services as a build capability.",
  "YC Systems se organiza alrededor de productos tecnologicos propios y casos reales que prueban la capacidad de crear, operar y escalar soluciónes digitales.": "YC Systems is organized around owned technology products and real cases that prove the ability to create, operate and scale digital solutions.",
  "Capacidades para clientes": "Client capabilities",
  "Lo que YC Systems puede construir para negocios reales": "What YC Systems can build for real businesses",
  "Cuando un cliente necesita una solución similar, YC Systems puede adaptar su experiencia en productos, SaaS, sistemas internos, e-commerce y mantenimiento.": "When a client needs a similar solution, YC Systems can adapt its experience in products, SaaS, internal systems, e-commerce and maintenance.",
  "Seis caminos claros para trabajar con YC Systems.": "Six clear ways to work with YC Systems.",
  "Elige el tipo de solución que necesitas ahora. Luego se define alcance, contenido, tecnología y plan de entrega.": "Choose the type of solution you need now. Then we define scope, content, technology and delivery plan.",
  "Página web profesional": "Professional website",
  "Tienda online": "Online store",
  "Sistema interno": "Internal system",
  "SaaS o app a medida": "Custom SaaS or app",
  "Mantenimiento web": "Website maintenance",
  "Sitios multiidioma": "Multilingual websites",
  "Servicios claros para negocios que necesitan verse mejor y operar mejor.": "Clear services for businesses that need to look better and operate better.",
  "Lo que un cliente puede contratar con YC Systems": "What a client can hire from YC Systems",
  "Soluciones presentadas como productos claros: sabes que recibes, para que sirve y como puede ayudar a vender, operar o crecer.": "Solutions presented as clear products: you know what you receive, what it is for, and how it helps you sell, operate or grow.",
  "Página web profesional": "Professional website",
  "Una presencia digital elegante para que tu negocio se vea serio desde la primera visita.": "An elegant digital presence so your business looks serious from the first visit.",
  "Quiero mi página": "I want my website",
  "Tienda online lista para vender": "Online store ready to sell",
  "Catalogo, productos, carrito y pedido por WhatsApp para convertir una marca en tienda real.": "Catalog, products, cart and WhatsApp ordering to turn a brand into a real store.",
  "Ver ejemplo real": "View real example",
  "Aplicación web a medida": "Custom web app",
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
  "Contenido en español e inglés para presentarte mejor ante clientes locales e internacionales.": "Content in Spanish and English to present yourself better to local and international clients.",
  "Agregar idioma": "Add language",
  "Soluciones digitales": "Digital solutions",
  "Solicitar solución": "Request solution",
  "Ver pruebas reales": "View real proof",
  "Antes de venderte una idea, mostramos ejecución.": "Before selling you an idea, we show execution.",
  "Líneas internas, sitios activos y dominios reales convierten a YC Systems LLC en una empresa tecnológica con evidencia pública, no solo intención.": "Internal lines, active sites and real domains make YC Systems LLC a technology company with public evidence, not just intention.",
  "Elige tu ruta": "Choose your path",
  "¿Qué necesitas construir primero?": "What do you need to build first?",
  "Una primera visita debe convertirse rápido en una decisión. Elige la ruta más cercana y YC Systems responde con próximos pasos claros.": "A first visit should quickly become a decision. Choose the closest path and YC Systems will respond with clear next steps.",
  "Página profesional": "Professional website",
  "Tienda o catálogo": "Store or catalog",
  "Portal para clientes": "Client portal",
  "SaaS o MVP": "SaaS or MVP",
  "Mantenimiento": "Maintenance",
  "Paquetes comerciales": "Commercial packages",
  "Formas claras de contratar YC Systems.": "Clear ways to hire YC Systems.",
  "Web profesional": "Professional web",
  "Sistema interno / CRM": "Internal system / CRM",
  "SaaS o app MVP": "SaaS or app MVP",
  "Mantenimiento mensual": "Monthly maintenance",
  "Soluciones reales": "Real solutions",
  "6 soluciónes reales construidas por YC Systems.": "6 real solutions built by YC Systems.",
  "Products, client projects and future platforms.": "Products, client projects and future platforms.",
  "YC Systems Ecosystem: productos, casos de cliente y plataformas en crecimiento.": "YC Systems Ecosystem: products, client projects and growing platforms.",
  "SOC, BrokerControl y CleanLoop lideran el ecosistema de productos. GhostWear y LucianoWash muestran client projects reales. CreditPilot representa una futura plataforma financiera documentada.": "SOC, BrokerControl and CleanLoop lead the product ecosystem. GhostWear and LucianoWash show real client projects. CreditPilot represents a documented future financial platform.",
  "YC Systems separa líneas internas, casos de cliente y prototipos en crecimiento para mostrar una empresa con activos tecnologicos, no solo servicios.": "YC Systems separates internal lines, client projects and growing prototypes to show a company with technology assets, not just services.",
  "Client Project": "Client Project",
  "Future Platform": "Future Platform",
  "Client Success Story": "Client Success Story",
  "Case Study": "Case Study",
  "Casos que muestran el crecimiento real de YC Systems.": "Cases showing the real growth of YC Systems.",
  "Cada proyecto existe en repositorios reales y demuestra una capacidad distinta: e-commerce, CRM, SaaS, operaciones, servicios locales y plataformas financieras.": "Each project exists in real repositories and proves a different capability: e-commerce, CRM, SaaS, operations, local services and financial platforms.",
  "Web-app de servicios": "Services web app",
  "Limpieza profesional, reservas, WhatsApp, chat e idioma.": "Professional cleaning, bookings, WhatsApp, chat and language.",
  "Plataforma financiera": "Financial platform",
  "Clientes, casos, documentos, cartas, portal y compliance.": "Clients, cases, documents, letters, portal and compliance.",
  "PWA de servicios": "Services PWA",
  "Web-app bilingue para limpieza profesional con servicios, cotizacion por WhatsApp, reservas, chat y experiencia móvil.": "Bilingual web app for professional cleaning with services, WhatsApp quoting, bookings, chat and mobile experience.",
  "CreditPilot": "CreditPilot",
  "Prototipo documentado para gestion de clientes, casos, documentos, cartas, portal, compliance y roadmap tecnico.": "Documented prototype for clients, cases, documents, letters, portal, compliance and technical roadmap.",
  "Quiero una web de servicios": "I want a services website",
  "Quiero una plataforma": "I want a platform",
  "Proyecto real": "Real project",
  "Capturas reales": "Real screenshots",
  "Repos verificados": "Verified repos",
  "Listo para vender": "Ready to sell",
  "Mantenimiento disponible": "Maintenance available",
  "Quiero algo como esto": "I want something like this",
  "Vitrina de soluciónes": "Solution showcase",
  "Trabajo de clientes": "Client work",
  "Trabajo de clientes listos para vender y operar.": "Client work ready to sell and operate.",
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
  "Una empresa digital creada para construir soluciónes reales, no solo páginas bonitas.": "A digital company built to create real solutions, not just pretty pages.",
  "Iniciar proyecto": "Start project",
  "Quienes somos": "Who we are",
  "Como trabajamos": "How we build",
  "Orden, claridad y resultados visibles.": "Order, clarity and visible results.",
  "Señales de confianza": "Trust signals",
  "Technology company": "Technology company",
  "YC Systems desarrolla productos de software, plataformas SaaS y soluciónes digitales.": "YC Systems develops software products, SaaS platforms and digital solutions.",
  "La empresa se enfoca en crear productos tecnologicos propios y soluciónes para operaciones reales: SOC, BrokerControl, CleanLoop, sistemas internos, dashboards, marcas digitales y plataformas por industria.": "The company focuses on creating owned technology products and solutions for real operations: SOC, BrokerControl, CleanLoop, internal systems, dashboards, digital brands and industry platforms.",
  "YC Systems combina producto, tecnología y ejecución comercial.": "YC Systems combines product, technology and commercial execution.",
  "Una base real para clientes, socios e inversionistas.": "A real foundation for clients, partners and investors.",
  "Contacto": "Contact",
  "Cuéntame que quieres construir, mejorar o mantener.": "Tell me what you want to build, improve or maintain.",
  "Nombre o negocio": "Name or business",
  "Tipo de solución": "Solution type",
  "Objetivo principal": "Main goal",
  "Tiempo ideal": "Ideal timeline",
  "Rango o referencia de inversión": "Investment range or reference",
  "Detalles importantes": "Important details",
  "Preparar mensaje": "Prepare message",
  "Enviar brief directo": "Send brief directly",
  "Este formulario envia tu brief directo a YC Systems sin abrir el correo. La primera vez FormSubmit puede pedir confirmación del email receptor.": "This form sends your brief directly to YC Systems without opening email. FormSubmit may request receiver email confirmation the first time.",
  "WhatsApp pendiente": "WhatsApp pending",
  "LinkedIn pendiente": "LinkedIn pending",
  "Instagram oficial": "Official Instagram",
  "Instagram oficial: @yc.systems": "Official Instagram: @yc.systems",
  "Facebook oficial": "Official Facebook",
  "Facebook oficial: YC Systems": "Official Facebook: YC Systems",
  "Instagram y Facebook oficiales": "Official Instagram and Facebook",
  "Canales actuales para proyectos: email, Instagram, Facebook, GitHub público y portafolio de soluciónes construidas por YC Systems.": "Current project channels: email, Instagram, Facebook, public GitHub and a portfolio of solutions built by YC Systems.",
  "Que puedes solicitar": "What you can request",
  "Sitio web, app, sistema, SaaS, mantenimiento o idioma.": "Website, app, system, SaaS, maintenance or language.",
  "Cotizar": "Quote",
  "Cuéntame tu idea": "Tell me your idea",
  "Responde rápido y preparo tu mensaje inicial.": "Answer quickly and I will prepare your initial message.",
  "Qué quieres construir": "What do you want to build",
  "Página web": "Website",
  "SaaS o app": "SaaS or app",
  "Mantenimiento": "Maintenance",
  "Casos profundos": "Deep case studies",
  "Trabajo de clientes que muestran crecimiento.": "Client work that show growth.",
  "Asi un cliente entiende rápido que se construyo y que podria contratar para su propio negocio.": "So a client quickly understands what was built and what they could hire for their own business.",
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
  "Sistemas internos": "Sistemas internos",
  "Transformacion digital": "Digital transformation",
  "Material comercial": "Commercial material",
  "Documentos base para convertir clientes con orden.": "Base documents to convert clients with order.",
  "Propuesta comercial": "Commercial proposal",
  "Contrato base": "Base contract",
  "Checklist de onboarding": "Onboarding checklist",
  "Plan de mantenimiento": "Maintenance plan",
  "Privacidad": "Privacy",
  "Términos": "Terms",
  "Términos de servicio": "Terms of service",
};

Object.assign(textTranslations, {
  "Software, sistemas y páginas web": "Software, systems and websites",
  "Software, sistemas y páginas web para negocios que quieren operar mejor.": "Software, systems and websites for businesses that want to operate better.",
  "Productos de software y sistemas operativos para operaciones reales": "Software products and operating systems for real business operations",
  "YC Systems construye sitios web, dashboards, sistemas internos, tiendas online y productos SaaS con diseño claro, automatización y enfoque en resultados reales.": "YC Systems builds websites, dashboards, internal systems, online stores and SaaS products with clear design, automation and a focus on real results.",
  "Solicitar propuesta": "Request a proposal",
  "Ver proyectos reales": "View real projects",
  "Páginas web": "Websites",
  "Sistemas internos": "Sistemas internos",
  "Dashboards": "Dashboards",
  "SaaS por fases": "Phased SaaS",
  "sitios activos": "live websites",
  "ruta inicial": "initial route",
  "Directo": "Direct",
  "brief o llamada": "brief or call",
  "Lo que hacemos": "What we do",
  "Construimos lo que tu negocio necesita para funcionar mejor.": "We build what your business needs to work better.",
  "No vendemos una sola plantilla. YC Systems organiza cada solución según la etapa del negocio: presencia, venta, operación, portal o mejora continua.": "We do not sell one fixed template. YC Systems organizes each solution by business stage: presence, sales, operations, portal or continuous improvement.",
  "Prueba real": "Real proof",
  "Líneas internas, sitios activos y sistemas listos para operar.": "Internal lines, live websites and systems ready to operate.",
  "Antes de hablar de una idea, puedes ver ejecución: proyectos publicados, líneas internas y una base técnica preparada para negocios reales.": "Before talking about an idea, you can see execution: published projects, internal lines and a technical base prepared for real businesses.",
  "líneas internas": "internal lines",
  "CleanLoop, SOC, BrokerControl y CreditPilot como mapa de software.": "CleanLoop, SOC, BrokerControl and CreditPilot as a software map.",
  "GhostWear, Antony Real Estate, LPS Company, LucianoWash y Snackeria como prueba comercial real.": "GhostWear, Antony Real Estate, LPS Company, LucianoWash and Snackeria as real commercial proof.",
  "Dominios reales": "Real domains",
  "Clientes locales e internacionales": "Local and international clients",
  "Base preparada para República Dominicana, United States y Canadá.": "A base prepared for the Dominican Republic, the United States and Canada.",
  "Líneas internas": "Internal lines",
  "Software que demuestra capacidad técnica, no solo promesas.": "Software that proves technical capability, not just promises.",
  "Estos productos prueban que YC Systems puede construir plataformas, roles, dashboards, flujos y bases listas para crecer por industria.": "These products prove YC Systems can build platforms, roles, dashboards, workflows and foundations ready to grow by industry.",
  "Proyectos reales": "Real projects",
  "Páginas y marcas publicadas para clientes.": "Published websites and brands for clients.",
  "Trabajos visibles con dominios activos: e-commerce, servicios, presencia corporativa, marca profesional y contacto directo.": "Visible work with active domains: e-commerce, services, corporate presence, professional branding and direct contact.",
  "Hablemos de tu próxima página, sistema o plataforma.": "Let's talk about your next website, system or platform.",
  "Explica tu caso y YC Systems te responde con una ruta inicial: qué construir, por dónde empezar y qué entregables necesita tu negocio.": "Explain your case and YC Systems will respond with an initial route: what to build, where to start and what deliverables your business needs.",
  "Enviar brief rápido": "Send quick brief",
  "Productos": "Products",
  "Proyectos de clientes": "Client Projects",
  "Tecnología": "Technology",
  "Nosotros": "About",
  "Contacto": "Contact",
  "Explorar productos": "Explore Products",
  "Ver proyectos de clientes": "View Client Projects",
  "Piloto y alianzas": "Pilot & Partnerships",
  "Producto listo": "Product Ready",
  "Próximamente": "Coming Soon",
  "Productos de software y sistemas de negocio": "Software Products & Business Systems",
  "Construimos productos de software que ayudan a las empresas a operar, crecer y escalar.": "We build software products that help companies operate, grow and scale.",
  "Desarrollamos productos SaaS, plataformas operativas y soluciónes digitales que ayudan a empresas a crecer, vender mejor y operar con mas control.": "We develop SaaS products, operational platforms and digital solutions that help companies grow, sell better and operate with more control.",
  "líneas internas": "internal lines",
  "proyectos entregados": "delivered projects",
  "dominios activos": "active domains",
  "YC Systems en numeros": "YC Systems in Numbers",
  "4 Products. 5 Live Websites. 1 Technology Company.": "4 Products. 5 Live Websites. 1 Technology Company.",
  "4 Products": "4 Products",
  "5 Live Websites": "5 Live Websites",
  "Client Domains": "Client Domains",
  "Dominican Republic - United States - Canada": "Dominican Republic - United States - Canada",
  "YC Systems ya se presenta como una empresa tecnológica con líneas internas, sitios activos, presencia publica y capacidad de ejecución para clientes e inversionistas.": "YC Systems now presents itself as a technology company with internal lines, live websites, public presence and execution capacity for clients and investors.",
  "CleanLoop, SOC, BrokerControl y CreditPilot como mapa de producto.": "CleanLoop, SOC, BrokerControl and CreditPilot as the product map.",
  "GhostWear, Antony Real Estate, LPS Company, LucianoWash y Snackeria como prueba comercial real.": "GhostWear, Antony Real Estate, LPS Company, LucianoWash and Snackeria as real commercial proof.",
  "ghostwear1.com, antonyrealestate.com, lps-company.com y subdominios operativos.": "ghostwear1.com, antonyrealestate.com, lps-company.com and operating subdomains.",
  "Marca preparada para clientes locales e internacionales.": "A brand prepared for local and international clients.",
  "Conoce a Nexus": "Meet Nexus",
  "El asistente visual de YC Systems.": "The visual assistant of YC Systems.",
  "Nexus representa nuestra forma de construir: analizar, diseñar, automatizar y entregar productos digitales que ayudan a las empresas a operar, crecer y escalar.": "Nexus represents how we build: analyze, design, automate and deliver digital products that help companies operate, grow and scale.",
  "Tecnología": "Technology",
  "Automatización": "Automation",
  "Construcción": "Construction",
  "Crecimiento": "Growth",
  "Confianza": "Trust",
  "La identidad combina un logo nítido, Nexus como guía visual y productos reales que prueban ejecución. La web pública muestra la marca lista para clientes, socios e inversionistas.": "The identity combines a crisp logo, Nexus as a visual guide and real products that prove execution. The public website presents the brand ready for clients, partners and investors.",
  "Producto": "Product",
  "Operación": "Operation",
  "Nexus es parte del ADN visual de YC Systems.": "Nexus is part of YC Systems' visual DNA.",
  "Nexus representa nuestra forma de construir: analizar, diseñar, automatizar y entregar productos digitales que ayudan a empresas reales a operar mejor.": "Nexus represents how we build: analyze, design, automate and deliver digital products that help real companies operate better.",
  "Analizar": "Analyze",
  "Disenar": "Design",
  "Construir": "Build",
  "Entregar": "Deliver",
  "Ver productos": "View products",
  "Identidad YC Systems": "YC Systems Identity",
  "Un sistema visual propio: logo, Nexus, productos y una historia real.": "A unique visual system: logo, Nexus, products and a real story.",
  "La marca combina azul electrico, azul profundo, blanco, gris y acentos de acción para verse tecnológica, seria y reconocible. Nexus ayuda a explicar el proceso; los productos y sitios reales prueban la ejecución.": "The brand combines electric blue, deep blue, white, gray and action accents to feel technológical, serious and recognizable. Nexus explains the process; the products and live websites prove execution.",
  "YC Systems no es solo una página de servicios. Es una empresa tecnológica en construcción, con líneas internas, client projects reales y una identidad nacida de trabajo, visión y familia.": "YC Systems is not just a services page. It is a technology company being built, with internal lines, real client projects and an identity born from work, visión and family.",
  "La N tiene un significado especial: Nancy, origen emocional de esta visión y parte de la historia de la marca.": "The N has a special meaning: Nancy, the emotional origin of this visión and part of the brand story.",
  "Productos de software con mercados claros.": "Software products with clear markets.",
  "Cada producto resuelve una operación distinta y abre una oportunidad comercial diferente.": "Each product solves a different operation and opens a different commercial opportunity.",
  "Pilot & Partnerships": "Pilot & Partnerships",
  "Product Ready": "Product Ready",
  "Coming Soon": "Coming Soon",
  "Laundry Operations Platform para lavanderías, drivers, clientes, tracking, pagos y flujo SaaS.": "Laundry Operations Platform for laundries, drivers, customers, tracking, payments and SaaS workflow.",
  "Laundry Operations Platform para lavanderías que necesitan pedidos, drivers, clientes, tracking, pagos y operación diaria en un solo sistema.": "Laundry Operations Platform for laundries that need orders, drivers, customers, tracking, payments and daily operations in one system.",
  "Centro operativo para ventas inmobiliarias, reservas, separaciones, legal, reportes y visibilidad ejecutiva.": "Operations center for real estate sales, reservations, separations, legal, reports and executive visibility.",
  "CRM inmobiliario para pipeline, cliente 360, documentos, comisiones, agenda y reportes comerciales.": "Real estate CRM for pipeline, customer 360, documents, commissions, schedule and commercial reports.",
  "Plataforma en desarrollo para credit repair, clientes, casos, documentos, cartas y portal.": "Platform in development for credit repair, customers, cases, documents, letters and portal.",
  "Reservas": "Reservations",
  "Reportes": "Reports",
  "Comisiones": "Commissions",
  "Casos de cliente en una vista clara.": "Client projects in one clear view.",
  "Sitios reales que muestran e-commerce, servicios, marca corporativa, presencia profesional y dominios activos.": "Live websites that show e-commerce, services, corporate branding, professional presence and active domains.",
  "Live e-commerce": "Live e-commerce",
  "Real estate web": "Real estate web",
  "Corporate web": "Corporate web",
  "Service website": "Service website",
  "Convenience brand": "Convenience brand",
  "Tienda streetwear con catálogo, productos, carrito y pedido por WhatsApp.": "Streetwear store with catalog, products, cart and WhatsApp ordering.",
  "Presencia corporativa inmobiliaria con oferta, confianza y contacto.": "Real estate corporate presence with offer, trust and contact.",
  "Base corporativa para una empresa con marcas, servicios y presencia digital.": "Corporate base for a company with brands, services and digital presence.",
  "Web de servicios de limpieza con imagen profesional, WhatsApp y experiencia móvil.": "Cleaning services website with professional image, WhatsApp and mobile experience.",
  "Presencia digital para soluciónes de conveniencia y servicios empresariales.": "Digital presence for convenience solutions and business services.",
  "Ver sitio activo": "View live site",
  "Sobre YC Systems": "About YC Systems",
  "Misión, visión y valores construidos alrededor de productos de software.": "Mission, vision and values built around software products.",
  "YC Systems convierte problemas operativos en productos digitales claros, útiles y escalables.": "YC Systems turns operational problems into clear, useful and scalable digital products.",
  "Ver About YC Systems": "View About YC Systems",
  "Execution": "Execution",
  "Simplicity": "Simplicity",
  "Innovation": "Innovation",
  "Ownership": "Ownership",
  "Results": "Results",
  "Construimos y entregamos.": "We build and deliver.",
  "Menos complejidad. Más claridad.": "Less complexity. More clarity.",
  "Tecnología aplicada a problemas reales.": "Technology applied to real problems.",
  "Actuamos como dueños.": "We act like owners.",
  "El software debe generar impacto.": "Software must create impact.",
  "Hablemos de tu próxima página, aplicación, sistema o plataforma.": "Let's talk about your next website, application, system or platform.",
  "Canales actuales para proyectos: email, Instagram, Facebook, GitHub público y portafolio de soluciónes construidas por YC Systems.": "Current channels for projects: email, Instagram, Facebook, public GitHub and a portfolio of solutions built by YC Systems.",
  "Email principal: contact@ycsystems.io": "Primary email: contact@ycsystems.io",
  "Instagram oficial: @yc.systems": "Official Instagram: @yc.systems",
  "Facebook oficial: YC Systems": "Official Facebook: YC Systems",
  "GitHub público: Ycastillog": "Public GitHub: Ycastillog",
  "Ver portafolio": "View portfolio",
  "Productos de software": "Software Products",
  "Markets": "Markets",
  "Business": "Business",
  "Documentos": "Documents",
  "Privacidad": "Privacy",
  "Términos": "Terms",
  "Proyectos de clientes": "Client Projects",
  "Sitios reales entregados para marcas, empresas y operaciones en crecimiento.": "Live websites delivered for brands, companies and growing operations.",
  "GhostWear, Antony Real Estate, LPS Company, LucianoWash y Snackeria muestran la capacidad de YC Systems para construir presencia digital, e-commerce, branding y flujos comerciales reales.": "GhostWear, Antony Real Estate, LPS Company, LucianoWash and Snackeria show YC Systems' ability to build digital presence, e-commerce, branding and real commercial flows.",
  "5 sitios activos": "5 live websites",
  "Dominios reales": "Real domains",
  "Marcas publicas": "Public brands",
  "Mantenimiento disponible": "Maintenance available",
  "Client projects con dominio, solución, entrega y resultado.": "Client projects with domain, solution, delivery and result.",
  "Esta página no muestra solo pantallas. Cada caso enseña un sitio real, que necesitaba el cliente, que construyo YC Systems y que puede comprar una empresa similar.": "This page does not only show screens. Each case shows a live website, what the client needed, what YC Systems built and what a similar company can buy.",
  "Casos de cliente con sitios activos.": "Client cases with live websites.",
  "Cada caso muestra una captura real, dominio activo, problema, solución y que puede contratar una empresa similar.": "Each case shows a real screenshot, active domain, problem, solution and what a similar company can hire.",
  "Problema:": "Problem:",
  "Solucion:": "Solution:",
  "vender productos sin depender de mensajes sueltos.": "sell products without depending on scattered messages.",
  "e-commerce, catálogo, carrito y pedido por WhatsApp.": "e-commerce, catalog, cart and WhatsApp ordering.",
  "presentar marca inmobiliaria con mas confianza.": "present a real estate brand with more trust.",
  "web corporativa, oferta, contacto y estructura comercial.": "corporate website, offer, contact and commercial structure.",
  "marca sin presencia corporativa clara.": "brand without clear corporate presence.",
  "identidad, base digital y presentación comercial.": "identity, digital base and commercial presentation.",
  "servicios, confianza y contacto dispersos.": "services, trust and contact scattered across channels.",
  "sitio de servicios con WhatsApp, marca e idioma ES / EN.": "services website with WhatsApp, brand and ES / EN language.",
  "explicar una oferta nueva de conveniencia empresarial.": "explain a new business convenience offer.",
  "presencia digital clara con propuesta, confianza y contacto.": "clear digital presence with offer, trust and contact.",
  "Líneas internas que elevan la credibilidad de YC Systems.": "Internal lines that raise YC Systems' credibility.",
  "Los productos pertenecen al ecosistema YC Systems y respaldan la capacidad tecnica mostrada en los client projects.": "The products belong to the YC Systems ecosystem and support the technical capacity shown in client projects.",
  "Cual de estos proyectos se parece a lo que necesitas?": "Which of these projects looks like what you need?",
  "Elige una ruta y empezamos con una propuesta inicial.": "Choose a path and we start with an initial proposal.",
  "Quiero una tienda": "I want a store",
  "Quiero una web corporativa": "I want a corporate website",
  "Quiero una web de servicios": "I want a services website",
  "Quiero una marca digital": "I want a digital brand",
  "Quiero mantenimiento": "I want maintenance"
});

Object.assign(textTranslations, {
  "4 productos. 5 sitios activos. 1 empresa tecnológica.": "4 Products. 5 Live Websites. 1 Technology Company.",
  "4 productos": "4 Products",
  "5 sitios activos": "5 Live Websites",
  "Dominios de clientes": "Client Domains",
  "República Dominicana - Estados Unidos - Canadá": "Dominican Republic - United States - Canada",
  "E-commerce activo": "Live e-commerce",
  "Web de servicios": "Service website",
  "Web inmobiliaria": "Real estate web",
  "Web corporativa": "Corporate web",
  "Marca de conveniencia": "Convenience brand",
  "Ver sobre YC Systems": "View About YC Systems",
  "Productos de software y sistemas de negocio.": "Software Products & Business Systems.",
  "Mercados": "Markets",
  "Empresa": "Business",
  "Trabajo de clientes": "Client Work",
  "Casos de estudio": "Case Studies",
  "Prueba de producto": "Product Proof",
  "Preparado para clientes locales e internacionales.": "Prepared for local and international clients.",
  "YC Systems no es solo una página de servicios. Es una empresa tecnológica en construcción, con líneas internas, proyectos de clientes reales y una identidad nacida de trabajo, visión y familia.": "YC Systems is not just a services page. It is a technology company being built, with internal lines, real client projects and an identity born from work, visión and family.",
  "YC Systems / Tecnología": "YC Systems / Technology",
  "YC Systems / Como construimos": "YC Systems / How we build",
  "Como construimos": "How we build",
  "Construimos con un proceso claro: analizar, diseñar, entregar y mejorar.": "We build with a clear process: analyze, design, deliver and improve.",
  "No vendemos frameworks. Convertimos problemas operativos en productos digitales claros, medibles y listos para crecer por fases.": "We do not sell frameworks. We turn operational problems into clear, measurable digital products ready to grow by phases.",
  "Un camino claro desde el problema hasta una operación mejor.": "A clear path from the problem to a better operation.",
  "Nexus guía la conversación visual: primero entiende el negocio, luego ordena el flujo y finalmente ayuda a convertirlo en una solución usable.": "Nexus guides the visual conversation: first it understands the business, then it organizes the flow and finally helps turn it into a usable solution.",
  "Diseñamos": "We design",
  "Mejoramos": "We improve",
  "Entendemos el negocio, los usuarios, los puntos de fricción y donde se pierde tiempo, dinero o claridad.": "We understand the business, users, friction points and where time, money or clarity is lost.",
  "Ordenamos pantallas, roles, acciónes y datos para que la solución tenga sentido antes de desarrollar.": "We organize screens, roles, actions and data so the solution makes sense before development.",
  "Creamos la web, sistema, dashboard, app o plataforma con una base funcional, clara y mantenible.": "We create the website, system, dashboard, app or platform with a functional, clear and maintainable base.",
  "Preparamos el proyecto para publicar, presentar, vender u operar con una ruta clara de uso.": "We prepare the project to publish, present, sell or operate with a clear usage path.",
  "Ajustamos contenido, idioma, reportes, pantallas y módulos cuando el negocio crece.": "We adjust content, language, reports, screens and modules when the business grows.",
  "La tecnología queda detrás del resultado: vender mejor, medir mejor, responder más rápido y trabajar con menos caos.": "Technology stays behind the result: sell better, measure better, respond faster and work with less chaos.",
  "Analiza, diseña, construye, entrega y mejora: esa es la forma visual en que YC Systems presenta soluciónes digitales a clientes que quieren operar mejor.": "Analyze, design, build, deliver and improve: that is how YC Systems visually presents digital solutions to clients who want to operate better.",
  "Metodo claro para construir soluciónes reales.": "A clear method for building real solutions.",
  "Stack para negocio": "Business stack",
  "Tecnología para soluciónes reales.": "Technology for real solutions.",
  "Con esta base construimos tiendas, sistemas internos, dashboards, SaaS, apps móviles, pagos, integraciones y automatizaciones.": "With this foundation we build stores, internal systems, dashboards, SaaS, mobile apps, payments, integrations and automations.",
  "Quiero construir algo": "I want to build something",
  "Ver proyectos": "View projects",
  "Soluciones por tecnología": "Solutions by technology",
  "La tecnología se presenta como capacidad de negocio.": "Technology is presented as business capability.",
  "No vendemos una lista de herramientas. Vendemos sistemas que ayudan a vender, organizar, medir, automatizar y crecer.": "We do not sell a list of tools. We sell systems that help sell, organize, measure, automate and grow.",
  "Web y e-commerce": "Web and e-commerce",
  "Páginas, tiendas y catálogos listos para publicar.": "Websites, stores and catalogs ready to publish.",
  "Landing pages, sitios corporativos, catálogos visuales, carrito, productos y pedidos por WhatsApp.": "Landing pages, corporate sites, visual catalogs, cart, products and WhatsApp ordering.",
  "Sistemas internos": "Sistemas internos",
  "Control operativo para equipos y negocios.": "Operational control for teams and businesses.",
  "Clientes, reservas, documentos, pagos, comisiones, tareas, roles y paneles administrativos.": "Customers, reservations, documents, payments, commissions, tasks, roles and admin panels.",
  "Plataformas pensadas para crecer como producto.": "Platforms designed to grow as products.",
  "APIs, multi-tenant, usuarios, permisos, panel admin, flujos por rol y base lista para suscripciones.": "APIs, multi-tenant, users, permissions, admin panel, role-based flows and a base ready for subscriptions.",
  "Apps móviles": "Mobile apps",
  "Experiencias móviles conectadas al negocio.": "Mobile experiences connected to the business.",
  "Apps para clientes, operaciones, entregas, notificaciones y seguimiento desde el telefono.": "Apps for customers, operations, deliveries, notifications and phone-based tracking.",
  "Pagos e integraciones": "Payments and integrations",
  "Conexiones que convierten un sistema en operación real.": "Connections that turn a system into a real operation.",
  "Pagos, mapas, autenticacion, correos, notificaciones y servicios externos cuando el flujo lo necesita.": "Payments, maps, authentication, emails, notifications and external services when the flow needs them.",
  "Automatizacion": "Automation",
  "Menos trabajo manual y mas claridad diaria.": "Less manual work and more daily clarity.",
  "Dashboards, reportes, formularios, seguimiento, estados, alertas y procesos mas faciles de controlar.": "Dashboards, reports, forms, tracking, statuses, alerts and easier-to-control processes.",
  "Nexus como guia": "Nexus as a guide",
  "Analizamos, disenamos, construimos y entregamos.": "We analyze, design, build and deliver.",
  "Nexus ayuda a presentar la tecnología como un proceso claro: entender la operación, diseñar el flujo, construir el producto y entregar una solución lista para mejorar.": "Nexus helps present technology as a clear process: understand the operation, design the flow, build the product and deliver a solution ready to improve.",
  "Analizamos": "We analyze",
  "Disenamos": "We design",
  "Construimos": "We build",
  "Entregamos": "We deliver",
  "Stack usado": "Stack used",
  "Herramientas que ya aparecen en proyectos reales.": "Tools that already appear in real projects.",
  "CleanLoop, BrokerControl y SOC muestran backend, bases de datos, roles, dashboards e integraciones. GhostWear muestra e-commerce, catálogo, carrito y venta por WhatsApp.": "CleanLoop, BrokerControl and SOC show backend, databases, roles, dashboards and integrations. GhostWear shows e-commerce, catalog, cart and WhatsApp sales.",
  "Stack moderno para negocio real.": "Modern stack for real business.",
  "YC Systems / Productos": "YC Systems / Products",
  "Ver ecosistema completo": "View full ecosystem",
  "Plataforma financiera en desarrollo para credit repair, casos, documentos, cartas y portal de clientes.": "Financial platform in development for credit repair, cases, documents, letters and customer portal.",
  "YC Systems puede vender una solución basada en estos productos, adaptar módulos a una industria, crear un MVP nuevo o mantener una plataforma existente con mejoras mensuales.": "YC Systems can sell a solution based on these products, adapt modules to an industry, create a new MVP or maintain an existing platform with monthly improvements.",
  "Dashboard, CRM, roles, reportes, documentos, pagos, mapas, clientes y flujo interno.": "Dashboard, CRM, roles, reports, documents, payments, maps, customers and internal flow.",
  "Completa un brief rápido y YC Systems responde con una propuesta inicial para página web, tienda online, app, sistema interno, dashboard, SaaS, mantenimiento o version multiidioma.": "Complete a quick brief and YC Systems responds with an initial proposal for a website, online store, app, internal system, dashboard, SaaS, maintenance or multilingual version.",
  "Quiero orientación": "I want guidance",
  "Es suficiente enviar la idea en lenguaje simple. YC Systems la convierte en alcance, pantallas, tecnología y próximos pasos.": "It is enough to send the idea in simple language. YC Systems turns it into scope, screens, technology and next steps.",
  "Página profesional": "Professional website",
  "Marca, servicios, contacto, portafolio, SEO básico y version móvil.": "Brand, services, contact, portfolio, basic SEO and mobile version.",
  "Productos, carrito, pedidos, WhatsApp, dominio propio y presentación visual.": "Products, cart, orders, WhatsApp, own domain and visual presentation.",
  "Operacion interna": "Internal operation",
  "Usuarios, roles, clientes, documentos, reservas, dashboards y reportes.": "Users, roles, customers, documents, reservations, dashboards and reports.",
  "Versiones en español e inglés para presentar tu negocio a mas clientes.": "Spanish and English versions to present your business to more customers.",
  "Explica el problema, el tipo de negocio y el resultado que quieres. YC Systems convierte esa idea en una ruta inicial de producto, tecnología y entrega.": "Explain the problem, business type and result you want. YC Systems turns that idea into an initial product, technology and delivery path.",
  "Ver proyectos de clientes": "View client projects",
  "Ver client projects": "View client projects",
  "YC Systems / Client Projects": "YC Systems / Client Projects",
  "YC Systems / About": "YC Systems / About",
  "Technology company": "Technology company",
  "Founder-led technology company": "Founder-led technology company",
  "Product strategy, software development, digital systems and continuous improvement for real business operations.": "Product strategy, software development, digital systems and continuous improvement for real business operations.",
  "YC Systems no es solo una página de servicios. Es una empresa tecnológica en construcción, con líneas internas, proyectos de clientes reales y una identidad nacida de trabajo, visión y familia.": "YC Systems is not just a services page. It is a technology company being built, with internal lines, real client projects and an identity born from work, visión and family.",
  "Los productos pertenecen al ecosistema YC Systems y respaldan la capacidad tecnica mostrada en los proyectos de clientes.": "The products belong to the YC Systems ecosystem and support the technical capability shown in client projects.",
  "CRM inmobiliario para clientes, reservas, documentos, pagos y reportes.": "Real estate CRM for clients, reservations, documents, payments and reports.",
  "Credit Repair Platform con clientes, casos, documentos, portal y compliance.": "Credit Repair Platform with customers, cases, documents, portal and compliance.",
  "Construimos software que convierte operaciones reales en resultados extraordinarios.": "We build software that turns real operations into extraordinary results.",
  "Una visión clara: construir productos de software y soluciónes digitales con ejecución real.": "A clear visión: build software products and digital solutions with real execution.",
  "Nuestra misión": "Our mission",
  "Nuestra visión": "Our visión",
  "La meta es crear líneas internas, verticales por industria y client projects que puedan crecer en Dominican Republic, United States y Canadá.": "The goal is to create internal lines, industry verticals and client projects that can grow in the Dominican Republic, the United States and Canada.",
  "La meta es crear líneas internas, verticales por industria y proyectos de clientes que puedan crecer en República Dominicana, Estados Unidos y Canadá.": "The goal is to create internal lines, industry verticals and client projects that can grow in the Dominican Republic, the United States and Canada.",
  "YC Systems ya muestra líneas internas, client projects, repositorios públicos y privados, documentacion tecnica y un proceso claro para convertir nuevas ideas en activos digitales.": "YC Systems already shows internal lines, client projects, public and private repositories, technical documentation and a clear process to turn new ideas into digital assets.",
  "YC Systems ya muestra líneas internas, proyectos de clientes, repositorios públicos y privados, documentacion tecnica y un proceso claro para convertir nuevas ideas en activos digitales.": "YC Systems already shows internal lines, client projects, public and private repositories, technical documentation and a clear process to turn new ideas into digital assets.",
  "Productos funcionales": "Functional products"
});

Object.assign(textTranslations, {
  "Soluciones por nivel": "Solutions by level",
  "Formas de construir": "Ways to build",
  "Soluciones según la etapa de tu negocio.": "Solutions for your business stage.",
  "YC Systems orienta cada proyecto por etapa: presencia, venta, operación, portal o mejora continua. La idea es construir una base clara que pueda crecer sin improvisación.": "YC Systems guides each project by stage: presence, sales, operations, portal or continuous improvement. The idea is to build a clear base that can grow without improvisation.",
  "Empieza pequeño, pero con una base lista para crecer.": "Start small, but with a base ready to grow.",
  "Una página web, una tienda o un portal no se cotizan igual. YC Systems organiza cada proyecto por fases para que el cliente compre claridad, no improvisacion.": "A website, store, or portal is not quoted the same way. YC Systems organizes each project by phases so the client buys clarity, not improvisation.",
  "Web profesional": "Professional website",
  "Presencia digital que genera confianza": "Digital presence that builds trust",
  "Ideal para asesores, marcas personales, servicios, empresas locales y negocios que necesitan verse serios.": "Ideal for advisors, personal brands, services, local companies, and businesses that need to look serious.",
  "Dominio y estructura clara": "Domain and clear structure",
  "Contacto directo": "Direct contact",
  "Movil y SEO básico": "Mobile and basic SEO",
  "Tienda / catálogo": "Store / catalog",
  "Productos listos para vender mejor": "Products ready to sell better",
  "Para marcas que necesitan catálogo visual, carrito, pedidos por WhatsApp o flujo e-commerce.": "For brands that need a visual catalog, cart, WhatsApp orders, or an e-commerce flow.",
  "Productos y categorías": "Products and categories",
  "Pedido simple": "Simple ordering",
  "Experiencia móvil": "Mobile experience",
  "Sistema interno": "Internal system",
  "Orden para operar sin depender de Excel": "Operational order without depending on Excel",
  "Para negocios que manejan clientes, tareas, incidencias, documentos, reservas o reportes.": "For businesses that manage clients, tasks, incidents, documents, reservations, or reports.",
  "Login y roles": "Login and roles",
  "Panel administrativo": "Admin panel",
  "Reportes y evidencias": "Reports and evidence",
  "Portal digital": "Digital portal",
  "Clientes, residentes o equipo en un solo lugar": "Clients, residents, or team in one place",
  "Perfecto para empresas que quieren acceso privado, seguimiento, documentos y procesos por módulo.": "Perfect for companies that want private access, tracking, documents, and module-based processes.",
  "Acceso clientes": "Client access",
  "Modulos por fase": "Modules by phase",
  "Base lista para crecer": "Base ready to grow",
  "La web no se queda abandonada": "The website does not get abandoned",
  "Cambios, contenido, mejoras, idioma, soporte y nuevas pantallas cuando el negocio crece.": "Changes, content, improvements, language, support, and new screens as the business grows.",
  "Actualizaciones": "Updates",
  "Mejoras continuas": "Continuous improvements",
  "Acompanamiento mensual": "Monthly support",
  "Referencia comercial:": "Commercial reference:",
  "Los sitios profesionales se trabajan por alcance. Los sistemas, portales y SaaS se cotizan por módulos, fases y nivel de automatización.": "Professional sites are scoped by deliverables. Systems, portals, and SaaS are quoted by modules, phases, and automation level.",
  "Solicitar orientación": "Request guidance",
  "Asesor inmobiliario": "Real estate advisor",
  "Web profesional para asesorar compradores que quieren adquirir propiedad en República Dominicana.": "Professional website to advise buyers who want to acquire property in the Dominican Republic.",
  "presentar con confianza un servicio de asesoria para comprar propiedad en RD.": "present an advisory service for buying property in the DR with trust.",
  "web profesional, mensaje claro, contacto directo y estructura comercial.": "professional website, clear message, direct contact, and commercial structure.",
  "Tienda online o catálogo": "Online store or catalog",
  "Portal para clientes": "Client portal",
  "Web o presencia inicial": "Website or initial presence",
  "Sistema o portal por fases": "System or portal by phases"
});

Object.assign(textTranslations, {
  "YC Systems / Como trabajamos": "YC Systems / How we build",
  "Método YC Systems": "YC Systems Method",
  "Convertimos procesos reales en sistemas claros, útiles y listos para crecer.": "We turn real processes into clear, useful systems ready to grow.",
  "La tecnología importa, pero el cliente compra control, automatización, claridad, operación y resultados. Ese es el enfoque de YC Systems.": "Technology matters, but the client buys control, automation, clarity, operation and results. That is the YC Systems approach.",
  "Iniciar proyecto": "Start project",
  "Ver casos reales": "View real cases",
  "Control": "Control",
  "Escalabilidad": "Scalability",
  "Resultados": "Results",
  "Proceso profesional": "Professional process",
  "Un camino claro desde el problema hasta la solución.": "A clear path from problem to solution.",
  "No empezamos vendiendo herramientas. Primero entendemos la operación, luego disenamos el flujo correcto y construimos una solución que el negocio pueda usar.": "We do not start by selling tools. First we understand the operation, then we design the right flow and build a solution the business can use.",
  "Diagnostico": "Diagnosis",
  "Entendemos el negocio, el problema, los usuarios, los procesos repetidos y donde se pierde tiempo o dinero.": "We understand the business, the problem, the users, repeated processes and where time or money is being lost.",
  "Diseño del flujo": "Flow design",
  "Ordenamos pantallas, roles, acciónes, datos y pasos para que la solución sea clara antes de desarrollar.": "We organize screens, roles, actions, data and steps so the solution is clear before development.",
  "Construccion": "Build",
  "Creamos la web, sistema, dashboard, app o plataforma con una base funcional y mantenible.": "We create the website, system, dashboard, app or platform with a functional and maintainable base.",
  "Integraciones": "Integrations",
  "Conectamos pagos, WhatsApp, formularios, mapas, correo, automatizaciones o servicios externos si el flujo lo necesita.": "We connect payments, WhatsApp, forms, maps, email, automations or external services if the flow needs them.",
  "Entrega": "Delivery",
  "Preparamos el proyecto para publicar, presentar, vender, operar o seguir mejorando por fases.": "We prepare the project to publish, present, sell, operate or keep improving by phases.",
  "Mejora continua": "Continuous improvement",
  "Mantenimiento, contenido, nuevas pantallas, idioma, reportes y ajustes cuando el negocio crece.": "Maintenance, content, new screens, language, reports and adjustments as the business grows.",
  "Lo que realmente compras": "What you really buy",
  "No es solo código. Es una operación mas clara.": "It is not just code. It is a clearer operation.",
  "YC Systems usa tecnología moderna, pero la presenta como valor de negocio: vender mejor, medir mejor, responder mas rápido y trabajar con menos caos.": "YC Systems uses modern technology, but presents it as business value: sell better, measure better, respond faster and work with less chaos.",
  "Clientes, pedidos, reservas, tareas o ventas en un lugar claro.": "Customers, orders, reservations, tasks or sales in one clear place.",
  "Menos tareas repetidas y mas procesos guiados.": "Fewer repeated tasks and more guided processes.",
  "Confianza": "Trust",
  "Una presencia digital que se ve seria para clientes e inversionistas.": "A digital presence that looks serious for clients and investors.",
  "Crecimiento": "Growth",
  "Base preparada para nuevas funciones, idioma, pagos y mantenimiento.": "A base prepared for new features, language, payments and maintenance.",
  "Nexus ayuda a explicar el proceso sin hacerlo complicado.": "Nexus helps explain the process without making it complicated.",
  "Analiza, ordena, construye y entrega: esa es la forma visual en que YC Systems presenta soluciónes digitales a clientes que quieren operar mejor.": "Analyze, organize, build and deliver: that is the visual way YC Systems presents digital solutions to clients who want to operate better.",
  "Ecosistema YC Systems": "YC Systems Ecosystem",
  "Productos de software creados para operaciones reales.": "Software products created for real operations.",
  "CleanLoop, SOC y BrokerControl son activos propios de YC Systems. Cada producto nace de un problema operativo claro y puede abrir oportunidades comerciales por industria.": "CleanLoop, SOC and BrokerControl are YC Systems owned assets. Each product comes from a clear operational problem and can open commercial opportunities by industry.",
  "Hablar de una solución": "Talk about a solution",
  "Activos propios": "Owned assets",
  "El valor de YC Systems vive en productos que pueden crecer.": "YC Systems' value lives in products that can grow.",
  "Estos productos muestran capacidad de construir plataformas, dashboards, roles, flujos de negocio, interfaces móviles y sistemas listos para evolucionar.": "These products show the ability to build platforms, dashboards, roles, business flows, mobile interfaces and systems ready to evolve.",
  "Coordina recogida, entrega y rutas.": "Coordinates pickup, delivery and routes.",
  "Separa experiencia de cliente, driver y admin.": "Separates customer, driver and admin experiences.",
  "Preparada para pilotos y alianzas.": "Prepared for pilots and partnerships.",
  "Ver CleanLoop": "View CleanLoop",
  "Centro operativo comercial para equipos inmobiliarios que necesitan visibilidad sobre inventario, reservas, separaciones, legal y reportes.": "Commercial operations center for real estate teams that need visibility over inventory, reservations, separations, legal and reports.",
  "Dashboard ejecutivo para decisiones rapidas.": "Executive dashboard for faster decisions.",
  "Control de reservas, separaciones y estados.": "Control of reservations, separations and statuses.",
  "Base para constructoras y salas de ventas.": "Base for builders and sales rooms.",
  "Ver SOC": "View SOC",
  "CRM inmobiliario para organizar clientes, pipeline, documentos, pagos, comisiones, agenda y seguimiento comercial.": "Real estate CRM to organize clients, pipeline, documents, payments, commissions, schedule and commercial follow-up.",
  "Cliente 360 y pipeline de oportunidades.": "Customer 360 and opportunity pipeline.",
  "Documentos, pagos y reportes en un flujo.": "Documents, payments and reports in one flow.",
  "Ideal para brokers y equipos inmobiliarios.": "Ideal for brokers and real estate teams.",
  "Ver BrokerControl": "View BrokerControl",
  "Proximo vertical en desarrollo.": "Next vertical in development.",
  "CreditPilot queda como plataforma futura para credit repair, casos, documentos, cartas, portal de clientes y educacion financiera.": "CreditPilot remains a future platform for credit repair, cases, documents, letters, customer portal and financial education.",
  "Líneas internas para operaciones reales.": "Internal lines for real operations.",
  "Sitios reales entregados para clientes.": "Real websites delivered for clients.",
  "GhostWear, Antony Real Estate, LPS Company, LucianoWash y Snackeria muestran e-commerce, presencia corporativa, servicios y marcas digitales publicadas.": "GhostWear, Antony Real Estate, LPS Company, LucianoWash and Snackeria show e-commerce, corporate presence, services and published digital brands.",
  "E-commerce activo": "Active e-commerce",
  "Web de servicios": "Service website",
  "Marca de conveniencia": "Convenience brand",
  "Piloto y alianzas": "Pilot & Partnerships",
  "Producto listo": "Product Ready",
  "Próximamente": "Coming Soon",
  "YC Systems / Nosotros": "YC Systems / About",
  "Empresa tecnológica": "Technology company",
  "Una empresa enfocada en productos de software, SaaS y soluciónes digitales para negocios que necesitan operar mejor, vender con mas confianza y crecer con tecnología.": "A company focused on software products, SaaS and digital solutions for businesses that need to operate better, sell with more trust and grow with technology.",
  "Software Products. Business Systems. Real Results.": "Software Products. Business Systems. Real Results.",
  "Productos de software. Sistemas de negocio. Resultados reales.": "Software Products. Business Systems. Real Results.",
  "Misión": "Mission",
  "Visión": "Visión",
  "Una base clara para clientes, socios e inversionistas.": "A clear foundation for clients, partners and investors.",
  "La marca se construye alrededor de líneas internas, casos reales y una forma de trabajar orientada a resultados. El objetivo no es solo entregar pantallas: es construir activos digitales que puedan mantenerse, venderse y evolucionar.": "The brand is built around internal lines, real cases and a results-oriented way of working. The goal is not just to deliver screens: it is to build digital assets that can be maintained, sold and evolved.",
  "Enfoque": "Focus",
  "Líneas internas, client projects, mantenimiento y soluciónes para operaciones reales.": "Internal lines, client projects, maintenance and solutions for real operations.",
  "Líneas internas, proyectos de clientes, mantenimiento y soluciónes para operaciones reales.": "Internal lines, client projects, maintenance and solutions for real operations.",
  "Valores": "Values",
  "La forma de construir importa.": "The way we build matters.",
  "Founder": "Founder",
  "Founder & CEO de YC Systems. Su enfoque combina estrategia de producto, desarrollo de software, sistemas digitales y mejora continua para operaciones reales.": "Founder & CEO of YC Systems. His approach combines product strategy, software development, digital systems and continuous improvement for real operations.",
  "YC Systems nace de construir, probar y mejorar soluciónes con problemas reales delante: ventas, reservas, clientes, rutas, dashboards, e-commerce y automatización.": "YC Systems was born from building, testing and improving solutions around real problems: sales, reservations, clients, routes, dashboards, e-commerce and automation.",
  "Identidad visual": "Visual identity",
  "Nexus es el constructor digital de YC Systems.": "Nexus is the digital builder of YC Systems.",
  "Nexus representa nuestra forma de explicar tecnología sin complicarla: analizar, diseñar, automatizar y entregar soluciónes digitales que ayudan a las empresas a operar mejor.": "Nexus represents our way of explaining technology without complicating it: analyze, design, automate and deliver digital solutions that help companies operate better.",
  "Sitios y sistemas que ordenan ventas y operaciones.": "Websites and systems that organize sales and operations.",
  "Diseñamos webs, dashboards y plataformas internas para negocios que necesitan vender mejor, operar con más claridad y crecer por fases.": "We design websites, dashboards and internal platforms for businesses that need to sell better, operate with more clarity and grow in phases.",
  "Solicitar diagnóstico": "Request assessment",
  "Ver casos activos": "View active cases",
  "5 sitios activos": "5 active sites",
  "líneas internas": "internal lines",
  "Respuesta inicial en 24h hábiles": "Initial response in 24 business hours",
  "respuesta inicial": "initial response",
  "Software empresarial para negocios reales": "Enterprise software for real businesses",
  "Software que ayuda a vender, operar y escalar.": "Software that helps you sell, operate and scale.",
  "YC Systems LLC construye infraestructura digital para empresas que necesitan páginas web serias, CRM, dashboards, portales, automatizaciones y plataformas SaaS con una ruta clara de negocio.": "YC Systems LLC builds digital infrastructure for companies that need serious websites, CRM, dashboards, portals, automations and SaaS platforms with a clear business path.",
  "Solicitar propuesta": "Request proposal",
  "YC Systems LLC · New York · Software Development Company · USA / RD / Canadá": "YC Systems LLC · New York · Software Development Company · USA / DR / Canada",
  "Por qué empresas eligen YC Systems": "Why companies choose YC Systems",
  "Una empresa de software preparada para vender, construir y sostener.": "A software company ready to sell, build and support.",
  "No vendemos solo pantallas bonitas. Construimos activos digitales con criterio comercial, arquitectura moderna, soporte continuo y una ruta clara desde la primera conversación hasta el lanzamiento.": "We do not sell pretty screens only. We build digital assets with commercial thinking, modern architecture, ongoing support and a clear path from the first conversation to launch.",
  "Empresa constituida": "Formed company",
  "YC Systems LLC opera como compañía registrada en New York, con dominio, correo corporativo y presencia pública.": "YC Systems LLC operates as a company formed in New York, with domain, corporate email and public presence.",
  "Arquitectura moderna": "Modern architecture",
  "Diseño responsive, bases escalables, APIs, dashboards, datos y módulos pensados para crecer por fases.": "Responsive design, scalable foundations, APIs, dashboards, data and modules designed to grow in phases.",
  "Soporte a largo plazo": "Long-term support",
  "Mantenimiento, mejoras, documentación y acompañamiento para que el proyecto no se quede abandonado.": "Maintenance, improvements, documentation and support so the project is not left behind.",
  "Enfoque comercial": "Commercial focus",
  "Cada entrega debe ayudar a vender mejor, operar con menos caos o tomar decisiones con más claridad.": "Every delivery should help sell better, operate with less chaos or make clearer decisions.",
  "Mercado bilingüe": "Bilingual market",
  "Comunicación y experiencias en español e inglés para empresas en República Dominicana, Estados Unidos y Canadá.": "Communication and experiences in Spanish and English for companies in the Dominican Republic, United States and Canada.",
  "Prueba real": "Real proof",
  "Sitios publicados, productos en construcción y casos visibles que respaldan la capacidad de ejecución.": "Published sites, products in progress and visible cases that support execution capacity.",
  "Qué puedes contratar ahora": "What you can hire now",
  "Paquetes claros para empezar sin improvisar.": "Clear packages to start without improvising.",
  "El primer objetivo es definir el problema correcto, entregar una primera fase útil y dejar una base que pueda evolucionar.": "The first goal is to define the right problem, deliver a useful first phase and leave a foundation that can evolve.",
  "Web comercial premium": "Premium commercial website",
  "Para negocios que necesitan verse confiables, explicar su oferta y convertir visitas en contactos.": "For businesses that need to look trustworthy, explain their offer and turn visits into contacts.",
  "Landing o sitio completo": "Landing page or full site",
  "Copy comercial": "Commercial copy",
  "Diseño responsive": "Responsive design",
  "SEO base": "Base SEO",
  "Pedir propuesta web": "Request web proposal",
  "Sistema interno o CRM": "Internal system or CRM",
  "Para operaciones que pierden control entre WhatsApp, Excel, memoria y tareas repetidas.": "For operations losing control between WhatsApp, Excel, memory and repeated tasks.",
  "Usuarios y roles": "Users and roles",
  "Pipeline o estados": "Pipeline or statuses",
  "Formularios y reportes": "Forms and reports",
  "Panel administrativo": "Admin panel",
  "Diagnosticar operación": "Diagnose operation",
  "Dashboard ejecutivo": "Executive dashboard",
  "Para empresas que necesitan medir ventas, reservas, tareas, casos o indicadores sin perseguir información.": "For companies that need to measure sales, bookings, tasks, cases or indicators without chasing information.",
  "Métricas clave": "Key metrics",
  "Visualización limpia": "Clean visualization",
  "Filtros y estados": "Filters and statuses",
  "Reportes operativos": "Operational reports",
  "Diseñar dashboard": "Design dashboard",
  "SaaS MVP por fases": "Phased SaaS MVP",
  "Para ideas de producto que necesitan una primera versión clara antes de invertir en una plataforma grande.": "For product ideas that need a clear first version before investing in a large platform.",
  "Alcance inicial": "Initial scope",
  "Modelo de usuarios": "User model",
  "Módulos mínimos": "Minimum modules",
  "Ruta de lanzamiento": "Launch path",
  "Construir MVP": "Build MVP",
  "Tecnología aplicada a negocio": "Technology applied to business",
  "Stack moderno, presentado como valor empresarial.": "Modern stack, presented as business value.",
  "La tecnología importa cuando mejora ventas, control, velocidad, seguridad y mantenimiento. YC Systems combina herramientas modernas con una ejecución entendible para clientes.": "Technology matters when it improves sales, control, speed, security and maintenance. YC Systems combines modern tools with execution clients can understand.",
  "Recibe una propuesta clara para tu próximo sistema.": "Get a clear proposal for your next system.",
  "Cuéntanos qué quieres vender, organizar o automatizar. YC Systems responde con una ruta inicial: alcance, primera fase, entregables y recomendación técnica.": "Tell us what you want to sell, organize or automate. YC Systems responds with an initial route: scope, first phase, deliverables and technical recommendation.",
  "Software development company constituida en New York. Construimos webs, sistemas internos, CRM, dashboards, automatizaciones y plataformas SaaS para negocios reales.": "Software development company formed in New York. We build websites, internal systems, CRM, dashboards, automations and SaaS platforms for real businesses.",
  "New York Domestic LLC": "New York Domestic LLC",
  "Operación remota e internacional": "Remote and international operation",
  "Información corporativa": "Corporate information",
  "Servicios": "Services",
  "Web comercial premium": "Premium commercial website",
  "Dashboard ejecutivo": "Executive dashboard",
  "Mercados y enlaces": "Markets and links"
  ,
  "Presencia y venta": "Presence and sales",
  "Seguimiento comercial": "Commercial follow-up",
  "Datos y control": "Data and control",
  "Producto escalable": "Scalable product",
  "Agendar discovery": "Book discovery",
  "New York LLC": "New York LLC",
  "Software por fases": "Phased software",
  "Proyectos en producción": "Projects in production",
  "USA + RD + Canadá": "USA + DR + Canada",
  "Resultados que compran los clientes": "Outcomes clients buy",
  "Ayudamos a negocios a vender más, ahorrar tiempo y operar con menos caos.": "We help businesses sell more, save time and operate with less chaos.",
  "Vender más": "Sell more",
  "Webs, landings y catálogos que explican la oferta y facilitan el contacto.": "Websites, landing pages and catalogs that explain the offer and make contact easier.",
  "Ahorrar tiempo": "Save time",
  "Automatización de tareas repetidas, estados, reportes y seguimiento.": "Automation of repeated tasks, statuses, reports and follow-up.",
  "Organizar operaciones": "Organize operations",
  "CRM, portales, dashboards y sistemas internos conectados al proceso real.": "CRM, portals, dashboards and internal systems connected to the real process.",
  "Decidir mejor": "Decide better",
  "Datos visibles para dirección, ventas, soporte, operaciones y crecimiento.": "Visible data for leadership, sales, support, operations and growth.",
  "Cómo construimos": "How we build",
  "Un proceso claro reduce riesgo y acelera decisiones.": "A clear process reduces risk and speeds up decisions.",
  "YC Systems convierte una idea o problema operativo en alcance, arquitectura, interfaz, desarrollo, lanzamiento y soporte.": "YC Systems turns an idea or operational problem into scope, architecture, interface, development, launch and support.",
  "Entendemos el negocio, el problema, los usuarios, prioridades y resultado esperado.": "We understand the business, problem, users, priorities and expected result.",
  "Arquitectura": "Architecture",
  "Definimos módulos, datos, roles, integraciones, fases y alcance inicial.": "We define modules, data, roles, integrations, phases and initial scope.",
  "Diseño": "Design",
  "Convertimos el flujo en pantallas claras, responsive y enfocadas en conversión o uso diario.": "We turn the flow into clear, responsive screens focused on conversion or daily use.",
  "Desarrollo": "Development",
  "Construimos la primera fase con estructura mantenible y preparada para evolucionar.": "We build the first phase with a maintainable structure ready to evolve.",
  "Lanzamiento": "Launch",
  "Probamos, publicamos, documentamos y dejamos el proyecto listo para operar.": "We test, publish, document and leave the project ready to operate.",
  "Mantenimiento, mejoras, nuevas fases y acompañamiento para que el sistema crezca.": "Maintenance, improvements, new phases and support so the system can grow.",
  "Algunas líneas internas de YC Systems están disponibles por invitación, piloto o despliegue privado para proteger propiedad intelectual y procesos en desarrollo.": "Some YC Systems internal lines are available by invitation, pilot or private deployment to protect intellectual property and processes in development."
});

const spanishTextTranslations = Object.entries(textTranslations).reduce((translations, [spanish, english]) => {
  if (!translations[english]) translations[english] = spanish;
  return translations;
}, {});

const englishTextTranslations = {
  "Products": "Productos",
  "Client Projects": "Proyectos de clientes",
  "Technology": "Tecnología",
  "About": "Nosotros",
  "Contact": "Contacto",
  "Websites and systems that organize sales and operations.": "Sitios y sistemas que ordenan ventas y operaciones.",
  "We design websites, dashboards and internal platforms for businesses that need to sell better, operate with more clarity and grow in phases.": "Diseñamos webs, dashboards y plataformas internas para negocios que necesitan vender mejor, operar con más claridad y crecer por fases.",
  "Request assessment": "Solicitar diagnóstico",
  "View active cases": "Ver casos activos",
  "5 active sites": "5 sitios activos",
  "internal lines": "líneas internas",
  "Initial response in 24 business hours": "Respuesta inicial en 24h hábiles",
  "initial response": "respuesta inicial",
  "Software Products & Business Systems": "Productos de software y sistemas de negocio",
  "We build software products that help companies operate, grow and scale.": "Construimos productos de software que ayudan a las empresas a operar, crecer y escalar.",
  "YC Systems builds software that solves real business problems.": "YC Systems construye software que resuelve problemas reales de negocio.",
  "YC Systems in Numbers": "YC Systems en numeros",
  "4 Products. 4 Client Projects. 3 Active Domains. 1 Technology Company.": "4 productos. 4 proyectos de clientes. 3 dominios activos. 1 empresa tecnológica.",
  "About YC Systems": "Sobre YC Systems",
  "Mission, vision and values built around software products.": "Misión, visión y valores construidos alrededor de productos de software.",
  "Software Products": "Productos de software",
  "Software products built around real operational problems.": "Productos de software construidos alrededor de problemas operativos reales.",
  "Product Ecosystem": "Ecosistema de productos",
  "Product company": "Empresa de productos",
  "Client Work": "Trabajo de clientes",
  "Case Studies": "Casos de estudio",
  "Product Proof": "Prueba de producto",
  "Who we are": "Quienes somos",
  "Core Values": "Valores principales",
  "YC Systems turns real operations into digital products.": "YC Systems convierte operaciones reales en productos digitales.",
  "4 Products. 5 Live Websites. 1 Technology Company.": "4 productos. 5 sitios activos. 1 empresa tecnológica.",
  "4 Products": "4 productos",
  "5 Live Websites": "5 sitios activos",
  "Client Domains": "Dominios de clientes",
  "Dominican Republic - United States - Canada": "República Dominicana - Estados Unidos - Canadá",
  "Live e-commerce": "E-commerce activo",
  "Service website": "Web de servicios",
  "Real estate web": "Web inmobiliaria",
  "Corporate web": "Web corporativa",
  "Convenience brand": "Marca de conveniencia",
  "View About YC Systems": "Ver sobre YC Systems",
  "Software Products & Business Systems.": "Productos de software y sistemas de negocio.",
  "Markets": "Mercados",
  "Business": "Empresa",
  "Documents": "Documentos",
  "Privacy": "Privacidad",
  "Terms": "Términos",
  "YC Systems is not just a services page. It is a technology company being built, with internal lines, real client projects and an identity born from work, visión and family.": "YC Systems no es solo una página de servicios. Es una empresa tecnológica en construcción, con líneas internas, proyectos de clientes reales y una identidad nacida de trabajo, visión y familia.",
  "The N has a special meaning: Nancy, the emotional origin of this visión and part of the brand story.": "La N tiene un significado especial: Nancy, origen emocional de esta visión y parte de la historia de la marca.",
  "YC Systems / Technology": "YC Systems / Tecnología",
  "YC Systems / How we build": "YC Systems / Como construimos",
  "How we build": "Como construimos",
  "Meet Nexus": "Conoce a Nexus",
  "The visual assistant of YC Systems.": "El asistente visual de YC Systems.",
  "Nexus represents how we build: analyze, design, automate and deliver digital products that help companies operate, grow and scale.": "Nexus representa nuestra forma de construir: analizar, diseñar, automatizar y entregar productos digitales que ayudan a las empresas a operar, crecer y escalar.",
  "Construction": "Construcción",
  "Growth": "Crecimiento",
  "Trust": "Confianza",
  "The identity combines a crisp logo, Nexus as a visual guide and real products that prove execution. The public website presents the brand ready for clients, partners and investors.": "La identidad combina un logo nítido, Nexus como guía visual y productos reales que prueban ejecución. La web pública muestra la marca lista para clientes, socios e inversionistas.",
  "Product": "Producto",
  "Operation": "Operación",
  "We build with a clear process: analyze, design, deliver and improve.": "Construimos con un proceso claro: analizar, diseñar, entregar y mejorar.",
  "We do not sell frameworks. We turn operational problems into clear, measurable digital products ready to grow by phases.": "No vendemos frameworks. Convertimos problemas operativos en productos digitales claros, medibles y listos para crecer por fases.",
  "A clear path from the problem to a better operation.": "Un camino claro desde el problema hasta una operación mejor.",
  "Nexus guides the visual conversation: first it understands the business, then it organizes the flow and finally helps turn it into a usable solution.": "Nexus guía la conversación visual: primero entiende el negocio, luego ordena el flujo y finalmente ayuda a convertirlo en una solución usable.",
  "We improve": "Mejoramos",
  "We understand the business, users, friction points and where time, money or clarity is lost.": "Entendemos el negocio, los usuarios, los puntos de fricción y donde se pierde tiempo, dinero o claridad.",
  "We organize screens, roles, actions and data so the solution makes sense before development.": "Ordenamos pantallas, roles, acciónes y datos para que la solución tenga sentido antes de desarrollar.",
  "We create the website, system, dashboard, app or platform with a functional, clear and maintainable base.": "Creamos la web, sistema, dashboard, app o plataforma con una base funcional, clara y mantenible.",
  "We prepare the project to publish, present, sell or operate with a clear usage path.": "Preparamos el proyecto para publicar, presentar, vender u operar con una ruta clara de uso.",
  "We adjust content, language, reports, screens and modules when the business grows.": "Ajustamos contenido, idioma, reportes, pantallas y módulos cuando el negocio crece.",
  "Technology stays behind the result: sell better, measure better, respond faster and work with less chaos.": "La tecnología queda detrás del resultado: vender mejor, medir mejor, responder más rápido y trabajar con menos caos.",
  "Analyze, design, build, deliver and improve: that is how YC Systems visually presents digital solutions to clients who want to operate better.": "Analiza, diseña, construye, entrega y mejora: esa es la forma visual en que YC Systems presenta soluciónes digitales a clientes que quieren operar mejor.",
  "A clear method for building real solutions.": "Metodo claro para construir soluciónes reales.",
  "Business stack": "Stack para negocio",
  "Technology for real solutions.": "Tecnología para soluciónes reales.",
  "With this foundation we build stores, internal systems, dashboards, SaaS, mobile apps, payments, integrations and automations.": "Con esta base construimos tiendas, sistemas internos, dashboards, SaaS, apps móviles, pagos, integraciones y automatizaciones.",
  "I want to build something": "Quiero construir algo",
  "View projects": "Ver proyectos",
  "Solutions by technology": "Soluciones por tecnología",
  "Technology is presented as business capability.": "La tecnología se presenta como capacidad de negocio.",
  "We do not sell a list of tools. We sell systems that help sell, organize, measure, automate and grow.": "No vendemos una lista de herramientas. Vendemos sistemas que ayudan a vender, organizar, medir, automatizar y crecer.",
  "Web and e-commerce": "Web y e-commerce",
  "Websites, stores and catalogs ready to publish.": "Páginas, tiendas y catálogos listos para publicar.",
  "Landing pages, corporate sites, visual catalogs, cart, products and WhatsApp ordering.": "Landing pages, sitios corporativos, catálogos visuales, carrito, productos y pedidos por WhatsApp.",
  "Sistemas internos": "Sistemas internos",
  "Operational control for teams and businesses.": "Control operativo para equipos y negocios.",
  "Customers, reservations, documents, payments, commissions, tasks, roles and admin panels.": "Clientes, reservas, documentos, pagos, comisiones, tareas, roles y paneles administrativos.",
  "Platforms designed to grow as products.": "Plataformas pensadas para crecer como producto.",
  "APIs, multi-tenant, users, permissions, admin panel, role-based flows and a base ready for subscriptions.": "APIs, multi-tenant, usuarios, permisos, panel admin, flujos por rol y base lista para suscripciones.",
  "Mobile apps": "Apps móviles",
  "Mobile experiences connected to the business.": "Experiencias móviles conectadas al negocio.",
  "Apps for customers, operations, deliveries, notifications and phone-based tracking.": "Apps para clientes, operaciones, entregas, notificaciones y seguimiento desde el telefono.",
  "Payments and integrations": "Pagos e integraciones",
  "Connections that turn a system into a real operation.": "Conexiones que convierten un sistema en operación real.",
  "Payments, maps, authentication, emails, notifications and external services when the flow needs them.": "Pagos, mapas, autenticacion, correos, notificaciones y servicios externos cuando el flujo lo necesita.",
  "Automation": "Automatizacion",
  "Less manual work and more daily clarity.": "Menos trabajo manual y mas claridad diaria.",
  "Dashboards, reports, forms, tracking, statuses, alerts and easier-to-control processes.": "Dashboards, reportes, formularios, seguimiento, estados, alertas y procesos mas faciles de controlar.",
  "Nexus as a guide": "Nexus como guia",
  "We analyze, design, build and deliver.": "Analizamos, disenamos, construimos y entregamos.",
  "Nexus helps present technology as a clear process: understand the operation, design the flow, build the product and deliver a solution ready to improve.": "Nexus ayuda a presentar la tecnología como un proceso claro: entender la operación, diseñar el flujo, construir el producto y entregar una solución lista para mejorar.",
  "We analyze": "Analizamos",
  "We design": "Disenamos",
  "We build": "Construimos",
  "We deliver": "Entregamos",
  "Stack used": "Stack usado",
  "Tools that already appear in real projects.": "Herramientas que ya aparecen en proyectos reales.",
  "CleanLoop, BrokerControl and SOC show backend, databases, roles, dashboards and integrations. GhostWear shows e-commerce, catalog, cart and WhatsApp sales.": "CleanLoop, BrokerControl y SOC muestran backend, bases de datos, roles, dashboards e integraciones. GhostWear muestra e-commerce, catálogo, carrito y venta por WhatsApp.",
  "Modern stack for real business.": "Stack moderno para negocio real.",
  "View full ecosystem": "Ver ecosistema completo",
  "Financial platform in development for credit repair, cases, documents, letters and customer portal.": "Plataforma financiera en desarrollo para credit repair, casos, documentos, cartas y portal de clientes.",
  "I want guidance": "Quiero orientación",
  "Professional website": "Página profesional",
  "Internal operation": "Operacion interna",
  "YC Systems / Client Projects": "YC Systems / Proyectos de clientes",
  "YC Systems / About": "YC Systems / Nosotros",
  "Technology company": "Empresa tecnológica",
  "Founder-led technology company": "Empresa tecnológica liderada por su fundador",
  "View client projects": "Ver proyectos de clientes",
  "Product strategy, software development, digital systems and continuous improvement for real business operations.": "Estrategia de producto, desarrollo de software, sistemas digitales y mejora continua para operaciones reales.",
  "The products belong to the YC Systems ecosystem and support the technical capability shown in client projects.": "Los productos pertenecen al ecosistema YC Systems y respaldan la capacidad tecnica mostrada en los proyectos de clientes.",
  "Real estate CRM for clients, reservations, documents, payments and reports.": "CRM inmobiliario para clientes, reservas, documentos, pagos y reportes.",
  "Credit Repair Platform with customers, cases, documents, portal and compliance.": "Credit Repair Platform con clientes, casos, documentos, portal y compliance.",
  "We build software that turns real operations into extraordinary results.": "Construimos software que convierte operaciones reales en resultados extraordinarios."
};

Object.assign(textTranslations, {
  "Productos de software y sistemas de negocio": "Software products and business systems",
  "Construimos productos de software que ayudan a las empresas a operar, crecer y escalar.": "We build software products that help companies operate, grow and scale.",
  "Desarrollamos productos SaaS, plataformas operativas y soluciónes digitales que ayudan a empresas a crecer, vender mejor y operar con mas control.": "We develop SaaS products, operational platforms and digital solutions that help businesses grow, sell better and operate with more control.",
  "Piloto y alianzas": "Pilot and partnerships",
  "Producto listo": "Product ready",
  "Próximamente": "Coming soon",
  "Sitios reales entregados para clientes.": "Real websites delivered for clients.",
  "GhostWear, Antony Real Estate, LPS Company, LucianoWash y Snackeria muestran e-commerce, presencia corporativa, servicios y marcas digitales publicadas.": "GhostWear, Antony Real Estate, LPS Company, LucianoWash and Snackeria show published e-commerce, corporate presence, services and digital brands.",
  "Quiero algo como esto": "I want something like this",
  "Casos de cliente con sitios activos.": "Client cases with active websites.",
  "Cada caso muestra una captura real, dominio activo, problema, solución y que puede contratar una empresa similar.": "Each case shows a real screenshot, active domain, problem, solution and what a similar company can hire.",
  "Productos de software creados para operaciones reales.": "Software products created for real operations.",
  "CleanLoop, SOC y BrokerControl son activos propios de YC Systems. Cada producto nace de un problema operativo claro y puede abrir oportunidades comerciales por industria.": "CleanLoop, SOC and BrokerControl are YC Systems owned assets. Each product comes from a clear operational problem and can open commercial opportunities by industry.",
  "Activos propios": "Owned assets",
  "El valor de YC Systems vive en productos que pueden crecer.": "YC Systems' value lives in products that can grow.",
  "Estos productos muestran capacidad de construir plataformas, dashboards, roles, flujos de negocio, interfaces móviles y sistemas listos para evolucionar.": "These products show the ability to build platforms, dashboards, roles, business flows, mobile interfaces and systems ready to evolve.",
  "Convertimos procesos reales en sistemas claros, útiles y listos para crecer.": "We turn real processes into clear, useful systems ready to grow.",
  "La tecnología importa, pero el cliente compra control, automatización, claridad, operación y resultados. Ese es el enfoque de YC Systems.": "Technology matters, but the client buys control, automation, clarity, operation and results. That is the YC Systems approach.",
  "Un camino claro desde el problema hasta la solución.": "A clear path from the problem to the solution.",
  "No empezamos vendiendo herramientas. Primero entendemos la operación, luego disenamos el flujo correcto y construimos una solución que el negocio pueda usar.": "We do not start by selling tools. First we understand the operation, then we design the right flow and build a solution the business can use.",
  "Cuéntame que quieres construir, mejorar o mantener.": "Tell me what you want to build, improve or maintain.",
  "Completa un brief rápido y YC Systems responde con una propuesta inicial para página web, tienda online, app, sistema interno, dashboard, SaaS, mantenimiento o version multiidioma.": "Complete a quick brief and YC Systems responds with an initial proposal for a website, online store, app, internal system, dashboard, SaaS, maintenance or multilingual version.",
  "Enviar brief directo": "Send direct brief",
  "Nombre o negocio": "Name or business",
  "Tipo de solución": "Solution type",
  "Objetivo principal": "Main objective",
  "Tiempo ideal": "Ideal timeline",
  "Rango o referencia de inversión": "Investment range or reference",
  "Detalles importantes": "Important details",
  "YC Systems convierte operaciones reales en productos digitales.": "YC Systems turns real operations into digital products.",
  "Una empresa enfocada en productos de software, SaaS y soluciónes digitales para negocios que necesitan operar mejor, vender con mas confianza y crecer con tecnología.": "A company focused on software products, SaaS and digital solutions for businesses that need to operate better, sell with more trust and grow with technology.",
  "Nexus ya no decora. Explica como piensa YC Systems.": "Nexus no longer decorates. It explains how YC Systems thinks.",
  "Nexus representa nuestro lenguaje de construcción: analiza la operación, recomienda el flujo, guia el desarrollo y ayuda a convertir problemas reales en productos digitales.": "Nexus represents our building language: it analyzes the operation, recommends the flow, guides development and helps turn real problems into digital products.",
  "SaaS para lavanderías": "Laundry SaaS",
  "Operaciones comerciales": "Sales Ops",
  "CRM inmobiliario": "Real Estate CRM",
  "Reparacion de crédito": "Credit Repair",
  "Mercado": "Market",
  "Resultado": "Result",
  "Lavanderías": "Laundry",
  "Ventas inmobiliarias": "Real estate sales",
  "Asesores": "Advisors",
  "Bienestar financiero": "Financial wellness",
  "Control operativo": "Operations control",
  "Visibilidad ejecutiva": "Executive visibility",
  "No perder oportunidades": "No lost opportunities",
  "Casos y documentos": "Cases and documents",
  "Proxima acción clara": "Clear next action",
  "Ver producto": "View Product",
  "Nexus recomienda este producto para lavanderías que necesitan pickup, delivery, tracking y pagos.": "Nexus recommends this product for laundries that need pickup, delivery, tracking and payments.",
  "Analizado por Nexus para equipos que necesitan reservas, pagos, inventario y reportes claros.": "Analyzed by Nexus for teams that need clear reservations, payments, inventory and reports.",
  "Nexus lo recomienda para asesores que necesitan pipeline, documentos, agenda y comisiones.": "Nexus recommends it for advisors who need pipeline, documents, agenda and commissions.",
  "Nexus lo mantiene como vertical en desarrollo para clientes, casos, cartas y portal.": "Nexus keeps it as a vertical in development for clients, cases, letters and portal.",
  "Nexus recomienda CleanLoop cuando la lavanderia necesita separar cliente, driver, admin y rutas.": "Nexus recommends CleanLoop when the laundry needs to separate customer, driver, admin and routes.",
  "Analizado por Nexus para equipos comerciales que necesitan una sola fuente de verdad.": "Analyzed by Nexus for commercial teams that need one source of truth.",
  "Nexus recomienda BrokerControl cuando el asesor necesita seguimiento comercial real.": "Nexus recommends BrokerControl when the advisor needs real commercial follow-up.",
  "Nexus lo clasifica como idea de producto con enfoque educativo y operativo.": "Nexus classifies it as a product idea with educational and operational focus.",
  "Hablar del producto": "Talk about the product",
  "Concepto": "Concept"
});

Object.assign(englishTextTranslations, {
  "Laundry SaaS": "SaaS para lavanderías",
  "Sales Ops": "Operaciones comerciales",
  "Real Estate CRM": "CRM inmobiliario",
  "Credit Repair": "Reparacion de crédito",
  "Market": "Mercado",
  "Result": "Resultado",
  "Laundry": "Lavanderías",
  "Real estate sales": "Ventas inmobiliarias",
  "Advisors": "Asesores",
  "Financial wellness": "Bienestar financiero",
  "Operations control": "Control operativo",
  "Executive visibility": "Visibilidad ejecutiva",
  "No lost opportunities": "No perder oportunidades",
  "Cases and documents": "Casos y documentos",
  "Clear next action": "Proxima acción clara",
  "View Product": "Ver producto",
  "Nexus recommends this product for laundries that need pickup, delivery, tracking and payments.": "Nexus recomienda este producto para lavanderías que necesitan pickup, delivery, tracking y pagos.",
  "Analyzed by Nexus for teams that need clear reservations, payments, inventory and reports.": "Analizado por Nexus para equipos que necesitan reservas, pagos, inventario y reportes claros.",
  "Nexus recommends it for advisors who need pipeline, documents, agenda and commissions.": "Nexus lo recomienda para asesores que necesitan pipeline, documentos, agenda y comisiones.",
  "Nexus keeps it as a vertical in development for clients, cases, letters and portal.": "Nexus lo mantiene como vertical en desarrollo para clientes, casos, cartas y portal.",
  "Nexus recommends CleanLoop when the laundry needs to separate customer, driver, admin and routes.": "Nexus recomienda CleanLoop cuando la lavanderia necesita separar cliente, driver, admin y rutas.",
  "Analyzed by Nexus for commercial teams that need one source of truth.": "Analizado por Nexus para equipos comerciales que necesitan una sola fuente de verdad.",
  "Nexus recommends BrokerControl when the advisor needs real commercial follow-up.": "Nexus recomienda BrokerControl cuando el asesor necesita seguimiento comercial real.",
  "Nexus classifies it as a product idea with educational and operational focus.": "Nexus lo clasifica como idea de producto con enfoque educativo y operativo.",
  "Talk about the product": "Hablar del producto",
  "Concept": "Concepto"
});

Object.assign(textTranslations, {
  "YC Systems LLC": "YC Systems LLC",
  "Una empresa de software construyendo productos reales.": "A software company building real products.",
  "YC Systems LLC desarrolla productos SaaS, sistemas internos, plataformas por industria y experiencias digitales para negocios que necesitan operar mejor, vender con más confianza y crecer con tecnología.": "YC Systems LLC develops SaaS products, internal systems, industry platforms and digital experiences for businesses that need to operate better, sell with more trust and grow with technology.",
  "Ver ejecución real": "View real execution",
  "Empresa registrada": "Registered company",
  "Líneas internas": "Internal lines",
  "Clientes publicados": "Published clients",
  "Nexus guía el método YC Systems.": "Nexus guides the YC Systems method.",
  "Entender la operación, diseñar el flujo y convertirlo en software usable.": "Understand the operation, design the flow and turn it into usable software.",
  "Legal": "Legal",
  "YC Systems LLC opera como empresa constituida y preparada para proyectos comerciales.": "YC Systems LLC operates as a formed company prepared for commercial projects.",
  "Producto": "Product",
  "YC Systems mantiene verticales internas en construcción para probar arquitectura, roles, dashboards y automatización.": "YC Systems maintains internal verticals under construction to test architecture, roles, dashboards and automation.",
  "Clientes": "Clients",
  "GhostWear, Antony Real Estate, LPS Company, LucianoWash y Snackeria muestran ejecución pública.": "GhostWear, Antony Real Estate, LPS Company, LucianoWash and Snackeria show public execution.",
  "Escala": "Scale",
  "La base está pensada para sumar socios, clientes, dominios de producto y operaciones SaaS.": "The foundation is designed to add partners, clients, product domains and SaaS operations.",
  "Quiénes somos": "Who we are",
  "Productos primero. Servicios como capacidad de construcción.": "Products first. Services as build capability.",
  "YC Systems no se presenta solo como una agencia de páginas web. La empresa construye activos digitales: líneas internas, sistemas por industria, e-commerce, dashboards, automatizaciones y proyectos de cliente que pueden mantenerse y evolucionar.": "YC Systems is not presented only as a website agency. The company builds digital assets: internal lines, industry systems, e-commerce, dashboards, automations and client projects that can be maintained and evolved.",
  "Menos improvisación, más flujo, control y resultado visible para el negocio.": "Less improvisation, more flow, control and visible business results.",
  "Construir una empresa global de software con productos SaaS y soluciónes digitales para múltiples industrias.": "Build a global software company with SaaS products and digital solutions for multiple industries.",
  "Una casa de productos capaz de lanzar, operar y mejorar plataformas reales.": "A product house capable of launching, operating and improving real platforms.",
  "Crear software que combine estrategia, diseño, código y operación.": "Create software that combines strategy, design, code and operations.",
  "Primero entender el problema. Luego construir una solución que se pueda usar, vender y mantener.": "First understand the problem. Then build a solution that can be used, sold and maintained.",
  "La forma de construir define la marca.": "The way we build defines the brand.",
  "Ejecución": "Execution",
  "Construimos, probamos, publicamos y seguimos mejorando.": "We build, test, publish and keep improving.",
  "Claridad": "Clarity",
  "El cliente debe entender qué se construye, por qué y cuál es el siguiente paso.": "The client should understand what is being built, why and what the next step is.",
  "Cada solución debe tener estructura, continuidad y potencial de crecimiento.": "Every solution should have structure, continuity and growth potential.",
  "Trabajamos con mentalidad de dueño: orden, cuidado, documentación y responsabilidad.": "We work with an owner mindset: order, care, documentation and responsibility.",
  "Resultado": "Result",
  "Una buena interfaz debe ayudar a vender, operar, medir o automatizar mejor.": "A good interface should help sell, operate, measure or automate better.",
  "Founder & CEO": "Founder & CEO",
  "Founder & CEO de YC Systems LLC. Su enfoque combina estrategia de producto, desarrollo de software, sistemas digitales, automatización y mejora continua para operaciones reales.": "Founder & CEO of YC Systems LLC. His focus combines product strategy, software development, digital systems, automation and continuous improvement for real operations.",
  "YC Systems nace de construir, probar y mejorar soluciónes con problemas reales delante: ventas, reservas, clientes, rutas, dashboards, e-commerce, procesos internos y plataformas SaaS.": "YC Systems was born from building, testing and improving solutions around real problems: sales, bookings, customers, routes, dashboards, e-commerce, internal processes and SaaS platforms.",
  "Nexus no decora: explica cómo piensa YC Systems.": "Nexus does not decorate: it explains how YC Systems thinks.",
  "Nexus representa nuestra forma de construir sin complicar la conversación: analizar la operación, ordenar el flujo, diseñar la experiencia, desarrollar el producto y dejar una base lista para mejorar.": "Nexus represents how we build without complicating the conversation: analyze the operation, organize the flow, design the experience, develop the product and leave a foundation ready to improve.",
  "Siguiente paso": "Next step",
  "Si tu negocio necesita verse mejor u operar mejor, empecemos con una ruta clara.": "If your business needs to look better or operate better, let's start with a clear path.",
  "Cuéntanos qué quieres construir, mejorar o mantener. YC Systems responde con próximos pasos, alcance inicial y una recomendación práctica por fases.": "Tell us what you want to build, improve or maintain. YC Systems responds with next steps, initial scope and a practical phased recommendation.",
  "Enviar brief": "Send brief"
});

Object.assign(englishTextTranslations, {
  "Operating Systems": "Sistemas operativos",
  "Solutions": "Soluciones",
  "Industries": "Industrias",
  "Case Studies": "Casos de estudio",
  "Company": "Empresa",
  "Contact": "Contacto",
  "Request assessment": "Solicitar diagnóstico",
  "Explore operating systems": "Explorar sistemas operativos",
  "Explore OS stack": "Explorar arquitectura",
  "View OS architecture": "Ver arquitectura",
  "Developer platform": "Portal de desarrolladores",
  "Operating systems for modern businesses.": "Sistemas operativos para empresas modernas.",
  "Enterprise Operating Systems": "Sistemas operativos empresariales",
  "Nexus intelligence layer": "Capa de inteligencia Nexus",
  "4 business operating systems": "4 sistemas operativos de negocio",
  "5 active case studies": "5 casos activos",
  "From websites to enterprise infrastructure.": "De páginas web a infraestructura empresarial.",
  "The intelligence layer behind YC Systems.": "La capa de inteligencia detrás de YC Systems.",
  "A software company building real products.": "Una empresa de software construyendo productos reales.",
  "YC Systems LLC develops SaaS products, internal systems, industry platforms and digital experiences for businesses that need to operate better, sell with more trust and grow with technology.": "YC Systems LLC desarrolla productos SaaS, sistemas internos, plataformas por industria y experiencias digitales para negocios que necesitan operar mejor, vender con más confianza y crecer con tecnología.",
  "View real execution": "Ver ejecución real",
  "Registered company": "Empresa registrada",
  "Internal lines": "Líneas internas",
  "Published clients": "Clientes publicados",
  "Nexus guides the YC Systems method.": "Nexus guía el método YC Systems.",
  "Understand the operation, design the flow and turn it into usable software.": "Entender la operación, diseñar el flujo y convertirlo en software usable.",
  "YC Systems LLC operates as a formed company prepared for commercial projects.": "YC Systems LLC opera como empresa constituida y preparada para proyectos comerciales.",
  "YC Systems maintains internal verticals under construction to test architecture, roles, dashboards and automation.": "YC Systems mantiene verticales internas en construcción para probar arquitectura, roles, dashboards y automatización.",
  "GhostWear, Antony Real Estate, LPS Company, LucianoWash and Snackeria show public execution.": "GhostWear, Antony Real Estate, LPS Company, LucianoWash y Snackeria muestran ejecución pública.",
  "The foundation is designed to add partners, clients, product domains and SaaS operations.": "La base está pensada para sumar socios, clientes, dominios de producto y operaciones SaaS.",
  "Products first. Services as build capability.": "Productos primero. Servicios como capacidad de construcción.",
  "YC Systems is not presented only as a website agency. The company builds digital assets: internal lines, industry systems, e-commerce, dashboards, automations and client projects that can be maintained and evolved.": "YC Systems no se presenta solo como una agencia de páginas web. La empresa construye activos digitales: líneas internas, sistemas por industria, e-commerce, dashboards, automatizaciones y proyectos de cliente que pueden mantenerse y evolucionar.",
  "Less improvisation, more flow, control and visible business results.": "Menos improvisación, más flujo, control y resultado visible para el negocio.",
  "A product house capable of launching, operating and improving real platforms.": "Una casa de productos capaz de lanzar, operar y mejorar plataformas reales.",
  "Create software that combines strategy, design, code and operations.": "Crear software que combine estrategia, diseño, código y operación.",
  "First understand the problem. Then build a solution that can be used, sold and maintained.": "Primero entender el problema. Luego construir una solución que se pueda usar, vender y mantener.",
  "The way we build defines the brand.": "La forma de construir define la marca.",
  "We build, test, publish and keep improving.": "Construimos, probamos, publicamos y seguimos mejorando.",
  "The client should understand what is being built, why and what the next step is.": "El cliente debe entender qué se construye, por qué y cuál es el siguiente paso.",
  "Every solution should have structure, continuity and growth potential.": "Cada solución debe tener estructura, continuidad y potencial de crecimiento.",
  "We work with an owner mindset: order, care, documentation and responsibility.": "Trabajamos con mentalidad de dueño: orden, cuidado, documentación y responsabilidad.",
  "A good interface should help sell, operate, measure or automate better.": "Una buena interfaz debe ayudar a vender, operar, medir o automatizar mejor.",
  "Founder & CEO of YC Systems LLC. His focus combines product strategy, software development, digital systems, automation and continuous improvement for real operations.": "Founder & CEO de YC Systems LLC. Su enfoque combina estrategia de producto, desarrollo de software, sistemas digitales, automatización y mejora continua para operaciones reales.",
  "YC Systems was born from building, testing and improving solutions around real problems: sales, bookings, customers, routes, dashboards, e-commerce, internal processes and SaaS platforms.": "YC Systems nace de construir, probar y mejorar soluciónes con problemas reales delante: ventas, reservas, clientes, rutas, dashboards, e-commerce, procesos internos y plataformas SaaS.",
  "Nexus does not decorate: it explains how YC Systems thinks.": "Nexus no decora: explica cómo piensa YC Systems.",
  "Nexus represents how we build without complicating the conversation: analyze the operation, organize the flow, design the experience, develop the product and leave a foundation ready to improve.": "Nexus representa nuestra forma de construir sin complicar la conversación: analizar la operación, ordenar el flujo, diseñar la experiencia, desarrollar el producto y dejar una base lista para mejorar.",
  "If your business needs to look better or operate better, let's start with a clear path.": "Si tu negocio necesita verse mejor u operar mejor, empecemos con una ruta clara.",
  "Tell us what you want to build, improve or maintain. YC Systems responds with next steps, initial scope and a practical phased recommendation.": "Cuéntanos qué quieres construir, mejorar o mantener. YC Systems responde con próximos pasos, alcance inicial y una recomendación práctica por fases.",
  "Send brief": "Enviar brief"
});

Object.assign(textTranslations, {
  "Empresa": "Company",
  "Documentos": "Documents",
  "Privacidad": "Privacy",
  "Términos": "Terms",
  "YC Systems / Privacidad": "YC Systems / Privacy",
  "YC Systems / Términos": "YC Systems / Terms",
  "YC Systems / Documentos": "YC Systems / Documents",
  "YC Systems / Company": "YC Systems / Empresa",
  "Documentos corporativos y comerciales.": "Corporate and commercial documents.",
  "Información pública base de YC Systems LLC, documentos comerciales usados para iniciar proyectos y enlaces legales oficiales del sitio.": "Public baseline information for YC Systems LLC, commercial documents used to start projects and official legal links for the website.",
  "Solicitar propuesta": "Request proposal",
  "Ver empresa": "View company",
  "Entidad legal": "Legal entity",
  "YC Systems LLC — compañía de responsabilidad limitada de Nueva York. Founded July 2026.": "YC Systems LLC — compañía de responsabilidad limitada de Nueva York. Founded July 2026.",
  "Construir y operar": "Build and operate",
  "Empresa real, documentos claros y términos públicos para trabajar con orden.": "Real company, clear documents and public terms to work with order.",
  "Desarrollado por YC Systems": "Built by YC Systems"
});

Object.assign(englishTextTranslations, {
  "Empresa": "Empresa",
  "Documents": "Documentos",
  "Privacy": "Privacidad",
  "Terms": "Términos",
  "YC Systems / Privacy": "YC Systems / Privacidad",
  "YC Systems / Terms": "YC Systems / Términos",
  "YC Systems / Documents": "YC Systems / Documentos",
  "YC Systems / Empresa": "YC Systems / Company",
  "Effective July 2026": "Vigente desde julio de 2026",
  "Privacy Policy": "Política de privacidad",
  "This Privacy Policy explains how YC Systems LLC collects, uses and protects information submitted through this website, email, business forms and commercial project requests.": "Esta política de privacidad explica cómo YC Systems LLC recopila, usa y protege la información enviada a través de este sitio web, correo electrónico, formularios de negocio y solicitudes comerciales.",
  "Company": "Empresa",
  "YC Systems LLC is a compañía de responsabilidad limitada de Nueva York founded in July 2026. Website: ycsystems.io. Primary contact: contact@ycsystems.io.": "YC Systems LLC es una compañía de responsabilidad limitada de Nueva York fundada en julio de 2026. Sitio web: ycsystems.io. Contacto principal: contact@ycsystems.io.",
  "Information we may collect": "Información que podemos recopilar",
  "Name, business name, email address, project type, budget reference, goals, timeline, project details and any information voluntarily submitted through forms, email or business communication.": "Nombre, nombre del negocio, correo electrónico, tipo de proyecto, referencia de presupuesto, objetivos, calendario, detalles del proyecto y cualquier información enviada voluntariamente por formularios, correo o comunicación comercial.",
  "How we use information": "Cómo usamos la información",
  "We use submitted information to respond to requests, prepare proposals, evaluate scope, coordinate business communication, provide support, improve the website and plan project delivery.": "Usamos la información enviada para responder solicitudes, preparar propuestas, evaluar alcance, coordinar comunicación comercial, brindar soporte, mejorar el sitio web y planificar la entrega de proyectos.",
  "Third-party services": "Servicios de terceros",
  "This website may use services such as FormSubmit for form delivery, GitHub Pages for hosting, domain/DNS providers, email providers and analytics tools when connected.": "Este sitio web puede usar servicios como FormSubmit para envío de formularios, GitHub Pages para hosting, proveedores de dominio/DNS, proveedores de correo y herramientas de analítica cuando estén conectadas.",
  "Data protection": "Protección de datos",
  "YC Systems LLC aims to limit access to submitted information, use business data only for legitimate operational purposes and avoid publishing client-sensitive information without permission.": "YC Systems LLC procura limitar el acceso a la información enviada, usar datos de negocio solo para fines operativos legítimos y evitar publicar información sensible de clientes sin permiso.",
  "Your choices": "Tus opciones",
  "You may request correction, deletion or clarification of information submitted to YC Systems by contacting contact@ycsystems.io.": "Puedes solicitar corrección, eliminación o aclaración de información enviada a YC Systems escribiendo a contact@ycsystems.io.",
  "Updates": "Actualizaciones",
  "This policy may be updated as YC Systems LLC grows, launches new operating systems, adds client portals or integrates additional business tools.": "Esta política puede actualizarse a medida que YC Systems LLC crezca, lance nuevos sistemas operativos, agregue portales de clientes o integre herramientas comerciales adicionales.",
  "Terms of Service": "Términos de servicio",
  "These Terms of Service govern use of the YC Systems LLC website and provide the public baseline for commercial proposals, software projects, operating systems, maintenance and business communication.": "Estos términos de servicio rigen el uso del sitio web de YC Systems LLC y establecen la base pública para propuestas comerciales, proyectos de software, sistemas operativos, mantenimiento y comunicación de negocio.",
  "Services and products": "Servicios y productos",
  "YC Systems LLC may provide business operating systems, software products, internal systems, websites, client portals, dashboards, automations, maintenance, documentation and related technology services.": "YC Systems LLC puede ofrecer sistemas operativos de negocio, productos de software, sistemas internos, sitios web, portales de clientes, dashboards, automatizaciones, mantenimiento, documentación y servicios tecnológicos relacionados.",
  "Scope and project agreements": "Alcance y acuerdos de proyecto",
  "Each project should be governed by a written proposal, statement of work, service agreement, invoice or written confirmation defining scope, deliverables, timeline, approvals, responsibilities and fees.": "Cada proyecto debe regirse por una propuesta escrita, alcance de trabajo, acuerdo de servicio, factura o confirmación escrita que defina alcance, entregables, calendario, aprobaciones, responsabilidades y tarifas.",
  "Client responsibilities": "Responsabilidades del cliente",
  "Clients are responsible for providing accurate business information, content, assets, domain access, approvals, payment information and any credentials required to complete agreed work.": "Los clientes son responsables de proporcionar información comercial precisa, contenido, activos, acceso a dominios, aprobaciones, información de pago y cualquier credencial necesaria para completar el trabajo acordado.",
  "Payments and delivery": "Pagos y entrega",
  "Payment terms, deposits, milestones, due dates, delivery conditions and maintenance plans must be agreed before work begins or before each new project phase.": "Los términos de pago, depósitos, hitos, fechas de vencimiento, condiciones de entrega y planes de mantenimiento deben acordarse antes de iniciar el trabajo o cada nueva fase del proyecto.",
  "Intellectual property": "Propiedad intelectual",
  "Unless otherwise agreed in writing, YC Systems LLC retains ownership of its pre-existing tools, templates, components, internal processes, product concepts, Nexus brand system and reusable software architecture.": "Salvo acuerdo escrito distinto, YC Systems LLC conserva la propiedad de sus herramientas preexistentes, plantillas, componentes, procesos internos, conceptos de producto, sistema de marca Nexus y arquitectura de software reutilizable.",
  "Client content and third parties": "Contenido del cliente y terceros",
  "Clients must have the right to use any logos, images, text, product information or third-party services they provide. Third-party platforms may have their own terms and limitations.": "Los clientes deben tener derecho a usar cualquier logo, imagen, texto, información de producto o servicio de terceros que proporcionen. Las plataformas de terceros pueden tener sus propios términos y limitaciones.",
  "Maintenance and support": "Mantenimiento y soporte",
  "Maintenance may include content updates, visual improvements, bug fixes, monitoring, support and new features according to the plan or agreement in place.": "El mantenimiento puede incluir actualizaciones de contenido, mejoras visuales, corrección de errores, monitoreo, soporte y nuevas funciones según el plan o acuerdo vigente.",
  "Limitation": "Limitación",
  "The website is provided for public information and business communication. Specific legal, financial, compliance or tax obligations should be reviewed with qualified professionals.": "El sitio web se ofrece para información pública y comunicación comercial. Las obligaciones legales, financieras, de cumplimiento o fiscales específicas deben revisarse con profesionales calificados.",
  "Corporate and commercial documents.": "Documentos corporativos y comerciales.",
  "Public baseline information for YC Systems LLC, commercial documents used to start projects and official legal links for the website.": "Información pública base de YC Systems LLC, documentos comerciales usados para iniciar proyectos y enlaces legales oficiales del sitio.",
  "Request proposal": "Solicitar propuesta",
  "View company": "Ver empresa",
  "Legal entity": "Entidad legal",
  "Company record": "Registro de empresa",
  "Legal name:": "Nombre legal:",
  "Entity type: compañía de responsabilidad limitada de Nueva York": "Tipo de entidad: compañía de responsabilidad limitada de Nueva York",
  "Founded: July 2026": "Fundada: julio de 2026",
  "Website: ycsystems.io": "Sitio web: ycsystems.io",
  "Primary email: contact@ycsystems.io": "Correo principal: contact@ycsystems.io",
  "Commercial proposal": "Propuesta comercial",
  "Purpose:": "Objetivo:",
  "define business problem, recommended system, project scope, phases, delivery timeline and investment reference.": "definir el problema de negocio, sistema recomendado, alcance del proyecto, fases, calendario de entrega y referencia de inversión.",
  "Resumen del negocio": "Resumen del negocio",
  "Sistema operativo o solución recomendada": "Sistema operativo o solución recomendada",
  "Fases de entrega": "Fases de entrega",
  "Ruta de mantenimiento": "Ruta de mantenimiento",
  "Service agreement": "Acuerdo de servicio",
  "define scope, payment terms, revisions, responsibilities, confidentiality, deliverables and support conditions before work begins.": "definir alcance, términos de pago, revisiones, responsabilidades, confidencialidad, entregables y condiciones de soporte antes de iniciar el trabajo.",
  "Parties and scope": "Partes y alcance",
  "Deliverables and approvals": "Entregables y aprobaciones",
  "Out-of-scope changes": "Cambios fuera de alcance",
  "IP and usage terms": "Términos de propiedad intelectual y uso",
  "Invoice and billing": "Factura y cobro",
  "invoice consistently using YC Systems LLC as the business entity, with concept, phase, due date and payment notes.": "facturar de forma consistente usando YC Systems LLC como entidad comercial, con concepto, fase, fecha de vencimiento y notas de pago.",
  "YC Systems LLC business details": "Datos comerciales de YC Systems LLC",
  "Client details": "Datos del cliente",
  "Items and subtotals": "Conceptos y subtotales",
  "Payment terms": "Términos de pago",
  "Legal pages": "Páginas legales",
  "Public pages:": "Páginas públicas:",
  "privacy, terms, company, trust center and documentation keep the public site aligned with a real software company.": "privacidad, términos, empresa, centro de confianza y documentación mantienen el sitio público alineado con una empresa real de software.",
  "Building the business operating layer for modern companies.": "Construyendo la capa operativa de negocio para empresas modernas.",
  "YC Systems LLC is a compañía de responsabilidad limitada de Nueva York founded in July 2026. The company builds operating systems, enterprise software and digital infrastructure for modern businesses.": "YC Systems LLC es una compañía de responsabilidad limitada de Nueva York fundada en julio de 2026. La empresa construye sistemas operativos, software empresarial e infraestructura digital para negocios modernos.",
  "Contact YC Systems": "Contactar YC Systems",
  "NY LLC": "NY LLC",
  "Founded July 2026": "Fundada en julio de 2026",
  "Nexus OS": "Nexus OS",
  "Mission": "Misión",
  "Create operating systems that make businesses easier to run.": "Crear sistemas operativos que hagan que los negocios sean más fáciles de operar.",
  "Principles": "Principios",
  "How YC Systems builds.": "Cómo construye YC Systems.",
  "Clarity over noise": "Claridad sobre ruido",
  "Una sola idea fuerte: sistemas operativos para empresas modernas.": "Una sola idea fuerte: sistemas operativos para empresas modernas.",
  "Product thinking": "Mentalidad de producto",
  "Nexus first": "Nexus primero",
  "Enterprise trust": "Confianza empresarial"
});

const pageMetadataTranslations = {
  es: {
    "/": {
      title: "YC Systems LLC — Productos de software para operaciones reales",
      description: "YC Systems LLC construye productos de software, sistemas operativos de negocio, SaaS, CRM, dashboards y automatización para operaciones reales.",
    },
    "/privacy/": {
      title: "Política de privacidad | YC Systems LLC",
      description: "Política de privacidad de YC Systems LLC: formularios de contacto, solicitudes comerciales, analítica, comunicación de negocio y datos de proyectos de clientes.",
    },
    "/terms/": {
      title: "Términos de servicio | YC Systems LLC",
      description: "Términos de servicio de YC Systems LLC: uso del sitio, propuestas, productos de software, sistemas operativos, entrega, facturación y mantenimiento.",
    },
    "/documents/": {
      title: "Documentos | YC Systems LLC",
      description: "Documentos corporativos y comerciales de YC Systems LLC: empresa, propuestas, acuerdos, facturación, privacidad y términos.",
    },
    "/company/": {
      title: "Empresa | YC Systems LLC",
      description: "YC Systems LLC es una empresa tecnológica que construye sistemas operativos para negocios modernos.",
    },
    "/operating-systems/": {
      title: "Sistemas operativos | YC Systems",
      description: "YC Systems construye sistemas operativos empresariales para ventas, operaciones, logística y flujos financieros conectados por Nexus.",
    },
  },
  en: {
    "/": {
      title: "YC Systems LLC — Software products for real operations",
      description: "YC Systems LLC builds software products, business operating systems, SaaS, CRM, dashboards and automation for real operations.",
    },
    "/privacy/": {
      title: "Privacy Policy | YC Systems LLC",
      description: "Privacy Policy for YC Systems LLC: contact forms, commercial requests, analytics, business communication and client project data.",
    },
    "/terms/": {
      title: "Terms of Service | YC Systems LLC",
      description: "Terms of Service for YC Systems LLC: website use, proposals, software products, operating systems, project delivery, billing and maintenance.",
    },
    "/documents/": {
      title: "Documents | YC Systems LLC",
      description: "Corporate and commercial documents for YC Systems LLC: company, proposals, agreements, billing, privacy and terms.",
    },
    "/company/": {
      title: "Company | YC Systems LLC",
      description: "YC Systems LLC is a technology company building operating systems for modern businesses.",
    },
    "/operating-systems/": {
      title: "Operating Systems | YC Systems",
      description: "YC Systems builds business operating systems for sales, operations, logistics and financial workflows connected by Nexus.",
    },
  },
};

Object.assign(textTranslations, {
  "Sistemas operativos": "Operating Systems",
  "Soluciones": "Solutions",
  "Industrias": "Industries",
  "Casos de estudio": "Case Studies",
  "Empresa": "Company",
  "Contacto": "Contact",
  "Centro de confianza": "Trust Center",
  "Documentación": "Documentation",
  "Desarrolladores": "Developers",
  "Portal de desarrolladores": "Developer platform",
  "Portal de desarrolladores": "Developer Platform",
  "Solicitar diagnóstico": "Request assessment",
  "Ver casos de clientes": "View client projects",
  "Ver casos de estudio": "View case studies",
  "Explorar sistemas operativos": "Explore operating systems",
  "Explorar OS": "Explore OS",
  "Ver arquitectura OS": "View OS architecture",
  "All rights reserved.": "All rights reserved.",
  "Productos de software y sistemas de negocio.": "Software Products & Business Systems.",
  "Soluciones inteligentes. Resultados reales.": "Smart Solutions. Real Results.",
  "YC Systems / Carreras": "YC Systems / Careers",
  "Carreras": "Careers",
  "Construir sistemas operativos para empresas modernas.": "Build operating systems for modern businesses.",
  "Equipos futuros": "Future teams",
  "Producto. Ingeniería. Crecimiento.": "Product. Engineering. Growth.",
  "YC Systems / Documentación": "YC Systems / Documentation",
  "Conocimiento público para el ecosistema YC Systems.": "Public knowledge for the YC Systems ecosystem.",
  "Ruta de documentación": "Docs roadmap",
  "Base de conocimiento de producto": "Product knowledge base",
  "Guías": "Guides",
  "Lanzamientos": "Releases",
  "Soporte": "Support",
  "Documentación de producto": "Product docs",
  "Guías de implementación": "Implementation guides",
  "Registro de cambios": "Changelog",
  "YC Systems / Desarrolladores": "YC Systems / Developers",
  "Arquitectura preparada para APIs, integraciones y crecimiento de producto.": "Architecture prepared for APIs, integrations and product growth.",
  "Plataforma": "Platform",
  "Ruta de APIs e integraciones": "APIs and integrations roadmap",
  "Autenticación": "Auth",
  "Datos": "Data",
  "Webhooks": "Webhooks",
  "SDKs": "SDKs",
  "YC Systems / Industrias": "YC Systems / Industries",
  "Sistemas de negocio por vertical.": "Sistemas de negocio by vertical.",
  "Estrategia vertical": "Vertical Strategy",
  "Sistemas repetibles para mercados reales": "Repeatable systems for real markets",
  "Bienes raíces": "Real Estate",
  "Lavandería": "Laundry",
  "Crédito": "Credit",
  "Comercio": "Commerce",
  "YC Systems / Soluciones": "YC Systems / Solutions",
  "Soluciones empresariales": "Enterprise Solutions",
  "Infraestructura para negocios que necesitan control.": "Infrastructure for businesses that need control.",
  "Matriz de soluciónes": "Solution Matrix",
  "Del proceso a la plataforma": "From process to platform",
  "Ventas": "Sales",
  "Operaciones": "Operations",
  "Portales": "Portals",
  "Automatización": "Automation",
  "YC Systems / Centro de confianza": "YC Systems / Trust Center",
  "La seguridad y la confiabilidad son parte del producto.": "Security and reliability are part of the product.",
  "Estado": "Status",
  "Base operativa": "Operational foundation",
  "Protección de datos": "Data protection",
  "Seguridad de cuentas": "Account security",
  "Disponibilidad": "Availability",
  "Ruta de cumplimiento": "Compliance roadmap",
  "Privacidad": "Privacy",
  "Acceso": "Access",
  "Backups": "Backups",
  "Cumplimiento": "Compliance",
  "YC Systems / Casos de estudio": "YC Systems / Case Studies",
  "Prueba de trabajo": "Proof of work",
  "Sistemas publicados, dominios activos y resultados visibles.": "Published systems, active domains and visible outcomes.",
  "Formato de caso": "Case format",
  "Cada caso se evalúa como un sistema de negocio.": "Every case is evaluated like a business system.",
  "Web corporativa": "Corporate web",
  "Tecnología": "Technology",
  "Sobre YC Systems": "About YC Systems",
  "Innovación": "Innovation",
  "Mercados": "Markets",
  "Industrias donde la operación necesita claridad.": "Industries where operations need clarity.",
  "Qué construimos": "What we build",
  "Soluciones organizadas por resultado de negocio.": "Solutions organized by business outcome."
});

Object.assign(englishTextTranslations, {
  "Operating Systems": "Sistemas operativos",
  "Solutions": "Soluciones",
  "Industries": "Industrias",
  "Case Studies": "Casos de estudio",
  "Company": "Empresa",
  "Contact": "Contacto",
  "Trust Center": "Centro de confianza",
  "Documentation": "Documentación",
  "Developers": "Desarrolladores",
  "Developer platform": "Portal de desarrolladores",
  "Developer Platform": "Portal de desarrolladores",
  "Request assessment": "Solicitar diagnóstico",
  "View client projects": "Ver casos de clientes",
  "View case studies": "Ver casos de estudio",
  "Explore operating systems": "Explorar sistemas operativos",
  "Explore OS": "Explorar OS",
  "View OS architecture": "Ver arquitectura OS",
  "© 2026 YC Systems LLC. All rights reserved.": "© 2026 YC Systems LLC. All rights reserved.",
  "All rights reserved.": "All rights reserved.",
  "Software Products & Business Systems.": "Productos de software y sistemas de negocio.",
  "Smart Solutions. Real Results.": "Soluciones inteligentes. Resultados reales.",
  "YC Systems / Careers": "YC Systems / Carreras",
  "Careers": "Carreras",
  "Build operating systems for modern businesses.": "Construir sistemas operativos para empresas modernas.",
  "Future teams": "Equipos futuros",
  "Product. Engineering. Growth.": "Producto. Ingeniería. Crecimiento.",
  "YC Systems / Documentation": "YC Systems / Documentación",
  "Public knowledge for the YC Systems ecosystem.": "Conocimiento público para el ecosistema YC Systems.",
  "Docs roadmap": "Ruta de documentación",
  "Product knowledge base": "Base de conocimiento de producto",
  "Guides": "Guías",
  "Releases": "Lanzamientos",
  "Support": "Soporte",
  "Product docs": "Documentación de producto",
  "Implementation guides": "Guías de implementación",
  "Changelog": "Registro de cambios",
  "YC Systems / Developers": "YC Systems / Desarrolladores",
  "Architecture prepared for APIs, integrations and product growth.": "Arquitectura preparada para APIs, integraciones y crecimiento de producto.",
  "Platform": "Plataforma",
  "APIs and integrations roadmap": "Ruta de APIs e integraciones",
  "Auth": "Autenticación",
  "Data": "Datos",
  "YC Systems / Industries": "YC Systems / Industrias",
  "Industries": "Industrias",
  "Sistemas de negocio by vertical.": "Sistemas de negocio por vertical.",
  "Vertical Strategy": "Estrategia vertical",
  "Repeatable systems for real markets": "Sistemas repetibles para mercados reales",
  "Real Estate": "Bienes raíces",
  "Laundry": "Lavandería",
  "Credit": "Crédito",
  "Commerce": "Comercio",
  "YC Systems / Solutions": "YC Systems / Soluciones",
  "Enterprise Solutions": "Soluciones empresariales",
  "Infrastructure for businesses that need control.": "Infraestructura para negocios que necesitan control.",
  "Solution Matrix": "Matriz de soluciónes",
  "From process to platform": "Del proceso a la plataforma",
  "Sales": "Ventas",
  "Operations": "Operaciones",
  "Portals": "Portales",
  "Automation": "Automatización",
  "YC Systems / Trust Center": "YC Systems / Centro de confianza",
  "Security and reliability are part of the product.": "La seguridad y la confiabilidad son parte del producto.",
  "Status": "Estado",
  "Operational foundation": "Base operativa",
  "Data protection": "Protección de datos",
  "Account security": "Seguridad de cuentas",
  "Availability": "Disponibilidad",
  "Compliance roadmap": "Ruta de cumplimiento",
  "Privacy": "Privacidad",
  "Access": "Acceso",
  "Backups": "Backups",
  "Compliance": "Cumplimiento",
  "YC Systems / Case Studies": "YC Systems / Casos de estudio",
  "Proof of work": "Prueba de trabajo",
  "Published systems, active domains and visible outcomes.": "Sistemas publicados, dominios activos y resultados visibles.",
  "Case format": "Formato de caso",
  "Every case is evaluated like a business system.": "Cada caso se evalúa como un sistema de negocio.",
  "Corporate web": "Web corporativa",
  "Technology": "Tecnología",
  "About YC Systems": "Sobre YC Systems",
  "Innovation": "Innovación",
  "Markets": "Mercados",
  "Industries where operations need clarity.": "Industrias donde la operación necesita claridad.",
  "What we build": "Qué construimos",
  "Solutions organized by business outcome.": "Soluciones organizadas por resultado de negocio."
});

Object.assign(textTranslations, {
  "YC Systems LLC construye infraestructura digital para empresas que necesitan vender mejor, operar con claridad y automatizar procesos con inteligencia.": "YC Systems LLC builds digital infrastructure for companies that need to sell better, operate with clarity and automate processes with intelligence.",
  "SOC OS, BrokerControl OS, CleanLoop OS y CreditPilot OS como mapa de producto.": "SOC OS, BrokerControl OS, CleanLoop OS and CreditPilot OS as the product map.",
  "La inteligencia que conecta diagnóstico, flujos, módulos y decisiones.": "The intelligence layer that connects diagnosis, flows, modules and decisions.",
  "YC Systems LLC, dominio corporativo, Google Workspace y estructura para escalar.": "YC Systems LLC, corporate domain, Google Workspace and structure ready to scale.",
  "Nexus no es una mascota. Es la forma en que YC Systems analiza operaciones, recomienda flujos, organiza módulos y convierte procesos dispersos en sistemas medibles.": "Nexus is not a mascot. It is the way YC Systems analyzes operations, recommends flows, organizes modules and turns scattered processes into measurable systems.",
  "Operación para lavanderías con pickup, delivery, tracking y pagos.": "Operations for laundries with pickup, delivery, tracking and payments.",
  "Panel operativo para reservas, pagos, inventario y reportes claros.": "Operating panel for reservations, payments, inventory and clear reports.",
  "CRM para asesores con pipeline, agenda, documentos y comisiones.": "CRM for advisors with pipeline, agenda, documents and commissions.",
  "Vertical para gestionar casos, cartas, documentos y portal de clientes.": "Vertical system to manage cases, letters, documents and client portals.",
  "YC Systems convierte operación, ventas, clientes y datos en sistemas claros que pueden mantenerse, escalar y medirse.": "YC Systems turns operations, sales, customers and data into clear systems that can be maintained, scaled and measured.",
  "No vendemos una lista de herramientas. Diseñamos sistemas que reducen fricción, aumentan visibilidad y ayudan a operar mejor.": "We do not sell a list of tools. We design systems that reduce friction, increase visibility and help teams operate better.",
  "Acceso privado para clientes, documentos, casos, servicios, pagos y progreso.": "Private access for clients, documents, cases, services, payments and progress.",
  "Bases SaaS por fases para líneas internas o verticales nuevos.": "Phased SaaS foundations for internal lines or new verticals.",
  "YC Systems construye plataformas alrededor de problemas reales: ventas inmobiliarias, lavanderías, comercio, servicios, crédito y operaciones internas.": "YC Systems builds platforms around real problems: real estate sales, laundries, commerce, services, credit and internal operations.",
  "SOC OS y BrokerControl OS para inventario, reservas, asesores, clientes y documentos.": "SOC OS and BrokerControl OS for inventory, reservations, advisors, clients and documents.",
  "CleanLoop OS para pickup, delivery, drivers, pagos, rutas y control operativo.": "CleanLoop OS for pickup, delivery, drivers, payments, routes and operational control.",
  "CreditPilot OS como vertical futuro para casos, cartas, documentos y portal de clientes.": "CreditPilot OS as a future vertical for cases, letters, documents and client portals.",
  "Experiencias digitales para vender productos, ordenar catálogos y convertir clientes.": "Digital experiences to sell products, organize catalogs and convert customers.",
  "Webs y sistemas para reservas, servicios, cotizaciones, WhatsApp y mantenimiento.": "Websites and systems for bookings, services, quotes, WhatsApp and maintenance.",
  "Herramientas para equipos que necesitan menos Excel y más trazabilidad.": "Tools for teams that need less Excel and more traceability.",
  "La documentación pública organiza productos, implementación, seguridad, releases y próximos módulos como una empresa SaaS real.": "Public documentation organizes products, implementation, security, releases and upcoming modules like a real SaaS company.",
  "Alcance, fases, onboarding, datos, usuarios y entrega.": "Scope, phases, onboarding, data, users and delivery.",
  "Versiones, cambios, releases y roadmap por producto.": "Versions, changes, releases and roadmap by product.",
  "YC Systems evoluciona hacia una plataforma donde cada producto pueda documentarse, integrarse y operar con estándares claros.": "YC Systems is evolving into a platform where every product can be documented, integrated and operated with clear standards.",
  "YC Systems prepara su operación con buenas prácticas de privacidad, acceso, backups, documentación y control para productos empresariales.": "YC Systems prepares its operation with strong privacy, access, backup, documentation and control practices for enterprise products.",
  "Principios de minimización, acceso necesario y separación por producto o cliente.": "Principles of minimization, necessary access and separation by product or client.",
  "Sitios estáticos, deploys versionados y rutas listas para monitoreo futuro.": "Static sites, versioned deploys and routes ready for future monitoring.",
  "Políticas, documentación, contratos base, changelog, releases y estado público.": "Policies, documentation, base contracts, changelog, releases and public status.",
  "Cada caso documenta problema, solución, impacto y una ruta clara para empresas que necesitan una plataforma similar.": "Each case documents the problem, solution, impact and a clear path for companies that need a similar platform.",
  "E-commerce activo para vender productos con catálogo, carrito y pedido por WhatsApp.": "Active e-commerce to sell products with catalog, cart and WhatsApp orders.",
  "Presencia inmobiliaria con autoridad, contacto directo y confianza comercial.": "Real estate presence with authority, direct contact and commercial trust.",
  "Base corporativa para presentar una empresa con servicios y marcas digitales.": "Corporate foundation to present a company with services and digital brands.",
  "Servicio local presentado con claridad, marca, WhatsApp y experiencia móvil.": "Local service presented with clarity, brand, WhatsApp and mobile experience.",
  "Marca de conveniencia preparada para explicar una nueva oferta al mercado.": "Convenience brand prepared to explain a new offer to the market.",
  "Líneas internas que muestran capacidad para construir sistemas empresariales.": "Internal lines that show the ability to build enterprise systems.",
  "YC Systems combina producto, ingeniería, diseño, automatización y visión comercial para convertir procesos complejos en plataformas claras, seguras y escalables.": "YC Systems combines product, engineering, design, automation and commercial vision to turn complex processes into clear, secure and scalable platforms.",
  "Una sola idea fuerte: sistemas operativos para empresas modernas.": "One strong idea: operating systems for modern businesses.",
  "Cada solución debe poder crecer, mantenerse y documentarse.": "Every solution must be able to grow, be maintained and be documented.",
  "Seguridad, documentación, propiedad intelectual y procesos desde el inicio.": "Security, documentation, intellectual property and process from the beginning.",
  "CleanLoop OS, SOC OS, BrokerControl OS y CreditPilot OS forman un ecosistema de productos conectados por Nexus: una misma visión para distintos verticales.": "CleanLoop OS, SOC OS, BrokerControl OS and CreditPilot OS form a product ecosystem connected by Nexus: one shared vision for different verticals.",
  "Estos productos muestran capacidad para construir plataformas, dashboards, roles, flujos de negocio, interfaces móviles y sistemas listos para evolucionar.": "These products show the ability to build platforms, dashboards, roles, business flows, mobile interfaces and systems ready to evolve.",
  "SaaS para lavanderías para pickup, delivery, tracking, pagos y operación diaria.": "Laundry SaaS for pickup, delivery, tracking, payments and daily operations.",
  "Sales Operations Center para inventario, reservas, pagos, estados y reportes.": "Sales Operations Center for inventory, reservations, payments, statuses and reports.",
  "CRM operativo para asesores inmobiliarios: pipeline, agenda, documentos y comisiones.": "Operational CRM for real estate advisors: pipeline, agenda, documents and commissions.",
  "GPS financiero para ordenar deudas, prioridades, pagos y progreso personal.": "Financial GPS to organize debts, priorities, payments and personal progress.",
  "Plataforma futura para reparación de crédito, casos, documentos, cartas, portal de clientes y educación financiera.": "Future platform for credit repair, cases, documents, letters, client portals and financial education.",
  "Nexus lo mantiene como próximo vertical para convertir procesos financieros complejos en operación guiada.": "Nexus keeps it as the next vertical to turn complex financial processes into guided operations.",
  "Piloto": "Pilot",
  "Listo": "Ready",
  "Próximo": "Next"
});

Object.assign(textTranslations, {
  "Sistemas operativos para empresas modernas.": "Operating systems for modern businesses.",
  "YC Systems / Empresa": "YC Systems / Company",
  "Solución:": "Solution:",
  "Resultado:": "Result:",
  "Solución: catálogo, carrito y pedidos por WhatsApp.": "Solution: catalog, cart and WhatsApp orders.",
  "Resultado: tienda activa lista para vender.": "Result: active store ready to sell.",
  "Problem: presentar con confianza asesoría inmobiliaria en RD.": "Problem: present real estate advisory in the Dominican Republic with confidence.",
  "Solución: web profesional, mensaje claro y contacto directo.": "Solution: professional website, clear message and direct contact.",
  "Resultado: presencia comercial más seria.": "Result: stronger commercial presence.",
  "Problema: marca sin presencia corporativa clara.": "Problem: brand without a clear corporate presence.",
  "Solución: identidad, base digital y presentación comercial.": "Solution: identity, digital foundation and commercial presentation.",
  "Resultado: compañía preparada para crecer.": "Result: company prepared to grow.",
  "Ver sitio activo": "View live site",
  "Operating systems built for real business operations.": "Operating systems built for real business operations."
});

Object.assign(englishTextTranslations, {
  "Operating systems built for real business operations.": "Sistemas operativos creados para operaciones reales de negocio.",
  "YC Systems OS": "YC Systems OS",
  "YC Systems / Company": "YC Systems / Empresa",
  "YC Systems / Operating Systems": "YC Systems / Sistemas operativos",
  "The value of YC Systems lives in systems that can scale.": "El valor de YC Systems vive en sistemas que pueden escalar."
});

Object.assign(textTranslations, {
  "Operating systems for modern businesses.": "Operating systems for modern businesses.",
  "From websites to enterprise infrastructure.": "From websites to enterprise infrastructure.",
  "The intelligence layer behind YC Systems.": "The intelligence layer behind YC Systems.",
  "YC Systems / Company": "YC Systems / Company",
  "YC Systems / Empresa": "YC Systems / Company",
  "De páginas web a infraestructura empresarial.": "From websites to enterprise infrastructure.",
  "La capa de inteligencia detrás de YC Systems.": "The intelligence layer behind YC Systems.",
  "catálogo, carrito y pedidos por WhatsApp.": "catalog, cart and WhatsApp orders.",
  "tienda activa lista para vender.": "active store ready to sell.",
  "presentar con confianza asesoría inmobiliaria en RD.": "present real estate advisory in the Dominican Republic with confidence.",
  "web profesional, mensaje claro y contacto directo.": "professional website, clear message and direct contact.",
  "presencia comercial más seria.": "stronger commercial presence.",
  "identidad, base digital y presentación comercial.": "identity, digital foundation and commercial presentation.",
  "compañía preparada para crecer.": "company prepared to grow.",
  "The value of YC Systems lives in systems that can scale.": "The value of YC Systems lives in systems that can scale."
});

Object.assign(textTranslations, {
  "Inicio YC Systems": "YC Systems home",
  "Abrir navegación": "Open navigation",
  "Empresa": "Company",
  "Documentos": "Documents",
  "Privacidad": "Privacy",
  "Términos": "Terms",
  "Contacto": "Contact",
  "All rights reserved.": "All rights reserved.",
  "© 2026 YC Systems LLC. All rights reserved.": "© 2026 YC Systems LLC. All rights reserved.",
  "Sistemas operativos creados para operaciones reales de negocio.": "Operating systems built for real business operations.",
  "Proyectos publicados, sistemas en construcción y resultados visibles.": "Published projects, systems in progress and visible outcomes.",
  "Una base pública para productos, clientes y operación interna.": "A public base for products, clients and internal operations.",
  "Cuéntame qué quieres construir, mejorar o mantener.": "Tell me what you want to build, improve or maintain.",
  "Capa de inteligencia Nexus": "Nexus intelligence layer",
  "4 sistemas operativos de negocio": "4 business operating systems",
  "5 casos activos": "5 active case studies",
  "La capa de inteligencia detrás de YC Systems.": "The intelligence layer behind YC Systems.",
  "Siguiente paso": "Next step",
  "Caso de cliente": "Client success story",
  "Caso de estudio": "Case study",
  "Prueba de trabajo": "Proof of work",
  "Vigente desde julio de 2026": "Effective July 2026",
  "Términos de servicio": "Terms of Service",
  "Política de privacidad": "Privacy Policy",
  "Servicios y productos": "Services and products",
  "Alcance y acuerdos de proyecto": "Scope and project agreements",
  "Responsabilidades del cliente": "Client responsibilities",
  "Pagos y entrega": "Payments and delivery",
  "Propiedad intelectual": "Intellectual property",
  "Contenido del cliente y terceros": "Client content and third parties",
  "Mantenimiento y soporte": "Maintenance and support",
  "Limitación": "Limitation",
  "Información que podemos recopilar": "Information we may collect",
  "Cómo usamos la información": "How we use information",
  "Servicios de terceros": "Third-party services",
  "Protección de datos": "Data protection",
  "Tus opciones": "Your choices",
  "Actualizaciones": "Updates",
  "Arquitectura tecnológica": "Technology Architecture",
  "Arquitectura de software empresarial guiada por Nexus.": "Enterprise software architecture guided by Nexus.",
  "Plataforma para desarrolladores": "Developer platform",
  "Una arquitectura de producto creada para operaciones reales.": "A product architecture built for real operations.",
  "Modelo de datos": "Data model",
  "Roles y accesos": "Roles and access",
  "Motor de flujos": "Workflow engine",
  "Capa de automatización": "Automation layer",
  "Inteligencia Nexus": "Nexus intelligence",
  "Soluciones empresariales": "Enterprise Solutions",
  "Infraestructura para negocios que necesitan control.": "Infrastructure for businesses that need control.",
  "Matriz de soluciónes": "Solution Matrix",
  "Del proceso a la plataforma": "From process to platform",
  "Qué construimos": "What we build",
  "Plataformas operativas": "Operating platforms",
  "Sistemas de ventas": "Sales systems",
  "Portales de clientes": "Client portals",
  "Comercio digital": "Digital commerce",
  "Infraestructura de producto": "Product infrastructure",
  "Construyendo la capa operativa para empresas modernas.": "Building the business operating layer for modern companies.",
  "Crear sistemas operativos que hacen más fácil operar un negocio.": "Create operating systems that make businesses easier to run.",
  "Principios": "Principles",
  "Cómo construye YC Systems.": "How YC Systems builds.",
  "Claridad sobre ruido": "Clarity over noise",
  "Pensamiento de producto": "Product thinking",
  "Nexus primero": "Nexus first",
  "Confianza empresarial": "Enterprise trust",
  "Sistemas de negocio por vertical.": "Business systems by vertical.",
  "Estrategia vertical": "Vertical Strategy",
  "Sistemas repetibles para mercados reales": "Repeatable systems for real markets",
  "Mercados": "Markets",
  "Operaciones de lavandería": "Laundry operations",
  "Reparación de crédito": "Credit repair",
  "Servicios locales": "Local services",
  "Operaciones internas": "Internal operations",
  "Registro de empresa": "Company record",
  "Propuesta comercial": "Commercial proposal",
  "Acuerdo de servicio": "Service agreement",
  "Factura y cobros": "Invoice and billing",
  "Páginas legales": "Legal pages",
  "Resumen del negocio": "Business summary",
  "Sistema operativo o solución recomendada": "Operating system or solution recommended",
  "Fases de entrega": "Delivery phases",
  "Ruta de mantenimiento": "Maintenance path",
  "MVP operativo": "Operational MVP",
  "Audiencia": "Audience",
  "Beneficio": "Benefit",
  "Funciones": "Features",
  "Los equipos de ventas operan con conversaciones fragmentadas y reportes manuales.": "Sales teams operate through fragmented conversations and manual reports.",
  "Constructoras, equipos de ventas y gerentes comerciales.": "Construction companies, sales teams and commercial managers.",
  "Visibilidad ejecutiva sobre reservas, actividad, rendimiento y seguimiento.": "Executive visibility across reservations, activity, performance and follow-up.",
  "Gestión de flujos, dashboards, control de reservas, analítica y tracking.": "Workflow management, dashboards, reservation control, analytics and tracking.",
  "Seguimiento disperso, reservas, documentos y comisiones sin una sola fuente de control.": "Scattered follow-up, reservation tracking, documents and commissions without one source of control.",
  "Equipos inmobiliarios, brokers y salas de ventas de proyectos.": "Real estate teams, brokers and project sales offices.",
  "Una sola fuente operativa para cada cliente y etapa comercial.": "One operational source of truth for every client and deal stage.",
  "Pipeline, reservas, documentos, planes de pago, reportes y comisiones.": "Pipeline, reservations, documents, payment plans, reports and commissions.",
  "YC Systems para empresas": "YC Systems for Business",
  "Portafolio de productos": "Product portfolio",
  "Producto central": "Core product",
  "Prueba de cliente": "Client proof",
  "Proyecto de crecimiento": "Growth project",
  "Plataforma futura": "Future platform",
  "Listo para analítica": "Analytics-ready",
  "Documentos comerciales": "Commercial documents",
  "Nombre legal:": "Legal name:",
  "Propósito:": "Purpose:",
  "Partes y alcance": "Parties and scope",
  "Entregables y aprobaciones": "Deliverables and approvals",
  "Cambios fuera de alcance": "Out-of-scope changes",
  "Términos de propiedad intelectual y uso": "IP and usage terms",
  "Datos comerciales de YC Systems LLC": "YC Systems LLC business details",
  "Datos del cliente": "Client details",
  "Ítems y subtotales": "Items and subtotals",
  "Términos de pago": "Payment terms",
  "Sistemas operativos para negocios modernos.": "Operating systems for modern businesses.",
  "Sistemas operativos YC": "YC Systems OS",
  "YC Systems / Sistemas operativos": "YC Systems / Operating Systems",
  "Explorar arquitectura": "Explore architecture",
  "Capa de inteligencia Nexus": "Nexus Intelligence Layer",
  "YC Systems diseña infraestructura digital para que empresas vendan mejor, operen con más claridad y automaticen procesos críticos bajo una sola arquitectura.": "YC Systems designs digital infrastructure so companies can sell better, operate with more clarity and automate critical processes under one architecture.",
  "Ecosistema de productos": "Product ecosystem",
  "Una empresa. Un lenguaje. Múltiples sistemas de negocio.": "One company. One language. Multiple business systems.",
  "Cada OS resuelve un vertical distinto, pero todos comparten principios: datos claros, roles, trazabilidad, automatización y decisiones guiadas por Nexus.": "Each OS solves a different vertical, but all share the same principles: clear data, roles, traceability, automation and decisions guided by Nexus.",
  "Sales Operations Center para inventario, reservas, pagos, reportes y visibilidad ejecutiva.": "Sales Operations Center for inventory, reservations, payments, reporting and executive visibility.",
  "CRM inmobiliario para pipeline, clientes, documentos, agenda, comisiones y seguimiento comercial.": "Real estate CRM for pipeline, clients, documents, calendar, commissions and commercial follow-up.",
  "Operación para lavanderías con pickup, delivery, drivers, pagos, clientes y admin.": "Laundry operations for pickup, delivery, drivers, payments, customers and admin.",
  "Vertical futuro para reparación de crédito: casos, cartas, documentos, portal y cumplimiento operativo.": "Future vertical for credit repair: cases, letters, documents, portal and operational compliance.",
  "La inteligencia que conecta el ecosistema.": "The intelligence that connects the ecosystem.",
  "Nexus no es una mascota. Es el lenguaje operativo de YC Systems: analiza el negocio, recomienda flujos, organiza módulos y convierte procesos dispersos en sistemas medibles.": "Nexus is not a mascot. It is the operating language of YC Systems: it analyzes the business, recommends flows, organizes modules and turns scattered processes into measurable systems.",
  "Sistemas operativos | YC Systems": "Operating Systems | YC Systems",
  "YC Systems construye sistemas operativos empresariales para ventas, operaciones, logística y flujos financieros conectados por Nexus.": "YC Systems builds business operating systems for sales, operations, logistics and financial workflows connected by Nexus.",
  "Sistemas operativos empresariales creados por YC Systems LLC para ventas, operaciones, logística y flujos financieros.": "Business operating systems built by YC Systems LLC for sales, operations, logistics and financial workflows.",
  "El problema": "The problem",
  "Software empresarial": "Business software",
  "Las empresas no fallan por falta de software. Fallan por operar con sistemas desconectados.": "Companies do not fail because they lack software. They fail because they operate with disconnected systems.",
  "Ventas en WhatsApp. Clientes en hojas de cálculo. Pagos en otro lugar. Documentos sin trazabilidad. YC Systems convierte esa operación fragmentada en infraestructura digital clara.": "Sales in WhatsApp. Customers in spreadsheets. Payments somewhere else. Documents without traceability. YC Systems turns fragmented operations into clear digital infrastructure.",
  "Construimos sistemas que convierten operación desordenada en ventas, control y crecimiento.": "We build systems that turn messy operations into sales, control and growth.",
  "YC Systems diseña y desarrolla plataformas para negocios que necesitan vender mejor, controlar procesos, automatizar trabajo manual y ver sus datos en un solo lugar.": "YC Systems designs and develops platforms for businesses that need to sell better, control processes, automate manual work and see their data in one place.",
  "Operación dispersa": "Scattered operations",
  "Procesos críticos dependen de mensajes, archivos y memoria del equipo.": "Critical processes depend on messages, files and team memory.",
  "Poca visibilidad": "Low visibility",
  "Los dueños no ven pipeline, capacidad, ingresos, documentos y riesgos en un solo lugar.": "Owners cannot see pipeline, capacity, revenue, documents and risks in one place.",
  "Crecimiento frágil": "Fragile growth",
  "Cuando el negocio crece, la operación manual empieza a romperse.": "When the business grows, manual operations start to break.",
  "Decisiones lentas": "Slow decisions",
  "Sin datos claros, cada mejora depende de intuición en vez de evidencia.": "Without clear data, every improvement depends on intuition instead of evidence.",
  "Vender": "Sell",
  "Tiendas, catálogos, landing pages y flujos comerciales listos para convertir.": "Stores, catalogs, landing pages and commercial flows ready to convert.",
  "Operar": "Operate",
  "Dashboards, CRM, reservas, documentos, estados y reportes en una sola base.": "Dashboards, CRM, bookings, documents, statuses and reports in one base.",
  "Automatizar": "Automate",
  "Menos tareas repetitivas, más control de procesos y rutas claras para el equipo.": "Fewer repetitive tasks, more process control and clear routes for the team.",
  "Escalar": "Scale",
  "Productos por fases, módulos reutilizables y estructura lista para crecer.": "Phased products, reusable modules and a structure ready to grow.",
  "Oferta YC Systems": "YC Systems offer",
  "YC Systems construye Operating Systems para negocios reales.": "YC Systems builds Operating Systems for real businesses.",
  "No son cuatro aplicaciones aisladas. Son verticales conectados por una misma forma de pensar: módulos, datos, roles, automatización, soporte y Nexus como capa de inteligencia.": "They are not four isolated applications. They are verticals connected by the same way of thinking: modules, data, roles, automation, support and Nexus as an intelligence layer.",
  "Un ecosistema de productos para negocios que necesitan operar mejor.": "A product ecosystem for businesses that need to operate better.",
  "Elige el vertical más cercano a tu operación. YC Systems define la primera fase, construye la plataforma y deja una base profesional para seguir creciendo.": "Choose the vertical closest to your operation. YC Systems defines the first phase, builds the platform and leaves a professional base for continued growth.",
  "Diagnóstico y dirección": "Diagnosis and direction",
  "Define sistema · módulos · próxima fase": "Defines system · modules · next phase",
  "Ventas e inventario": "Sales and inventory",
  "Panel ejecutivo para operaciones comerciales.": "Executive panel for commercial operations.",
  "CRM inmobiliario": "Real estate CRM",
  "Prospectos, agenda, documentos y comisiones.": "Prospects, agenda, documents and commissions.",
  "Lavanderías": "Laundries",
  "Pickup, delivery, tracking, pagos y control.": "Pickup, delivery, tracking, payments and control.",
  "Reparación de crédito": "Credit repair",
  "Casos, cartas, documentos y portal.": "Cases, letters, documents and portal.",
  "Industrias": "Industries",
  "Una misma arquitectura aplicada a operaciones distintas.": "One architecture applied to different operations.",
  "Convierte tu operación en un sistema que pueda crecer.": "Turn your operation into a system that can grow.",
  "Cuéntanos cómo opera tu negocio hoy. YC Systems responde con una ruta inicial: problema principal, sistema recomendado, primera fase y próximos entregables.": "Tell us how your business operates today. YC Systems responds with an initial route: main problem, recommended system, first phase and next deliverables.",
  "Solicitar diagnóstico operativo": "Request operational assessment",
});

Object.assign(textTranslations, {
  "YC Systems LLC convierte ventas, operaciones, clientes y datos en plataformas conectadas para empresas que necesitan crecer con control.": "YC Systems LLC turns sales, operations, customers and data into connected platforms for companies that need to grow with control.",
  "YC Systems LLC · New York · CleanLoop / SOC / BrokerControl / CreditPilot": "YC Systems LLC · New York · CleanLoop / SOC / BrokerControl / CreditPilot",
  "La plataforma YC Systems": "The YC Systems Platform",
  "Una misma arquitectura para conectar diagnóstico, módulos, datos y usuarios.": "One architecture to connect diagnosis, modules, data and users.",
  "Nexus define la dirección; cada sistema operativo resuelve un vertical real. La plataforma permite empezar por una fase y crecer sin rehacer la base.": "Nexus defines the direction; each operating system solves a real vertical. The platform lets you start with one phase and grow without rebuilding the base.",
  "Negocio": "Business",
  "Diagnóstico Nexus": "Nexus Diagnosis",
  "Sistema operativo": "Operating System",
  "Módulos": "Modules",
  "Usuarios": "Users",
  "Cada producto existe para resolver un problema operativo concreto y probar una pieza del ecosistema YC Systems.": "Each product exists to solve a concrete operational problem and prove one part of the YC Systems ecosystem.",
  "Problema": "Problem",
  "Resuelve": "Solves",
  "Industria": "Industry",
  "Pedidos dispersos": "Scattered orders",
  "Rutas, pagos y tracking": "Routes, payments and tracking",
  "Operación para lavanderías con cliente, conductor, admin y pagos en una sola plataforma.": "Laundry operations with customer, driver, admin and payments in one platform.",
  "Ventas sin visibilidad": "Sales without visibility",
  "Inventario y reportes": "Inventory and reports",
  "Equipos comerciales": "Commercial teams",
  "Centro de mando para reservas, pagos, estados, inventario y lectura ejecutiva.": "Command center for reservations, payments, status, inventory and executive visibility.",
  "Prospectos perdidos": "Lost prospects",
  "Pipeline y documentos": "Pipeline and documents",
  "Bienes raíces": "Real estate",
  "CRM para asesores con seguimiento comercial, agenda, documentos y comisiones.": "CRM for advisors with commercial follow-up, agenda, documents and commissions.",
  "Casos complejos": "Complex cases",
  "Cartas y portal": "Letters and portal",
  "Comparación de producto": "Product comparison",
  "Cuatro verticales, una misma lógica de sistema operativo.": "Four verticals, one operating system logic.",
  "La plataforma YC Systems comparte arquitectura, pero cada producto responde a una industria, usuario y problema distinto.": "The YC Systems platform shares architecture, but each product responds to a different industry, user and problem.",
  "Operaciones comerciales": "Commercial operations",
  "Recogida, entrega, rutas, pagos y tracking.": "Pickup, delivery, routes, payments and tracking.",
  "Inventario, reservas, estados, pagos y reportes.": "Inventory, reservations, statuses, payments and reports.",
  "Prospectos, pipeline, agenda, documentos y comisiones.": "Prospects, pipeline, agenda, documents and commissions.",
  "Casos, cartas, documentos, portal y educación financiera.": "Cases, letters, documents, portal and financial education.",
  "Antes": "Before",
  "Después": "After",
  "Impacto": "Impact",
  "Arquitectura": "Architecture",
  "Antes:": "Before:",
  "Después:": "After:",
  "Impacto:": "Impact:",
  "Arquitectura:": "Architecture:",
  "Antes, después, impacto y arquitectura. Ese formato ayuda a clientes e inversionistas a entender qué cambió en el negocio, no solo qué pantalla se publicó.": "Before, after, impact and architecture. This format helps clients and investors understand what changed in the business, not just what screen was published.",
  "Servicio local": "Local service",
  "Marca digital": "Digital brand",
  "Líneas internas": "Internal lines",
  "Diagnóstico operativo": "Operational diagnosis",
  "Veamos qué sistema necesita tu negocio para vender, operar y crecer mejor.": "Let's identify what system your business needs to sell, operate and grow better.",
  "Comparte cómo trabaja tu empresa hoy. YC Systems responde con una ruta inicial: problema prioritario, sistema recomendado, primera fase y próximos entregables.": "Share how your company works today. YC Systems responds with an initial route: priority problem, recommended system, first phase and next deliverables.",
  "1. Describe tu operación actual": "1. Describe your current operation",
  "2. Identifica el problema principal": "2. Identify the main problem",
  "3. Recibe una ruta de sistema por fases": "3. Receive a phased system roadmap",
  "Ver casos de estudio": "View case studies",
  "Industria": "Industry",
  "Problema principal": "Main problem",
  "Sistema deseado": "Desired system",
  "Herramientas actuales": "Current tools",
  "Reunión": "Meeting",
  "Contexto importante": "Important context",
  "Qué se define en el diagnóstico": "What the diagnosis defines",
  "El sistema correcto para vender, operar, automatizar o medir mejor.": "The right system to sell, operate, automate or measure better.",
  "No necesitas llegar con una solución perfecta. YC Systems ordena el problema, define la primera fase y recomienda una arquitectura de producto para avanzar con claridad.": "You do not need to arrive with a perfect solution. YC Systems organizes the problem, defines the first phase and recommends a product architecture to move forward clearly.",
  "Ventas": "Sales",
  "Pipeline y conversión": "Pipeline and conversion",
  "Operación": "Operation",
  "Procesos diarios": "Daily processes",
  "Datos": "Data",
  "Dashboards ejecutivos": "Executive dashboards",
  "Producto": "Product",
  "SaaS o MVP por fases": "Phased SaaS or MVP",
  "Automatización": "Automation",
  "Menos trabajo manual": "Less manual work",
  "Presencia": "Presence",
  "Confianza digital": "Digital trust",
  "Arquitectura de software empresarial para operar con control.": "Enterprise software architecture to operate with control.",
  "YC Systems diseña la base que conecta negocio, datos, módulos, usuarios y automatización para que cada producto pueda crecer por fases.": "YC Systems designs the foundation that connects business, data, modules, users and automation so each product can grow by phases.",
  "CleanLoop, SOC, BrokerControl y CreditPilot forman el ecosistema propio de sistemas operativos por industria.": "CleanLoop, SOC, BrokerControl and CreditPilot form the owned ecosystem of industry operating systems.",
  "Negocios de servicios": "Service businesses",
});

Object.assign(textTranslations, {
  "Sistemas operativos": "Operating systems",
  "Trabajo de clientes": "Client work",
  "Cómo construimos": "How we build",
  "Software empresarial por fases": "Phased enterprise software",
  "Sistemas operativos para operar mejor.": "Operating systems to operate better.",
  "Diseñamos y construimos páginas web, portales, CRM, dashboards, automatizaciones y plataformas SaaS para empresas que necesitan vender, organizarse y crecer por fases.": "We design and build websites, portals, CRMs, dashboards, automations and SaaS platforms for companies that need to sell, organize and grow in phases.",
  "YC Systems LLC · New York · Sitios activos · Sistemas internos · Diagnóstico operativo": "YC Systems LLC · New York · Active sites · Sistemas internos · Operational diagnosis",
  "Ver casos reales": "View real cases",
  "Ejecución visible": "Visible execution",
  "No necesitas saber qué sistema construir. Cuéntanos el problema y te damos una ruta clara por fases.": "You do not need to know what system to build. Tell us the problem and we will give you a clear phased route.",
  "Cómo trabaja YC Systems": "How YC Systems works",
  "Primero entendemos la operación. Luego construimos la solución correcta.": "First we understand the operation. Then we build the right solution.",
  "La misma base puede convertirse en web profesional, CRM, portal, dashboard, automatización o SaaS por fases según el problema real del negocio.": "The same foundation can become a professional website, CRM, portal, dashboard, automation or phased SaaS depending on the real business problem.",
  "Sistema digital": "Digital system",
  "Ruta de sistema": "System route",
  "Problema · alcance · primera fase": "Problem · scope · first phase",
  "Web + venta": "Web + sales",
  "Presencia comercial": "Commercial presence",
  "Sitios, catálogos, landings y flujos de contacto.": "Sites, catalogs, landings and contact flows.",
  "CRM operativo": "Operational CRM",
  "Seguimiento y clientes": "Follow-up and customers",
  "Prospectos, tareas, documentos y estados.": "Prospects, tasks, documents and statuses.",
  "Portal interno": "Internal portal",
  "Roles y operación": "Roles and operation",
  "Clientes, equipos, rutas, pagos y procesos.": "Customers, teams, routes, payments and processes.",
  "Dashboard": "Dashboard",
  "Datos ejecutivos": "Executive data",
  "Indicadores, reportes y decisiones visibles.": "Indicators, reports and visible decisions.",
  "Construimos la solución que tu operación necesita.": "We build the solution your operation needs.",
  "No todos los negocios necesitan lo mismo. Algunos necesitan una web clara; otros necesitan un CRM, un portal, un dashboard o una plataforma por fases.": "Not every business needs the same thing. Some need a clear website; others need a CRM, portal, dashboard or phased platform.",
  "Presencia que convierte": "Presence that converts",
  "Marca sin claridad": "Brand without clarity",
  "Oferta, confianza y contacto": "Offer, trust and contact",
  "Servicios y marcas": "Services and brands",
  "Sitios, landings y catálogos diseñados para explicar, captar y vender con más confianza.": "Sites, landings and catalogs designed to explain, capture and sell with more trust.",
  "Ver sistemas": "View systems",
  "Datos en un solo lugar": "Data in one place",
  "Decisiones dispersas": "Scattered decisions",
  "Estados y reportes": "Statuses and reports",
  "Dirección y equipos": "Leadership and teams",
  "Paneles para ver actividad, ventas, procesos, documentos o métricas sin perseguir información.": "Panels to see activity, sales, processes, documents or metrics without chasing information.",
  "Clientes sin perderse": "Customers without getting lost",
  "Prospectos sin control": "Uncontrolled prospects",
  "Pipeline y tareas": "Pipeline and tasks",
  "Ventas y servicios": "Sales and services",
  "CRM y flujos comerciales para controlar prospectos, próximas acciónes, documentos y cierres.": "CRM and commercial flows to control prospects, next actions, documents and closings.",
  "Producto digital propio": "Owned digital product",
  "Operación repetible": "Repeatable operation",
  "Módulos y usuarios": "Modules and users",
  "Negocios que escalan": "Businesses that scale",
  "Bases SaaS para convertir una operación repetible en una plataforma que pueda crecer por módulos.": "SaaS foundations to turn a repeatable operation into a platform that can grow by modules.",
  "Tipos de sistema": "System types",
  "Una arquitectura flexible para vender, operar, automatizar y medir.": "A flexible architecture to sell, operate, automate and measure.",
  "YC Systems empieza por entender el problema. Después define la primera fase y construye el sistema correcto con espacio para evolucionar.": "YC Systems starts by understanding the problem. Then it defines the first phase and builds the right system with room to evolve.",
  "Web profesional": "Professional website",
  "Tienda o catálogo": "Store or catalog",
  "Portal para clientes": "Client portal",
  "Dashboard ejecutivo": "Executive dashboard",
  "SaaS por fases": "Phased SaaS",
  "Mantenimiento": "Maintenance",
  "Construcción por fases": "Phased construction",
  "El objetivo no es construir más. Es construir lo correcto primero.": "The goal is not to build more. It is to build the right thing first.",
  "La primera versión debe resolver un problema concreto, ser medible y dejar una base sana para crecer sin rehacer todo.": "The first version must solve a concrete problem, be measurable and leave a healthy foundation to grow without rebuilding everything.",
  "Alcance": "Scope",
  "Construcción": "Build",
  "Evolución": "Evolution",
  "Verticales internas en construcción": "Internal verticals under construction",
  "YC Systems también desarrolla laboratorios de producto y arquitectura.": "YC Systems also develops product and architecture labs.",
  "La empresa mantiene líneas internas en lavandería, operaciones comerciales, CRM, finanzas y automatización. Algunas se usan como laboratorio de producto y arquitectura, sin exponerse públicamente como soluciónes finales hasta estar listas estratégica y legalmente.": "The company maintains internal lines in laundry, commercial operations, CRM, finance and automation. Some are used as product and architecture labs without being publicly exposed as final solutions until they are strategically and legally ready.",
  "Siguiente paso": "Next step",
  "No necesitas saber qué sistema construir. Cuéntanos el problema.": "You do not need to know what system to build. Tell us the problem.",
  "YC Systems convierte esa información en una ruta clara: prioridad, primera fase, sistema recomendado y próximos entregables.": "YC Systems turns that information into a clear route: priority, first phase, recommended system and next deliverables.",
  "Trabajo de clientes con sitios activos y resultados visibles.": "Client work with active sites and visible results.",
  "No mostramos demos vacías. Mostramos proyectos publicados, dominios activos y soluciónes que ya pueden ser visitadas por clientes reales.": "We do not show empty demos. We show published projects, active domains and solutions that can already be visited by real customers.",
  "Ver sitios activos": "View active sites",
  "Cada proyecto demuestra una necesidad, una solución y una base lista para crecer.": "Each project demonstrates a need, a solution and a foundation ready to grow.",
  "Leemos cada entrega como evidencia comercial: sitio activo, dominio propio, contacto directo, flujo claro, experiencia móvil y proyecto verificable.": "We read each delivery as commercial evidence: active site, own domain, direct contact, clear flow, mobile experience and verifiable project.",
  "Ejecución visible, no solo promesas.": "Visible execution, not just promises.",
  "Estos proyectos muestran presencia comercial, venta, contacto, marca y operación lista para clientes reales.": "These projects show commercial presence, sales, contact, brand and operation ready for real customers.",
  "Ver sitio activo": "View active site",
  "Verticales internas en construcción": "Internal verticals under construction",
  "Sistemas operativos": "Operating systems",
  "Ver sistemas digitales": "View digital systems",
  "Cuéntanos tu problema. Nosotros te decimos qué construir primero.": "Tell us your problem. We tell you what to build first.",
  "No necesitas saber si necesitas una web, un CRM, un portal o un SaaS. Explica cómo opera tu negocio hoy y YC Systems convierte esa necesidad en una ruta clara por fases.": "You do not need to know whether you need a website, CRM, portal or SaaS. Explain how your business operates today and YC Systems turns that need into a clear phased route.",
  "¿Cómo manejas esto hoy?": "How do you manage this today?",
  "WhatsApp": "WhatsApp",
  "Excel o Google Sheets": "Excel or Google Sheets",
  "Papel o notas manuales": "Paper or manual notes",
  "Llamadas y mensajes sueltos": "Calls and scattered messages",
  "Sistema actual": "Current system",
  "No tengo sistema": "I do not have a system",
  "Otro": "Other",
  "YC Systems LLC convierte operaciones reales en sistemas digitales.": "YC Systems LLC turns real operations into digital systems.",
  "Somos una empresa tecnológica constituida en New York, enfocada en construir soluciónes digitales, sistemas internos, plataformas operativas y software por fases para negocios reales.": "We are a technology company formed in New York, focused on building digital solutions, internal systems, operational platforms and phased software for real businesses.",
  "Crear sistemas digitales que hacen más fácil operar un negocio.": "Create digital systems that make it easier to operate a business.",
  "Confianza legal": "Legal trust",
  "Empresa real, comunicación responsable.": "Real company, responsible communication.",
  "YC Systems LLC es una compañía de responsabilidad limitada constituida en New York. La web mantiene públicos los datos necesarios para confianza comercial y protege información sensible como EIN, acuerdos internos, dirección personal, porcentajes societarios y detalles de productos no protegidos.": "YC Systems LLC is a limited liability company formed in New York. The website keeps only the information needed for commercial trust public and protects sensitive information such as EIN, internal agreements, personal address, ownership percentages and details of unprotected products.",
});

Object.assign(textTranslations, {
  "Trabajo de clientes": "Client Work",
  "Cómo construimos": "How We Build",
  "Propuesta": "Proposal",
  "Empresa de producto + software operativo": "Product company + operating software",
  "Software operativo para negocios reales.": "Operating software for real businesses.",
  "Productos de software y sistemas operativos para operaciones reales.": "Software products and operating systems for real business operations.",
  "YC Systems construye productos SaaS, plataformas internas, CRM, dashboards y automatización para empresas que necesitan claridad, control y crecimiento.": "YC Systems builds SaaS products, internal platforms, CRM, dashboards and automation for companies that need clarity, control and growth.",
  "Ver trabajo de clientes": "See Client Work",
  "YC Systems LLC · New York · Productos + servicios · USA / República Dominicana / Canadá": "YC Systems LLC · New York · Products + Services · USA / Dominican Republic / Canada",
  "Empresa de producto + trabajo de clientes": "Product company + client work",
  "Construcción por fases": "Built in phases",
  "Despliegues privados de producto": "Private product deployments",
  "USA · República Dominicana · Canadá": "USA · Dominican Republic · Canada",
  "Despliegue privado": "Private deployment",
  "Línea privada": "Private line",
  "En desarrollo": "In development",
  "Productos creados por YC Systems": "Products built by YC Systems",
  "Construimos productos propios alrededor de problemas operativos reales.": "We build our own software products around real operational problems.",
  "YC Systems no es solo una lista de servicios. La compañía construye productos, sistemas y plataformas que nacen de operaciones reales, despliegues privados y aprendizaje con clientes.": "YC Systems is not just a list of services. The company builds products, systems and platforms born from real operations, private deployments and client learning.",
  "Algunos productos de YC Systems están disponibles solo mediante despliegue privado, acceso temprano o implementación seleccionada con clientes.": "Some YC Systems products are available only through private deployment, early access or selected client implementation.",
  "Primer producto público": "First public product",
  "CleanLoop: plataforma operativa para lavanderías modernas.": "CleanLoop: operating platform for modern laundry businesses.",
  "CleanLoop ayuda a operadores de lavandería a gestionar órdenes, clientes, recogidas, entregas y flujos de trabajo desde un solo sistema.": "CleanLoop helps laundry operators manage orders, customers, pickups, deliveries and workflows from one system.",
  "Despliegue privado / acceso temprano": "Private deployment / early access",
  "Operadores seleccionados": "Selected operators",
  "Creado por YC Systems": "Built by YC Systems",
  "Solicitar acceso a CleanLoop": "Request CleanLoop Access",
  "Disponible para operadores seleccionados y early implementation partners.": "Available for selected operators and early implementation partners.",
  "Acceso temprano": "Early access",
  "Plataforma operativa para lavanderías modernas.": "Operating platform for modern laundry businesses.",
  "Gestiona órdenes, clientes, recogidas, entregas y operación desde un solo sistema.": "Manage orders, customers, pickups, deliveries and operations from one system.",
  "Ver CleanLoop": "View CleanLoop",
  "Sistema operativo privado para ventas y operaciones de negocio.": "Private operating system for sales and business operations.",
  "Línea de producto YC Systems para flujos comerciales, inventario, reservas, reportes y visibilidad operativa.": "A YC Systems product line for commercial workflows, inventory, reservations, reporting and operational visibility.",
  "Línea privada de producto": "Private product line",
  "Plataforma de operaciones inmobiliarias para brokers y equipos.": "Real estate operations platform for brokers and teams.",
  "Creada para seguimiento de clientes, ventas, documentos, pipeline, agenda y próximos pasos.": "Built for customer tracking, sales workflows, documents, pipeline, agenda and follow-up.",
  "Producto de operaciones financieras en desarrollo interno.": "Financial operations product under internal development.",
  "Línea futura de YC Systems para operaciones financieras guiadas, casos, documentos y portales de clientes.": "A future YC Systems line for guided financial operations, cases, documents and customer portals.",
  "Mentalidad de empresa de producto": "Product-company mindset",
  "Construido con mentalidad de producto, no con improvisación.": "Built with a product-company mindset, not improvisation.",
  "Entregas versionadas, implementación por fases, alcance claro, acuerdos documentados y soporte a largo plazo.": "Versioned delivery, phased implementation, clear scope, documented agreements and long-term support.",
  "Alcance claro": "Clear scope",
  "Entrega por fases": "Phased delivery",
  "Implementación versionada": "Versioned implementation",
  "Acuerdos documentados": "Documented agreements",
  "Estructura lista para soporte": "Support-ready structure",
  "Privacidad y confianza": "Privacy and trust",
  "Definimos alcance, prioridades, entregables y límites antes de construir.": "We define scope, priorities, deliverables and limits before building.",
  "Construimos por fases para lanzar más rápido y reducir riesgo operativo.": "We build in phases to launch faster and reduce operational risk.",
  "El sistema puede evolucionar con nuevas versiones, mejoras y módulos.": "The system can evolve through new versions, improvements and modules.",
  "Propuestas, acuerdos, términos y privacidad mantienen la operación clara.": "Proposals, agreements, terms and privacy keep the operation clear.",
  "El proyecto queda preparado para mantenimiento, soporte y crecimiento.": "The project is prepared for maintenance, support and growth.",
  "YC Systems mantiene páginas legales y de confianza públicas para clientes.": "YC Systems maintains public legal and trust pages for clients.",
  "No empezamos con pantallas. Empezamos con la operación.": "We do not start with screens. We start with the operation.",
  "Entendemos el flujo de trabajo y el problema de negocio antes de convertirlo en alcance, arquitectura, diseño, desarrollo, lanzamiento y soporte.": "We understand the workflow and business problem before turning it into scope, architecture, design, development, launch and support.",
  "Construye con YC Systems": "Build with YC Systems",
  "Servicios que ayudan a construir sistemas reales.": "Services that help build real systems.",
  "Para empresas que necesitan software a medida, sistemas internos, dashboards, automatización o SaaS MVPs sin convertir la improvisación en deuda técnica.": "For companies that need custom software, internal systems, dashboards, automation or SaaS MVPs without turning improvisation into technical debt.",
  "Sitios web empresariales": "Business Websites",
  "Sistemas internos": "Internal Systems",
  "Plataformas privadas para controlar roles, estados, tareas, documentos y operación diaria.": "Private platforms to control roles, statuses, tasks, documents and daily operations.",
  "CRM": "CRM",
  "Seguimiento comercial para prospectos, clientes, próximas acciónes, cotizaciones y cierres.": "Commercial tracking for prospects, customers, next actions, quotes and closings.",
  "Construir CRM": "Build CRM",
  "Dashboards": "Dashboards",
  "Indicadores, reportes y vistas ejecutivas para operar con datos visibles.": "Indicators, reports and executive views to operate with visible data.",
  "Diseñar dashboard": "Design dashboard",
  "Automatización": "Automation",
  "Flujos, alertas, integraciones y reglas para reducir trabajo repetitivo.": "Workflows, alerts, integrations and rules to reduce repetitive work.",
  "Automatizar proceso": "Automate a process",
  "SaaS MVP + soporte": "SaaS MVPs + Support",
  "Mantenimiento y soporte": "Maintenance & Support",
  "Mejoras continuas, ajustes, documentación y evolución de sistemas ya publicados.": "Continuous improvements, adjustments, documentation and evolution of already published systems.",
  "Correcciones": "Fixes",
  "Mejoras": "Improvements",
  "Documentación": "Documentation",
  "Nuevas fases": "New phases",
  "Solicitar soporte": "Request support",
  "Solicitar propuesta": "Request a proposal",
  "Integraciones IA": "AI Integrations",
  "Proyectos de clientes que prueban ejecución.": "Client work that proves execution.",
  "Negocios reales, sitios reales, sistemas reales y entregas reales. Estos proyectos prueban ejecución, pero no se mezclan con productos propios de YC Systems.": "Real businesses, real websites, real systems and real delivery. These projects prove execution, but they are not mixed with YC Systems-owned products.",
  "Método Nexus": "Nexus Method",
  "Nexus es la forma en que YC Systems piensa.": "Nexus is how YC Systems thinks.",
  "Analizar la operación. Diseñar el sistema. Automatizar el flujo. Mejorar continuamente. Nexus convierte operaciones desordenadas en sistemas claros.": "Analyze the operation. Design the system. Automate the workflow. Improve continuously. Nexus turns messy operations into clear systems.",
  "Empresa de software de New York que construye productos, sistemas y plataformas para operaciones reales.": "New York software company building products, systems and platforms for real business operations.",
  "Centro de confianza": "Trust Center",
});

Object.assign(englishTextTranslations, {
  "Client Work": "Trabajo de clientes",
  "How We Build": "Cómo construimos",
  "Proposal": "Propuesta",
  "Product company + operating software": "Empresa de producto + software operativo",
  "Operating software for real businesses.": "Software operativo para negocios reales.",
  "Software products and operating systems for real business operations.": "Productos de software y sistemas operativos para operaciones reales.",
  "YC Systems builds SaaS products, internal platforms, CRM, dashboards and automation for companies that need clarity, control and growth.": "YC Systems construye productos SaaS, plataformas internas, CRM, dashboards y automatización para empresas que necesitan claridad, control y crecimiento.",
  "See Client Work": "Ver trabajo de clientes",
  "YC Systems LLC · New York · Products + Services · USA / Dominican Republic / Canada": "YC Systems LLC · New York · Productos + servicios · USA / República Dominicana / Canadá",
  "Product company + client work": "Empresa de producto + trabajo de clientes",
  "Built in phases": "Construcción por fases",
  "Private product deployments": "Despliegues privados de producto",
  "USA · Dominican Republic · Canada": "USA · República Dominicana · Canadá",
  "Products built by YC Systems": "Productos creados por YC Systems",
  "We build our own software products around real operational problems.": "Construimos productos propios alrededor de problemas operativos reales.",
  "Some YC Systems products are available only through private deployment, early access or selected client implementation.": "Algunos productos de YC Systems están disponibles solo mediante despliegue privado, acceso temprano o implementación seleccionada con clientes.",
  "First public product": "Primer producto público",
  "CleanLoop: operating platform for modern laundry businesses.": "CleanLoop: plataforma operativa para lavanderías modernas.",
  "Request CleanLoop Access": "Solicitar acceso a CleanLoop",
  "Early access": "Acceso temprano",
  "Private deployment": "Despliegue privado",
  "Private line": "Línea privada",
  "In development": "En desarrollo",
  "View CleanLoop": "Ver CleanLoop",
  "Private product line": "Línea privada de producto",
  "Product-company mindset": "Mentalidad de empresa de producto",
  "Built with a product-company mindset, not improvisation.": "Construido con mentalidad de producto, no con improvisación.",
  "Clear scope": "Alcance claro",
  "Phased delivery": "Entrega por fases",
  "Versioned implementation": "Implementación versionada",
  "Documented agreements": "Acuerdos documentados",
  "Support-ready structure": "Estructura lista para soporte",
  "Privacy and trust": "Privacidad y confianza",
  "Build with YC Systems": "Construye con YC Systems",
  "Business Websites": "Sitios web empresariales",
  "Internal Systems": "Sistemas internos",
  "CRM": "CRM",
  "Dashboards": "Dashboards",
  "Automation": "Automatización",
  "SaaS MVPs + Support": "SaaS MVP + soporte",
  "Maintenance & Support": "Mantenimiento y soporte",
  "AI Integrations": "Integraciones IA",
  "Client work that proves execution.": "Proyectos de clientes que prueban ejecución.",
  "Nexus Method": "Método Nexus",
  "Nexus is how YC Systems thinks.": "Nexus es la forma en que YC Systems piensa.",
  "New York software company building products, systems and platforms for real business operations.": "Empresa de software de New York que construye productos, sistemas y plataformas para operaciones reales.",
  "Products": "Productos",
  "Trust Center": "Centro de confianza",
});

Object.assign(textTranslations, {
  "Por qué empresas eligen YC Systems": "Why companies choose YC Systems",
  "Una empresa de software para construir sistemas completos de negocio": "A software company built to create complete business systems",
  "YC Systems combina estrategia de producto, ingeniería, diseño, automatización y soporte para convertir una operación real en una plataforma clara, mantenible y lista para crecer por fases.": "YC Systems combines product strategy, engineering, design, automation and support to turn a real operation into a clear, maintainable platform ready to grow in phases.",
  "Señales de confianza para comprar YC Systems": "Trust signals for choosing YC Systems",
  "Arquitectura moderna": "Modern architecture",
  "Bases preparadas para usuarios, roles, datos, módulos, integraciones y nuevas fases.": "Foundations prepared for users, roles, data, modules, integrations and new phases.",
  "Desarrollo seguro": "Secure development",
  "Alcance definido, privacidad, repositorio, control de cambios y publicación responsable.": "Defined scope, privacy, repository, change control and responsible publishing.",
  "Soporte a largo plazo": "Long-term support",
  "El proyecto queda listo para mantenimiento, mejoras, documentación y evolución.": "The project is ready for maintenance, improvements, documentation and evolution.",
  "Producto + ejecución": "Product + execution",
  "Productos propios, trabajo de clientes, procesos reales y activos publicados verificables.": "Owned products, client work, real processes and verifiable published assets.",
});

Object.assign(englishTextTranslations, {
  "Why companies choose YC Systems": "Por qué empresas eligen YC Systems",
  "A software company built to create complete business systems": "Una empresa de software para construir sistemas completos de negocio",
  "YC Systems combines product strategy, engineering, design, automation and support to turn a real operation into a clear, maintainable platform ready to grow in phases.": "YC Systems combina estrategia de producto, ingeniería, diseño, automatización y soporte para convertir una operación real en una plataforma clara, mantenible y lista para crecer por fases.",
  "Trust signals for choosing YC Systems": "Señales de confianza para comprar YC Systems",
  "Modern architecture": "Arquitectura moderna",
  "Foundations prepared for users, roles, data, modules, integrations and new phases.": "Bases preparadas para usuarios, roles, datos, módulos, integraciones y nuevas fases.",
  "Secure development": "Desarrollo seguro",
  "Defined scope, privacy, repository, change control and responsible publishing.": "Alcance definido, privacidad, repositorio, control de cambios y publicación responsable.",
  "Long-term support": "Soporte a largo plazo",
  "The project is ready for maintenance, improvements, documentation and evolution.": "El proyecto queda listo para mantenimiento, mejoras, documentación y evolución.",
  "Product + execution": "Producto + ejecución",
  "Owned products, client work, real processes and verifiable published assets.": "Productos propios, trabajo de clientes, procesos reales y activos publicados verificables.",
});

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
    const translated = lang === "en" ? textTranslations[trimmed] : englishTextTranslations[trimmed] || spanishTextTranslations[trimmed];
    node.textContent = translated ? original.replace(trimmed, translated) : original;
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
    const translated = lang === "en" ? textTranslations[original.trim()] : englishTextTranslations[original.trim()] || spanishTextTranslations[original.trim()];
    if (key === "text") element.textContent = translated || original;
    else element.setAttribute("placeholder", translated || original);
  });
}

function applyPageMetadata(lang) {
  const path = window.location.pathname.replace(/\/index\.html$/, "/");
  const metadata = pageMetadataTranslations[lang]?.[path];
  if (!metadata) return;

  document.title = metadata.title;
  document.querySelector('meta[name="description"]')?.setAttribute("content", metadata.description);
  document.querySelector('meta[property="og:title"]')?.setAttribute("content", metadata.title);
  document.querySelector('meta[property="og:description"]')?.setAttribute("content", metadata.description);
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
  applyPageMetadata(lang);

  langToggles.forEach((toggle) => {
    toggle.textContent = lang === "es" ? "EN" : "ES";
    toggle.setAttribute("aria-label", lang === "es" ? "Switch to English" : "Cambiar a español");
    toggle.setAttribute("aria-pressed", lang === "en" ? "true" : "false");
  });
}

navToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open");
  document.body.classList.toggle("nav-open", Boolean(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    navToggle?.setAttribute("aria-label", "Open navigation");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

const animatedElements = document.querySelectorAll(
  ".brand-story, .apparel-showcase, .about-grid, .stack-grid"
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

langToggles.forEach((toggle) => {
  toggle.setAttribute("role", "button");
  toggle.setAttribute("tabindex", "0");
});

function toggleLanguage() {
  const nextLang = document.documentElement.lang === "es" ? "en" : "es";
  localStorage.setItem("yc-lang", nextLang);
  applyLanguage(nextLang);
}

langToggles.forEach((toggle) => {
  toggle.addEventListener("click", toggleLanguage);
  toggle.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleLanguage();
    }
  });
});

const currentScript = document.currentScript || document.querySelector('script[src*="script.js"]');
const siteRoot = currentScript ? new URL(".", currentScript.src) : new URL("/", window.location.href);
const contactUrl = new URL("contact/", siteRoot).href;

document.body.classList.toggle("is-contact-page", window.location.pathname.replace(/\/index\.html$/, "/").endsWith("/contact/"));

function buildYCEmailLink(subject = "Nuevo proyecto YC Systems", body = "") {
  const params = new URLSearchParams({ subject });
  if (body) params.set("body", body);
  return `mailto:${YC_CONTACT.email}?${params.toString()}`;
}

function applyContactConfig() {
  document.querySelectorAll("[data-yc-contact-email]").forEach((element) => {
    element.textContent = YC_CONTACT.email;
  });

  document.querySelectorAll("[data-yc-contact-future-email]").forEach((element) => {
    element.textContent = `${element.dataset.ycContactPrefix || ""}${YC_CONTACT.futureEmail}`;
  });

  document.querySelectorAll("[data-yc-contact-instagram]").forEach((element) => {
    element.setAttribute("href", YC_CONTACT.instagram);
  });

  document.querySelectorAll("[data-yc-contact-facebook]").forEach((element) => {
    element.setAttribute("href", YC_CONTACT.facebook);
  });

  document.querySelectorAll("[data-yc-contact-github]").forEach((element) => {
    element.setAttribute("href", YC_CONTACT.github);
  });

  document.querySelectorAll("[data-yc-mailto]").forEach((element) => {
    element.setAttribute("href", buildYCEmailLink(element.dataset.ycMailtoSubject || "Nuevo proyecto YC Systems"));
  });

  document.querySelectorAll("form[data-project-brief]").forEach((form) => {
    form.setAttribute("action", `https://formsubmit.co/${YC_CONTACT.email}`);
    const nextInput = form.querySelector('input[name="_next"]');
    if (nextInput) nextInput.value = new URL("contact/?sent=1", siteRoot).href;
  });
}

applyContactConfig();

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
    industry: data.get("industry") || "Pendiente",
    desired_system: data.get("desired_system") || "Pendiente",
    meeting: data.get("meeting_preference") || "Pendiente",
  });

  if (projectBriefForm.dataset.directSubmit === "true") {
    const status = projectBriefForm.querySelector("[data-brief-status]");
    if (status) status.textContent = "Enviando brief directo a YC Systems...";
    return;
  }

  event.preventDefault();
  const message = [
    "Hola YC Systems, quiero iniciar un diagnóstico operativo.",
    "",
    `Nombre o negocio: ${data.get("name") || "Pendiente"}`,
    `Industria: ${data.get("industry") || "Pendiente"}`,
    `Problema principal: ${data.get("problem") || "Pendiente"}`,
    `Sistema deseado: ${data.get("desired_system") || "Pendiente"}`,
    `Herramientas actuales: ${data.get("current_tools") || "Pendiente"}`,
    `Reunión: ${data.get("meeting_preference") || "Pendiente"}`,
    "",
    "Contexto:",
    data.get("details") || "Pendiente",
  ].join("\n");
  const subject = encodeURIComponent("Diagnóstico operativo para YC Systems");
  const body = encodeURIComponent(message);
  const status = projectBriefForm.querySelector("[data-brief-status]");
  if (status) status.textContent = "Mensaje preparado. Se abrirá tu correo para enviarlo a YC Systems.";
  window.location.href = buildYCEmailLink(decodeURIComponent(subject), decodeURIComponent(body));
});

const intakeQuestions = [
  {
    key: "solution",
    label: "Qué quieres construir",
    options: ["Tienda online", "Página web", "Sistema interno / CRM", "SaaS o app", "Mantenimiento"],
  },
  {
    key: "stage",
    label: "En qué etapa estas",
    options: ["Solo tengo la idea", "Ya tengo contenido", "Ya existe y quiero mejorarlo", "Necesito lanzarlo pronto"],
  },
  {
    key: "priority",
    label: "Qué es lo más importante",
    options: ["Vender más", "Organizar operaciones", "Automatizar procesos", "Verse mas profesional"],
  },
  {
    key: "timeline",
    label: "Tiempo ideal",
    options: ["Esta semana", "Este mes", "1 a 3 meses", "Estoy explorando"],
  },
];

const intakeQuestionsEn = [
  {
    key: "solution",
    label: "What do you want to build",
    options: ["Online store", "Website", "Internal system / CRM", "SaaS or app", "Maintenance"],
  },
  {
    key: "stage",
    label: "What stage are you in",
    options: ["I only have the idea", "I already have content", "It exists and needs improvement", "I need to launch soon"],
  },
  {
    key: "priority",
    label: "What matters most",
    options: ["Sell more", "Organize operations", "Automate processes", "Look more professional"],
  },
  {
    key: "timeline",
    label: "Ideal timeline",
    options: ["This week", "This month", "1 to 3 months", "I am exploring"],
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
        <button type="button" aria-label="Cerrar chat" data-chat-close>x</button>
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

  function isEnglish() {
    return document.documentElement.lang === "en";
  }

  function questionsForLanguage() {
    return isEnglish() ? intakeQuestionsEn : intakeQuestions;
  }

  function updateChatHeader() {
    const title = chat.querySelector(".concept-chat-head strong");
    if (title) title.textContent = isEnglish() ? "Tell me your idea" : "Cuéntame tu idea";
  }

  function setOpen(isOpen) {
    chat.classList.toggle("is-open", isOpen);
    launcher.setAttribute("aria-expanded", String(isOpen));
    updateFloatingChatVisibility();
    if (isOpen) trackYCEvent("chat_open");
  }

  function renderQuestion() {
    updateChatHeader();
    const questions = questionsForLanguage();
    const question = questions[step];
    const progress = `${step + 1} / ${questions.length}`;
    const intro = isEnglish()
      ? "Answer quickly and I will prepare your initial message."
      : "Responde rápido y preparo tu mensaje inicial.";
    body.innerHTML = `
      <div class="chat-message chat-message-yc">${intro}</div>
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
    updateChatHeader();
    const copy = isEnglish()
      ? {
          message: "Perfect. Now leave a contact or short note to include in the email.",
          label: "Contact or note",
          placeholder: "Ex: I want a store for clothing and I can talk this week.",
          button: "Prepare message",
        }
      : {
          message: "Perfecto. Ahora deja un contacto o una nota corta para incluirla en el correo.",
          label: "Contacto o nota",
          placeholder: "Ej: Soy Carlos, quiero una tienda para ropa y puedo hablar esta semana.",
          button: "Preparar mensaje",
        };
    body.innerHTML = `
      <div class="chat-message chat-message-yc">${copy.message}</div>
      <label class="chat-field">
        <span>${copy.label}</span>
        <textarea rows="4" data-chat-note placeholder="${copy.placeholder}"></textarea>
      </label>
      <button class="chat-primary" type="button" data-chat-finish>${copy.button}</button>
    `;
  }

  function buildSummary(note = "") {
    const lines = isEnglish()
      ? [
          "Hello YC Systems, I want to start a proposal.",
          "",
          `Solution type: ${answers.solution}`,
          `Current stage: ${answers.stage}`,
          `Priority: ${answers.priority}`,
          `Ideal timeline: ${answers.timeline}`,
        ]
      : [
          "Hola YC Systems, quiero iniciar una propuesta.",
          "",
          `Tipo de solución: ${answers.solution}`,
          `Etapa actual: ${answers.stage}`,
          `Prioridad: ${answers.priority}`,
          `Tiempo ideal: ${answers.timeline}`,
        ];

    if (note.trim()) {
      lines.push("", `${isEnglish() ? "Note/contact" : "Nota/contacto"}: ${note.trim()}`);
    }

    return lines.join("\n");
  }

  function renderResult() {
    updateChatHeader();
    const note = body.querySelector("[data-chat-note]")?.value || "";
    const summary = buildSummary(note);
    const mailSubject = encodeURIComponent("Nueva idea para YC Systems");
    const mailBody = encodeURIComponent(summary);
    const copy = isEnglish()
      ? {
          message: "Done. This is the initial concept I will receive to respond with a proposal.",
          send: "Send by email",
          contact: "View contact",
        }
      : {
          message: "Listo. Este es el concepto inicial que recibiré para responder con una propuesta.",
          send: "Enviar por Gmail",
          contact: "Ver contacto",
        };

    body.innerHTML = `
      <div class="chat-message chat-message-yc">${copy.message}</div>
      <pre class="chat-summary">${summary}</pre>
      <div class="chat-actions">
        <a class="chat-primary" href="${buildYCEmailLink(decodeURIComponent(mailSubject), decodeURIComponent(mailBody))}">${copy.send}</a>
        <a href="${contactUrl}">${copy.contact}</a>
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

  function updateFloatingChatVisibility() {
    const canShow = window.scrollY > 160 || chat.classList.contains("is-open");
    document.body.classList.toggle("show-concept-chat", canShow);
  }

  window.addEventListener("scroll", updateFloatingChatVisibility, { passive: true });
  updateFloatingChatVisibility();

  body.addEventListener("click", (event) => {
    const answer = event.target.closest("[data-chat-answer]");
    if (answer) {
      const questions = questionsForLanguage();
      answers[questions[step].key] = answer.dataset.chatAnswer;
      trackYCEvent("chat_answer", {
        step: questions[step].key,
        answer: answer.dataset.chatAnswer,
      });
      step += 1;
      if (step < questions.length) renderQuestion();
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
    updateFloatingChatVisibility();
  }
}

createConceptChat();
