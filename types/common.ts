/**
 * Common Utility Types
 * Shared types used across the application
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type Theme = 'light' | 'dark';

export interface Settings {
  eventName: string;
  eventDate: string;
  eventTime: string;
  contactEmail?: string;
  contactPhone?: string;
  paymentInstructions?: string;
}
