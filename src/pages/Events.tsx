import React, { useState, useEffect } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import type { Event } from '../data/seedData';
import { Calendar, MapPin, Clock, User, Award, Images, X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Events: React.FC = () => {
  const { events, loading } = useDatabase();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'ongoing' | 'past'>('upcoming');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Keyboard accessibility: ESC key to close modal
  useEffect(() => {
    if (!selectedEvent) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedEvent(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEvent]);

  const tabs = [
    { label: 'Upcoming', value: 'upcoming' },
    { label: 'Ongoing Sprints', value: 'ongoing' },
    { label: 'Past Archives', value: 'past' }
  ];

  const filteredEvents = events.filter(e => e.status === activeTab);

  return (
    <div className="relative pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-100">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="font-mono text-xs text-[#00f0ff] font-bold uppercase tracking-widest bg-[#00f0ff]/5 px-3 py-1 rounded-full border border-[#00f0ff]/10 mb-4 inline-block">
          CALENDAR
        </span>
        <h1 className="font-sans font-extrabold text-4xl md:text-5xl text-white tracking-tight">
          EVENTS & ACTIVITIES
        </h1>
        <p className="font-sans text-slate-400 mt-4 text-sm md:text-base leading-relaxed">
          Participate in physical hardware labs, software sprints, bootcamps, and hackathons hosted on campus.
        </p>
      </div>

      {/* Tabs Row */}
      <div className="flex justify-center border-b border-white/5 mb-12">
        <div className="flex gap-2" role="tablist" aria-label="Events status filter">
          {tabs.map(tab => (
            <button
              key={tab.value}
              role="tab"
              aria-selected={activeTab === tab.value}
              onClick={() => setActiveTab(tab.value as any)}
              className={`px-6 py-4 font-sans font-bold text-sm uppercase tracking-wider border-b-2 transition-all ${
                activeTab === tab.value
                  ? 'border-[#00f0ff] text-[#00f0ff] glow-text'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {loading && events.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-panel rounded-xl h-80 animate-pulse bg-white/5 border border-white/5" />
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="glass-panel p-16 rounded-xl border border-white/5 max-w-md mx-auto text-center">
          <Calendar size={48} className="text-slate-600 mx-auto mb-4" />
          <p className="font-mono text-xs text-slate-500 italic">
            "Something exciting is being built here."
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {filteredEvents.map(event => (
            <div
              key={event.id}
              role="button"
              tabIndex={0}
              aria-label={`View event details: ${event.title}`}
              onClick={() => setSelectedEvent(event)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedEvent(event);
                }
              }}
              className="glass-panel rounded-xl overflow-hidden border border-white/5 hover:border-[#00f0ff]/30 group transition-all duration-300 cursor-pointer flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00f0ff]"
            >
              {/* Banner Image */}
              <div className="aspect-[16/10] w-full overflow-hidden relative">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
                />
                
                {/* Status indicator pill */}
                <div className="absolute top-3 left-3">
                  <span className={`font-mono text-[8px] uppercase tracking-widest font-bold px-2 py-0.5 rounded ${
                    event.status === 'upcoming'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : event.status === 'ongoing'
                      ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30 animate-pulse'
                      : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                  }`}>
                    {event.status}
                  </span>
                </div>
              </div>

              {/* Card Meta details */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex flex-col gap-2 font-mono text-[10px] text-slate-400 mb-3">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} className="text-[#00f0ff]" /> {event.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={12} className="text-[#3b82f6]" /> {event.venue}
                    </span>
                  </div>

                  <h3 className="font-sans font-bold text-lg text-white mb-2 group-hover:text-[#00f0ff] transition-colors truncate">
                    {event.title}
                  </h3>
                  
                  <p className="font-sans text-xs text-slate-400 line-clamp-3 leading-relaxed mb-6">
                    {event.description}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  <span className="font-sans text-[10px] text-slate-500 truncate max-w-[120px]">
                    Lead: {event.coordinator.split(' ')[0]}
                  </span>
                  
                  {event.status !== 'past' ? (
                    <a
                      href={event.registrationLink}
                      target="_blank"
                      rel="noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="flex items-center gap-1 px-3 py-1 font-mono text-[10px] uppercase font-bold tracking-wider text-black bg-[#00f0ff] hover:bg-[#00e0ef] rounded transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00f0ff]"
                    >
                      Apply <ExternalLink size={10} />
                    </a>
                  ) : (
                    <span className="font-mono text-[10px] text-[#3b82f6] hover:underline flex items-center gap-1 font-bold">
                      View Archive
                    </span>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Event Details Overlay Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="event-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            onClick={() => setSelectedEvent(null)}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="relative w-full max-w-2xl glass-panel rounded-2xl border border-white/10 shadow-2xl overflow-hidden text-left z-10 max-h-[85vh] flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedEvent(null)}
                aria-label="Close event modal"
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-black/50 hover:bg-black/85 text-slate-400 hover:text-white transition-colors z-20 border border-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00f0ff]"
              >
                <X size={16} />
              </button>

              {/* Scrollable Container */}
              <div className="overflow-y-auto flex-1">
                {/* Banner Area */}
                <div className="h-56 relative w-full">
                  <img
                    src={selectedEvent.image}
                    alt={selectedEvent.title}
                    className="w-full h-full object-cover"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050508] to-transparent" />
                  <div className="absolute bottom-4 left-6">
                    <span className="font-mono text-[8px] uppercase tracking-widest font-bold bg-[#00f0ff] text-black px-2 py-0.5 rounded mb-2 inline-block">
                      {selectedEvent.status} Event
                    </span>
                    <h3 id="event-modal-title" className="font-sans font-extrabold text-2xl md:text-3xl text-white">
                      {selectedEvent.title}
                    </h3>
                  </div>
                </div>

                {/* Details grid */}
                <div className="p-6 md:p-8 space-y-6">
                  {/* Event metadata widgets */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-white/5 pb-6">
                    <div className="flex items-center gap-3">
                      <Calendar size={18} className="text-[#00f0ff] shrink-0" />
                      <div>
                        <span className="font-sans text-[10px] text-slate-500 uppercase block leading-none">Date</span>
                        <span className="font-sans text-xs text-white font-medium mt-1 inline-block">{selectedEvent.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock size={18} className="text-[#3b82f6] shrink-0" />
                      <div>
                        <span className="font-sans text-[10px] text-slate-500 uppercase block leading-none">Time Schedule</span>
                        <span className="font-sans text-xs text-white font-medium mt-1 inline-block">{selectedEvent.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin size={18} className="text-[#00f0ff] shrink-0" />
                      <div>
                        <span className="font-sans text-[10px] text-slate-500 uppercase block leading-none">Venue</span>
                        <span className="font-sans text-xs text-white font-medium mt-1 inline-block truncate max-w-[150px]" title={selectedEvent.venue}>{selectedEvent.venue}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h5 className="font-sans font-bold text-xs text-slate-400 uppercase tracking-wider mb-2">
                      Event Overview
                    </h5>
                    <p className="font-sans text-xs md:text-sm text-slate-300 leading-relaxed">
                      {selectedEvent.description}
                    </p>
                  </div>

                  {/* Winners (If past event) */}
                  {selectedEvent.winners && selectedEvent.winners.length > 0 && (
                    <div className="bg-[#3b82f6]/5 border border-[#3b82f6]/10 rounded-lg p-4">
                      <h5 className="font-mono text-xs text-[#3b82f6] uppercase tracking-widest font-bold mb-3 flex items-center gap-1.5">
                        <Award size={14} /> Competition Winners
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {selectedEvent.winners.map((win: string, idx: number) => (
                          <span
                            key={idx}
                            className="font-sans text-xs bg-white/5 border border-white/10 px-3 py-1 rounded-md text-slate-200 font-medium"
                          >
                            {win}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Gallery (If past event) */}
                  {selectedEvent.gallery && selectedEvent.gallery.length > 0 && (
                    <div>
                      <h5 className="font-sans font-bold text-xs text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <Images size={14} /> Event Highlights
                      </h5>
                      <div className="grid grid-cols-2 gap-4">
                        {selectedEvent.gallery.map((img: string, idx: number) => (
                          <div key={idx} className="aspect-video rounded-lg overflow-hidden border border-white/5">
                            <img src={img} alt={`Highlight ${idx}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Coordinator & Registration Footer Actions */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5 pt-6">
                    <div className="flex items-center gap-2 text-left self-start sm:self-center">
                      <div className="w-8 h-8 rounded-full bg-white/10 text-slate-400 flex items-center justify-center">
                        <User size={16} />
                      </div>
                      <div>
                        <span className="font-sans text-[10px] text-slate-500 uppercase block leading-none">Coordinator Contact</span>
                        <span className="font-sans text-xs text-slate-300 font-medium mt-1 inline-block">{selectedEvent.coordinator}</span>
                      </div>
                    </div>

                    {selectedEvent.status !== 'past' ? (
                      <a
                        href={selectedEvent.registrationLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 font-sans font-bold text-sm tracking-wider uppercase text-black bg-[#00f0ff] hover:bg-[#00e0ef] rounded-lg transition-all shadow-[0_0_15px_rgba(0,240,255,0.25)]"
                      >
                        Register Online Now <ExternalLink size={14} />
                      </a>
                    ) : (
                      <button
                        onClick={() => setSelectedEvent(null)}
                        className="w-full sm:w-auto px-6 py-3 font-sans font-bold text-sm tracking-wider uppercase text-slate-400 hover:text-white bg-white/5 border border-white/10 rounded-lg transition-all"
                      >
                        Close Archive
                      </button>
                    )}
                  </div>

                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
