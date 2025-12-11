
'use client';

import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { getPendingBooking } from '@/lib/booking-redirect';

interface ErrorStateProps {
  error: string;
}

export default function ErrorState({ error }: ErrorStateProps) {
  const router = useRouter();

  const handleGoBack = () => {
    // Check if booking is expired and mark it as shown
    const booking = getPendingBooking();
    if (booking && booking.timestamp) {
      const oneHour = 3600000;
      if (Date.now() - booking.timestamp >= oneHour) {
        // Mark as expired to prevent future redirects
        const updatedBooking = { ...booking, expired: true };
        localStorage.setItem('pendingBooking', JSON.stringify(updatedBooking));
      }
    }
    
    // Remove the saved booking ID from local storage
    localStorage.removeItem('pendingBooking');
    
    router.push('/');
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-6 text-center border border-white/10">
        <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Error</h2>
        <p className="text-gray-300 mb-6">{error}</p>
        <button
          onClick={handleGoBack}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
