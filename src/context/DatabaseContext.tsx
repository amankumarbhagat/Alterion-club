import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  Member, Division, Event, Project, Achievement, Announcement, Partner, GalleryItem,
  Application, ContactMessage, FacultyCoordinator, HomeStats
} from '../data/seedData';
import {
  initialFaculty, initialStats, initialMembers, initialDivisions, initialEvents,
  initialProjects, initialAchievements, initialAnnouncements, initialPartners, initialGallery
} from '../data/seedData';
import * as publicApi from '../services/publicApi';
import * as adminApi from '../services/adminApi';

const IS_API_MODE = import.meta.env.VITE_DATA_SOURCE === 'api';

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
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;

  // CRUD ops
  addMember: (member: Omit<Member, 'id'>) => Promise<void> | void;
  updateMember: (id: string, member: Partial<Member>) => Promise<void> | void;
  deleteMember: (id: string) => Promise<void> | void;

  addDivision: (division: Omit<Division, 'id'>) => Promise<void> | void;
  updateDivision: (id: string, division: Partial<Division>) => Promise<void> | void;
  deleteDivision: (id: string) => Promise<void> | void;

  addEvent: (event: Omit<Event, 'id'>) => Promise<void> | void;
  updateEvent: (id: string, event: Partial<Event>) => Promise<void> | void;
  deleteEvent: (id: string) => Promise<void> | void;

  addProject: (project: Omit<Project, 'id'>) => Promise<void> | void;
  updateProject: (id: string, project: Partial<Project>) => Promise<void> | void;
  deleteProject: (id: string) => Promise<void> | void;

  addAchievement: (achievement: Omit<Achievement, 'id'>) => Promise<void> | void;
  updateAchievement: (id: string, achievement: Partial<Achievement>) => Promise<void> | void;
  deleteAchievement: (id: string) => Promise<void> | void;

  addAnnouncement: (announcement: Omit<Announcement, 'id'>) => Promise<void> | void;
  updateAnnouncement: (id: string, announcement: Partial<Announcement>) => Promise<void> | void;
  deleteAnnouncement: (id: string) => Promise<void> | void;

  addPartner: (partner: Omit<Partner, 'id'>) => Promise<void> | void;
  updatePartner: (id: string, partner: Partial<Partner>) => Promise<void> | void;
  deletePartner: (id: string) => Promise<void> | void;

  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => Promise<void> | void;
  updateGalleryItem: (id: string, item: Partial<GalleryItem>) => Promise<void> | void;
  deleteGalleryItem: (id: string) => Promise<void> | void;

  submitApplication: (app: Omit<Application, 'id' | 'status' | 'submittedAt'>) => Promise<void> | void;
  updateApplicationStatus: (id: string, status: Application['status']) => Promise<void> | void;
  deleteApplication: (id: string) => Promise<void> | void;

  submitContactMessage: (msg: Omit<ContactMessage, 'id' | 'read' | 'submittedAt'>) => Promise<void> | void;
  markContactMessageRead: (id: string, read: boolean) => Promise<void> | void;
  deleteContactMessage: (id: string) => Promise<void> | void;

  updateFaculty: (fac: FacultyCoordinator) => Promise<void> | void;
  updateStats: (st: HomeStats) => Promise<void> | void;

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
    if (!IS_API_MODE) {
      localStorage.setItem(`alterino_${key}`, JSON.stringify(val));
    }
  };

  const [members, setMembers] = useState<Member[]>(() => IS_API_MODE ? [] : getLocal('members', initialMembers));
  const [divisions, setDivisions] = useState<Division[]>(() => IS_API_MODE ? [] : getLocal('divisions', initialDivisions));
  const [events, setEvents] = useState<Event[]>(() => IS_API_MODE ? [] : getLocal('events', initialEvents));
  const [projects, setProjects] = useState<Project[]>(() => IS_API_MODE ? [] : getLocal('projects', initialProjects));
  const [achievements, setAchievements] = useState<Achievement[]>(() => IS_API_MODE ? [] : getLocal('achievements', initialAchievements));
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => IS_API_MODE ? [] : getLocal('announcements', initialAnnouncements));
  const [partners, setPartners] = useState<Partner[]>(() => IS_API_MODE ? [] : getLocal('partners', initialPartners));
  const [gallery, setGallery] = useState<GalleryItem[]>(() => IS_API_MODE ? [] : getLocal('gallery', initialGallery));
  const [applications, setApplications] = useState<Application[]>(() => IS_API_MODE ? [] : getLocal('applications', []));
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => IS_API_MODE ? [] : getLocal('contactMessages', []));
  const [faculty, setFaculty] = useState<FacultyCoordinator>(() => IS_API_MODE ? initialFaculty : getLocal('faculty', initialFaculty));
  const [stats, setStats] = useState<HomeStats>(() => IS_API_MODE ? initialStats : getLocal('stats', initialStats));

  const [loading, setLoading] = useState<boolean>(IS_API_MODE);
  const [error, setError] = useState<string | null>(null);

  // Sync to local storage only in local mode
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

  const loadApiData = useCallback(async () => {
    if (!IS_API_MODE) return;
    setLoading(true);
    setError(null);
    try {
      const [
        fetchedMembers,
        fetchedDivisions,
        fetchedEvents,
        fetchedProjects,
        fetchedAchievements,
        fetchedAnnouncements,
        fetchedPartners,
        fetchedGallery,
        fetchedFaculty,
        fetchedStats,
      ] = await Promise.allSettled([
        publicApi.fetchMembers(),
        publicApi.fetchDivisions(),
        publicApi.fetchEvents(),
        publicApi.fetchProjects(),
        publicApi.fetchAchievements(),
        publicApi.fetchAnnouncements(),
        publicApi.fetchPartners(),
        publicApi.fetchGallery(),
        publicApi.fetchFaculty(),
        publicApi.fetchSiteStats(),
      ]);

      if (fetchedMembers.status === 'fulfilled') setMembers(fetchedMembers.value);
      if (fetchedDivisions.status === 'fulfilled') setDivisions(fetchedDivisions.value);
      if (fetchedEvents.status === 'fulfilled') setEvents(fetchedEvents.value);
      if (fetchedProjects.status === 'fulfilled') setProjects(fetchedProjects.value);
      if (fetchedAchievements.status === 'fulfilled') setAchievements(fetchedAchievements.value);
      if (fetchedAnnouncements.status === 'fulfilled') setAnnouncements(fetchedAnnouncements.value);
      if (fetchedPartners.status === 'fulfilled') setPartners(fetchedPartners.value);
      if (fetchedGallery.status === 'fulfilled') setGallery(fetchedGallery.value);
      if (fetchedFaculty.status === 'fulfilled') setFaculty(fetchedFaculty.value);
      if (fetchedStats.status === 'fulfilled') setStats(fetchedStats.value);

      // Admin data (optional, fetch if logged in)
      try {
        const [apps, msgs] = await Promise.all([
          adminApi.adminGetApplications(),
          adminApi.adminGetContactMessages(),
        ]);
        setApplications(apps);
        setContactMessages(msgs);
      } catch {
        // Safe to ignore if not admin
      }
    } catch (err: any) {
      console.error('Failed to load API data:', err);
      setError(err.message || 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (IS_API_MODE) {
      loadApiData();
    }
  }, [loadApiData]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Members CRUD
  const addMember = async (m: Omit<Member, 'id'>) => {
    if (IS_API_MODE) {
      try {
        const created = await adminApi.adminCreateMember(m as Member);
        setMembers(prev => [...prev, created]);
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    } else {
      setMembers(prev => [...prev, { ...m, id: generateId() }]);
    }
  };

  const updateMember = async (id: string, m: Partial<Member>) => {
    if (IS_API_MODE) {
      try {
        const updated = await adminApi.adminUpdateMember(id, m);
        setMembers(prev => prev.map(item => item.id === id ? updated : item));
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    } else {
      setMembers(prev => prev.map(item => item.id === id ? { ...item, ...m } : item));
    }
  };

  const deleteMember = async (id: string) => {
    if (IS_API_MODE) {
      try {
        await adminApi.adminDeleteMember(id);
        setMembers(prev => prev.filter(item => item.id !== id));
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    } else {
      setMembers(prev => prev.filter(item => item.id !== id));
    }
  };

  // Divisions CRUD
  const addDivision = async (d: Omit<Division, 'id'>) => {
    if (IS_API_MODE) {
      try {
        const created = await adminApi.adminCreateDivision(d as Division);
        setDivisions(prev => [...prev, created]);
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    } else {
      setDivisions(prev => [...prev, { ...d, id: generateId() }]);
    }
  };

  const updateDivision = async (id: string, d: Partial<Division>) => {
    if (IS_API_MODE) {
      try {
        const updated = await adminApi.adminUpdateDivision(id, d);
        setDivisions(prev => prev.map(item => item.id === id ? updated : item));
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    } else {
      setDivisions(prev => prev.map(item => item.id === id ? { ...item, ...d } : item));
    }
  };

  const deleteDivision = async (id: string) => {
    if (IS_API_MODE) {
      try {
        await adminApi.adminDeleteDivision(id);
        setDivisions(prev => prev.filter(item => item.id !== id));
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    } else {
      setDivisions(prev => prev.filter(item => item.id !== id));
    }
  };

  // Events CRUD
  const addEvent = async (e: Omit<Event, 'id'>) => {
    if (IS_API_MODE) {
      try {
        const created = await adminApi.adminCreateEvent(e as Event);
        setEvents(prev => [...prev, created]);
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    } else {
      setEvents(prev => [...prev, { ...e, id: generateId() }]);
    }
  };

  const updateEvent = async (id: string, e: Partial<Event>) => {
    if (IS_API_MODE) {
      try {
        const updated = await adminApi.adminUpdateEvent(id, e);
        setEvents(prev => prev.map(item => item.id === id ? updated : item));
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    } else {
      setEvents(prev => prev.map(item => item.id === id ? { ...item, ...e } : item));
    }
  };

  const deleteEvent = async (id: string) => {
    if (IS_API_MODE) {
      try {
        await adminApi.adminDeleteEvent(id);
        setEvents(prev => prev.filter(item => item.id !== id));
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    } else {
      setEvents(prev => prev.filter(item => item.id !== id));
    }
  };

  // Projects CRUD
  const addProject = async (p: Omit<Project, 'id'>) => {
    if (IS_API_MODE) {
      try {
        const created = await adminApi.adminCreateProject(p as Project);
        setProjects(prev => [...prev, created]);
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    } else {
      setProjects(prev => [...prev, { ...p, id: generateId() }]);
    }
  };

  const updateProject = async (id: string, p: Partial<Project>) => {
    if (IS_API_MODE) {
      try {
        const updated = await adminApi.adminUpdateProject(id, p);
        setProjects(prev => prev.map(item => item.id === id ? updated : item));
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    } else {
      setProjects(prev => prev.map(item => item.id === id ? { ...item, ...p } : item));
    }
  };

  const deleteProject = async (id: string) => {
    if (IS_API_MODE) {
      try {
        await adminApi.adminDeleteProject(id);
        setProjects(prev => prev.filter(item => item.id !== id));
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    } else {
      setProjects(prev => prev.filter(item => item.id !== id));
    }
  };

  // Achievements CRUD
  const addAchievement = async (ac: Omit<Achievement, 'id'>) => {
    if (IS_API_MODE) {
      try {
        const created = await adminApi.adminCreateAchievement(ac as Achievement);
        setAchievements(prev => [...prev, created]);
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    } else {
      setAchievements(prev => [...prev, { ...ac, id: generateId() }]);
    }
  };

  const updateAchievement = async (id: string, ac: Partial<Achievement>) => {
    if (IS_API_MODE) {
      try {
        const updated = await adminApi.adminUpdateAchievement(id, ac);
        setAchievements(prev => prev.map(item => item.id === id ? updated : item));
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    } else {
      setAchievements(prev => prev.map(item => item.id === id ? { ...item, ...ac } : item));
    }
  };

  const deleteAchievement = async (id: string) => {
    if (IS_API_MODE) {
      try {
        await adminApi.adminDeleteAchievement(id);
        setAchievements(prev => prev.filter(item => item.id !== id));
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    } else {
      setAchievements(prev => prev.filter(item => item.id !== id));
    }
  };

  // Announcements CRUD
  const addAnnouncement = async (an: Omit<Announcement, 'id'>) => {
    if (IS_API_MODE) {
      try {
        const created = await adminApi.adminCreateAnnouncement(an as Announcement);
        setAnnouncements(prev => [...prev, created]);
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    } else {
      setAnnouncements(prev => [...prev, { ...an, id: generateId() }]);
    }
  };

  const updateAnnouncement = async (id: string, an: Partial<Announcement>) => {
    if (IS_API_MODE) {
      try {
        const updated = await adminApi.adminUpdateAnnouncement(id, an);
        setAnnouncements(prev => prev.map(item => item.id === id ? updated : item));
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    } else {
      setAnnouncements(prev => prev.map(item => item.id === id ? { ...item, ...an } : item));
    }
  };

  const deleteAnnouncement = async (id: string) => {
    if (IS_API_MODE) {
      try {
        await adminApi.adminDeleteAnnouncement(id);
        setAnnouncements(prev => prev.filter(item => item.id !== id));
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    } else {
      setAnnouncements(prev => prev.filter(item => item.id !== id));
    }
  };

  // Partners CRUD
  const addPartner = async (pt: Omit<Partner, 'id'>) => {
    if (IS_API_MODE) {
      try {
        const created = await adminApi.adminCreatePartner(pt as Partner);
        setPartners(prev => [...prev, created]);
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    } else {
      setPartners(prev => [...prev, { ...pt, id: generateId() }]);
    }
  };

  const updatePartner = async (id: string, pt: Partial<Partner>) => {
    if (IS_API_MODE) {
      try {
        const updated = await adminApi.adminUpdatePartner(id, pt);
        setPartners(prev => prev.map(item => item.id === id ? updated : item));
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    } else {
      setPartners(prev => prev.map(item => item.id === id ? { ...item, ...pt } : item));
    }
  };

  const deletePartner = async (id: string) => {
    if (IS_API_MODE) {
      try {
        await adminApi.adminDeletePartner(id);
        setPartners(prev => prev.filter(item => item.id !== id));
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    } else {
      setPartners(prev => prev.filter(item => item.id !== id));
    }
  };

  // Gallery CRUD
  const addGalleryItem = async (g: Omit<GalleryItem, 'id'>) => {
    if (IS_API_MODE) {
      try {
        const created = await adminApi.adminCreateGallery(g as GalleryItem);
        setGallery(prev => [...prev, created]);
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    } else {
      setGallery(prev => [...prev, { ...g, id: generateId() }]);
    }
  };

  const updateGalleryItem = async (id: string, g: Partial<GalleryItem>) => {
    if (IS_API_MODE) {
      try {
        const updated = await adminApi.adminUpdateGallery(id, g);
        setGallery(prev => prev.map(item => item.id === id ? updated : item));
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    } else {
      setGallery(prev => prev.map(item => item.id === id ? { ...item, ...g } : item));
    }
  };

  const deleteGalleryItem = async (id: string) => {
    if (IS_API_MODE) {
      try {
        await adminApi.adminDeleteGallery(id);
        setGallery(prev => prev.filter(item => item.id !== id));
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    } else {
      setGallery(prev => prev.filter(item => item.id !== id));
    }
  };

  // Applications
  const submitApplication = async (app: Omit<Application, 'id' | 'status' | 'submittedAt'>) => {
    if (IS_API_MODE) {
      try {
        const created = await publicApi.submitApplication(app);
        setApplications(prev => [...prev, created]);
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    } else {
      const newApp: Application = {
        ...app,
        id: generateId(),
        status: 'pending',
        submittedAt: new Date().toISOString().split('T')[0]
      };
      setApplications(prev => [...prev, newApp]);
    }
  };

  const updateApplicationStatus = async (id: string, status: Application['status']) => {
    if (IS_API_MODE) {
      try {
        const updated = await adminApi.adminUpdateApplicationStatus(id, status);
        setApplications(prev => prev.map(item => item.id === id ? updated : item));
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    } else {
      setApplications(prev => prev.map(item => item.id === id ? { ...item, status } : item));
    }
  };

  const deleteApplication = async (id: string) => {
    if (IS_API_MODE) {
      try {
        await adminApi.adminDeleteApplication(id);
        setApplications(prev => prev.filter(item => item.id !== id));
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    } else {
      setApplications(prev => prev.filter(item => item.id !== id));
    }
  };

  // Contact Messages
  const submitContactMessage = async (msg: Omit<ContactMessage, 'id' | 'read' | 'submittedAt'>) => {
    if (IS_API_MODE) {
      try {
        const created = await publicApi.submitContactMessage(msg);
        setContactMessages(prev => [...prev, created]);
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    } else {
      const newMsg: ContactMessage = {
        ...msg,
        id: generateId(),
        read: false,
        submittedAt: new Date().toISOString().split('T')[0]
      };
      setContactMessages(prev => [...prev, newMsg]);
    }
  };

  const markContactMessageRead = async (id: string, read: boolean) => {
    if (IS_API_MODE) {
      try {
        const updated = await adminApi.adminMarkContactRead(id, read);
        setContactMessages(prev => prev.map(item => item.id === id ? updated : item));
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    } else {
      setContactMessages(prev => prev.map(item => item.id === id ? { ...item, read } : item));
    }
  };

  const deleteContactMessage = async (id: string) => {
    if (IS_API_MODE) {
      try {
        await adminApi.adminDeleteContactMessage(id);
        setContactMessages(prev => prev.filter(item => item.id !== id));
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    } else {
      setContactMessages(prev => prev.filter(item => item.id !== id));
    }
  };

  // Faculty and Stats
  const updateFaculty = async (fac: FacultyCoordinator) => {
    if (IS_API_MODE) {
      try {
        const updated = await adminApi.adminUpdateFaculty(fac);
        setFaculty(updated);
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    } else {
      setFaculty(fac);
    }
  };

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
      loading, error, refreshData: loadApiData,
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
