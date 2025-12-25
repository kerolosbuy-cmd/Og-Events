'use client';

// Import the BookingData interface
import { BookingData } from './actions';

// Define the result interface
interface ActionResult {
  success: boolean;
  error: string | null;
}

// Client-side wrapper for server actions
export const handleApproveBooking = async (bookingId: string): Promise<ActionResult> => {
  try {
    const response = await fetch('/api/approve-booking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bookingId }),
    });

    if (!response.ok) {
      throw new Error('Failed to approve booking');
    }

    return await response.json();
  } catch (err: any) {
    return { success: false, error: err.message || 'An unexpected error occurred' };
  }
};

export const handleRejectBooking = async (bookingId: string): Promise<ActionResult> => {
  try {
    const response = await fetch('/api/reject-booking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bookingId }),
    });

    if (!response.ok) {
      throw new Error('Failed to reject booking');
    }

    return await response.json();
  } catch (err: any) {
    return { success: false, error: err.message || 'An unexpected error occurred' };
  }
};
