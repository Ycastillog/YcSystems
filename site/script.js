const navToggle = document.querySelector("[data-nav-toggle]");
const navPanel = document.querySelector("[data-nav-panel]");
const navigationDesktopQuery = window.matchMedia("(min-width: 901px)");
const navigationInertTargets = [document.querySelector("main"), document.querySelector(".site-footer")].filter(Boolean);
const navigationFocusableSelector = "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])";

function navigationIsOpen() {
  return navToggle?.getAttribute("aria-expanded") === "true";
}

function navigationFocusables() {
  if (!navToggle || !navPanel) return [];
  return [navToggle, ...navPanel.querySelectorAll(navigationFocusableSelector)]
    .filter((element) => element.getClientRects().length > 0);
}

function setNavigation(open, { restoreFocus = false } = {}) {
  if (!navToggle || !navPanel) return;
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Cerrar men\u00fa" : "Abrir men\u00fa");
  navPanel.classList.toggle("is-open", open);
  document.body.classList.toggle("nav-open", open);
  navigationInertTargets.forEach((element) => element.toggleAttribute("inert", open));
  if (!open && restoreFocus) window.requestAnimationFrame(() => navToggle.focus());
}

navToggle?.addEventListener("click", () => {
  setNavigation(navToggle.getAttribute("aria-expanded") !== "true");
});

navPanel?.addEventListener("click", (event) => {
  if (event.target.closest("a")) setNavigation(false);
});

document.addEventListener("keydown", (event) => {
  if (!navigationIsOpen()) return;
  if (event.key === "Escape") {
    event.preventDefault();
    setNavigation(false, { restoreFocus: true });
    return;
  }
  if (event.key !== "Tab") return;

  const focusables = navigationFocusables();
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  const activeIndex = focusables.indexOf(document.activeElement);
  if (event.shiftKey && (document.activeElement === first || activeIndex < 0)) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && (document.activeElement === last || activeIndex < 0)) {
    event.preventDefault();
    first.focus();
  }
});

const closeNavigationOnDesktop = (event) => {
  if (event.matches && navigationIsOpen()) setNavigation(false);
};
if (typeof navigationDesktopQuery.addEventListener === "function") {
  navigationDesktopQuery.addEventListener("change", closeNavigationOnDesktop);
} else {
  navigationDesktopQuery.addListener(closeNavigationOnDesktop);
}

function setupHomeProof() {
  const section = document.querySelector("[data-home-proof]");
  const dataElement = section?.querySelector("[data-home-proof-data]");
  if (!section || !dataElement) return;

  let items;
  try {
    items = JSON.parse(dataElement.textContent || "[]");
  } catch (error) {
    console.error("[YC Systems] No fue posible leer los casos publicados", error);
    return;
  }

  const buttons = [...section.querySelectorAll("[data-home-proof-choice]")];
  const panel = section.querySelector("[data-home-proof-panel]");
  const image = section.querySelector("[data-home-proof-image]");
  const category = section.querySelector("[data-home-proof-category]");
  const evidence = section.querySelector("[data-home-proof-evidence]");
  const title = section.querySelector("[data-home-proof-title]");
  const summary = section.querySelector("[data-home-proof-summary]");
  const objective = section.querySelector("[data-home-proof-objective]");
  const delivery = section.querySelector("[data-home-proof-delivery]");
  const detailLink = section.querySelector("[data-home-proof-detail]");
  const externalLink = section.querySelector("[data-home-proof-external]");
  if (!Array.isArray(items) || !items.length || !buttons.length || !panel || !image || !category || !evidence || !title || !summary || !objective || !delivery || !externalLink) return;

  function activateHomeProof(index, { focus = false } = {}) {
    const item = items[index];
    if (!item) return;

    buttons.forEach((button, buttonIndex) => {
      const selected = buttonIndex === index;
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected ? 0 : -1;
    });

    image.src = item.image;
    image.alt = `Sitio publicado de ${item.name}`;
    category.textContent = item.category;
    evidence.textContent = item.evidence;
    title.textContent = item.name;
    summary.textContent = item.summary;
    objective.textContent = item.objective;
    delivery.textContent = item.delivery;
    panel.setAttribute("aria-labelledby", buttons[index].id);

    if (detailLink) {
      detailLink.hidden = !item.internalPath;
      if (item.internalPath) detailLink.href = item.internalPath;
      else detailLink.removeAttribute("href");
    }
    externalLink.href = item.url || "#";
    externalLink.setAttribute("aria-label", `Visitar sitio de ${item.name} (abre en una pestaña nueva)`);

    if (focus) buttons[index].focus({ preventScroll: true });
  }

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => activateHomeProof(index));
    button.addEventListener("focus", () => activateHomeProof(index));
    button.addEventListener("keydown", (event) => {
      const direction = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
      if (event.key === "Home") {
        event.preventDefault();
        activateHomeProof(0, { focus: true });
        return;
      }
      if (event.key === "End") {
        event.preventDefault();
        activateHomeProof(buttons.length - 1, { focus: true });
        return;
      }
      if (!direction) return;
      event.preventDefault();
      activateHomeProof((index + direction + buttons.length) % buttons.length, { focus: true });
    });
  });

  activateHomeProof(0);
}

