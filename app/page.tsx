'use client';

import { SeatMap } from '@/components/seat-map';
import { usePendingBookingRedirect } from '@/lib/booking-redirect';
import { useEffect } from 'react';

export default function Home() {
  // Check for pending bookings and redirect if needed
  usePendingBookingRedirect();
  
  // Using the specific plan ID
  const planId = '504317e9-1d2b-4928-a7ac-2589e12544cb';

  return (
    <div className="w-full h-screen overflow-hidden">
      <SeatMap planId={planId} />
    </div>
  );
}

