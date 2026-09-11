import React, { useState, useEffect, useMemo } from 'react';
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
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Key,
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
  Application,
  ContactMessage,
} from '../data/seedData';
import {
  adminGetEventRegistrations,
  adminUpdateRegistrationStatus,
  adminDeleteRegistration,
  adminGetUsers,
  adminCreateUser,
  adminUpdateUser,
  adminDeleteUser,
  type EventRegistration,
  type AdminUserRecord,
} from '../services/adminApi';

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

  // RBAC Roles
  const userRole = auth.user?.role || 'ADMIN';
  const isSuperAdmin = userRole === 'SUPERADMIN' || userRole === 'SUPER_ADMIN';
  const isModerator = userRole === 'MODERATOR' || userRole === 'EDITOR';
  const canMutate = !isModerator;

  // Login form state
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Tab navigation
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Notification banners
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [memberDivisionFilter, setMemberDivisionFilter] = useState('all');
  const [memberLeadershipFilter, setMemberLeadershipFilter] = useState('all');
  const [projectStatusFilter, setProjectStatusFilter] = useState('all');
  const [eventStatusFilter, setEventStatusFilter] = useState('all');
  const [announcementCatFilter, setAnnouncementCatFilter] = useState('all');
  const [galleryCatFilter, setGalleryCatFilter] = useState('all');
  const [appFilter, setAppFilter] = useState<'all' | 'pending' | 'reviewed' | 'accepted' | 'rejected'>('all');
  const [msgFilter, setMsgFilter] = useState<'all' | 'unread' | 'read'>('all');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Reset pagination when changing tab or filters
  useEffect(() => {
    setCurrentPage(1);
    setSearchQuery('');
  }, [
    activeTab,
    memberDivisionFilter,
    memberLeadershipFilter,
    projectStatusFilter,
    eventStatusFilter,
    announcementCatFilter,
    galleryCatFilter,
    appFilter,
    msgFilter,
  ]);

  // Modal / Form state for Domain Entities
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editId, setEditId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Custom states for JSON Import/Export
  const [importJson, setImportJson] = useState('');
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Confirmation Delete Modal
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    itemName?: string;
    onConfirm: () => Promise<void>;
    isDeleting: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: async () => {},
    isDeleting: false,
  });

  // Event Registrations Modal state
  const [selectedEventForReg, setSelectedEventForReg] = useState<Event | null>(null);
  const [eventRegistrations, setEventRegistrations] = useState<EventRegistration[]>([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);
  const [regSearch, setRegSearch] = useState('');

  // Application Review Modal state
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [updatingAppStatus, setUpdatingAppStatus] = useState(false);

  // Message View Modal state
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  // Admin Users state (SUPERADMIN only)
  const [adminUsers, setAdminUsers] = useState<AdminUserRecord[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userModalMode, setUserModalMode] = useState<'create' | 'edit'>('create');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [userForm, setUserForm] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    role: 'ADMIN' as 'SUPERADMIN' | 'ADMIN' | 'MODERATOR',
    isActive: true,
  });
  const [userFormError, setUserFormError] = useState<string | null>(null);
  const [isSavingUser, setIsSavingUser] = useState(false);

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
    isLeadership: false,
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
    iconName: 'Code',
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
    registrationLink: '',
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
    status: 'active',
  });
  const [projectTagsStr, setProjectTagsStr] = useState('');

  const [announcementForm, setAnnouncementForm] = useState<Omit<Announcement, 'id'>>({
    title: '',
    date: '',
    content: '',
    category: 'general',
    active: true,
  });

  const [galleryForm, setGalleryForm] = useState<Omit<GalleryItem, 'id'>>({
    image: '',
    caption: '',
    category: 'events',
  });

  const [achievementForm, setAchievementForm] = useState<Omit<Achievement, 'id'>>({
    title: '',
    date: '',
    description: '',
    image: '',
    badge: '',
  });

  const [partnerForm, setPartnerForm] = useState<Omit<Partner, 'id'>>({
    name: '',
    logo: '',
    type: 'Technology Sponsor',
    description: '',
    website: '',
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

  // Load Admin Users if SUPERADMIN on settings tab
  const loadAdminUsers = async () => {
    if (!isSuperAdmin) return;
    setLoadingUsers(true);
    try {
      const users = await adminGetUsers();
      setAdminUsers(users);
    } catch (err: any) {
      console.warn('Could not load admin users:', err.message);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'settings' && isSuperAdmin) {
      loadAdminUsers();
    }
  }, [activeTab, isSuperAdmin]);

  const showFeedback = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const showError = (msg: string) => {
    setGlobalError(msg);
    setTimeout(() => setGlobalError(null), 6000);
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
    if (!canMutate) return;
    try {
      await db.updateFaculty(facultyForm);
      setFacultyStatus('success');
      showFeedback('Faculty Coordinator profile updated successfully.');
      setTimeout(() => setFacultyStatus('idle'), 3000);
    } catch (err: any) {
      setFacultyStatus('error');
      showError(err.message || 'Failed to update faculty profile');
    }
  };

  const handleSaveStats = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canMutate) return;
    try {
      await db.updateStats(statsForm);
      setStatsStatus('success');
      showFeedback('Statistics counters updated successfully.');
      setTimeout(() => setStatsStatus('idle'), 3000);
    } catch (err: any) {
      setStatsStatus('error');
      showError(err.message || 'Failed to update stats');
    }
  };

  // Safe Deletion Trigger Helper
  const confirmDeleteAction = (
    title: string,
    message: string,
    onConfirm: () => Promise<void>,
    itemName?: string
  ) => {
    setDeleteConfirm({
      isOpen: true,
      title,
      message,
      itemName,
      onConfirm,
      isDeleting: false,
    });
  };

  const executeDelete = async () => {
    setDeleteConfirm(prev => ({ ...prev, isDeleting: true }));
    try {
      await deleteConfirm.onConfirm();
      setDeleteConfirm(prev => ({ ...prev, isOpen: false, isDeleting: false }));
    } catch (err: any) {
      setDeleteConfirm(prev => ({ ...prev, isDeleting: false }));
      showError(err?.message || 'Delete operation failed.');
    }
  };

  // CRUD Modal Trigger helpers
  const openCreateModal = () => {
    setFormMode('create');
    setEditId(null);
    setFormError(null);
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
        isLeadership: false,
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
        iconName: 'Code',
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
        registrationLink: '#',
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
        status: 'active',
      });
      setProjectTagsStr('React, Node.js');
    } else if (activeTab === 'announcements') {
      setAnnouncementForm({
        title: '',
        date: new Date().toISOString().split('T')[0],
        content: '',
        category: 'general',
        active: true,
      });
    } else if (activeTab === 'gallery') {
      setGalleryForm({
        image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800',
        caption: '',
        category: 'events',
      });
    } else if (activeTab === 'achievements') {
      setAchievementForm({
        title: '',
        date: new Date().toISOString().slice(0, 7),
        description: '',
        image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&q=80&w=600',
        badge: 'Award Winner',
      });
    } else if (activeTab === 'partners') {
      setPartnerForm({
        name: '',
        logo: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&q=80&w=200',
        type: 'Technology Sponsor',
        description: '',
        website: 'https://github.com',
      });
    }
  };

  const openEditModal = (id: string) => {
    setFormMode('edit');
    setEditId(id);
    setFormError(null);
    setIsFormOpen(true);

    if (activeTab === 'members') {
      const item = db.members.find(m => m.id === id);
      if (item) {
        setMemberForm(item);
        setMemberSkillsStr(item.skills?.join(', ') || '');
      }
    } else if (activeTab === 'divisions') {
      const item = db.divisions.find(d => d.id === id);
      if (item) {
        setDivisionForm(item);
        setDivRespStr(item.responsibilities?.join('\n') || '');
        setDivSkillsStr(item.skills?.join(', ') || '');
        setDivToolsStr(item.tools?.join(', ') || '');
      }
    } else if (activeTab === 'events') {
      const item = db.events.find(e => e.id === id);
      if (item) setEventForm(item);
    } else if (activeTab === 'projects') {
      const item = db.projects.find(p => p.id === id);
      if (item) {
        setProjectForm(item);
        setProjectTagsStr(item.tags?.join(', ') || '');
      }
    } else if (activeTab === 'announcements') {
      const item = db.announcements.find(a => a.id === id);
      if (item) setAnnouncementForm(item);
    } else if (activeTab === 'gallery') {
      const item = db.gallery.find(g => g.id === id);
      if (item) setGalleryForm(item);
    } else if (activeTab === 'achievements') {
      const item = db.achievements.find(a => a.id === id);
      if (item) setAchievementForm(item);
    } else if (activeTab === 'partners') {
      const item = db.partners.find(p => p.id === id);
      if (item) setPartnerForm(item);
    }
  };

  // Validations & Save logic
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canMutate) return;
    setFormError(null);

    // Client-side field validations
    if (activeTab === 'members') {
      if (!memberForm.name.trim()) {
        setFormError('Member name is required.');
        return;
      }
      if (!memberForm.email.trim() || !memberForm.email.includes('@')) {
        setFormError('A valid email address is required.');
        return;
      }
    } else if (activeTab === 'projects') {
      if (!projectForm.title.trim()) {
        setFormError('Project title is required.');
        return;
      }
      if (projectForm.progress < 0 || projectForm.progress > 100) {
        setFormError('Progress percentage must be between 0 and 100.');
        return;
      }
    } else if (activeTab === 'events') {
      if (!eventForm.title.trim()) {
        setFormError('Event title is required.');
        return;
      }
      if (!eventForm.date) {
        setFormError('Event date is required.');
        return;
      }
    }

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
          tools: toolsArray,
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
      setFormError(err?.message || 'Failed to save record.');
    } finally {
      setIsSaving(false);
    }
  };

  // Event Registrations Handlers
  const handleOpenRegistrations = async (event: Event) => {
    setSelectedEventForReg(event);
    setLoadingRegistrations(true);
    setRegSearch('');
    try {
      const regs = await adminGetEventRegistrations(event.id);
      setEventRegistrations(regs);
    } catch (err: any) {
      showError(err.message || 'Could not load registrations for event');
      setEventRegistrations([]);
    } finally {
      setLoadingRegistrations(false);
    }
  };

  const handleUpdateRegStatus = async (regId: string, newStatus: string) => {
    if (!canMutate) return;
    try {
      const updated = await adminUpdateRegistrationStatus(regId, newStatus);
      setEventRegistrations(prev =>
        prev.map(r => (r.id === regId ? { ...r, status: updated.status } : r))
      );
      showFeedback(`Registration marked as ${newStatus}.`);
    } catch (err: any) {
      showError(err.message || 'Failed to update registration status');
    }
  };

  const handleDeleteReg = (reg: EventRegistration) => {
    if (!canMutate) return;
    confirmDeleteAction(
      'Delete Attendee Registration',
      `Are you sure you want to remove ${reg.name} (${reg.email}) from the attendee list?`,
      async () => {
        await adminDeleteRegistration(reg.id);
        setEventRegistrations(prev => prev.filter(r => r.id !== reg.id));
        showFeedback('Attendee registration removed.');
      },
      reg.name
    );
  };

  // Admin User CRUD Handlers (SUPERADMIN only)
  const openCreateUserModal = () => {
    setUserModalMode('create');
    setEditingUserId(null);
    setUserForm({
      username: '',
      name: '',
      email: '',
      password: '',
      role: 'ADMIN',
      isActive: true,
    });
    setUserFormError(null);
    setIsUserModalOpen(true);
  };

  const openEditUserModal = (user: AdminUserRecord) => {
    setUserModalMode('edit');
    setEditingUserId(user.id);
    setUserForm({
      username: user.username,
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      isActive: user.isActive,
    });
    setUserFormError(null);
    setIsUserModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) return;
    setUserFormError(null);

    if (userModalMode === 'create') {
      if (!userForm.username.trim() || userForm.username.length < 3) {
        setUserFormError('Username must be at least 3 characters.');
        return;
      }
      if (!userForm.password || userForm.password.length < 8) {
        setUserFormError('Password must be at least 8 characters long.');
        return;
      }
      if (!userForm.email.includes('@')) {
        setUserFormError('A valid email address is required.');
        return;
      }
    }

    setIsSavingUser(true);
    try {
      if (userModalMode === 'create') {
        const created = await adminCreateUser({
          username: userForm.username.trim(),
          name: userForm.name.trim(),
          email: userForm.email.trim(),
          password: userForm.password,
          role: userForm.role,
          isActive: userForm.isActive,
        });
        setAdminUsers(prev => [created, ...prev]);
        showFeedback(`Admin account "${created.username}" created successfully.`);
      } else if (editingUserId) {
        const payload: { name?: string; role?: 'SUPERADMIN' | 'ADMIN' | 'MODERATOR'; isActive?: boolean; password?: string } = {
          name: userForm.name.trim(),
          role: userForm.role,
          isActive: userForm.isActive,
        };
        if (userForm.password.trim()) {
          if (userForm.password.length < 8) {
            setUserFormError('New password must be at least 8 characters long.');
            setIsSavingUser(false);
            return;
          }
          payload.password = userForm.password;
        }
        const updated = await adminUpdateUser(editingUserId, payload);
        setAdminUsers(prev => prev.map(u => (u.id === editingUserId ? updated : u)));
        showFeedback(`Admin account "${updated.username}" updated.`);
      }
      setIsUserModalOpen(false);
    } catch (err: any) {
      setUserFormError(err.message || 'Failed to save admin account.');
    } finally {
      setIsSavingUser(false);
    }
  };

  const handleDeleteUser = (user: AdminUserRecord) => {
    if (!isSuperAdmin) return;
    confirmDeleteAction(
      'Delete Administrator Account',
      `Are you sure you want to permanently delete admin account "${user.username}" (${user.email})?`,
      async () => {
        await adminDeleteUser(user.id);
        setAdminUsers(prev => prev.filter(u => u.id !== user.id));
        showFeedback(`Admin account "${user.username}" deleted.`);
      },
      user.username
    );
  };

  // FILTERED COLLECTIONS WITH SEARCH
  const filteredMembers = useMemo(() => {
    return db.members.filter(m => {
      const matchesSearch =
        !searchQuery ||
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDiv =
        memberDivisionFilter === 'all' ||
        m.division.toLowerCase() === memberDivisionFilter.toLowerCase();
      const matchesLead =
        memberLeadershipFilter === 'all' ||
        (memberLeadershipFilter === 'lead' ? m.isLeadership : !m.isLeadership);
      return matchesSearch && matchesDiv && matchesLead;
    });
  }, [db.members, searchQuery, memberDivisionFilter, memberLeadershipFilter]);

  const filteredDivisions = useMemo(() => {
    return db.divisions.filter(d => {
      return (
        !searchQuery ||
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [db.divisions, searchQuery]);

  const filteredProjects = useMemo(() => {
    return db.projects.filter(p => {
      const matchesSearch =
        !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.mentor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus =
        projectStatusFilter === 'all' ||
        p.status.toLowerCase() === projectStatusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [db.projects, searchQuery, projectStatusFilter]);

  const filteredEvents = useMemo(() => {
    return db.events.filter(e => {
      const matchesSearch =
        !searchQuery ||
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.venue.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        eventStatusFilter === 'all' || e.status === eventStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [db.events, searchQuery, eventStatusFilter]);

  const filteredAnnouncements = useMemo(() => {
    return db.announcements.filter(a => {
      const matchesSearch =
        !searchQuery ||
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat =
        announcementCatFilter === 'all' || a.category === announcementCatFilter;
      return matchesSearch && matchesCat;
    });
  }, [db.announcements, searchQuery, announcementCatFilter]);

  const filteredGallery = useMemo(() => {
    return db.gallery.filter(g => {
      const matchesSearch =
        !searchQuery ||
        g.caption.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat =
        galleryCatFilter === 'all' || g.category === galleryCatFilter;
      return matchesSearch && matchesCat;
    });
  }, [db.gallery, searchQuery, galleryCatFilter]);

  const filteredAchievements = useMemo(() => {
    return db.achievements.filter(a => {
      return (
        !searchQuery ||
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.badge.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [db.achievements, searchQuery]);

  const filteredPartners = useMemo(() => {
    return db.partners.filter(p => {
      return (
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [db.partners, searchQuery]);

  const filteredApplications = useMemo(() => {
    return db.applications.filter(app => {
      const matchesFilter = appFilter === 'all' || app.status === appFilter;
      const matchesSearch =
        !searchQuery ||
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.branch.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [db.applications, appFilter, searchQuery]);

  const filteredMessages = useMemo(() => {
    return db.contactMessages.filter(msg => {
      const matchesFilter =
        msgFilter === 'all' || (msgFilter === 'unread' ? !msg.read : msg.read);
      const matchesSearch =
        !searchQuery ||
        msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [db.contactMessages, msgFilter, searchQuery]);

  // Current active items for table pagination
  const currentCollectionItems = useMemo(() => {
    switch (activeTab) {
      case 'members':
        return filteredMembers;
      case 'divisions':
        return filteredDivisions;
      case 'events':
        return filteredEvents;
      case 'projects':
        return filteredProjects;
      case 'announcements':
        return filteredAnnouncements;
      case 'gallery':
        return filteredGallery;
      case 'achievements':
        return filteredAchievements;
      case 'partners':
        return filteredPartners;
      case 'applications':
        return filteredApplications;
      case 'messages':
        return filteredMessages;
      default:
        return [];
    }
  }, [
    activeTab,
    filteredMembers,
    filteredDivisions,
    filteredEvents,
    filteredProjects,
    filteredAnnouncements,
    filteredGallery,
    filteredAchievements,
    filteredPartners,
    filteredApplications,
    filteredMessages,
  ]);

  const totalPages = Math.max(1, Math.ceil(currentCollectionItems.length / pageSize));
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return currentCollectionItems.slice(start, start + pageSize);
  }, [currentCollectionItems, currentPage, pageSize]);

  const pendingAppsCount = db.applications.filter(a => a.status === 'pending').length;
  const unreadMessagesCount = db.contactMessages.filter(m => !m.read).length;

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
            Input authorized clearance credentials to access database management parameters, applicant review queues, and system telemetry.
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

            {authError && (
              <span className="font-mono text-[10px] text-red-400 block p-2 rounded bg-red-500/10 border border-red-500/20">
                {authError}
              </span>
            )}

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

  return (
    <div className="min-h-screen pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-100 text-left">
      {/* Top Notification Toast */}
      {actionSuccess && (
        <div className="fixed top-20 right-8 z-50 flex items-center gap-2 px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 font-sans text-xs shadow-2xl backdrop-blur-md animate-fade-in">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Global Error Banner */}
      {(db.error || globalError) && (
        <div className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 font-sans text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-400 shrink-0" />
            <span>{globalError || db.error}</span>
          </div>
          <button
            onClick={() => {
              setGlobalError(null);
              db.refreshData();
            }}
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
              <div className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] animate-pulse" />
              <div>
                <span className="font-mono text-xs font-bold text-white block">
                  {auth.user?.username || 'ADMIN'}
                </span>
                <span
                  className={`font-mono text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.2 rounded border ${
                    isSuperAdmin
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : isModerator
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      : 'bg-[#00f0ff]/20 text-[#00f0ff] border-[#00f0ff]/30'
                  }`}
                >
                  {userRole}
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
              activeTab === 'dashboard'
                ? 'bg-[#00f0ff]/10 text-[#00f0ff]'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <ShieldCheck size={14} />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('members')}
            className={`w-full text-left px-3 py-2 rounded-lg font-sans text-xs uppercase font-bold tracking-wider transition-colors flex items-center gap-2 ${
              activeTab === 'members'
                ? 'bg-[#00f0ff]/10 text-[#00f0ff]'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Users size={14} />
            <span>Members ({db.members.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('divisions')}
            className={`w-full text-left px-3 py-2 rounded-lg font-sans text-xs uppercase font-bold tracking-wider transition-colors flex items-center gap-2 ${
              activeTab === 'divisions'
                ? 'bg-[#00f0ff]/10 text-[#00f0ff]'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Layers size={14} />
            <span>Divisions ({db.divisions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`w-full text-left px-3 py-2 rounded-lg font-sans text-xs uppercase font-bold tracking-wider transition-colors flex items-center gap-2 ${
              activeTab === 'events'
                ? 'bg-[#00f0ff]/10 text-[#00f0ff]'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Calendar size={14} />
            <span>Events ({db.events.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`w-full text-left px-3 py-2 rounded-lg font-sans text-xs uppercase font-bold tracking-wider transition-colors flex items-center gap-2 ${
              activeTab === 'projects'
                ? 'bg-[#00f0ff]/10 text-[#00f0ff]'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <FolderGit2 size={14} />
            <span>Projects ({db.projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`w-full text-left px-3 py-2 rounded-lg font-sans text-xs uppercase font-bold tracking-wider transition-colors flex items-center gap-2 ${
              activeTab === 'gallery'
                ? 'bg-[#00f0ff]/10 text-[#00f0ff]'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Image size={14} />
            <span>Gallery ({db.gallery.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('announcements')}
            className={`w-full text-left px-3 py-2 rounded-lg font-sans text-xs uppercase font-bold tracking-wider transition-colors flex items-center gap-2 ${
              activeTab === 'announcements'
                ? 'bg-[#00f0ff]/10 text-[#00f0ff]'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Bell size={14} />
            <span>Announcements ({db.announcements.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('achievements')}
            className={`w-full text-left px-3 py-2 rounded-lg font-sans text-xs uppercase font-bold tracking-wider transition-colors flex items-center gap-2 ${
              activeTab === 'achievements'
                ? 'bg-[#00f0ff]/10 text-[#00f0ff]'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Award size={14} />
            <span>Achievements ({db.achievements.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('partners')}
            className={`w-full text-left px-3 py-2 rounded-lg font-sans text-xs uppercase font-bold tracking-wider transition-colors flex items-center gap-2 ${
              activeTab === 'partners'
                ? 'bg-[#00f0ff]/10 text-[#00f0ff]'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Handshake size={14} />
            <span>Partners ({db.partners.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('applications')}
            className={`w-full text-left px-3 py-2 rounded-lg font-sans text-xs uppercase font-bold tracking-wider transition-colors relative flex items-center justify-between ${
              activeTab === 'applications'
                ? 'bg-[#00f0ff]/10 text-[#00f0ff]'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
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
              activeTab === 'messages'
                ? 'bg-[#00f0ff]/10 text-[#00f0ff]'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
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
            className={`w-full text-left px-3 py-2 rounded-lg font-sans text-xs uppercase font-bold tracking-wider transition-colors flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'bg-[#00f0ff]/10 text-[#00f0ff]'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Key size={14} />
            <span>Settings</span>
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
                          onClick={() => setSelectedApplication(app)}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/20 cursor-pointer transition-all"
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
                        onClick={() => setSelectedMessage(msg)}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/20 cursor-pointer transition-all"
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
                        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
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

          {/* TABLE VIEWS FOR STANDARD CRUD MODULES */}
          {activeTab !== 'dashboard' &&
            activeTab !== 'applications' &&
            activeTab !== 'messages' &&
            activeTab !== 'settings' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-sans font-extrabold text-2xl text-white capitalize">
                      {activeTab} Manager
                    </h2>
                    <span className="font-mono text-xs text-slate-400">
                      Total records: {currentCollectionItems.length}
                    </span>
                  </div>

                  {canMutate && (
                    <button
                      onClick={openCreateModal}
                      className="flex items-center gap-1.5 px-4 py-2 font-sans font-bold text-xs uppercase tracking-wider text-black bg-[#00f0ff] hover:bg-[#00e0ef] rounded-lg transition-all shadow-[0_0_12px_rgba(0,240,255,0.2)] w-fit"
                    >
                      <Plus size={14} /> Create Record
                    </button>
                  )}
                </div>

                {/* Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row gap-3 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                  <div className="relative flex-1">
                    <Search
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder={`Search ${activeTab} by keyword...`}
                      className="w-full pl-9 pr-4 py-2 text-xs text-white glass-input rounded-lg font-mono placeholder-slate-600 focus:outline-none"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>

                  {/* Contextual Filters */}
                  {activeTab === 'members' && (
                    <div className="flex gap-2">
                      <select
                        value={memberDivisionFilter}
                        onChange={e => setMemberDivisionFilter(e.target.value)}
                        className="px-3 py-2 text-xs text-white bg-[#0a0a0f] border border-white/10 rounded-lg focus:outline-none font-mono"
                      >
                        <option value="all">All Divisions</option>
                        <option value="App Dev">App Dev</option>
                        <option value="R&D">R&D</option>
                        <option value="Leadership">Leadership</option>
                        <option value="Other">Other</option>
                      </select>
                      <select
                        value={memberLeadershipFilter}
                        onChange={e => setMemberLeadershipFilter(e.target.value)}
                        className="px-3 py-2 text-xs text-white bg-[#0a0a0f] border border-white/10 rounded-lg focus:outline-none font-mono"
                      >
                        <option value="all">All Roles</option>
                        <option value="lead">Leadership Only</option>
                        <option value="members">Non-Leadership</option>
                      </select>
                    </div>
                  )}

                  {activeTab === 'projects' && (
                    <select
                      value={projectStatusFilter}
                      onChange={e => setProjectStatusFilter(e.target.value)}
                      className="px-3 py-2 text-xs text-white bg-[#0a0a0f] border border-white/10 rounded-lg focus:outline-none font-mono"
                    >
                      <option value="all">All Statuses</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="on-hold">On Hold</option>
                    </select>
                  )}

                  {activeTab === 'events' && (
                    <select
                      value={eventStatusFilter}
                      onChange={e => setEventStatusFilter(e.target.value)}
                      className="px-3 py-2 text-xs text-white bg-[#0a0a0f] border border-white/10 rounded-lg focus:outline-none font-mono"
                    >
                      <option value="all">All Events</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="past">Past</option>
                    </select>
                  )}

                  {activeTab === 'announcements' && (
                    <select
                      value={announcementCatFilter}
                      onChange={e => setAnnouncementCatFilter(e.target.value)}
                      className="px-3 py-2 text-xs text-white bg-[#0a0a0f] border border-white/10 rounded-lg focus:outline-none font-mono"
                    >
                      <option value="all">All Categories</option>
                      <option value="recruitment">Recruitment</option>
                      <option value="event">Event</option>
                      <option value="alert">Alert</option>
                      <option value="general">General</option>
                    </select>
                  )}

                  {activeTab === 'gallery' && (
                    <select
                      value={galleryCatFilter}
                      onChange={e => setGalleryCatFilter(e.target.value)}
                      className="px-3 py-2 text-xs text-white bg-[#0a0a0f] border border-white/10 rounded-lg focus:outline-none font-mono"
                    >
                      <option value="all">All Categories</option>
                      <option value="events">Events</option>
                      <option value="workshops">Workshops</option>
                      <option value="meetings">Meetings</option>
                      <option value="hackathons">Hackathons</option>
                      <option value="projects">Projects</option>
                      <option value="community">Community</option>
                    </select>
                  )}
                </div>

                {/* Main Table */}
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
                      {paginatedItems.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-slate-500 font-mono text-xs">
                            No records matching query found.
                          </td>
                        </tr>
                      ) : null}

                      {/* MEMBERS */}
                      {activeTab === 'members' &&
                        (paginatedItems as Member[]).map(m => (
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
                              {canMutate && (
                                <>
                                  <button
                                    onClick={() => openEditModal(m.id)}
                                    className="text-[#00f0ff] hover:underline inline-flex p-1"
                                    title="Edit"
                                  >
                                    <Edit2 size={13} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      confirmDeleteAction(
                                        'Delete Member',
                                        `Are you sure you want to delete member "${m.name}"? This action cannot be undone.`,
                                        async () => {
                                          await db.deleteMember(m.id);
                                          showFeedback('Member deleted successfully.');
                                        },
                                        m.name
                                      )
                                    }
                                    className="text-red-400 hover:underline inline-flex p-1"
                                    title="Delete"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}

                      {/* DIVISIONS */}
                      {activeTab === 'divisions' &&
                        (paginatedItems as Division[]).map(d => {
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
                                {canMutate && (
                                  <>
                                    <button
                                      onClick={() => openEditModal(d.id)}
                                      className="text-[#00f0ff] hover:underline inline-flex p-1"
                                      title="Edit"
                                    >
                                      <Edit2 size={13} />
                                    </button>
                                    <button
                                      onClick={() =>
                                        confirmDeleteAction(
                                          'Delete Division',
                                          `Are you sure you want to delete "${d.name}"? Existing member or project relationships may be affected.`,
                                          async () => {
                                            await db.deleteDivision(d.id);
                                            showFeedback('Division deleted successfully.');
                                          },
                                          d.name
                                        )
                                      }
                                      className="text-red-400 hover:underline inline-flex p-1"
                                      title="Delete"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </>
                                )}
                              </td>
                            </tr>
                          );
                        })}

                      {/* EVENTS */}
                      {activeTab === 'events' &&
                        (paginatedItems as Event[]).map(e => (
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
                                onClick={() => handleOpenRegistrations(e)}
                                className="text-purple-400 hover:underline inline-flex items-center gap-1 p-1 text-[11px] font-mono mr-1"
                                title="View Event Registrations"
                              >
                                <Users size={12} /> Registrations
                              </button>
                              {canMutate && (
                                <>
                                  <button
                                    onClick={() => openEditModal(e.id)}
                                    className="text-[#00f0ff] hover:underline inline-flex p-1"
                                    title="Edit"
                                  >
                                    <Edit2 size={13} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      confirmDeleteAction(
                                        'Delete Event',
                                        `Are you sure you want to delete event "${e.title}"?`,
                                        async () => {
                                          await db.deleteEvent(e.id);
                                          showFeedback('Event deleted successfully.');
                                        },
                                        e.title
                                      )
                                    }
                                    className="text-red-400 hover:underline inline-flex p-1"
                                    title="Delete"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}

                      {/* PROJECTS */}
                      {activeTab === 'projects' &&
                        (paginatedItems as Project[]).map(p => (
                          <tr key={p.id} className="hover:bg-white/[0.01]">
                            <td className="p-4 font-bold text-white truncate max-w-[180px]">{p.title}</td>
                            <td className="p-4 text-slate-400">{p.mentor}</td>
                            <td className="p-4 text-slate-400 font-mono">
                              {p.status} ({p.progress}%)
                            </td>
                            <td className="p-4 text-right space-x-2">
                              {canMutate && (
                                <>
                                  <button
                                    onClick={() => openEditModal(p.id)}
                                    className="text-[#00f0ff] hover:underline inline-flex p-1"
                                    title="Edit"
                                  >
                                    <Edit2 size={13} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      confirmDeleteAction(
                                        'Delete Project',
                                        `Are you sure you want to delete project "${p.title}"?`,
                                        async () => {
                                          await db.deleteProject(p.id);
                                          showFeedback('Project deleted successfully.');
                                        },
                                        p.title
                                      )
                                    }
                                    className="text-red-400 hover:underline inline-flex p-1"
                                    title="Delete"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}

                      {/* ANNOUNCEMENTS */}
                      {activeTab === 'announcements' &&
                        (paginatedItems as Announcement[]).map(an => (
                          <tr key={an.id} className="hover:bg-white/[0.01]">
                            <td className="p-4 font-bold text-white truncate max-w-[180px]">{an.title}</td>
                            <td className="p-4 text-slate-400 font-mono">{an.date}</td>
                            <td className="p-4 text-slate-400 font-mono uppercase text-[10px]">{an.category}</td>
                            <td className="p-4 text-right space-x-2">
                              {canMutate && (
                                <>
                                  <button
                                    onClick={() => openEditModal(an.id)}
                                    className="text-[#00f0ff] hover:underline inline-flex p-1"
                                    title="Edit"
                                  >
                                    <Edit2 size={13} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      confirmDeleteAction(
                                        'Delete Announcement',
                                        `Are you sure you want to delete "${an.title}"?`,
                                        async () => {
                                          await db.deleteAnnouncement(an.id);
                                          showFeedback('Announcement deleted successfully.');
                                        },
                                        an.title
                                      )
                                    }
                                    className="text-red-400 hover:underline inline-flex p-1"
                                    title="Delete"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}

                      {/* GALLERY */}
                      {activeTab === 'gallery' &&
                        (paginatedItems as GalleryItem[]).map(g => (
                          <tr key={g.id} className="hover:bg-white/[0.01]">
                            <td className="p-4 font-bold text-white truncate max-w-[180px]">{g.caption}</td>
                            <td className="p-4 text-slate-400 font-mono uppercase text-[10px]">{g.category}</td>
                            <td className="p-4 text-slate-400 truncate max-w-[150px] font-mono text-[10px]">{g.image}</td>
                            <td className="p-4 text-right space-x-2">
                              {canMutate && (
                                <>
                                  <button
                                    onClick={() => openEditModal(g.id)}
                                    className="text-[#00f0ff] hover:underline inline-flex p-1"
                                    title="Edit"
                                  >
                                    <Edit2 size={13} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      confirmDeleteAction(
                                        'Delete Gallery Item',
                                        `Are you sure you want to delete this gallery photo?`,
                                        async () => {
                                          await db.deleteGalleryItem(g.id);
                                          showFeedback('Gallery item deleted successfully.');
                                        },
                                        g.caption
                                      )
                                    }
                                    className="text-red-400 hover:underline inline-flex p-1"
                                    title="Delete"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}

                      {/* ACHIEVEMENTS */}
                      {activeTab === 'achievements' &&
                        (paginatedItems as Achievement[]).map(ac => (
                          <tr key={ac.id} className="hover:bg-white/[0.01]">
                            <td className="p-4 font-bold text-white truncate max-w-[180px]">{ac.title}</td>
                            <td className="p-4 text-slate-400 font-mono">{ac.date}</td>
                            <td className="p-4 text-slate-400 font-mono">{ac.badge}</td>
                            <td className="p-4 text-right space-x-2">
                              {canMutate && (
                                <>
                                  <button
                                    onClick={() => openEditModal(ac.id)}
                                    className="text-[#00f0ff] hover:underline inline-flex p-1"
                                    title="Edit"
                                  >
                                    <Edit2 size={13} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      confirmDeleteAction(
                                        'Delete Achievement',
                                        `Are you sure you want to delete "${ac.title}"?`,
                                        async () => {
                                          await db.deleteAchievement(ac.id);
                                          showFeedback('Achievement deleted successfully.');
                                        },
                                        ac.title
                                      )
                                    }
                                    className="text-red-400 hover:underline inline-flex p-1"
                                    title="Delete"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}

                      {/* PARTNERS */}
                      {activeTab === 'partners' &&
                        (paginatedItems as Partner[]).map(pt => (
                          <tr key={pt.id} className="hover:bg-white/[0.01]">
                            <td className="p-4 font-bold text-white">{pt.name}</td>
                            <td className="p-4 text-slate-400">{pt.type}</td>
                            <td className="p-4 text-slate-400 truncate max-w-[150px]">{pt.website}</td>
                            <td className="p-4 text-right space-x-2">
                              {canMutate && (
                                <>
                                  <button
                                    onClick={() => openEditModal(pt.id)}
                                    className="text-[#00f0ff] hover:underline inline-flex p-1"
                                    title="Edit"
                                  >
                                    <Edit2 size={13} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      confirmDeleteAction(
                                        'Delete Partner',
                                        `Are you sure you want to delete partner "${pt.name}"?`,
                                        async () => {
                                          await db.deletePartner(pt.id);
                                          showFeedback('Partner deleted successfully.');
                                        },
                                        pt.name
                                      )
                                    }
                                    className="text-red-400 hover:underline inline-flex p-1"
                                    title="Delete"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4 border-t border-white/5 font-mono text-xs text-slate-400">
                    <div>
                      Showing {(currentPage - 1) * pageSize + 1} to{' '}
                      {Math.min(currentPage * pageSize, currentCollectionItems.length)} of{' '}
                      {currentCollectionItems.length} records
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                      >
                        <ChevronLeft size={14} />
                      </button>
                      <span>
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                )}
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

              {/* Search Bar for Applications */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search applications by applicant name, email, or branch..."
                  className="w-full pl-9 pr-4 py-2.5 text-xs text-white glass-input rounded-lg font-mono placeholder-slate-600 focus:outline-none"
                />
              </div>

              {filteredApplications.length === 0 ? (
                <div className="glass-panel p-16 text-center text-slate-500 font-mono text-sm border border-white/5 rounded-xl">
                  "No applications matching query logged in system."
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredApplications.map(app => {
                    const divName = db.divisions.find(d => d.id === app.division)?.name || app.division;
                    return (
                      <div
                        key={app.id}
                        className="glass-panel p-5 rounded-xl border border-white/5 space-y-4 hover:border-white/20 transition-all text-left"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                          <div>
                            <h3 className="font-sans font-bold text-base text-white">{app.name}</h3>
                            <span className="font-mono text-xs text-slate-400">
                              {app.email} | {app.phone} | {app.branch} ({app.year})
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-mono text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${
                                app.status === 'pending'
                                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                  : app.status === 'accepted'
                                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                  : app.status === 'reviewed'
                                  ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                  : 'bg-red-500/20 text-red-400 border-red-500/30'
                              }`}
                            >
                              {app.status}
                            </span>
                            <span className="font-mono text-[10px] text-slate-500">{app.submittedAt}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="font-sans font-bold text-slate-400 block mb-1">Target Division</span>
                            <span className="text-[#00f0ff] font-mono">{divName}</span>
                          </div>
                          <div>
                            <span className="font-sans font-bold text-slate-400 block mb-1">Stated Skills</span>
                            <span className="text-slate-300">{app.skills}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <button
                            onClick={() => setSelectedApplication(app)}
                            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#00f0ff] hover:underline"
                          >
                            <Eye size={12} /> View Full Profile & Dossier
                          </button>

                          {canMutate && (
                            <div className="flex items-center gap-2">
                              {app.status !== 'accepted' && (
                                <button
                                  onClick={async () => {
                                    await db.updateApplicationStatus(app.id, 'accepted');
                                    showFeedback(`Application for ${app.name} marked as ACCEPTED.`);
                                  }}
                                  className="px-2.5 py-1 text-xs font-mono bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded border border-emerald-500/30 transition-colors"
                                >
                                  Accept
                                </button>
                              )}
                              {app.status !== 'rejected' && (
                                <button
                                  onClick={async () => {
                                    await db.updateApplicationStatus(app.id, 'rejected');
                                    showFeedback(`Application for ${app.name} marked as REJECTED.`);
                                  }}
                                  className="px-2.5 py-1 text-xs font-mono bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded border border-red-500/30 transition-colors"
                                >
                                  Reject
                                </button>
                              )}
                              <button
                                onClick={() =>
                                  confirmDeleteAction(
                                    'Delete Application',
                                    `Are you sure you want to remove the recruitment application submitted by ${app.name}?`,
                                    async () => {
                                      await db.deleteApplication(app.id);
                                      showFeedback('Application removed.');
                                    },
                                    app.name
                                  )
                                }
                                className="p-1 text-slate-500 hover:text-red-400 rounded"
                                title="Delete Application"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          )}
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
                  <h2 className="font-sans font-extrabold text-2xl text-white">Transmissions & Inquiries</h2>
                  <p className="font-sans text-xs text-slate-400 mt-1">
                    Direct inquiries, industry partnership requests, and student communications.
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

              {/* Search Bar for Messages */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search messages by sender, email, or subject..."
                  className="w-full pl-9 pr-4 py-2.5 text-xs text-white glass-input rounded-lg font-mono placeholder-slate-600 focus:outline-none"
                />
              </div>

              {filteredMessages.length === 0 ? (
                <div className="glass-panel p-16 text-center text-slate-500 font-mono text-sm border border-white/5 rounded-xl">
                  "No transmissions matching query logged in system."
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredMessages.map(msg => (
                    <div
                      key={msg.id}
                      className={`glass-panel p-5 rounded-xl border transition-all text-left space-y-3 ${
                        !msg.read ? 'border-[#00f0ff]/30 bg-white/[0.03]' : 'border-white/5'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2">
                        <div className="flex items-center gap-2">
                          {!msg.read && <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse" />}
                          <h3 className="font-sans font-bold text-sm text-white">{msg.subject}</h3>
                        </div>
                        <span className="font-mono text-[10px] text-slate-500">{msg.submittedAt}</span>
                      </div>

                      <div className="font-mono text-xs text-slate-400">
                        From: <span className="text-white font-bold">{msg.name}</span> ({msg.email})
                      </div>

                      <p className="font-sans text-xs text-slate-300 leading-relaxed line-clamp-2">
                        {msg.message}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <button
                          onClick={() => setSelectedMessage(msg)}
                          className="inline-flex items-center gap-1.5 text-xs font-mono text-[#00f0ff] hover:underline"
                        >
                          <Eye size={12} /> View Full Transmission
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => db.markContactMessageRead(msg.id, !msg.read)}
                            className="px-2.5 py-1 text-xs font-mono bg-white/5 hover:bg-white/10 text-slate-300 rounded border border-white/10 transition-colors"
                          >
                            {msg.read ? 'Mark Unread' : 'Mark Read'}
                          </button>
                          {canMutate && (
                            <button
                              onClick={() =>
                                confirmDeleteAction(
                                  'Delete Transmission',
                                  `Are you sure you want to delete message "${msg.subject}" from ${msg.name}?`,
                                  async () => {
                                    await db.deleteContactMessage(msg.id);
                                    showFeedback('Transmission deleted.');
                                  },
                                  msg.subject
                                )
                              }
                              className="p-1 text-slate-500 hover:text-red-400 rounded"
                              title="Delete Message"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-8">
              <div>
                <h2 className="font-sans font-extrabold text-2xl text-white">SYSTEM SETTINGS & TELEMETRY</h2>
                <p className="font-sans text-xs text-slate-400 mt-1">
                  Faculty coordinator parameters, homepage metric overrides, backup exports, and security administration.
                </p>
              </div>

              {/* SECTION 1: FACULTY COORDINATOR PROFILE */}
              <div className="glass-panel p-6 rounded-xl border border-white/5 text-left space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <h3 className="font-sans font-bold text-lg text-white flex items-center gap-2">
                    <ShieldCheck size={18} className="text-[#00f0ff]" /> Faculty Coordinator Profile
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
                      <label className="font-sans text-xs text-slate-400 mb-1 block">Full Name *</label>
                      <input
                        type="text"
                        value={facultyForm.name}
                        onChange={e => setFacultyForm({ ...facultyForm, name: e.target.value })}
                        className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                        required
                        disabled={!canMutate}
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
                        disabled={!canMutate}
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
                        disabled={!canMutate}
                      />
                    </div>
                    <div>
                      <label className="font-sans text-xs text-slate-400 mb-1 block">Office Location</label>
                      <input
                        type="text"
                        value={facultyForm.office}
                        onChange={e => setFacultyForm({ ...facultyForm, office: e.target.value })}
                        className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                        disabled={!canMutate}
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
                        disabled={!canMutate}
                      />
                    </div>
                    <div>
                      <label className="font-sans text-xs text-slate-400 mb-1 block">Phone Contact</label>
                      <input
                        type="text"
                        value={facultyForm.phone}
                        onChange={e => setFacultyForm({ ...facultyForm, phone: e.target.value })}
                        className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                        disabled={!canMutate}
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
                      disabled={!canMutate}
                    />
                  </div>

                  <div>
                    <label className="font-sans text-xs text-slate-400 mb-1 block">Biography / Message</label>
                    <textarea
                      value={facultyForm.bio}
                      onChange={e => setFacultyForm({ ...facultyForm, bio: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                      disabled={!canMutate}
                    />
                  </div>

                  {canMutate && (
                    <button
                      type="submit"
                      className="px-5 py-2.5 font-sans font-bold text-xs uppercase tracking-wider text-black bg-[#00f0ff] hover:bg-[#00e0ef] rounded-lg transition-all"
                    >
                      Save Faculty Profile
                    </button>
                  )}
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
                        disabled={!canMutate}
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
                        disabled={!canMutate}
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
                        disabled={!canMutate}
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
                        disabled={!canMutate}
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
                        disabled={!canMutate}
                      />
                    </div>
                  </div>

                  {canMutate && (
                    <button
                      type="submit"
                      className="px-5 py-2.5 font-sans font-bold text-xs uppercase tracking-wider text-white bg-[#3b82f6] hover:bg-[#2563eb] rounded-lg transition-all"
                    >
                      Save Statistics Overrides
                    </button>
                  )}
                </form>
              </div>

              {/* SECTION 3: DATABASE BACKUP & RESTORE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-panel p-6 rounded-xl border border-white/5 text-left space-y-4">
                  <h3 className="font-sans font-bold text-lg text-white flex items-center gap-1.5">
                    <Download size={18} className="text-[#00f0ff]" /> Backup Export
                  </h3>
                  <p className="font-sans text-xs text-slate-400 leading-relaxed">
                    Export the current database state as a portable JSON snapshot.
                  </p>
                  <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2.5 font-sans font-bold text-xs uppercase tracking-wider text-black bg-[#00f0ff] hover:bg-[#00e0ef] rounded-lg transition-all"
                  >
                    Export Database JSON <Download size={14} />
                  </button>
                </div>

                {canMutate && (
                  <div className="glass-panel p-6 rounded-xl border border-white/5 text-left space-y-4">
                    <h3 className="font-sans font-bold text-lg text-white flex items-center gap-1.5">
                      <Upload size={18} className="text-[#3b82f6]" /> Backup Restore
                    </h3>
                    <p className="font-sans text-xs text-slate-400 leading-relaxed">
                      Restore a previously exported database JSON payload.
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
                )}
              </div>

              {/* SECTION 4: ADMIN USERS MANAGEMENT (SUPERADMIN ONLY) */}
              {isSuperAdmin && (
                <div className="glass-panel p-6 rounded-xl border border-white/5 text-left space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-3">
                    <div>
                      <h3 className="font-sans font-bold text-lg text-white flex items-center gap-2">
                        <Key size={18} className="text-[#00f0ff]" /> Administrator Accounts & RBAC
                      </h3>
                      <p className="font-sans text-xs text-slate-400 mt-1">
                        Manage authorized administrators, moderator clearances, and account activation states.
                      </p>
                    </div>
                    <button
                      onClick={openCreateUserModal}
                      className="flex items-center gap-1.5 px-4 py-2 font-sans font-bold text-xs uppercase tracking-wider text-black bg-[#00f0ff] hover:bg-[#00e0ef] rounded-lg transition-all w-fit"
                    >
                      <Plus size={14} /> Add Admin Account
                    </button>
                  </div>

                  {loadingUsers ? (
                    <div className="p-8 text-center text-slate-500 font-mono text-xs">
                      <RefreshCw size={16} className="animate-spin mx-auto mb-2 text-[#00f0ff]" />
                      Loading administrator accounts...
                    </div>
                  ) : adminUsers.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 font-mono text-xs">
                      No admin accounts found.
                    </div>
                  ) : (
                    <div className="glass-panel rounded-xl border border-white/5 overflow-x-auto">
                      <table className="w-full text-left font-sans text-xs">
                        <thead className="bg-white/[0.02] border-b border-white/5 font-mono text-[9px] text-slate-500 uppercase tracking-wider">
                          <tr>
                            <th className="p-4">Account / Username</th>
                            <th className="p-4">Full Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Role Clearance</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {adminUsers.map(user => (
                            <tr key={user.id} className="hover:bg-white/[0.01]">
                              <td className="p-4 font-mono font-bold text-white">{user.username}</td>
                              <td className="p-4 text-slate-300">{user.name}</td>
                              <td className="p-4 font-mono text-slate-400 text-[11px]">{user.email}</td>
                              <td className="p-4">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${
                                    user.role === 'SUPERADMIN'
                                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                      : user.role === 'MODERATOR'
                                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                      : 'bg-[#00f0ff]/20 text-[#00f0ff] border-[#00f0ff]/30'
                                  }`}
                                >
                                  {user.role}
                                </span>
                              </td>
                              <td className="p-4">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                    user.isActive
                                      ? 'text-emerald-400 bg-emerald-500/10'
                                      : 'text-red-400 bg-red-500/10'
                                  }`}
                                >
                                  {user.isActive ? 'ACTIVE' : 'INACTIVE'}
                                </span>
                              </td>
                              <td className="p-4 text-right space-x-2">
                                <button
                                  onClick={() => openEditUserModal(user)}
                                  className="text-[#00f0ff] hover:underline inline-flex p-1"
                                  title="Edit Admin"
                                >
                                  <Edit2 size={13} />
                                </button>
                                {user.id !== auth.user?.id && (
                                  <button
                                    onClick={() => handleDeleteUser(user)}
                                    className="text-red-400 hover:underline inline-flex p-1"
                                    title="Delete Admin"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* OVERLAY: GENERAL CRUD FORMS */}
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

            {formError && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono">
                {formError}
              </div>
            )}

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
                        placeholder="VS Code, Docker, Postman"
                        className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none font-mono"
                      />
                    </div>
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-sans text-xs text-slate-400 mb-1 block">Event Date *</label>
                      <input
                        type="date"
                        value={eventForm.date}
                        onChange={e => setEventForm({ ...eventForm, date: e.target.value })}
                        className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-sans text-xs text-slate-400 mb-1 block">Event Time *</label>
                      <input
                        type="text"
                        value={eventForm.time}
                        onChange={e => setEventForm({ ...eventForm, time: e.target.value })}
                        placeholder="e.g. 10:00 AM - 04:00 PM"
                        className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-sans text-xs text-slate-400 mb-1 block">Venue Location *</label>
                      <input
                        type="text"
                        value={eventForm.venue}
                        onChange={e => setEventForm({ ...eventForm, venue: e.target.value })}
                        className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-sans text-xs text-slate-400 mb-1 block">Status</label>
                      <select
                        value={eventForm.status}
                        onChange={e => setEventForm({ ...eventForm, status: e.target.value as any })}
                        className="w-full px-3 py-2 text-sm text-white bg-[#0a0a0f] border border-white/8 rounded-lg focus:outline-none"
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="past">Past</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-sans text-xs text-slate-400 mb-1 block">Banner Image URL *</label>
                    <input
                      type="text"
                      value={eventForm.image}
                      onChange={e => setEventForm({ ...eventForm, image: e.target.value })}
                      className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-sans text-xs text-slate-400 mb-1 block">Registration Link</label>
                    <input
                      type="text"
                      value={eventForm.registrationLink}
                      onChange={e => setEventForm({ ...eventForm, registrationLink: e.target.value })}
                      className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-sans text-xs text-slate-400 mb-1 block">Description *</label>
                    <textarea
                      value={eventForm.description}
                      onChange={e => setEventForm({ ...eventForm, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                      required
                    />
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-sans text-xs text-slate-400 mb-1 block">Mentor / Lead *</label>
                      <input
                        type="text"
                        value={projectForm.mentor}
                        onChange={e => setProjectForm({ ...projectForm, mentor: e.target.value })}
                        className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-sans text-xs text-slate-400 mb-1 block">Status</label>
                      <select
                        value={projectForm.status}
                        onChange={e => setProjectForm({ ...projectForm, status: e.target.value as any })}
                        className="w-full px-3 py-2 text-sm text-white bg-[#0a0a0f] border border-white/8 rounded-lg focus:outline-none"
                      >
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="on-hold">On Hold</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-sans text-xs text-slate-400 mb-1 block">Completion Progress (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={projectForm.progress}
                        onChange={e =>
                          setProjectForm({ ...projectForm, progress: parseInt(e.target.value) || 0 })
                        }
                        className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-sans text-xs text-slate-400 mb-1 block">Technology Tags</label>
                      <input
                        type="text"
                        value={projectTagsStr}
                        onChange={e => setProjectTagsStr(e.target.value)}
                        placeholder="React, PyTorch, ESP32"
                        className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-sans text-xs text-slate-400 mb-1 block">Preview Image URL *</label>
                    <input
                      type="text"
                      value={projectForm.image}
                      onChange={e => setProjectForm({ ...projectForm, image: e.target.value })}
                      className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-sans text-xs text-slate-400 mb-1 block">Repository Link</label>
                      <input
                        type="text"
                        value={projectForm.github}
                        onChange={e => setProjectForm({ ...projectForm, github: e.target.value })}
                        className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-sans text-xs text-slate-400 mb-1 block">Live Demo Link</label>
                      <input
                        type="text"
                        value={projectForm.demo}
                        onChange={e => setProjectForm({ ...projectForm, demo: e.target.value })}
                        className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none font-mono"
                      />
                    </div>
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
                    <label className="font-sans text-xs text-slate-400 mb-1 block">Engineered Solution *</label>
                    <textarea
                      value={projectForm.solution}
                      onChange={e => setProjectForm({ ...projectForm, solution: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                      required
                    />
                  </div>
                </>
              )}

              {/* Announcement Form Fields */}
              {activeTab === 'announcements' && (
                <>
                  <div>
                    <label className="font-sans text-xs text-slate-400 mb-1 block">Announcement Headline *</label>
                    <input
                      type="text"
                      value={announcementForm.title}
                      onChange={e => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                      className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-sans text-xs text-slate-400 mb-1 block">Post Date *</label>
                      <input
                        type="date"
                        value={announcementForm.date}
                        onChange={e => setAnnouncementForm({ ...announcementForm, date: e.target.value })}
                        className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-sans text-xs text-slate-400 mb-1 block">Category</label>
                      <select
                        value={announcementForm.category}
                        onChange={e => setAnnouncementForm({ ...announcementForm, category: e.target.value as any })}
                        className="w-full px-3 py-2 text-sm text-white bg-[#0a0a0f] border border-white/8 rounded-lg focus:outline-none"
                      >
                        <option value="recruitment">Recruitment</option>
                        <option value="event">Event</option>
                        <option value="alert">Alert</option>
                        <option value="general">General</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-sans text-xs text-slate-400 mb-1 block">Announcement Content *</label>
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
                      id="an-active"
                      checked={announcementForm.active}
                      onChange={e => setAnnouncementForm({ ...announcementForm, active: e.target.checked })}
                      className="rounded bg-black border-white/10"
                    />
                    <label htmlFor="an-active" className="font-sans text-xs text-slate-400 cursor-pointer">
                      Display as Active Broadcast
                    </label>
                  </div>
                </>
              )}

              {/* Gallery Form Fields */}
              {activeTab === 'gallery' && (
                <>
                  <div>
                    <label className="font-sans text-xs text-slate-400 mb-1 block">Image URL Source *</label>
                    <input
                      type="text"
                      value={galleryForm.image}
                      onChange={e => setGalleryForm({ ...galleryForm, image: e.target.value })}
                      className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-sans text-xs text-slate-400 mb-1 block">Caption / Event Title *</label>
                    <input
                      type="text"
                      value={galleryForm.caption}
                      onChange={e => setGalleryForm({ ...galleryForm, caption: e.target.value })}
                      className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-sans text-xs text-slate-400 mb-1 block">Classification Category</label>
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
                    <label className="font-sans text-xs text-slate-400 mb-1 block">Achievement Title *</label>
                    <input
                      type="text"
                      value={achievementForm.title}
                      onChange={e => setAchievementForm({ ...achievementForm, title: e.target.value })}
                      className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-sans text-xs text-slate-400 mb-1 block">Date Awarded *</label>
                      <input
                        type="month"
                        value={achievementForm.date}
                        onChange={e => setAchievementForm({ ...achievementForm, date: e.target.value })}
                        className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-sans text-xs text-slate-400 mb-1 block">Trophy / Badge URL</label>
                      <input
                        type="text"
                        value={achievementForm.image}
                        onChange={e => setAchievementForm({ ...achievementForm, image: e.target.value })}
                        className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                      />
                    </div>
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

      {/* OVERLAY: DESTRUCTIVE ACTION CONFIRMATION MODAL */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md glass-panel p-6 rounded-2xl border border-red-500/30 shadow-2xl text-left space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 className="font-sans font-bold text-base text-white">{deleteConfirm.title}</h3>
                <span className="font-mono text-[10px] text-red-400 uppercase tracking-wider">
                  DESTRUCTIVE ACTION CONFIRMATION
                </span>
              </div>
            </div>

            <p className="font-sans text-xs text-slate-300 leading-relaxed">
              {deleteConfirm.message}
            </p>

            {deleteConfirm.itemName && (
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 font-mono text-xs text-[#00f0ff] truncate">
                Target: {deleteConfirm.itemName}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
              <button
                type="button"
                onClick={() => setDeleteConfirm(prev => ({ ...prev, isOpen: false }))}
                disabled={deleteConfirm.isDeleting}
                className="px-4 py-2 font-sans font-bold text-xs uppercase tracking-wider text-slate-400 hover:text-white bg-white/5 border border-white/10 rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeDelete}
                disabled={deleteConfirm.isDeleting}
                className="flex items-center gap-1.5 px-5 py-2 font-sans font-bold text-xs uppercase tracking-wider text-white bg-red-600 hover:bg-red-500 rounded-lg transition-all shadow-[0_0_12px_rgba(239,68,68,0.3)] disabled:opacity-50"
              >
                {deleteConfirm.isDeleting ? (
                  <>
                    <RefreshCw size={12} className="animate-spin" /> Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={13} /> Confirm Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY: EVENT REGISTRATIONS MANAGEMENT MODAL */}
      {selectedEventForReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-3xl glass-panel p-6 rounded-2xl border border-white/10 shadow-2xl overflow-y-auto max-h-[85vh] text-left space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <h3 className="font-sans font-bold text-base text-white">Event Registrations Queue</h3>
                <span className="font-mono text-xs text-[#00f0ff]">{selectedEventForReg.title}</span>
              </div>
              <button
                onClick={() => setSelectedEventForReg(null)}
                className="p-1 rounded bg-white/5 text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Registrations Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={regSearch}
                onChange={e => setRegSearch(e.target.value)}
                placeholder="Search registered attendees by name, email, or USN..."
                className="w-full pl-9 pr-4 py-2 text-xs text-white glass-input rounded-lg font-mono placeholder-slate-600 focus:outline-none"
              />
            </div>

            {loadingRegistrations ? (
              <div className="p-12 text-center text-slate-500 font-mono text-xs">
                <RefreshCw size={16} className="animate-spin mx-auto mb-2 text-[#00f0ff]" />
                Loading registered attendees...
              </div>
            ) : eventRegistrations.length === 0 ? (
              <div className="p-12 text-center text-slate-500 font-mono text-xs border border-white/5 rounded-xl">
                No attendee registrations logged for this event.
              </div>
            ) : (
              <div className="glass-panel rounded-xl border border-white/5 overflow-x-auto">
                <table className="w-full text-left font-sans text-xs">
                  <thead className="bg-white/[0.02] border-b border-white/5 font-mono text-[9px] text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="p-3">Attendee Name</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">USN / Sem / Branch</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {eventRegistrations
                      .filter(
                        r =>
                          !regSearch ||
                          r.name.toLowerCase().includes(regSearch.toLowerCase()) ||
                          r.email.toLowerCase().includes(regSearch.toLowerCase()) ||
                          r.usn.toLowerCase().includes(regSearch.toLowerCase())
                      )
                      .map(reg => (
                        <tr key={reg.id} className="hover:bg-white/[0.01]">
                          <td className="p-3 font-bold text-white">{reg.name}</td>
                          <td className="p-3 font-mono text-slate-400 text-[11px]">{reg.email}</td>
                          <td className="p-3 font-mono text-slate-300 text-[11px]">
                            {reg.usn} | Sem {reg.semester} | {reg.branch}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold border ${
                                reg.status === 'CONFIRMED'
                                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                  : reg.status === 'ATTENDED'
                                  ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                  : reg.status === 'CANCELLED'
                                  ? 'bg-red-500/20 text-red-400 border-red-500/30'
                                  : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                              }`}
                            >
                              {reg.status}
                            </span>
                          </td>
                          <td className="p-3 text-right space-x-2">
                            {canMutate && (
                              <>
                                <select
                                  value={reg.status}
                                  onChange={e => handleUpdateRegStatus(reg.id, e.target.value)}
                                  className="px-2 py-1 text-[10px] text-white bg-[#0a0a0f] border border-white/10 rounded focus:outline-none font-mono"
                                >
                                  <option value="CONFIRMED">CONFIRMED</option>
                                  <option value="ATTENDED">ATTENDED</option>
                                  <option value="CANCELLED">CANCELLED</option>
                                  <option value="PENDING">PENDING</option>
                                </select>
                                <button
                                  onClick={() => handleDeleteReg(reg)}
                                  className="text-red-400 hover:text-red-300 inline-flex p-1"
                                  title="Delete Attendee"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* OVERLAY: APPLICATION REVIEW DOSSIER MODAL */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl glass-panel p-6 rounded-2xl border border-white/10 shadow-2xl overflow-y-auto max-h-[85vh] text-left space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <h3 className="font-sans font-bold text-lg text-white">Application Dossier</h3>
                <span className="font-mono text-xs text-slate-400">
                  Candidate ID: {selectedApplication.id} | Logged: {selectedApplication.submittedAt}
                </span>
              </div>
              <button
                onClick={() => setSelectedApplication(null)}
                className="p-1 rounded bg-white/5 text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-bold text-slate-400 block mb-0.5">Applicant Name</span>
                <span className="text-white text-sm font-bold">{selectedApplication.name}</span>
              </div>
              <div>
                <span className="font-bold text-slate-400 block mb-0.5">Email Address</span>
                <span className="font-mono text-[#00f0ff]">{selectedApplication.email}</span>
              </div>
              <div>
                <span className="font-bold text-slate-400 block mb-0.5">Phone Contact</span>
                <span className="font-mono text-slate-300">{selectedApplication.phone || 'N/A'}</span>
              </div>
              <div>
                <span className="font-bold text-slate-400 block mb-0.5">Academic Track</span>
                <span className="text-slate-300">
                  {selectedApplication.branch} (Year: {selectedApplication.year})
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-400 block">Statement of Motivation & Vision</span>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-slate-300 leading-relaxed font-sans">
                {selectedApplication.motivation || 'No motivation provided.'}
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-400 block">Technical Skills & Competencies</span>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-slate-300 font-mono">
                {selectedApplication.skills || 'No skills listed.'}
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-400 block">Prior Engineering Projects</span>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-slate-300 leading-relaxed font-sans">
                {selectedApplication.projects || 'No projects listed.'}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
              {selectedApplication.github && (
                <a
                  href={selectedApplication.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 p-2 rounded bg-white/5 hover:bg-white/10 text-[#00f0ff] transition-colors truncate"
                >
                  <ExternalLink size={12} /> GitHub Profile
                </a>
              )}
              {selectedApplication.linkedin && (
                <a
                  href={selectedApplication.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 p-2 rounded bg-white/5 hover:bg-white/10 text-purple-400 transition-colors truncate"
                >
                  <ExternalLink size={12} /> LinkedIn Profile
                </a>
              )}
              {selectedApplication.portfolio && (
                <a
                  href={selectedApplication.portfolio}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 p-2 rounded bg-white/5 hover:bg-white/10 text-emerald-400 transition-colors truncate"
                >
                  <ExternalLink size={12} /> Portfolio Site
                </a>
              )}
            </div>

            {canMutate && (
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <button
                  onClick={() => {
                    const app = selectedApplication;
                    setSelectedApplication(null);
                    confirmDeleteAction(
                      'Delete Application',
                      `Are you sure you want to delete the application submitted by ${app.name}?`,
                      async () => {
                        await db.deleteApplication(app.id);
                        showFeedback('Application deleted.');
                      },
                      app.name
                    );
                  }}
                  className="px-3 py-1.5 text-xs font-mono text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                >
                  Delete Application
                </button>

                <div className="flex items-center gap-2">
                  <button
                    disabled={updatingAppStatus}
                    onClick={async () => {
                      setUpdatingAppStatus(true);
                      await db.updateApplicationStatus(selectedApplication.id, 'accepted');
                      setSelectedApplication(prev => prev ? { ...prev, status: 'accepted' } : null);
                      setUpdatingAppStatus(false);
                      showFeedback('Candidate marked as ACCEPTED.');
                    }}
                    className="px-4 py-2 font-sans font-bold text-xs uppercase tracking-wider text-black bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-all"
                  >
                    Accept Candidate
                  </button>
                  <button
                    disabled={updatingAppStatus}
                    onClick={async () => {
                      setUpdatingAppStatus(true);
                      await db.updateApplicationStatus(selectedApplication.id, 'rejected');
                      setSelectedApplication(prev => prev ? { ...prev, status: 'rejected' } : null);
                      setUpdatingAppStatus(false);
                      showFeedback('Candidate marked as REJECTED.');
                    }}
                    className="px-4 py-2 font-sans font-bold text-xs uppercase tracking-wider text-white bg-red-600 hover:bg-red-500 rounded-lg transition-all"
                  >
                    Reject Candidate
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* OVERLAY: CONTACT MESSAGE VIEW MODAL */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg glass-panel p-6 rounded-2xl border border-white/10 shadow-2xl text-left space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <h3 className="font-sans font-bold text-base text-white">{selectedMessage.subject}</h3>
                <span className="font-mono text-xs text-slate-400">
                  Received: {selectedMessage.submittedAt}
                </span>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-1 rounded bg-white/5 text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 font-mono text-xs text-slate-300">
              Sender: <span className="text-white font-bold">{selectedMessage.name}</span> &lt;
              {selectedMessage.email}&gt;
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/5 font-sans text-xs text-slate-200 leading-relaxed max-h-64 overflow-y-auto">
              {selectedMessage.message}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <button
                onClick={() => {
                  const msg = selectedMessage;
                  setSelectedMessage(null);
                  confirmDeleteAction(
                    'Delete Transmission',
                    `Are you sure you want to delete message "${msg.subject}" from ${msg.name}?`,
                    async () => {
                      await db.deleteContactMessage(msg.id);
                      showFeedback('Message deleted.');
                    },
                    msg.subject
                  );
                }}
                className="px-3 py-1.5 text-xs font-mono text-red-400 hover:text-red-300"
              >
                Delete Message
              </button>

              <button
                onClick={() => {
                  db.markContactMessageRead(selectedMessage.id, !selectedMessage.read);
                  setSelectedMessage(prev => prev ? { ...prev, read: !prev.read } : null);
                  showFeedback(selectedMessage.read ? 'Marked unread.' : 'Marked read.');
                }}
                className="px-4 py-2 text-xs font-mono bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30 hover:bg-[#00f0ff]/20 rounded-lg transition-colors"
              >
                {selectedMessage.read ? 'Mark as Unread' : 'Mark as Read'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY: ADMIN USER CREATE/EDIT MODAL (SUPERADMIN ONLY) */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md glass-panel p-6 rounded-2xl border border-white/10 shadow-2xl text-left space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="font-sans font-bold text-base text-white">
                {userModalMode === 'create' ? 'Create Administrator Account' : 'Edit Admin Privileges'}
              </h3>
              <button
                onClick={() => setIsUserModalOpen(false)}
                className="p-1 rounded bg-white/5 text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {userFormError && (
              <div className="p-3 rounded bg-red-500/10 border border-red-500/30 text-red-300 font-mono text-xs">
                {userFormError}
              </div>
            )}

            <form onSubmit={handleSaveUser} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-400 mb-1 block">Account Username *</label>
                <input
                  type="text"
                  value={userForm.username}
                  onChange={e => setUserForm({ ...userForm, username: e.target.value })}
                  disabled={userModalMode === 'edit'}
                  placeholder="e.g. dev_admin"
                  className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg font-mono focus:outline-none disabled:opacity-50"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-400 mb-1 block">Full Name *</label>
                <input
                  type="text"
                  value={userForm.name}
                  onChange={e => setUserForm({ ...userForm, name: e.target.value })}
                  placeholder="e.g. Alex Chen"
                  className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-400 mb-1 block">Official Email *</label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={e => setUserForm({ ...userForm, email: e.target.value })}
                  disabled={userModalMode === 'edit'}
                  placeholder="e.g. alex@alterino.org"
                  className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg font-mono focus:outline-none disabled:opacity-50"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-400 mb-1 block">
                  {userModalMode === 'create' ? 'Initial Password * (min 8 chars)' : 'New Password (leave empty to keep unchanged)'}
                </label>
                <input
                  type="password"
                  value={userForm.password}
                  onChange={e => setUserForm({ ...userForm, password: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 text-sm text-white glass-input rounded-lg font-mono focus:outline-none"
                  required={userModalMode === 'create'}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-400 mb-1 block">Role Clearance</label>
                  <select
                    value={userForm.role}
                    onChange={e => setUserForm({ ...userForm, role: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm text-white bg-[#0a0a0f] border border-white/8 rounded-lg focus:outline-none font-mono"
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="MODERATOR">MODERATOR</option>
                    <option value="SUPERADMIN">SUPERADMIN</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-400 mb-1 block">Account Active</label>
                  <select
                    value={userForm.isActive ? 'true' : 'false'}
                    onChange={e => setUserForm({ ...userForm, isActive: e.target.value === 'true' })}
                    className="w-full px-3 py-2 text-sm text-white bg-[#0a0a0f] border border-white/8 rounded-lg focus:outline-none font-mono"
                  >
                    <option value="true">ACTIVE</option>
                    <option value="false">INACTIVE</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 font-sans font-bold text-xs uppercase tracking-wider text-slate-400 hover:text-white bg-white/5 border border-white/10 rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingUser}
                  className="px-6 py-2.5 font-sans font-bold text-xs uppercase tracking-wider text-black bg-[#00f0ff] hover:bg-[#00e0ef] rounded-lg transition-all shadow-[0_0_12px_rgba(0,240,255,0.2)] disabled:opacity-50"
                >
                  {isSavingUser ? 'Saving...' : 'Save Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
