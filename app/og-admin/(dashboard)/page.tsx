import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { goToSettings, logout } from '../actions';
import { isUserAdmin } from '@/lib/auth';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RevenueChart, CategoryChart, SeatStatusChart, BookingStatusChart } from '../components/charts';
import { CategoryVisibility } from '../components/category-visibility';
import { Toaster } from '@/components/ui/sonner';
import Link from 'next/link';
import { Sidebar } from '@/components/admin/Sidebar';
import { ChevronRight } from 'lucide-react';

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
import { CalendarDays, Users, DollarSign, Ticket, AlertCircle, TrendingUp, Clock, CheckCircle } from 'lucide-react';

// Function to fetch dashboard statistics
async function getDashboardStats() {
  try {
    const supabase = await createClient();

    // Get counts for different booking statuses
    const { data: pendingData, error: pendingError } = await supabase
      .from('bookings')
      .select('id')
      .eq('status', 'pending')
      .not('image', 'is', null);

    const { data: approvedData, error: approvedError } = await supabase
      .from('bookings')
      .select('id, amount')
      .eq('status', 'approved');

    const { data: rejectedData, error: rejectedError } = await supabase
      .from('bookings')
      .select('id')
      .eq('status', 'rejected');

    const { data: totalBookingsData, error: totalBookingsError } = await supabase
      .from('bookings')
      .select('id');

    const { data: seatsData, error: seatsError } = await supabase
      .from('seats')
      .select('status');

    const { data: recentBookingsData, error: recentBookingsError } = await supabase
      .from('bookings')
      .select('id, name, email, amount, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    // Get category distribution for bookings
    const { data: categoryData, error: categoryError } = await supabase
      .from('bookings')
      .select(`
        status,
        seats (
          category
        )
      `)
      .in('status', ['pending', 'approved']);

    // Get revenue by month
    const { data: revenueData, error: revenueError } = await supabase
      .from('bookings')
      .select('amount, created_at')
      .eq('status', 'approved');

    // Calculate statistics
    const pendingCount = pendingData?.length || 0;
    const approvedCount = approvedData?.length || 0;
    const rejectedCount = rejectedData?.length || 0;
    const totalBookings = totalBookingsData?.length || 0;

    // Calculate revenue
    const totalRevenue = approvedData?.reduce((sum, booking) => sum + booking.amount, 0) || 0;

    // Calculate seat statistics
    const totalSeats = seatsData?.length || 0;
    const availableSeats = seatsData?.filter(seat => seat.status === 'available')?.length || 0;
    const bookedSeats = seatsData?.filter(seat => seat.status === 'booked')?.length || 0;
    const reservedSeats = seatsData?.filter(seat => seat.status === 'reserved')?.length || 0;

    // Process category distribution
    const categoryDistribution: { [key: string]: number } = {};
    categoryData?.forEach(booking => {
      booking.seats?.forEach(seat => {
        if (seat.category) {
          categoryDistribution[seat.category] = (categoryDistribution[seat.category] || 0) + 1;
        }
      });
    });

    const categoryChartData = Object.entries(categoryDistribution).map(([name, value]) => ({
      name,
      value
    }));

    // Process revenue by month
    const revenueByMonth: { [key: string]: number } = {};
    revenueData?.forEach(booking => {
      const date = new Date(booking.created_at);
      const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      revenueByMonth[monthYear] = (revenueByMonth[monthYear] || 0) + booking.amount;
    });

    const revenueChartData = Object.entries(revenueByMonth).map(([month, revenue]) => ({
      month,
      revenue
    }));

    return {
      pendingCount,
      approvedCount,
      rejectedCount,
      totalBookings,
      totalRevenue,
      totalSeats,
      availableSeats,
      bookedSeats,
      reservedSeats,
      recentBookings: recentBookingsData || [],
      categoryChartData,
      revenueChartData,
      errors: {
        pending: pendingError?.message,
        approved: approvedError?.message,
        rejected: rejectedError?.message,
        totalBookings: totalBookingsError?.message,
        seats: seatsError?.message,
        recentBookings: recentBookingsError?.message,
        category: categoryError?.message,
        revenue: revenueError?.message
      }
    };
  } catch (err: any) {
    console.error('Error fetching dashboard stats:', err);
    return {
      pendingCount: 0,
      approvedCount: 0,
      rejectedCount: 0,
      totalBookings: 0,
      totalRevenue: 0,
      totalSeats: 0,
      availableSeats: 0,
      bookedSeats: 0,
      reservedSeats: 0,
      recentBookings: [],
      categoryChartData: [],
      revenueChartData: [],
      errors: { general: err.message }
    };
  }
}

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

  // Fetch dashboard statistics
  const stats = await getDashboardStats();

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Render admin dashboard
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">Real-time monitoring of event bookings and operations</p>
        </div>
      </header>

      {/* Stats and Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="border-yellow-200 bg-yellow-50/50 shadow-sm">
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-yellow-700">
              <AlertCircle className="h-5 w-5" />
              Pending Review
            </CardTitle>
            <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200">
              {stats.pendingCount}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-800 mb-1">{stats.pendingCount}</div>
            <p className="text-xs text-yellow-600 mb-4 font-medium uppercase tracking-wider">Bookings awaiting approval</p>
            <Link href="/og-admin/pending-bookings">
              <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white border-none shadow-md">
                Review Pending
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50/50 shadow-sm">
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              Approved Orders
            </CardTitle>
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
              {stats.approvedCount}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-800 mb-1">{stats.approvedCount}</div>
            <p className="text-xs text-green-600 mb-4 font-medium uppercase tracking-wider">Successfull confirmed orders</p>
            <Link href="/og-admin/booked-orders">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white border-none shadow-md">
                View All Tickets
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-primary/5 shadow-sm">
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-primary">
              <DollarSign className="h-5 w-5" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary mb-1">${stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-primary/70 mb-4 font-medium uppercase tracking-wider">From {stats.approvedCount} approved seats</p>
            <Link href="/og-admin/bookings">
              <Button variant="outline" className="w-full border-primary/20 hover:bg-primary/10 text-primary">
                View Financials
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>


      {/* Main Grid for Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Left Column - Large Charts */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="shadow-sm border-none h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Revenue Trend
              </CardTitle>
              <CardDescription>Monthly revenue from approved bookings</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <RevenueChart data={stats.revenueChartData} />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-sm border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="h-5 w-5 text-primary" />
                  Category Distribution
                </CardTitle>
                <CardDescription>Ticket distribution</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <CategoryChart data={stats.categoryChartData} />
              </CardContent>
            </Card>

            <Card className="shadow-sm border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-bold uppercase text-[12px] opacity-70">
                  <Badge variant="outline" className="rounded-full px-2 py-0">LIVE</Badge>
                  Booking Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <BookingStatusChart data={[
                  { name: 'Pending', value: stats.pendingCount },
                  { name: 'Approved', value: stats.approvedCount },
                  { name: 'Rejected', value: stats.rejectedCount }
                ]} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column - Activity & More Charts */}
        <div className="space-y-8">
          <Card className="shadow-sm border-none overflow-hidden">
            <CardHeader className="bg-muted/30 pb-4">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Recent Bookings
              </CardTitle>
              <CardDescription>Latest updates across the platform</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {stats.recentBookings.length > 0 ? (
                <div className="divide-y divide-muted">
                  {stats.recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 hover:bg-muted/10 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{booking.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{new Date(booking.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">${booking.amount.toFixed(2)}</p>
                        <Badge variant={
                          booking.status === 'approved' ? 'default' :
                            booking.status === 'pending' ? 'secondary' :
                              'destructive'
                        } className="h-5 text-[10px] px-1.5 py-0">
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  <div className="p-4 bg-muted/5">
                    <Link href="/og-admin/bookings" className="text-sm text-primary font-medium hover:underline flex items-center justify-center gap-1">
                      View All Bookings <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground border-y border-muted">No recent bookings</div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm border-none">
            <CardHeader>
              <CardTitle className="text-sm font-semibold opacity-80">Seat Status Availability</CardTitle>
            </CardHeader>
            <CardContent className="h-[250px] p-0">
              <SeatStatusChart data={[
                { name: 'Available', value: stats.availableSeats, fill: '#00C49F' },
                { name: 'Booked', value: stats.bookedSeats, fill: '#0088FE' },
                { name: 'Reserved', value: stats.reservedSeats, fill: '#FFBB28' }
              ]} />
            </CardContent>
            <CardContent className="pt-0 flex justify-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#00C49F]" />
                <span className="text-[10px] font-medium">Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#0088FE]" />
                <span className="text-[10px] font-medium">Booked</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FFBB28]" />
                <span className="text-[10px] font-medium">Reserved</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Category Management Area */}
      <div className="mb-8">
        <Card className="shadow-sm border-none">
          <CardHeader>
            <CardTitle>Global Category Visibility</CardTitle>
            <CardDescription>Control which ticket categories are visible to customers</CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryVisibility categories={[]} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default async function AdminPage() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <Suspense
        fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}
      >
        <AdminDashboard />
      </Suspense>
    </>
  );
}

