
'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, AlertCircle, Download, CreditCard, Calendar, User, Mail, Phone, DollarSign, MapPin, Hash, Clock, CheckCircle, FileText, Loader2 } from 'lucide-react';
import { BookingData } from './actions';
import { generateAndDownloadTickets, generateAndDownloadSeparateTickets } from './client-actions';
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

export default function BookingsTable({ bookings }: BookingsTableProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-300 shadow-sm">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approved
                        </Badge>
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
                        <DialogContent className="fixed inset-0 z-50 w-screen h-screen bg-black/80 p-0" style={{left: 0, top: 0, transform: 'none', maxWidth: '100vw', maxHeight: '100vh'}}>
                          <DialogTitle className="sr-only">Payment Proof</DialogTitle>
                          <div className="flex flex-col items-center justify-center h-full w-full p-4">
                            <div className="relative w-full max-w-4xl h-[70vh] mb-6">
                              <PrivateImage
                                src={booking.image || ''}
                                alt="Payment Proof"
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                              />
                            </div>
                            <div className="flex gap-4">
                              <Button
                                onClick={() => handleDownloadTickets(booking.id)}
                                disabled={isPending && processingId === booking.id}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                              >
                                {processingId === booking.id && isPending ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <Download className="mr-2 h-4 w-4" />
                                )}
                                {processingId === booking.id && isPending
                                  ? 'Generating...'
                                  : 'Download Tickets (HTML)'}
                              </Button>
                              <Button
                                onClick={() => handleDownloadSeparateTickets(booking.id)}
                                disabled={isPending && processingId === booking.id}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                {processingId === booking.id && isPending ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <FileText className="mr-2 h-4 w-4" />
                                )}
                                {processingId === booking.id && isPending
                                  ? 'Generating...'
                                  : 'Download Separate PDFs'}
                              </Button>
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
                        onClick={() => handleDownloadTickets(booking.id)}
                        disabled={isPending && processingId === booking.id}
                        className="h-8 px-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-sm transition-all duration-200"
                        size="sm"
                      >
                        {processingId === booking.id && isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4 mr-1" />
                        )}
                        {processingId === booking.id && isPending ? 'HTML...' : 'HTML'}
                      </Button>
                      <Button
                        onClick={() => handleDownloadSeparateTickets(booking.id)}
                        disabled={isPending && processingId === booking.id}
                        className="h-8 px-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-sm transition-all duration-200"
                        size="sm"
                      >
                        {processingId === booking.id && isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <FileText className="h-4 w-4 mr-1" />
                        )}
                        {processingId === booking.id && isPending ? 'PDFs...' : 'PDFs'}
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
