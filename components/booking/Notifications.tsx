import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, X, AlertCircle } from 'lucide-react';

interface NotificationProps {
  type: 'success' | 'error';
  message: string;
  isVisible: boolean;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

const Notification: React.FC<NotificationProps> = ({
  type,
  message,
  isVisible,
  onClose,
  autoClose = true,
  duration = 5000,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (isVisible) {
      // Start slide in animation
      setIsAnimating(true);
      
      if (autoClose) {
        const timer = setTimeout(() => {
          setIsAnimating(false);
          // Allow animation to complete before closing
          setTimeout(onClose, 300);
        }, duration);

        return () => clearTimeout(timer);
      }
    }
  }, [isVisible, autoClose, duration, onClose]);

  const handleClose = () => {
    setIsAnimating(false);
    // Allow animation to complete before closing
    setTimeout(onClose, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm transform transition-all duration-300 ${
        isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div
        className={`p-4 rounded-xl shadow-xl backdrop-blur-md ${
          type === 'success' 
            ? 'bg-gradient-to-r from-green-500/90 to-emerald-600/90 border border-green-400/30' 
            : 'bg-gradient-to-r from-red-500/90 to-rose-600/90 border border-red-400/30'
        }`}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 animate-pulse">
            {type === 'success' ? (
              <CheckCircle className="h-6 w-6 text-white" />
            ) : (
              <div className="relative">
                <XCircle className="h-6 w-6 text-white" />
                <div className="absolute inset-0 animate-ping opacity-75">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            )}
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-white drop-shadow-sm">{message}</p>
          </div>
          <div className="ml-auto flex-shrink-0">
            <button
              onClick={handleClose}
              className="inline-flex text-white/80 hover:text-white focus:outline-none transition-colors p-1 rounded-full hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Progress bar showing time until auto-close */}
        {autoClose && (
          <div className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white/60 rounded-full animate-pulse"
              style={{
                animation: `shrink ${duration}ms linear forwards`,
              }}
            />
          </div>
        )}
      </div>
      
      {/* Add custom animation keyframes */}
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default Notification;
