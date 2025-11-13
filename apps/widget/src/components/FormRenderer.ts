/**
 * Form Renderer Component
 * Dynamically renders forms from JSON Schema
 */

import type { FormSchema, FormField, FormSection } from "../types/schema.types";
import type { I18nService } from "../services/I18nService";
import { evaluateCondition } from "../utils/conditions";
import { createElement } from "../utils/dom";

export class FormRenderer {
  private form: HTMLFormElement;
  private fieldValues: Record<string, any> = {};
  private fieldElements: Map<string, HTMLElement> = new Map();

  constructor(
    private schema: FormSchema,
    private initialData: Record<string, any>,
    private i18n: I18nService,
    private onSubmit: (data: Record<string, any>) => void,
  ) {
    this.fieldValues = { ...initialData };
    this.form = this.createForm();
  }

  render(): HTMLFormElement {
    return this.form;
  }

  private createForm(): HTMLFormElement {
    const form = createElement("form", {
      className: "rbm-form",
      attributes: {
        novalidate: "true", // Custom validation
      },
    }) as HTMLFormElement;

    form.addEventListener("submit", this.handleSubmit.bind(this));

    // Render sections
    this.schema.sections.forEach((section) => {
      const sectionEl = this.renderSection(section);
      if (sectionEl) form.appendChild(sectionEl);
    });

    // Submit button
    const submitBtn = createElement("button", {
      className: "rbm-btn rbm-btn-primary",
      textContent: this.i18n.t("form.submit"),
      attributes: {
        type: "submit",
      },
    });
    form.appendChild(submitBtn);

    return form;
  }

  private renderSection(section: FormSection): HTMLElement | null {
    // Evaluate visibility
    if (
      section.visible_when &&
      !evaluateCondition(section.visible_when, this.fieldValues)
    ) {
      return null;
    }

    const fieldset = createElement("fieldset", {
      className: "rbm-section",
      id: `section-${section.id}`,
      attributes: {
        "data-section-id": section.id,
      },
    });

    if (section.title || section.label) {
      const legend = createElement("legend", {
        className: "rbm-section-title",
        textContent: this.i18n.translateLabel(section.title || section.label),
      });
      fieldset.appendChild(legend);
    }

    if (section.description) {
      const desc = createElement("p", {
        className: "rbm-section-description",
        textContent: this.i18n.translateLabel(section.description),
      });
      fieldset.appendChild(desc);
    }

    // Render fields
    section.fields?.forEach((fieldName) => {
      const field = this.schema.fields.find((f) => f.name === fieldName);
      if (field) {
        const fieldEl = this.renderField(field);
        if (fieldEl) {
          fieldset.appendChild(fieldEl);
          this.fieldElements.set(field.name, fieldEl);
        }
      }
    });

    return fieldset;
  }

  private renderField(field: FormField): HTMLElement | null {
    // Evaluate visibility
    if (
      field.visible_when &&
      !evaluateCondition(field.visible_when, this.fieldValues)
    ) {
      return null;
    }

    const wrapper = createElement("div", {
      className: "rbm-field",
      attributes: {
        "data-field-type": field.type,
        "data-field-name": field.name,
      },
    });

    // Label
    const label = createElement("label", {
      className: "rbm-label",
      attributes: {
        for: `field-${field.name}`,
      },
    });

    label.textContent = this.i18n.translateLabel(field.label);

    if (field.required) {
      const required = createElement("abbr", {
        className: "rbm-required",
        textContent: "*",
        attributes: {
          title: this.i18n.t("form.required"),
          "aria-label": this.i18n.t("form.required"),
        },
      });
      required.style.textDecoration = "none";
      label.appendChild(document.createTextNode(" "));
      label.appendChild(required);
    }

    wrapper.appendChild(label);

    // Input
    const input = this.createInput(field);
    wrapper.appendChild(input);

    // Help text
    if (field.helpText) {
      const help = createElement("small", {
        className: "rbm-help",
        id: `help-${field.name}`,
        textContent: this.i18n.translateLabel(field.helpText),
      });
      wrapper.appendChild(help);
      input.setAttribute("aria-describedby", help.id);
    }

    // Error container
    const errorEl = createElement("div", {
      className: "rbm-error",
      id: `error-${field.name}`,
      attributes: {
        role: "alert",
        "aria-live": "assertive",
      },
    });
    wrapper.appendChild(errorEl);

    return wrapper;
  }

  private createInput(field: FormField): HTMLElement {
    let input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

    switch (field.type) {
      case "select":
        input = this.createSelectInput(field);
        break;

      case "textarea":
        input = this.createTextareaInput(field);
        break;

      case "checkbox":
        input = this.createCheckboxInput(field);
        break;

      case "radio":
        // For simplicity, using select for radio (can be enhanced)
        input = this.createSelectInput(field);
        break;

      case "date":
      case "time":
      case "email":
      case "tel":
      case "number":
        input = this.createTypedInput(field);
        break;

      default:
        input = this.createTextInput(field);
    }

    input.required = field.required || false;

    // Set initial value
    if (this.fieldValues[field.name] !== undefined) {
      if (field.type === "checkbox") {
        (input as HTMLInputElement).checked = !!this.fieldValues[field.name];
      } else {
        input.value = String(this.fieldValues[field.name]);
      }
    } else if (field.default !== undefined) {
      if (field.type === "checkbox") {
        (input as HTMLInputElement).checked = !!field.default;
      } else {
        input.value = String(field.default);
      }
      this.fieldValues[field.name] = field.default;
    }

    // Event for conditional logic
    input.addEventListener("change", () => {
      this.handleFieldChange(field, input);
    });

    return input;
  }

