/**
 * Accessibility Utility Functions
 */

export function announceToScreenReader(
  message: string,
  politeness: "polite" | "assertive" = "polite",
): void {
  const announcer = document.createElement("div");
  announcer.setAttribute("role", "status");
  announcer.setAttribute("aria-live", politeness);
  announcer.setAttribute("aria-atomic", "true");
  announcer.className = "rbm-sr-only";
  announcer.textContent = message;

  document.body.appendChild(announcer);

  setTimeout(() => {
    document.body.removeChild(announcer);
  }, 1000);
}

export function generateUniqueId(prefix: string = "rbm"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function linkLabelToInput(
  label: HTMLLabelElement,
  input: HTMLElement,
): void {
  const inputId = input.id || generateUniqueId("input");
  input.id = inputId;
  label.setAttribute("for", inputId);
}

export function addAriaDescription(
  element: HTMLElement,
  description: string,
): string {
  const descId = generateUniqueId("desc");
  const descElement = document.createElement("span");
  descElement.id = descId;
  descElement.className = "rbm-sr-only";
  descElement.textContent = description;

  element.parentElement?.appendChild(descElement);
  element.setAttribute("aria-describedby", descId);

  return descId;
}

export function setAriaInvalid(
  element: HTMLElement,
  invalid: boolean,
  errorMessage?: string,
): void {
  element.setAttribute("aria-invalid", String(invalid));

  if (invalid && errorMessage) {
    const errorId = generateUniqueId("error");
    const errorElement = document.createElement("div");
    errorElement.id = errorId;
    errorElement.className = "rbm-error";
    errorElement.setAttribute("role", "alert");
    errorElement.setAttribute("aria-live", "assertive");
    errorElement.textContent = errorMessage;

    element.parentElement?.appendChild(errorElement);

    const describedBy = element.getAttribute("aria-describedby");
    element.setAttribute(
      "aria-describedby",
      describedBy ? `${describedBy} ${errorId}` : errorId,
    );
  }
}

export function manageFocus(element: HTMLElement): void {
  element.focus();

  // Ensure focus is visible
  element.setAttribute("data-focus-visible-added", "");
}

export function trapFocus(container: HTMLElement): () => void {
  const focusableElements = container.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== "Tab") return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  };

  container.addEventListener("keydown", handleTabKey);

  return () => {
    container.removeEventListener("keydown", handleTabKey);
  };
}
