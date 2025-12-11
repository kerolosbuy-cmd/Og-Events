/* eslint-disable @next/next/no-img-element */
'use client';

import settings from '../../../../config/settings.json';
import { useState } from 'react';
import { Check } from 'lucide-react';

interface PaymentMethod {
  image: string;
  title: string;
  phoneNumber: string;
  name: string;
  color?: string;
}

interface PaymentMethodSelectorProps {
  isDarkMode: boolean;
  onMethodSelect: (method: PaymentMethod) => void;
}

const hexToRgba = (hex: string, alpha: number) => {
  if (!hex || !hex.startsWith('#') || hex.length !== 7) {
    // Default to gray if invalid or no color provided
    return `rgba(156, 163, 175, ${alpha})`; // gray-400
  }
  
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  // Check if the parsed values are valid numbers
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return `rgba(156, 163, 175, ${alpha})`; // gray-400 as fallback
  }
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function PaymentMethodSelector({ isDarkMode, onMethodSelect }: PaymentMethodSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const { title, paymentMethods } = settings.payment.instructions;

  const handleMethodClick = (method: PaymentMethod) => {
    setSelectedMethod(method);
    onMethodSelect(method);
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-4 mb-3`}>
      <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3`}>Select Payment Options</h2>
      <div className="space-y-3">
        {paymentMethods.map((method, index) => (
          <div 
            key={index} 
            className={`p-4 rounded-lg flex items-center space-x-3 cursor-pointer transition-all transform hover:scale-[1.02] hover:shadow-md ${
              selectedMethod?.title === method.title 
                ? isDarkMode ? 'ring-2 ring-white shadow-lg scale-[1.02]' : 'ring-2 ring-gray-800 shadow-lg scale-[1.02]' 
                : ''
            }`}
            style={{
              background: `linear-gradient(135deg, ${hexToRgba(method.color, selectedMethod?.title === method.title ? 0.25 : 0.15)}, ${hexToRgba(method.color, selectedMethod?.title === method.title ? 0.1 : 0.05)})`
            }}
            onClick={() => handleMethodClick(method)}
          >
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
