import tippy, { createSingleton } from "tippy.js";
import type { Props as TippyProps, Placement } from "tippy.js";

function setupTippy() {
  const elements = document.querySelectorAll("[title]");

  const optionsElem = document.querySelector("[data-tooltips-options]");
  let userOptions: Partial<TippyProps> = {};
  if (optionsElem) {
    try {
      userOptions = JSON.parse(optionsElem?.innerHTML);
    } catch (e: any) {
      throw new Error(e.message);
    }
  }
  const globalOptions: Partial<TippyProps> = {
    /* Defaults */
    allowHTML: true,
    theme: "default",
    maxWidth: "none",
    delay: [15, 150],
    placement: "auto",
    interactive: true,
    /* Global user override */
    ...userOptions,
  };

  let tippyInstances = [];
  for (let i = 0, len = elements.length; i < len; i++) {
    const element = elements[i];
    if (element.nodeName === "IFRAME") {
      continue;
    }

    const options = { ...globalOptions };

    /* Extract per tooltip overrides */
    const title = element.getAttribute("title");
    if (typeof title === "string") {
      options.content = title;
    }
    // IDEA: extraction a generic pattern for all props? `[data-tooltip-{LOCAL}]`
    const placement = element.getAttribute("data-tooltip-placement");
    if (typeof element.getAttribute("data-tooltip-placement") === "string") {
      options.placement = placement as Placement;
    }
    const interactive = element.getAttribute("data-tooltip-interactive");
    /* Interactivity */
    if (typeof interactive === "string") {
      options.interactive = interactive === "true";
    }

    /* Initialize Tippy.js */
    tippyInstances.push(tippy(element, options));

    /* Delete regular title attributes which would interfere otherwise */
    element.setAttribute("title", "");
  }
  createSingleton(tippyInstances, { ...globalOptions });
}

/* Create a singleton for all tippy instances */
document.addEventListener("astro:page-load", () => setupTippy());
