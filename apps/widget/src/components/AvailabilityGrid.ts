/**
 * Availability Grid Component
 * Displays available time slots
 */

import type { ApiClient } from "../services/ApiClient";
import type { I18nService } from "../services/I18nService";
import type { TimeSlot } from "../types/api.types";
import { createElement } from "../utils/dom";
import { format, parseISO } from "date-fns";

export class AvailabilityGrid {
  private container: HTMLDivElement;
  private selectedDate: string | null = null;
  private slots: TimeSlot[] = [];

  constructor(
    private formData: Record<string, any>,
    private apiClient: ApiClient,
    private i18n: I18nService,
    private onSlotSelect: (slot: TimeSlot) => void,
    private onBack: () => void,
  ) {
    this.container = createElement("div", { className: "rbm-availability" });
    this.selectedDate = formData.date || null;
  }

  render(): HTMLElement {
    this.container.innerHTML = "";

    // Header
    const header = createElement("div", {
      className: "rbm-availability-header",
    });

    const title = createElement("h2", {
      className: "rbm-availability-title",
      textContent: this.i18n.t("availability.title"),
    });
    header.appendChild(title);

    const backBtn = createElement("button", {
      className: "rbm-btn rbm-btn-secondary",
      textContent: this.i18n.t("form.back"),
      attributes: {
        type: "button",
        "aria-label": this.i18n.t("form.back"),
      },
    });
    backBtn.addEventListener("click", () => this.onBack());
    header.appendChild(backBtn);

    this.container.appendChild(header);

    // Date picker
    if (!this.selectedDate) {
      const datePicker = this.createDatePicker();
      this.container.appendChild(datePicker);
    } else {
      // Load and display slots
      this.loadSlots();
    }

    return this.container;
  }

  private createDatePicker(): HTMLElement {
    const picker = createElement("div", { className: "rbm-date-picker" });

    const label = createElement("label", {
      className: "rbm-label",
      textContent: this.i18n.t("availability.selectDate"),
    });

    const input = createElement("input", {
      className: "rbm-input",
      attributes: {
        type: "date",
        id: "availability-date",
        min: new Date().toISOString().split("T")[0],
      },
    }) as HTMLInputElement;

    input.addEventListener("change", () => {
      this.selectedDate = input.value;
      this.loadSlots();
    });

    label.setAttribute("for", "availability-date");

    picker.appendChild(label);
    picker.appendChild(input);

    return picker;
  }

  private async loadSlots(): Promise<void> {
    if (!this.selectedDate) return;

    try {
      const loading = createElement("div", {
        className: "rbm-loading",
        textContent: this.i18n.t("status.loading"),
        attributes: {
          role: "alert",
          "aria-busy": "true",
        },
      });

      this.container.appendChild(loading);

      const response = await this.apiClient.checkAvailability({
        date: this.selectedDate,
        serviceId: this.formData.serviceId,
        venueId: this.formData.venueId,
        partySize: this.formData.partySize,
        duration: this.formData.duration,
      });

      this.container.removeChild(loading);
      this.slots = response.slots;
      this.renderSlots();
    } catch (error) {
      console.error("[AvailabilityGrid] Error loading slots:", error);
      const errorEl = createElement("div", {
        className: "rbm-error",
        textContent: this.i18n.t("error.generic"),
        attributes: {
          role: "alert",
        },
      });
      this.container.appendChild(errorEl);
    }
  }

  private renderSlots(): void {
    // Remove existing slot grid if any
    const existingGrid = this.container.querySelector(".rbm-slot-grid");
    if (existingGrid) {
      this.container.removeChild(existingGrid);
    }

    if (this.slots.length === 0) {
      const noSlots = createElement("div", {
        className: "rbm-no-slots",
        textContent: this.i18n.t("availability.noSlots"),
        attributes: {
          role: "status",
        },
      });
      this.container.appendChild(noSlots);
      return;
    }

    const grid = createElement("div", {
      className: "rbm-slot-grid",
      attributes: {
        role: "list",
        "aria-label": this.i18n.t("availability.title"),
      },
    });

    this.slots.forEach((slot) => {
      if (slot.status === "available") {
        const slotBtn = this.createSlotButton(slot);
        grid.appendChild(slotBtn);
      }
    });

    this.container.appendChild(grid);
  }

  private createSlotButton(slot: TimeSlot): HTMLElement {
    const time = format(parseISO(slot.startTime), "HH:mm");

    const button = createElement("button", {
      className: "rbm-slot-btn",
      textContent: time,
      attributes: {
        type: "button",
        role: "listitem",
        "aria-label": `${time} - ${slot.status}`,
      },
    });

    button.addEventListener("click", () => {
      this.onSlotSelect(slot);
    });

    return button;
  }
}
