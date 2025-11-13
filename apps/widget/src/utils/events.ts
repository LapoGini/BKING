/**
 * Custom Event Factory
 */

export interface RbmEventDetail<T = any> {
  data?: T;
  error?: Error;
  booking?: any;
}

export type RbmEventType =
  | "rbm:availability"
  | "rbm:booking:created"
  | "rbm:booking:error"
  | "rbm:form:submit"
  | "rbm:form:change"
  | "rbm:step:change";

export function createRbmEvent<T = any>(
  type: RbmEventType,
  detail: RbmEventDetail<T>,
): CustomEvent<RbmEventDetail<T>> {
  return new CustomEvent(type, {
    detail,
    bubbles: true,
    composed: true,
    cancelable: true,
  });
}

export function dispatchRbmEvent<T = any>(
  target: EventTarget,
  type: RbmEventType,
  detail: RbmEventDetail<T>,
): boolean {
  const event = createRbmEvent(type, detail);
  return target.dispatchEvent(event);
}

export interface EventBus {
  on(event: RbmEventType, handler: (detail: any) => void): () => void;
  emit(event: RbmEventType, detail: any): void;
  off(event: RbmEventType, handler: (detail: any) => void): void;
}

export function createEventBus(): EventBus {
  const listeners = new Map<RbmEventType, Set<(detail: any) => void>>();

  return {
    on(event: RbmEventType, handler: (detail: any) => void) {
      if (!listeners.has(event)) {
        listeners.set(event, new Set());
      }
      listeners.get(event)!.add(handler);

      return () => this.off(event, handler);
    },

    emit(event: RbmEventType, detail: any) {
      const handlers = listeners.get(event);
      if (handlers) {
        handlers.forEach((handler) => handler(detail));
      }
    },

    off(event: RbmEventType, handler: (detail: any) => void) {
      const handlers = listeners.get(event);
      if (handlers) {
        handlers.delete(handler);
      }
    },
  };
}
