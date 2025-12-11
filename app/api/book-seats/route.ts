import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * API endpoint for booking seats
 * Calls the Supabase RPC function to create a guest booking
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { seatIds, name, email, phone, amount } = body;

    // Validate required fields
    if (!seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid or missing seat IDs',
        },
        { status: 400 }
      );
    }

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Name is required',
        },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Valid email is required',
        },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== 'string' || phone.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Phone number is required',
        },
        { status: 400 }
      );
    }

    // Validate amount if provided
    if (amount !== undefined && (typeof amount !== 'number' || amount < 0)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid amount',
        },
        { status: 400 }
      );
    }

    // Call Supabase RPC function to create booking
    const { data, error } = await supabase.rpc('create_guest_booking', {
      p_seat_ids: seatIds,
      p_name: name.trim(),
      p_email: email.trim().toLowerCase(),
      p_phone: phone.trim(),
    });

    // Handle Supabase errors
    if (error) {
      console.error('Supabase RPC Error:', error);
      return NextResponse.json(
        {
          success: false,
          message: 'Database error occurred',
          error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        },
        { status: 500 }
      );
    }

    // Check if the RPC function returned a success response
    if (!data) {
      return NextResponse.json(
        {
          success: false,
          message: 'No response from booking service',
        },
        { status: 500 }
      );
    }

    // If data.success is false, it means the booking failed (e.g., seats unavailable)
    if (data.success === false) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || 'Booking failed',
        },
        { status: 400 }
      );
    }

    // Success!
    return NextResponse.json(
      {
        success: true,
        message: data.message || 'Booking successful',
        bookingId: data.booking_id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error:
          process.env.NODE_ENV === 'development' && error instanceof Error
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}
