'use client';

import { BookingData } from './actions';

interface ActionResult {
  success: boolean;
  error: string | null;
}

// Client-side function to generate and download tickets
export const generateAndDownloadTickets = async (bookingId: string): Promise<ActionResult> => {
  try {
    const response = await fetch('/api/generate-tickets-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bookingId }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate tickets');
    }

    // Get the HTML content from the response
    const htmlContent = await response.text();

    // Create a blob from the HTML content
    const blob = new Blob([htmlContent], { type: 'text/html' });

    // Create a URL for the blob
    const url = window.URL.createObjectURL(blob);

    // Create a temporary link element and click it to download the tickets
    const a = document.createElement('a');
    a.href = url;
    a.download = `tickets-${bookingId.substring(0, 8)}.html`;
    document.body.appendChild(a);
    a.click();

    // Clean up
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 0);

    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message || 'An unexpected error occurred' };
  }
};

// Client-side function to generate and download separate tickets as PDFs
export const generateAndDownloadSeparateTickets = async (
  bookingId: string
): Promise<ActionResult> => {
  try {
    // Import the utility function
    const { downloadSeparateTickets } = await import('@/lib/pdf-utils');

    // Call the utility function to download separate tickets
    await downloadSeparateTickets(bookingId);

    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message || 'An unexpected error occurred' };
  }
};
