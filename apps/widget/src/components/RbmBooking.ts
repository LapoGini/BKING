/**
 * RbmBooking Web Component
 * Main widget component with Shadow DOM
 */

import { ApiClient } from "../services/ApiClient";
import { FormRenderer } from "./FormRenderer";
import { AvailabilityGrid } from "./AvailabilityGrid";
import { BookingConfirmation } from "./BookingConfirmation";
import { ErrorBoundary } from "./ErrorBoundary";
import { FormValidator } from "../services/FormValidator";
import { I18nService } from "../services/I18nService";
import type { FormSchema } from "../types/schema.types";
import type {
  ConfigResponse,
  BookingRequest,
  TimeSlot,
} from "../types/api.types";

// Import CSS as strings (Vite supports ?inline)
import resetCSS from "../styles/reset.css?inline";
import themeCSS from "../styles/theme.css?inline";
import a11yCSS from "../styles/accessibility.css?inline";

type Step = "form" | "availability" | "confirmation" | "error";

export class RbmBooking extends HTMLElement {
  private shadow: ShadowRoot;
  private apiClient: ApiClient;
  private formValidator: FormValidator;
  private i18n: I18nService;

  // State
  private config: ConfigResponse | null = null;
  private formSchema: FormSchema | null = null;
  private currentStep: Step = "form";
  private formData: Record<string, any> = {};

  // DOM refs
  private container: HTMLDivElement;
  private statusRegion: HTMLDivElement;

