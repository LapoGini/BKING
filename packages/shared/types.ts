// Common types used across the monorepo

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export type UserRole = 'owner' | 'manager' | 'staff';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  tenantId: string;
}
