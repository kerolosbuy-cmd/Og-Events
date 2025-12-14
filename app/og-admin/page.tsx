import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Suspense } from 'react';
import { goToSettings, logout } from './actions';
import { isUserAdmin } from '@/lib/auth';

async function AdminDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If no user, redirect to login
  if (!user) {
    redirect('/auth/login');
  }

  // Check if the user is an authorized admin
  if (!isUserAdmin(user)) {
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
            <form action={() => redirect('/')}>
              <Button type="submit" variant="outline">
                Go to Home
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render admin dashboard
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage user accounts and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Manage Users</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Event Management</CardTitle>
            <CardDescription>Create and manage events</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Manage Events</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Bookings</CardTitle>
            <CardDescription>
              View and approve bookings with pending status and payment proofs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action="/og-admin/pending-bookings">
              <Button type="submit" className="w-full">
                View Pending Bookings
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Approved Bookings</CardTitle>
            <CardDescription>View approved bookings and download HTML tickets</CardDescription>
          </CardHeader>
          <CardContent>
            <form action="/og-admin/booked-orders">
              <Button type="submit" className="w-full">
                View Approved Bookings
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
            <CardDescription>View analytics and reports</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">View Analytics</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ticket Designer</CardTitle>
            <CardDescription>Create custom tickets with images and details</CardDescription>
          </CardHeader>
          <CardContent>
            <form action="/og-admin/tickets">
              <Button type="submit" className="w-full">
                Design Tickets
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Configure application settings</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={goToSettings}>
              <Button type="submit" className="w-full">
                Manage Settings
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex justify-end">
        <form action={logout}>
          <Button variant="outline" type="submit">
            Logout
          </Button>
        </form>
      </div>
    </div>
  );
}

export default async function AdminPage() {
  return (
    <Suspense
      fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}
    >
      <AdminDashboard />
    </Suspense>
  );
}
