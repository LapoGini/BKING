/**
 * API Types
 * Based on OpenAPI spec
 */

import type { FormSchema } from "./schema.types";

export interface TenantConfig {
  id: string;
  name: string;
  logo?: string;
  primaryColor?: string;
  locale?: string;
}

export interface ConfigResponse {
  form: FormSchema;
  tenant: TenantConfig;
  features?: {
    multiLanguage?: boolean;
    realTimeAvailability?: boolean;
    paymentRequired?: boolean;
  };
}

export interface AvailabilityRequest {
  serviceId?: string;
  venueId?: string;
  date: string; // ISO date
  duration?: number;
  partySize?: number;
}

export interface TimeSlot {
  id: string;
  startTime: string; // ISO datetime
  endTime: string; // ISO datetime
  status: "available" | "limited" | "unavailable";
  capacity?: number;
  price?: number;
}

export interface AvailabilityResponse {
  date: string;
  slots: TimeSlot[];
  nextAvailableDate?: string;
}

export interface BookingRequest {
  formData: Record<string, any>;
  slotId: string;
  serviceId?: string;
  venueId?: string;
  notes?: string;
}

export interface Booking {
  id: string;
  status: "pending" | "confirmed" | "cancelled";
  confirmationCode: string;
  slot: TimeSlot;
  customerEmail: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
  details?: Record<string, any>;
}
