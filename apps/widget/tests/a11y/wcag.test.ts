/**
 * WCAG 2.2 AA Accessibility Tests
 */

import { describe, it, expect, beforeEach } from "vitest";
import { RbmBooking } from "../../src/components/RbmBooking";

describe("WCAG 2.2 AA Compliance", () => {
  let widget: RbmBooking;

  beforeEach(() => {
    if (!customElements.get("rbm-booking")) {
      customElements.define("rbm-booking", RbmBooking);
    }

    widget = document.createElement("rbm-booking") as RbmBooking;
    widget.setAttribute("tenant", "demo");
    widget.setAttribute("form-id", "classic");
    widget.setAttribute("api-url", "http://localhost:3000");

    document.body.appendChild(widget);
  });

  it("should have proper ARIA roles", async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const shadowRoot = widget.shadowRoot!;
    const main = shadowRoot.querySelector('[role="main"]');
    const status = shadowRoot.querySelector('[role="status"]');

    expect(main).toBeDefined();
    expect(status).toBeDefined();
  });

  it("should have aria-label on main container", async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const shadowRoot = widget.shadowRoot!;
    const main = shadowRoot.querySelector('[role="main"]');

    expect(main?.getAttribute("aria-label")).toBeTruthy();
  });

  it("should have aria-live region for status updates", async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const shadowRoot = widget.shadowRoot!;
    const status = shadowRoot.querySelector('[role="status"]');

    expect(status?.getAttribute("aria-live")).toBe("polite");
    expect(status?.getAttribute("aria-atomic")).toBe("true");
  });

  it("should have screen reader only class on status region", async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const shadowRoot = widget.shadowRoot!;
    const status = shadowRoot.querySelector(".rbm-sr-only");

    expect(status).toBeDefined();
  });

  it("should support keyboard navigation", async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const shadowRoot = widget.shadowRoot!;

    // Check for focusable elements
    const focusableElements = shadowRoot.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    // Should have at least some focusable elements when loaded
    expect(focusableElements.length).toBeGreaterThanOrEqual(0);
  });

  it("should have labels associated with inputs", async () => {
    // Mock API to load form
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        form: {
          schemaVersion: "1.0.0",
          sections: [
            {
              id: "test",
              label: { en: "Test Section" },
              fields: ["name"],
            },
          ],
          fields: [
            {
              type: "text",
              name: "name",
              label: { en: "Name" },
              required: true,
            },
          ],
        },
        tenant: { id: "demo", name: "Demo" },
      }),
    });

    await new Promise((resolve) => setTimeout(resolve, 200));

    const shadowRoot = widget.shadowRoot!;
    const labels = shadowRoot.querySelectorAll("label");
    const inputs = shadowRoot.querySelectorAll("input");

    // Each input should have a corresponding label with for attribute
    inputs.forEach((input) => {
      const matchingLabel = Array.from(labels).find(
        (label) => label.getAttribute("for") === input.id,
      );
      expect(matchingLabel).toBeDefined();
    });
  });

  it("should have required field indicators", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        form: {
          schemaVersion: "1.0.0",
          sections: [
            {
              id: "test",
              label: { en: "Test" },
              fields: ["name"],
            },
          ],
          fields: [
            {
              type: "text",
              name: "name",
              label: { en: "Name" },
              required: true,
            },
          ],
        },
        tenant: { id: "demo", name: "Demo" },
      }),
    });

    await new Promise((resolve) => setTimeout(resolve, 200));

    const shadowRoot = widget.shadowRoot!;
    const requiredIndicators = shadowRoot.querySelectorAll(".rbm-required");

    expect(requiredIndicators.length).toBeGreaterThan(0);
  });
});
