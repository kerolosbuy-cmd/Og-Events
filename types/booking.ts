/**
 * Booking System Types
 * Type definitions for booking, payments, and orders
 */

export interface GuestForm {
  name: string;
  email: string;
  phone: string;
}

export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'timeout';

export interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  amount: number;
  status: BookingStatus;
  payment_proof_url?: string;
  image?: string | null; // Added to match admin actions
  created_at: string;
  updated_at?: string;
  seats?: BookingSeat[];
}

export interface BookingSeat {
  id: string;
  seat_number: string;
  category: string;
  status: string;
  rows: {
    row_number: string;
    zones: {
      name: string;
    };
  };
}

export interface BookingResponse {
  success: boolean;
  message?: string;
  bookingId?: string;
  data?: Booking;
  error?: string;
}

export interface PaymentUploadResponse {
  success: boolean;
  message?: string;
  url?: string;
  error?: string;
}
