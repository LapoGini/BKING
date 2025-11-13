/**
 * DOM Utility Functions
 */

export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options: {
    className?: string;
    id?: string;
    textContent?: string;
    attributes?: Record<string, string>;
    children?: HTMLElement[];
  } = {},
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);

  if (options.className) {
    element.className = options.className;
  }

  if (options.id) {
    element.id = options.id;
  }

  if (options.textContent) {
    element.textContent = options.textContent;
  }

  if (options.attributes) {
    Object.entries(options.attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }

  if (options.children) {
    options.children.forEach((child) => element.appendChild(child));
  }

  return element;
}

export function removeAllChildren(element: HTMLElement): void {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

export function setAttributes(
  element: HTMLElement,
  attributes: Record<string, string>,
): void {
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
}

export function toggleClass(
  element: HTMLElement,
  className: string,
  condition: boolean,
): void {
  if (condition) {
    element.classList.add(className);
  } else {
    element.classList.remove(className);
  }
}

export function delegateEvent<K extends keyof HTMLElementEventMap>(
  root: HTMLElement,
  selector: string,
  eventType: K,
  handler: (event: HTMLElementEventMap[K], target: Element) => void,
): void {
  root.addEventListener(eventType, (event) => {
    const target = (event.target as Element).closest(selector);
    if (target) {
      handler(event, target);
    }
  });
}
