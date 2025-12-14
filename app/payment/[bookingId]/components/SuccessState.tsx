
'use client';

import { CheckCircle } from 'lucide-react';

export default function SuccessState() {
  return (
    <div className="w-full h-screen overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-6 text-center border border-white/10">
        <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Payment Proof Submitted</h2>
        <p className="text-gray-300 mb-6">
          Your payment proof has been submitted successfully. Your booking is now pending admin
          approval.
        </p>
        <p className="text-sm text-gray-400">Redirecting to confirmation page...</p>
      </div>
    </div>
  );
}
