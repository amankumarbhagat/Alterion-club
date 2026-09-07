import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  Member, Division, Event, Project, Achievement, Announcement, Partner, GalleryItem,
  Application, ContactMessage, FacultyCoordinator, HomeStats
} from '../data/seedData';
import {
  initialFaculty, initialStats, initialMembers, initialDivisions, initialEvents,
  initialProjects, initialAchievements, initialAnnouncements, initialPartners, initialGallery
} from '../data/seedData';

interface DatabaseContextType {
  members: Member[];
  divisions: Division[];
  events: Event[];
  projects: Project[];
  achievements: Achievement[];
  announcements: Announcement[];
  partners: Partner[];
  gallery: GalleryItem[];
  applications: Application[];
  contactMessages: ContactMessage[];
  faculty: FacultyCoordinator;
  stats: HomeStats;

  // CRUD ops
  addMember: (member: Omit<Member, 'id'>) => void;
  updateMember: (id: string, member: Partial<Member>) => void;
  deleteMember: (id: string) => void;

  addDivision: (division: Omit<Division, 'id'>) => void;
  updateDivision: (id: string, division: Partial<Division>) => void;
  deleteDivision: (id: string) => void;

  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;

  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  addAchievement: (achievement: Omit<Achievement, 'id'>) => void;
  updateAchievement: (id: string, achievement: Partial<Achievement>) => void;
  deleteAchievement: (id: string) => void;

  addAnnouncement: (announcement: Omit<Announcement, 'id'>) => void;
  updateAnnouncement: (id: string, announcement: Partial<Announcement>) => void;
  deleteAnnouncement: (id: string) => void;

  addPartner: (partner: Omit<Partner, 'id'>) => void;
  updatePartner: (id: string, partner: Partial<Partner>) => void;
  deletePartner: (id: string) => void;

  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
  updateGalleryItem: (id: string, item: Partial<GalleryItem>) => void;
  deleteGalleryItem: (id: string) => void;

  submitApplication: (app: Omit<Application, 'id' | 'status' | 'submittedAt'>) => void;
  updateApplicationStatus: (id: string, status: Application['status']) => void;
  deleteApplication: (id: string) => void;

  submitContactMessage: (msg: Omit<ContactMessage, 'id' | 'read' | 'submittedAt'>) => void;
  markContactMessageRead: (id: string, read: boolean) => void;
  deleteContactMessage: (id: string) => void;

  updateFaculty: (fac: FacultyCoordinator) => void;
  updateStats: (st: HomeStats) => void;

