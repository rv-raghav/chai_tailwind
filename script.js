const ChaiCSS = window.ChaiCSS;

function renderReference() {
  if (!ChaiCSS) {
    return;
  }

  const container = document.querySelector("#chai-reference");
  if (!container) {
    return;
  }

  container.innerHTML = ChaiCSS.referenceGroups
    .map(
      (group, index) => `
        <article class="reference-card reveal chai-p-24 chai-rounded-xl chai-bg-foam chai-border chai-border-mist chai-shadow-sm" style="--delay: ${0.08 * (index + 1)}s;">
          <div class="chai-flex chai-items-center chai-justify-between chai-gap-12 chai-mb-16 chai-wrap">
            <h3 class="chai-text-xl chai-font-bold chai-text-cocoa">${group.title}</h3>
            <span class="badge-label chai-inline-block chai-px-12 chai-py-8 chai-rounded-full chai-bg-cream chai-text-cocoa chai-text-sm chai-font-semibold">
              ${group.utilities.length} examples
            </span>
          </div>
          <p class="chai-text-slate chai-leading-relaxed chai-mb-16">${group.blurb}</p>
          <div class="chip-list">
            ${group.utilities
              .map(
                (utility) => `
                  <code class="utility-chip chai-inline-block chai-px-12 chai-py-8 chai-rounded-full chai-bg-cream chai-text-cocoa chai-text-sm chai-font-semibold">
                    ${utility}
                  </code>
                `
              )
              .join("")}
          </div>
        </article>
      `
    )
    .join("");
}

function updateMetrics() {
  if (!ChaiCSS) {
    return;
  }

  const metrics = {
    "[data-chai-family-count]": String(ChaiCSS.referenceGroups.length),
    "[data-chai-color-count]": String(Object.keys(ChaiCSS.theme.colors).length),
    "[data-chai-example-count]": String(
      ChaiCSS.referenceGroups.reduce((total, group) => total + group.utilities.length, 0)
    )
  };

  Object.entries(metrics).forEach(([selector, value]) => {
    const node = document.querySelector(selector);
    if (node) {
      node.textContent = value;
    }
  });
}

