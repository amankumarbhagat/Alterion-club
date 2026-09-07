import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Menu, X, Sun, Moon, ArrowRight } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, setCurrentPage }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('alterino_theme') as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    } else {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    }
    localStorage.setItem('alterino_theme', theme);
  }, [theme]);

  const navLinks = [
    { label: 'Home', id: 'home', hash: '#/' },
    { label: 'About', id: 'about', hash: '#/about' },
    { label: 'Divisions', id: 'divisions', hash: '#/divisions' },
    { label: 'Team', id: 'team', hash: '#/team' },
    { label: 'Events', id: 'events', hash: '#/events' },
    { label: 'Projects', id: 'projects', hash: '#/projects' },
    { label: 'Gallery', id: 'gallery', hash: '#/gallery' },
    { label: 'Partners', id: 'partners', hash: '#/partners' },
    { label: 'Contact', id: 'contact', hash: '#/contact' },
  ];

  const handleNavClick = (id: string, hash: string) => {
    setCurrentPage(id);
    window.location.hash = hash;
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#050508]/85 dark:bg-[#050508]/85 border-b border-white/5 backdrop-blur-md shadow-lg py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <div className="cursor-pointer" onClick={() => handleNavClick('home', '#/')}>
            <Logo />
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map(link => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id, link.hash)}
                  className={`px-3 py-2 rounded-md font-sans text-sm font-medium tracking-wide transition-all ${
                    isActive
                      ? 'text-[#00f0ff] glow-text border-b border-[#00f0ff]/50 rounded-none'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Actions: Theme toggle + CTA */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-white/5 hover:border-white/20 bg-white/5 text-slate-400 hover:text-white transition-colors"
              title="Toggle Light/Dark Theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* CTA Join Button */}
            <button
              onClick={() => handleNavClick('join', '#/join')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-sans uppercase font-bold tracking-wider rounded-lg border transition-all ${
                currentPage === 'join'
                  ? 'bg-[#00f0ff] text-black border-[#00f0ff]'
                  : 'bg-transparent text-[#00f0ff] border-[#00f0ff]/30 hover:border-[#00f0ff] hover:bg-[#00f0ff]/10 hover:shadow-[0_0_15px_rgba(0,240,255,0.25)]'
              }`}
            >
              Join ALTERINO <ArrowRight size={14} />
            </button>
          </div>

          {/* Mobile Menu Action Row */}
          <div className="flex lg:hidden items-center gap-3">
            {/* Theme Toggle Mobile */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-white/5 bg-white/5 text-slate-400 hover:text-white transition-colors"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg border border-white/5 bg-white/5 text-slate-400 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-[#050508]/95 border-b border-white/10 backdrop-blur-xl shadow-2xl animate-fade-in">
          <div className="px-4 pt-3 pb-6 space-y-2">
            {navLinks.map(link => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id, link.hash)}
                  className={`block w-full text-left px-4 py-3 rounded-lg font-sans text-base font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'text-[#00f0ff] bg-[#00f0ff]/10 border-l-4 border-[#00f0ff]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}

            {/* Join Us CTA Mobile */}
            <button
              onClick={() => handleNavClick('join', '#/join')}
              className={`flex items-center justify-center gap-2 w-full mt-4 px-4 py-3 text-sm font-sans uppercase font-bold tracking-wider rounded-lg transition-all ${
                currentPage === 'join'
                  ? 'bg-[#00f0ff] text-black'
                  : 'bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30'
              }`}
            >
              Join ALTERINO <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
