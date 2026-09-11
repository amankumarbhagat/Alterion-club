import React, { useState, useEffect } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { useAuth } from '../context/AuthContext';
import {
  ShieldAlert,
  ShieldCheck,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Download,
  Upload,
  X,
  Mail,
  MessageSquare,
  Layers,
  CheckCircle2,
  Eye,
  EyeOff,
  RefreshCw,
  AlertTriangle,
  ExternalLink,
  Users,
  Calendar,
  FolderGit2,
  Award,
  Bell,
  Image,
  Handshake,
  Check,
  UserCheck
} from 'lucide-react';
import type {
  Member,
  Division,
  Event,
  Project,
  Announcement,
  Partner,
  GalleryItem,
  Achievement,
  FacultyCoordinator,
  HomeStats,
  Application
} from '../data/seedData';

type ActiveTab =
  | 'dashboard'
  | 'members'
  | 'divisions'
  | 'events'
  | 'projects'
  | 'gallery'
  | 'announcements'
  | 'achievements'
  | 'partners'
  | 'applications'
  | 'messages'
  | 'settings';

export const AdminDashboard: React.FC = () => {
  const db = useDatabase();
  const auth = useAuth();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Tab navigation
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Notification banners
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Modal / Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editId, setEditId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Custom states for JSON Import/Export
  const [importJson, setImportJson] = useState('');
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Filter states
  const [appFilter, setAppFilter] = useState<'all' | 'pending' | 'reviewed' | 'accepted' | 'rejected'>('all');
  const [msgFilter, setMsgFilter] = useState<'all' | 'unread' | 'read'>('all');

  // Shared form inputs
  const [memberForm, setMemberForm] = useState<Omit<Member, 'id'>>({
    name: '',
    role: '',
    division: 'App Dev',
    email: '',
    github: '',
    linkedin: '',
    image: '',
    bio: '',
    skills: [],
    isLeadership: false
  });
  const [memberSkillsStr, setMemberSkillsStr] = useState('');

  const [divisionForm, setDivisionForm] = useState<Omit<Division, 'id'>>({
    name: '',
    description: '',
    leadId: '',
    responsibilities: [],
    skills: [],
    tools: [],
    ongoingWork: '',
    iconName: 'Code'
  });
  const [divRespStr, setDivRespStr] = useState('');
  const [divSkillsStr, setDivSkillsStr] = useState('');
  const [divToolsStr, setDivToolsStr] = useState('');

  const [eventForm, setEventForm] = useState<Omit<Event, 'id'>>({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    coordinator: '',
    image: '',
    status: 'upcoming',
    registrationLink: ''
  });

  const [projectForm, setProjectForm] = useState<Omit<Project, 'id'>>({
    title: '',
    problem: '',
    solution: '',
    description: '',
    image: '',
    tags: [],
    teamIds: [],
    mentor: '',
    progress: 0,
    github: '',
    demo: '',
    status: 'active'
  });
  const [projectTagsStr, setProjectTagsStr] = useState('');

  const [announcementForm, setAnnouncementForm] = useState<Omit<Announcement, 'id'>>({
    title: '',
    date: '',
    content: '',
    category: 'general',
    active: true
  });

  const [galleryForm, setGalleryForm] = useState<Omit<GalleryItem, 'id'>>({
    image: '',
    caption: '',
    category: 'events'
  });

  const [achievementForm, setAchievementForm] = useState<Omit<Achievement, 'id'>>({
    title: '',
    date: '',
    description: '',
    image: '',
    badge: ''
  });

  const [partnerForm, setPartnerForm] = useState<Omit<Partner, 'id'>>({
    name: '',
    logo: '',
    type: 'Technology Sponsor',
    description: '',
    website: ''
  });

  // Settings: Faculty Coordinator form state
  const [facultyForm, setFacultyForm] = useState<FacultyCoordinator>(db.faculty);
  const [facultyStatus, setFacultyStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Settings: Site Stats form state
  const [statsForm, setStatsForm] = useState<HomeStats>(db.stats);
  const [statsStatus, setStatsStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Sync settings forms when db state updates
  useEffect(() => {
    if (db.faculty) setFacultyForm(db.faculty);
  }, [db.faculty]);

  useEffect(() => {
    if (db.stats) setStatsForm(db.stats);
  }, [db.stats]);

  const showFeedback = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      await auth.login({ username, password });
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed: Invalid credentials.');
    }
  };

  const handleLogout = async () => {
    await auth.logout();
    setPassword('');
  };

  const handleExport = () => {
    const dataStr = db.exportDatabase();
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `alterino_db_export_${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    showFeedback('Database exported successfully.');
  };

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    const success = db.importDatabase(importJson);
    if (success) {
      setImportStatus('success');
      setImportJson('');
      showFeedback('Database imported successfully.');
    } else {
      setImportStatus('error');
    }
  };

  const handleSaveFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await db.updateFaculty(facultyForm);
      setFacultyStatus('success');
      showFeedback('Faculty Coordinator profile updated successfully.');
      setTimeout(() => setFacultyStatus('idle'), 3000);
    } catch {
      setFacultyStatus('error');
    }
  };

  const handleSaveStats = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await db.updateStats(statsForm);
      setStatsStatus('success');
      showFeedback('Statistics counters updated successfully.');
      setTimeout(() => setStatsStatus('idle'), 3000);
    } catch {
      setStatsStatus('error');
    }
  };

  // CRUD Trigger helpers
  const openCreateModal = () => {
    setFormMode('create');
    setEditId(null);
    setIsFormOpen(true);

    if (activeTab === 'members') {
      setMemberForm({
        name: '',
        role: '',
        division: 'App Dev',
        email: '',
        github: '',
        linkedin: '',
        image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400',
        bio: '',
        skills: ['React', 'TypeScript'],
        isLeadership: false
      });
      setMemberSkillsStr('React, TypeScript');
    } else if (activeTab === 'divisions') {
      setDivisionForm({
        name: '',
        description: '',
        leadId: db.members[0]?.id || '',
        responsibilities: ['Architecting scalable interfaces and software.'],
        skills: ['React', 'Node.js'],
        tools: ['VS Code', 'GitHub'],
        ongoingWork: '',
        iconName: 'Code'
      });
      setDivRespStr('Architecting scalable interfaces and software.');
      setDivSkillsStr('React, Node.js');
      setDivToolsStr('VS Code, GitHub');
    } else if (activeTab === 'events') {
      setEventForm({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        time: '02:00 PM',
        venue: 'Main Seminar Hall, BMSIT&M',
        coordinator: '',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800',
        status: 'upcoming',
        registrationLink: '#'
      });
    } else if (activeTab === 'projects') {
      setProjectForm({
        title: '',
        problem: '',
        solution: '',
        description: '',
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800',
        tags: ['React', 'Node.js'],
        teamIds: [],
        mentor: 'Dr. Rajeshwari M.',
        progress: 10,
        github: '#',
        demo: '#',
        status: 'active'
      });
      setProjectTagsStr('React, Node.js');
    } else if (activeTab === 'announcements') {
      setAnnouncementForm({
        title: '',
        date: new Date().toISOString().split('T')[0],
        content: '',
        category: 'general',
        active: true
      });
    } else if (activeTab === 'gallery') {
      setGalleryForm({
        image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800',
        caption: '',
        category: 'events'
      });
    } else if (activeTab === 'achievements') {
      setAchievementForm({
        title: '',
        date: new Date().toISOString().slice(0, 7),
        description: '',
        image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&q=80&w=600',
        badge: 'Award Winner'
      });
    } else if (activeTab === 'partners') {
      setPartnerForm({
        name: '',
        logo: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&q=80&w=200',
        type: 'Technology Sponsor',
        description: '',
        website: 'https://github.com'
      });
    }
  };

  const openEditModal = (id: string) => {
    setFormMode('edit');
    setEditId(id);
    setIsFormOpen(true);

    if (activeTab === 'members') {
      const match = db.members.find(m => m.id === id);
      if (match) {
        setMemberForm({ ...match });
        setMemberSkillsStr(match.skills?.join(', ') || '');
      }
    } else if (activeTab === 'divisions') {
      const match = db.divisions.find(d => d.id === id);
      if (match) {
        setDivisionForm({ ...match });
        setDivRespStr(match.responsibilities?.join('\n') || '');
        setDivSkillsStr(match.skills?.join(', ') || '');
        setDivToolsStr(match.tools?.join(', ') || '');
      }
    } else if (activeTab === 'events') {
      const match = db.events.find(e => e.id === id);
      if (match) setEventForm({ ...match });
    } else if (activeTab === 'projects') {
      const match = db.projects.find(p => p.id === id);
      if (match) {
        setProjectForm({ ...match });
        setProjectTagsStr(match.tags?.join(', ') || '');
      }
    } else if (activeTab === 'announcements') {
      const match = db.announcements.find(an => an.id === id);
      if (match) setAnnouncementForm({ ...match });
    } else if (activeTab === 'gallery') {
      const match = db.gallery.find(g => g.id === id);
      if (match) setGalleryForm({ ...match });
    } else if (activeTab === 'achievements') {
      const match = db.achievements.find(ac => ac.id === id);
      if (match) setAchievementForm({ ...match });
    } else if (activeTab === 'partners') {
      const match = db.partners.find(pt => pt.id === id);
      if (match) setPartnerForm({ ...match });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (activeTab === 'members') {
        const skillsArray = memberSkillsStr
          .split(',')
          .map(s => s.trim())
          .filter(Boolean);
        const payload = { ...memberForm, skills: skillsArray };

        if (formMode === 'create') await db.addMember(payload);
        else if (editId) await db.updateMember(editId, payload);
        showFeedback(`Member ${formMode === 'create' ? 'created' : 'updated'} successfully.`);
      } else if (activeTab === 'divisions') {
        const respArray = divRespStr
          .split('\n')
          .map(s => s.trim())
          .filter(Boolean);
        const skillsArray = divSkillsStr
          .split(',')
          .map(s => s.trim())
          .filter(Boolean);
        const toolsArray = divToolsStr
          .split(',')
          .map(s => s.trim())
          .filter(Boolean);

        const payload = {
          ...divisionForm,
          responsibilities: respArray,
          skills: skillsArray,
          tools: toolsArray
        };

        if (formMode === 'create') await db.addDivision(payload);
        else if (editId) await db.updateDivision(editId, payload);
        showFeedback(`Division ${formMode === 'create' ? 'created' : 'updated'} successfully.`);
      } else if (activeTab === 'events') {
        if (formMode === 'create') await db.addEvent(eventForm);
        else if (editId) await db.updateEvent(editId, eventForm);
        showFeedback(`Event ${formMode === 'create' ? 'created' : 'updated'} successfully.`);
      } else if (activeTab === 'projects') {
        const tagsArray = projectTagsStr
          .split(',')
          .map(s => s.trim())
          .filter(Boolean);
        const payload = { ...projectForm, tags: tagsArray };

        if (formMode === 'create') await db.addProject(payload);
        else if (editId) await db.updateProject(editId, payload);
        showFeedback(`Project ${formMode === 'create' ? 'created' : 'updated'} successfully.`);
      } else if (activeTab === 'announcements') {
        if (formMode === 'create') await db.addAnnouncement(announcementForm);
        else if (editId) await db.updateAnnouncement(editId, announcementForm);
        showFeedback(`Announcement ${formMode === 'create' ? 'created' : 'updated'} successfully.`);
      } else if (activeTab === 'gallery') {
        if (formMode === 'create') await db.addGalleryItem(galleryForm);
        else if (editId) await db.updateGalleryItem(editId, galleryForm);
        showFeedback(`Gallery item ${formMode === 'create' ? 'created' : 'updated'} successfully.`);
      } else if (activeTab === 'achievements') {
        if (formMode === 'create') await db.addAchievement(achievementForm);
        else if (editId) await db.updateAchievement(editId, achievementForm);
        showFeedback(`Achievement ${formMode === 'create' ? 'created' : 'updated'} successfully.`);
      } else if (activeTab === 'partners') {
        if (formMode === 'create') await db.addPartner(partnerForm);
        else if (editId) await db.updatePartner(editId, partnerForm);
        showFeedback(`Partner ${formMode === 'create' ? 'created' : 'updated'} successfully.`);
      }

      setIsFormOpen(false);
    } catch (err: any) {
      alert(`Save failed: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteDivision = async (id: string) => {
    if (confirm('Are you sure you want to delete this division?')) {
      await db.deleteDivision(id);
      showFeedback('Division deleted successfully.');
    }
  };

  // LOCK SCREEN IF NOT AUTHENTICATED
  if (!auth.isAuthenticated) {
    return (
      <div className="min-h-screen pt-36 pb-16 flex items-center justify-center">
        <div className="max-w-md w-full glass-panel p-8 rounded-2xl border border-white/10 shadow-2xl text-left">
          <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
            <ShieldAlert size={20} className="text-[#00f0ff] animate-pulse" />
            <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              ALTERINO SECURITY ACCESS GATE
            </span>
          </div>

          <p className="font-sans text-xs text-slate-400 leading-relaxed mb-6">
            Input the security clearance credentials to access database CRUD parameters, recruitment reviews, and setting hooks.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="font-sans text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2 block">
                Username / Email
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Username or Email"
                className="w-full px-4 py-2.5 text-sm text-white glass-input rounded-lg font-mono placeholder-slate-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-sans text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2 block">
                Security Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Clearance Password"
                className="w-full px-4 py-2.5 text-sm text-white glass-input rounded-lg font-mono placeholder-slate-700 focus:outline-none"
              />
            </div>

            {authError && <span className="font-mono text-[10px] text-red-400 block">{authError}</span>}

            <button
              type="submit"
              disabled={auth.isLoading}
              className="w-full py-3 font-sans font-bold text-xs uppercase tracking-wider text-black bg-[#00f0ff] hover:bg-[#00e0ef] rounded-lg transition-all shadow-[0_0_12px_rgba(0,240,255,0.2)] disabled:opacity-50"
            >
              {auth.isLoading ? 'Verifying...' : 'Verify clearance key'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filtered applications
  const filteredApplications = db.applications.filter(app => {
    if (appFilter === 'all') return true;
    return app.status === appFilter;
  });

  // Filtered messages
  const filteredMessages = db.contactMessages.filter(msg => {
    if (msgFilter === 'all') return true;
    if (msgFilter === 'unread') return !msg.read;
    return msg.read;
  });

  const pendingAppsCount = db.applications.filter(a => a.status === 'pending').length;
  const unreadMessagesCount = db.contactMessages.filter(m => !m.read).length;

  return (
    <div className="min-h-screen pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-100 text-left">
      {/* Top Notification Toast */}
      {actionSuccess && (
        <div className="fixed top-20 right-8 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-500/90 text-black font-sans text-xs font-bold rounded-xl shadow-2xl backdrop-blur-md transition-all">
          <CheckCircle2 size={16} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Global Error Banner */}
      {db.error && (
        <div className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 font-sans text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-400 shrink-0" />
            <span>{db.error}</span>
          </div>
          <button
            onClick={() => db.refreshData()}
            className="flex items-center gap-1.5 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-200 transition-colors"
          >
            <RefreshCw size={12} /> Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Controls */}
        <div className="lg:col-span-3 glass-panel rounded-xl border border-white/5 p-4 space-y-2 sticky top-28">
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4 px-2">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-500" />
              <div>
                <span className="font-mono text-[10px] font-bold text-white uppercase tracking-wider block">
                  ADMIN CONTROL
                </span>
                <span className="font-mono text-[9px] text-slate-400 block truncate max-w-[140px]">
                  {auth.user?.name || auth.user?.username || 'Operator'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => db.refreshData()}
                className="p-1.5 text-slate-400 hover:text-[#00f0ff] rounded hover:bg-white/5 transition-colors"
                title="Refresh Database"
              >
                <RefreshCw size={14} className={db.loading ? 'animate-spin' : ''} />
              </button>
              <button
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-red-400 rounded hover:bg-white/5 transition-colors"
                title="Log Out"
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full text-left px-3 py-2 rounded-lg font-sans text-xs uppercase font-bold tracking-wider transition-colors flex items-center gap-2 ${
              activeTab === 'dashboard' ? 'bg-[#00f0ff]/10 text-[#00f0ff]' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <ShieldCheck size={14} />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('members')}
            className={`w-full text-left px-3 py-2 rounded-lg font-sans text-xs uppercase font-bold tracking-wider transition-colors flex items-center gap-2 ${
              activeTab === 'members' ? 'bg-[#00f0ff]/10 text-[#00f0ff]' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Users size={14} />
            <span>Members ({db.members.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('divisions')}
            className={`w-full text-left px-3 py-2 rounded-lg font-sans text-xs uppercase font-bold tracking-wider transition-colors flex items-center gap-2 ${
              activeTab === 'divisions' ? 'bg-[#00f0ff]/10 text-[#00f0ff]' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Layers size={14} />
            <span>Divisions ({db.divisions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`w-full text-left px-3 py-2 rounded-lg font-sans text-xs uppercase font-bold tracking-wider transition-colors flex items-center gap-2 ${
              activeTab === 'events' ? 'bg-[#00f0ff]/10 text-[#00f0ff]' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Calendar size={14} />
            <span>Events ({db.events.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`w-full text-left px-3 py-2 rounded-lg font-sans text-xs uppercase font-bold tracking-wider transition-colors flex items-center gap-2 ${
              activeTab === 'projects' ? 'bg-[#00f0ff]/10 text-[#00f0ff]' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <FolderGit2 size={14} />
            <span>Projects ({db.projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`w-full text-left px-3 py-2 rounded-lg font-sans text-xs uppercase font-bold tracking-wider transition-colors flex items-center gap-2 ${
              activeTab === 'gallery' ? 'bg-[#00f0ff]/10 text-[#00f0ff]' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Image size={14} />
            <span>Gallery ({db.gallery.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('announcements')}
            className={`w-full text-left px-3 py-2 rounded-lg font-sans text-xs uppercase font-bold tracking-wider transition-colors flex items-center gap-2 ${
              activeTab === 'announcements' ? 'bg-[#00f0ff]/10 text-[#00f0ff]' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Bell size={14} />
            <span>Announcements ({db.announcements.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('achievements')}
            className={`w-full text-left px-3 py-2 rounded-lg font-sans text-xs uppercase font-bold tracking-wider transition-colors flex items-center gap-2 ${
              activeTab === 'achievements' ? 'bg-[#00f0ff]/10 text-[#00f0ff]' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Award size={14} />
            <span>Achievements ({db.achievements.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('partners')}
            className={`w-full text-left px-3 py-2 rounded-lg font-sans text-xs uppercase font-bold tracking-wider transition-colors flex items-center gap-2 ${
              activeTab === 'partners' ? 'bg-[#00f0ff]/10 text-[#00f0ff]' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Handshake size={14} />
            <span>Partners ({db.partners.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('applications')}
            className={`w-full text-left px-3 py-2 rounded-lg font-sans text-xs uppercase font-bold tracking-wider transition-colors relative flex items-center justify-between ${
              activeTab === 'applications' ? 'bg-[#00f0ff]/10 text-[#00f0ff]' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Mail size={14} />
              <span>Applications ({db.applications.length})</span>
            </div>
            {pendingAppsCount > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded text-[9px] font-mono">
                {pendingAppsCount} new
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`w-full text-left px-3 py-2 rounded-lg font-sans text-xs uppercase font-bold tracking-wider transition-colors relative flex items-center justify-between ${
              activeTab === 'messages' ? 'bg-[#00f0ff]/10 text-[#00f0ff]' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <MessageSquare size={14} />
              <span>Messages ({db.contactMessages.length})</span>
            </div>
            {unreadMessagesCount > 0 && (
              <span className="px-1.5 py-0.2 bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30 rounded text-[9px] font-mono animate-pulse">
                {unreadMessagesCount} unread
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full text-left px-3 py-2 rounded-lg font-sans text-xs uppercase font-bold tracking-wider transition-colors ${
              activeTab === 'settings' ? 'bg-[#00f0ff]/10 text-[#00f0ff]' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            Settings
          </button>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-9 space-y-8">
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-sans font-extrabold text-2xl text-white">SYSTEM OVERVIEW</h2>
                  <p className="font-sans text-xs text-slate-400 mt-1">
                    Live telemetry across members, divisions, recruitment submissions, and inquiries.
                  </p>
                </div>
                <button
                  onClick={() => db.refreshData()}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-mono text-slate-300 transition-colors w-fit"
                >
                  <RefreshCw size={12} className={db.loading ? 'animate-spin' : ''} /> Sync Records
                </button>
              </div>

              {/* Grid counts */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <div
                  onClick={() => setActiveTab('members')}
                  className="glass-panel p-4 rounded-xl border border-white/5 hover:border-[#00f0ff]/30 cursor-pointer transition-all"
                >
                  <span className="font-sans font-extrabold text-2xl text-white block">{db.members.length}</span>
                  <span className="font-mono text-[9px] text-[#00f0ff] uppercase tracking-widest mt-1 inline-block">
                    Members
                  </span>
                </div>

                <div
                  onClick={() => setActiveTab('divisions')}
                  className="glass-panel p-4 rounded-xl border border-white/5 hover:border-[#00f0ff]/30 cursor-pointer transition-all"
                >
                  <span className="font-sans font-extrabold text-2xl text-white block">{db.divisions.length}</span>
                  <span className="font-mono text-[9px] text-purple-400 uppercase tracking-widest mt-1 inline-block">
                    Divisions
                  </span>
                </div>

                <div
                  onClick={() => setActiveTab('projects')}
                  className="glass-panel p-4 rounded-xl border border-white/5 hover:border-[#00f0ff]/30 cursor-pointer transition-all"
                >
                  <span className="font-sans font-extrabold text-2xl text-white block">{db.projects.length}</span>
                  <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest mt-1 inline-block">
                    Projects
                  </span>
                </div>

                <div
                  onClick={() => setActiveTab('events')}
                  className="glass-panel p-4 rounded-xl border border-white/5 hover:border-[#00f0ff]/30 cursor-pointer transition-all"
                >
                  <span className="font-sans font-extrabold text-2xl text-white block">{db.events.length}</span>
                  <span className="font-mono text-[9px] text-[#00f0ff] uppercase tracking-widest mt-1 inline-block">
                    Events
                  </span>
                </div>

                <div
                  onClick={() => setActiveTab('applications')}
                  className="glass-panel p-4 rounded-xl border border-white/5 hover:border-amber-400/30 cursor-pointer transition-all"
                >
                  <span className="font-sans font-extrabold text-2xl text-white block">{pendingAppsCount}</span>
                  <span className="font-mono text-[9px] text-amber-400 uppercase tracking-widest mt-1 inline-block">
                    Pending Apps
                  </span>
                </div>

                <div
                  onClick={() => setActiveTab('messages')}
                  className="glass-panel p-4 rounded-xl border border-white/5 hover:border-emerald-400/30 cursor-pointer transition-all"
                >
                  <span className="font-sans font-extrabold text-2xl text-white block">{unreadMessagesCount}</span>
                  <span className="font-mono text-[9px] text-emerald-400 uppercase tracking-widest mt-1 inline-block">
                    Unread Msgs
                  </span>
                </div>
              </div>

              {/* Recruitment Queue Preview */}
              <div className="glass-panel p-6 rounded-xl border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-sans font-bold text-lg text-white">Latest Recruitment Applications</h3>
                  <button
                    onClick={() => setActiveTab('applications')}
                    className="text-[#00f0ff] hover:underline font-mono text-xs inline-flex items-center gap-1"
                  >
                    View All ({db.applications.length}) <ExternalLink size={12} />
                  </button>
                </div>

                {db.applications.length === 0 ? (
                  <span className="font-sans text-xs text-slate-500 block py-4">No recruitment applications logged yet.</span>
                ) : (
                  <div className="space-y-3">
                    {db.applications.slice(0, 4).map(app => {
                      const divName = db.divisions.find(d => d.id === app.division)?.name || app.division;
                      return (
                        <div
                          key={app.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-white/[0.02] border border-white/5"
                        >
                          <div>
                            <h4 className="font-sans font-bold text-sm text-white">{app.name}</h4>
                            <span className="font-mono text-[10px] text-slate-400">
                              {app.branch} ({app.year}) | Division: <span className="text-[#00f0ff]">{divName}</span>
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className={`font-mono text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${
                                app.status === 'pending'
                                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                  : app.status === 'accepted'
                                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                  : 'bg-slate-500/20 text-slate-400 border-slate-500/30'
                              }`}
                            >
                              {app.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Inquiries Preview */}
              <div className="glass-panel p-6 rounded-xl border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-sans font-bold text-lg text-white">Recent Inquiries & Transmissions</h3>
                  <button
                    onClick={() => setActiveTab('messages')}
                    className="text-[#00f0ff] hover:underline font-mono text-xs inline-flex items-center gap-1"
                  >
                    View All ({db.contactMessages.length}) <ExternalLink size={12} />
                  </button>
                </div>

                {db.contactMessages.length === 0 ? (
                  <span className="font-sans text-xs text-slate-500 block py-4">No contact messages logged yet.</span>
                ) : (
                  <div className="space-y-3">
                    {db.contactMessages.slice(0, 3).map(msg => (
                      <div
                        key={msg.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-white/[0.02] border border-white/5"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-sans font-bold text-sm text-white">{msg.subject}</h4>
                            {!msg.read && (
                              <span className="h-1.5 w-1.5 rounded-full bg-[#00f0ff] animate-pulse" />
                            )}
                          </div>
                          <span className="font-mono text-[10px] text-slate-400">
                            From: {msg.name} ({msg.email}) | {msg.submittedAt}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => db.markContactMessageRead(msg.id, !msg.read)}
                            className="text-xs font-mono text-slate-400 hover:text-white px-2 py-1 bg-white/5 rounded border border-white/10"
                          >
                            {msg.read ? 'Mark Unread' : 'Mark Read'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TABLE VIEWS WITH ADD / EDIT / DELETE ACTIONS */}
          {activeTab !== 'dashboard' &&
            activeTab !== 'applications' &&
            activeTab !== 'messages' &&
            activeTab !== 'settings' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-sans font-extrabold text-2xl text-white capitalize">{activeTab} Manager</h2>
                  <button
                    onClick={openCreateModal}
                    className="flex items-center gap-1.5 px-4 py-2 font-sans font-bold text-xs uppercase tracking-wider text-black bg-[#00f0ff] hover:bg-[#00e0ef] rounded-lg transition-all shadow-[0_0_12px_rgba(0,240,255,0.2)]"
                  >
                    <Plus size={14} /> Create Record
                  </button>
                </div>

                <div className="glass-panel rounded-xl border border-white/5 overflow-x-auto">
                  <table className="w-full text-left font-sans text-xs">
                    <thead className="bg-white/[0.02] border-b border-white/5 font-mono text-[9px] text-slate-500 uppercase tracking-wider">
                      <tr>
                        <th className="p-4">Title / Name</th>
                        <th className="p-4">Classification</th>
                        <th className="p-4">Details / Metadata</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {/* MEMBERS */}
                      {activeTab === 'members' &&
                        db.members.map(m => (
                          <tr key={m.id} className="hover:bg-white/[0.01]">
                            <td className="p-4 font-bold text-white">
                              <div className="flex items-center gap-2">
                                <img
                                  src={m.image}
                                  alt=""
                                  className="w-7 h-7 rounded-full object-cover border border-white/10"
                                />
                                <div>
                                  <span>{m.name}</span>
                                  {m.isLeadership && (
                                    <span className="ml-2 font-mono text-[8px] uppercase tracking-wider bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/30">
                                      Lead
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-slate-400">{m.role}</td>
                            <td className="p-4 text-slate-400 font-mono">{m.division}</td>
                            <td className="p-4 text-right space-x-2">
                              <button
                                onClick={() => openEditModal(m.id)}
                                className="text-[#00f0ff] hover:underline inline-flex p-1"
                                title="Edit"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => db.deleteMember(m.id)}
                                className="text-red-400 hover:underline inline-flex p-1"
                                title="Delete"
                              >
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        ))}

                      {/* DIVISIONS */}
                      {activeTab === 'divisions' &&
                        db.divisions.map(d => {
                          const lead = db.members.find(m => m.id === d.leadId);
                          return (
                            <tr key={d.id} className="hover:bg-white/[0.01]">
                              <td className="p-4 font-bold text-white">
                                <div className="flex items-center gap-2">
                                  <span className="p-1.5 rounded bg-white/5 text-[#00f0ff] font-mono text-[10px]">
                                    {d.iconName || 'Code'}
                                  </span>
                                  <span>{d.name}</span>
                                </div>
                              </td>
                              <td className="p-4 text-slate-400 truncate max-w-[250px]">{d.description}</td>
                              <td className="p-4 text-slate-400 font-mono text-[10px]">
                                <div>Lead: {lead?.name || 'Unassigned'}</div>
                                <div className="truncate max-w-[200px] text-slate-500">
                                  Skills: {d.skills?.join(', ') || 'N/A'}
                                </div>
                              </td>
                              <td className="p-4 text-right space-x-2">
                                <button
                                  onClick={() => openEditModal(d.id)}
                                  className="text-[#00f0ff] hover:underline inline-flex p-1"
                                  title="Edit"
                                >
                                  <Edit2 size={13} />
                                </button>
                                <button
                                  onClick={() => handleDeleteDivision(d.id)}
                                  className="text-red-400 hover:underline inline-flex p-1"
                                  title="Delete"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}

                      {/* EVENTS */}
                      {activeTab === 'events' &&
                        db.events.map(e => (
                          <tr key={e.id} className="hover:bg-white/[0.01]">
                            <td className="p-4 font-bold text-white truncate max-w-[180px]">{e.title}</td>
                            <td className="p-4 text-slate-400 font-mono">
                              {e.date} | {e.time}
                            </td>
                            <td className="p-4 text-slate-400 font-mono uppercase text-[10px]">
                              <span
                                className={`px-2 py-0.5 rounded border ${
                                  e.status === 'upcoming'
                                    ? 'bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]/30'
                                    : e.status === 'ongoing'
                                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                    : 'bg-slate-500/10 text-slate-400 border-slate-500/30'
                                }`}
                              >
                                {e.status}
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-2">
                              <button
                                onClick={() => openEditModal(e.id)}
                                className="text-[#00f0ff] hover:underline inline-flex p-1"
                                title="Edit"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => db.deleteEvent(e.id)}
                                className="text-red-400 hover:underline inline-flex p-1"
                                title="Delete"
                              >
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        ))}

                      {/* PROJECTS */}
                      {activeTab === 'projects' &&
                        db.projects.map(p => (
                          <tr key={p.id} className="hover:bg-white/[0.01]">
                            <td className="p-4 font-bold text-white truncate max-w-[180px]">{p.title}</td>
                            <td className="p-4 text-slate-400">{p.mentor}</td>
                            <td className="p-4 text-slate-400 font-mono">
                              {p.status} ({p.progress}%)
                            </td>
                            <td className="p-4 text-right space-x-2">
                              <button
                                onClick={() => openEditModal(p.id)}
                                className="text-[#00f0ff] hover:underline inline-flex p-1"
                                title="Edit"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => db.deleteProject(p.id)}
                                className="text-red-400 hover:underline inline-flex p-1"
                                title="Delete"
                              >
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        ))}

                      {/* ANNOUNCEMENTS */}
                      {activeTab === 'announcements' &&
                        db.announcements.map(an => (
                          <tr key={an.id} className="hover:bg-white/[0.01]">
                            <td className="p-4 font-bold text-white truncate max-w-[180px]">{an.title}</td>
                            <td className="p-4 text-slate-400 font-mono">{an.date}</td>
                            <td className="p-4 text-slate-400 font-mono uppercase text-[10px]">{an.category}</td>
                            <td className="p-4 text-right space-x-2">
                              <button
                                onClick={() => openEditModal(an.id)}
                                className="text-[#00f0ff] hover:underline inline-flex p-1"
                                title="Edit"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => db.deleteAnnouncement(an.id)}
                                className="text-red-400 hover:underline inline-flex p-1"
                                title="Delete"
                              >
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        ))}

                      {/* GALLERY */}
                      {activeTab === 'gallery' &&
                        db.gallery.map(g => (
                          <tr key={g.id} className="hover:bg-white/[0.01]">
                            <td className="p-4 font-bold text-white truncate max-w-[180px]">{g.caption}</td>
                            <td className="p-4 text-slate-400 font-mono uppercase text-[10px]">{g.category}</td>
                            <td className="p-4 text-slate-400 truncate max-w-[150px] font-mono text-[10px]">{g.image}</td>
                            <td className="p-4 text-right space-x-2">
                              <button
                                onClick={() => openEditModal(g.id)}
                                className="text-[#00f0ff] hover:underline inline-flex p-1"
                                title="Edit"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => db.deleteGalleryItem(g.id)}
                                className="text-red-400 hover:underline inline-flex p-1"
                                title="Delete"
                              >
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        ))}

                      {/* ACHIEVEMENTS */}
                      {activeTab === 'achievements' &&
                        db.achievements.map(ac => (
                          <tr key={ac.id} className="hover:bg-white/[0.01]">
                            <td className="p-4 font-bold text-white truncate max-w-[180px]">{ac.title}</td>
                            <td className="p-4 text-slate-400 font-mono">{ac.date}</td>
                            <td className="p-4 text-slate-400 font-mono">{ac.badge}</td>
                            <td className="p-4 text-right space-x-2">
                              <button
                                onClick={() => openEditModal(ac.id)}
                                className="text-[#00f0ff] hover:underline inline-flex p-1"
                                title="Edit"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => db.deleteAchievement(ac.id)}
                                className="text-red-400 hover:underline inline-flex p-1"
                                title="Delete"
                              >
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        ))}

                      {/* PARTNERS */}
                      {activeTab === 'partners' &&
                        db.partners.map(pt => (
                          <tr key={pt.id} className="hover:bg-white/[0.01]">
                            <td className="p-4 font-bold text-white">{pt.name}</td>
                            <td className="p-4 text-slate-400">{pt.type}</td>
                            <td className="p-4 text-slate-400 truncate max-w-[150px]">{pt.website}</td>
                            <td className="p-4 text-right space-x-2">
                              <button
                                onClick={() => openEditModal(pt.id)}
                                className="text-[#00f0ff] hover:underline inline-flex p-1"
                                title="Edit"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => db.deletePartner(pt.id)}
                                className="text-red-400 hover:underline inline-flex p-1"
                                title="Delete"
                              >
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          {/* TAB: APPLICATIONS REVIEW */}
          {activeTab === 'applications' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-sans font-extrabold text-2xl text-white">Recruitment Applications Queue</h2>
                  <p className="font-sans text-xs text-slate-400 mt-1">
                    Review and grade prospective student applicants, assign division clearance, or reject submissions.
                  </p>
                </div>

                {/* Filter pills */}
                <div className="flex flex-wrap gap-1.5 bg-black/40 p-1 rounded-lg border border-white/5">
                  {(['all', 'pending', 'reviewed', 'accepted', 'rejected'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setAppFilter(f)}
                      className={`px-3 py-1 rounded text-[10px] font-mono uppercase tracking-wider transition-colors ${
                        appFilter === f ? 'bg-[#00f0ff] text-black font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {filteredApplications.length === 0 ? (
                <div className="glass-panel p-16 text-center text-slate-500 font-mono text-sm border border-white/5 rounded-xl">
                  "No applications matching '{appFilter}' logged in system."
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredApplications.map(app => {
                    const divName = db.divisions.find(d => d.id === app.division)?.name || app.division;
                    return (
                      <div
                        key={app.id}
                        className="glass-panel p-6 rounded-xl border border-white/5 text-left space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                          <div>
                            <h4 className="font-sans font-extrabold text-lg text-white">{app.name}</h4>
                            <span className="font-mono text-xs text-slate-400">
                              {app.branch} ({app.year}) | Submitted: {app.submittedAt}
                            </span>
                          </div>

                          {/* Status Toggle buttons */}
                          <div className="flex items-center gap-2">
                            <select
                              value={app.status}
                              onChange={e => db.updateApplicationStatus(app.id, e.target.value as Application['status'])}
                              className="bg-[#0a0a0f] border border-white/10 text-white font-mono text-[10px] px-2.5 py-1.5 rounded focus:outline-none"
                            >
                              <option value="pending">Pending</option>
                              <option value="reviewed">Reviewed</option>
                              <option value="accepted">Accepted</option>
                              <option value="rejected">Rejected</option>
                            </select>
                            <button
                              onClick={() => db.deleteApplication(app.id)}
                              className="p-1.5 text-red-400 bg-red-400/5 hover:bg-red-400/10 rounded border border-red-400/10 transition-colors"
                              title="Delete Application"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-xs text-slate-300">
                          <div>
                            <strong className="text-white">Preferred Division:</strong>{' '}
                            <span className="text-[#00f0ff] font-mono">{divName}</span>
                          </div>
                          <div>
                            <strong className="text-white">Contact:</strong> {app.phone} | {app.email}
                          </div>
                          <div className="sm:col-span-2">
                            <strong className="text-white">Skills:</strong> {app.skills}
                          </div>
                          <div className="sm:col-span-2">
                            <strong className="text-white">Motivation:</strong> {app.motivation}
                          </div>
                          {app.projects && (
                            <div className="sm:col-span-2">
                              <strong className="text-white">Projects:</strong> {app.projects}
                            </div>
                          )}

                          {/* Resource links */}
                          <div className="sm:col-span-2 flex flex-wrap gap-3 pt-2 border-t border-white/5 font-mono text-[10px]">
                            {app.github && (
                              <a
                                href={app.github}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[#00f0ff] hover:underline inline-flex items-center gap-1"
                              >
                                GitHub <ExternalLink size={10} />
                              </a>
                            )}
                            {app.linkedin && (
                              <a
                                href={app.linkedin}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[#00f0ff] hover:underline inline-flex items-center gap-1"
                              >
                                LinkedIn <ExternalLink size={10} />
                              </a>
                            )}
                            {app.portfolio && (
                              <a
                                href={app.portfolio}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[#00f0ff] hover:underline inline-flex items-center gap-1"
                              >
                                Portfolio <ExternalLink size={10} />
                              </a>
                            )}
                            <span className="text-slate-400">Resume: {app.resumeName || 'Not attached'}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB: CONTACT MESSAGES */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-sans font-extrabold text-2xl text-white">Inquiries & Contact Messages</h2>
                  <p className="font-sans text-xs text-slate-400 mt-1">
                    Manage incoming communications, collaboration proposals, and visitor queries.
                  </p>
                </div>

                {/* Filter pills */}
                <div className="flex flex-wrap gap-1.5 bg-black/40 p-1 rounded-lg border border-white/5">
                  {(['all', 'unread', 'read'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setMsgFilter(f)}
                      className={`px-3 py-1 rounded text-[10px] font-mono uppercase tracking-wider transition-colors ${
                        msgFilter === f ? 'bg-[#00f0ff] text-black font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {filteredMessages.length === 0 ? (
                <div className="glass-panel p-16 text-center text-slate-500 font-mono text-sm border border-white/5 rounded-xl">
                  "No messages logged under '{msgFilter}'."
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredMessages.map(msg => (
                    <div
                      key={msg.id}
                      className={`glass-panel p-6 rounded-xl border transition-all text-left space-y-3 ${
                        msg.read ? 'border-white/5 opacity-80' : 'border-[#00f0ff]/30 bg-[#00f0ff]/[0.02]'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-sans font-extrabold text-base text-white">{msg.subject}</h4>
                            {!msg.read && (
                              <span className="font-mono text-[8px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30">
                                New
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-xs text-slate-400">
                            From: <span className="text-white font-semibold">{msg.name}</span> ({msg.email}) | Received:{' '}
                            {msg.submittedAt}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => db.markContactMessageRead(msg.id, !msg.read)}
                            className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                          >
                            {msg.read ? (
                              <>
                                <EyeOff size={12} /> Mark Unread
                              </>
                            ) : (
                              <>
                                <Eye size={12} /> Mark Read
                              </>
                            )}
                          </button>
                          <a
                            href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                            className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded border border-[#00f0ff]/20 bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] transition-colors"
                          >
                            <Mail size={12} /> Reply
                          </a>
                          <button
                            onClick={() => db.deleteContactMessage(msg.id)}
                            className="p-1.5 text-red-400 bg-red-400/5 hover:bg-red-400/10 rounded border border-red-400/10 transition-colors"
                            title="Delete Message"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      <div className="bg-black/30 p-4 rounded-lg border border-white/5 text-sm text-slate-200 font-sans leading-relaxed whitespace-pre-wrap">
                        {msg.message}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: SETTINGS, DATABASE & LIVE CONFIG */}
          {activeTab === 'settings' && (
            <div className="space-y-8">
              <div>
                <h2 className="font-sans font-extrabold text-2xl text-white">SYSTEM HOOKS & DATABASE SETTINGS</h2>
                <p className="font-sans text-xs text-slate-400 mt-1">
                  Manage faculty advisor profiles, customize global homepage statistics counters, or perform JSON snapshots.
                </p>
              </div>

              {/* SECTION 1: FACULTY COORDINATOR PROFILE */}
              <div className="glass-panel p-6 rounded-xl border border-white/5 text-left space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <h3 className="font-sans font-bold text-lg text-white flex items-center gap-2">
                    <UserCheck size={18} className="text-[#00f0ff]" /> Faculty Coordinator Profile
                  </h3>
                  {facultyStatus === 'success' && (
                    <span className="font-mono text-xs text-emerald-400 flex items-center gap-1">
                      <Check size={12} /> Saved
                    </span>
                  )}
                </div>

                <form onSubmit={handleSaveFaculty} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-sans text-xs text-slate-400 mb-1 block">Coordinator Name *</label>
                      <input
                        type="text"
                        value={facultyForm.name}
                        onChange={e => setFacultyForm({ ...facultyForm, name: e.target.value })}
                        className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-sans text-xs text-slate-400 mb-1 block">Designation *</label>
                      <input
                        type="text"
                        value={facultyForm.designation}
                        onChange={e => setFacultyForm({ ...facultyForm, designation: e.target.value })}
                        className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-sans text-xs text-slate-400 mb-1 block">Department *</label>
                      <input
                        type="text"
                        value={facultyForm.department}
                        onChange={e => setFacultyForm({ ...facultyForm, department: e.target.value })}
                        className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-sans text-xs text-slate-400 mb-1 block">Office Location</label>
                      <input
                        type="text"
                        value={facultyForm.office}
                        onChange={e => setFacultyForm({ ...facultyForm, office: e.target.value })}
                        className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-sans text-xs text-slate-400 mb-1 block">Email Address *</label>
                      <input
                        type="email"
                        value={facultyForm.email}
                        onChange={e => setFacultyForm({ ...facultyForm, email: e.target.value })}
                        className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-sans text-xs text-slate-400 mb-1 block">Phone Contact</label>
                      <input
                        type="text"
                        value={facultyForm.phone}
                        onChange={e => setFacultyForm({ ...facultyForm, phone: e.target.value })}
                        className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-sans text-xs text-slate-400 mb-1 block">Profile Image Source URL</label>
                    <input
                      type="text"
                      value={facultyForm.image}
                      onChange={e => setFacultyForm({ ...facultyForm, image: e.target.value })}
                      className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-sans text-xs text-slate-400 mb-1 block">Biography / Message</label>
                    <textarea
                      value={facultyForm.bio}
                      onChange={e => setFacultyForm({ ...facultyForm, bio: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 font-sans font-bold text-xs uppercase tracking-wider text-black bg-[#00f0ff] hover:bg-[#00e0ef] rounded-lg transition-all"
                  >
                    Save Faculty Profile
                  </button>
                </form>
              </div>

              {/* SECTION 2: GLOBAL STATS & COUNTERS */}
              <div className="glass-panel p-6 rounded-xl border border-white/5 text-left space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <h3 className="font-sans font-bold text-lg text-white flex items-center gap-2">
                    <Award size={18} className="text-[#3b82f6]" /> Homepage Statistics Overrides
                  </h3>
                  {statsStatus === 'success' && (
                    <span className="font-mono text-xs text-emerald-400 flex items-center gap-1">
                      <Check size={12} /> Saved
                    </span>
                  )}
                </div>

                <form onSubmit={handleSaveStats} className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    <div>
                      <label className="font-sans text-xs text-slate-400 mb-1 block">Projects</label>
                      <input
                        type="number"
                        min="0"
                        value={statsForm.projects}
                        onChange={e => setStatsForm({ ...statsForm, projects: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg font-mono focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-sans text-xs text-slate-400 mb-1 block">Events</label>
                      <input
                        type="number"
                        min="0"
                        value={statsForm.events}
                        onChange={e => setStatsForm({ ...statsForm, events: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg font-mono focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-sans text-xs text-slate-400 mb-1 block">Members</label>
                      <input
                        type="number"
                        min="0"
                        value={statsForm.members}
                        onChange={e => setStatsForm({ ...statsForm, members: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg font-mono focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-sans text-xs text-slate-400 mb-1 block">Divisions</label>
                      <input
                        type="number"
                        min="0"
                        value={statsForm.divisions}
                        onChange={e => setStatsForm({ ...statsForm, divisions: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg font-mono focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-sans text-xs text-slate-400 mb-1 block">Partners</label>
                      <input
                        type="number"
                        min="0"
                        value={statsForm.partners}
                        onChange={e => setStatsForm({ ...statsForm, partners: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg font-mono focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 font-sans font-bold text-xs uppercase tracking-wider text-white bg-[#3b82f6] hover:bg-[#2563eb] rounded-lg transition-all"
                  >
                    Save Statistics Overrides
                  </button>
                </form>
              </div>

              {/* SECTION 3: DATABASE BACKUP & RESTORE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Database Backup & Export */}
                <div className="glass-panel p-6 rounded-xl border border-white/5 text-left space-y-4">
                  <h3 className="font-sans font-bold text-lg text-white flex items-center gap-1.5">
                    <Download size={18} className="text-[#00f0ff]" /> Backup Export
                  </h3>
                  <p className="font-sans text-xs text-slate-400 leading-relaxed">
                    Export the current database state (members, divisions, events, announcements, recruitment submissions)
                    as a JSON backup file.
                  </p>
                  <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2.5 font-sans font-bold text-xs uppercase tracking-wider text-black bg-[#00f0ff] hover:bg-[#00e0ef] rounded-lg transition-all"
                  >
                    Export Database JSON <Download size={14} />
                  </button>
                </div>

                {/* Database Restore & Import */}
                <div className="glass-panel p-6 rounded-xl border border-white/5 text-left space-y-4">
                  <h3 className="font-sans font-bold text-lg text-white flex items-center gap-1.5">
                    <Upload size={18} className="text-[#3b82f6]" /> Backup Restore
                  </h3>
                  <p className="font-sans text-xs text-slate-400 leading-relaxed">
                    Paste a previously exported database JSON dump in the box below to overwrite the current state.
                  </p>
                  <form onSubmit={handleImport} className="space-y-4">
                    <textarea
                      value={importJson}
                      onChange={e => setImportJson(e.target.value)}
                      placeholder="Paste JSON Database dump here..."
                      rows={4}
                      className="w-full px-3 py-2 text-xs font-mono text-white glass-input rounded-lg placeholder-slate-700"
                    />

                    {importStatus === 'success' && (
                      <span className="font-mono text-[10px] text-emerald-400 block">
                        Database state restored successfully!
                      </span>
                    )}
                    {importStatus === 'error' && (
                      <span className="font-mono text-[10px] text-red-400 block">
                        Error: Invalid database JSON syntax.
                      </span>
                    )}

                    <button
                      type="submit"
                      disabled={!importJson.trim()}
                      className="flex items-center gap-2 px-4 py-2.5 font-sans font-bold text-xs uppercase tracking-wider text-white bg-[#3b82f6] hover:bg-[#2563eb] rounded-lg transition-all disabled:opacity-50 disabled:pointer-events-none"
                    >
                      Import Database JSON <Upload size={14} />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* OVERLAY DIALOGS FOR CRUD FORMS */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-xl glass-panel rounded-2xl border border-white/10 shadow-2xl overflow-y-auto max-h-[85vh] p-6 text-left">
            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-6">
              <h3 className="font-sans font-extrabold text-lg text-white capitalize">
                {formMode} {activeTab === 'gallery' ? 'Gallery Item' : activeTab.slice(0, -1)} Record
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1 rounded bg-white/5 text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Member Form Fields */}
              {activeTab === 'members' && (
                <>
                  <div>
                    <label className="font-sans text-xs text-slate-400 mb-1 block">Full Name *</label>
                    <input
                      type="text"
                      value={memberForm.name}
                      onChange={e => setMemberForm({ ...memberForm, name: e.target.value })}
                      className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-sans text-xs text-slate-400 mb-1 block">Club Role *</label>
                    <input
                      type="text"
                      value={memberForm.role}
                      onChange={e => setMemberForm({ ...memberForm, role: e.target.value })}
                      placeholder="e.g. Lead Core Developer"
                      className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-sans text-xs text-slate-400 mb-1 block">Division *</label>
                    <select
                      value={memberForm.division}
                      onChange={e => setMemberForm({ ...memberForm, division: e.target.value as any })}
                      className="w-full px-3 py-2 text-sm text-white bg-[#0a0a0f] border border-white/8 rounded-lg focus:outline-none"
                    >
                      <option value="Leadership">Leadership</option>
                      <option value="App Dev">App Dev</option>
                      <option value="R&D">R&D</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-sans text-xs text-slate-400 mb-1 block">Profile Picture URL *</label>
                    <input
                      type="text"
                      value={memberForm.image}
                      onChange={e => setMemberForm({ ...memberForm, image: e.target.value })}
                      className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-sans text-xs text-slate-400 mb-1 block">Email Coordinate *</label>
                    <input
                      type="email"
                      value={memberForm.email}
                      onChange={e => setMemberForm({ ...memberForm, email: e.target.value })}
                      className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-sans text-xs text-slate-400 mb-1 block">Key Skills (comma-separated)</label>
                    <input
                      type="text"
                      value={memberSkillsStr}
                      onChange={e => setMemberSkillsStr(e.target.value)}
                      placeholder="React, TypeScript, Node.js"
                      className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-sans text-xs text-slate-400 mb-1 block">Bio Description</label>
                    <textarea
                      value={memberForm.bio}
                      onChange={e => setMemberForm({ ...memberForm, bio: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2 py-2">
                    <input
                      type="checkbox"
                      id="lead-check"
                      checked={memberForm.isLeadership}
                      onChange={e => setMemberForm({ ...memberForm, isLeadership: e.target.checked })}
                      className="rounded bg-black border-white/10"
                    />
                    <label htmlFor="lead-check" className="font-sans text-xs text-slate-400 cursor-pointer">
                      Grant Leadership Role Flag
                    </label>
                  </div>
                </>
              )}

              {/* Division Form Fields */}
              {activeTab === 'divisions' && (
                <>
                  <div>
                    <label className="font-sans text-xs text-slate-400 mb-1 block">Division Name *</label>
                    <input
                      type="text"
                      value={divisionForm.name}
                      onChange={e => setDivisionForm({ ...divisionForm, name: e.target.value })}
                      placeholder="e.g. Cybersecurity & Cloud"
                      className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-sans text-xs text-slate-400 mb-1 block">Division Lead</label>
                      <select
                        value={divisionForm.leadId}
                        onChange={e => setDivisionForm({ ...divisionForm, leadId: e.target.value })}
                        className="w-full px-3 py-2 text-sm text-white bg-[#0a0a0f] border border-white/8 rounded-lg focus:outline-none"
                      >
                        <option value="">-- Select Member --</option>
                        {db.members.map(m => (
                          <option key={m.id} value={m.id}>
                            {m.name} ({m.role})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-sans text-xs text-slate-400 mb-1 block">Icon Style</label>
                      <select
                        value={divisionForm.iconName}
                        onChange={e => setDivisionForm({ ...divisionForm, iconName: e.target.value })}
                        className="w-full px-3 py-2 text-sm text-white bg-[#0a0a0f] border border-white/8 rounded-lg focus:outline-none font-mono"
                      >
                        <option value="Code">Code</option>
                        <option value="Cpu">Cpu</option>
                        <option value="Layers">Layers</option>
                        <option value="Shield">Shield</option>
                        <option value="Terminal">Terminal</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-sans text-xs text-slate-400 mb-1 block">Description *</label>
                    <textarea
                      value={divisionForm.description}
                      onChange={e => setDivisionForm({ ...divisionForm, description: e.target.value })}
                      rows={2}
                      placeholder="High-level mandate and focus area..."
                      className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-sans text-xs text-slate-400 mb-1 block">
                      Responsibilities (one per line)
                    </label>
                    <textarea
                      value={divRespStr}
                      onChange={e => setDivRespStr(e.target.value)}
                      rows={3}
                      placeholder="Developing campus web tools&#10;Mentoring junior engineering cohorts"
                      className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-sans text-xs text-slate-400 mb-1 block">Skills (comma-separated)</label>
                      <input
                        type="text"
                        value={divSkillsStr}
                        onChange={e => setDivSkillsStr(e.target.value)}
                        placeholder="React, Go, Docker"
                        className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-sans text-xs text-slate-400 mb-1 block">Tools (comma-separated)</label>
                      <input
                        type="text"
                        value={divToolsStr}
                        onChange={e => setDivToolsStr(e.target.value)}
                        placeholder="VS Code, GitHub, Figma"
                        className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-sans text-xs text-slate-400 mb-1 block">Ongoing Work / Active Projects</label>
                    <textarea
                      value={divisionForm.ongoingWork}
                      onChange={e => setDivisionForm({ ...divisionForm, ongoingWork: e.target.value })}
                      rows={2}
                      placeholder="Current roadmap initiatives..."
                      className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* Event Form Fields */}
              {activeTab === 'events' && (
                <>
                  <div>
                    <label className="font-sans text-xs text-slate-400 mb-1 block">Event Title *</label>
                    <input
                      type="text"
                      value={eventForm.title}
                      onChange={e => setEventForm({ ...eventForm, title: e.target.value })}
                      className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-sans text-xs text-slate-400 mb-1 block">Overview Description</label>
                    <textarea
                      value={eventForm.description}
                      onChange={e => setEventForm({ ...eventForm, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-sans text-xs text-slate-400 mb-1 block">Date *</label>
                      <input
                        type="date"
                        value={eventForm.date}
                        onChange={e => setEventForm({ ...eventForm, date: e.target.value })}
                        className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-sans text-xs text-slate-400 mb-1 block">Time *</label>
                      <input
                        type="text"
                        value={eventForm.time}
                        onChange={e => setEventForm({ ...eventForm, time: e.target.value })}
                        placeholder="e.g. 02:00 PM"
                        className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-sans text-xs text-slate-400 mb-1 block">Venue *</label>
                    <input
                      type="text"
                      value={eventForm.venue}
                      onChange={e => setEventForm({ ...eventForm, venue: e.target.value })}
                      className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-sans text-xs text-slate-400 mb-1 block">Coordinator Name *</label>
                    <input
                      type="text"
                      value={eventForm.coordinator}
                      onChange={e => setEventForm({ ...eventForm, coordinator: e.target.value })}
                      className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-sans text-xs text-slate-400 mb-1 block">Poster Banner URL</label>
                    <input
                      type="text"
                      value={eventForm.image}
                      onChange={e => setEventForm({ ...eventForm, image: e.target.value })}
                      className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-sans text-xs text-slate-400 mb-1 block">Status</label>
                    <select
                      value={eventForm.status}
                      onChange={e => setEventForm({ ...eventForm, status: e.target.value as any })}
                      className="w-full px-3 py-2 text-sm text-white bg-[#0a0a0f] border border-white/8 rounded-lg focus:outline-none font-mono"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="past">Past</option>
                    </select>
                  </div>
                </>
              )}

              {/* Project Form Fields */}
              {activeTab === 'projects' && (
                <>
                  <div>
                    <label className="font-sans text-xs text-slate-400 mb-1 block">Project Title *</label>
                    <input
                      type="text"
                      value={projectForm.title}
                      onChange={e => setProjectForm({ ...projectForm, title: e.target.value })}
                      className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-sans text-xs text-slate-400 mb-1 block">Problem Statement *</label>
                    <textarea
                      value={projectForm.problem}
                      onChange={e => setProjectForm({ ...projectForm, problem: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-sans text-xs text-slate-400 mb-1 block">Solution Concept *</label>
                    <textarea
                      value={projectForm.solution}
                      onChange={e => setProjectForm({ ...projectForm, solution: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-sans text-xs text-slate-400 mb-1 block">Research Mentor *</label>
                    <input
                      type="text"
                      value={projectForm.mentor}
                      onChange={e => setProjectForm({ ...projectForm, mentor: e.target.value })}
                      className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-sans text-xs text-slate-400 mb-1 block">Tech Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={projectTagsStr}
                      onChange={e => setProjectTagsStr(e.target.value)}
                      placeholder="React, Node.js, PyTorch"
                      className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-sans text-xs text-slate-400 mb-1 block">
                        Progress Percentage (0-100) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={projectForm.progress}
                        onChange={e => setProjectForm({ ...projectForm, progress: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-sans text-xs text-slate-400 mb-1 block">Status</label>
                      <select
                        value={projectForm.status}
                        onChange={e => setProjectForm({ ...projectForm, status: e.target.value as any })}
                        className="w-full px-3 py-2 text-sm text-white bg-[#0a0a0f] border border-white/8 rounded-lg focus:outline-none font-mono"
                      >
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="on-hold">On Hold</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Announcement Form Fields */}
              {activeTab === 'announcements' && (
                <>
                  <div>
                    <label className="font-sans text-xs text-slate-400 mb-1 block">Announcement Header *</label>
                    <input
                      type="text"
                      value={announcementForm.title}
                      onChange={e => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                      className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-sans text-xs text-slate-400 mb-1 block">Detailed Notice Content *</label>
                    <textarea
                      value={announcementForm.content}
                      onChange={e => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2 py-2">
                    <input
                      type="checkbox"
                      id="ann-active"
                      checked={announcementForm.active}
                      onChange={e => setAnnouncementForm({ ...announcementForm, active: e.target.checked })}
                      className="rounded bg-black border-white/10"
                    />
                    <label htmlFor="ann-active" className="font-sans text-xs text-slate-400 cursor-pointer">
                      Flag as Active / Visible in News Ticker
                    </label>
                  </div>
                </>
              )}

              {/* Gallery Form Fields */}
              {activeTab === 'gallery' && (
                <>
                  <div>
                    <label className="font-sans text-xs text-slate-400 mb-1 block">Image Source URL *</label>
                    <input
                      type="text"
                      value={galleryForm.image}
                      onChange={e => setGalleryForm({ ...galleryForm, image: e.target.value })}
                      className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-sans text-xs text-slate-400 mb-1 block">Image Caption *</label>
                    <input
                      type="text"
                      value={galleryForm.caption}
                      onChange={e => setGalleryForm({ ...galleryForm, caption: e.target.value })}
                      className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-sans text-xs text-slate-400 mb-1 block">Category *</label>
                    <select
                      value={galleryForm.category}
                      onChange={e => setGalleryForm({ ...galleryForm, category: e.target.value as any })}
                      className="w-full px-3 py-2 text-sm text-white bg-[#0a0a0f] border border-white/8 rounded-lg focus:outline-none"
                    >
                      <option value="events">Events</option>
                      <option value="workshops">Workshops</option>
                      <option value="meetings">Meetings</option>
                      <option value="hackathons">Hackathons</option>
                      <option value="projects">Projects</option>
                      <option value="community">Community</option>
                    </select>
                  </div>
                </>
              )}

              {/* Achievements Form Fields */}
              {activeTab === 'achievements' && (
                <>
                  <div>
                    <label className="font-sans text-xs text-slate-400 mb-1 block">Milestone Header *</label>
                    <input
                      type="text"
                      value={achievementForm.title}
                      onChange={e => setAchievementForm({ ...achievementForm, title: e.target.value })}
                      className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-sans text-xs text-slate-400 mb-1 block">Milestone Date (e.g. 2026-05) *</label>
                    <input
                      type="text"
                      value={achievementForm.date}
                      onChange={e => setAchievementForm({ ...achievementForm, date: e.target.value })}
                      className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-sans text-xs text-slate-400 mb-1 block">Achievement Tag/Badge *</label>
                    <input
                      type="text"
                      value={achievementForm.badge}
                      onChange={e => setAchievementForm({ ...achievementForm, badge: e.target.value })}
                      placeholder="e.g. National Winner"
                      className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-sans text-xs text-slate-400 mb-1 block">Description</label>
                    <textarea
                      value={achievementForm.description}
                      onChange={e => setAchievementForm({ ...achievementForm, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* Partners Form Fields */}
              {activeTab === 'partners' && (
                <>
                  <div>
                    <label className="font-sans text-xs text-slate-400 mb-1 block">Partner Name *</label>
                    <input
                      type="text"
                      value={partnerForm.name}
                      onChange={e => setPartnerForm({ ...partnerForm, name: e.target.value })}
                      className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-sans text-xs text-slate-400 mb-1 block">Sponsor Classification *</label>
                    <input
                      type="text"
                      value={partnerForm.type}
                      onChange={e => setPartnerForm({ ...partnerForm, type: e.target.value })}
                      placeholder="e.g. Technology Sponsor"
                      className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-sans text-xs text-slate-400 mb-1 block">Partner Logo URL *</label>
                    <input
                      type="text"
                      value={partnerForm.logo}
                      onChange={e => setPartnerForm({ ...partnerForm, logo: e.target.value })}
                      className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-sans text-xs text-slate-400 mb-1 block">Website Link *</label>
                    <input
                      type="text"
                      value={partnerForm.website}
                      onChange={e => setPartnerForm({ ...partnerForm, website: e.target.value })}
                      className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-sans text-xs text-slate-400 mb-1 block">Partnership Details</label>
                    <textarea
                      value={partnerForm.description}
                      onChange={e => setPartnerForm({ ...partnerForm, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* Form submit actions */}
              <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 font-sans font-bold text-xs uppercase tracking-wider text-slate-400 hover:text-white bg-white/5 border border-white/10 rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 font-sans font-bold text-xs uppercase tracking-wider text-black bg-[#00f0ff] hover:bg-[#00e0ef] rounded-lg transition-all shadow-[0_0_12px_rgba(0,240,255,0.2)] disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
