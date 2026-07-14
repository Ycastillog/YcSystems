const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const configElement = document.querySelector("[data-nexus-config]");
const nexusConfig = configElement ? JSON.parse(configElement.textContent) : {
  defaultMode: "observe",
  modes: {
    observe: { label: "Observando", expression: "observing", pose: "observing" },
    organize: { label: "Ordenando", expression: "thinking", pose: "analyzing" },
    design: { label: "Diseñando", expression: "designing", pose: "designing" },
    build: { label: "Construyendo", expression: "building", pose: "building" },
    support: { label: "Acompañando", expression: "support-neutral", pose: "supporting" },
  },
  aliases: { idle: "observe", connect: "organize", monitor: "support", activate: "build", success: "support", caution: "observe", error: "observe" },
  motion: { blinkMin: 4000, blinkMax: 8000, blinkDuration: 160 },
};
const canonicalState = (state) => nexusConfig.aliases?.[state] || (nexusConfig.modes?.[state] ? state : nexusConfig.defaultMode);
const stateLabels = Object.fromEntries(Object.entries(nexusConfig.modes).map(([key, value]) => [key, value.label]));

function setNexusState(element, state, message, options = {}) {
  if (!element) return;
  const mode = canonicalState(state);
  const modeConfig = nexusConfig.modes[mode];
  element.dataset.nexusState = mode;
  element.dataset.nexusLabel = options.label || modeConfig.label;
  element.dataset.nexusExpression = options.expression || modeConfig.expression;
  element.dataset.nexusPose = options.pose || modeConfig.pose;
  if (options.feedback) element.dataset.nexusFeedback = options.feedback;
  else delete element.dataset.nexusFeedback;
  const messageTarget = element.querySelector("[data-nexus-message]");
  if (messageTarget && message) messageTarget.textContent = message;
  const statusTarget = element.querySelector("[data-nexus-status] span");
  if (statusTarget) statusTarget.textContent = options.label || modeConfig.label;
}

