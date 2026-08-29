const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const configElement = document.querySelector("[data-nen-config]");
const nenConfig = configElement ? JSON.parse(configElement.textContent) : {
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
const canonicalState = (state) => nenConfig.aliases?.[state] || (nenConfig.modes?.[state] ? state : nenConfig.defaultMode);
const stateLabels = Object.fromEntries(Object.entries(nenConfig.modes).map(([key, value]) => [key, value.label]));
const nenName = nenConfig.displayName || "Nen";

function nenMediaAsset(pose) {
  const assetKey = pose === "designing"
    ? "nen-pose-designing"
    : pose === "building"
      ? "nen-pose-building"
      : pose === "confirming" || pose === "launching"
        ? "nen-avatar-base"
        : "nen-avatar-clean";
  const registry = nenConfig.assetRegistry || {};
  const asset = registry[assetKey];
  const readyPath = asset?.status === "ready" && asset.path ? asset.path : null;
  const fallbackKey = asset?.fallback || "nen-avatar-base";
  const fallbackPath = registry[fallbackKey]?.path || registry["nen-avatar-base"]?.path;
  return { key: assetKey, status: readyPath ? "ready" : "fallback", path: readyPath || fallbackPath, fallbackKey: readyPath ? "" : fallbackKey };
}

function nenImageSource(element, path) {
  return `${element.dataset.nenPrefix || ""}${path}`;
}

function syncNenMedia(element, pose) {
  const image = element.querySelector(".nen-character-media img, .nen-core-image");
  if (!image) return;
  const asset = nenMediaAsset(pose);
  if (!asset.path) return;
  const source = nenImageSource(element, asset.path);
  if (image.getAttribute("src") !== source) {
    delete image.dataset.nenFallbackApplied;
    image.setAttribute("src", source);
  }
  element.dataset.nenAsset = asset.key;
  element.dataset.nenAssetStatus = asset.status;
  element.dataset.nenFallbackAsset = asset.fallbackKey;
}

function applyNenImageFallback(image, element) {
  const fallbackPath = nenConfig.assetRegistry?.["nen-avatar-base"]?.path;
  if (!fallbackPath || !element) return;
  const fallbackSource = nenImageSource(element, fallbackPath);
  if (image.dataset.nenFallbackApplied === "true" || image.getAttribute("src") === fallbackSource) {
    element.dataset.nenAssetStatus = "missing";
    return;
  }
  image.dataset.nenFallbackApplied = "true";
  image.setAttribute("src", fallbackSource);
  element.dataset.nenAsset = "nen-avatar-base";
  element.dataset.nenAssetStatus = "fallback";
  element.dataset.nenFallbackAsset = "nen-avatar-base";
}

function setupNenImageFallbacks() {
  document.querySelectorAll(".nen-character-media img, .nen-core-image").forEach((image) => {
    const element = image.closest("[data-nen]");
    if (!element) return;
    image.addEventListener("error", () => applyNenImageFallback(image, element));
    if (image.complete && image.naturalWidth === 0) applyNenImageFallback(image, element);
  });
}

function setNenState(element, state, message, options = {}) {
  if (!element) return;
  const mode = canonicalState(state);
  const modeConfig = nenConfig.modes[mode];
  const expression = options.expression || modeConfig.expression;
  const pose = options.pose || modeConfig.pose;
  element.dataset.nenState = mode;
  element.dataset.nenLabel = options.label || modeConfig.label;
  element.dataset.nenExpression = expression;
  element.dataset.nenPose = pose;
  syncNenMedia(element, pose);
  if (options.feedback) element.dataset.nenFeedback = options.feedback;
  else delete element.dataset.nenFeedback;
  const messageTarget = element.querySelector("[data-nen-message]");
  if (messageTarget && message) messageTarget.textContent = message;
  const statusTarget = element.querySelector("[data-nen-status] span");
  if (statusTarget) statusTarget.textContent = options.label || modeConfig.label;
}

function setupMethodExplorer() {
  const explorer = document.querySelector("[data-nen-method]");
  if (!explorer) return;

  const steps = JSON.parse(explorer.querySelector("[data-nen-steps]")?.textContent || "[]");
  const avatar = explorer.querySelector("[data-nen]");
  const buttons = [...explorer.querySelectorAll("[data-nen-step]")];
  const progress = explorer.querySelector("[data-nen-progress]");
  const activeHead = explorer.querySelector(".nen-method-active-head");
  const panel = explorer.querySelector("[data-nen-detail]");
  const stepSelector = explorer.querySelector(".nen-method-steps");
  const prev = explorer.querySelector("[data-nen-prev]");
  const next = explorer.querySelector("[data-nen-next]");
  let activeIndex = 0;
  const detail = {
    state: explorer.querySelector("[data-nen-detail-state]"),
    title: explorer.querySelector("[data-nen-detail-title]"),
    summary: explorer.querySelector("[data-nen-detail-summary]"),
    deliverable: explorer.querySelector("[data-nen-detail-deliverable]"),
    risk: explorer.querySelector("[data-nen-detail-risk]"),
    decision: explorer.querySelector("[data-nen-detail-decision]"),
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

    setNenState(avatar, step.state, step.message || step.summary, { expression: step.expression, pose: step.pose });
    detail.state.textContent = stateLabels[canonicalState(step.state)] || stateLabels.observe;
    detail.title.textContent = step.title;
    detail.summary.textContent = step.summary;
    detail.deliverable.textContent = step.deliverable;
    detail.risk.textContent = step.risk;
    detail.decision.textContent = step.decision;
    if (progress) progress.textContent = `Fase ${index + 1} de ${steps.length}`;
    if (panel) panel.setAttribute("aria-labelledby", buttons[index]?.id || "");
    explorer.dataset.nenState = canonicalState(step.state);
    if (window.matchMedia("(max-width: 980px)").matches) explorer.classList.add("nen-method--selector-docked");
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

function setupNenGuides() {
  const triggers = [...document.querySelectorAll("[data-nen-trigger]")];
  if (!triggers.length) return;

  function guideFor(trigger) {
    const scope = trigger.closest("[data-nen-scope]") || trigger.closest("section") || document;
    return scope.querySelector?.("[data-nen-guide]") || document.querySelector("[data-nen-guide]");
  }

  function activate(trigger) {
    const guide = guideFor(trigger);
    const message = trigger.dataset.nenMessage;
    const state = trigger.dataset.nenState || "organize";
    if (!guide || !message) return;

    const avatar = guide.querySelector("[data-nen]");
    const text = guide.querySelector("[data-nen-guide-text]");
    guide.dataset.nenState = canonicalState(state);
    setNenState(avatar, state, message, { expression: trigger.dataset.nenExpression, pose: trigger.dataset.nenPose });
    if (text) text.textContent = message;

    triggers.forEach((item) => {
      const sameGuide = guideFor(item) === guide;
      item.classList.toggle("is-active", sameGuide && item === trigger);
    });
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener("mouseenter", () => activate(trigger));
    trigger.addEventListener("focusin", () => activate(trigger));
    trigger.addEventListener("click", () => activate(trigger));
  });
}

function setupNenDiagnostic() {
  const diagnostic = document.querySelector("[data-nen-diagnostic]");
  if (!diagnostic) return;

  let routes;
  try {
    routes = JSON.parse(diagnostic.querySelector("[data-nen-diagnostic-data]")?.textContent || "[]");
  } catch {
    return;
  }

  const choices = [...diagnostic.querySelectorAll("[data-nen-choice]")];
  const result = diagnostic.querySelector("[data-nen-result]");
  const core = diagnostic.querySelector("[data-nen]");
  const resultState = diagnostic.querySelector("[data-nen-result-state]");
  const resultTitle = diagnostic.querySelector("[data-nen-result-title]");
  const resultCopy = diagnostic.querySelector("[data-nen-result-copy]");
  const resultPhase = diagnostic.querySelector("[data-nen-result-phase]");
  const resultSignal = diagnostic.querySelector("[data-nen-result-signal]");
  const cta = diagnostic.querySelector("[data-nen-cta]");
  if (!routes.length || !choices.length || !result || !core) return;

  function activate(key, { focus = false } = {}) {
    const route = routes.find((item) => item.key === key) || routes[0];
    const index = routes.indexOf(route);
    const activeChoice = choices[index];
    choices.forEach((choice, choiceIndex) => {
      const selected = choiceIndex === index;
      choice.setAttribute("aria-selected", String(selected));
      choice.tabIndex = selected ? 0 : -1;
    });
    if (activeChoice && focus) activeChoice.focus({ preventScroll: true });

    diagnostic.dataset.nenState = canonicalState(route.state);
    result.setAttribute("aria-labelledby", activeChoice?.id || "");
    if (resultState) resultState.textContent = stateLabels[canonicalState(route.state)] || stateLabels.observe;
    if (resultTitle) resultTitle.textContent = route.title;
    if (resultCopy) resultCopy.textContent = route.copy;
    if (resultPhase) resultPhase.textContent = route.phase;
    if (resultSignal) resultSignal.textContent = route.signal;
    if (cta) {
      const baseHref = cta.getAttribute("href")?.split("?")[0] || "./contact/";
      const service = route.need === "Sitio web o comercio digital" ? "web" : "operations";
      cta.setAttribute("href", `${baseHref}?service=${service}&product=${encodeURIComponent(route.need)}`);
    }

    setNenState(core, route.state, route.message);
  }

  choices.forEach((choice, index) => {
    choice.addEventListener("click", () => activate(choice.dataset.nenChoice, { focus: false }));
    choice.addEventListener("focus", () => activate(choice.dataset.nenChoice));
    choice.addEventListener("keydown", (event) => {
      if (!["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const direction = event.key === "ArrowUp" || event.key === "ArrowLeft" ? -1 : 1;
      const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? choices.length - 1 : (index + direction + choices.length) % choices.length;
      activate(choices[nextIndex].dataset.nenChoice, { focus: true });
    });
  });

  activate(choices[0].dataset.nenChoice);
}

function setupCardLinks() {
  document.querySelectorAll("[data-card-link]").forEach((card) => {
    const link = card.querySelector("a[href]");
    if (!link) return;

    card.addEventListener("click", (event) => {
      if (event.target.closest("a, button, input, select, textarea")) return;
      link.click();
    });
  });
}

function setupBriefCompanion() {
  const form = document.querySelector("[data-brief-form]");
  const companion = document.querySelector("[data-nen-form]");
  if (!form || !companion) return;

  const avatar = companion.querySelector("[data-nen]");
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
    setNenState(avatar, visual.mode, messages[state], visual);
  }

  form.addEventListener("yc:brief-step", (event) => {
    update(event.detail.step === 2 ? "organize" : "observe");
  });

  form.addEventListener("yc:brief-state", (event) => {
    update(event.detail.state);
  });
}

function setupLivingMotion() {
  const characters = [...document.querySelectorAll(".nen-character[data-nen]")];
  if (!characters.length || reducedMotion) return;

  characters.forEach((character) => {
    const scheduleBlink = () => {
      const min = nenConfig.motion?.blinkMin || 4000;
      const max = nenConfig.motion?.blinkMax || 8000;
      window.setTimeout(() => {
        if (!character.hasAttribute("data-nen-paused") && !document.hidden) {
          character.classList.add("is-blinking");
          window.setTimeout(() => character.classList.remove("is-blinking"), nenConfig.motion?.blinkDuration || 160);
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
        character.style.setProperty("--nen-gaze-x", `${(x * 4).toFixed(2)}px`);
        character.style.setProperty("--nen-gaze-y", `${(y * 3).toFixed(2)}px`);
        character.style.setProperty("--nen-head-rotation", `${(x * 1.4).toFixed(2)}deg`);
      });
      character.addEventListener("pointerleave", () => {
        character.style.removeProperty("--nen-gaze-x");
        character.style.removeProperty("--nen-gaze-y");
        character.style.removeProperty("--nen-head-rotation");
      });
    }

  });

  document.querySelectorAll(".hero .button, .hero .text-link").forEach((cta) => {
    const character = cta.closest(".hero")?.querySelector(".nen-character");
    if (!character || !finePointer) return;
    cta.addEventListener("pointerenter", () => {
      character.style.setProperty("--nen-gaze-x", "-4px");
      character.style.setProperty("--nen-gaze-y", "1px");
      character.style.setProperty("--nen-head-rotation", "-1.4deg");
    });
    cta.addEventListener("pointerleave", () => {
      character.style.removeProperty("--nen-gaze-x");
      character.style.removeProperty("--nen-gaze-y");
      character.style.removeProperty("--nen-head-rotation");
    });
  });
}

function setupNenEntrances() {
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

    document.documentElement.classList.add("nen-reveal-enabled");
    elements.forEach((element) => observer.observe(element));

    window.setTimeout(() => {
      elements.forEach((element) => element.classList.add("is-visible"));
      observer.disconnect();
      document.documentElement.classList.add("nen-reveal-complete");
    }, nenConfig.motion?.revealFallback || 1200);

    window.addEventListener("beforeprint", () => {
      elements.forEach((element) => element.classList.add("is-visible"));
      document.documentElement.classList.add("nen-reveal-complete");
    }, { once: true });
  } catch {
    document.documentElement.classList.add("nen-static-fallback");
  }
}

function setupVisibilityPause() {
  const nenElements = [...document.querySelectorAll("[data-nen]")];
  if (!nenElements.length || !("IntersectionObserver" in window)) return;
  const intersectionState = new WeakMap();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      intersectionState.set(entry.target, entry.isIntersecting);
      entry.target.toggleAttribute("data-nen-paused", !entry.isIntersecting || document.hidden);
    });
  }, { threshold: 0.15 });

  nenElements.forEach((element) => observer.observe(element));

  document.addEventListener("visibilitychange", () => {
    nenElements.forEach((element) => {
      element.toggleAttribute("data-nen-paused", document.hidden || intersectionState.get(element) === false);
    });
  });
}

setupNenImageFallbacks();
setupMethodExplorer();
setupNenGuides();
setupNenDiagnostic();
setupCardLinks();
setupBriefCompanion();
setupLivingMotion();
setupNenEntrances();
setupVisibilityPause();