function setupPlayground() {
  if (!ChaiCSS) {
    return;
  }

  const playground = document.querySelector("[data-playground]");
  if (!playground) {
    return;
  }

  const presets = {
    starter: {
      classes: {
        card: "chai-bg-foam chai-p-24 chai-rounded-2xl chai-border chai-border-mist chai-shadow-md",
        badge: "chai-inline-block chai-text-sm chai-text-chai chai-uppercase chai-tracking-wide chai-font-semibold",
        title: "chai-text-2xl chai-font-bold chai-text-cocoa chai-mt-8",
        body: "chai-text-slate chai-leading-relaxed chai-mt-12"
      },
      copy: {
        badge: "Chai component",
        title: "Utility-first card",
        body: "Build polished blocks with spacing, typography, surface, and alignment helpers from the same small system."
      }
    },
    contrast: {
      classes: {
        card: "chai-bg-cocoa chai-p-24 chai-rounded-2xl chai-shadow-lg",
        badge: "chai-inline-block chai-text-sm chai-text-gold chai-uppercase chai-tracking-wide chai-font-semibold",
        title: "chai-text-3xl chai-font-black chai-text-cream chai-mt-8",
        body: "chai-text-sand chai-leading-relaxed chai-mt-12"
      },
      copy: {
        badge: "Dark contrast",
        title: "Feature block with a richer mood",
        body: "Switch the surface, type scale, and color tokens to test how well the same component adapts to a stronger visual direction."
      }
    },
    editorial: {
      classes: {
        card: "chai-bg-cream chai-p-24 chai-rounded-xl chai-border chai-border-gold chai-shadow-sm",
        badge: "chai-inline-block chai-text-sm chai-text-roast chai-uppercase chai-tracking-wide chai-font-semibold",
        title: "chai-text-3xl chai-font-bold chai-text-roast chai-mt-8",
        body: "chai-text-slate chai-leading-relaxed chai-mt-12"
      },
      copy: {
        badge: "Soft editorial",
        title: "Lighter surface, calmer emphasis",
        body: "This preset leans into softer edges and lighter colors so you can compare how the same utility model behaves across different tones."
      }
    }
  };

  const classFields = {
    card: playground.querySelector("[data-playground-card-classes]"),
    badge: playground.querySelector("[data-playground-badge-classes]"),
    title: playground.querySelector("[data-playground-title-classes]"),
    body: playground.querySelector("[data-playground-body-classes]")
  };

  const copyFields = {
    badge: playground.querySelector("[data-playground-badge-copy]"),
    title: playground.querySelector("[data-playground-title-copy]"),
    body: playground.querySelector("[data-playground-body-copy]")
  };

  const preview = {
    card: playground.querySelector("[data-playground-card]"),
    badge: playground.querySelector("[data-playground-badge]"),
    title: playground.querySelector("[data-playground-title]"),
    body: playground.querySelector("[data-playground-body]")
  };

  const codeOutput = playground.querySelector("[data-playground-code]");
  const tokenButtons = playground.querySelectorAll("[data-playground-token]");
  const presetButtons = playground.querySelectorAll("[data-playground-preset]");
  const resetButton = playground.querySelector("[data-playground-reset]");
  const classInputs = Object.values(classFields).filter(Boolean);
  let activeField = classFields.card;

  function normalizeClassList(value) {
    const seen = new Set();

    return value
      .split(/\s+/)
      .map((token) => token.trim())
      .filter(Boolean)
      .filter((token) => {
        if (seen.has(token)) {
          return false;
        }

        seen.add(token);
        return true;
      })
      .join(" ");
  }

  function selectField(field) {
    activeField = field;

    classInputs.forEach((input) => {
      const wrapper = input.closest(".playground-field");
      if (wrapper) {
        wrapper.classList.toggle("is-active", input === field);
      }
    });
  }

  function buildMarkup(classState, copyState) {
    return [
      `<article class="${classState.card}">`,
      `  <span class="${classState.badge}">`,
      `    ${copyState.badge}`,
      "  </span>",
      `  <h3 class="${classState.title}">`,
      `    ${copyState.title}`,
      "  </h3>",
      `  <p class="${classState.body}">`,
      `    ${copyState.body}`,
      "  </p>",
      "</article>"
    ].join("\n");
  }

  function updatePreview() {
    const classState = {
      card: normalizeClassList(classFields.card.value),
      badge: normalizeClassList(classFields.badge.value),
      title: normalizeClassList(classFields.title.value),
      body: normalizeClassList(classFields.body.value)
    };

    const copyState = {
      badge: copyFields.badge.value.trim() || presets.starter.copy.badge,
      title: copyFields.title.value.trim() || presets.starter.copy.title,
      body: copyFields.body.value.trim() || presets.starter.copy.body
    };

    preview.card.className = classState.card;
    preview.badge.className = classState.badge;
    preview.title.className = classState.title;
    preview.body.className = classState.body;

    preview.badge.textContent = copyState.badge;
    preview.title.textContent = copyState.title;
    preview.body.textContent = copyState.body;
    codeOutput.textContent = buildMarkup(classState, copyState);

    ChaiCSS.refresh(playground);
  }

  function applyPreset(name) {
    const preset = presets[name];
    if (!preset) {
      return;
    }

    classFields.card.value = preset.classes.card;
    classFields.badge.value = preset.classes.badge;
    classFields.title.value = preset.classes.title;
    classFields.body.value = preset.classes.body;

    copyFields.badge.value = preset.copy.badge;
    copyFields.title.value = preset.copy.title;
    copyFields.body.value = preset.copy.body;

    selectField(classFields.card);
    updatePreview();
  }

  function appendToken(field, token) {
    const currentTokens = normalizeClassList(field.value)
      .split(" ")
      .filter(Boolean);

    if (!currentTokens.includes(token)) {
      currentTokens.push(token);
    }

    field.value = currentTokens.join(" ");
  }

  classInputs.forEach((input) => {
    input.addEventListener("focus", () => {
      selectField(input);
    });

    input.addEventListener("input", updatePreview);
    input.addEventListener("blur", () => {
      input.value = normalizeClassList(input.value);
      updatePreview();
    });
  });

  Object.values(copyFields).forEach((input) => {
    input.addEventListener("input", updatePreview);
  });

  tokenButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (!activeField) {
        return;
      }

      appendToken(activeField, button.dataset.playgroundToken);
      updatePreview();
      activeField.focus();
    });
  });

  presetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      applyPreset(button.dataset.playgroundPreset);
    });
  });

  if (resetButton) {
    resetButton.addEventListener("click", () => {
      applyPreset("starter");
    });
  }

  selectField(classFields.card);
  updatePreview();
}

function initializeChaiShowcase() {
  if (!ChaiCSS) {
    console.error("ChaiCSS runtime is missing. Load dist/chai-css.js before script.js.");
    return;
  }

  renderReference();
  updateMetrics();
  setupPlayground();
  ChaiCSS.refresh();
}

document.addEventListener("DOMContentLoaded", initializeChaiShowcase);