function setupMethodExplorer() {
  const explorer = document.querySelector("[data-nexus-method]");
  if (!explorer) return;

  const steps = JSON.parse(explorer.querySelector("[data-nexus-steps]")?.textContent || "[]");
  const avatar = explorer.querySelector("[data-nexus]");
  const buttons = [...explorer.querySelectorAll("[data-nexus-step]")];
  const progress = explorer.querySelector("[data-nexus-progress]");
  const activeHead = explorer.querySelector(".nexus-method-active-head");
  const panel = explorer.querySelector("[data-nexus-detail]");
  const stepSelector = explorer.querySelector(".nexus-method-steps");
  const prev = explorer.querySelector("[data-nexus-prev]");
  const next = explorer.querySelector("[data-nexus-next]");
  let activeIndex = 0;
  const detail = {
    state: explorer.querySelector("[data-nexus-detail-state]"),
    title: explorer.querySelector("[data-nexus-detail-title]"),
    summary: explorer.querySelector("[data-nexus-detail-summary]"),
    deliverable: explorer.querySelector("[data-nexus-detail-deliverable]"),
    risk: explorer.querySelector("[data-nexus-detail-risk]"),
    decision: explorer.querySelector("[data-nexus-detail-decision]"),
  };

  function keepSelectedStepVisible(button) {
    if (!button || !stepSelector || stepSelector.scrollWidth <= stepSelector.clientWidth) return;
    const targetLeft = button.offsetLeft - ((stepSelector.clientWidth - button.offsetWidth) / 2);
    stepSelector.scrollTo({ left: Math.max(0, targetLeft), behavior: reducedMotion ? "auto" : "smooth" });
  }

  function revealActiveDetailIfNeeded() {
    if (!activeHead || !window.matchMedia("(max-width: 980px)").matches) return;
    const headerHeight = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-height")) || 70;
    const bounds = activeHead.getBoundingClientRect();
    const safeTop = headerHeight + 14;
    const safeBottom = window.innerHeight - 86;
    if (bounds.top >= safeTop && bounds.bottom <= safeBottom) return;
    window.scrollTo({ top: window.scrollY + bounds.top - safeTop, behavior: reducedMotion ? "auto" : "smooth" });
  }

  function activateStep(index, { scrollDetail = false } = {}) {
    const step = steps[index];
    if (!step) return;
    activeIndex = index;

    buttons.forEach((button, buttonIndex) => {
      const selected = buttonIndex === index;
      button.setAttribute("aria-selected", String(selected));
      if (selected) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
      button.tabIndex = selected ? 0 : -1;
    });

    setNexusState(avatar, step.state, step.message || step.summary, { expression: step.expression, pose: step.pose });
    detail.state.textContent = stateLabels[canonicalState(step.state)] || stateLabels.observe;
    detail.title.textContent = step.title;
    detail.summary.textContent = step.summary;
    detail.deliverable.textContent = step.deliverable;
    detail.risk.textContent = step.risk;
    detail.decision.textContent = step.decision;
    if (progress) progress.textContent = `Fase ${index + 1} de ${steps.length}`;
    if (panel) panel.setAttribute("aria-labelledby", buttons[index]?.id || "");
    explorer.dataset.nexusState = canonicalState(step.state);
    if (window.matchMedia("(max-width: 980px)").matches) explorer.classList.add("nexus-method--selector-docked");
    keepSelectedStepVisible(buttons[index]);
    if (scrollDetail) window.requestAnimationFrame(revealActiveDetailIfNeeded);
  }

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => activateStep(index, { scrollDetail: true }));
    button.addEventListener("keydown", (event) => {
      if (!["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const direction = event.key === "ArrowUp" || event.key === "ArrowLeft" ? -1 : 1;
      const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : (index + direction + buttons.length) % buttons.length;
      buttons[nextIndex].focus({ preventScroll: true });
      activateStep(nextIndex);
    });
  });

  prev?.addEventListener("click", () => {
    const nextIndex = (activeIndex - 1 + buttons.length) % buttons.length;
    activateStep(nextIndex, { scrollDetail: true });
  });

  next?.addEventListener("click", () => {
    const nextIndex = (activeIndex + 1) % buttons.length;
    activateStep(nextIndex, { scrollDetail: true });
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
    const state = trigger.dataset.nexusState || "organize";
    if (!guide || !message) return;

    const avatar = guide.querySelector("[data-nexus]");
    const text = guide.querySelector("[data-nexus-guide-text]");
    guide.dataset.nexusState = state;
    setNexusState(avatar, state, message, { expression: trigger.dataset.nexusExpression, pose: trigger.dataset.nexusPose });
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
  const avatar = document.querySelector(".home-hero-visual[data-nexus]");
  if (!avatar) return;

  const states = [
    ["observe", "Nexus está observando tu operación.", "observing", "observing"],
    ["organize", "Conectando señales, procesos y próximos pasos.", "thinking", "analyzing"],
    ["design", "Ordenando la primera ruta antes de construir.", "designing", "designing"],
    ["build", "Convirtiendo la ruta en una primera fase verificable.", "building", "building"],
    ["support", "Acompañando el uso y la siguiente mejora.", "support-neutral", "supporting"],
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
    setNexusState(avatar, states[index][0], states[index][1], { expression: states[index][2], pose: states[index][3] });
  }, 5600);
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
    observe: "Cu\u00e9ntanos qui\u00e9n eres y desde qu\u00e9 operaci\u00f3n nos contactas.",
    organize: "Ahora ordenemos el proceso, la fricci\u00f3n y el resultado que necesitas.",
    sending: "Estamos organizando la informaci\u00f3n.",
    success: "Ruta inicial recibida.",
    caution: "Hay un dato que debemos revisar.",
    error: "Hay una conexi\u00f3n que debemos revisar.",
  };

  function update(state) {
    const visual = {
      observe: { mode: "observe", expression: "observing", pose: "observing" },
      organize: { mode: "organize", expression: "thinking", pose: "analyzing" },
      sending: { mode: "build", expression: "processing", pose: "building", label: "Procesando" },
      success: { mode: "support", expression: "confirming", pose: "confirming", label: "Confirmado" },
      caution: { mode: "observe", expression: "soft-alert", pose: "observing", label: "Revisemos esto", feedback: "caution" },
      error: { mode: "observe", expression: "soft-alert", pose: "observing", label: "Atenci\u00f3n", feedback: "error" },
    }[state] || { mode: "observe" };
    setNexusState(avatar, visual.mode, messages[state], visual);
    if (text) text.textContent = messages[state];
  }

  form.addEventListener("yc:brief-step", (event) => {
    update(event.detail.step === 2 ? "organize" : "observe");
  });

  form.addEventListener("yc:brief-state", (event) => {
    update(event.detail.state);
  });
}