  private createSelectInput(field: FormField): HTMLSelectElement {
    const select = createElement("select", {
      className: "rbm-select",
      id: `field-${field.name}`,
      attributes: {
        name: field.name,
      },
    }) as HTMLSelectElement;

    // Placeholder option
    const placeholder = createElement("option", {
      textContent:
        this.i18n.translateLabel(field.placeholder) ||
        this.i18n.t("form.select"),
      attributes: {
        value: "",
        disabled: "true",
        selected: "true",
      },
    });
    select.appendChild(placeholder);

    // Options
    field.options?.forEach((opt) => {
      const option = createElement("option", {
        textContent: this.i18n.translateLabel(opt.label),
        attributes: {
          value: String(opt.value),
        },
      });
      select.appendChild(option);
    });

    return select;
  }

  private createTextareaInput(field: FormField): HTMLTextAreaElement {
    const textarea = createElement("textarea", {
      className: "rbm-textarea",
      id: `field-${field.name}`,
      attributes: {
        name: field.name,
        placeholder: this.i18n.translateLabel(field.placeholder) || "",
      },
    }) as HTMLTextAreaElement;

    if (field.min) textarea.minLength = Number(field.min);
    if (field.max) textarea.maxLength = Number(field.max);

    return textarea;
  }

  private createCheckboxInput(field: FormField): HTMLInputElement {
    const input = createElement("input", {
      className: "rbm-checkbox",
      id: `field-${field.name}`,
      attributes: {
        type: "checkbox",
        name: field.name,
        value: "1",
      },
    }) as HTMLInputElement;

    return input;
  }

  private createTypedInput(field: FormField): HTMLInputElement {
    const input = createElement("input", {
      className: "rbm-input",
      id: `field-${field.name}`,
      attributes: {
        type: field.type,
        name: field.name,
        placeholder: this.i18n.translateLabel(field.placeholder) || "",
      },
    }) as HTMLInputElement;

    if (field.min !== undefined) input.min = String(field.min);
    if (field.max !== undefined) input.max = String(field.max);
    if (field.pattern) input.pattern = field.pattern;

    return input;
  }

  private createTextInput(field: FormField): HTMLInputElement {
    const input = createElement("input", {
      className: "rbm-input",
      id: `field-${field.name}`,
      attributes: {
        type: "text",
        name: field.name,
        placeholder: this.i18n.translateLabel(field.placeholder) || "",
      },
    }) as HTMLInputElement;

    if (field.pattern) input.pattern = field.pattern;

    return input;
  }

  private handleFieldChange(field: FormField, input: HTMLElement): void {
    // Update field values
    if (field.type === "checkbox") {
      this.fieldValues[field.name] = (input as HTMLInputElement).checked;
    } else {
      this.fieldValues[field.name] = (
        input as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      ).value;
    }

    // Clear error
    const errorEl = this.form.querySelector(`#error-${field.name}`);
    if (errorEl) {
      errorEl.textContent = "";
    }

    // Re-evaluate conditional fields
    this.refreshConditionalFields();
  }

  private refreshConditionalFields(): void {
    // Re-evaluate visibility for all fields with conditions
    this.schema.fields.forEach((field) => {
      if (field.visible_when) {
        const wrapper = this.fieldElements.get(field.name);
        if (wrapper) {
          const isVisible = evaluateCondition(
            field.visible_when,
            this.fieldValues,
          );
          wrapper.style.display = isVisible ? "" : "none";

          // Clear value if hidden
          if (!isVisible && this.fieldValues[field.name] !== undefined) {
            delete this.fieldValues[field.name];
            const input = wrapper.querySelector(
              "input, select, textarea",
            ) as HTMLInputElement;
            if (input) {
              if (field.type === "checkbox") {
                input.checked = false;
              } else {
                input.value = "";
              }
            }
          }
        }
      }
    });

    // Re-evaluate section visibility
    this.schema.sections.forEach((section) => {
      if (section.visible_when) {
        const sectionEl = this.form.querySelector(`#section-${section.id}`);
        if (sectionEl) {
          const isVisible = evaluateCondition(
            section.visible_when,
            this.fieldValues,
          );
          (sectionEl as HTMLElement).style.display = isVisible ? "" : "none";
        }
      }
    });
  }

  private handleSubmit(e: Event): void {
    e.preventDefault();

    const data = this.getFormData();

    // Client-side validation
    let hasErrors = false;

    this.schema.fields.forEach((field) => {
      // Skip validation for hidden fields
      if (
        field.visible_when &&
        !evaluateCondition(field.visible_when, this.fieldValues)
      ) {
        return;
      }

      const value = data[field.name];
      const errorEl = this.form.querySelector(`#error-${field.name}`);

      if (field.required && !value) {
        if (errorEl) {
          errorEl.textContent = this.i18n.t("error.required");
          hasErrors = true;
        }
      } else if (errorEl) {
        errorEl.textContent = "";
      }
    });

    if (!hasErrors) {
      this.onSubmit(data);
    }
  }

  private getFormData(): Record<string, any> {
    const formData = new FormData(this.form);
    const data: Record<string, any> = {};

    formData.forEach((value, key) => {
      data[key] = value;
    });

    // Add checkbox values (unchecked checkboxes don't appear in FormData)
    this.schema.fields
      .filter((f) => f.type === "checkbox")
      .forEach((field) => {
        if (!(field.name in data)) {
          data[field.name] = false;
        } else {
          data[field.name] = true;
        }
      });

    return data;
  }
}
