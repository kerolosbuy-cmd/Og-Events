/* eslint-disable @next/next/no-img-element */
'use client';

import settings from '../../../../config/settings.json';

interface PaymentInstructionsProps {
  isDarkMode: boolean;
}

export default function PaymentInstructions({ isDarkMode }: PaymentInstructionsProps) {
  const { title, paymentMethods } = settings.payment.instructions;

  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-4 mb-3`}>
      <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3`}>{title}</h2>
      <div className="space-y-4">
        {paymentMethods.map((method, index) => (
          <div key={index} className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} p-3 rounded-lg flex items-center space-x-3`}>
            <div className="flex-shrink-0 h-10 w-10 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
              <img 
                src={method.image} 
                alt={method.title}
                className="h-full w-full object-cover"
                onError={(e) => {
                  // Fallback if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `<div class="h-full w-full flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6 text-gray-500"><rect width="20" height="16" x="2" y="4" rx="2"/><circle cx="8" cy="10" r="2"/><path d="m8 14 2 2 4-4"/></svg></div>`;
                  }
                }}
              />
            </div>
            <div className="flex-grow">
              <h3 className={`text-base font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-1`}>{method.title}</h3>
              <div className="flex items-center justify-between">
                <p className={`text-sm font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{method.phoneNumber}</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{method.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
