/**
 * Centralized Type Exports
 * Barrel file for easy importing of types throughout the application
 *
 * Usage:
 * import { Seat, Booking, ApiResponse } from '@/types';
 */

// Seat Management
export type {
  Seat,
  Row,
  Area,
  Zone,
  Category,
  Venue,
  MapData,
  ViewerState,
  LegendItem,
  SeatStatus,
} from './seat';

// Booking System
export type {
  GuestForm,
  Booking,
  BookingSeat,
  BookingStatus,
  BookingResponse,
  PaymentUploadResponse,
} from './booking';

// Common Utilities
export type {
  ApiResponse,
  ApiError,
  PaginationParams,
  PaginatedResponse,
  Theme,
  Settings,
} from './common';
