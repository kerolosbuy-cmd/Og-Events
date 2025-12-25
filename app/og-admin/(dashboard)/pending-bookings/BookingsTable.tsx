
'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Eye, AlertCircle, Loader2, CreditCard, Calendar, User, Mail, Phone, DollarSign, MapPin, Hash, Check, X, Clock } from 'lucide-react';
import { handleApproveBooking, handleRejectBooking } from './client-actions';
import { BookingData } from './actions';
import PrivateImage from '@/components/booking/PrivateImage';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';

interface BookingsTableProps {
  bookings: BookingData[];
}

export default function BookingsTable({ bookings: initialBookings }: BookingsTableProps) {
  const [bookings, setBookings] = useState(initialBookings);
  const [isPending, startTransition] = useTransition();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
        <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 shadow-sm">
          <span className="w-2 h-2 mr-1.5 rounded-full bg-gray-400"></span>
          Null
        </Badge>
      );
    }

    return (
      <Badge variant="secondary" className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 dark:from-amber-900/30 dark:to-orange-900/30 dark:text-amber-300 shadow-sm">
        <span className="w-2 h-2 mr-1.5 rounded-full bg-amber-400 animate-pulse"></span>
        Pending
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSeatsList = (seats?: BookingData['seats']) => {
    if (!seats) return '';
    return seats
      .map(
        seat => `${seat.rows.zones.name} - Row ${seat.rows.row_number} - Seat ${seat.seat_number}`
      )
      .join(', ');
  };

  return (
    <>
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800/30 flex items-center gap-3">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="font-medium text-red-800 dark:text-red-200">Error</p>
            <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-b border-indigo-100 dark:border-indigo-800/30">
                <TableHead className="w-[220px] font-semibold text-slate-700 dark:text-slate-200">ID & Date</TableHead>
                <TableHead className="font-semibold text-slate-700 dark:text-slate-200">Customer Info</TableHead>
                <TableHead className="font-semibold text-slate-700 dark:text-slate-200">Seats</TableHead>
                <TableHead className="font-semibold text-slate-700 dark:text-slate-200">Amount</TableHead>
                <TableHead className="font-semibold text-slate-700 dark:text-slate-200">Payment Proof</TableHead>
                <TableHead className="w-[150px] text-right font-semibold text-slate-700 dark:text-slate-200">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map(booking => (
                <TableRow key={booking.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 dark:hover:from-indigo-900/10 dark:hover:to-purple-900/10 transition-all duration-200 shadow-sm hover:shadow-md">
                  <TableCell className="font-medium">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded">
                          <Hash className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <span className="text-sm font-medium">#{booking.id.substring(0, 8)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded">
                          <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        {formatDate(booking.created_at)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded">
                          <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        {formatTime(booking.created_at)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-slate-100 dark:bg-slate-700 rounded-full">
                          <User className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                        </div>
                        <p className="font-medium">{booking.name}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="p-1.5 bg-slate-100 dark:bg-slate-700 rounded-full">
                          <Mail className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                        </div>
                        <span className="truncate">{booking.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="p-1.5 bg-slate-100 dark:bg-slate-700 rounded-full">
                          <Phone className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                        </div>
                        <span>{booking.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                        <span className="text-sm font-medium">Seats ({booking.seats?.length || 0})</span>
                      </div>
                      <ul className="ml-6 space-y-1">
                        {booking.seats?.map((seat, index) => (
                          <li key={index} className="text-sm text-slate-600 dark:text-slate-300">
                            {seat.rows.zones.name} - Row {seat.rows.row_number} - Seat {seat.seat_number}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">{booking.amount}</span>
                      <span className="text-sm text-green-600 dark:text-green-400">EGP</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {booking.image ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer hover:opacity-90 transition-opacity">
                            <PrivateImage
                              src={booking.image || ''}
                              alt="Payment Proof"
                              fill
                              className="object-contain"
                              sizes="128px"
                            />
                          </div>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[95vw] sm:max-h-[95vh]">
                          <DialogHeader>
                            <DialogTitle>Payment Proof</DialogTitle>
                            <DialogDescription>
                              Payment proof for booking #{booking.id.substring(0, 8)}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex-1 relative h-[60vh] rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                              <PrivateImage
                                src={booking.image || ''}
                                alt="Payment Proof"
                                fill
                                className="object-contain"
                                sizes="100vw"
                              />
                            </div>
                            <div className="w-full lg:w-80 space-y-4">
                              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                                <h3 className="font-semibold mb-2">Booking Details</h3>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Amount:</span>
                                    <div className="flex items-baseline gap-1">
                                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">{booking.amount}</span>
                                      <span className="text-sm text-green-600 dark:text-green-400">EGP</span>
                                    </div>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Date:</span>
                                    <span className="text-sm">{formatDate(booking.created_at)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Customer:</span>
                                    <span className="text-sm">{booking.name}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                                <h3 className="font-semibold mb-2">Actions</h3>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => handleApprove(booking.id)}
                                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md"
                                  >
                                    <Check className="mr-2 h-4 w-4" />
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleReject(booking.id)}
                                    className="flex-1 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                                  >
                                    <X className="mr-2 h-4 w-4" />
                                    Reject
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <div className="flex items-center justify-center w-32 h-32 bg-slate-100 dark:bg-slate-700 rounded-lg">
                        <Eye className="h-8 w-8 text-slate-400" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-end">
                      <Button
                        onClick={() => handleApprove(booking.id)}
                        disabled={isPending && processingId === booking.id}
                        className="h-8 px-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-sm transition-all duration-200"
                        size="sm"
                      >
                        {processingId === booking.id && isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => handleReject(booking.id)}
                        disabled={isPending && processingId === booking.id}
                        variant="destructive"
                        className="h-8 px-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-sm transition-all duration-200"
                        size="sm"
                      >
                        {processingId === booking.id && isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </>
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Image Modal - Fallback for direct image view */}
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
