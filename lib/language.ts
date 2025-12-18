/**
 * Language management utilities
 */

// Local storage key for language preference
const LANGUAGE_STORAGE_KEY = 'user-language';

/**
 * Get the browser's language preference
 * @returns The browser language code (e.g., 'en', 'es', 'fr')
 */
export const getBrowserLanguage = (): string => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') return 'en';

  // Get browser language
  const browserLang = navigator.language || (navigator as any).userLanguage;

  // Extract the language code (e.g., 'en' from 'en-US')
  const langCode = browserLang.split('-')[0].toLowerCase();

  // Return the language code, default to 'en' if not found
  return langCode || 'en';
};

/**
 * Get the saved language preference from local storage
 * @returns The saved language code or null if not found
 */
export const getSavedLanguage = (): string | null => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') return null;

  try {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY);
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return null;
  }
};

/**
 * Save the language preference to local storage
 * @param languageCode The language code to save
 */
export const saveLanguage = (languageCode: string): void => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * Initialize language detection and save it to local storage if not already saved
 * @returns The language code (either saved or detected)
 */
export const initializeLanguage = (): string => {
  // Check if language is already saved
  const savedLanguage = getSavedLanguage();

  if (savedLanguage) {
    return savedLanguage;
  }

  // Detect browser language
  const detectedLanguage = getBrowserLanguage();

  // Save the detected language
  saveLanguage(detectedLanguage);

  return detectedLanguage;
};
