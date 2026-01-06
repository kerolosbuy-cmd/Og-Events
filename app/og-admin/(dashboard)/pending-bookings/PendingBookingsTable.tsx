'use client';

import { useState, useTransition } from 'react';
import { approveBooking, rejectBooking } from '../bookings/actions';
import BookingsTable from '@/components/bookings/BookingsTable';
import { BookingData } from './actions';
import { useRouter } from 'next/navigation';

interface PendingBookingsTableProps {
    initialBookings: BookingData[];
}

export default function PendingBookingsTable({ initialBookings }: PendingBookingsTableProps) {
    const [bookings, setBookings] = useState(initialBookings);
    const [isPending, startTransition] = useTransition();
    const [processingId, setProcessingId] = useState<string | null>(null);
    const router = useRouter();

    const handleApprove = async (bookingId: string) => {
        setProcessingId(bookingId);

        startTransition(async () => {
            const result = await approveBooking(bookingId);

            if (result.success) {
                // Remove the booking from the list locally
                setBookings(prev => prev.filter(b => b.id !== bookingId));
                router.refresh(); // Refresh server data
            } else {
                alert(`Failed to approve booking: ${result.error}`);
            }

            setProcessingId(null);
        });
    };

    const handleReject = async (bookingId: string) => {
        if (!confirm('Are you sure you want to reject this booking? This will release the seats.')) {
            return;
        }

        setProcessingId(bookingId);

        startTransition(async () => {
            const result = await rejectBooking(bookingId);

            if (result.success) {
                // Remove the booking from the list locally
                setBookings(prev => prev.filter(b => b.id !== bookingId));
                router.refresh(); // Refresh server data
            } else {
                alert(`Failed to reject booking: ${result.error}`);
            }

            setProcessingId(null);
        });
    };

    const handleImageClick = (imageUrl: string) => {
        // The BookingsTable component handles the modal now if we pass onImageClick, 
        // or we can implement a custom one. 
        // The previous implementation had a local modal. 
        // BookingsTable usually takes onImageClick to show a modal?
        // Let's check BookingsTable props. 
        // It has onImageClick prop. 
        // If we want the modal to be managed by this component:

        // Actually, BookingsTable doesn't seem to have a built-in modal for full screen? 
        // Step 99/150 view of BookingsTable shows it calls onImageClick prop. 
        // So we need to provide the modal here.
        setSelectedImage(imageUrl);
    };

    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    return (
        <>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Pending Bookings</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Review and manage bookings with pending or null status</p>
                </div>
                <BookingsTable
                    bookings={bookings}
                    processingId={processingId}
                    showStatusColumn={false}
                    showPaymentProofColumn={true}
                    showCustomerActions={true}
                    showDownloadActions={false}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onImageClick={handleImageClick}
                />
            </div>

            {/* Image Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-4xl max-h-[90vh] w-full">
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute -top-12 right-0 bg-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100"
                        >
                            Close
                        </button>
                        <div className="relative w-full h-[80vh] bg-white rounded-lg overflow-hidden">
                            <img
                                src={selectedImage}
                                alt="Payment Proof - Full Size"
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
