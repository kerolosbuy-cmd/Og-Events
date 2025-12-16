import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, User, Mail, Phone, DollarSign, MapPin, CreditCard } from 'lucide-react';
import { Booking, BookingSeat } from '@/types/booking';
import { cn } from '@/lib/utils';

interface BookingCardProps {
  booking: Booking;
  statusBadge?: React.ReactNode;
  actions?: React.ReactNode;
  sidebar?: React.ReactNode;
  headerClassName?: string;
}

export function BookingCard({
  booking,
  statusBadge,
  actions,
  sidebar,
  headerClassName,
}: BookingCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSeatsList = (seats?: BookingSeat[]) => {
    if (!seats) return '';
    return seats
      .map(
        seat => `${seat.rows.zones.name} - Row ${seat.rows.row_number} - Seat ${seat.seat_number}`
      )
      .join(', ');
  };

  return (
    <Card className="overflow-hidden border-0 shadow-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
      <CardHeader
        className={cn('bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-700/50 dark:to-slate-800/50 border-b border-slate-200 dark:border-slate-700', headerClassName)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
              <CreditCard className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <CardTitle className="text-lg text-slate-800 dark:text-slate-100">Booking #{booking.id.substring(0, 8)}</CardTitle>
              <div className="mt-1">{statusBadge}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 bg-white/70 dark:bg-slate-800/50 px-3 py-1.5 rounded-full shadow-sm">
            <Calendar className="h-4 w-4" />
            {formatDate(booking.created_at)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Info */}
          <div className="lg:col-span-2 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="p-2 bg-white dark:bg-slate-700 rounded-full shadow-sm">
                  <User className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Name</p>
                  <p className="font-medium text-slate-800 dark:text-slate-100 truncate">{booking.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="p-2 bg-white dark:bg-slate-700 rounded-full shadow-sm">
                  <Mail className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Email</p>
                  <p className="font-medium text-sm text-slate-800 dark:text-slate-100 truncate">{booking.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="p-2 bg-white dark:bg-slate-700 rounded-full shadow-sm">
                  <Phone className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Phone</p>
                  <p className="font-medium text-slate-800 dark:text-slate-100 truncate">{booking.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="p-2 bg-white dark:bg-slate-700 rounded-full shadow-sm">
                  <DollarSign className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Amount</p>
                  <p className="font-medium text-green-600 dark:text-green-400 truncate">{booking.amount} EGP</p>
                </div>
              </div>
            </div>

            {/* Seats Info */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-5 border border-indigo-100 dark:border-indigo-800/30 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white dark:bg-slate-700 rounded-full shadow-sm mt-0.5">
                  <MapPin className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Seats ({booking.seats?.length || 0})</p>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{getSeatsList(booking.seats)}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            {actions && <div className="flex gap-3 pt-2">{actions}</div>}
          </div>

          {/* Sidebar (Payment Proof or Ticket Count) */}
          {sidebar && <div className="lg:col-span-1">{sidebar}</div>}
        </div>
      </CardContent>
    </Card>
  );
}
