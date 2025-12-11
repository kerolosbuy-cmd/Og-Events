import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, User, Mail, Phone, DollarSign, MapPin } from 'lucide-react';
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
    <Card className="overflow-hidden">
      <CardHeader
        className={cn('bg-gradient-to-r from-gray-50 to-gray-100 border-b', headerClassName)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">Booking #{booking.id.substring(0, 8)}</CardTitle>
            {statusBadge}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            {formatDate(booking.created_at)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="font-medium">{booking.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium text-sm">{booking.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="font-medium">{booking.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Amount</p>
                  <p className="font-medium text-green-600">{booking.amount} EGP</p>
                </div>
              </div>
            </div>

            {/* Seats Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Seats ({booking.seats?.length || 0})</p>
                  <p className="text-sm font-medium text-gray-700">{getSeatsList(booking.seats)}</p>
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
