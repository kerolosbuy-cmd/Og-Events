'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useLanguage } from '@/hooks/useLanguage';

interface LanguageContextType {
  language: string;
  changeLanguage: (newLanguage: string) => void;
  isInitialized: boolean;
  t: (key: string) => string;
  isRTL: () => boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const { language, changeLanguage, isInitialized, t, isRTL } = useLanguage();

  // Wrap changeLanguage to dispatch a custom event
  const handleChangeLanguage = (newLanguage: string) => {
    changeLanguage(newLanguage);
    // Dispatch a custom event to notify all components about the language change
    window.dispatchEvent(new CustomEvent('languageChange', { detail: { language: newLanguage } }));
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage: handleChangeLanguage, isInitialized, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguageContext = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguageContext must be used within a LanguageProvider');
  }
  return context;
};
