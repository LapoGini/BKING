/**
 * Client-side Form Validator
 * Validates form data against JSON Schema
 */

import type {
  FormSchema,
  FormField,
  ValidationError,
} from "../types/schema.types";

export class FormValidator {
  validate(
    formData: Record<string, any>,
    schema: FormSchema,
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    schema.fields.forEach((field) => {
      const value = formData[field.name];
      const fieldErrors = this.validateField(field, value);
      errors.push(...fieldErrors);
    });

    return errors;
  }

  private validateField(field: FormField, value: any): ValidationError[] {
    const errors: ValidationError[] = [];

    // Required validation
    if (field.required && this.isEmpty(value)) {
      errors.push({
        field: field.name,
        message: `${this.getFieldLabel(field)} is required`,
        code: "required",
      });
      return errors; // Skip other validations if required fails
    }

    // Skip other validations if value is empty and not required
    if (this.isEmpty(value)) {
      return errors;
    }

    // Type-specific validations
    switch (field.type) {
      case "email":
        if (!this.isValidEmail(value)) {
          errors.push({
            field: field.name,
            message: `${this.getFieldLabel(field)} must be a valid email`,
            code: "invalid_email",
          });
        }
        break;

      case "tel":
        if (!this.isValidPhone(value)) {
          errors.push({
            field: field.name,
            message: `${this.getFieldLabel(field)} must be a valid phone number`,
            code: "invalid_phone",
          });
        }
        break;

      case "number":
        if (isNaN(Number(value))) {
          errors.push({
            field: field.name,
            message: `${this.getFieldLabel(field)} must be a number`,
            code: "invalid_number",
          });
        } else {
          // Min/max validation for numbers
          if (field.min !== undefined && Number(value) < Number(field.min)) {
            errors.push({
              field: field.name,
              message: `${this.getFieldLabel(field)} must be at least ${field.min}`,
              code: "min_value",
            });
          }
          if (field.max !== undefined && Number(value) > Number(field.max)) {
            errors.push({
              field: field.name,
              message: `${this.getFieldLabel(field)} must be at most ${field.max}`,
              code: "max_value",
            });
          }
        }
        break;

      case "text":
      case "textarea":
        // Min/max length validation
        if (field.min !== undefined && value.length < Number(field.min)) {
          errors.push({
            field: field.name,
            message: `${this.getFieldLabel(field)} must be at least ${field.min} characters`,
            code: "min_length",
          });
        }
        if (field.max !== undefined && value.length > Number(field.max)) {
          errors.push({
            field: field.name,
            message: `${this.getFieldLabel(field)} must be at most ${field.max} characters`,
            code: "max_length",
          });
        }
        break;
    }

    // Pattern validation
    if (field.pattern && typeof value === "string") {
      const regex = new RegExp(field.pattern);
      if (!regex.test(value)) {
        errors.push({
          field: field.name,
          message: `${this.getFieldLabel(field)} format is invalid`,
          code: "invalid_pattern",
        });
      }
    }

    return errors;
  }

  private isEmpty(value: any): boolean {
    return (
      value === undefined ||
      value === null ||
      value === "" ||
      (Array.isArray(value) && value.length === 0)
    );
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    // Basic phone validation - can be enhanced
    const phoneRegex = /^[\d\s\-+()]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
  }

  private getFieldLabel(field: FormField): string {
    // Try to get English label first, fallback to field name
    return field.label?.en || field.label?.it || field.name;
  }
}
