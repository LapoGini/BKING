/**
 * Booking Confirmation Component
 * Displays successful booking confirmation
 */

import type { I18nService } from "../services/I18nService";
import type { Booking } from "../types/api.types";
import { createElement } from "../utils/dom";

export class BookingConfirmation {
  private container: HTMLDivElement;
  private booking: Booking;

  constructor(
    private formData: Record<string, any>,
    private i18n: I18nService,
  ) {
    this.container = createElement("div", { className: "rbm-confirmation" });
    this.booking = formData.booking;
  }

  render(): HTMLElement {
    this.container.innerHTML = "";

    // Success icon
    const icon = createElement("div", {
      className: "rbm-confirmation-icon",
      attributes: {
        role: "img",
        "aria-label": this.i18n.t("confirmation.title"),
      },
    });
    icon.innerHTML = `
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M9 12l2 2 4-4"></path>
      </svg>
    `;
    this.container.appendChild(icon);

    // Title
    const title = createElement("h2", {
      className: "rbm-confirmation-title",
      textContent: this.i18n.t("confirmation.title"),
    });
    this.container.appendChild(title);

    // Confirmation code
    const codeSection = createElement("div", {
      className: "rbm-confirmation-code",
    });

    const codeLabel = createElement("div", {
      className: "rbm-confirmation-code-label",
      textContent: this.i18n.t("confirmation.code"),
    });
    codeSection.appendChild(codeLabel);

    const codeValue = createElement("div", {
      className: "rbm-confirmation-code-value",
      textContent: this.booking.confirmationCode,
    });
    codeSection.appendChild(codeValue);

    this.container.appendChild(codeSection);

    // Booking details
    const details = createElement("div", {
      className: "rbm-confirmation-details",
    });

    if (this.booking.slot) {
      const slotInfo = createElement("p", {
        textContent: `${new Date(this.booking.slot.startTime).toLocaleString()}`,
      });
      details.appendChild(slotInfo);
    }

    if (this.booking.customerEmail) {
      const emailInfo = createElement("p", {
        textContent: this.i18n.t("confirmation.email"),
      });
      details.appendChild(emailInfo);
    }

    this.container.appendChild(details);

    // Action button (optional - could reset widget)
    const newBookingBtn = createElement("button", {
      className: "rbm-btn rbm-btn-secondary",
      textContent: this.i18n.t("confirmation.newBooking"),
      attributes: {
        type: "button",
      },
    });

    newBookingBtn.addEventListener("click", () => {
      // Reload page or reset widget
      window.location.reload();
    });

    this.container.appendChild(newBookingBtn);

    return this.container;
  }
}
