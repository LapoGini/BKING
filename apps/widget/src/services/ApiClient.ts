/**
 * API Client with retry and timeout logic
 */

import type {
  ConfigResponse,
  AvailabilityRequest,
  AvailabilityResponse,
  BookingRequest,
  Booking,
} from "../types/api.types";

export class ApiClient {
  private baseUrl: string;
  private tenant: string;
  private timeout: number = 15000;
  private maxRetries: number = 2;

  constructor(baseUrl: string, tenant: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.tenant = tenant;
  }

  async getConfig(formId: string): Promise<ConfigResponse> {
    return this.request<ConfigResponse>(`/v1/config?formId=${formId}`);
  }

  async checkAvailability(
    request: AvailabilityRequest,
  ): Promise<AvailabilityResponse> {
    return this.request<AvailabilityResponse>("/v1/availability", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  async createBooking(request: BookingRequest): Promise<Booking> {
    return this.request<Booking>("/v1/bookings", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retries = 0,
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          "X-Tenant-ID": this.tenant,
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: response.statusText,
        }));
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      // Retry logic
      if (retries < this.maxRetries && this.isRetryable(error)) {
        await this.delay(Math.pow(2, retries) * 1000);
        return this.request(endpoint, options, retries + 1);
      }

      throw error;
    }
  }

  private isRetryable(error: any): boolean {
    return (
      error.name === "AbortError" ||
      error.message?.includes("network") ||
      error.message?.includes("timeout")
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