setupHomeProof();

const briefForm = document.querySelector("[data-brief-form]");
const briefStep = briefForm?.querySelector("[data-brief-step]");
const briefNext = briefForm?.querySelector("[data-brief-next]");
const briefBack = briefForm?.querySelector("[data-brief-back]");
const briefSubmit = briefForm?.querySelector("[data-brief-submit]");
const briefStatus = briefForm?.querySelector("[data-brief-status]");
const briefSuccess = briefForm?.querySelector("[data-brief-success]");
const briefAnnouncer = briefForm ? document.createElement("p") : null;
let briefSending = false;
let briefInvalidAnnouncementPending = false;
let briefErrorIndex = 0;
const briefFieldLimits = {
  name: 120,
  email: 254,
  company: 160,
  role: 160,
  current_process: 2000,
  tools: 300,
  desired_result: 2000,
};

if (briefAnnouncer) {
  briefAnnouncer.className = "sr-only";
  briefAnnouncer.dataset.briefAnnouncer = "";
  briefAnnouncer.setAttribute("aria-live", "polite");
  briefAnnouncer.setAttribute("aria-atomic", "true");
  briefForm.append(briefAnnouncer);
}

function clearBriefStatus() {
  if (!briefStatus) return;
  briefStatus.textContent = "";
  delete briefStatus.dataset.state;
}

function clearFieldError(field) {
  field.classList.remove("is-invalid");
  field.removeAttribute("aria-invalid");
  const error = field.dataset.briefErrorId ? document.getElementById(field.dataset.briefErrorId) : null;
  if (error) {
    error.hidden = true;
    error.textContent = "";
  }
}

function clearPanelErrors(panel) {
  panel?.querySelectorAll(".is-invalid, [aria-invalid='true']").forEach(clearFieldError);
}

function briefValidationMessage(field) {
  if (field.validity.typeMismatch && field.type === "email") return "Escribe un correo de trabajo v\u00e1lido.";
  if (field.validity.tooLong) return `Usa un m\u00e1ximo de ${field.maxLength} caracteres.`;
  const requiredMessages = {
    name: "Escribe tu nombre para continuar.",
    email: "Escribe tu correo de trabajo para continuar.",
    company: "Escribe el nombre de tu empresa para continuar.",
    need: "Selecciona el \u00e1rea o proceso que necesita atenci\u00f3n.",
    current_process: "Describe la fricci\u00f3n principal de la operaci\u00f3n.",
    desired_result: "Describe el resultado que esperas de la primera fase.",
    priority: "Selecciona la prioridad de esta necesidad.",
    consent: "Acepta el uso de esta informaci\u00f3n para que podamos responder.",
  };
  return requiredMessages[field.name] || "Revisa este campo para continuar.";
}