function setupLivingMotion() {
  const characters = [...document.querySelectorAll(".nexus-character[data-nexus]")];
  if (!characters.length || reducedMotion) return;

  characters.forEach((character) => {
    let blinkTimer;
    const scheduleBlink = () => {
      const min = nexusConfig.motion?.blinkMin || 4000;
      const max = nexusConfig.motion?.blinkMax || 8000;
      blinkTimer = window.setTimeout(() => {
        if (!character.hasAttribute("data-nexus-paused") && !document.hidden) {
          character.classList.add("is-blinking");
          window.setTimeout(() => character.classList.remove("is-blinking"), nexusConfig.motion?.blinkDuration || 160);
        }
        scheduleBlink();
      }, min + Math.random() * (max - min));
    };
    scheduleBlink();

    if (finePointer) {
      character.addEventListener("pointermove", (event) => {
        const bounds = character.getBoundingClientRect();
        const x = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2));
        const y = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2));
        character.style.setProperty("--nexus-gaze-x", `${(x * 4).toFixed(2)}px`);
        character.style.setProperty("--nexus-gaze-y", `${(y * 3).toFixed(2)}px`);
        character.style.setProperty("--nexus-head-rotation", `${(x * 1.4).toFixed(2)}deg`);
      });
      character.addEventListener("pointerleave", () => {
        character.style.removeProperty("--nexus-gaze-x");
        character.style.removeProperty("--nexus-gaze-y");
        character.style.removeProperty("--nexus-head-rotation");
      });
    }

    character.addEventListener("DOMNodeRemoved", () => window.clearTimeout(blinkTimer), { once: true });
  });

  document.querySelectorAll(".hero .button, .hero .text-link").forEach((cta) => {
    const character = cta.closest(".hero")?.querySelector(".nexus-character");
    if (!character || !finePointer) return;
    cta.addEventListener("pointerenter", () => {
      character.style.setProperty("--nexus-gaze-x", "-4px");
      character.style.setProperty("--nexus-gaze-y", "1px");
      character.style.setProperty("--nexus-head-rotation", "-1.4deg");
    });
    cta.addEventListener("pointerleave", () => {
      character.style.removeProperty("--nexus-gaze-x");
      character.style.removeProperty("--nexus-gaze-y");
      character.style.removeProperty("--nexus-head-rotation");
    });
  });
}

function setupNexusEntrances() {
  const elements = [...document.querySelectorAll("[data-reveal]")];
  if (!elements.length || reducedMotion || !("IntersectionObserver" in window)) return;

  try {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.16, rootMargin: "0px 0px 8%" });

    document.documentElement.classList.add("nexus-reveal-enabled");
    elements.forEach((element) => observer.observe(element));

    window.setTimeout(() => {
      elements.forEach((element) => element.classList.add("is-visible"));
      observer.disconnect();
      document.documentElement.classList.add("nexus-reveal-complete");
    }, nexusConfig.motion?.revealFallback || 1200);

    window.addEventListener("beforeprint", () => {
      elements.forEach((element) => element.classList.add("is-visible"));
      document.documentElement.classList.add("nexus-reveal-complete");
    }, { once: true });
  } catch {
    document.documentElement.classList.add("nexus-static-fallback");
  }
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
setupLivingMotion();
setupNexusEntrances();
setupVisibilityPause();
