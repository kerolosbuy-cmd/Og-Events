import React from 'react';

const SVGPatterns: React.FC = () => {
  return (
    <svg width="0" height="0">
      <defs>
        <pattern id="holdPattern" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="#F59E0B" opacity="0.15" />
        </pattern>
      </defs>
    </svg>
  );
};

export default SVGPatterns;
