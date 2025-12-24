
import React from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';

interface OrdersButtonProps {
  isDarkMode: boolean;
  hasOrders?: boolean;
}

const OrdersButton: React.FC<OrdersButtonProps> = ({ isDarkMode, hasOrders = false }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push('/orders');
  };

  return (
    <button
      onClick={handleClick}
      className={`p-3 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center relative`}
      style={{
        backgroundColor: isDarkMode ? 'rgb(0 0 0 / 0.6)' : 'rgb(255 255 255 / 0.6)',
        color: isDarkMode ? '#ffffff' : '#1f2937',
        backdropFilter: 'blur(24px)',
        minWidth: '48px',
        minHeight: '48px',
      }}
      aria-label="View Orders"
    >
      <ShoppingBag size={24} />
      {hasOrders && (
        <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
      )}
    </button>
  );
};

export default OrdersButton;
