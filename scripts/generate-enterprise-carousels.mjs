import fs from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const runtimeRequire = createRequire("file:///C:/Users/Yeica/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/.pnpm/node_modules/noop.js");
const { chromium } = runtimeRequire(
  "C:/Users/Yeica/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/.pnpm/playwright@1.61.1/node_modules/playwright",
);

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "output", "social", "enterprise-launch-2026");
const FINAL_DIR = path.join(OUT_DIR, "_listo-para-publicar");
const CONTENT_DIR = path.join(ROOT, "content");
const LOGO_PATH = path.join(ROOT, "assets", "brand", "yc-logo-horizontal-white.png");
const MARK_PATH = path.join(ROOT, "assets", "brand", "yc-logo-mark-white.png");
const BG_PATH = path.join(OUT_DIR, "premium-assets", "yc-systems-premium-carousel-background-v1.png");

const W = 1080;
const H = 1350;

const campaign = [
  {
    day: "Día 01",
    slug: "dia-01-yc-systems-llc",
    title: "YC Systems LLC",
    caption:
      "YC Systems LLC ya está construyendo software para negocios reales. Creamos bases digitales para vender mejor, operar con más control y crecer con estructura.\n\nAgenda un diagnóstico operativo: ycsystems.io/contact",
    slides: [
      {
        eyebrow: "YC SYSTEMS LLC",
        title: "Software para negocios que quieren operar mejor.",
        body: "Construimos sistemas, automatizaciones y presencia digital para empresas que necesitan más claridad, control y velocidad.",
        tag: "Empresa de software",
      },
      {
        eyebrow: "NUESTRA POSICIÓN",
        title: "No vendemos solo páginas. Construimos estructura digital.",
        body: "Una web te presenta. Un sistema sostiene tu operación, centraliza información y permite crecer sin depender del desorden.",
        bullets: ["Operación", "Ventas", "Datos", "Automatización"],
      },
      {
        eyebrow: "PROBLEMA REAL",
        title: "Cuando todo está disperso, el negocio pierde control.",
        body: "Chats, hojas, notas, archivos y decisiones sueltas hacen que cada crecimiento sea más difícil de manejar.",
        stat: "Orden",
      },
      {
        eyebrow: "SOLUCIÓN YC",
        title: "Convertimos procesos en sistemas claros.",
        body: "Diseñamos flujos, paneles, roles, módulos y reportes para que el negocio funcione con menos improvisación.",
        bullets: ["Flujos", "Paneles", "Roles", "Reportes"],
      },
      {
        eyebrow: "MÉTODO",
        title: "Primero diagnosticamos. Luego construimos.",
        body: "Antes de programar, entendemos el negocio, detectamos el problema principal y definimos una primera fase útil.",
        tag: "Diagnóstico operativo",
      },
      {
        eyebrow: "PRUEBA",
        title: "Ya publicamos proyectos reales.",
        body: "Hemos trabajado presencia digital, e-commerce, marcas, servicios y estructuras web para negocios en operación.",
        bullets: ["GhostWear", "LPS Company", "Antony Real Estate"],
      },
      {
        eyebrow: "DIRECCIÓN",
        title: "La siguiente etapa es software empresarial.",
        body: "YC Systems evoluciona hacia sistemas operativos digitales, automatización y plataformas por industria.",
        stat: "SaaS",
      },
      {
        eyebrow: "ACCIÓN",
        title: "Solicita un diagnóstico operativo.",
        body: "Si tu empresa necesita vender, organizar, automatizar o medir mejor, empecemos por identificar la primera fase correcta.",
        cta: "ycsystems.io/contact",
      },
    ],
  },
  {
    day: "Día 02",
    slug: "dia-02-web-vs-sistema",
    title: "Web vs sistema",
    caption:
      "Una página web presenta tu negocio. Un sistema lo organiza. YC Systems diseña la base digital para que vender, operar y medir sea más claro.\n\nEmpieza por diagnóstico: ycsystems.io/contact",
    slides: [
      {
        eyebrow: "DECISIÓN CLAVE",
        title: "Tu negocio no siempre necesita otra página.",
        body: "A veces necesita una estructura que conecte clientes, ventas, tareas, documentos y reportes.",
        tag: "Web vs sistema",
      },
      {
        eyebrow: "PÁGINA WEB",
        title: "Una página informa.",
        body: "Muestra quién eres, qué vendes, qué haces y cómo contactarte. Es importante, pero no resuelve todo.",
        bullets: ["Marca", "Servicios", "Contacto", "Confianza"],
      },
      {
        eyebrow: "SISTEMA",
        title: "Un sistema organiza.",
        body: "Centraliza datos, estados, procesos, roles, alertas y decisiones para que la operación sea repetible.",
        bullets: ["Clientes", "Ventas", "Estados", "Reportes"],
      },
      {
        eyebrow: "CRECIMIENTO",
        title: "La web atrae. El sistema sostiene.",
        body: "Si el negocio crece, también crece la necesidad de control, seguimiento y trazabilidad.",
        stat: "Base digital",
      },
      {
        eyebrow: "RIESGO",
        title: "Más ventas sin sistema puede crear más caos.",
        body: "El problema no es crecer. El problema es crecer sin una base que soporte la operación.",
        tag: "Control antes de escalar",
      },
      {
        eyebrow: "YC SYSTEMS",
        title: "Construimos por fases, no por impulsos.",
        body: "Definimos una primera versión útil, medible y preparada para evolucionar sin rehacer todo.",
        bullets: ["Fase 1", "Módulos", "Medición", "Evolución"],
      },
      {
        eyebrow: "PREGUNTA CORRECTA",
        title: "¿Qué proceso necesita mejorar primero?",
        body: "La respuesta define si necesitas una web, un sistema, una automatización o una combinación.",
        stat: "Diagnóstico",
      },
      {
        eyebrow: "ACCIÓN",
        title: "Hablemos de tu operación.",
        body: "YC Systems puede ayudarte a decidir qué construir primero para generar impacto real.",
        cta: "ycsystems.io/contact",
      },
    ],
  },
  {
    day: "Día 03",
    slug: "dia-03-operacion-desordenada",
    title: "Operación desordenada",
    caption:
      "Si tu empresa depende demasiado de WhatsApp, Excel y memoria, no necesitas más presión. Necesitas sistema. YC Systems convierte procesos dispersos en una base digital clara.\n\nycsystems.io/contact",
    slides: [
      {
        eyebrow: "SEÑALES",
        title: "¿Tu operación vive en WhatsApp, Excel y memoria?",
        body: "Cuando todo depende de mensajes y archivos sueltos, el seguimiento se vuelve lento y frágil.",
        tag: "Alerta operativa",
      },
      {
        eyebrow: "SEÑAL 01",
        title: "Clientes sin seguimiento.",
        body: "Los prospectos se enfrían, las respuestas llegan tarde y nadie tiene una vista completa del avance.",
        stat: "Ventas",
      },
      {
        eyebrow: "SEÑAL 02",
        title: "Tareas que se repiten todos los días.",
        body: "Copiar, reenviar, buscar, confirmar y actualizar manualmente consume tiempo que debería crear valor.",
        bullets: ["Copiar", "Buscar", "Confirmar", "Actualizar"],
      },
      {
        eyebrow: "SEÑAL 03",
        title: "Datos regados en demasiados lugares.",
        body: "Si la información está en chats, hojas, notas y archivos, decidir se vuelve lento.",
        stat: "Datos",
      },
      {
        eyebrow: "SEÑAL 04",
        title: "Reportes que nadie puede ver rápido.",
        body: "Sin indicadores claros, el negocio decide por percepción y no por información.",
        bullets: ["Estados", "Actividad", "Resultados", "Alertas"],
      },
      {
        eyebrow: "SOLUCIÓN",
        title: "Ese caos se puede convertir en software.",
        body: "Los procesos dispersos pueden transformarse en paneles, flujos, roles, módulos y automatizaciones.",
        tag: "Sistema operativo digital",
      },
      {
        eyebrow: "CÓMO EMPEZAMOS",
        title: "Ordenamos el problema antes de diseñar.",
        body: "YC Systems identifica dónde está la mayor fricción y define una primera fase realista.",
        stat: "Claridad",
      },
      {
        eyebrow: "ACCIÓN",
        title: "Empieza con un diagnóstico.",
        body: "Si tu operación ya se siente pesada, podemos ayudarte a convertirla en una base digital más clara.",
        cta: "ycsystems.io/contact",
      },
    ],
  },
  {
    day: "Día 04",
    slug: "dia-04-prueba-real",
    title: "Prueba real",
    caption:
      "YC Systems no nace desde la teoría. Ya hay proyectos publicados, clientes reales y ejecución visible. Ahora subimos el nivel hacia sistemas empresariales.\n\nVer casos: ycsystems.io/case-studies",
    slides: [
      {
        eyebrow: "PRUEBA REAL",
        title: "Ya hemos construido para negocios reales.",
        body: "La confianza no se declara. Se demuestra con proyectos entregados, publicados y útiles.",
        tag: "Ejecución visible",
      },
      {
        eyebrow: "CASO 01",
        title: "Marcas que necesitaban vender online.",
        body: "Estructuramos presencia digital, catálogo y ruta de compra para presentar productos con más claridad.",
        stat: "E-commerce",
      },
      {
        eyebrow: "CASO 02",
        title: "Servicios que necesitaban verse profesionales.",
        body: "Organizamos información, confianza, contacto y experiencia móvil para negocios de servicio.",
        stat: "Servicios",
      },
      {
        eyebrow: "CASO 03",
        title: "Empresas que necesitaban presencia corporativa.",
        body: "Creamos estructuras web para comunicar servicios, marcas conectadas y operación de forma más seria.",
        stat: "Corporativo",
      },
      {
        eyebrow: "LO QUE APRENDIMOS",
        title: "Cada proyecto reveló una necesidad más profunda.",
        body: "Detrás de cada web hay procesos, clientes, ventas, seguimiento y decisiones que también necesitan estructura.",
        bullets: ["Procesos", "Clientes", "Ventas", "Decisiones"],
      },
      {
        eyebrow: "EVOLUCIÓN",
        title: "La web fue el inicio. El software es la dirección.",
        body: "YC Systems está enfocada en construir bases digitales que soporten operaciones reales.",
        tag: "Siguiente nivel",
      },
      {
        eyebrow: "CRITERIO",
        title: "Promoción con responsabilidad.",
        body: "Publicamos lo que ya puede mostrarse y protegemos lo que aún está en proceso legal o estratégico.",
        stat: "Confianza",
      },
      {
        eyebrow: "ACCIÓN",
        title: "Mira nuestros casos públicos.",
        body: "Si tu negocio necesita evolucionar de presencia a sistema, este es el momento de hablar.",
        cta: "ycsystems.io/case-studies",
      },
    ],
  },
  {
    day: "Día 05",
    slug: "dia-05-diagnostico-operativo",
    title: "Diagnóstico operativo",
    caption:
      "Antes de construir software, hay que saber qué problema merece ser construido primero. YC Systems empieza por diagnóstico operativo.\n\nSolicítalo aquí: ycsystems.io/contact",
    slides: [
      {
        eyebrow: "MÉTODO YC SYSTEMS",
        title: "Antes de construir, diagnosticamos.",
        body: "El software correcto nace de entender el negocio, no de programar sin dirección.",
        tag: "Diagnóstico operativo",
      },
      {
        eyebrow: "PASO 01",
        title: "Entendemos cómo opera tu empresa.",
        body: "Qué vendes, cómo entra un cliente, quién participa, qué se repite y dónde se pierde tiempo.",
        bullets: ["Ventas", "Clientes", "Equipo", "Procesos"],
      },
      {
        eyebrow: "PASO 02",
        title: "Detectamos el problema de mayor impacto.",
        body: "No todo se resuelve al mismo tiempo. Elegimos el punto que desbloquea más valor primero.",
        stat: "Prioridad",
      },
      {
        eyebrow: "PASO 03",
        title: "Definimos una primera fase útil.",
        body: "La primera versión debe resolver algo concreto, ser medible y abrir camino para crecer.",
        bullets: ["Alcance", "Módulos", "Roles", "Entrega"],
      },
      {
        eyebrow: "PASO 04",
        title: "Diseñamos la arquitectura correcta.",
        body: "Puede ser portal, CRM, dashboard, flujo automatizado, integración o plataforma modular.",
        stat: "Arquitectura",
      },
      {
        eyebrow: "PASO 05",
        title: "Construimos con visión de producto.",
        body: "La solución debe funcionar hoy y estar preparada para evolucionar mañana.",
        bullets: ["Base", "Automatización", "Reportes", "Mejora"],
      },
      {
        eyebrow: "PASO 06",
        title: "Medimos, aprendemos y mejoramos.",
        body: "Después de lanzar, observamos uso, fricción y oportunidades para seguir creciendo.",
        stat: "Mejora continua",
      },
      {
        eyebrow: "ACCIÓN",
        title: "Agenda tu diagnóstico operativo.",
        body: "YC Systems puede ayudarte a convertir una operación desordenada en una base digital más clara.",
        cta: "ycsystems.io/contact",
      },
    ],
  },
];

