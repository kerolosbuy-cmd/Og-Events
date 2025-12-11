import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import TicketDesigner from '@/components/tickets/TicketDesigner';
import { TicketErrorBoundary } from '@/components/tickets/designer/TicketErrorBoundary';

async function goBackToDashboard() {
  'use server';
  redirect('/og-admin');
}

async function TicketsContent() {
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

  return (
    <div className="h-screen w-full">
      <TicketErrorBoundary>
        <TicketDesigner />
      </TicketErrorBoundary>
    </div>
  );
}

export default async function TicketsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading ticket designer...</p>
          </div>
        </div>
      }
    >
      <TicketsContent />
    </Suspense>
  );
}
