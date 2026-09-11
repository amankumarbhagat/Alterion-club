import React, { useState, useEffect, Suspense, lazy } from 'react';
import { DatabaseProvider } from './context/DatabaseContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { InnovationNetwork } from './components/InnovationNetwork';
import { useSEO } from './utils/seo';

// Route-Level Code Splitting (React.lazy)
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const Divisions = lazy(() => import('./pages/Divisions').then(m => ({ default: m.Divisions })));
const Team = lazy(() => import('./pages/Team').then(m => ({ default: m.Team })));
const Events = lazy(() => import('./pages/Events').then(m => ({ default: m.Events })));
const Projects = lazy(() => import('./pages/Projects').then(m => ({ default: m.Projects })));
const Gallery = lazy(() => import('./pages/Gallery').then(m => ({ default: m.Gallery })));
const Partners = lazy(() => import('./pages/Partners').then(m => ({ default: m.Partners })));
const JoinUs = lazy(() => import('./pages/JoinUs').then(m => ({ default: m.JoinUs })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));

// Branded Cyber Loading Fallback
const PageLoadingFallback: React.FC = () => (
  <div className="min-h-[65vh] flex flex-col items-center justify-center gap-4 text-center px-4">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 rounded-full border-2 border-t-[#00f0ff] border-r-transparent border-b-[#3b82f6] border-l-transparent animate-spin" />
      <div
        className="absolute inset-2 rounded-full border-2 border-r-[#00f0ff] border-t-transparent border-l-[#818cf8] border-b-transparent animate-spin"
        style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}
      />
    </div>
    <span className="font-mono text-xs uppercase tracking-widest text-slate-400 animate-pulse">
      SYNCHRONIZING TELEMETRY...
    </span>
  </div>
);

// Inner Application Component with Dynamic SEO Routing
const AppContent: React.FC = () => {
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

  // Dynamic Route SEO Metadata mapping
  const seoConfig = (() => {
    switch (currentPage) {
      case 'home':
        return {
          title: 'BMSIT&M — Engineering Innovation & Development Club',
          description:
            'Official website of ALTERINO, the premier Engineering Innovation & Development club at BMSIT&M. Curating Ideas. Building Impact.',
        };
      case 'about':
        return {
          title: 'About Us & Vision',
          description:
            'Discover the core ethos, faculty mentorship, and mission of ALTERINO Club at BMSIT&M.',
        };
      case 'divisions':
        return {
          title: 'Specialized Divisions & Labs',
          description:
            'Explore the specialized engineering focus areas: App Development and Research & Development (R&D).',
        };
      case 'team':
        return {
          title: 'Core Leadership & Builders',
          description:
            'Meet the student leaders, engineers, and creators driving innovation across campus at ALTERINO.',
        };
      case 'events':
        return {
          title: 'Hackathons, Summits & Workshops',
          description:
            'Browse upcoming hackathons, technical bootcamps, and past campus events hosted by ALTERINO.',
        };
      case 'projects':
        return {
          title: 'Engineered Solutions & Projects',
          description:
            'Explore innovative student-built open-source tools, IoT monitoring, and campus software solutions.',
        };
      case 'gallery':
        return {
          title: 'Campus Highlights & Memories',
          description:
            'Visual highlights, workshop moments, and community building sessions from ALTERINO Club.',
        };
      case 'partners':
        return {
          title: 'Ecosystem & Industry Partners',
          description:
            'Industry sponsors, platform partners, and institutional collaborators empowering ALTERINO.',
        };
      case 'join':
        return {
          title: 'Join Us — Student Recruitment',
          description:
            'Apply to join ALTERINO Club. Build impactful engineering products and collaborate with passionate peers.',
        };
      case 'contact':
        return {
          title: 'Contact Us & Transmissions',
          description:
            'Get in touch with the ALTERINO leadership team, send inquiries, or propose project collaborations.',
        };
      case 'admin':
        return {
          title: 'Admin Security Gateway',
          description: 'Authorized administrative management gateway for ALTERINO Club.',
          noindex: true,
        };
      default:
        return {
          title: 'Page Not Found (404)',
          description: 'The requested transmission route does not exist.',
          noindex: true,
        };
    }
  })();

  useSEO(seoConfig);

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
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden">
      {/* Interactive nodes system background */}
      <InnovationNetwork />

      {/* Header navigation bar */}
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* Dynamic page main content with Suspense code splitting */}
      <main className="flex-grow">
        <Suspense fallback={<PageLoadingFallback />}>
          {renderPage()}
        </Suspense>
      </main>

      {/* Consolidated footer */}
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <DatabaseProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </DatabaseProvider>
  );
};

export default App;