const esc = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

function chunkWords(text, maxChars) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function multiline(text, x, y, size, weight, color, maxChars, lineHeight, maxLines = 8) {
  const lines = chunkWords(text, maxChars).slice(0, maxLines);
  return lines
    .map(
      (line, index) =>
        `<text x="${x}" y="${y + index * lineHeight}" fill="${color}" font-size="${size}" font-weight="${weight}" font-family="Inter, Arial, sans-serif">${esc(line)}</text>`,
    )
    .join("\n");
}

function bulletCards(items = [], x = 86, y = 802) {
  if (!items.length) return "";
  return items
    .slice(0, 4)
    .map((item, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const bx = x + col * 424;
      const by = y + row * 116;
      return `
        <rect x="${bx}" y="${by}" width="388" height="84" rx="24" fill="rgba(3,14,29,0.86)" stroke="rgba(0,216,255,0.32)" />
        <circle cx="${bx + 39}" cy="${by + 42}" r="14" fill="url(#actionGradient)" />
        <text x="${bx + 68}" y="${by + 51}" fill="#f8fbff" font-size="27" font-weight="900" font-family="Inter, Arial, sans-serif">${esc(item)}</text>
      `;
    })
    .join("\n");
}

function lockup(type, value) {
  if (!value) return "";
  if (type === "cta") {
    return `<g filter="url(#softShadow)">
      <rect x="86" y="874" width="676" height="116" rx="58" fill="url(#actionGradient)" />
      <text x="136" y="944" fill="#03101d" font-size="33" font-weight="950" font-family="Inter, Arial, sans-serif">${esc(value)}</text>
    </g>`;
  }
  if (type === "stat") {
    return `<g filter="url(#softShadow)">
      <rect x="86" y="832" width="446" height="164" rx="36" fill="rgba(3,14,29,0.88)" stroke="rgba(0,216,255,0.34)" />
      <text x="128" y="900" fill="#5CFF5C" font-size="25" font-weight="950" letter-spacing="4" font-family="Inter, Arial, sans-serif">FOCO</text>
      <text x="128" y="959" fill="#f8fbff" font-size="48" font-weight="950" font-family="Inter, Arial, sans-serif">${esc(value)}</text>
    </g>`;
  }
  return `<g filter="url(#softShadow)">
    <rect x="86" y="852" width="626" height="106" rx="53" fill="rgba(0,216,255,0.12)" stroke="rgba(0,216,255,0.38)" />
    <circle cx="143" cy="905" r="18" fill="url(#actionGradient)" />
    <text x="181" y="917" fill="#f8fbff" font-size="31" font-weight="920" font-family="Inter, Arial, sans-serif">${esc(value)}</text>
  </g>`;
}

