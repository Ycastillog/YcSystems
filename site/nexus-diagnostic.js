const NEXUS_STORAGE_KEY = "yc-nexus-guidance-v1";

const nexusDiagnosticSteps = [
  {
    id: "area",
    state: "observe",
    question: "¿Qué parte de tu operación necesita más claridad?",
    helper: "Elige el punto donde hoy se pierde más tiempo, control o visibilidad.",
    options: [
      { value: "sales", label: "Ventas y seguimiento", detail: "Prospectos, tareas, oportunidades y cierres." },
      { value: "operations", label: "Operación interna", detail: "Procesos, responsables, estados y trazabilidad." },
      { value: "data", label: "Datos e indicadores", detail: "Reportes, métricas y lectura ejecutiva." },
      { value: "automation", label: "Automatización", detail: "Tareas repetidas, alertas e integraciones." },
      { value: "product", label: "Nuevo producto digital", detail: "Una idea que necesita convertirse en una primera versión." },
      { value: "unsure", label: "Todavía no estoy seguro", detail: "Nexus organizará el punto de partida con tus demás respuestas." },
    ],
  },
  {
    id: "current",
    state: "connect",
    question: "¿Cómo se gestiona hoy ese proceso?",
    helper: "No buscamos una respuesta perfecta; solo entender la base actual.",
    options: [
      { value: "sheets", label: "Hojas, mensajes y trabajo manual", detail: "La información vive entre Excel, WhatsApp, correo o papel." },
      { value: "fragmented", label: "Varias herramientas aisladas", detail: "Hay sistemas, pero no comparten una visión completa." },
      { value: "legacy", label: "Un sistema que ya quedó corto", detail: "La operación creció más rápido que la herramienta." },
      { value: "informal", label: "El proceso todavía es informal", detail: "Depende principalmente del conocimiento del equipo." },
    ],
  },
  {
    id: "priority",
    state: "design",
    question: "¿Qué resultado importa más en la primera fase?",
    helper: "La primera versión debe resolver una prioridad medible, no intentar cambiarlo todo.",
    options: [
      { value: "control", label: "Tener más control", detail: "Saber qué ocurre, quién responde y qué sigue." },
      { value: "time", label: "Ahorrar tiempo", detail: "Reducir pasos manuales y trabajo repetido." },
      { value: "errors", label: "Reducir errores", detail: "Estandarizar datos, reglas y validaciones." },
      { value: "growth", label: "Vender o crecer más", detail: "Mejorar seguimiento, conversión y capacidad operativa." },
      { value: "visibility", label: "Tener visibilidad", detail: "Convertir información dispersa en decisiones claras." },
    ],
  },
  {
    id: "readiness",
    state: "activate",
    question: "¿En qué etapa estás ahora?",
    helper: "Esto ayuda a recomendar el siguiente paso correcto, sin adelantarnos.",
    options: [
      { value: "exploring", label: "Estoy explorando", detail: "Quiero entender posibilidades y ordenar la necesidad." },
      { value: "define", label: "Quiero definir la primera fase", detail: "La necesidad existe y quiero convertirla en alcance." },
      { value: "quote", label: "Necesito evaluar inversión", detail: "Busco una conversación comercial con contexto suficiente." },
      { value: "requirements", label: "Ya tengo requerimientos", detail: "Existe documentación o una idea bastante definida." },
    ],
  },
];

const nexusRecommendations = {
  sales: {
    title: "CRM operativo",
    need: "CRM o ventas",
    summary: "centralizar prospectos, responsables, próximos pasos y lectura comercial en un flujo visible",
  },
  operations: {
    title: "Sistema interno",
    need: "Sistema interno",
    summary: "convertir el proceso actual en estados, responsables, reglas y trazabilidad compartida",
  },
  data: {
    title: "Panel ejecutivo",
    need: "Panel o reportes",
    summary: "definir indicadores confiables y una lectura ejecutiva conectada con la operación real",
  },
  automation: {
    title: "Automatización por fases",
    need: "Automatización",
    summary: "identificar tareas repetidas y automatizar primero las que reducen más tiempo o riesgo",
  },
  product: {
    title: "Primera versión de producto",
    need: "Producto SaaS",
    summary: "delimitar usuarios, problema central, flujo principal y evidencia necesaria para validar el producto",
  },
  unsure: {
    title: "Diagnóstico operativo",
    need: "No estoy seguro",
    summary: "mapear el proceso, localizar la fricción principal y elegir una primera fase con impacto medible",
  },
};

const nexusPriorityLabels = {
  control: "más control operativo",
  time: "menos trabajo manual",
  errors: "menos errores y retrabajo",
  growth: "mayor capacidad de crecimiento",
  visibility: "mejor visibilidad para decidir",
};

const nexusCurrentLabels = {
  sheets: "hojas, mensajes y tareas manuales",
  fragmented: "herramientas aisladas",
  legacy: "un sistema que ya quedó corto",
  informal: "un proceso todavía informal",
};

