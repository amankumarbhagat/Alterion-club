import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 32, showText = true }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* SVG Icon */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 hover:rotate-6"
      >
        <defs>
          <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f0ff" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Hexagon / Tech Shield */}
        <polygon
          points="50,5 90,28 90,72 50,95 10,72 10,28"
          stroke="url(#logo-grad)"
          strokeWidth="3"
          strokeDasharray="4 4"
          fill="none"
          opacity="0.3"
        />

        {/* Outer Solid Triangle */}
        <polygon
          points="50,15 80,75 20,75"
          stroke="url(#logo-grad)"
          strokeWidth="4"
          fill="none"
        />

        {/* Inner Node Connections (The "A" Crossbar / R&D Node) */}
        <line x1="35" y1="55" x2="65" y2="55" stroke="#00f0ff" strokeWidth="3" />
        <line x1="50" y1="15" x2="50" y2="55" stroke="#3b82f6" strokeWidth="2" strokeDasharray="2 2" />

        {/* Glowing Nodes (Representing App Dev, R&D, and Ideas) */}
        <circle cx="50" cy="15" r="7" fill="#00f0ff" filter="url(#logo-glow)" /> {/* Apex Node - Ideas */}
        <circle cx="20" cy="75" r="7" fill="#3b82f6" /> {/* Bottom Left - App Dev */}
        <circle cx="80" cy="75" r="7" fill="#00f0ff" /> {/* Bottom Right - R&D */}
        <circle cx="50" cy="55" r="5" fill="#ffffff" filter="url(#logo-glow)" /> {/* Center Node - Connect */}

        {/* Subtle Cyber Accents */}
        <path d="M 5,25 L 5,35 L 15,30 Z" fill="#00f0ff" opacity="0.5" />
        <path d="M 95,25 L 95,35 L 85,30 Z" fill="#3b82f6" opacity="0.5" />
      </svg>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col select-none">
          <span className="font-sans font-extrabold tracking-wider text-white text-lg md:text-xl leading-none">
            ALTERINO
          </span>
          <span className="font-mono text-[9px] tracking-[0.25em] text-[#00f0ff] uppercase leading-none mt-1">
            BMSIT&M
          </span>
        </div>
      )}
    </div>
  );
};
