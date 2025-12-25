'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { BookingStatus } from '@/types/booking';

export interface BookingData {
  id: string;
  name: string;
  email: string;
  phone: string;
  amount: number;
  image: string | null;
  status: BookingStatus;
  created_at: string;
  seats: Array<{
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
  }>;
}

/**
 * Fetch all pending bookings that have payment proof uploaded
 */
export async function getPendingBookings(): Promise<{
  data: BookingData[] | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('bookings')
      .select(
        `
        id,
        name,
        email,
        phone,
        amount,
        image,
        status,
        created_at,
        seats (
          id,
          seat_number,
          category,
          status,
          rows (
            row_number,
            zones (
              name
            )
          )
        )
      `
      )
      .eq('status', 'pending')
      .not('image', 'is', null)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching pending bookings:', error);
      return { data: null, error: error.message };
    }

    return { data: data as unknown as BookingData[], error: null };
  } catch (err: any) {
    console.error('Unexpected error fetching pending bookings:', err);
    return { data: null, error: err.message || 'An unexpected error occurred' };
  }
}

/**
 * Approve a booking - updates booking status and seat status
 */
export async function approveBooking(
  bookingId: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient();

    // Start a transaction-like operation
    // 1. Update booking status to 'approved'
    const { error: bookingError } = await supabase
      .from('bookings')
      .update({ status: 'approved' })
      .eq('id', bookingId);

    if (bookingError) {
      console.error('Error approving booking:', bookingError);
      return { success: false, error: bookingError.message };
    }

    // 2. Update all seats associated with this booking to 'booked' status
    const { error: seatsError } = await supabase
      .from('seats')
      .update({ status: 'booked' })
      .eq('booking_id', bookingId);

    if (seatsError) {
      console.error('Error updating seats status:', seatsError);
      // Rollback booking status
      await supabase.from('bookings').update({ status: 'pending' }).eq('id', bookingId);
      return { success: false, error: seatsError.message };
    }

    // Revalidate the bookings page to show updated data
    revalidatePath('/og-admin/bookings');

    return { success: true, error: null };
  } catch (err: any) {
    console.error('Unexpected error approving booking:', err);
    return { success: false, error: err.message || 'An unexpected error occurred' };
  }
}

/**
 * Reject a booking - updates booking status and releases seats
 */
export async function rejectBooking(
  bookingId: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient();

    // 1. Update booking status to 'rejected'
    const { error: bookingError } = await supabase
      .from('bookings')
      .update({ status: 'rejected' })
      .eq('id', bookingId);

    if (bookingError) {
      console.error('Error rejecting booking:', bookingError);
      return { success: false, error: bookingError.message };
    }

    // 2. Release all seats (set booking_id to null and status to 'available')
    const { error: seatsError } = await supabase
      .from('seats')
      .update({
        booking_id: null,
        status: 'available',
      })
      .eq('booking_id', bookingId);

    if (seatsError) {
      console.error('Error releasing seats:', seatsError);
      // Rollback booking status
      await supabase.from('bookings').update({ status: 'pending' }).eq('id', bookingId);
      return { success: false, error: seatsError.message };
    }

    // Revalidate the bookings page to show updated data
    revalidatePath('/og-admin/bookings');

    return { success: true, error: null };
  } catch (err: any) {
    console.error('Unexpected error rejecting booking:', err);
    return { success: false, error: err.message || 'An unexpected error occurred' };
  }
}
