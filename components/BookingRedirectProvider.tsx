use client';

import { usePendingBookingRedirect } from '@/lib/booking-redirect';
import { useEffect } from 'react';

interface BookingRedirectProviderProps {
  children: React.ReactNode;
}

export const BookingRedirectProvider: React.FC<BookingRedirectProviderProps> = ({ children }) => {
  // Check for pending bookings immediately on component mount
  usePendingBookingRedirect();

  return <>{children}</>;
};
