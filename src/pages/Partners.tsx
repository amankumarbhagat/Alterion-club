import React from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { ExternalLink, Handshake } from 'lucide-react';

export const Partners: React.FC = () => {
  const { partners } = useDatabase();

  return (
    <div className="relative pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-100">
      
      {/* Background decoration */}
      <div className="absolute top-20 left-10 w-96 h-96 glow-orb bg-[#3b82f6] opacity-[0.03]" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="font-mono text-xs text-[#00f0ff] font-bold uppercase tracking-widest bg-[#00f0ff]/5 px-3 py-1 rounded-full border border-[#00f0ff]/10 mb-4 inline-block">
          COLLABORATORS
        </span>
        <h1 className="font-sans font-extrabold text-4xl md:text-5xl text-white tracking-tight">
          SPONSORS & INDUSTRY PARTNERS
        </h1>
        <p className="font-sans text-slate-400 mt-4 text-sm md:text-base leading-relaxed">
          ALTERINO collaborates with technology leaders and academic sponsors to support student engineering builds.
        </p>
      </div>

      {/* Partners Grid */}
      {partners.length === 0 ? (
        <div className="glass-panel p-16 rounded-xl border border-white/5 max-w-md mx-auto text-center">
          <Handshake size={48} className="text-slate-600 mx-auto mb-4" />
          <p className="font-mono text-xs text-slate-500 italic">
            "Something exciting is being built here."
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
          {partners.map(partner => (
            <div
              key={partner.id}
              className="glass-panel p-6 rounded-xl border border-white/5 hover:border-[#00f0ff]/30 group transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Header row: logo + name */}
                <div className="flex items-center gap-5 border-b border-white/5 pb-4 mb-4">
                  <div className="w-14 h-14 rounded-lg bg-white/5 overflow-hidden shrink-0 border border-white/10 group-hover:scale-105 transition-transform duration-300">
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="font-mono text-[9px] text-[#00f0ff] uppercase tracking-widest font-bold bg-[#00f0ff]/5 px-2 py-0.5 rounded border border-[#00f0ff]/10">
                      {partner.type}
                    </span>
                    <h3 className="font-sans font-bold text-lg text-white mt-1">
                      {partner.name}
                    </h3>
                  </div>
                </div>

                <p className="font-sans text-xs text-slate-400 leading-relaxed mb-6">
                  {partner.description}
                </p>
              </div>

              {/* Website redirect link */}
              <div className="flex justify-end">
                <a
                  href={partner.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400 group-hover:text-[#00f0ff] hover:underline uppercase font-bold"
                >
                  Visit Website <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
