
'use client';

import { useState, useEffect } from 'react';

export const useCountdown = (bookingCreatedAt: string | null) => {
  // Calculate initial time based on booking creation time
  const calculateTimeLeft = () => {
    if (!bookingCreatedAt) return 3600; // Default 1 hour if no timestamp
    
    const bookingTime = new Date(bookingCreatedAt).getTime();
    const currentTime = new Date().getTime();
    const elapsedSeconds = Math.floor((currentTime - bookingTime) / 1000);
    const remainingTime = 3600 - elapsedSeconds; // 1 hour = 3600 seconds
    
    return Math.max(0, remainingTime);
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timerId = setTimeout(() => {
      setTimeLeft(calculateTimeLeft()); // Recalculate from database timestamp each time
    }, 1000);

    return () => clearTimeout(timerId);
  }, [timeLeft, bookingCreatedAt]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    timeLeft,
    formattedTime: formatTime(timeLeft),
    isExpired: timeLeft <= 0
  };
};
