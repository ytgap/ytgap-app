import React from 'react';

const Logo: React.FC = () => (
  <svg viewBox="0 0 250 60" className="h-12 w-auto" aria-label="YTGAP Logo">
    <title>YTGAP Logo</title>
    <style>{`
      .logo-text { font-family: 'Inter', sans-serif; font-weight: 800; font-size: 60px; }
    `}</style>
    <text className="logo-text" y="50" fill="#FF0000">
      YT
    </text>
    <text className="logo-text" x="95" y="50" fill="#F1F1F1">
      G
    </text>
    
    <g transform="translate(145, 0)">
      <path d="M 0 50 L 25 5 L 50 50" stroke="#F1F1F1" strokeWidth="9" fill="none" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M 20 28 L 32 35 L 20 42 Z" fill="#FF0000" />
    </g>
    
    <text className="logo-text" x="195" y="50" fill="#F1F1F1">
      P
    </text>
  </svg>
);

export default Logo;