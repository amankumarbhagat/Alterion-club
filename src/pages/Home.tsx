import React, { useState, useEffect, Suspense } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { ArrowRight, Code, Star, Calendar, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import { ThreeSceneFallback } from '../components/three/ThreeSceneFallback';

// Lazy load 3D scene to keep initial bundle lightweight
const AlterinoHeroScene = React.lazy(() => import('../components/three/AlterinoHeroScene'));

// Quick counter component
const AnimatedCounter: React.FC<{ target: number; duration?: number }> = ({ target, duration = 1.5 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = target;
    if (start === end) {
      setCount(end);
      return;
    }

    const totalMiliseconds = duration * 1000;
    const incrementTime = 40;
    const totalSteps = totalMiliseconds / incrementTime;
    const increment = (end - start) / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(Math.floor(start));
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{count}</span>;
};

interface HomeProps {
  setCurrentPage: (page: string) => void;
}

export const Home: React.FC<HomeProps> = ({ setCurrentPage }) => {
  const { stats, announcements, events, projects, achievements } = useDatabase();
  const [activeAnnouncementIdx, setActiveAnnouncementIdx] = useState(0);

  // Cycle announcements in the ticker
  useEffect(() => {
    const activeAnn = announcements.filter(a => a.active);
    if (activeAnn.length <= 1) return;

    const interval = setInterval(() => {
      setActiveAnnouncementIdx(prev => (prev + 1) % activeAnn.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [announcements]);

  const activeAnnouncements = announcements.filter(a => a.active);
  const upcomingEvents = events.filter(e => e.status === 'upcoming').slice(0, 2);
  const activeProjects = projects.filter(p => p.status === 'active').slice(0, 2);

  const handleNav = (page: string, hash: string) => {
    setCurrentPage(page);
    window.location.hash = hash;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen text-slate-100">
      
      {/* Decorative Orbs */}
      <div className="absolute top-20 left-1/4 w-80 h-80 glow-orb bg-[#00f0ff] opacity-10" />
      <div className="absolute top-96 right-1/4 w-96 h-96 glow-orb bg-[#3b82f6] opacity-10" />

      {/* HERO SECTION */}
      <section className="relative pt-36 pb-20 md:pt-48 md:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero text */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Tag Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#00f0ff]/20 bg-[#00f0ff]/5 backdrop-blur-sm text-xs font-mono font-semibold text-[#00f0ff] uppercase tracking-widest mb-6"
            >
              <Terminal size={12} /> ALTERINO | BMSIT&M
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-sans font-extrabold text-5xl md:text-6xl xl:text-7xl tracking-tight text-white leading-[1.08] mb-6"
            >
              CURATING IDEAS.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-[#3b82f6] to-[#818cf8]">
                BUILDING IMPACT.
              </span>
            </motion.h1>

            {/* Supporting Text */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-sans text-lg md:text-xl text-slate-400 font-normal leading-relaxed max-w-xl mb-3"
            >
              Engineering Innovation & Development
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="font-sans text-sm md:text-base text-slate-500 max-w-lg mb-8 leading-relaxed"
            >
              Where ideas become experiments, experiments become products, and students become builders. Join our R&D and App Dev labs to construct physical-digital solutions.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4"
            >
              <button
                onClick={() => handleNav('join', '#/join')}
                className="flex items-center gap-2 px-6 py-3 font-sans font-bold text-sm tracking-wider uppercase text-black bg-[#00f0ff] hover:bg-[#00e0ef] rounded-lg transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)]"
              >
                Join ALTERINO <ArrowRight size={16} />
              </button>
              <button
                onClick={() => handleNav('projects', '#/projects')}
                className="px-6 py-3 font-sans font-bold text-sm tracking-wider uppercase text-white hover:text-[#00f0ff] bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00f0ff]/30 rounded-lg transition-all backdrop-blur-sm"
              >
                Explore Our Work
              </button>
            </motion.div>
          </div>

          {/* Interactive 3D Hero Visual with Graceful WebGL Fallback */}
          <div className="lg:col-span-5 relative w-full min-h-[340px] md:min-h-[420px] flex items-center justify-center">
            <Suspense fallback={<ThreeSceneFallback onNavigate={handleNav} />}>
              <AlterinoHeroScene onNavigate={handleNav} />
            </Suspense>
          </div>

        </div>
      </section>

      {/* HERO STATS */}
      <section className="relative border-y border-white/5 bg-[#0a0a0f]/60 backdrop-blur-sm py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center text-center">
            
            <div className="flex flex-col items-center">
              <span className="font-sans font-extrabold text-3xl md:text-4xl text-white tracking-tight">
                <AnimatedCounter target={stats.projects} />+
              </span>
              <span className="font-mono text-[10px] text-[#00f0ff] uppercase tracking-widest mt-1">Projects Built</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="font-sans font-extrabold text-3xl md:text-4xl text-white tracking-tight">
                <AnimatedCounter target={stats.events} />+
              </span>
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest mt-1">Events Hosted</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="font-sans font-extrabold text-3xl md:text-4xl text-white tracking-tight">
                <AnimatedCounter target={stats.members} />+
              </span>
              <span className="font-mono text-[10px] text-[#00f0ff] uppercase tracking-widest mt-1">Active Builders</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="font-sans font-extrabold text-3xl md:text-4xl text-white tracking-tight">
                <AnimatedCounter target={stats.divisions} />
              </span>
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest mt-1">Spec Divisions</span>
            </div>

            <div className="col-span-2 md:col-span-1 flex flex-col items-center">
              <span className="font-sans font-extrabold text-3xl md:text-4xl text-white tracking-tight">
                <AnimatedCounter target={stats.partners} />+
              </span>
              <span className="font-mono text-[10px] text-[#00f0ff] uppercase tracking-widest mt-1">Tech Partners</span>
            </div>

          </div>
        </div>
      </section>

      {/* ANNOUNCEMENT NEWS TICKER */}
      {activeAnnouncements.length > 0 && (
        <section className="bg-[#00f0ff]/5 border-b border-[#00f0ff]/10 py-3 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 shrink-0">
              <span className="font-mono text-[10px] uppercase font-bold bg-[#00f0ff] text-black px-2 py-0.5 rounded tracking-widest animate-pulse">
                WHAT'S NEW
              </span>
            </div>
            
            {/* Scroll/cycle frame */}
            <div className="flex-1 text-left overflow-hidden h-5 relative">
              {activeAnnouncements.map((ann, idx) => (
                <div
                  key={ann.id}
                  className={`absolute inset-0 font-sans text-xs md:text-sm text-slate-300 truncate transition-all duration-500 transform ${
                    idx === activeAnnouncementIdx
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 -translate-y-4 pointer-events-none'
                  }`}
                >
                  <span className="text-[#00f0ff] font-mono mr-2">[{ann.date}]</span> {ann.title} — {ann.content}
                </div>
              ))}
            </div>

            <button
              onClick={() => handleNav('events', '#/events')}
              className="shrink-0 font-mono text-[10px] text-[#00f0ff] uppercase font-bold hover:underline flex items-center gap-1"
            >
              All Notices <ArrowRight size={10} />
            </button>
          </div>
        </section>
      )}

      {/* CORE HIGHLIGHTS: EVENTS & PROJECTS */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Upcoming Events Column */}
          <div className="flex flex-col text-left">
            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
              <h3 className="font-sans font-bold text-xl md:text-2xl text-white flex items-center gap-2.5">
                <Calendar size={20} className="text-[#00f0ff]" /> Upcoming Events
              </h3>
              <button
                onClick={() => handleNav('events', '#/events')}
                className="font-mono text-xs text-[#00f0ff] hover:underline flex items-center gap-1 uppercase tracking-wider"
              >
                All Events <ArrowRight size={12} />
              </button>
            </div>

            {upcomingEvents.length === 0 ? (
              <div className="glass-panel rounded-xl p-8 text-center text-slate-500 font-mono text-sm border border-white/5">
                "Something exciting is being built here."
              </div>
            ) : (
              <div className="space-y-6">
                {upcomingEvents.map(event => (
                  <div
                    key={event.id}
                    className="glass-panel glow-border rounded-xl overflow-hidden group flex flex-col sm:flex-row gap-4 p-4"
                  >
                    <div className="w-full sm:w-32 h-24 rounded-lg overflow-hidden shrink-0">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="flex flex-col justify-between text-left flex-1 min-w-0">
                      <div>
                        <span className="font-mono text-[10px] text-[#00f0ff] uppercase tracking-wider block mb-1">
                          {event.date} | {event.time}
                        </span>
                        <h4 className="font-sans font-bold text-base text-white truncate mb-1.5">
                          {event.title}
                        </h4>
                        <p className="font-sans text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {event.description}
                        </p>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-2 border-t border-white/5 pt-2">
                        <span className="font-sans text-[10px] text-slate-500 truncate">
                          Coord: {event.coordinator}
                        </span>
                        <a
                          href={event.registrationLink}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1 font-mono text-[9px] uppercase tracking-widest bg-[#00f0ff]/10 text-[#00f0ff] hover:bg-[#00f0ff] hover:text-black rounded transition-all font-bold"
                        >
                          Register
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Projects Column */}
          <div className="flex flex-col text-left">
            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
              <h3 className="font-sans font-bold text-xl md:text-2xl text-white flex items-center gap-2.5">
                <Code size={20} className="text-[#3b82f6]" /> Current Projects
              </h3>
              <button
                onClick={() => handleNav('projects', '#/projects')}
                className="font-mono text-xs text-[#00f0ff] hover:underline flex items-center gap-1 uppercase tracking-wider"
              >
                Showcase Portfolio <ArrowRight size={12} />
              </button>
            </div>

            {activeProjects.length === 0 ? (
              <div className="glass-panel rounded-xl p-8 text-center text-slate-500 font-mono text-sm border border-white/5">
                "Something exciting is being built here."
              </div>
            ) : (
              <div className="space-y-6">
                {activeProjects.map(proj => (
                  <div
                    key={proj.id}
                    className="glass-panel glow-border rounded-xl overflow-hidden group flex flex-col sm:flex-row gap-4 p-4"
                  >
                    <div className="w-full sm:w-32 h-24 rounded-lg overflow-hidden shrink-0">
                      <img
                        src={proj.image}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="flex flex-col justify-between text-left flex-1 min-w-0">
                      <div>
                        <div className="flex flex-wrap gap-1.5 mb-1.5">
                          {proj.tags.slice(0, 3).map(t => (
                            <span key={t} className="font-mono text-[8px] bg-white/5 text-slate-400 px-1.5 py-0.5 rounded">
                              {t}
                            </span>
                          ))}
                        </div>
                        <h4 className="font-sans font-bold text-base text-white truncate mb-1">
                          {proj.title}
                        </h4>
                        <p className="font-sans text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {proj.solution}
                        </p>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-4 border-t border-white/5 pt-2">
                        <div className="flex-1 flex items-center gap-2">
                          <div className="flex-1 bg-white/10 h-1 rounded-full overflow-hidden">
                            <div className="bg-[#00f0ff] h-full" style={{ width: `${proj.progress}%` }} />
                          </div>
                          <span className="font-mono text-[9px] text-[#00f0ff]">{proj.progress}%</span>
                        </div>
                        <button
                          onClick={() => handleNav('projects', '#/projects')}
                          className="font-mono text-[9px] uppercase tracking-widest text-[#00f0ff] hover:underline"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>

      {/* IMPACT / TIMELINE SECTION */}
      <section className="py-20 border-t border-white/5 bg-[#08080c]/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-sans font-extrabold text-3xl md:text-4xl text-white tracking-tight mb-4">
              IMPACT & MILESTONES
            </h2>
            <p className="font-sans text-slate-400 text-sm md:text-base leading-relaxed">
              Tracking our competitive awards, paper acceptances, and hardware installations across national stages.
            </p>
          </div>

          {achievements.length === 0 ? (
            <div className="glass-panel rounded-xl p-12 text-center text-slate-500 font-mono text-sm max-w-lg mx-auto border border-white/5">
              "Something exciting is being built here."
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
              {achievements.map(ach => (
                <div
                  key={ach.id}
                  className="glass-panel p-6 rounded-xl border border-white/5 flex gap-4 hover:border-[#00f0ff]/30 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-lg bg-[#00f0ff]/10 text-[#00f0ff] flex items-center justify-center shrink-0">
                    <Star size={24} />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-[#00f0ff] font-bold uppercase tracking-widest bg-[#00f0ff]/5 px-2 py-0.5 rounded border border-[#00f0ff]/10 mb-2 inline-block">
                      {ach.badge}
                    </span>
                    <h4 className="font-sans font-bold text-base text-white mb-1 group-hover:text-[#00f0ff] transition-colors">
                      {ach.title}
                    </h4>
                    <span className="font-mono text-xs text-slate-500 block mb-2">{ach.date}</span>
                    <p className="font-sans text-xs text-slate-400 leading-relaxed">
                      {ach.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
};
