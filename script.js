const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const header = document.querySelector("[data-header]");
const langToggle = document.querySelector("[data-lang-toggle]");
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
    "identity.portfolio.value": "04 proyectos",
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

function applyLanguage(lang) {
  document.documentElement.lang = lang;
  document.body.classList.toggle("lang-es", lang === "es");

  translatableElements.forEach((element) => {
    const key = element.dataset.i18n;
    element.textContent = translations[lang]?.[key] ?? defaultTextByKey[key] ?? element.textContent;
  });

  if (langToggle) langToggle.textContent = lang === "es" ? "EN" : "ES";
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
  ".section-head, .product-card, .brand-story, .apparel-showcase, .about-grid, .stack-grid"
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

langToggle?.addEventListener("click", () => {
  const nextLang = document.documentElement.lang === "es" ? "en" : "es";
  localStorage.setItem("yc-lang", nextLang);
  applyLanguage(nextLang);
});
