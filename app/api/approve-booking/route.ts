import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  try {
    const { bookingId } = await request.json();

    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Start a transaction-like operation
    // 1. Update booking status to 'approved'
    const { error: bookingError } = await supabase
      .from('bookings')
      .update({ status: 'approved' })
      .eq('id', bookingId);

    if (bookingError) {
      console.error('Error approving booking:', bookingError);
      return NextResponse.json({ success: false, error: bookingError.message }, { status: 500 });
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
      return NextResponse.json({ success: false, error: seatsError.message }, { status: 500 });
    }

    // Revalidate the bookings page to show updated data
    revalidatePath('/og-admin/pending-bookings');

    return NextResponse.json({ success: true, error: null });
  } catch (err: any) {
    console.error('Unexpected error approving booking:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
