const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const stateLabels = {
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

function setNexusState(element, state, message) {
  if (!element) return;
  element.dataset.nexusState = state;
  element.dataset.nexusLabel = stateLabels[state] || stateLabels.idle;
  const messageTarget = element.querySelector("[data-nexus-message]");
  if (messageTarget && message) messageTarget.textContent = message;
}

function setupMethodExplorer() {
  const explorer = document.querySelector("[data-nexus-method]");
  if (!explorer) return;

  const steps = JSON.parse(explorer.querySelector("[data-nexus-steps]")?.textContent || "[]");
  const avatar = explorer.querySelector("[data-nexus]");
  const buttons = [...explorer.querySelectorAll("[data-nexus-step]")];
  const progress = explorer.querySelector("[data-nexus-progress]");
  const prev = explorer.querySelector("[data-nexus-prev]");
  const next = explorer.querySelector("[data-nexus-next]");
  let activeIndex = 0;
  const detail = {
    state: explorer.querySelector("[data-nexus-detail-state]"),
    title: explorer.querySelector("[data-nexus-detail-title]"),
    summary: explorer.querySelector("[data-nexus-detail-summary]"),
    deliverable: explorer.querySelector("[data-nexus-detail-deliverable]"),
    risk: explorer.querySelector("[data-nexus-detail-risk]"),
  };

  function activateStep(index) {
    const step = steps[index];
    if (!step) return;
    activeIndex = index;

    buttons.forEach((button, buttonIndex) => {
      const selected = buttonIndex === index;
      button.setAttribute("aria-selected", String(selected));
      button.toggleAttribute("aria-current", selected);
    });

    setNexusState(avatar, step.state, step.message || step.summary);
    detail.state.textContent = step.state;
    detail.title.textContent = step.title;
    detail.summary.textContent = step.summary;
    detail.deliverable.textContent = step.deliverable;
    detail.risk.textContent = step.risk;
    if (progress) progress.textContent = `Fase ${index + 1} de ${steps.length}`;
    explorer.dataset.nexusState = step.state;
  }

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => activateStep(index));
    button.addEventListener("keydown", (event) => {
      if (!["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(event.key)) return;
      event.preventDefault();
      const direction = event.key === "ArrowUp" || event.key === "ArrowLeft" ? -1 : 1;
      const nextIndex = (index + direction + buttons.length) % buttons.length;
      buttons[nextIndex].focus();
      activateStep(nextIndex);
    });
  });

  prev?.addEventListener("click", () => {
    const nextIndex = (activeIndex - 1 + buttons.length) % buttons.length;
    buttons[nextIndex].focus();
    activateStep(nextIndex);
  });

  next?.addEventListener("click", () => {
    const nextIndex = (activeIndex + 1) % buttons.length;
    buttons[nextIndex].focus();
    activateStep(nextIndex);
  });
}

function setupNexusGuides() {
  const triggers = [...document.querySelectorAll("[data-nexus-trigger]")];
  if (!triggers.length) return;

  function guideFor(trigger) {
    const scope = trigger.closest("[data-nexus-scope]") || trigger.closest("section") || document;
    return scope.querySelector?.("[data-nexus-guide]") || document.querySelector("[data-nexus-guide]");
  }

  function activate(trigger) {
    const guide = guideFor(trigger);
    const message = trigger.dataset.nexusMessage;
    const state = trigger.dataset.nexusState || "connect";
    if (!guide || !message) return;

    const avatar = guide.querySelector("[data-nexus]");
    const text = guide.querySelector("[data-nexus-guide-text]");
    guide.dataset.nexusState = state;
    setNexusState(avatar, state, message);
    if (text) text.textContent = message;

    triggers.forEach((item) => {
      const sameGuide = guideFor(item) === guide;
      item.classList.toggle("is-active", sameGuide && item === trigger);
    });
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener("mouseenter", () => activate(trigger));
    trigger.addEventListener("focus", () => activate(trigger));
    trigger.addEventListener("click", () => activate(trigger));
  });
}

function setupHomeNexusFlow() {
  if (reducedMotion) return;
  const avatar = document.querySelector(".nexus-home[data-nexus]");
  if (!avatar) return;

  const states = [
    ["observe", "Nexus está observando tu operación."],
    ["connect", "Conectando señales, procesos y próximos pasos."],
    ["design", "Ordenando la primera ruta antes de construir."],
  ];
  let index = 0;
  let active = false;

  const observer = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        active = entries.some((entry) => entry.isIntersecting);
      }, { threshold: 0.4 })
    : null;

  observer?.observe(avatar);
  active = !observer;

  window.setInterval(() => {
    if (!active || document.hidden) return;
    index = (index + 1) % states.length;
    setNexusState(avatar, states[index][0], states[index][1]);
  }, 5200);
}

function setupCardLinks() {
  document.querySelectorAll("[data-card-link]").forEach((card) => {
    const link = card.querySelector("a[href]");
    if (!link) return;
    if (!card.hasAttribute("tabindex")) card.tabIndex = 0;
    card.setAttribute("role", "link");

    card.addEventListener("click", (event) => {
      if (event.target.closest("a, button, input, select, textarea")) return;
      link.click();
    });

    card.addEventListener("keydown", (event) => {
      if (!["Enter", " "].includes(event.key)) return;
      if (event.target.closest("a, button, input, select, textarea")) return;
      event.preventDefault();
      link.click();
    });
  });
}

function setupBriefCompanion() {
  const form = document.querySelector("[data-brief-form]");
  const companion = document.querySelector("[data-nexus-form]");
  if (!form || !companion) return;

  const avatar = companion.querySelector("[data-nexus]");
  const text = companion.querySelector("[data-nexus-form-text]");
  const messages = {
    observe: "Primero entendamos qu\u00e9 proceso necesita m\u00e1s control.",
    connect: "Ahora conectemos el problema con el contexto de tu operaci\u00f3n.",
    sending: "Estamos organizando la informaci\u00f3n.",
    success: "Diagn\u00f3stico recibido. El siguiente paso es revisar el alcance inicial.",
    caution: "Hay un dato que debemos revisar.",
    error: "Hay una conexi\u00f3n que debemos revisar.",
  };

  function update(state) {
    const visualState = state === "sending" ? "monitor" : state;
    setNexusState(avatar, visualState, messages[state]);
    if (text) text.textContent = messages[state];
  }

  form.addEventListener("yc:brief-step", (event) => {
    update(event.detail.step === 2 ? "connect" : "observe");
  });

  form.addEventListener("yc:brief-state", (event) => {
    update(event.detail.state);
  });
}

function setupVisibilityPause() {
  const nexusElements = [...document.querySelectorAll("[data-nexus]")];
  if (!nexusElements.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.toggleAttribute("data-nexus-paused", !entry.isIntersecting || document.hidden);
    });
  }, { threshold: 0.15 });

  nexusElements.forEach((element) => observer.observe(element));

  document.addEventListener("visibilitychange", () => {
    nexusElements.forEach((element) => {
      element.toggleAttribute("data-nexus-paused", document.hidden);
    });
  });
}

setupMethodExplorer();
setupNexusGuides();
setupHomeNexusFlow();
setupCardLinks();
setupBriefCompanion();
setupVisibilityPause();
