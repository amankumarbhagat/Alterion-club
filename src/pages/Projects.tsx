import React, { useState, useEffect } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import type { Project } from '../data/seedData';
import { Globe, X, Target, Sparkles, BookOpen, Users, Compass } from 'lucide-react';
import { Github } from '../components/SocialIcons';
import { motion, AnimatePresence } from 'framer-motion';

export const Projects: React.FC = () => {
  const { projects, members, loading } = useDatabase();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedProj, setSelectedProj] = useState<Project | null>(null);

  // Keyboard accessibility: ESC key to close modal
  useEffect(() => {
    if (!selectedProj) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProj(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProj]);

  const filters = [
    { label: 'All Projects', value: 'all' },
    { label: 'Web Applications', value: 'web' },
    { label: 'Mobile Apps', value: 'mobile' },
    { label: 'Edge AI / ML', value: 'ai' },
    { label: 'IoT / Hardware', value: 'iot' }
  ];

  // Filter logic
  const filteredProjects = projects.filter(proj => {
    if (activeFilter === 'all') return true;
    return proj.tags.some(tag => tag.toLowerCase() === activeFilter.toLowerCase());
  });

  return (
    <div className="relative pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-100">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="font-mono text-xs text-[#00f0ff] font-bold uppercase tracking-widest bg-[#00f0ff]/5 px-3 py-1 rounded-full border border-[#00f0ff]/10 mb-4 inline-block">
          PORTFOLIO
        </span>
        <h1 className="font-sans font-extrabold text-4xl md:text-5xl text-white tracking-tight">
          INNOVATION PORTFOLIO
        </h1>
        <p className="font-sans text-slate-400 mt-4 text-sm md:text-base leading-relaxed">
          Explore production-grade software and custom physical computing devices developed inside ALTERINO labs.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-12 border-b border-white/5 pb-6" role="tablist" aria-label="Projects category filters">
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

      {/* Projects Grid */}
      {loading && projects.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map(i => (
            <div key={i} className="glass-panel rounded-xl h-96 animate-pulse bg-white/5 border border-white/5" />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="glass-panel p-16 rounded-xl border border-white/5 max-w-md mx-auto text-center">
          <Compass size={48} className="text-slate-600 mx-auto mb-4" />
          <p className="font-mono text-xs text-slate-500 italic">
            "Something exciting is being built here."
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {filteredProjects.map(proj => {
            // Map team photos
            const team = proj.teamIds.map(tid => members.find(m => m.id === tid)).filter(Boolean);

            return (
              <div
                key={proj.id}
                role="button"
                tabIndex={0}
                aria-label={`View project details: ${proj.title}`}
                onClick={() => setSelectedProj(proj)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedProj(proj);
                  }
                }}
                className="glass-panel rounded-xl overflow-hidden border border-white/5 hover:border-[#00f0ff]/30 group transition-all duration-300 cursor-pointer flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00f0ff]"
              >
                {/* Banner image with hover effect */}
                <div className="aspect-video w-full overflow-hidden relative border-b border-white/5">
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050508]/60 to-transparent" />
                  
                  {/* Status Indicator */}
                  <div className="absolute top-3 left-3">
                    <span className={`font-mono text-[8px] uppercase tracking-widest font-bold px-2 py-0.5 rounded border ${
                      proj.status === 'active'
                        ? 'bg-[#00f0ff]/20 text-[#00f0ff] border-[#00f0ff]/30 animate-pulse'
                        : proj.status === 'completed'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {proj.status}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Tags row */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {proj.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="font-mono text-[8px] bg-white/5 text-slate-400 border border-white/5 px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                      {proj.tags.length > 3 && (
                        <span className="font-mono text-[8px] text-[#00f0ff] px-1 bg-[#00f0ff]/5 rounded">
                          +{proj.tags.length - 3}
                        </span>
                      )}
                    </div>

                    <h3 className="font-sans font-extrabold text-xl text-white mb-2 group-hover:text-[#00f0ff] transition-colors truncate">
                      {proj.title}
                    </h3>
                    <p className="font-sans text-xs text-slate-400 line-clamp-3 leading-relaxed mb-6">
                      {proj.solution}
                    </p>
                  </div>

                  {/* Progress & Team members row */}
                  <div className="border-t border-white/5 pt-4 flex items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2 overflow-hidden">
                        {team.slice(0, 3).map((mem, idx) => (
                          <div key={idx} className="inline-block h-6 w-6 rounded-full ring-2 ring-[#050508] overflow-hidden">
                            <img src={mem?.image} alt={mem?.name} className="h-full w-full object-cover" decoding="async" />
                          </div>
                        ))}
                      </div>
                      <span className="font-sans text-[10px] text-slate-400">
                        {team.length} Builders
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-[#00f0ff] font-bold">
                        {proj.progress}%
                      </span>
                      <div className="w-16 bg-white/10 h-1 rounded-full overflow-hidden">
                        <div className="bg-[#00f0ff] h-full" style={{ width: `${proj.progress}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Project Detail Overlay Modal */}
      <AnimatePresence>
        {selectedProj && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            onClick={() => setSelectedProj(null)}
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
              className="relative w-full max-w-3xl glass-panel rounded-2xl border border-white/10 shadow-2xl overflow-hidden text-left z-10 max-h-[85vh] flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProj(null)}
                aria-label="Close project modal"
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-black/50 hover:bg-black/85 text-slate-400 hover:text-white transition-colors z-20 border border-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00f0ff]"
              >
                <X size={16} />
              </button>

              {/* Scrollable container */}
              <div className="overflow-y-auto flex-1">
                {/* Hero Header Area */}
                <div className="h-56 relative w-full">
                  <img
                    src={selectedProj.image}
                    alt={selectedProj.title}
                    className="w-full h-full object-cover"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050508] to-transparent" />
                  <div className="absolute bottom-4 left-6">
                    <span className="font-mono text-[8px] uppercase tracking-widest font-bold bg-[#00f0ff] text-black px-2 py-0.5 rounded mb-2 inline-block">
                      {selectedProj.status} build
                    </span>
                    <h3 id="project-modal-title" className="font-sans font-extrabold text-2xl md:text-3xl text-white">
                      {selectedProj.title}
                    </h3>
                  </div>
                </div>

                <div className="p-6 md:p-8 space-y-8">
                  {/* Problem vs Solution Split */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-white/5 pb-8">
                    <div className="space-y-2">
                      <h5 className="font-mono text-[10px] text-[#ef4444] uppercase tracking-widest font-bold flex items-center gap-1.5">
                        <Target size={12} /> Problem Statement
                      </h5>
                      <p className="font-sans text-xs md:text-sm text-slate-300 leading-relaxed">
                        {selectedProj.problem}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-mono text-[10px] text-emerald-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
                        <Sparkles size={12} /> Prototyped Solution
                      </h5>
                      <p className="font-sans text-xs md:text-sm text-slate-300 leading-relaxed">
                        {selectedProj.solution}
                      </p>
                    </div>
                  </div>

                  {/* Complete Description */}
                  <div>
                    <h5 className="font-sans font-bold text-xs text-slate-400 uppercase tracking-wider mb-2">
                      Technical Architecture & Details
                    </h5>
                    <p className="font-sans text-xs md:text-sm text-slate-300 leading-relaxed">
                      {selectedProj.description}
                    </p>
                  </div>

                  {/* Tech stack & Progress Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tech stack */}
                    <div>
                      <h5 className="font-sans font-bold text-xs text-slate-400 uppercase tracking-wider mb-3">
                        Technology Stack
                      </h5>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedProj.tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="font-mono text-[10px] text-[#00f0ff] bg-[#00f0ff]/5 border border-[#00f0ff]/10 px-2.5 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Progress details */}
                    <div>
                      <h5 className="font-sans font-bold text-xs text-slate-400 uppercase tracking-wider mb-2">
                        Development Status ({selectedProj.progress}%)
                      </h5>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex-1 bg-white/10 h-2 rounded-full overflow-hidden">
                          <div className="bg-[#00f0ff] h-full" style={{ width: `${selectedProj.progress}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Team Members & Mentor */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/5 pt-8">
                    {/* Active builders roster */}
                    <div>
                      <h5 className="font-sans font-bold text-xs text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                        <Users size={14} /> Active Builders
                      </h5>
                      <div className="space-y-3">
                        {selectedProj.teamIds.map((tid: string) => {
                          const mem = members.find(m => m.id === tid);
                          if (!mem) return null;
                          return (
                            <div key={mem.id} className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 shrink-0">
                                <img src={mem.image} alt={mem.name} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <h6 className="font-sans font-bold text-xs text-white leading-none">{mem.name}</h6>
                                <span className="font-mono text-[8px] text-slate-400 uppercase tracking-widest mt-0.5 inline-block">{mem.role}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Mentor Coordinator info */}
                    <div>
                      <h5 className="font-sans font-bold text-xs text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                        <BookOpen size={14} /> Academic Mentor
                      </h5>
                      <div className="glass-panel p-4 rounded-xl border border-white/5 flex flex-col justify-center text-left">
                        <h6 className="font-sans font-bold text-xs text-white">{selectedProj.mentor}</h6>
                        <span className="font-mono text-[8px] text-slate-400 uppercase tracking-widest mt-1">Research & Compliance Advisor</span>
                      </div>
                    </div>
                  </div>

                  {/* External resources footer actions */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5 pt-6">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <a
                        href={selectedProj.github}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 px-5 py-3 w-full sm:w-auto font-mono text-xs uppercase tracking-wider text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg transition-all"
                      >
                        <Github size={16} /> Repository URL
                      </a>
                      
                      {selectedProj.status === 'completed' && (
                        <a
                          href={selectedProj.demo}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center gap-2 px-5 py-3 w-full sm:w-auto font-mono text-xs uppercase tracking-wider text-[#00f0ff] hover:text-white bg-[#00f0ff]/5 hover:bg-[#00f0ff]/20 border border-[#00f0ff]/20 rounded-lg transition-all"
                        >
                          <Globe size={16} /> Live Demo
                        </a>
                      )}
                    </div>

                    <button
                      onClick={() => setSelectedProj(null)}
                      className="w-full sm:w-auto px-6 py-3 font-sans font-bold text-sm tracking-wider uppercase text-slate-400 hover:text-white bg-white/5 border border-white/10 rounded-lg transition-all"
                    >
                      Close Specifications
                    </button>
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
