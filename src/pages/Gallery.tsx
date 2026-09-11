import React, { useState, useEffect, useCallback } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { X, ChevronLeft, ChevronRight, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Gallery: React.FC = () => {
  const { gallery, loading } = useDatabase();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const filters = [
    { label: 'All Media', value: 'all' },
    { label: 'Events', value: 'events' },
    { label: 'Workshops', value: 'workshops' },
    { label: 'Meetings', value: 'meetings' },
    { label: 'Hackathons', value: 'hackathons' },
    { label: 'Projects', value: 'projects' },
    { label: 'Community', value: 'community' }
  ];

  // Filtering
  const filteredGallery = gallery.filter(item => {
    if (activeFilter === 'all') return true;
    return item.category === activeFilter;
  });

  const openLightbox = (id: string) => {
    const idx = filteredGallery.findIndex(item => item.id === id);
    if (idx !== -1) setLightboxIdx(idx);
  };

  const handlePrev = useCallback(() => {
    if (lightboxIdx === null || filteredGallery.length === 0) return;
    setLightboxIdx(prev => (prev === 0 ? filteredGallery.length - 1 : (prev as number) - 1));
  }, [lightboxIdx, filteredGallery.length]);

  const handleNext = useCallback(() => {
    if (lightboxIdx === null || filteredGallery.length === 0) return;
    setLightboxIdx(prev => (prev === filteredGallery.length - 1 ? 0 : (prev as number) + 1));
  }, [lightboxIdx, filteredGallery.length]);

  // Keyboard accessibility: ESC to close, ArrowLeft / ArrowRight to navigate
  useEffect(() => {
    if (lightboxIdx === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIdx(null);
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIdx, handlePrev, handleNext]);

  const currentItem = lightboxIdx !== null ? filteredGallery[lightboxIdx] : null;

  return (
    <div className="relative pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-100">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="font-mono text-xs text-[#00f0ff] font-bold uppercase tracking-widest bg-[#00f0ff]/5 px-3 py-1 rounded-full border border-[#00f0ff]/10 mb-4 inline-block">
          GALLERY
        </span>
        <h1 className="font-sans font-extrabold text-4xl md:text-5xl text-white tracking-tight">
          LAB MEMORIES & VISUALS
        </h1>
        <p className="font-sans text-slate-400 mt-4 text-sm md:text-base leading-relaxed">
          A visual chronicle of our team meetings, physical building schedules, and national competitions.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-12 border-b border-white/5 pb-6" role="tablist" aria-label="Gallery category filters">
        {filters.map(filter => (
          <button
            key={filter.value}
            role="tab"
            aria-selected={activeFilter === filter.value}
            onClick={() => setActiveFilter(filter.value)}
            className={`px-4 py-2 font-sans font-bold text-xs uppercase tracking-wider rounded-lg border transition-all ${
              activeFilter === filter.value
                ? 'bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]/30 shadow-[0_0_10px_rgba(0,240,255,0.1)]'
                : 'bg-white/5 text-slate-400 border-white/5 hover:text-white hover:border-white/10'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Grid Display */}
      {loading && gallery.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="glass-panel rounded-xl aspect-video animate-pulse bg-white/5 border border-white/5" />
          ))}
        </div>
      ) : filteredGallery.length === 0 ? (
        <div className="glass-panel p-16 rounded-xl border border-white/5 max-w-md mx-auto text-center">
          <Compass size={48} className="text-slate-600 mx-auto mb-4" />
          <p className="font-mono text-xs text-slate-500 italic">
            "Something exciting is being built here."
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map(item => (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              aria-label={`View photo: ${item.caption}`}
              onClick={() => openLightbox(item.id)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openLightbox(item.id);
                }
              }}
              className="glass-panel rounded-xl overflow-hidden border border-white/5 hover:border-[#00f0ff]/30 group transition-all duration-300 cursor-pointer aspect-video relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00f0ff]"
            >
              <img
                src={item.image}
                alt={item.caption}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                loading="lazy"
                decoding="async"
              />
              
              {/* Overlay Caption on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050508]/80 to-transparent p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end text-left">
                <span className="font-mono text-[8px] uppercase tracking-widest text-[#00f0ff] font-bold bg-[#00f0ff]/10 px-2 py-0.5 rounded self-start mb-2">
                  {item.category}
                </span>
                <p className="font-sans text-xs text-white leading-relaxed font-medium">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Carousel */}
      <AnimatePresence>
        {currentItem && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Photo lightbox: ${currentItem.caption}`}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
            onClick={() => setLightboxIdx(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxIdx(null)}
              aria-label="Close photo lightbox"
              className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors border border-white/10 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00f0ff]"
            >
              <X size={20} />
            </button>

            {/* Navigation buttons */}
            <button
              onClick={e => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Previous photo"
              className="absolute left-4 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all border border-white/5 hover:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00f0ff]"
            >
              <ChevronLeft size={24} />
            </button>
            
            <button
              onClick={e => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Next photo"
              className="absolute right-4 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all border border-white/5 hover:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00f0ff]"
            >
              <ChevronRight size={24} />
            </button>

            {/* Lightbox Image Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="max-w-4xl w-full flex flex-col items-center gap-4 text-center"
            >
              <div className="max-h-[70vh] rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                <img
                  src={currentItem.image}
                  alt={currentItem.caption}
                  className="w-full h-full object-contain"
                  decoding="async"
                />
              </div>
              
              <div className="max-w-xl">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#00f0ff] font-bold bg-[#00f0ff]/10 px-2.5 py-0.5 rounded border border-[#00f0ff]/20">
                  Category: {currentItem.category}
                </span>
                <p className="font-sans text-sm text-slate-200 leading-relaxed font-medium mt-3">
                  {currentItem.caption}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
