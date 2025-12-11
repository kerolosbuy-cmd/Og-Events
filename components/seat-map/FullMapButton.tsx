import React from 'react';
import { Focus } from 'lucide-react';

interface FullMapButtonProps {
  isDarkMode: boolean;
  onClick: () => void;
}

const FullMapButton: React.FC<FullMapButtonProps> = ({ isDarkMode, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-full shadow-lg transition-all duration-300`}
      style={{
        backgroundColor: isDarkMode ? 'rgb(0 0 0 / 0.6)' : 'rgb(255 255 255 / 0.6)',
        color: isDarkMode ? '#ffffff' : '#1f2937',
        backdropFilter: 'blur(24px)',
      }}
      aria-label="Map Focus"
    >
      <Focus size={24} />
    </button>
  );
};

export default FullMapButton;