function ensureBriefFieldError(field) {
  const registeredError = briefForm?.querySelector(`[data-field-error="${field.name}"]`);
  if (registeredError?.id) {
    field.dataset.briefErrorId = registeredError.id;
    return registeredError;
  }
  if (!field.dataset.briefErrorId) field.dataset.briefErrorId = `brief-field-error-${++briefErrorIndex}`;
  let error = document.getElementById(field.dataset.briefErrorId);
  if (error) return error;
  error = document.createElement("p");
  error.id = field.dataset.briefErrorId;
  error.className = "field-error brief-field-error";
  error.dataset.state = "error";
  error.dataset.briefFieldError = "";
  error.hidden = true;
  const anchor = field.closest("label") || field;
  anchor.insertAdjacentElement("afterend", error);
  return error;
}

function showBriefError(field, { focus = false, announce = true } = {}) {
  if (!field) return;
  const error = ensureBriefFieldError(field);
  error.textContent = briefValidationMessage(field);
  error.hidden = false;
  field.classList.add("is-invalid");
  field.setAttribute("aria-invalid", "true");
  field.setAttribute("aria-errormessage", error.id);
  if (announce && briefStatus) {
    briefStatus.dataset.state = "caution";
    briefStatus.textContent = "Revisa el campo señalado para continuar.";
  }
  if (announce) briefForm?.dispatchEvent(new CustomEvent("yc:brief-state", { detail: { state: "caution" } }));
  if (focus) field.focus({ preventScroll: true });
}

function showBriefStep(step) {
  if (!briefForm || !briefStep) return;
  if (Number(briefForm.dataset.step) === step) return;
  const previousPanel = briefForm.querySelector(`[data-step="${briefForm.dataset.step}"]`);
  clearPanelErrors(previousPanel);
  clearBriefStatus();
  briefForm.dataset.step = String(step);
  briefStep.textContent = `Paso ${step} de 2 · ${step === 1 ? "Contexto" : "Operación"}`;
  briefForm.querySelectorAll("[data-step]").forEach((panel) => {
    panel.hidden = Number(panel.dataset.step) !== step;
  });
  briefForm.dispatchEvent(new CustomEvent("yc:brief-step", { detail: { step } }));
  if (briefAnnouncer) briefAnnouncer.textContent = briefStep.textContent;
}

function focusBriefStep(step) {
  if (!briefForm) return;
  const panel = [...briefForm.querySelectorAll(":scope > [data-step]")]
    .find((element) => Number(element.dataset.step) === step);
  const field = panel?.querySelector('input:not([type="hidden"]):not([tabindex="-1"]), select, textarea');
  field?.focus({ preventScroll: true });
  requestAnimationFrame(() => {
    const formRect = briefForm.getBoundingClientRect();
    const fieldRect = field?.getBoundingClientRect();
    const companionRect = briefForm.querySelector("[data-nen-form]")?.getBoundingClientRect();
    const headerHeight = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-height")) || 72;
    const fieldIsObscured = fieldRect && companionRect && fieldRect.top < companionRect.bottom + 16;
    const fieldIsOutside = fieldRect && (fieldRect.top < headerHeight + 16 || fieldRect.bottom > window.innerHeight - 24);
    if (formRect.top < headerHeight + 8 || fieldIsObscured || fieldIsOutside) {
      briefForm.scrollIntoView({
        block: "start",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
    }
  });
}

function firstInvalidField(panel) {
  if (!panel) return null;
  return [...panel.querySelectorAll("input, select, textarea")].find((field) => !field.validity.valid);
}

briefNext?.addEventListener("click", () => {
  const firstPanel = briefForm.querySelector('[data-step="1"]');
  const invalidField = firstInvalidField(firstPanel);
  if (invalidField) {
    showBriefError(invalidField, { focus: true });
    return;
  }
  clearPanelErrors(firstPanel);
  clearBriefStatus();
  showBriefStep(2);
  focusBriefStep(2);
});

briefForm?.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" || briefForm.dataset.step !== "1") return;
  if (!event.target.matches("input, select")) return;
  event.preventDefault();
  briefNext?.click();
});

