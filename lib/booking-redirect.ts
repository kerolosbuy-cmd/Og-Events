import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// Storage key for saving the booking information
const BOOKING_STORAGE_KEY = 'pendingBooking';

// Interface for booking information
export interface PendingBooking {
  bookingId: string;
  timestamp: number;
  paymentUploaded?: boolean; // Flag to track if payment was uploaded
  expired?: boolean; // Flag to track if booking was shown as expired
  // Add any other relevant booking data
}

// Save booking information to localStorage
export const savePendingBooking = (bookingId: string): void => {
  if (typeof window !== 'undefined') {
    const bookingData: PendingBooking = {
      bookingId,
      timestamp: Date.now(),
      paymentUploaded: false, // Default to false when saving new booking
    };
    localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(bookingData));
  }
};

// Get pending booking from localStorage
export const getPendingBooking = (): PendingBooking | null => {
  if (typeof window !== 'undefined') {
    try {
      const storedData = localStorage.getItem(BOOKING_STORAGE_KEY);
      if (storedData) {
        const bookingData = JSON.parse(storedData) as PendingBooking;

        // Check if booking was already shown as expired
        if (bookingData.expired) {
          return null; // Don't redirect if already shown as expired
        }

        // Check if booking is still valid (not expired)
        // 1 hour = 3600000 milliseconds
        const oneHour = 3600000;
        if (Date.now() - bookingData.timestamp < oneHour) {
          // Check if payment was already uploaded
          if (bookingData.paymentUploaded) {
            // Payment was already uploaded, remove and return null
            localStorage.removeItem(BOOKING_STORAGE_KEY);
            return null;
          }
          return bookingData;
        } else {
          // Mark as expired and keep in storage to prevent future redirects
          bookingData.expired = true;
          localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(bookingData));
          return null;
        }
      }
    } catch (error) {
      console.error('Error parsing pending booking data:', error);
      localStorage.removeItem(BOOKING_STORAGE_KEY);
    }
  }
  return null;
};

// Mark payment as uploaded (alternative to clearing booking)
export const markPaymentUploaded = (): void => {
  if (typeof window !== 'undefined') {
    try {
      const storedData = localStorage.getItem(BOOKING_STORAGE_KEY);
      if (storedData) {
        const bookingData = JSON.parse(storedData) as PendingBooking;
        bookingData.paymentUploaded = true;
        localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(bookingData));
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      localStorage.removeItem(BOOKING_STORAGE_KEY);
    }
  }
};

// Clear pending booking from localStorage
export const clearPendingBooking = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(BOOKING_STORAGE_KEY);
  }
};

// Function to clear expired flag after user clicks Go Back
// export const clearExpiredFlag = (): void => {
//   if (typeof window !== 'undefined') {
//     try {
//       const storedData = localStorage.getItem(BOOKING_STORAGE_KEY);
//       if (storedData) {
//         const bookingData = JSON.parse(storedData) as PendingBooking;
//         if (bookingData.expired) {
//           // If booking is marked as expired, completely remove it
//           localStorage.removeItem(BOOKING_STORAGE_KEY);
//         }
//       }
//     } catch (error) {
//       console.error('Error clearing expired flag:', error);
//       localStorage.removeItem(BOOKING_STORAGE_KEY);
//     }
//   }
// };

// Hook to handle redirect to payment page if there's a pending booking
export const usePendingBookingRedirect = (): void => {
  const router = useRouter();
  const isRedirecting = useRef(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    // Only redirect if on the home page
    const currentPath = window.location.pathname;
    if (currentPath !== '/') {
      return;
    }
    
    // Prevent multiple redirects
    if (isRedirecting.current) return;

    // Check for pending booking
    const pendingBooking = getPendingBooking();
    if (pendingBooking && pendingBooking.bookingId) {
      // Mark as redirecting to prevent multiple redirects
      isRedirecting.current = true;
      
      // Use window.location.href for a more reliable and immediate redirect
      // This bypasses Next.js router which can be slow
      window.location.href = `/payment/${pendingBooking.bookingId}`;
    }
  }, [router]);
};
