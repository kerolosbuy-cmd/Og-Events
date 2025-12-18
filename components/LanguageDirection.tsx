'use client';

import { useEffect } from 'react';
import { useLanguageContext } from '@/contexts/LanguageContext';

interface LanguageDirectionProps {
  children: React.ReactNode;
}

export const LanguageDirection = ({ children }: LanguageDirectionProps) => {
  const { isRTL, isInitialized } = useLanguageContext();

  useEffect(() => {
    if (!isInitialized) return;

    // Update the HTML element's dir attribute based on the language
    const htmlElement = document.documentElement;
    if (isRTL()) {
      htmlElement.setAttribute('dir', 'rtl');
    } else {
      htmlElement.setAttribute('dir', 'ltr');
    }
  }, [isRTL, isInitialized]);

  return <>{children}</>;
};
