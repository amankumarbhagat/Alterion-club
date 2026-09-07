import React from 'react';
import { ShieldAlert, CornerDownLeft } from 'lucide-react';

interface NotFoundProps {
  setCurrentPage: (page: string) => void;
}

export const NotFound: React.FC<NotFoundProps> = ({ setCurrentPage }) => {
  const handleGoHome = () => {
    setCurrentPage('home');
    window.location.hash = '#/';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center text-slate-100 px-4">
      {/* Background Grid */}
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 glow-orb bg-[#ef4444] opacity-5 pointer-events-none" />

      <div className="text-center space-y-6 relative z-10 max-w-md">
        {/* Warning Icon */}
        <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto border border-red-500/20 animate-pulse">
          <ShieldAlert size={36} />
        </div>

        <div>
          <span className="font-mono text-xs text-red-400 font-bold uppercase tracking-widest bg-red-500/5 px-3 py-1 rounded-full border border-red-500/10 mb-4 inline-block">
            ERROR CODE 404
          </span>
          
          <h1 className="font-sans font-extrabold text-4xl md:text-5xl text-white tracking-tight leading-none mb-3">
            LOST IN THE SYSTEM?
          </h1>
          
          <p className="font-sans text-xs md:text-sm text-slate-400 leading-relaxed">
            The network transmission coordinate you entered does not exist or has been archived. Check your route path.
          </p>
        </div>

        <div className="pt-4">
          <button
            onClick={handleGoHome}
            className="flex items-center justify-center gap-2 w-full px-6 py-3 font-sans font-bold text-sm tracking-wider uppercase text-black bg-[#00f0ff] hover:bg-[#00e0ef] rounded-lg transition-all shadow-[0_0_15px_rgba(0,240,255,0.25)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)] mx-auto"
          >
            <CornerDownLeft size={16} /> Return to Home base
          </button>
        </div>
      </div>
    </div>
  );
};
