import React from 'react';

interface MyvLogoProps {
  className?: string;
  size?: number;
  monochrome?: boolean;
  circular?: boolean;
}

export const MyvLogo: React.FC<MyvLogoProps> = ({ 
  className = '', 
  size = 36, 
  monochrome = false,
  circular = true 
}) => {
  return (
    <div 
      className={`relative flex items-center justify-center shrink-0 ${circular ? 'rounded-full' : ''} ${className}`}
      style={{ width: size, height: size }}
      aria-label="Mutiganda Yvan VPN Logo"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm select-none"
      >
        <defs>
          <linearGradient id="myvBlueGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor={monochrome ? '#ffffff' : '#38bdf8'} />
            <stop offset="0.5" stopColor={monochrome ? '#ffffff' : '#2563eb'} />
            <stop offset="1" stopColor={monochrome ? '#ffffff' : '#1e3a8a'} />
          </linearGradient>

          <linearGradient id="innerCircle" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor={monochrome ? 'rgba(255,255,255,0.2)' : '#1e40af'} />
            <stop offset="1" stopColor={monochrome ? 'rgba(255,255,255,0.05)' : '#0f172a'} />
          </linearGradient>

          <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#38bdf8" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Circular Outer Ring */}
        <circle 
          cx="50" 
          cy="50" 
          r="46" 
          fill="url(#innerCircle)" 
          stroke={monochrome ? '#ffffff' : '#60a5fa'} 
          strokeWidth="3.5" 
        />

        {/* Subtle Orbit / Tunnel Ring */}
        <circle 
          cx="50" 
          cy="50" 
          r="38" 
          fill="none" 
          stroke={monochrome ? 'rgba(255,255,255,0.3)' : 'rgba(56, 189, 248, 0.4)'} 
          strokeWidth="1.5" 
          strokeDasharray="4 3" 
        />

        {/* Central Shield / Keyhole Monogram */}
        <path
          d="M50 18 L74 27 C74 54 50 72 50 72 C50 72 26 54 26 27 L50 18 Z"
          fill={monochrome ? 'rgba(255,255,255,0.25)' : 'url(#myvBlueGrad)'}
          stroke={monochrome ? '#ffffff' : '#93c5fd'}
          strokeWidth="2.5"
          filter="url(#logoGlow)"
        />

        {/* Stylized Keyhole / V & M Tunnel core */}
        <g fill="#ffffff">
          <circle cx="50" cy="38" r="6" />
          <path d="M46 41 L54 41 L57 56 L43 56 Z" />
        </g>

        {/* Dynamic Speed Rays */}
        <circle cx="28" cy="50" r="2.5" fill={monochrome ? '#ffffff' : '#38bdf8'} />
        <circle cx="72" cy="50" r="2.5" fill={monochrome ? '#ffffff' : '#38bdf8'} />
        <circle cx="50" cy="80" r="2.5" fill={monochrome ? '#ffffff' : '#fbbf24'} />
      </svg>
    </div>
  );
};
