/**
 * RBM Booking Widget Entry Point
 * Web Component for cross-CMS booking form embedding
 */

import { RbmBooking } from "./components/RbmBooking";

// Declare __VERSION__ global (defined by Vite)
declare const __VERSION__: string;

// Register the custom element if not already present
if (!customElements.get("rbm-booking")) {
  customElements.define("rbm-booking", RbmBooking);
}

// Export for programmatic use
export { RbmBooking };
export * from "./types/schema.types";
export * from "./types/api.types";

// Version export
export const VERSION = __VERSION__;

// Type for window global (optional)
declare global {
  interface Window {
    RbmBookingWidget?: {
      version: string;
      component: typeof RbmBooking;
    };
  }
}

// Expose global API
window.RbmBookingWidget = {
  version: VERSION,
  component: RbmBooking,
};
