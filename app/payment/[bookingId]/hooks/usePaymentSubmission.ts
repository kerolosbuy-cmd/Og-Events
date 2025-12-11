
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateBookingWithPayment } from '@/components/seat-map/services';
import { uploadFile } from '@/lib/storage';
import { markPaymentUploaded } from '@/lib/booking-redirect';

export const usePaymentSubmission = (bookingId: string) => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError(null);
    } else {
      // Handle case when no file is selected (file was removed)
      setFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a payment proof image');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Upload the payment proof to Supabase Storage
      let paymentProofUrl = null;
      if (file) {
        const { url, error: uploadError } = await uploadFile(file, 'Payment', 'payment-proofs');

        if (uploadError) {
          setError('Failed to upload payment proof: ' + uploadError);
          return;
        }

        paymentProofUrl = url;
      }

      // Update the booking with the payment proof URL
      const { data, error } = await updateBookingWithPayment(bookingId, paymentProofUrl);

      if (error) {
        setError('Failed to upload payment proof');
        console.error(error);
        return;
      }

      if (data && data.success) {
        // Mark the payment as uploaded instead of clearing
        markPaymentUploaded();
        setSuccess(true);
        // Redirect to a confirmation page after 3 seconds
        setTimeout(() => {
          router.push('/booking-confirmation');
        }, 3000);
      } else {
        setError(data?.message || 'Failed to upload payment proof');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return {
    file,
    isUploading,
    error,
    success,
    handleFileChange,
    handleSubmit
  };
};
