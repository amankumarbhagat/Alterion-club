import React from 'react';
import { motion } from 'framer-motion';

interface ThreeSceneFallbackProps {
  onNavigate?: (page: string, hash: string) => void;
}

export const ThreeSceneFallback: React.FC<ThreeSceneFallbackProps> = ({ onNavigate }) => {
  const handleNav = (page: string, hash: string) => {
    if (onNavigate) {
      onNavigate(page, hash);
    } else {
      window.location.hash = hash;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div
      role="region"
      aria-label="Alterino Innovation Network Map"
      className="relative w-full h-[320px] md:h-[400px] flex items-center justify-center select-none"
    >
      {/* Background glow orbs */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-64 h-64 rounded-full bg-[#00f0ff]/5 blur-3xl" />
        <div className="w-56 h-56 rounded-full bg-[#3b82f6]/5 blur-2xl" />
      </div>

      {/* SVG Innovation Node Map */}
      <svg
        viewBox="0 0 400 400"
        aria-hidden="true"
        className="w-full h-full max-w-[380px] drop-shadow-[0_0_30px_rgba(0,240,255,0.15)]"
      >
        {/* Connection Lines */}
        <motion.line
          x1="200"
          y1="200"
          x2="200"
          y2="80"
          stroke="#00f0ff"
          strokeWidth="1.5"
          strokeDasharray="3 3"
          animate={{ strokeDashoffset: [0, -10] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
        />
        <motion.line
          x1="200"
          y1="200"
          x2="310"
          y2="150"
          stroke="#3b82f6"
          strokeWidth="1.5"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        />
        <motion.line x1="200" y1="200" x2="280" y2="290" stroke="#00f0ff" strokeWidth="1.5" />
        <motion.line
          x1="200"
          y1="200"
          x2="120"
          y2="290"
          stroke="#3b82f6"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <motion.line x1="200" y1="200" x2="90" y2="150" stroke="#00f0ff" strokeWidth="1.5" />

        {/* Node Links */}
        <line x1="200" y1="80" x2="310" y2="150" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <line x1="310" y1="150" x2="280" y2="290" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <line x1="280" y1="290" x2="120" y2="290" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <line x1="120" y1="290" x2="90" y2="150" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <line x1="90" y1="150" x2="200" y2="80" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

        {/* Central Node - ALTERINO */}
        <motion.circle
          cx="200"
          cy="200"
          r="28"
          fill="rgba(5, 5, 8, 0.9)"
          stroke="#00f0ff"
          strokeWidth="3"
          animate={{ strokeWidth: [3, 5, 3] }}
          transition={{ repeat: Infinity, duration: 3 }}
        />
        <text
          x="200"
          y="203"
          fill="#00f0ff"
          fontSize="10"
          fontWeight="bold"
          fontFamily="var(--font-sans)"
          textAnchor="middle"
        >
          ALT
        </text>

        {/* Labeled floating nodes */}
        {/* Node 1: APP DEV */}
        <motion.g
          whileHover={{ scale: 1.1 }}
          role="button"
          tabIndex={0}
          aria-label="Navigate to App Dev division"
          className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00f0ff]"
          onClick={() => handleNav('divisions', '#/divisions')}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleNav('divisions', '#/divisions');
            }
          }}
        >
          <circle cx="200" cy="80" r="18" fill="#050508" stroke="#3b82f6" strokeWidth="2" />
          <circle cx="200" cy="80" r="5" fill="#00f0ff" className="animate-ping" />
          <circle cx="200" cy="80" r="3" fill="#00f0ff" />
          <text
            x="200"
            y="52"
            fill="#fff"
            fontSize="8"
            fontWeight="bold"
            fontFamily="var(--font-mono)"
            letterSpacing="1"
            textAnchor="middle"
          >
            APP DEV
          </text>
        </motion.g>

        {/* Node 2: R&D */}
        <motion.g
          whileHover={{ scale: 1.1 }}
          role="button"
          tabIndex={0}
          aria-label="Navigate to Research & Dev division"
          className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00f0ff]"
          onClick={() => handleNav('divisions', '#/divisions')}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleNav('divisions', '#/divisions');
            }
          }}
        >
          <circle cx="310" cy="150" r="18" fill="#050508" stroke="#00f0ff" strokeWidth="2" />
          <circle cx="310" cy="150" r="3" fill="#3b82f6" />
          <text
            x="310"
            y="122"
            fill="#fff"
            fontSize="8"
            fontWeight="bold"
            fontFamily="var(--font-mono)"
            letterSpacing="1"
            textAnchor="middle"
          >
            R&D
          </text>
        </motion.g>

        {/* Node 3: PROJECTS */}
        <motion.g
          whileHover={{ scale: 1.1 }}
          role="button"
          tabIndex={0}
          aria-label="Navigate to Projects"
          className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00f0ff]"
          onClick={() => handleNav('projects', '#/projects')}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleNav('projects', '#/projects');
            }
          }}
        >
          <circle cx="280" cy="290" r="18" fill="#050508" stroke="#3b82f6" strokeWidth="2" />
          <circle cx="280" cy="290" r="3" fill="#3b82f6" />
          <text
            x="280"
            y="322"
            fill="#fff"
            fontSize="8"
            fontWeight="bold"
            fontFamily="var(--font-mono)"
            letterSpacing="1"
            textAnchor="middle"
          >
            PROJECTS
          </text>
        </motion.g>

        {/* Node 4: EVENTS */}
        <motion.g
          whileHover={{ scale: 1.1 }}
          role="button"
          tabIndex={0}
          aria-label="Navigate to Events"
          className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00f0ff]"
          onClick={() => handleNav('events', '#/events')}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleNav('events', '#/events');
            }
          }}
        >
          <circle cx="120" cy="290" r="18" fill="#050508" stroke="#00f0ff" strokeWidth="2" />
          <circle cx="120" cy="290" r="3" fill="#00f0ff" />
          <text
            x="120"
            y="322"
            fill="#fff"
            fontSize="8"
            fontWeight="bold"
            fontFamily="var(--font-mono)"
            letterSpacing="1"
            textAnchor="middle"
          >
            EVENTS
          </text>
        </motion.g>

        {/* Node 5: COMMUNITY */}
        <motion.g
          whileHover={{ scale: 1.1 }}
          role="button"
          tabIndex={0}
          aria-label="Navigate to About and Community"
          className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00f0ff]"
          onClick={() => handleNav('about', '#/about')}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleNav('about', '#/about');
            }
          }}
        >
          <circle cx="90" cy="150" r="18" fill="#050508" stroke="#3b82f6" strokeWidth="2" />
          <circle cx="90" cy="150" r="3" fill="#00f0ff" />
          <text
            x="90"
            y="122"
            fill="#fff"
            fontSize="8"
            fontWeight="bold"
            fontFamily="var(--font-mono)"
            letterSpacing="1"
            textAnchor="middle"
          >
            COMMUNITY
          </text>
        </motion.g>
      </svg>
    </div>
  );
};
