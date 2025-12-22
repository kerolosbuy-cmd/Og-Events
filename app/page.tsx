'use client';

import { SeatMap } from '@/components/seat-map';
import { usePendingBookingRedirect } from '@/lib/booking-redirect';
import { useEffect } from 'react';

export default function Home() {
  // Check for pending bookings and redirect if needed
  usePendingBookingRedirect();
  
  // Using the specific plan ID
  const planId = '622637ae-480d-4fc2-9316-30d15f074af7';

  return (
    <div className="w-full h-screen overflow-hidden">
      <SeatMap planId={planId} />
    </div>
  );
}
