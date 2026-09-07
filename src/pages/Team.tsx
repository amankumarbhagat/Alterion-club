import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import type { Member } from '../data/seedData';
import { Search, Mail, X, UserCheck } from 'lucide-react';
import { Github, Linkedin } from '../components/SocialIcons';
import { motion, AnimatePresence } from 'framer-motion';

export const Team: React.FC = () => {
  const { members } = useDatabase();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'Leadership' | 'App Dev' | 'R&D' | 'Other'>('all');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const filters = [
    { label: 'All Builders', value: 'all' },
    { label: 'Leadership', value: 'Leadership' },
    { label: 'App Development', value: 'App Dev' },
    { label: 'Research & Dev', value: 'R&D' }
  ];

  // Filter and search logic
  const filteredMembers = members.filter(m => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = activeFilter === 'all' || m.division === activeFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="relative pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-100">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="font-mono text-xs text-[#00f0ff] font-bold uppercase tracking-widest bg-[#00f0ff]/5 px-3 py-1 rounded-full border border-[#00f0ff]/10 mb-4 inline-block">
          BUILDERS HUB
        </span>
        <h1 className="font-sans font-extrabold text-4xl md:text-5xl text-white tracking-tight">
          MEET THE CORE SQUAD
        </h1>
        <p className="font-sans text-slate-400 mt-4 text-sm md:text-base leading-relaxed">
          The engineering students curating concepts and developing active products at BMSIT&M.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {filters.map(filter => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value as any)}
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

        {/* Search Input */}
        <div className="relative w-full md:max-w-xs">
          <input
            type="text"
            placeholder="Search name, role, skills..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm text-white glass-input rounded-lg font-sans placeholder-slate-500"
          />
          <Search size={16} className="absolute left-3.5 top-3 text-slate-500" />
        </div>
      </div>

      {/* Directory Cards Grid */}
      {filteredMembers.length === 0 ? (
        <div className="glass-panel p-16 text-center text-slate-500 font-mono text-sm max-w-sm mx-auto rounded-xl border border-white/5">
          "No builders found matching search queries."
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredMembers.map(mem => (
            <div
              key={mem.id}
              onClick={() => setSelectedMember(mem)}
              className="glass-panel rounded-xl overflow-hidden border border-white/5 hover:border-[#00f0ff]/30 group transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              {/* Photo Frame */}
              <div className="aspect-[4/3] w-full overflow-hidden relative border-b border-white/5">
                <img
                  src={mem.image}
                  alt={mem.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                
                {/* Micro social slide-in on card hover (preventing click-through modal triggers) */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#050508]/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-end gap-2">
                  <a
                    href={mem.github}
                    target="_blank"
                    rel="noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="p-1.5 rounded bg-white/10 hover:bg-white/20 text-white"
                  >
                    <Github size={12} />
                  </a>
                  <a
                    href={mem.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="p-1.5 rounded bg-white/10 hover:bg-white/20 text-white"
                  >
                    <Linkedin size={12} />
                  </a>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-5 text-left flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="font-mono text-[8px] uppercase tracking-widest text-[#00f0ff] font-bold bg-[#00f0ff]/10 px-1.5 py-0.5 rounded">
                      {mem.division}
                    </span>
                    {mem.isLeadership && (
                      <span className="font-mono text-[8px] uppercase tracking-widest text-[#3b82f6] font-bold bg-[#3b82f6]/10 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <UserCheck size={8} /> Lead
                      </span>
                    )}
                  </div>
                  <h4 className="font-sans font-bold text-white text-base truncate group-hover:text-[#00f0ff] transition-colors">
                    {mem.name}
                  </h4>
                  <p className="font-sans text-xs text-slate-400 truncate mt-1">
                    {mem.role}
                  </p>
                </div>

                {/* Skills snippets */}
                <div className="flex flex-wrap gap-1 mt-4">
                  {mem.skills.slice(0, 3).map(skill => (
                    <span key={skill} className="font-mono text-[8px] text-slate-400 bg-white/5 px-1.5 py-0.5 rounded">
                      {skill}
                    </span>
                  ))}
                  {mem.skills.length > 3 && (
                    <span className="font-mono text-[8px] text-[#00f0ff] px-1 bg-[#00f0ff]/5 rounded">
                      +{mem.skills.length - 3}
                    </span>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Member Details Modal */}
      <AnimatePresence>
        {selectedMember && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            onClick={() => setSelectedMember(null)}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="relative w-full max-w-lg glass-panel rounded-2xl border border-white/10 shadow-2xl p-6 md:p-8 overflow-hidden text-left z-10"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>

              <div className="flex flex-col sm:flex-row gap-6 items-start">
                {/* Large Profile Image */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 border border-white/10">
                  <img
                    src={selectedMember.image}
                    alt={selectedMember.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Primary Meta */}
                <div className="flex-1 min-w-0">
                  <span className="font-mono text-[8px] uppercase tracking-widest text-[#00f0ff] font-bold bg-[#00f0ff]/10 px-2 py-0.5 rounded mb-2 inline-block">
                    Division: {selectedMember.division}
                  </span>
                  <h3 className="font-sans font-extrabold text-xl md:text-2xl text-white truncate mb-1">
                    {selectedMember.name}
                  </h3>
                  <p className="font-sans text-sm text-[#3b82f6] font-medium mb-3">
                    {selectedMember.role}
                  </p>
                  
                  {/* Quick Contacts */}
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={selectedMember.github}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 px-2.5 py-1 font-mono text-[10px] text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 rounded-md transition-all"
                    >
                      <Github size={12} /> GitHub Profile
                    </a>
                    <a
                      href={selectedMember.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 px-2.5 py-1 font-mono text-[10px] text-slate-300 hover:text-[#00f0ff] bg-white/5 hover:bg-white/10 border border-white/5 rounded-md transition-all"
                    >
                      <Linkedin size={12} /> LinkedIn Profile
                    </a>
                    <a
                      href={`mailto:${selectedMember.email}`}
                      className="flex items-center gap-1 px-2.5 py-1 font-mono text-[10px] text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 rounded-md transition-all"
                    >
                      <Mail size={12} /> Email
                    </a>
                  </div>
                </div>
              </div>

              {/* Bio & Skills details */}
              <div className="mt-8 border-t border-white/5 pt-6 space-y-4">
                <div>
                  <h5 className="font-sans font-bold text-xs text-slate-400 uppercase tracking-wider mb-2">
                    Biography
                  </h5>
                  <p className="font-sans text-xs text-slate-300 leading-relaxed">
                    {selectedMember.bio}
                  </p>
                </div>

                <div>
                  <h5 className="font-sans font-bold text-xs text-slate-400 uppercase tracking-wider mb-2">
                    Technical Skills & Frameworks
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedMember.skills.map((skill: string) => (
                      <span
                        key={skill}
                        className="font-mono text-[9px] text-[#00f0ff] bg-[#00f0ff]/5 border border-[#00f0ff]/10 px-2 py-0.5 rounded"
                      >
                        {skill}
                      </span>
                    ))}
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