function svgSlide(day, slide, index) {
  const isCover = index === 0;
  const titleSize = slide.title.length > 54 ? 58 : slide.title.length > 42 ? 64 : slide.title.length > 30 ? 74 : 86;
  const titleMax = titleSize >= 80 ? 18 : titleSize >= 70 ? 20 : 24;
  const titleY = isCover ? 332 : 314;
  const titleLines = chunkWords(slide.title, titleMax).length;
  const bodyY = titleY + titleLines * (titleSize * 0.95) + 56;
  const bodySize = slide.body.length > 135 ? 30 : 33;
  const motif = index % 4;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="topFade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#020817" stop-opacity="0.94" />
      <stop offset="42%" stop-color="#020817" stop-opacity="0.7" />
      <stop offset="100%" stop-color="#020817" stop-opacity="0.92" />
    </linearGradient>
    <linearGradient id="actionGradient" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#00D8FF" />
      <stop offset="100%" stop-color="#5CFF5C" />
    </linearGradient>
    <radialGradient id="brandGlow" cx="74%" cy="22%" r="58%">
      <stop offset="0%" stop-color="#00D8FF" stop-opacity="0.3" />
      <stop offset="55%" stop-color="#2563EB" stop-opacity="0.08" />
      <stop offset="100%" stop-color="#020817" stop-opacity="0" />
    </radialGradient>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="28" stdDeviation="34" flood-color="#000000" flood-opacity="0.42"/>
    </filter>
  </defs>
  <image href="${bgHref}" x="0" y="0" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice" />
  <rect width="${W}" height="${H}" fill="url(#topFade)" />
  <rect width="${W}" height="${H}" fill="url(#brandGlow)" />
  <rect x="44" y="44" width="992" height="1262" rx="38" fill="rgba(2,8,23,0.1)" stroke="#00D8FF" stroke-opacity="0.2" stroke-width="1.5" />
  <rect x="70" y="70" width="940" height="1210" rx="32" fill="none" stroke="#5CFF5C" stroke-opacity="0.055" stroke-width="1" />

  ${
    motif === 0
      ? `<rect x="612" y="214" width="330" height="330" rx="44" fill="rgba(0,216,255,0.045)" stroke="rgba(0,216,255,0.16)" transform="rotate(8 777 379)" />`
      : motif === 1
        ? `<path d="M608 246C780 216 924 302 956 462C988 622 858 760 676 744" fill="none" stroke="#00D8FF" stroke-opacity="0.15" stroke-width="2"/><path d="M650 318C780 292 884 354 906 470C928 586 834 686 702 674" fill="none" stroke="#5CFF5C" stroke-opacity="0.13" stroke-width="2"/>`
        : motif === 2
          ? `<rect x="636" y="258" width="292" height="92" rx="28" fill="rgba(3,14,29,0.72)" stroke="rgba(0,216,255,0.22)"/><rect x="690" y="382" width="292" height="92" rx="28" fill="rgba(3,14,29,0.56)" stroke="rgba(92,255,92,0.19)"/><rect x="584" y="506" width="292" height="92" rx="28" fill="rgba(3,14,29,0.66)" stroke="rgba(0,216,255,0.2)"/>`
          : `<circle cx="816" cy="382" r="156" fill="rgba(0,216,255,0.045)" stroke="rgba(0,216,255,0.17)" /><circle cx="816" cy="382" r="92" fill="none" stroke="rgba(92,255,92,0.14)" />`
  }

  <image href="${logoHref}" x="86" y="72" width="238" height="76" preserveAspectRatio="xMinYMid meet" />
  <text x="884" y="108" fill="#a9bdd5" font-size="24" font-weight="850" text-anchor="end" font-family="Inter, Arial, sans-serif">${esc(day.day)}</text>
  <text x="994" y="108" fill="#00D8FF" font-size="24" font-weight="950" text-anchor="end" font-family="Inter, Arial, sans-serif">${String(index + 1).padStart(2, "0")}/08</text>
  <path d="M86 164H994" stroke="#00D8FF" stroke-opacity="0.18" stroke-width="1"/>

  <text x="86" y="244" fill="#00D8FF" font-size="24" font-weight="950" letter-spacing="7" font-family="Inter, Arial, sans-serif">${esc(slide.eyebrow)}</text>
  ${multiline(slide.title, 86, titleY, titleSize, 930, "#f8fbff", titleMax, titleSize * 0.94, 5)}
  ${multiline(slide.body, 90, bodyY, bodySize, 620, "#c3d5eb", 42, bodySize * 1.54, 5)}

  ${
    slide.bullets
      ? bulletCards(slide.bullets, 86, 822)
      : slide.stat
        ? lockup("stat", slide.stat)
        : slide.cta
          ? lockup("cta", slide.cta)
          : lockup("tag", slide.tag)
  }

  <g opacity="0.96">
    <image href="${markHref}" x="854" y="1044" width="104" height="64" preserveAspectRatio="xMidYMid meet" />
    <path d="M86 1232H994" stroke="#00D8FF" stroke-opacity="0.18" stroke-width="1"/>
    <text x="86" y="1268" fill="#f8fbff" font-size="23" font-weight="850" font-family="Inter, Arial, sans-serif">YC Systems LLC</text>
    <text x="86" y="1296" fill="#8fa8c5" font-size="20" font-weight="650" font-family="Inter, Arial, sans-serif">Soluciones inteligentes. Resultados reales.</text>
    <text x="994" y="1290" fill="#00D8FF" font-size="22" font-weight="900" text-anchor="end" font-family="Inter, Arial, sans-serif">ycsystems.io</text>
  </g>
</svg>`;
}

let logoHref = "";
let markHref = "";
let bgHref = "";

async function imageDataUri(file) {
  const bytes = await fs.readFile(file);
  const ext = path.extname(file).toLowerCase().slice(1);
  const mime = ext === "svg" ? "image/svg+xml" : `image/${ext === "jpg" ? "jpeg" : ext}`;
  return `data:${mime};base64,${bytes.toString("base64")}`;
}

async function writeSlide(page, day, slide, index, dayDir, finalDayDir) {
  const svg = svgSlide(day, slide, index);
  const filename = `slide-${String(index + 1).padStart(2, "0")}.png`;
  const outPath = path.join(dayDir, filename);
  const finalPath = path.join(finalDayDir, filename);
  await page.setViewportSize({ width: W, height: H });
  await page.setContent(`<!doctype html><html><body style="margin:0;background:#020817">${svg}</body></html>`, {
    waitUntil: "load",
  });
  await page.screenshot({ path: outPath, fullPage: false });
  await fs.copyFile(outPath, finalPath);
  return outPath;
}

async function createContactSheet(page, day, slidePaths, dayDir) {
  const sheetW = 1264;
  const sheetH = 908;
  const slideSources = await Promise.all(
    slidePaths.map(async (slidePath) => `data:image/png;base64,${(await fs.readFile(slidePath)).toString("base64")}`),
  );
  const items = slideSources
    .map((src, index) => `<figure><img src="${src}" alt="Slide ${index + 1}" /><figcaption>${String(index + 1).padStart(2, "0")}</figcaption></figure>`)
    .join("");
  await page.setViewportSize({ width: sheetW, height: sheetH });
  await page.setContent(
    `<!doctype html>
    <html>
      <head>
        <style>
          body { margin: 0; width: ${sheetW}px; height: ${sheetH}px; overflow: hidden; background: #020817; color: #f8fbff; font-family: Inter, Arial, sans-serif; }
          header { height: 92px; display: flex; align-items: center; justify-content: space-between; padding: 0 44px; border-bottom: 1px solid rgba(0,216,255,.18); box-sizing: border-box; }
          h1 { margin: 0; font-size: 31px; line-height: 1; }
          span { color: #00d8ff; font-weight: 900; font-size: 20px; }
          main { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; padding: 30px 44px 44px; box-sizing: border-box; }
          figure { margin: 0; position: relative; border: 1px solid rgba(0,216,255,.22); border-radius: 18px; overflow: hidden; background: #071426; }
          img { display: block; width: 100%; aspect-ratio: 1080 / 1350; object-fit: cover; }
          figcaption { position: absolute; right: 10px; top: 10px; border-radius: 999px; padding: 6px 9px; background: rgba(2,8,23,.82); color: #5cff5c; font-size: 13px; font-weight: 900; }
        </style>
      </head>
      <body>
        <header><h1>${esc(day.day)} · ${esc(day.title)}</h1><span>YC Systems LLC</span></header>
        <main>${items}</main>
      </body>
    </html>`,
    { waitUntil: "load" },
  );
  const sheetPath = path.join(dayDir, "_contact-sheet.jpg");
  await page.screenshot({ path: sheetPath, type: "jpeg", quality: 94, fullPage: false });
  return sheetPath;
}

async function writeCampaignDocs() {
  const lines = [
    "# YC Systems LLC - Campaña promocional premium de 5 días",
    "",
    "Formato: carrusel vertical 1080x1350.",
    "Idioma: español.",
    "Uso: Instagram, LinkedIn y promoción institucional.",
    "Criterio legal: no revelar nombres, pantallas ni detalles de productos internos no registrados.",
    "",
    `Carpeta final para publicar: ${FINAL_DIR}`,
    "",
  ];

  for (const day of campaign) {
    lines.push(`## ${day.day}: ${day.title}`, "", "Caption sugerido:", "", day.caption, "", "Slides:");
    day.slides.forEach((slide, index) => {
      lines.push(`${index + 1}. ${slide.title} - ${slide.body}`);
    });
    lines.push("");
  }

  await fs.mkdir(CONTENT_DIR, { recursive: true });
  await fs.writeFile(path.join(CONTENT_DIR, "yc-systems-5-day-premium-carousel-campaign.md"), lines.join("\n"), "utf8");
}

async function writeCaptions() {
  const lines = campaign.flatMap((day) => [
    `${day.day} - ${day.title}`,
    "",
    day.caption,
    "",
    "Hashtags sugeridos:",
    "#YCSystems #SoftwareEmpresarial #SaaS #Automatizacion #NegociosDigitales #SistemasOperativos #TecnologiaParaEmpresas",
    "",
    "----------------------------------------",
    "",
  ]);
  await fs.writeFile(path.join(FINAL_DIR, "captions-espanol.txt"), lines.join("\n"), "utf8");
}

async function writePreviewHtml(days) {
  const cards = days
    .map(
      (day) => `
        <section>
          <h2>${esc(day.day)} · ${esc(day.title)}</h2>
          <img src="./${day.slug}/_contact-sheet.jpg" alt="${esc(day.title)}" />
          <p>${esc(day.caption).replaceAll("\n", "<br />")}</p>
        </section>`,
    )
    .join("\n");

  const html = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>YC Systems - Campaña promocional premium</title>
  <style>
    body { margin: 0; background: #020817; color: #f8fbff; font-family: Inter, Arial, sans-serif; }
    main { width: min(1180px, calc(100% - 32px)); margin: 0 auto; padding: 48px 0; }
    h1 { font-size: clamp(34px, 5vw, 68px); line-height: .96; margin: 0 0 16px; }
    .lead { color: #a9bdd5; max-width: 760px; font-size: 20px; line-height: 1.55; }
    section { border-top: 1px solid rgba(0,216,255,.18); padding: 34px 0; }
    h2 { color: #00d8ff; font-size: 24px; letter-spacing: .04em; }
    img { display: block; width: 100%; border: 1px solid rgba(0,216,255,.2); border-radius: 18px; }
    p { color: #b9cce4; font-size: 18px; line-height: 1.55; }
    code { color: #5cff5c; }
  </style>
</head>
<body>
  <main>
    <h1>Campaña promocional premium de 5 días</h1>
    <p class="lead">Carruseles institucionales para YC Systems LLC, listos para promoción. Enfoque: empresa de software, diagnóstico operativo, casos reales y venta sin revelar productos internos.</p>
    <p class="lead">Carpeta final: <code>${esc(FINAL_DIR)}</code></p>
    ${cards}
  </main>
</body>
</html>`;
  await fs.writeFile(path.join(OUT_DIR, "preview.html"), html, "utf8");
}

async function main() {
  logoHref = await imageDataUri(LOGO_PATH);
  markHref = await imageDataUri(MARK_PATH);
  bgHref = await imageDataUri(BG_PATH);

  const premiumAssets = path.join(OUT_DIR, "premium-assets");
  await fs.mkdir(premiumAssets, { recursive: true });
  await fs.rm(FINAL_DIR, { recursive: true, force: true });
  await fs.mkdir(FINAL_DIR, { recursive: true });

  for (const day of campaign) {
    await fs.rm(path.join(OUT_DIR, day.slug), { recursive: true, force: true });
  }

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });

  for (const day of campaign) {
    const dayDir = path.join(OUT_DIR, day.slug);
    const finalDayDir = path.join(FINAL_DIR, day.slug);
    await fs.mkdir(dayDir, { recursive: true });
    await fs.mkdir(finalDayDir, { recursive: true });
    const slidePaths = [];
    for (let i = 0; i < day.slides.length; i += 1) {
      slidePaths.push(await writeSlide(page, day, day.slides[i], i, dayDir, finalDayDir));
    }
    await createContactSheet(page, day, slidePaths, dayDir);
  }

  await browser.close();
  await writeCampaignDocs();
  await writeCaptions();
  await writePreviewHtml(campaign);
  console.log(`Generated ${campaign.length * 8} promotional slides in ${FINAL_DIR}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
