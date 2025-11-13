/**
 * Vitest Setup File
 */

import { beforeAll, afterEach } from "vitest";

// Setup jsdom
beforeAll(() => {
  // Mock window.customElements if not available
  if (!window.customElements) {
    (window as any).customElements = {
      define: () => {},
      get: () => undefined,
    };
  }
});

// Cleanup after each test
afterEach(() => {
  document.body.innerHTML = "";
});