  static get observedAttributes() {
    return ["tenant", "form-id", "locale", "theme", "color-scheme", "api-url"];
  }

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });

    // Initialize services
    const apiUrl = this.getAttribute("api-url") || "http://localhost:3000";
    const tenant = this.getAttribute("tenant") || "";
    this.apiClient = new ApiClient(apiUrl, tenant);
    this.formValidator = new FormValidator();
    this.i18n = new I18nService(this.getAttribute("locale") || "it");

    // Create main container
    this.container = document.createElement("div");
    this.container.className = "rbm-container";
    this.container.setAttribute("role", "main");
    this.container.setAttribute("aria-label", this.i18n.t("booking.title"));

    // Status region for screen reader updates
    this.statusRegion = document.createElement("div");
    this.statusRegion.className = "rbm-sr-only";
    this.statusRegion.setAttribute("role", "status");
    this.statusRegion.setAttribute("aria-live", "polite");
    this.statusRegion.setAttribute("aria-atomic", "true");
  }

  connectedCallback() {
    this.render();
    this.loadConfig();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue && this.shadow.childNodes.length > 0) {
      if (name === "locale") {
        this.i18n.setLocale(newValue);
      }
      if (name === "api-url" || name === "tenant") {
        const apiUrl = this.getAttribute("api-url") || "http://localhost:3000";
        const tenant = this.getAttribute("tenant") || "";
        this.apiClient = new ApiClient(apiUrl, tenant);
      }
      this.render();
    }
  }

  private render() {
    // Clear shadow DOM
    this.shadow.innerHTML = "";

    // Inject styles
    const style = document.createElement("style");
    style.textContent = `${resetCSS}\n${themeCSS}\n${a11yCSS}`;
    this.shadow.appendChild(style);

    // Apply theme attribute
    const theme = this.getAttribute("theme") || "auto";
    this.container.setAttribute("data-theme", theme);

    // Apply custom color scheme
    const colorScheme = this.getAttribute("color-scheme");
    if (colorScheme) {
      try {
        const colors = JSON.parse(colorScheme);
        Object.entries(colors).forEach(([key, value]) => {
          this.container.style.setProperty(`--rbm-${key}`, value as string);
        });
      } catch (e) {
        console.warn("[rbm-booking] Invalid color-scheme JSON:", e);
      }
    }

    // Add elements to DOM
    this.shadow.appendChild(this.statusRegion);
    this.shadow.appendChild(this.container);

    // Render current step
    this.renderCurrentStep();
  }

  private async loadConfig() {
    const formId = this.getAttribute("form-id");
    if (!formId) {
      this.showError(new Error(this.i18n.t("error.missingFormId")));
      return;
    }

    try {
      this.updateStatus(this.i18n.t("status.loading"));
      this.config = await this.apiClient.getConfig(formId);
      this.formSchema = this.config.form;
      this.renderCurrentStep();
      this.updateStatus(this.i18n.t("status.ready"));
    } catch (error) {
      this.showError(error as Error);
    }
  }

  private renderCurrentStep() {
    this.container.innerHTML = "";

    switch (this.currentStep) {
      case "form":
        if (this.formSchema) {
          const formRenderer = new FormRenderer(
            this.formSchema,
            this.formData,
            this.i18n,
            this.handleFormSubmit.bind(this),
          );
          this.container.appendChild(formRenderer.render());
        } else {
          this.container.innerHTML = `<div class="rbm-loading" role="alert" aria-busy="true">${this.i18n.t("status.loading")}</div>`;
        }
        break;

      case "availability": {
        const availabilityGrid = new AvailabilityGrid(
          this.formData,
          this.apiClient,
          this.i18n,
          this.handleSlotSelect.bind(this),
          this.handleBack.bind(this),
        );
        this.container.appendChild(availabilityGrid.render());
        break;
      }

      case "confirmation": {
        const confirmation = new BookingConfirmation(this.formData, this.i18n);
        this.container.appendChild(confirmation.render());
        break;
      }

      case "error": {
        const errorBoundary = new ErrorBoundary(
          this.formData.error,
          this.i18n,
          () => {
            this.currentStep = "form";
            this.formData = {};
            this.renderCurrentStep();
          },
        );
        this.container.appendChild(errorBoundary.render());
        break;
      }
    }
  }

  private async handleFormSubmit(data: Record<string, any>) {
    try {
      // Validate form
      const errors = this.formValidator.validate(data, this.formSchema!);
      if (errors.length > 0) {
        this.updateStatus(this.i18n.t("error.validationFailed"));
        console.error("[rbm-booking] Validation errors:", errors);
        return;
      }

      this.formData = { ...this.formData, ...data };
      this.currentStep = "availability";
      this.renderCurrentStep();
      this.updateStatus(this.i18n.t("status.loadingAvailability"));

      // Dispatch custom event
      this.dispatchEvent(
        new CustomEvent("rbm:availability", {
          detail: { data },
          bubbles: true,
          composed: true,
        }),
      );
    } catch (error) {
      this.showError(error as Error);
    }
  }

  private async handleSlotSelect(slot: TimeSlot) {
    try {
      this.updateStatus(this.i18n.t("status.creatingBooking"));

      const bookingRequest: BookingRequest = {
        formData: this.formData,
        slotId: slot.id,
        serviceId: this.formData.serviceId,
        venueId: this.formData.venueId,
      };

      const booking = await this.apiClient.createBooking(bookingRequest);

      this.formData.booking = booking;
      this.currentStep = "confirmation";
      this.renderCurrentStep();
      this.updateStatus(this.i18n.t("status.bookingConfirmed"));

      // Dispatch success event
      this.dispatchEvent(
        new CustomEvent("rbm:booking:created", {
          detail: { booking },
          bubbles: true,
          composed: true,
        }),
      );
    } catch (error) {
      this.showError(error as Error);
    }
  }

  private handleBack() {
    this.currentStep = "form";
    this.renderCurrentStep();
  }

  private showError(error: Error) {
    this.formData.error = error;
    this.currentStep = "error";
    this.renderCurrentStep();
    this.updateStatus(this.i18n.t("error.generic"));

    // Dispatch error event
    this.dispatchEvent(
      new CustomEvent("rbm:booking:error", {
        detail: { error },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private updateStatus(message: string) {
    this.statusRegion.textContent = message;
  }
}