  importDatabase: (jsonString: string) => boolean;
  exportDatabase: () => string;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) throw new Error('useDatabase must be used within a DatabaseProvider');
  return context;
};

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getLocal = <T,>(key: string, fallback: T): T => {
    try {
      const data = localStorage.getItem(`alterino_${key}`);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  };

  const setLocal = <T,>(key: string, val: T) => {
    localStorage.setItem(`alterino_${key}`, JSON.stringify(val));
  };

  const [members, setMembers] = useState<Member[]>(() => getLocal('members', initialMembers));
  const [divisions, setDivisions] = useState<Division[]>(() => getLocal('divisions', initialDivisions));
  const [events, setEvents] = useState<Event[]>(() => getLocal('events', initialEvents));
  const [projects, setProjects] = useState<Project[]>(() => getLocal('projects', initialProjects));
  const [achievements, setAchievements] = useState<Achievement[]>(() => getLocal('achievements', initialAchievements));
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => getLocal('announcements', initialAnnouncements));
  const [partners, setPartners] = useState<Partner[]>(() => getLocal('partners', initialPartners));
  const [gallery, setGallery] = useState<GalleryItem[]>(() => getLocal('gallery', initialGallery));
  const [applications, setApplications] = useState<Application[]>(() => getLocal('applications', []));
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => getLocal('contactMessages', []));
  const [faculty, setFaculty] = useState<FacultyCoordinator>(() => getLocal('faculty', initialFaculty));
  const [stats, setStats] = useState<HomeStats>(() => getLocal('stats', initialStats));

  useEffect(() => { setLocal('members', members); }, [members]);
  useEffect(() => { setLocal('divisions', divisions); }, [divisions]);
  useEffect(() => { setLocal('events', events); }, [events]);
  useEffect(() => { setLocal('projects', projects); }, [projects]);
  useEffect(() => { setLocal('achievements', achievements); }, [achievements]);
  useEffect(() => { setLocal('announcements', announcements); }, [announcements]);
  useEffect(() => { setLocal('partners', partners); }, [partners]);
  useEffect(() => { setLocal('gallery', gallery); }, [gallery]);
  useEffect(() => { setLocal('applications', applications); }, [applications]);
  useEffect(() => { setLocal('contactMessages', contactMessages); }, [contactMessages]);
  useEffect(() => { setLocal('faculty', faculty); }, [faculty]);
  useEffect(() => { setLocal('stats', stats); }, [stats]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Members CRUD
  const addMember = (m: Omit<Member, 'id'>) => {
    setMembers(prev => [...prev, { ...m, id: generateId() }]);
  };
  const updateMember = (id: string, m: Partial<Member>) => {
    setMembers(prev => prev.map(item => item.id === id ? { ...item, ...m } : item));
  };
  const deleteMember = (id: string) => {
    setMembers(prev => prev.filter(item => item.id !== id));
  };

  // Divisions CRUD
  const addDivision = (d: Omit<Division, 'id'>) => {
    setDivisions(prev => [...prev, { ...d, id: generateId() }]);
  };
  const updateDivision = (id: string, d: Partial<Division>) => {
    setDivisions(prev => prev.map(item => item.id === id ? { ...item, ...d } : item));
  };
  const deleteDivision = (id: string) => {
    setDivisions(prev => prev.filter(item => item.id !== id));
  };

  // Events CRUD
  const addEvent = (e: Omit<Event, 'id'>) => {
    setEvents(prev => [...prev, { ...e, id: generateId() }]);
  };
  const updateEvent = (id: string, e: Partial<Event>) => {
    setEvents(prev => prev.map(item => item.id === id ? { ...item, ...e } : item));
  };
  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(item => item.id !== id));
  };

  // Projects CRUD
  const addProject = (p: Omit<Project, 'id'>) => {
    setProjects(prev => [...prev, { ...p, id: generateId() }]);
  };
  const updateProject = (id: string, p: Partial<Project>) => {
    setProjects(prev => prev.map(item => item.id === id ? { ...item, ...p } : item));
  };
  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(item => item.id !== id));
  };

  // Achievements CRUD
  const addAchievement = (ac: Omit<Achievement, 'id'>) => {
    setAchievements(prev => [...prev, { ...ac, id: generateId() }]);
  };
  const updateAchievement = (id: string, ac: Partial<Achievement>) => {
    setAchievements(prev => prev.map(item => item.id === id ? { ...item, ...ac } : item));
  };
  const deleteAchievement = (id: string) => {
    setAchievements(prev => prev.filter(item => item.id !== id));
  };

  // Announcements CRUD
  const addAnnouncement = (an: Omit<Announcement, 'id'>) => {
    setAnnouncements(prev => [...prev, { ...an, id: generateId() }]);
  };
  const updateAnnouncement = (id: string, an: Partial<Announcement>) => {
    setAnnouncements(prev => prev.map(item => item.id === id ? { ...item, ...an } : item));
  };
  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(item => item.id !== id));
  };

  // Partners CRUD
  const addPartner = (pt: Omit<Partner, 'id'>) => {
    setPartners(prev => [...prev, { ...pt, id: generateId() }]);
  };
  const updatePartner = (id: string, pt: Partial<Partner>) => {
    setPartners(prev => prev.map(item => item.id === id ? { ...item, ...pt } : item));
  };
  const deletePartner = (id: string) => {
    setPartners(prev => prev.filter(item => item.id !== id));
  };

  // Gallery CRUD
  const addGalleryItem = (g: Omit<GalleryItem, 'id'>) => {
    setGallery(prev => [...prev, { ...g, id: generateId() }]);
  };
  const updateGalleryItem = (id: string, g: Partial<GalleryItem>) => {
    setGallery(prev => prev.map(item => item.id === id ? { ...item, ...g } : item));
  };
  const deleteGalleryItem = (id: string) => {
    setGallery(prev => prev.filter(item => item.id !== id));
  };

  // Applications
  const submitApplication = (app: Omit<Application, 'id' | 'status' | 'submittedAt'>) => {
    const newApp: Application = {
      ...app,
      id: generateId(),
      status: 'pending',
      submittedAt: new Date().toISOString().split('T')[0]
    };
    setApplications(prev => [...prev, newApp]);
  };
  const updateApplicationStatus = (id: string, status: Application['status']) => {
    setApplications(prev => prev.map(item => item.id === id ? { ...item, status } : item));
  };
  const deleteApplication = (id: string) => {
    setApplications(prev => prev.filter(item => item.id !== id));
  };

  // Contact Messages
  const submitContactMessage = (msg: Omit<ContactMessage, 'id' | 'read' | 'submittedAt'>) => {
    const newMsg: ContactMessage = {
      ...msg,
      id: generateId(),
      read: false,
      submittedAt: new Date().toISOString().split('T')[0]
    };
    setContactMessages(prev => [...prev, newMsg]);
  };
  const markContactMessageRead = (id: string, read: boolean) => {
    setContactMessages(prev => prev.map(item => item.id === id ? { ...item, read } : item));
  };
  const deleteContactMessage = (id: string) => {
    setContactMessages(prev => prev.filter(item => item.id !== id));
  };

  // Faculty and Stats
  const updateFaculty = (fac: FacultyCoordinator) => setFaculty(fac);
  const updateStats = (st: HomeStats) => setStats(st);

  // Import/Export
  const exportDatabase = () => {
    const db = {
      members,
      divisions,
      events,
      projects,
      achievements,
      announcements,
      partners,
      gallery,
      applications,
      contactMessages,
      faculty,
      stats
    };
    return JSON.stringify(db, null, 2);
  };

  const importDatabase = (jsonString: string): boolean => {
    try {
      const db = JSON.parse(jsonString);
      if (db.members) setMembers(db.members);
      if (db.divisions) setDivisions(db.divisions);
      if (db.events) setEvents(db.events);
      if (db.projects) setProjects(db.projects);
      if (db.achievements) setAchievements(db.achievements);
      if (db.announcements) setAnnouncements(db.announcements);
      if (db.partners) setPartners(db.partners);
      if (db.gallery) setGallery(db.gallery);
      if (db.applications) setApplications(db.applications);
      if (db.contactMessages) setContactMessages(db.contactMessages);
      if (db.faculty) setFaculty(db.faculty);
      if (db.stats) setStats(db.stats);
      return true;
    } catch (e) {
      console.error("Import failed", e);
      return false;
    }
  };

  return (
    <DatabaseContext.Provider value={{
      members, divisions, events, projects, achievements, announcements, partners, gallery, applications, contactMessages, faculty, stats,
      addMember, updateMember, deleteMember,
      addDivision, updateDivision, deleteDivision,
      addEvent, updateEvent, deleteEvent,
      addProject, updateProject, deleteProject,
      addAchievement, updateAchievement, deleteAchievement,
      addAnnouncement, updateAnnouncement, deleteAnnouncement,
      addPartner, updatePartner, deletePartner,
      addGalleryItem, updateGalleryItem, deleteGalleryItem,
      submitApplication, updateApplicationStatus, deleteApplication,
      submitContactMessage, markContactMessageRead, deleteContactMessage,
      updateFaculty, updateStats,
      exportDatabase, importDatabase
    }}>
      {children}
    </DatabaseContext.Provider>
  );
};
