'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import { approveBooking, rejectBooking, BookingData } from './actions';
import Image from 'next/image';
import { BookingCard } from '@/components/admin/BookingCard';

interface BookingsListProps {
  bookings: BookingData[];
}

export default function BookingsList({ bookings: initialBookings }: BookingsListProps) {
  const [bookings, setBookings] = useState(initialBookings);
  const [isPending, startTransition] = useTransition();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleApprove = async (bookingId: string) => {
    setProcessingId(bookingId);
    setError(null);

    startTransition(async () => {
      const result = await approveBooking(bookingId);

      if (result.success) {
        // Remove the booking from the list
        setBookings(prev => prev.filter(b => b.id !== bookingId));
      } else {
        setError(result.error || 'Failed to approve booking');
      }

      setProcessingId(null);
    });
  };

  const handleReject = async (bookingId: string) => {
    if (!confirm('Are you sure you want to reject this booking? This will release the seats.')) {
      return;
    }

    setProcessingId(bookingId);
    setError(null);

    startTransition(async () => {
      const result = await rejectBooking(bookingId);

      if (result.success) {
        // Remove the booking from the list
        setBookings(prev => prev.filter(b => b.id !== bookingId));
      } else {
        setError(result.error || 'Failed to reject booking');
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
            headerClassName="bg-gradient-to-r from-indigo-50 to-purple-50"
            actions={
              <>
                <Button
                  onClick={() => handleApprove(booking.id)}
                  disabled={isPending && processingId === booking.id}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {processingId === booking.id && isPending ? 'Approving...' : 'Approve'}
                </Button>

                <Button
                  onClick={() => handleReject(booking.id)}
                  disabled={isPending && processingId === booking.id}
                  variant="destructive"
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  {processingId === booking.id && isPending ? 'Rejecting...' : 'Reject'}
                </Button>
              </>
            }
            sidebar={
              <div className="bg-gray-50 rounded-lg p-4 h-full flex flex-col">
                <p className="text-xs text-gray-500 mb-2">Payment Proof</p>
                {booking.image ? (
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-white border">
                      <Image
                        src={booking.image}
                        alt="Payment Proof"
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <Button
                      onClick={() => setSelectedImage(booking.image)}
                      variant="outline"
                      size="sm"
                      className="mt-3 w-full"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Full Size
                    </Button>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
              </div>
            }
          />
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <Button
              onClick={() => setSelectedImage(null)}
              variant="outline"
              size="sm"
              className="absolute -top-12 right-0 bg-white"
            >
              Close
            </Button>
            <div className="relative w-full h-[80vh]">
              <Image
                src={selectedImage}
                alt="Payment Proof - Full Size"
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
