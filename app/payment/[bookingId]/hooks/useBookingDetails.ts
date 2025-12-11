
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export const useBookingDetails = (bookingId: string) => {
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingId) return;

    const fetchBookingDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select(
            `
            *,
            seats (
              id,
              seat_number,
              status,
              rows (
                row_number,
                zones (
                  name
                )
              )
            )
          `
          )
          .eq('id', bookingId)
          .single();

        if (error) {
          setError('Failed to fetch booking details');
          console.error(error);
          return;
        }

        setBookingDetails(data);
      } catch (err) {
        setError('An unexpected error occurred');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  return { bookingDetails, loading, error };
};
