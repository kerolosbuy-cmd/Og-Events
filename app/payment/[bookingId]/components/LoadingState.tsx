
'use client';

import { useLanguageContext } from '@/contexts/LanguageContext';

export default function LoadingState() {
  const { t } = useLanguageContext();
  return (
    <div className="w-full h-screen overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
        <p className="mt-4 text-gray-300">{t('loading')}</p>
      </div>
    </div>
  );
}
