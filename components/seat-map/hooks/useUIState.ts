import { useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '../constants';

/**
 * Get system theme preference
 */
function getSystemTheme(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Get stored theme preference or fallback to system theme
 */
function getInitialTheme(): boolean {
  if (typeof window === 'undefined') return false;

  const stored = localStorage.getItem(STORAGE_KEYS.THEME_PREFERENCE);
  if (stored !== null) {
    return stored === 'dark';
  }

  return getSystemTheme();
}

export const useUIState = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(getInitialTheme);

  // Persist theme preference to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.THEME_PREFERENCE, isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't set a preference
      const hasCustomPreference = localStorage.getItem(STORAGE_KEYS.THEME_PREFERENCE) !== null;
      if (!hasCustomPreference) {
        setIsDarkMode(e.matches);
      }
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Legacy browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  return {
    isDarkMode,
    toggleDarkMode,
    setIsDarkMode,
  };
};
