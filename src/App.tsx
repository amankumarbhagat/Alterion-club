import React, { useState, useEffect } from 'react';
import { DatabaseProvider } from './context/DatabaseContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { InnovationNetwork } from './components/InnovationNetwork';

// Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Divisions } from './pages/Divisions';
import { Team } from './pages/Team';
import { Events } from './pages/Events';
import { Projects } from './pages/Projects';
import { Gallery } from './pages/Gallery';
import { Partners } from './pages/Partners';
import { JoinUs } from './pages/JoinUs';
import { Contact } from './pages/Contact';
import { AdminDashboard } from './pages/AdminDashboard';
import { NotFound } from './pages/NotFound';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('home');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (!hash || hash === '#/') {
        setCurrentPage('home');
      } else if (hash === '#/about') {
        setCurrentPage('about');
      } else if (hash === '#/divisions') {
        setCurrentPage('divisions');
      } else if (hash === '#/team') {
        setCurrentPage('team');
      } else if (hash === '#/events') {
        setCurrentPage('events');
      } else if (hash === '#/projects') {
        setCurrentPage('projects');
      } else if (hash === '#/gallery') {
        setCurrentPage('gallery');
      } else if (hash === '#/partners') {
        setCurrentPage('partners');
      } else if (hash === '#/join') {
        setCurrentPage('join');
      } else if (hash === '#/contact') {
        setCurrentPage('contact');
      } else if (hash === '#/admin') {
        setCurrentPage('admin');
      } else {
        setCurrentPage('notfound');
      }
    };

    // Run on initial mount
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home setCurrentPage={setCurrentPage} />;
      case 'about':
        return <About />;
      case 'divisions':
        return <Divisions />;
      case 'team':
        return <Team />;
      case 'events':
        return <Events />;
      case 'projects':
        return <Projects />;
      case 'gallery':
        return <Gallery />;
      case 'partners':
        return <Partners />;
      case 'join':
        return <JoinUs />;
      case 'contact':
        return <Contact />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <NotFound setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <DatabaseProvider>
      <AuthProvider>
        <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden">
          {/* Interactive nodes system */}
          <InnovationNetwork />

          {/* Header navigation bar */}
          <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />

          {/* Dynamic page main content */}
          <main className="flex-grow">
            {renderPage()}
          </main>

          {/* Consolidated footer */}
          <Footer setCurrentPage={setCurrentPage} />
        </div>
      </AuthProvider>
    </DatabaseProvider>
  );
};

export default App;
