'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Home } from 'lucide-react';
import Link from 'next/link';
import { clearPendingBooking } from '@/lib/booking-redirect';

export default function BookingConfirmationPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear any pending booking information
    clearPendingBooking();
    
    // Redirect to home after 10 seconds if user doesn't navigate away
    const timer = setTimeout(() => {
      router.push('/');
    }, 10000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Pending Approval</h1>
        <p className="text-gray-600 mb-6">
          Your payment proof has been submitted successfully. Your booking is now pending admin
          approval. You will receive a confirmation email once your booking is approved.
        </p>
        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            <span className="flex items-center justify-center">
              <Home className="h-5 w-5 mr-2" />
              Back to Home
            </span>
          </Link>
          <p className="text-sm text-gray-500">
            You will be automatically redirected to the home page in 10 seconds.
          </p>
        </div>
      </div>
    </div>
  );
}
