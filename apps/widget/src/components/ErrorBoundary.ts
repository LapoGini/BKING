/**
 * Error Boundary Component
 * Displays user-friendly error messages
 */

import type { I18nService } from "../services/I18nService";
import { createElement } from "../utils/dom";

export class ErrorBoundary {
  private container: HTMLDivElement;

  constructor(
    private error: Error,
    private i18n: I18nService,
    private onRetry: () => void,
  ) {
    this.container = createElement("div", { className: "rbm-error-boundary" });
  }

  render(): HTMLElement {
    this.container.innerHTML = "";

    // Error icon
    const icon = createElement("div", {
      className: "rbm-error-icon",
      attributes: {
        role: "img",
        "aria-label": "Error",
      },
    });
    icon.innerHTML = `
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
    `;
    this.container.appendChild(icon);

    // Error message
    const title = createElement("h2", {
      className: "rbm-error-title",
      textContent: this.i18n.t("error.generic"),
    });
    this.container.appendChild(title);

    // Technical details (hidden by default)
    const details = createElement("details", {
      className: "rbm-error-details",
    });

    const summary = createElement("summary", {
      textContent: "Technical Details",
    });
    details.appendChild(summary);

    const pre = createElement("pre", {
      textContent: this.error.stack || this.error.message,
    });
    details.appendChild(pre);

    this.container.appendChild(details);

    // Retry button
    const retryBtn = createElement("button", {
      className: "rbm-btn rbm-btn-primary",
      textContent: "Try Again",
      attributes: {
        type: "button",
      },
    });

    retryBtn.addEventListener("click", () => {
      this.onRetry();
    });

    this.container.appendChild(retryBtn);

    return this.container;
  }
}
