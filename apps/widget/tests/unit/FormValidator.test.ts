/**
 * FormValidator Unit Tests
 */

import { describe, it, expect } from "vitest";
import { FormValidator } from "../../src/services/FormValidator";
import type { FormSchema } from "../../src/types/schema.types";

describe("FormValidator", () => {
  const validator = new FormValidator();

  const mockSchema: FormSchema = {
    schemaVersion: "1.0.0",
    sections: [],
    fields: [
      {
        type: "text",
        name: "name",
        label: { en: "Name" },
        required: true,
      },
      {
        type: "email",
        name: "email",
        label: { en: "Email" },
        required: true,
      },
      {
        type: "number",
        name: "guests",
        label: { en: "Guests" },
        required: false,
        min: 1,
        max: 10,
      },
    ],
  };

  it("should validate required fields", () => {
    const errors = validator.validate({}, mockSchema);

    expect(errors).toHaveLength(2);
    expect(errors[0].code).toBe("required");
    expect(errors[1].code).toBe("required");
  });

  it("should pass validation with valid data", () => {
    const errors = validator.validate(
      {
        name: "John Doe",
        email: "john@example.com",
      },
      mockSchema,
    );

    expect(errors).toHaveLength(0);
  });

  it("should validate email format", () => {
    const errors = validator.validate(
      {
        name: "John Doe",
        email: "invalid-email",
      },
      mockSchema,
    );

    expect(errors).toHaveLength(1);
    expect(errors[0].code).toBe("invalid_email");
  });

  it("should validate number range", () => {
    const errors = validator.validate(
      {
        name: "John Doe",
        email: "john@example.com",
        guests: 15,
      },
      mockSchema,
    );

    expect(errors).toHaveLength(1);
    expect(errors[0].code).toBe("max_value");
  });

  it("should skip validation for empty optional fields", () => {
    const errors = validator.validate(
      {
        name: "John Doe",
        email: "john@example.com",
        guests: "", // Empty optional field
      },
      mockSchema,
    );

    expect(errors).toHaveLength(0);
  });
});
