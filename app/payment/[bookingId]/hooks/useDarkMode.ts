/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check localStorage first for user's saved preference
    const savedTheme = localStorage.getItem('seatmap_theme_preference');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      // Fall back to system preference
      const prefersDark =
        window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
  }, []);

  const toggleDarkMode = () => {
    const newTheme = !isDarkMode ? 'dark' : 'light';
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('seatmap_theme_preference', newTheme);
  };

  return { isDarkMode, toggleDarkMode };
};
