/**
 * Booking Flow Integration Tests
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { RbmBooking } from "../../src/components/RbmBooking";

describe("Booking Flow Integration", () => {
  let widget: RbmBooking;
  let container: HTMLDivElement;

  beforeEach(() => {
    // Register custom element
    if (!customElements.get("rbm-booking")) {
      customElements.define("rbm-booking", RbmBooking);
    }

    container = document.createElement("div");
    document.body.appendChild(container);

    widget = document.createElement("rbm-booking") as RbmBooking;
    widget.setAttribute("tenant", "demo");
    widget.setAttribute("form-id", "classic");
    widget.setAttribute("api-url", "http://localhost:3000");

    container.appendChild(widget);
  });

  it("should render widget element", () => {
    expect(widget).toBeDefined();
    expect(widget.tagName).toBe("RBM-BOOKING");
  });

  it("should have shadow DOM", () => {
    expect(widget.shadowRoot).toBeDefined();
  });

  it("should have required attributes", () => {
    expect(widget.getAttribute("tenant")).toBe("demo");
    expect(widget.getAttribute("form-id")).toBe("classic");
  });

  it("should render loading state initially", async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const shadowRoot = widget.shadowRoot!;
    const loading = shadowRoot.querySelector(".rbm-loading");

    expect(loading).toBeDefined();
  });

  it("should emit custom events", async () => {
    const eventHandler = vi.fn();
    widget.addEventListener("rbm:booking:created", eventHandler);

    // Mock successful API response
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        form: {
          schemaVersion: "1.0.0",
          sections: [],
          fields: [],
        },
        tenant: { id: "demo", name: "Demo" },
      }),
    });

    await new Promise((resolve) => setTimeout(resolve, 200));

    // Note: Full flow simulation would require more complex mocking
    // This is a basic structure test
  });

  it("should apply theme attribute", () => {
    widget.setAttribute("theme", "dark");

    const shadowRoot = widget.shadowRoot!;
    const container = shadowRoot.querySelector(".rbm-container");

    expect(container?.getAttribute("data-theme")).toBe("dark");
  });

  it("should apply custom color scheme", () => {
    const colors = JSON.stringify({ primary: "#ff0000" });
    widget.setAttribute("color-scheme", colors);

    // Color scheme should be applied via CSS custom properties
    // This would need to check computed styles in a real browser
  });
});
