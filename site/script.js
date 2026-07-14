const navToggle = document.querySelector("[data-nav-toggle]");
const navPanel = document.querySelector("[data-nav-panel]");

function setNavigation(open) {
  if (!navToggle || !navPanel) return;
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Cerrar men\u00fa" : "Abrir men\u00fa");
  navPanel.classList.toggle("is-open", open);
  document.body.classList.toggle("nav-open", open);
}

navToggle?.addEventListener("click", () => {
  setNavigation(navToggle.getAttribute("aria-expanded") !== "true");
});

navPanel?.addEventListener("click", (event) => {
  if (event.target.closest("a")) setNavigation(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setNavigation(false);
});

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
}

function clearPanelErrors(panel) {
  panel?.querySelectorAll(".is-invalid, [aria-invalid='true']").forEach(clearFieldError);
}

function showBriefError(field, { focus = false } = {}) {
  if (!field) return;
  field.classList.add("is-invalid");
  field.setAttribute("aria-invalid", "true");
  if (briefStatus) {
    briefStatus.dataset.state = "caution";
    briefStatus.textContent = "Revisa el campo señalado para continuar.";
  }
  briefForm?.dispatchEvent(new CustomEvent("yc:brief-state", { detail: { state: "caution" } }));
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
  const field = briefForm.querySelector(`[data-step="${step}"] input, [data-step="${step}"] select, [data-step="${step}"] textarea`);
  field?.focus({ preventScroll: true });
  requestAnimationFrame(() => {
    const formRect = briefForm.getBoundingClientRect();
    const fieldRect = field?.getBoundingClientRect();
    const companionRect = briefForm.querySelector("[data-nexus-form]")?.getBoundingClientRect();
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

briefBack?.addEventListener("click", () => {
  showBriefStep(1);
  focusBriefStep(1);
});

if (briefForm) {
  briefForm.addEventListener("invalid", (event) => {
    const field = event.target;
    if (!(field instanceof HTMLElement) || !field.matches("input, select, textarea")) return;
    field.classList.add("is-invalid");
    field.setAttribute("aria-invalid", "true");
    if (briefInvalidAnnouncementPending) return;
    briefInvalidAnnouncementPending = true;
    showBriefError(field);
    window.requestAnimationFrame(() => { briefInvalidAnnouncementPending = false; });
  }, true);

  const updateBriefField = (event) => {
    const field = event.target;
    if (!(field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement)) return;
    if (field.type === "hidden") return;
    const hasValue = field.type === "checkbox" ? field.checked : field.value.trim().length > 0;
    field.classList.toggle("is-complete", hasValue && field.validity.valid);
    if (field.validity.valid) clearFieldError(field);
    const panel = field.closest("[data-step]");
    if (panel && briefStatus?.dataset.state === "caution" && !firstInvalidField(panel)) clearBriefStatus();
  };

  briefForm.addEventListener("input", updateBriefField);
  briefForm.addEventListener("change", updateBriefField);

  const params = new URLSearchParams(window.location.search);
  briefForm.querySelector("[data-source-product]").value = params.get("product") || "General";
  briefForm.querySelector("[data-source-path]").value = `${window.location.pathname}${window.location.search}`;

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

    try {
      const endpoint = briefForm.action.replace("formsubmit.co/", "formsubmit.co/ajax/");
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(briefForm),
      });

      if (!response.ok) throw new Error(`Request failed with ${response.status}`);

      briefForm.querySelectorAll("[data-step], [data-brief-step], [data-brief-status]").forEach((element) => {
        element.hidden = true;
      });
      briefSuccess.hidden = false;
      briefSuccess.focus?.();
      briefForm.dispatchEvent(new CustomEvent("yc:brief-state", { detail: { state: "success" } }));
    } catch {
      briefStatus.dataset.state = "error";
      briefStatus.textContent = "No pudimos enviar la solicitud. Revisa tu conexi\u00f3n e int\u00e9ntalo nuevamente; tus datos siguen en el formulario.";
      briefForm.dispatchEvent(new CustomEvent("yc:brief-state", { detail: { state: "error" } }));
    } finally {
      briefSending = false;
      briefSubmit.disabled = false;
      briefSubmit.textContent = "Enviar diagn\u00f3stico";
    }
  });
}

if (document.querySelector("[data-nexus]")) {
  import("./nexus-controller.js?v=20260714f").catch((error) => {
    console.error("[Nexus] No fue posible iniciar el controlador", error);
    document.documentElement.classList.add("nexus-static-fallback");
    window.reportClientError?.({
      component: "nexus-controller",
      message: error?.message || "unknown",
    });
  });
}
