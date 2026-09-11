import React from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { Target, Mail, Phone, MapPin, Sparkles } from 'lucide-react';

export const About: React.FC = () => {
  const { faculty } = useDatabase();

  const objectives = [
    {
      num: "01",
      title: "Promote Innovation",
      desc: "Foster a builder mindset where students build hardware nodes and write server scripts, crossing divisions freely."
    },
    {
      num: "02",
      title: "Bridge Theory & Practice",
      desc: "Enable academic theory to be applied directly in deploying campus software systems and laboratory automation sensors."
    },
    {
      num: "03",
      title: "Collaborative Labs",
      desc: "Assemble inter-disciplinary teams of App Developers, Designers, UI Engineers, and R&D Embedded Specialists."
    },
    {
      num: "04",
      title: "Industry Alignment",
      desc: "Connect with startup founders, hardware mentors, and alumni sponsors to direct and fund physical prototypes."
    }
  ];

  const milestones = [
    { year: "2024", phase: "Foundation", title: "Laboratory Inauguration", desc: "ALTERINO established within the CSE wing at BMSIT&M with 5 core founders to create a dedicated college prototyping space." },
    { year: "2025", phase: "Growth", title: "App Dev & R&D Expansion", desc: "Recruited 20+ active developers. Divided operations into software design and physical sensor systems integration." },
    { year: "2025", phase: "Prototypes", title: "Campus Nav & AuraSense", desc: "Successfully prototyped the smart campus navigation system and deployed automated sensor nodes across campus computing labs." },
    { year: "2026", phase: "Impact", title: "National Wins & Papers", desc: "Claimed 1st place in national hackathons, securing cash grants and publishing edge computation papers in IEEE research archives." },
    { year: "2027", phase: "Future", title: "Open-Source Innovation Hub", desc: "Aiming to incubate startup ideas, secure patents, and make BMSIT&M a self-contained smart campus ecosystem." }
  ];

  return (
    <div className="relative pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-100">
      {/* Background decoration */}
      <div className="absolute top-40 right-10 w-96 h-96 glow-orb bg-[#00f0ff] opacity-5" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="font-mono text-xs text-[#00f0ff] font-bold uppercase tracking-widest bg-[#00f0ff]/5 px-3 py-1 rounded-full border border-[#00f0ff]/10 mb-4 inline-block">
          OUR MISSION
        </span>
        <h1 className="font-sans font-extrabold text-4xl md:text-5xl text-white tracking-tight leading-tight">
          BUILDING AN ENGINEERING INNCUBATION ECOSYSTEM
        </h1>
        <p className="font-sans text-slate-400 mt-4 text-sm md:text-base leading-relaxed">
          ALTERINO is a premier innovation and development cell. We are not just a college club; we are a dedicated group of builders constructing physical-digital solutions for the campus and beyond.
        </p>
      </div>

      {/* Vision & Mission Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24 text-left">
        {/* Vision Card */}
        <div className="glass-panel p-8 rounded-xl border border-white/5 relative overflow-hidden group hover:border-[#00f0ff]/20 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#00f0ff] opacity-[0.02] rounded-bl-full group-hover:opacity-[0.05] transition-opacity" />
          <div className="w-12 h-12 rounded-lg bg-[#00f0ff]/10 text-[#00f0ff] flex items-center justify-center mb-6">
            <Sparkles size={24} />
          </div>
          <h3 className="font-sans font-extrabold text-xl text-white mb-4">Our Vision</h3>
          <p className="font-sans text-slate-400 text-sm leading-relaxed">
            To establish a state-of-the-art engineering lab where student-led initiatives solve complex problems in software, hardware, and networks. We see a future where BMSIT&M students lead technological research, file patents, and build systems deployed globally.
          </p>
        </div>

        {/* Mission Card */}
        <div className="glass-panel p-8 rounded-xl border border-white/5 relative overflow-hidden group hover:border-[#3b82f6]/20 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#3b82f6] opacity-[0.02] rounded-bl-full group-hover:opacity-[0.05] transition-opacity" />
          <div className="w-12 h-12 rounded-lg bg-[#3b82f6]/10 text-[#3b82f6] flex items-center justify-center mb-6">
            <Target size={24} />
          </div>
          <h3 className="font-sans font-extrabold text-xl text-white mb-4">Our Mission</h3>
          <p className="font-sans text-slate-400 text-sm leading-relaxed">
            To equip engineering students with absolute hands-on exposure in App Development (React, Flutter, server architectures) and Research & Development (IoT, firmware coding, AI models). We build campus prototypes, encourage open-source projects, and foster interdisciplinary research.
          </p>
        </div>
      </div>

      {/* Objectives Section */}
      <div className="mb-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-sans font-extrabold text-3xl text-white tracking-tight">Key Objectives</h2>
          <p className="font-sans text-slate-400 text-sm mt-2">The structured goals driving our daily lab sprints and workshop modules.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {objectives.map(obj => (
            <div key={obj.num} className="glass-panel p-6 rounded-xl border border-white/5 flex flex-col justify-between hover:border-white/10 transition-all group">
              <div>
                <span className="font-mono text-xs text-[#00f0ff] font-bold tracking-widest block mb-4">
                  OBJECTIVE {obj.num}
                </span>
                <h4 className="font-sans font-bold text-base text-white mb-2 group-hover:text-[#00f0ff] transition-colors">
                  {obj.title}
                </h4>
                <p className="font-sans text-xs text-slate-400 leading-relaxed">
                  {obj.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Our Journey Timeline */}
      <div className="mb-24 text-left">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-sans font-extrabold text-3xl text-white tracking-tight text-center">Our Journey</h2>
          <p className="font-sans text-slate-400 text-sm mt-2 text-center">From an empty lab chamber to a recognized national development squad.</p>
        </div>
        
        {/* Horizontal scroll timeline on desktop, vertical on mobile */}
        <div className="relative border-l-2 md:border-l-0 md:border-t-2 border-white/10 pl-6 md:pl-0 md:pt-8 grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4">
          {milestones.map((ms) => (
            <div key={ms.year} className="relative">
              {/* Dot decoration */}
              <div className="absolute -left-[31px] top-1 md:-left-0 md:-top-[41px] w-4 h-4 rounded-full bg-[#050508] border-2 border-[#00f0ff] flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse" />
              </div>
              
              <div className="flex flex-col">
                <span className="font-mono text-xs font-bold text-[#00f0ff] tracking-widest mb-1">
                  {ms.year} — {ms.phase}
                </span>
                <h4 className="font-sans font-bold text-base text-white mb-2">{ms.title}</h4>
                <p className="font-sans text-xs text-slate-400 leading-relaxed pr-2">
                  {ms.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Faculty Coordinator Section */}
      <div className="max-w-4xl mx-auto text-left">
        <div className="text-center mb-12">
          <h2 className="font-sans font-extrabold text-3xl text-white tracking-tight">Faculty Mentorship</h2>
          <p className="font-sans text-slate-400 text-sm mt-2">Guiding our compliance, academic integration, and institutional alignment.</p>
        </div>

        <div className="glass-panel rounded-xl overflow-hidden border border-white/5 p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center">
          {/* Faculty Image */}
          <div className="w-40 h-40 rounded-full md:rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-lg">
            <img
              src={faculty.image}
              alt={faculty.name}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* Faculty Info */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#00f0ff] font-bold bg-[#00f0ff]/10 px-2 py-0.5 rounded mb-2 inline-block">
                Faculty Coordinator
              </span>
              <h3 className="font-sans font-extrabold text-2xl text-white mb-1">
                {faculty.name}
              </h3>
              <p className="font-sans text-sm text-[#3b82f6] font-medium mb-3">
                {faculty.designation} — {faculty.department}
              </p>
              <p className="font-sans text-xs text-slate-300 leading-relaxed mb-6">
                {faculty.bio}
              </p>
            </div>

            {/* Direct Contact details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-white/5 pt-4 font-sans text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-[#00f0ff] shrink-0" />
                <span className="truncate">{faculty.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-[#00f0ff] shrink-0" />
                <span>{faculty.phone}</span>
              </div>
              <div className="flex items-center gap-2 sm:col-span-2">
                <MapPin size={14} className="text-[#00f0ff] shrink-0" />
                <span>{faculty.office}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
