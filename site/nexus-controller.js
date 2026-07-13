const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function setNexusState(element, state, message) {
  if (!element) return;
  element.dataset.nexusState = reducedMotion ? "idle" : state;
  const messageTarget = element.querySelector("[data-nexus-message]");
  if (messageTarget && message) messageTarget.textContent = message;
}

function setupMethodExplorer() {
  const explorer = document.querySelector("[data-nexus-method]");
  if (!explorer) return;

  const steps = JSON.parse(explorer.querySelector("[data-nexus-steps]")?.textContent || "[]");
  const avatar = explorer.querySelector("[data-nexus]");
  const buttons = [...explorer.querySelectorAll("[data-nexus-step]")];
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
}

function setupBriefCompanion() {
  const form = document.querySelector("[data-brief-form]");
  const companion = document.querySelector("[data-nexus-form]");
  if (!form || !companion) return;

  const avatar = companion.querySelector("[data-nexus]");
  const text = companion.querySelector("[data-nexus-form-text]");
  const messages = {
    observe: "Primero entendamos qué proceso necesita más control.",
    connect: "Ahora conectemos el problema con el contexto de tu operación.",
    sending: "Estamos organizando la información.",
    success: "Diagnóstico recibido. El siguiente paso es revisar el alcance inicial.",
    caution: "Hay un dato o conexión que debemos revisar.",
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
setupBriefCompanion();
setupVisibilityPause();
