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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-500"></div>
        
        {/* Success icon with animation */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20"></div>
          <div className="relative bg-green-100 rounded-full p-4 mx-auto w-20 h-20 flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Pending Approval</h1>
        <div className="bg-green-50 rounded-lg p-4 mb-6 border border-green-100">
          <p className="text-gray-700 text-sm leading-relaxed">
            Your payment proof has been submitted successfully. Your booking is now pending admin
            approval. You will receive a confirmation email once your booking is approved.
          </p>
        </div>
        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all transform hover:scale-105 shadow-md"
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
