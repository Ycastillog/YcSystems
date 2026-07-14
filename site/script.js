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
let briefSending = false;

function showBriefStep(step) {
  if (!briefForm || !briefStep) return;
  briefForm.dataset.step = String(step);
  briefStep.textContent = `Paso ${step} de 2`;
  briefForm.querySelectorAll("[data-step]").forEach((panel) => {
    panel.hidden = Number(panel.dataset.step) !== step;
  });
  briefForm.dispatchEvent(new CustomEvent("yc:brief-step", { detail: { step } }));
}

function firstInvalidField(panel) {
  return [...panel.querySelectorAll("input, select, textarea")].find((field) => !field.checkValidity());
}

briefNext?.addEventListener("click", () => {
  const firstPanel = briefForm.querySelector('[data-step="1"]');
  const invalidField = firstInvalidField(firstPanel);
  if (invalidField) {
    invalidField.reportValidity();
    return;
  }
  showBriefStep(2);
  briefForm.querySelector('[data-step="2"] input, [data-step="2"] select')?.focus();
});

briefBack?.addEventListener("click", () => showBriefStep(1));

if (briefForm) {
  const params = new URLSearchParams(window.location.search);
  briefForm.querySelector("[data-source-product]").value = params.get("product") || "General";
  briefForm.querySelector("[data-source-path]").value = `${window.location.pathname}${window.location.search}`;

  briefForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (briefSending) return;

    const secondPanel = briefForm.querySelector('[data-step="2"]');
    const invalidField = firstInvalidField(secondPanel);
    if (invalidField) {
      invalidField.reportValidity();
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
  import("./nexus-controller.js").catch((error) => {
    console.error("[Nexus] No fue posible iniciar el controlador", error);
    document.documentElement.classList.add("nexus-static-fallback");
    window.reportClientError?.({
      component: "nexus-controller",
      message: error?.message || "unknown",
    });
  });
}
