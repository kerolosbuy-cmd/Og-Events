/**
 * Application Constants
 * Centralized constants used across the application
 */

// Booking constants
export const BOOKING_TIMEOUT_MINUTES = 10;
export const BOOKING_STATUSES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  TIMEOUT: 'timeout',
} as const;

// Seat constants
export const SEAT_STATUSES = {
  AVAILABLE: 'available',
  BOOKED: 'booked',
  RESERVED: 'reserved',
  HOLD: 'hold',
  PENDING_APPROVAL: 'pending_approval',
} as const;

// API endpoints
export const API_ROUTES = {
  BOOK_SEATS: '/api/book-seats',
  APPROVE_BOOKING: '/api/approve-booking',
  REJECT_BOOKING: '/api/reject-booking',
  GENERATE_TICKETS: '/api/generate-tickets-pdf',
  GENERATE_SEPARATE_TICKETS: '/api/generate-separate-tickets-pdf',
} as const;

// Storage buckets
export const STORAGE_BUCKETS = {
  PAYMENT_PROOFS: 'payment-proofs',
  TICKETS: 'tickets',
} as const;

// Default values
export const DEFAULT_SEAT_RADIUS = 10;
export const DEFAULT_ZONE_COLOR = '#e0e0e0';
