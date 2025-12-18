'use client';

import { useState, useEffect } from 'react';
import { initializeLanguage, getSavedLanguage, saveLanguage } from '@/lib/language';
import { getTranslation, isRTL } from '@/lib/translations';

/**
 * Custom hook to manage language detection and storage
 * @returns An object with the current language, translation function, RTL status, and a function to change it
 */
export const useLanguage = () => {
  const [language, setLanguage] = useState<string>('en');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize language on component mount
    const detectedLanguage = initializeLanguage();
    setLanguage(detectedLanguage);
    setIsInitialized(true);
  }, []);

  // Listen for storage events to update language when it changes in another tab/window
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user-language' && e.newValue && e.newValue !== language) {
        setLanguage(e.newValue);
      }
    };

    // Listen for custom language change events within the same tab
    const handleCustomLanguageChange = (e: CustomEvent) => {
      if (e.detail && e.detail.language && e.detail.language !== language) {
        setLanguage(e.detail.language);
      }
    };

    // Add event listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('languageChange', handleCustomLanguageChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('languageChange', handleCustomLanguageChange as EventListener);
    };
  }, [language]);

  /**
   * Change the language and save it to local storage
   * @param newLanguage The new language code
   */
  const changeLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
    saveLanguage(newLanguage);
  };

  /**
   * Get translation for a key
   * @param key The translation key
   * @returns The translated text
   */
  const t = (key: string): string => {
    return getTranslation(key, language);
  };

  /**
   * Check if the current language uses RTL layout
   * @returns True if the language uses RTL layout
   */
  const isRTLLayout = (): boolean => {
    return isRTL(language);
  };

  return {
    language,
    changeLanguage,
    isInitialized,
    t,
    isRTL: isRTLLayout
  };
};
