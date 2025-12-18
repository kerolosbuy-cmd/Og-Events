'use client';

import { useLanguageContext } from '@/contexts/LanguageContext';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
];

interface LanguageSelectorProps {
  className?: string;
}

export const LanguageSelector = ({ className = '' }: LanguageSelectorProps) => {
  const { language, changeLanguage, isInitialized } = useLanguageContext();

  if (!isInitialized) {
    return (
      <div className={`animate-pulse h-10 w-24 bg-gray-200 rounded ${className}`}></div>
    );
  }

  return (
    <select
      value={language}
      onChange={(e) => changeLanguage(e.target.value)}
      className={`px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
};
