import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import {
  ShieldAlert, ShieldCheck, LogOut, Plus, Trash2, Edit2, Download, Upload, X
} from 'lucide-react';
import type { Member, Event, Project, Announcement, Partner, GalleryItem, Achievement } from '../data/seedData';

export const AdminDashboard: React.FC = () => {
  const db = useDatabase();
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  // Tab navigation
  const [activeTab, setActiveTab] = useState<'dashboard' | 'members' | 'divisions' | 'events' | 'projects' | 'gallery' | 'announcements' | 'achievements' | 'partners' | 'applications' | 'settings'>('dashboard');

  // Modal / Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editId, setEditId] = useState<string | null>(null);
  
  // Custom states for JSON Import/Export
  const [importJson, setImportJson] = useState('');
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Shared form inputs
  const [memberForm, setMemberForm] = useState<Omit<Member, 'id'>>({
    name: '', role: '', division: 'App Dev', email: '', github: '', linkedin: '', image: '', bio: '', skills: [], isLeadership: false
  });
  const [eventForm, setEventForm] = useState<Omit<Event, 'id'>>({
    title: '', description: '', date: '', time: '', venue: '', coordinator: '', image: '', status: 'upcoming', registrationLink: ''
  });
  const [projectForm, setProjectForm] = useState<Omit<Project, 'id'>>({
    title: '', problem: '', solution: '', description: '', image: '', tags: [], teamIds: [], mentor: '', progress: 0, github: '', demo: '', status: 'active'
  });
  const [announcementForm, setAnnouncementForm] = useState<Omit<Announcement, 'id'>>({
    title: '', date: '', content: '', category: 'general', active: true
  });
  const [galleryForm, setGalleryForm] = useState<Omit<GalleryItem, 'id'>>({
    image: '', caption: '', category: 'events'
  });
  const [achievementForm, setAchievementForm] = useState<Omit<Achievement, 'id'>>({
    title: '', date: '', description: '', image: '', badge: ''
  });
  const [partnerForm, setPartnerForm] = useState<Omit<Partner, 'id'>>({
    name: '', logo: '', type: 'Technology Sponsor', description: '', website: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In-browser mock dashboard password validation
    if (password === 'admin') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Authentication failed: Invalid credentials.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
  };

  const handleExport = () => {
    const dataStr = db.exportDatabase();
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `alterino_db_export_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    const success = db.importDatabase(importJson);
    if (success) {
      setImportStatus('success');
      setImportJson('');
    } else {
      setImportStatus('error');
    }
  };

  // CRUD Trigger helpers
  const openCreateModal = () => {
    setFormMode('create');
    setEditId(null);
    setIsFormOpen(true);

    // Reset forms
    setMemberForm({ name: '', role: '', division: 'App Dev', email: '', github: '', linkedin: '', image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400', bio: '', skills: ['React', 'TypeScript'], isLeadership: false });
    setEventForm({ title: '', description: '', date: '', time: '', venue: '', coordinator: '', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800', status: 'upcoming', registrationLink: '#' });
    setProjectForm({ title: '', problem: '', solution: '', description: '', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800', tags: ['React', 'Node.js'], teamIds: [], mentor: 'Dr. Rajeshwari M.', progress: 10, github: '#', demo: '#', status: 'active' });
    setAnnouncementForm({ title: '', date: new Date().toISOString().split('T')[0], content: '', category: 'general', active: true });
    setGalleryForm({ image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800', caption: '', category: 'events' });
    setAchievementForm({ title: '', date: '', description: '', image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&q=80&w=600', badge: 'Award Winner' });
    setPartnerForm({ name: '', logo: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&q=80&w=200', type: 'Technology Sponsor', description: '', website: 'https://github.com' });
  };

  const openEditModal = (id: string) => {
    setFormMode('edit');
    setEditId(id);
    setIsFormOpen(true);

    if (activeTab === 'members') {
      const match = db.members.find(m => m.id === id);
      if (match) setMemberForm({ ...match });
    } else if (activeTab === 'events') {
      const match = db.events.find(e => e.id === id);
      if (match) setEventForm({ ...match });
    } else if (activeTab === 'projects') {
      const match = db.projects.find(p => p.id === id);
      if (match) setProjectForm({ ...match });
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === 'members') {
      if (formMode === 'create') db.addMember(memberForm);
      else if (editId) db.updateMember(editId, memberForm);
    } else if (activeTab === 'events') {
      if (formMode === 'create') db.addEvent(eventForm);
      else if (editId) db.updateEvent(editId, eventForm);
    } else if (activeTab === 'projects') {
      if (formMode === 'create') db.addProject(projectForm);
      else if (editId) db.updateProject(editId, projectForm);
    } else if (activeTab === 'announcements') {
      if (formMode === 'create') db.addAnnouncement(announcementForm);
      else if (editId) db.updateAnnouncement(editId, announcementForm);
    } else if (activeTab === 'gallery') {
      if (formMode === 'create') db.addGalleryItem(galleryForm);
      else if (editId) db.updateGalleryItem(editId, galleryForm);
    } else if (activeTab === 'achievements') {
      if (formMode === 'create') db.addAchievement(achievementForm);
      else if (editId) db.updateAchievement(editId, achievementForm);
    } else if (activeTab === 'partners') {
      if (formMode === 'create') db.addPartner(partnerForm);
      else if (editId) db.updatePartner(editId, partnerForm);
    }

    setIsFormOpen(false);
  };

  // LOCK SCREEN IF NOT AUTHENTICATED
  if (!isAuthenticated) {
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
            Input the security clearance key to access database CRUD parameters, recruitment reviews, and setting hooks.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="font-sans text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2 block">
                Security Password (Default: admin)
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Clearance Password"
                className="w-full px-4 py-2.5 text-sm text-white glass-input rounded-lg font-mono placeholder-slate-700 focus:outline-none"
              />
            </div>

            {authError && (
              <span className="font-mono text-[10px] text-red-400 block">{authError}</span>
            )}

            <button
              type="submit"
              className="w-full py-3 font-sans font-bold text-xs uppercase tracking-wider text-black bg-[#00f0ff] hover:bg-[#00e0ef] rounded-lg transition-all shadow-[0_0_12px_rgba(0,240,255,0.2)]"
            >
              Verify clearance key
            </button>
          </form>
        </div>
      </div>
    );
  }

  // MAIN ADMIN PANEL LAYOUT
  return (
    <div className="min-h-screen pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-100 text-left">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sidebar Controls */}
        <div className="lg:col-span-3 glass-panel rounded-xl border border-white/5 p-4 space-y-2">
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4 px-2">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-emerald-500" />
              <span className="font-mono text-[10px] font-bold text-white uppercase tracking-wider">ADMIN PANEL</span>
            </div>
            <button onClick={handleLogout} className="text-slate-500 hover:text-red-400" title="Log Out">
              <LogOut size={16} />
            </button>
          </div>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full text-left px-3 py-2 rounded-lg font-sans text-xs uppercase font-bold tracking-wider transition-colors ${
              activeTab === 'dashboard' ? 'bg-[#00f0ff]/10 text-[#00f0ff]' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`w-full text-left px-3 py-2 rounded-lg font-sans text-xs uppercase font-bold tracking-wider transition-colors ${
              activeTab === 'members' ? 'bg-[#00f0ff]/10 text-[#00f0ff]' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            Members
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`w-full text-left px-3 py-2 rounded-lg font-sans text-xs uppercase font-bold tracking-wider transition-colors ${
              activeTab === 'events' ? 'bg-[#00f0ff]/10 text-[#00f0ff]' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            Events
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`w-full text-left px-3 py-2 rounded-lg font-sans text-xs uppercase font-bold tracking-wider transition-colors ${
              activeTab === 'projects' ? 'bg-[#00f0ff]/10 text-[#00f0ff]' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`w-full text-left px-3 py-2 rounded-lg font-sans text-xs uppercase font-bold tracking-wider transition-colors ${
              activeTab === 'gallery' ? 'bg-[#00f0ff]/10 text-[#00f0ff]' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            Gallery
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`w-full text-left px-3 py-2 rounded-lg font-sans text-xs uppercase font-bold tracking-wider transition-colors ${
              activeTab === 'announcements' ? 'bg-[#00f0ff]/10 text-[#00f0ff]' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            Announcements
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`w-full text-left px-3 py-2 rounded-lg font-sans text-xs uppercase font-bold tracking-wider transition-colors ${
              activeTab === 'achievements' ? 'bg-[#00f0ff]/10 text-[#00f0ff]' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            Achievements
          </button>
          <button
            onClick={() => setActiveTab('partners')}
            className={`w-full text-left px-3 py-2 rounded-lg font-sans text-xs uppercase font-bold tracking-wider transition-colors ${
              activeTab === 'partners' ? 'bg-[#00f0ff]/10 text-[#00f0ff]' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            Partners
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`w-full text-left px-3 py-2 rounded-lg font-sans text-xs uppercase font-bold tracking-wider transition-colors relative ${
              activeTab === 'applications' ? 'bg-[#00f0ff]/10 text-[#00f0ff]' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            Applications
            {db.applications.filter(a => a.status === 'pending').length > 0 && (
              <span className="absolute right-3 top-2.5 h-2 w-2 rounded-full bg-[#00f0ff] animate-pulse" />
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

        {/* Main Dashboard Panel */}
        <div className="lg:col-span-9 space-y-8">
          
          {/* TAB 1: DASHBOARD STATS */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <h2 className="font-sans font-extrabold text-2xl text-white">SYSTEM REPORT</h2>
              
              {/* Grid counts */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass-panel p-5 rounded-xl border border-white/5">
                  <span className="font-sans font-extrabold text-3xl text-white block">{db.members.length}</span>
                  <span className="font-mono text-[9px] text-[#00f0ff] uppercase tracking-widest mt-1 inline-block">Registered Members</span>
                </div>
                <div className="glass-panel p-5 rounded-xl border border-white/5">
                  <span className="font-sans font-extrabold text-3xl text-white block">{db.projects.length}</span>
                  <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest mt-1 inline-block">Prototyped Projects</span>
                </div>
                <div className="glass-panel p-5 rounded-xl border border-white/5">
                  <span className="font-sans font-extrabold text-3xl text-white block">{db.events.length}</span>
                  <span className="font-mono text-[9px] text-[#00f0ff] uppercase tracking-widest mt-1 inline-block">Events Logs</span>
                </div>
                <div className="glass-panel p-5 rounded-xl border border-white/5">
                  <span className="font-sans font-extrabold text-3xl text-white block">
                    {db.applications.filter(a => a.status === 'pending').length}
                  </span>
                  <span className="font-mono text-[9px] text-amber-400 uppercase tracking-widest mt-1 inline-block">Pending Applns</span>
                </div>
              </div>

              {/* Recruitment queue preview */}
              <div className="glass-panel p-6 rounded-xl border border-white/5">
                <h3 className="font-sans font-bold text-lg text-white mb-4">Latest Application Queue</h3>
                {db.applications.length === 0 ? (
                  <span className="font-sans text-xs text-slate-500">Recruitment registers empty.</span>
                ) : (
                  <div className="space-y-4">
                    {db.applications.slice(0, 3).map(app => (
                      <div key={app.id} className="flex items-center justify-between border-b border-white/5 pb-3">
                        <div>
                          <h6 className="font-sans font-bold text-sm text-white">{app.name}</h6>
                          <span className="font-mono text-[9px] text-slate-400">{app.branch} | Preferred Div: {app.division}</span>
                        </div>
                        <span className={`font-mono text-[8px] uppercase tracking-widest font-bold px-2 py-0.5 rounded border ${
                          app.status === 'pending' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TABLE VIEWS WITH ADD / EDIT / DELETE ACTIONS */}
          {activeTab !== 'dashboard' && activeTab !== 'applications' && activeTab !== 'settings' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-sans font-extrabold text-2xl text-white capitalize">{activeTab} Manager</h2>
                <button
                  onClick={openCreateModal}
                  className="flex items-center gap-1.5 px-4 py-2 font-sans font-bold text-xs uppercase tracking-wider text-black bg-[#00f0ff] hover:bg-[#00e0ef] rounded-lg transition-all"
                >
                  <Plus size={14} /> Create Record
                </button>
              </div>

              {/* General Grid display for lists */}
              <div className="glass-panel rounded-xl border border-white/5 overflow-hidden">
                <table className="w-full text-left font-sans text-xs">
                  <thead className="bg-white/[0.02] border-b border-white/5 font-mono text-[9px] text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Title / Name</th>
                      <th className="p-4">Classification</th>
                      <th className="p-4">Details</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {/* Render rows depending on activeTab */}
                    {activeTab === 'members' && db.members.map(m => (
                      <tr key={m.id} className="hover:bg-white/[0.01]">
                        <td className="p-4 font-bold text-white">{m.name}</td>
                        <td className="p-4 text-slate-400">{m.role}</td>
                        <td className="p-4 text-slate-400 font-mono">{m.division}</td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => openEditModal(m.id)} className="text-[#00f0ff] hover:underline inline-flex"><Edit2 size={12} /></button>
                          <button onClick={() => db.deleteMember(m.id)} className="text-red-400 hover:underline inline-flex"><Trash2 size={12} /></button>
                        </td>
                      </tr>
                    ))}

                    {activeTab === 'events' && db.events.map(e => (
                      <tr key={e.id} className="hover:bg-white/[0.01]">
                        <td className="p-4 font-bold text-white truncate max-w-[150px]">{e.title}</td>
                        <td className="p-4 text-slate-400 font-mono">{e.date}</td>
                        <td className="p-4 text-slate-400 font-mono">{e.status}</td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => openEditModal(e.id)} className="text-[#00f0ff] hover:underline inline-flex"><Edit2 size={12} /></button>
                          <button onClick={() => db.deleteEvent(e.id)} className="text-red-400 hover:underline inline-flex"><Trash2 size={12} /></button>
                        </td>
                      </tr>
                    ))}

                    {activeTab === 'projects' && db.projects.map(p => (
                      <tr key={p.id} className="hover:bg-white/[0.01]">
                        <td className="p-4 font-bold text-white truncate max-w-[150px]">{p.title}</td>
                        <td className="p-4 text-slate-400">{p.mentor}</td>
                        <td className="p-4 text-slate-400 font-mono">{p.status} ({p.progress}%)</td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => openEditModal(p.id)} className="text-[#00f0ff] hover:underline inline-flex"><Edit2 size={12} /></button>
                          <button onClick={() => db.deleteProject(p.id)} className="text-red-400 hover:underline inline-flex"><Trash2 size={12} /></button>
                        </td>
                      </tr>
                    ))}

                    {activeTab === 'announcements' && db.announcements.map(an => (
                      <tr key={an.id} className="hover:bg-white/[0.01]">
                        <td className="p-4 font-bold text-white truncate max-w-[150px]">{an.title}</td>
                        <td className="p-4 text-slate-400 font-mono">{an.date}</td>
                        <td className="p-4 text-slate-400 font-mono">{an.category}</td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => openEditModal(an.id)} className="text-[#00f0ff] hover:underline inline-flex"><Edit2 size={12} /></button>
                          <button onClick={() => db.deleteAnnouncement(an.id)} className="text-red-400 hover:underline inline-flex"><Trash2 size={12} /></button>
                        </td>
                      </tr>
                    ))}

                    {activeTab === 'gallery' && db.gallery.map(g => (
                      <tr key={g.id} className="hover:bg-white/[0.01]">
                        <td className="p-4 font-bold text-white truncate max-w-[150px]">{g.caption}</td>
                        <td className="p-4 text-slate-400 font-mono">{g.category}</td>
                        <td className="p-4 text-slate-400 truncate max-w-[150px]">{g.image}</td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => openEditModal(g.id)} className="text-[#00f0ff] hover:underline inline-flex"><Edit2 size={12} /></button>
                          <button onClick={() => db.deleteGalleryItem(g.id)} className="text-red-400 hover:underline inline-flex"><Trash2 size={12} /></button>
                        </td>
                      </tr>
                    ))}

                    {activeTab === 'achievements' && db.achievements.map(ac => (
                      <tr key={ac.id} className="hover:bg-white/[0.01]">
                        <td className="p-4 font-bold text-white truncate max-w-[150px]">{ac.title}</td>
                        <td className="p-4 text-slate-400 font-mono">{ac.date}</td>
                        <td className="p-4 text-slate-400 font-mono">{ac.badge}</td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => openEditModal(ac.id)} className="text-[#00f0ff] hover:underline inline-flex"><Edit2 size={12} /></button>
                          <button onClick={() => db.deleteAchievement(ac.id)} className="text-red-400 hover:underline inline-flex"><Trash2 size={12} /></button>
                        </td>
                      </tr>
                    ))}

                    {activeTab === 'partners' && db.partners.map(pt => (
                      <tr key={pt.id} className="hover:bg-white/[0.01]">
                        <td className="p-4 font-bold text-white">{pt.name}</td>
                        <td className="p-4 text-slate-400">{pt.type}</td>
                        <td className="p-4 text-slate-400 truncate max-w-[150px]">{pt.website}</td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => openEditModal(pt.id)} className="text-[#00f0ff] hover:underline inline-flex"><Edit2 size={12} /></button>
                          <button onClick={() => db.deletePartner(pt.id)} className="text-red-400 hover:underline inline-flex"><Trash2 size={12} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: APPLICATIONS REVIEW */}
          {activeTab === 'applications' && (
            <div className="space-y-6">
              <h2 className="font-sans font-extrabold text-2xl text-white">Recruitment Applications Queue</h2>
              
              {db.applications.length === 0 ? (
                <div className="glass-panel p-16 text-center text-slate-500 font-mono text-sm border border-white/5 rounded-xl">
                  "No applications logged."
                </div>
              ) : (
                <div className="space-y-4">
                  {db.applications.map(app => (
                    <div key={app.id} className="glass-panel p-6 rounded-xl border border-white/5 text-left space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                        <div>
                          <h4 className="font-sans font-extrabold text-lg text-white">{app.name}</h4>
                          <span className="font-mono text-xs text-slate-400">{app.branch} ({app.year}) | Submitted: {app.submittedAt}</span>
                        </div>
                        
                        {/* Status Toggle buttons */}
                        <div className="flex items-center gap-2">
                          <select
                            value={app.status}
                            onChange={e => db.updateApplicationStatus(app.id, e.target.value as any)}
                            className="bg-[#0a0a0f] border border-white/10 text-white font-mono text-[10px] px-2 py-1 rounded focus:outline-none"
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                          </select>
                          <button
                            onClick={() => db.deleteApplication(app.id)}
                            className="p-1 text-red-400 bg-red-400/5 hover:bg-red-400/10 rounded border border-red-400/10"
                            title="Delete Application"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-xs text-slate-300">
                        <div><strong>Preferred Division:</strong> {app.division}</div>
                        <div><strong>Phone:</strong> {app.phone} | <strong>Email:</strong> {app.email}</div>
                        <div className="sm:col-span-2"><strong>Skills:</strong> {app.skills}</div>
                        <div className="sm:col-span-2"><strong>Motivation:</strong> {app.motivation}</div>
                        {app.projects && <div className="sm:col-span-2"><strong>Projects:</strong> {app.projects}</div>}
                        
                        {/* Resource links */}
                        <div className="sm:col-span-2 flex flex-wrap gap-2 pt-2 border-t border-white/5 font-mono text-[10px]">
                          {app.github && <a href={app.github} target="_blank" rel="noreferrer" className="text-[#00f0ff] hover:underline">GitHub</a>}
                          {app.linkedin && <a href={app.linkedin} target="_blank" rel="noreferrer" className="text-[#00f0ff] hover:underline">LinkedIn</a>}
                          {app.portfolio && <a href={app.portfolio} target="_blank" rel="noreferrer" className="text-[#00f0ff] hover:underline">Portfolio</a>}
                          <span>Resume PDF: {app.resumeName}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SETTINGS & DATABASE TRANSFERS */}
          {activeTab === 'settings' && (
            <div className="space-y-8">
              <h2 className="font-sans font-extrabold text-2xl text-white">SYSTEM HOOKS & DATABASE TRANSFERS</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Database Backup & Export */}
                <div className="glass-panel p-6 rounded-xl border border-white/5 text-left space-y-4">
                  <h3 className="font-sans font-bold text-lg text-white flex items-center gap-1.5">
                    <Download size={18} className="text-[#00f0ff]" /> Backup Export
                  </h3>
                  <p className="font-sans text-xs text-slate-400 leading-relaxed">
                    Export the current local database state (including dynamic events, modified members, or submitted recruitment forms) as a JSON backup file.
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
                    Paste a previously exported database JSON dump in the box below to overwrite the current client state.
                  </p>
                  <form onSubmit={handleImport} className="space-y-4">
                    <textarea
                      value={importJson}
                      onChange={e => setImportJson(e.target.value)}
                      placeholder="Paste JSON Database dump here..."
                      rows={4}
                      className="w-full px-3 py-2 text-xs font-mono text-white glass-input rounded-lg placeholder-slate-700"
                    />

                    {importStatus === 'success' && <span className="font-mono text-[10px] text-emerald-400 block">Database state restored successfully!</span>}
                    {importStatus === 'error' && <span className="font-mono text-[10px] text-red-400 block">Error: Invalid database JSON syntax.</span>}

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
                {formMode} {activeTab.slice(0, -1)} Record
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-sans text-xs text-slate-400 mb-1 block">Progress Percentage (0-100) *</label>
                      <input
                        type="number"
                        min="0" max="100"
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
                  className="px-6 py-2.5 font-sans font-bold text-xs uppercase tracking-wider text-black bg-[#00f0ff] hover:bg-[#00e0ef] rounded-lg transition-all"
                >
                  Save Record
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
