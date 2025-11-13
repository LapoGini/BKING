/**
 * ApiClient Unit Tests
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { ApiClient } from "../../src/services/ApiClient";

describe("ApiClient", () => {
  let client: ApiClient;

  beforeEach(() => {
    client = new ApiClient("http://localhost:3000", "test-tenant");
  });

  it("should create instance with base URL and tenant", () => {
    expect(client).toBeDefined();
  });

  it("should include tenant header in requests", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ form: {}, tenant: {} }),
    });

    global.fetch = mockFetch;

    await client.getConfig("test-form");

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:3000/v1/config?formId=test-form",
      expect.objectContaining({
        headers: expect.objectContaining({
          "X-Tenant-ID": "test-tenant",
        }),
      }),
    );
  });

  it("should handle API errors", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({ message: "Not found" }),
    });

    await expect(client.getConfig("invalid")).rejects.toThrow("Not found");
  });

  it("should retry on network errors", async () => {
    let callCount = 0;

    global.fetch = vi.fn().mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return Promise.reject(new Error("network error"));
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ form: {}, tenant: {} }),
      });
    });

    const result = await client.getConfig("test-form");

    expect(callCount).toBe(2);
    expect(result).toBeDefined();
  });
});
