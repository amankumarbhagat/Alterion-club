import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { Code, Cpu, Shield, User, Users, Hammer, Layers, ListChecks, Star, BookOpen } from 'lucide-react';

export const Divisions: React.FC = () => {
  const { divisions, members, projects } = useDatabase();
  const [activeDivId, setActiveDivId] = useState(divisions[0]?.id || '');

  // Helper to map string to Lucide icon
  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'code':
        return <Code size={24} />;
      case 'cpu':
        return <Cpu size={24} />;
      default:
        return <Shield size={24} />;
    }
  };

  const activeDivision = divisions.find(d => d.id === activeDivId) || divisions[0];

  // Resolve lead details
  const leadMember = members.find(m => m.id === activeDivision?.leadId);

  // Resolve division members (excluding the lead if they are listed separately)
  const divisionMembers = members.filter(
    m => m.division.toLowerCase() === (activeDivision?.name === 'App Development' ? 'app dev' : 'r&d') && m.id !== activeDivision?.leadId
  );

  // Resolve projects associated with this division
  // If tags match division skills or team members are in division
  const divisionProjects = projects.filter(proj => {
    return proj.teamIds.some(tid => {
      const mem = members.find(m => m.id === tid);
      return mem?.division.toLowerCase() === (activeDivision?.name === 'App Development' ? 'app dev' : 'r&d');
    });
  });

  return (
    <div className="relative pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-100">
      
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="font-mono text-xs text-[#00f0ff] font-bold uppercase tracking-widest bg-[#00f0ff]/5 px-3 py-1 rounded-full border border-[#00f0ff]/10 mb-4 inline-block">
          SPECIALIZATIONS
        </span>
        <h1 className="font-sans font-extrabold text-4xl md:text-5xl text-white tracking-tight">
          OUR CORE DIVISIONS
        </h1>
        <p className="font-sans text-slate-400 mt-4 text-sm md:text-base leading-relaxed">
          ALTERINO operates in specialized divisions to maintain depth and focus, bridging hardware integrations with modern application software.
        </p>
      </div>

      {divisions.length === 0 ? (
        <div className="glass-panel rounded-xl p-16 text-center text-slate-500 font-mono text-sm max-w-md mx-auto border border-white/5">
          "Something exciting is being built here."
        </div>
      ) : (
        <div>
          {/* Division Selector Tabs */}
          <div className="flex justify-center border-b border-white/5 mb-16">
            <div className="flex gap-2">
              {divisions.map(div => {
                const isActive = div.id === activeDivId;
                return (
                  <button
                    key={div.id}
                    onClick={() => setActiveDivId(div.id)}
                    className={`flex items-center gap-3 px-6 py-4 font-sans font-bold text-sm uppercase tracking-wider border-b-2 transition-all ${
                      isActive
                        ? 'border-[#00f0ff] text-[#00f0ff] glow-text'
                        : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                  >
                    {getIcon(div.iconName)}
                    {div.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Division Panel Detail */}
          {activeDivision && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
              
              {/* Left Column: Vision, Lead and Members */}
              <div className="lg:col-span-4 space-y-8">
                {/* About card */}
                <div className="glass-panel p-6 rounded-xl border border-white/5">
                  <h3 className="font-mono text-xs text-[#00f0ff] uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                    <Layers size={14} /> Description
                  </h3>
                  <p className="font-sans text-sm text-slate-300 leading-relaxed">
                    {activeDivision.description}
                  </p>
                </div>

                {/* Division Lead Card */}
                {leadMember && (
                  <div className="glass-panel p-6 rounded-xl border border-white/5">
                    <h3 className="font-mono text-xs text-[#00f0ff] uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                      <User size={14} /> Division Lead
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-white/10">
                        <img
                          src={leadMember.image}
                          alt={leadMember.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-sans font-bold text-white text-base">
                          {leadMember.name}
                        </h4>
                        <span className="font-mono text-[9px] text-[#3b82f6] uppercase tracking-wider">
                          {leadMember.role}
                        </span>
                        <p className="font-sans text-[11px] text-slate-400 mt-1 truncate max-w-[200px]">
                          {leadMember.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Team Members Grid */}
                <div className="glass-panel p-6 rounded-xl border border-white/5">
                  <h3 className="font-mono text-xs text-[#00f0ff] uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                    <Users size={14} /> Team Members
                  </h3>
                  {divisionMembers.length === 0 ? (
                    <span className="font-sans text-xs text-slate-500">No members registered.</span>
                  ) : (
                    <div className="grid grid-cols-5 gap-3">
                      {divisionMembers.map(mem => (
                        <div key={mem.id} className="relative group cursor-pointer" title={`${mem.name} - ${mem.role}`}>
                          <div className="aspect-square rounded-lg overflow-hidden border border-white/10 hover:border-[#00f0ff] transition-all">
                            <img src={mem.image} alt={mem.name} className="w-full h-full object-cover" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Responsibilities, Ongoing Pipeline, Skills, Tools, Projects */}
              <div className="lg:col-span-8 space-y-8">
                {/* Responsibilities list */}
                <div className="glass-panel p-8 rounded-xl border border-white/5">
                  <h3 className="font-mono text-xs text-[#00f0ff] uppercase tracking-widest font-bold mb-6 flex items-center gap-2">
                    <ListChecks size={16} /> Key Responsibilities
                  </h3>
                  <ul className="space-y-4">
                    {activeDivision.responsibilities.map((resp, idx) => (
                      <li key={idx} className="flex gap-4 font-sans text-sm text-slate-300 leading-relaxed">
                        <span className="font-mono text-[#3b82f6] font-bold">[{idx + 1}]</span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Skills & Tools grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Skills Card */}
                  <div className="glass-panel p-6 rounded-xl border border-white/5">
                    <h3 className="font-mono text-xs text-[#00f0ff] uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                      <BookOpen size={14} /> Technical Competencies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {activeDivision.skills.map(skill => (
                        <span key={skill} className="font-mono text-[10px] bg-[#00f0ff]/5 text-[#00f0ff] border border-[#00f0ff]/10 px-2 py-1 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tools Card */}
                  <div className="glass-panel p-6 rounded-xl border border-white/5">
                    <h3 className="font-mono text-xs text-[#00f0ff] uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                      <Hammer size={14} /> Standard Work Tools
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {activeDivision.tools.map(tool => (
                        <span key={tool} className="font-mono text-[10px] bg-[#3b82f6]/5 text-[#3b82f6] border border-[#3b82f6]/10 px-2 py-1 rounded">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pipeline / Ongoing Work */}
                <div className="glass-panel p-6 rounded-xl border border-[#00f0ff]/10 bg-[#00f0ff]/[0.02]">
                  <h3 className="font-mono text-xs text-[#00f0ff] uppercase tracking-widest font-bold mb-2 flex items-center gap-2">
                    <Star size={14} className="animate-spin-slow" /> Current Sprint Pipeline
                  </h3>
                  <p className="font-sans text-sm text-slate-300 leading-relaxed italic">
                    "{activeDivision.ongoingWork}"
                  </p>
                </div>

                {/* Division Projects showcase */}
                <div>
                  <h3 className="font-sans font-bold text-lg text-white mb-6 flex items-center gap-2">
                    Active Projects
                  </h3>
                  {divisionProjects.length === 0 ? (
                    <div className="glass-panel p-6 text-center text-slate-500 font-mono text-xs rounded-xl border border-white/5">
                      "No active projects cataloged for this division."
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {divisionProjects.map(proj => (
                        <div key={proj.id} className="glass-panel p-5 rounded-xl border border-white/5 group hover:border-[#00f0ff]/20 transition-all flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">
                                Status: {proj.status}
                              </span>
                              <span className="font-mono text-[9px] text-[#00f0ff]">
                                {proj.progress}%
                              </span>
                            </div>
                            <h4 className="font-sans font-bold text-base text-white mb-2 group-hover:text-[#00f0ff] transition-colors">
                              {proj.title}
                            </h4>
                            <p className="font-sans text-xs text-slate-400 line-clamp-2 leading-relaxed">
                              {proj.solution}
                            </p>
                          </div>
                          
                          <div className="mt-4 flex items-center gap-2">
                            <div className="flex-1 bg-white/10 h-0.5 rounded-full overflow-hidden">
                              <div className="bg-[#00f0ff] h-full" style={{ width: `${proj.progress}%` }} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}
        </div>
      )}

    </div>
  );
};
