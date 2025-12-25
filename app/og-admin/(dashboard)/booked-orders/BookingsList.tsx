'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Ticket, FileText } from 'lucide-react';
import { BookingData } from './actions';
import { generateAndDownloadTickets, generateAndDownloadSeparateTickets } from './client-actions';
import { BookingCard } from '@/components/admin/BookingCard';

interface BookingsListProps {
  bookings: BookingData[];
}

export default function BookingsList({ bookings: initialBookings }: BookingsListProps) {
  const [bookings] = useState(initialBookings);
  const [isPending, startTransition] = useTransition();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDownloadTickets = async (bookingId: string) => {
    setProcessingId(bookingId);
    setError(null);

    startTransition(async () => {
      const result = await generateAndDownloadTickets(bookingId);

      if (!result.success) {
        setError(result.error || 'Failed to download tickets');
      }

      setProcessingId(null);
    });
  };

  const handleDownloadSeparateTickets = async (bookingId: string) => {
    setProcessingId(bookingId);
    setError(null);

    startTransition(async () => {
      const result = await generateAndDownloadSeparateTickets(bookingId);

      if (!result.success) {
        setError(result.error || 'Failed to download separate tickets');
      }

      setProcessingId(null);
    });
  };

  return (
    <>
      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6">
        {bookings.map(booking => (
          <BookingCard
            key={booking.id}
            booking={booking}
            headerClassName="bg-gradient-to-r from-blue-50 to-indigo-50"
            actions={
              <>
                <Button
                  onClick={() => handleDownloadTickets(booking.id)}
                  disabled={isPending && processingId === booking.id}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {processingId === booking.id && isPending
                    ? 'Generating...'
                    : 'Download Tickets (HTML)'}
                </Button>
                <Button
                  onClick={() => handleDownloadSeparateTickets(booking.id)}
                  disabled={isPending && processingId === booking.id}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {processingId === booking.id && isPending
                    ? 'Generating...'
                    : 'Download Separate PDFs'}
                </Button>
              </>
            }
            sidebar={
              <div className="bg-gray-50 rounded-lg p-4 h-full flex flex-col items-center justify-center">
                <Ticket className="h-12 w-12 text-indigo-600 mb-3" />
                <p className="text-2xl font-bold text-gray-800">{booking.seats.length}</p>
                <p className="text-sm text-gray-500">Ticket{booking.seats.length > 1 ? 's' : ''}</p>
              </div>
            }
          />
        ))}
      </div>
    </>
  );
}
