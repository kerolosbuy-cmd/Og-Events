/* eslint-disable @next/next/no-img-element */
'use client';

interface BookingDetailsCardProps {
  bookingId: string;
  bookingDetails: any;
  isDarkMode: boolean;
}

export default function BookingDetailsCard({ bookingId, bookingDetails, isDarkMode }: BookingDetailsCardProps) {
  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-4 mb-3`}>
      <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Booking Details</h2>
      <div className={`mt-2 flex justify-between items-center`}>
        <p className={`text-xl font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{bookingDetails.name || 'Guest User'}</p>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>ID: {bookingId.split('-')[0]}</p>
      </div>
    </div>
  );
}
