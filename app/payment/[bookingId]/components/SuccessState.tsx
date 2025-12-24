
'use client';

import { CheckCircle } from 'lucide-react';
import { useLanguageContext } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';

export default function SuccessState() {
  const { t, isRTL } = useLanguageContext();
  const router = useRouter();

  const handleViewOrders = () => {
    router.push('/orders');
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-6 text-center border border-white/10">
        <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">{t('paymentProofSubmitted')}</h2>
        <p className="text-gray-300 mb-6">
          {t('paymentProofSubmittedMessage')}
        </p>
        <button
          onClick={handleViewOrders}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg transform hover:scale-[1.02]"
        >
          {t('myOrders') || 'My Orders'}
        </button>
      </div>
    </div>
  );
}