const nexusReadinessLabels = {
  exploring: "exploración inicial",
  define: "definición de primera fase",
  quote: "evaluación comercial",
  requirements: "revisión de requerimientos existentes",
};

function normalizedPathname() {
  const path = window.location.pathname.replace(/index\.html$/, "");
  if (path === "") return "/";
  return path.endsWith("/") ? path : `${path}/`;
}

function isEligibleNexusPage() {
  return new Set(["/", "/solutions/", "/process/"]).has(normalizedPathname());
}

function loadNexusSession() {
  try {
    const value = JSON.parse(window.sessionStorage.getItem(NEXUS_STORAGE_KEY) || "null");
    if (!value || typeof value !== "object") return { step: 0, answers: {} };
    return {
      step: Number.isInteger(value.step) ? Math.min(Math.max(value.step, 0), nexusDiagnosticSteps.length) : 0,
      answers: value.answers && typeof value.answers === "object" ? value.answers : {},
    };
  } catch {
    return { step: 0, answers: {} };
  }
}

function saveNexusSession(session) {
  try {
    window.sessionStorage.setItem(NEXUS_STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Session persistence is optional; the diagnostic still works without it.
  }
}

function clearNexusSession() {
  try {
    window.sessionStorage.removeItem(NEXUS_STORAGE_KEY);
  } catch {
    // Ignore storage restrictions.
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildContactUrl(answers) {
  const recommendation = nexusRecommendations[answers.area] || nexusRecommendations.unsure;
  const params = new URLSearchParams({
    nexus: "guided",
    product: recommendation.need,
    area: answers.area || "unsure",
    current: answers.current || "",
    priority: answers.priority || "",
    readiness: answers.readiness || "",
  });
  return `/contact/?${params.toString()}`;
}

function createNexusDiagnosticMarkup() {
  const root = document.createElement("div");
  root.className = "nexus-diagnostic-root";
  root.dataset.nexusDiagnosticRoot = "";
  root.innerHTML = `
    <button class="nexus-diagnostic-launcher" type="button" data-nexus-diagnostic-open aria-haspopup="dialog" aria-controls="nexus-diagnostic-panel" aria-expanded="false">
      <span class="nexus-launcher-signal" aria-hidden="true"></span>
      <span><strong>YC Nexus</strong><small>Orientarme</small></span>
    </button>
    <div class="nexus-diagnostic-backdrop" data-nexus-diagnostic-backdrop hidden>
      <section class="nexus-diagnostic-panel" id="nexus-diagnostic-panel" role="dialog" aria-modal="true" aria-labelledby="nexus-diagnostic-title" tabindex="-1">
        <header class="nexus-diagnostic-header">
          <div class="nexus-diagnostic-identity">
            <figure class="nexus-diagnostic-avatar" data-nexus data-nexus-state="observe" data-nexus-label="Observando">
              <span class="nexus-diagnostic-avatar-signal" aria-hidden="true"></span>
              <img src="/assets/brand/nexus/nexus-avatar.webp" alt="" width="720" height="720" />
            </figure>
            <div>
              <p>YC Systems</p>
              <h2 id="nexus-diagnostic-title">YC Nexus</h2>
              <span data-nexus-diagnostic-state>Observando</span>
            </div>
          </div>
          <button class="nexus-diagnostic-close" type="button" data-nexus-diagnostic-close aria-label="Cerrar orientación Nexus">×</button>
        </header>
        <div class="nexus-diagnostic-progress" aria-hidden="true"><span data-nexus-diagnostic-progress></span></div>
        <div class="nexus-diagnostic-content" data-nexus-diagnostic-content aria-live="polite"></div>
        <p class="nexus-diagnostic-privacy">La orientación ocurre en este navegador. No enviamos información hasta que decidas continuar al formulario.</p>
      </section>
    </div>`;
  return root;
}

function setupNexusDiagnostic() {
  if (!isEligibleNexusPage() || document.querySelector("[data-nexus-diagnostic-root]")) return;

  const root = createNexusDiagnosticMarkup();
  document.body.append(root);

  const launcher = root.querySelector("[data-nexus-diagnostic-open]");
  const backdrop = root.querySelector("[data-nexus-diagnostic-backdrop]");
  const panel = root.querySelector(".nexus-diagnostic-panel");
  const closeButton = root.querySelector("[data-nexus-diagnostic-close]");
  const content = root.querySelector("[data-nexus-diagnostic-content]");
  const progress = root.querySelector("[data-nexus-diagnostic-progress]");
  const avatar = root.querySelector(".nexus-diagnostic-avatar");
  const stateText = root.querySelector("[data-nexus-diagnostic-state]");
  let session = loadNexusSession();
  let previouslyFocused = null;

  function setVisualState(state, label) {
    avatar.dataset.nexusState = state;
    avatar.dataset.nexusLabel = label;
    stateText.textContent = label;
  }

  function updateProgress(stepIndex) {
    const visibleStep = Math.min(stepIndex + 1, nexusDiagnosticSteps.length);
    progress.style.width = `${(visibleStep / nexusDiagnosticSteps.length) * 100}%`;
  }

  function focusFirstAction() {
    window.requestAnimationFrame(() => {
      content.querySelector("button, a[href]")?.focus();
    });
  }

  function renderStep() {
    const step = nexusDiagnosticSteps[session.step];
    if (!step) {
      renderResult();
      return;
    }

    const stateLabel = {
      observe: "Observando",
      connect: "Conectando",
      design: "Diseñando",
      activate: "Activando",
    }[step.state] || "Orientando";

    setVisualState(step.state, stateLabel);
    updateProgress(session.step);

    const options = step.options.map((option) => `
      <button class="nexus-diagnostic-option" type="button" data-nexus-answer="${escapeHtml(option.value)}">
        <strong>${escapeHtml(option.label)}</strong>
        <span>${escapeHtml(option.detail)}</span>
      </button>`).join("");

    content.innerHTML = `
      <div class="nexus-diagnostic-step" data-step="${session.step + 1}">
        <p class="nexus-diagnostic-step-label">Paso ${session.step + 1} de ${nexusDiagnosticSteps.length}</p>
        <h3>${escapeHtml(step.question)}</h3>
        <p>${escapeHtml(step.helper)}</p>
        <div class="nexus-diagnostic-options">${options}</div>
        ${session.step > 0 ? '<button class="nexus-diagnostic-back" type="button" data-nexus-diagnostic-back>Volver</button>' : ""}
      </div>`;

    content.querySelectorAll("[data-nexus-answer]").forEach((button) => {
      button.addEventListener("click", () => {
        session.answers[step.id] = button.dataset.nexusAnswer;
        session.step += 1;
        saveNexusSession(session);
        renderStep();
        focusFirstAction();
      });
    });

    content.querySelector("[data-nexus-diagnostic-back]")?.addEventListener("click", () => {
      session.step = Math.max(0, session.step - 1);
      const previousStep = nexusDiagnosticSteps[session.step];
      if (previousStep) delete session.answers[previousStep.id];
      saveNexusSession(session);
      renderStep();
      focusFirstAction();
    });
  }

  function renderResult() {
    const recommendation = nexusRecommendations[session.answers.area] || nexusRecommendations.unsure;
    const priority = nexusPriorityLabels[session.answers.priority] || "un resultado medible";
    const current = nexusCurrentLabels[session.answers.current] || "la operación actual";
    const readiness = nexusReadinessLabels[session.answers.readiness] || "definición inicial";
    const contactUrl = buildContactUrl(session.answers);

    setVisualState("success", "Ruta definida");
    progress.style.width = "100%";

    content.innerHTML = `
      <div class="nexus-diagnostic-result">
        <p class="nexus-diagnostic-step-label">Orientación inicial</p>
        <h3>Comenzaría por: ${escapeHtml(recommendation.title)}</h3>
        <p>La primera fase debería ${escapeHtml(recommendation.summary)}, partiendo de ${escapeHtml(current)} y priorizando ${escapeHtml(priority)}.</p>
        <dl>
          <div><dt>Punto de partida</dt><dd>${escapeHtml(recommendation.title)}</dd></div>
          <div><dt>Momento actual</dt><dd>${escapeHtml(readiness)}</dd></div>
          <div><dt>Enfoque</dt><dd>Alcance pequeño, medible y preparado para evolucionar.</dd></div>
        </dl>
        <div class="nexus-diagnostic-actions">
          <a class="button primary" href="${escapeHtml(contactUrl)}">Continuar diagnóstico</a>
          <button class="button secondary" type="button" data-nexus-diagnostic-restart>Reiniciar</button>
        </div>
        <small>Esta guía no es una cotización ni sustituye la conversación de diagnóstico.</small>
      </div>`;

    content.querySelector("[data-nexus-diagnostic-restart]")?.addEventListener("click", () => {
      clearNexusSession();
      session = { step: 0, answers: {} };
      renderStep();
      focusFirstAction();
    });
  }

  function openDialog() {
    previouslyFocused = document.activeElement;
    backdrop.hidden = false;
    document.body.classList.add("nexus-diagnostic-open");
    launcher.setAttribute("aria-expanded", "true");
    renderStep();
    panel.focus();
  }

  function closeDialog() {
    backdrop.hidden = true;
    document.body.classList.remove("nexus-diagnostic-open");
    launcher.setAttribute("aria-expanded", "false");
    previouslyFocused?.focus?.();
  }

  function trapFocus(event) {
    if (event.key !== "Tab" || backdrop.hidden) return;
    const focusable = [...panel.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  launcher.addEventListener("click", openDialog);
  closeButton.addEventListener("click", closeDialog);
  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) closeDialog();
  });
  panel.addEventListener("keydown", trapFocus);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !backdrop.hidden) closeDialog();
  });
}

setupNexusDiagnostic();