briefBack?.addEventListener("click", () => {
  showBriefStep(1);
  focusBriefStep(1);
});

if (briefForm) {
  Object.entries(briefFieldLimits).forEach(([name, maxLength]) => {
    const field = briefForm.querySelector(`[name="${name}"]`);
    if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) field.maxLength = maxLength;
  });

  briefForm.addEventListener("invalid", (event) => {
    event.preventDefault();
    const field = event.target;
    if (!(field instanceof HTMLElement) || !field.matches("input, select, textarea")) return;
    const announce = !briefInvalidAnnouncementPending;
    if (announce) {
      briefInvalidAnnouncementPending = true;
      window.requestAnimationFrame(() => { briefInvalidAnnouncementPending = false; });
    }
    showBriefError(field, { announce });
  }, true);

  const updateBriefField = (event) => {
    const field = event.target;
    if (!(field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement)) return;
    if (field.type === "hidden") return;
    const hasValue = field.type === "checkbox" ? field.checked : field.value.trim().length > 0;
    field.classList.toggle("is-complete", hasValue && field.validity.valid);
    if (field.validity.valid) clearFieldError(field);
    else if (field.getAttribute("aria-invalid") === "true") showBriefError(field, { announce: false });
    const panel = field.closest("[data-step]");
    if (panel && briefStatus?.dataset.state === "caution" && !panel.querySelector('[aria-invalid="true"]')) {
      clearBriefStatus();
      briefForm.dispatchEvent(new CustomEvent("yc:brief-state", {
        detail: { state: briefForm.dataset.step === "2" ? "organize" : "observe" },
      }));
    }
  };

  briefForm.addEventListener("input", updateBriefField);
  briefForm.addEventListener("change", updateBriefField);

  const params = new URLSearchParams(window.location.search);
  const allowedSourceParams = ["service", "product", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  const sourceParams = new URLSearchParams();
  allowedSourceParams.forEach((name) => {
    const value = params.get(name)?.trim();
    if (value) sourceParams.set(name, value.slice(0, 120));
  });
  const sourceQuery = sourceParams.toString();
  const requestedService = params.get("service")?.trim() || "general";
  const sourceServiceField = briefForm.querySelector("[data-source-service]");
  if (sourceServiceField) sourceServiceField.value = requestedService.slice(0, 40);
  briefForm.querySelector("[data-source-product]").value = (params.get("product")?.trim() || "General").slice(0, 120);
  briefForm.querySelector("[data-source-path]").value = `${window.location.pathname}${sourceQuery ? `?${sourceQuery}` : ""}`.slice(0, 600);
  const needField = briefForm.querySelector('[name="need"]');
  const requestedNeed = params.get("product")?.trim();
  const needAliases = new Map([
    ["Desarrollo web", "Sitio web o comercio digital"],
    ["Sitios corporativos", "Sitio web o comercio digital"],
    ["Catálogos y comercio", "Sitio web o comercio digital"],
    ["Campañas y captación", "Sitio web o comercio digital"],
    ["Portales y experiencias", "Sitio web o comercio digital"],
    ["Diagnóstico de encaje", "No estoy seguro"],
    ["Primera fase operativa", "Operación interna"],
  ]);
  const preferredNeed = needAliases.get(requestedNeed) || (requestedService === "web" ? "Sitio web o comercio digital" : requestedNeed);
  if (needField && preferredNeed) {
    const matchingOption = [...needField.options].find((option) => option.value === preferredNeed || option.textContent.trim() === preferredNeed);
    if (matchingOption) needField.value = matchingOption.value;
  }

  const routeDataElement = document.querySelector("[data-contact-route-data]");
  let contactRoutes = [];
  try {
    contactRoutes = JSON.parse(routeDataElement?.textContent || "[]");
  } catch {
    contactRoutes = [];
  }
  const selectedRoute = contactRoutes.find((route) => route.product === requestedNeed)
    || contactRoutes.find((route) => route.service === requestedService)
    || contactRoutes[0];
  const routeSummary = briefForm.querySelector("[data-brief-route]");
  if (routeSummary && selectedRoute) {
    const routeServiceLabels = { general: "Diagnóstico", operations: "Operación", web: "Web comercial" };
    routeSummary.dataset.route = selectedRoute.key || requestedService;
    routeSummary.querySelector("[data-brief-route-service]").textContent = routeServiceLabels[selectedRoute.service] || "Ruta inicial";
    routeSummary.querySelector("[data-brief-route-title]").textContent = selectedRoute.label;
    routeSummary.querySelector("[data-brief-route-copy]").textContent = selectedRoute.contactCopy;
  }

  const contactTitle = document.querySelector("[data-contact-title]");
  const contactLead = document.querySelector("[data-contact-lead]");
  if (requestedService === "web") {
    if (contactTitle) contactTitle.textContent = "Cuéntanos qué debe lograr tu próxima web";
    if (contactLead) contactLead.textContent = "Completa este brief en 2–3 minutos. En 24–48 horas laborales recibirás una confirmación de encaje y el siguiente paso para estimar alcance, plazo e inversión.";
  } else if (requestedService === "operations") {
    if (contactTitle) contactTitle.textContent = "Cuéntanos qué parte de tu operación necesita más control";
    if (contactLead) contactLead.textContent = "Describe el proceso y la fricción principal. En 24–48 horas laborales recibirás una confirmación de encaje y las preguntas necesarias para delimitar una primera fase.";
  }

  briefForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (briefSending) return;

    const secondPanel = briefForm.querySelector('[data-step="2"]');
    const invalidField = firstInvalidField(secondPanel);
    if (invalidField) {
      showBriefError(invalidField, { focus: true });
      return;
    }

    briefSending = true;
    briefForm.dispatchEvent(new CustomEvent("yc:brief-state", { detail: { state: "sending" } }));
    briefSubmit.disabled = true;
    briefSubmit.textContent = "Enviando";
    briefStatus.dataset.state = "sending";
    briefStatus.textContent = "Enviando tu solicitud de forma segura...";
    const requestController = new AbortController();
    const requestTimeout = window.setTimeout(() => requestController.abort(), 15000);

    try {
      const endpoint = briefForm.action.replace("formsubmit.co/", "formsubmit.co/ajax/");
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(briefForm),
        signal: requestController.signal,
      });

      if (!response.ok) throw new Error(`Request failed with ${response.status}`);

      briefForm.querySelectorAll("[data-step], [data-brief-step], [data-brief-status], [data-brief-intro], [data-nen-form]").forEach((element) => {
        element.hidden = true;
      });
      briefSuccess.hidden = false;
      briefSuccess.focus?.();
      briefForm.dispatchEvent(new CustomEvent("yc:brief-state", { detail: { state: "success" } }));
    } catch (error) {
      briefStatus.dataset.state = "error";
      briefStatus.textContent = error?.name === "AbortError"
        ? "El env\u00edo tard\u00f3 m\u00e1s de 15 segundos. Int\u00e9ntalo nuevamente; tus datos siguen en el formulario."
        : "No pudimos enviar la solicitud. Revisa tu conexi\u00f3n e int\u00e9ntalo nuevamente; tus datos siguen en el formulario.";
      briefForm.dispatchEvent(new CustomEvent("yc:brief-state", { detail: { state: "error" } }));
    } finally {
      window.clearTimeout(requestTimeout);
      briefSending = false;
      briefSubmit.disabled = false;
      briefSubmit.textContent = "Enviar solicitud";
    }
  });
}

if (document.querySelector("[data-nen]")) {
  import("./nen-controller.js?v=yc-nen-sales-20260829j").catch((error) => {
    console.error("[Nen] No fue posible iniciar el controlador", error);
    document.documentElement.classList.add("nen-static-fallback");
    window.reportClientError?.({
      component: "nen-controller",
      message: error?.message || "unknown",
    });
  });
}
