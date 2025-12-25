'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Eye, AlertCircle, Loader2 } from 'lucide-react';
import { handleApproveBooking, handleRejectBooking } from './client-actions';
import { BookingData } from './actions';
import PrivateImage from '@/components/booking/PrivateImage';
import { BookingCard } from '@/components/admin';

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
      const result = await handleApproveBooking(bookingId);

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
      const result = await handleRejectBooking(bookingId);

      if (result.success) {
        // Remove the booking from the list
        setBookings(prev => prev.filter(b => b.id !== bookingId));
      } else {
        setError(result.error || 'Failed to reject booking');
      }

      setProcessingId(null);
    });
  };

  const getStatusBadge = (status: string) => {
    if (!status) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
          <span className="w-2 h-2 mr-1.5 rounded-full bg-gray-400"></span>
          Null
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
        <span className="w-2 h-2 mr-1.5 rounded-full bg-amber-400 animate-pulse"></span>
        Pending
      </span>
    );
  };

  return (
    <>
      {error && (
        <Card className="mb-6 border-0 shadow-lg bg-red-50/80 dark:bg-red-900/20 backdrop-blur-sm overflow-hidden">
          <CardContent className="pt-6 flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="font-medium text-red-800 dark:text-red-200">Error</p>
              <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {bookings.map(booking => (
          <BookingCard
            key={booking.id}
            booking={booking}
            headerClassName="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20"
            statusBadge={getStatusBadge(booking.status)}
            actions={
              <div className="flex gap-3 w-full pt-2">
                <Button
                  onClick={() => handleApprove(booking.id)}
                  disabled={isPending && processingId === booking.id}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md transition-all duration-200 flex items-center justify-center"
                  size="sm"
                >
                  {processingId === booking.id && isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Approving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => handleReject(booking.id)}
                  disabled={isPending && processingId === booking.id}
                  variant="destructive"
                  className="flex-1 shadow-md transition-all duration-200 flex items-center justify-center"
                  size="sm"
                >
                  {processingId === booking.id && isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Rejecting...
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </>
                  )}
                </Button>
              </div>
            }
            sidebar={
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 h-full flex flex-col border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Payment Proof</p>
                </div>
                {booking.image ? (
                  <div className="flex-1 flex flex-col items-center justify-center space-y-3">
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                      <PrivateImage
                        src={booking.image || ''}
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
                      className="w-full rounded-lg border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Full Size
                    </Button>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 space-y-2">
                    <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                      <Eye className="h-6 w-6" />
                    </div>
                    <p className="text-sm">No image</p>
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
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full animate-in zoom-in-95 duration-200">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
              variant="outline"
              size="sm"
              className="absolute -top-12 right-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 border-0 shadow-lg rounded-full px-4 text-slate-700 dark:text-slate-200"
            >
              <span className="mr-2">Close</span>
              <span className="text-xl">×</span>
            </Button>
            <div className="relative w-full h-[80vh] rounded-lg overflow-hidden shadow-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <PrivateImage
                src={selectedImage || ''}
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
