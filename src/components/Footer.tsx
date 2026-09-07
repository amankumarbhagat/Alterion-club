import React from 'react';
import { Logo } from './Logo';
import { Mail, Phone, MapPin, ShieldAlert } from 'lucide-react';
import { Github, Linkedin } from './SocialIcons';

interface FooterProps {
  setCurrentPage: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentPage }) => {
  const handleNavClick = (pageId: string, hash: string) => {
    setCurrentPage(pageId);
    window.location.hash = hash;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-24 border-t border-white/5 bg-[#030306]/95 pt-16 pb-8 overflow-hidden">
      {/* Decorative Grid Overlay */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 glow-orb bg-[#00f0ff] opacity-[0.03] -translate-y-12" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Logo & Vision Block */}
          <div className="flex flex-col gap-4">
            <Logo size={40} />
            <p className="font-sans text-sm text-slate-400 mt-2 leading-relaxed">
              Where ideas become experiments, experiments become products, and students become builders. An engineering innovation ecosystem.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5 transition-all"
                title="GitHub Organization"
              >
                <Github size={16} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5 transition-all"
                title="LinkedIn Page"
              >
                <Linkedin size={16} />
              </a>
              <a
                href="mailto:contact@alterino.org"
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5 transition-all"
                title="Email Club"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-sans font-bold text-sm text-white uppercase tracking-widest mb-6">
              Navigation
            </h4>
            <ul className="space-y-3 font-sans text-sm text-slate-400">
              <li>
                <button onClick={() => handleNavClick('home', '#/')} className="hover:text-[#00f0ff] transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('about', '#/about')} className="hover:text-[#00f0ff] transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('divisions', '#/divisions')} className="hover:text-[#00f0ff] transition-colors">
                  Divisions
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('team', '#/team')} className="hover:text-[#00f0ff] transition-colors">
                  Core Team
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('events', '#/events')} className="hover:text-[#00f0ff] transition-colors">
                  Events Archive
                </button>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-sans font-bold text-sm text-white uppercase tracking-widest mb-6">
              Resources & Hubs
            </h4>
            <ul className="space-y-3 font-sans text-sm text-slate-400">
              <li>
                <button onClick={() => handleNavClick('projects', '#/projects')} className="hover:text-[#00f0ff] transition-colors">
                  Projects Catalog
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('gallery', '#/gallery')} className="hover:text-[#00f0ff] transition-colors">
                  Visual Gallery
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('partners', '#/partners')} className="hover:text-[#00f0ff] transition-colors">
                  Partnerships
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('join', '#/join')} className="hover:text-[#00f0ff] transition-colors font-bold text-[#00f0ff]">
                  Apply for Recruitment
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('admin', '#/admin')} className="flex items-center gap-1.5 hover:text-[#00f0ff] transition-colors text-slate-500">
                  <ShieldAlert size={14} /> Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-sans font-bold text-sm text-white uppercase tracking-widest mb-6">
              Connect With Us
            </h4>
            <ul className="space-y-4 font-sans text-sm text-slate-400">
              <li className="flex gap-3">
                <MapPin size={16} className="text-[#00f0ff] shrink-0 mt-0.5" />
                <span>
                  BMSIT&M Campus, Doddaballapur Road, Yelahanka, Bengaluru, 560064
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-[#00f0ff]" />
                <span>alterino@bmsit.in</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-[#00f0ff]" />
                <span>+91 80 2847 8221</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Meta bottom */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 font-sans text-xs text-slate-500">
          <div>
            © {currentYear} ALTERINO | BMSIT&M. All rights reserved.
          </div>
          <div className="flex items-center gap-1.5">
            Built by <span className="text-white hover:text-[#00f0ff] transition-colors font-semibold">ALTERINO Tech Team</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
