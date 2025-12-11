/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

interface ActionButtonsProps {
  isDarkMode: boolean;
  file: File | null;
  isUploading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  bookingId: string;
}

export default function ActionButtons({ isDarkMode, file, isUploading, handleSubmit, bookingId }: ActionButtonsProps) {
  const router = useRouter();
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancelBooking = async () => {
    if (window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      setIsCancelling(true);
      try {
        // Import Supabase
        const { supabase } = await import('@/lib/supabase');

        // Delete the booking from the database
        const { error } = await supabase
          .from('bookings')
          .delete()
          .eq('id', bookingId);

        if (error) {
          console.error('Error cancelling booking:', error);
          alert('Failed to cancel booking. Please try again.');
        } else {
          // Remove the pending booking from local storage
          localStorage.removeItem('pendingBooking');

          // Redirect to home page
          router.push('/');
        }
      } catch (err) {
        console.error('Error cancelling booking:', err);
        alert('An error occurred while cancelling the booking.');
      } finally {
        setIsCancelling(false);
      }
    }
  };

  return (
    <div className="flex gap-3 mt-6">
      <button
        type="button"
        onClick={handleCancelBooking}
        disabled={isCancelling}
        className={`flex-1 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} font-medium py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center`}
      >
        {isCancelling ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
            Cancelling...
          </>
        ) : (
          <>
            <X className="h-4 w-4 mr-2" />
            Cancel Booking
          </>
        )}
      </button>
      <button
        type="submit"
        disabled={!file || isUploading}
        className={`flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 disabled:opacity-50 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg disabled:shadow-none transform hover:scale-[1.02] disabled:scale-100`}
        onClick={handleSubmit}
      >
        {isUploading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Uploading...
          </>
        ) : (
          <>
            Upload
          </>
        )}
      </button>
    </div>
  );
}