import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getPendingBookings, BookingData } from './actions';
import BookingsList from './BookingsList';

async function goBackToDashboard() {
  'use server';
  redirect('/og-admin');
}

async function BookingsContent() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If no user, redirect to login
  if (!user) {
    redirect('/auth/login');
  }

  // Check if the user is an authorized admin
  const authorizedAdmins = [
    'kerolos4work@gmail.com',
    // Add more admin email(s) here
  ];

  if (authorizedAdmins.length > 0 && !authorizedAdmins.includes(user.email || '')) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Access Denied</CardTitle>
            <CardDescription className="text-center">
              You are not authorized to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <form action={goBackToDashboard}>
              <Button type="submit" variant="outline">
                Go to Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fetch pending bookings
  const { data: bookings, error } = await getPendingBookings();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Booking Approvals</h1>
          <p className="text-gray-600 mt-1">Review and approve pending bookings</p>
        </div>
        <form action={goBackToDashboard}>
          <Button variant="outline" type="submit">
            Back to Dashboard
          </Button>
        </form>
      </div>

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">Error loading bookings: {error}</p>
          </CardContent>
        </Card>
      )}

      {!error && (!bookings || bookings.length === 0) ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <p className="text-gray-500 text-lg">No pending bookings to review</p>
            <p className="text-gray-400 text-sm mt-2">
              All bookings with payment proofs have been processed
            </p>
          </CardContent>
        </Card>
      ) : (
        <BookingsList bookings={bookings || []} />
      )}
    </div>
  );
}

export default async function BookingsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading bookings...</p>
          </div>
        </div>
      }
    >
      <BookingsContent />
    </Suspense>
  );
}
