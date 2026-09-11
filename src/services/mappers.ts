import type {
  Member,
  Division,
  Event,
  Project,
  Achievement,
  Announcement,
  Partner,
  GalleryItem,
  Application,
  ContactMessage,
  FacultyCoordinator,
  HomeStats,
} from '../data/seedData';

// ==================== FRONTEND MAPPERS ====================

export function mapApiMember(raw: any): Member {
  return {
    id: raw.id,
    name: raw.name || '',
    role: raw.role || '',
    division: raw.division?.name || raw.divisionName || (raw.isLeadership ? 'Leadership' : 'Other'),
    email: raw.email || '',
    github: raw.github || '',
    linkedin: raw.linkedin || '',
    image: raw.imageUrl || raw.image || '',
    bio: raw.bio || '',
    skills: Array.isArray(raw.skills) ? raw.skills : [],
    isLeadership: Boolean(raw.isLeadership),
  };
}

export function mapApiDivision(raw: any): Division {
  return {
    id: raw.id,
    name: raw.name || '',
    description: raw.description || '',
    leadId: raw.leadId || '',
    responsibilities: Array.isArray(raw.responsibilities) ? raw.responsibilities : [],
    skills: Array.isArray(raw.skills) ? raw.skills : [],
    tools: Array.isArray(raw.tools) ? raw.tools : [],
    ongoingWork: raw.ongoingWork || '',
    iconName: raw.iconName || 'Code',
  };
}

export function mapApiEvent(raw: any): Event {
  let statusStr = raw.status ? String(raw.status).toLowerCase() : 'upcoming';
  if (!['upcoming', 'ongoing', 'past'].includes(statusStr)) {
    statusStr = 'upcoming';
  }

  let dateStr = raw.date || '';
  if (raw.eventDate) {
    try {
      dateStr = new Date(raw.eventDate).toISOString().split('T')[0];
    } catch {
      dateStr = String(raw.eventDate);
    }
  }

  let coordStr = '';
  if (typeof raw.coordinator === 'object' && raw.coordinator !== null) {
    coordStr = raw.coordinator.name || '';
  } else {
    coordStr = raw.coordinator || raw.coordinatorName || '';
  }

  return {
    id: raw.id,
    title: raw.title || '',
    description: raw.description || '',
    date: dateStr,
    time: raw.eventTime || raw.time || '',
    venue: raw.venue || '',
    coordinator: coordStr,
    image: raw.imageUrl || raw.image || '',
    status: statusStr as 'upcoming' | 'ongoing' | 'past',
    registrationLink: raw.registrationLink || '',
    winners: Array.isArray(raw.winners) ? raw.winners : [],
    gallery: Array.isArray(raw.galleryUrls) ? raw.galleryUrls : Array.isArray(raw.gallery) ? raw.gallery : [],
  };
}

export function mapApiProject(raw: any): Project {
  let statusStr = raw.status ? String(raw.status).toLowerCase() : 'active';
  if (statusStr === 'on_hold') statusStr = 'on-hold';
  if (!['active', 'completed', 'on-hold'].includes(statusStr)) {
    statusStr = 'active';
  }

  let mentorStr = raw.externalMentorName || '';
  if (!mentorStr && raw.mentorMember) mentorStr = raw.mentorMember.name;
  if (!mentorStr && raw.mentorFaculty) mentorStr = raw.mentorFaculty.name;
  if (!mentorStr && typeof raw.mentor === 'string') mentorStr = raw.mentor;

  let teamIdsArr: string[] = [];
  if (Array.isArray(raw.teamMembers)) {
    teamIdsArr = raw.teamMembers.map((m: any) => m.memberId || m.id || m.member?.id).filter(Boolean);
  } else if (Array.isArray(raw.teamIds)) {
    teamIdsArr = raw.teamIds;
  }

  return {
    id: raw.id,
    title: raw.title || '',
    problem: raw.problem || '',
    solution: raw.solution || '',
    description: raw.description || '',
    image: raw.imageUrl || raw.image || '',
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    teamIds: teamIdsArr,
    mentor: mentorStr,
    progress: typeof raw.progress === 'number' ? raw.progress : 0,
    github: raw.githubUrl || raw.github || '',
    demo: raw.demoUrl || raw.demo || '',
    status: statusStr as 'active' | 'completed' | 'on-hold',
  };
}

export function mapApiAchievement(raw: any): Achievement {
  let dateStr = raw.date || '';
  if (raw.dateAchieved) {
    try {
      dateStr = new Date(raw.dateAchieved).toISOString().split('T')[0];
    } catch {
      dateStr = String(raw.dateAchieved);
    }
  }

  return {
    id: raw.id,
    title: raw.title || '',
    date: dateStr,
    description: raw.description || '',
    image: raw.imageUrl || raw.image || '',
    badge: raw.badge || '',
  };
}

export function mapApiAnnouncement(raw: any): Announcement {
  let dateStr = raw.date || '';
  if (raw.datePosted) {
    try {
      dateStr = new Date(raw.datePosted).toISOString().split('T')[0];
    } catch {
      dateStr = String(raw.datePosted);
    }
  }

  let catStr = raw.category ? String(raw.category).toLowerCase() : 'general';
  if (!['recruitment', 'event', 'alert', 'general'].includes(catStr)) {
    catStr = 'general';
  }

  return {
    id: raw.id,
    title: raw.title || '',
    date: dateStr,
    content: raw.content || '',
    category: catStr as 'recruitment' | 'event' | 'alert' | 'general',
    active: raw.isActive !== undefined ? Boolean(raw.isActive) : Boolean(raw.active),
  };
}

export function mapApiPartner(raw: any): Partner {
  return {
    id: raw.id,
    name: raw.name || '',
    logo: raw.logoUrl || raw.logo || '',
    type: raw.partnerType || raw.type || '',
    description: raw.description || '',
    website: raw.website || '',
  };
}

export function mapApiGalleryItem(raw: any): GalleryItem {
  let catStr = raw.category ? String(raw.category).toLowerCase() : 'events';
  if (!['events', 'workshops', 'meetings', 'hackathons', 'projects', 'community'].includes(catStr)) {
    catStr = 'events';
  }

  return {
    id: raw.id,
    image: raw.imageUrl || raw.image || '',
    caption: raw.caption || '',
    category: catStr as any,
  };
}

export function mapApiApplication(raw: any): Application {
  let statusStr = raw.status ? String(raw.status).toLowerCase() : 'pending';
  if (!['pending', 'reviewed', 'accepted', 'rejected'].includes(statusStr)) {
    statusStr = 'pending';
  }

  let dateStr = raw.submittedAt || '';
  if (raw.createdAt) {
    try {
      dateStr = new Date(raw.createdAt).toISOString();
    } catch {
      dateStr = String(raw.createdAt);
    }
  }

  return {
    id: raw.id,
    name: raw.name || '',
    email: raw.email || '',
    phone: raw.phone || '',
    branch: raw.branch || '',
    year: raw.year || '',
    division: raw.division?.name || raw.divisionId || raw.division || '',
    skills: raw.skills || '',
    motivation: raw.motivation || '',
    projects: raw.projects || '',
    github: raw.github || '',
    linkedin: raw.linkedin || '',
    portfolio: raw.portfolio || '',
    resumeName: raw.resumeUrl ? raw.resumeUrl.split('/').pop() || 'Resume.pdf' : raw.resumeName || 'Resume.pdf',
    status: statusStr as any,
    submittedAt: dateStr,
  };
}

export function mapApiContactMessage(raw: any): ContactMessage {
  let dateStr = raw.submittedAt || '';
  if (raw.createdAt) {
    try {
      dateStr = new Date(raw.createdAt).toISOString();
    } catch {
      dateStr = String(raw.createdAt);
    }
  }

  return {
    id: raw.id,
    name: raw.name || '',
    email: raw.email || '',
    subject: raw.subject || '',
    message: raw.message || '',
    submittedAt: dateStr,
    read: raw.isRead !== undefined ? Boolean(raw.isRead) : Boolean(raw.read),
  };
}

export function mapApiFaculty(raw: any): FacultyCoordinator {
  return {
    name: raw.name || '',
    designation: raw.designation || '',
    department: raw.department || '',
    image: raw.imageUrl || raw.image || '',
    bio: raw.bio || '',
    email: raw.email || '',
    phone: raw.phone || '',
    office: raw.office || '',
  };
}

export function mapApiStats(raw: any): HomeStats {
  return {
    projects: raw.projectsCount ?? raw.projects ?? 0,
    events: raw.eventsCount ?? raw.events ?? 0,
    members: raw.membersCount ?? raw.members ?? 0,
    divisions: raw.divisionsCount ?? raw.divisions ?? 0,
    partners: raw.partnersCount ?? raw.partners ?? 0,
  };
}

// ==================== PAYLOAD MAPPERS (Write Operations) ====================

export function toApiMemberPayload(item: Partial<Member>) {
  const payload: any = { ...item };
  if (item.image !== undefined) {
    payload.imageUrl = item.image;
    delete payload.image;
  }
  return payload;
}

export function toApiEventPayload(item: Partial<Event>) {
  const payload: any = { ...item };
  if (item.image !== undefined) {
    payload.imageUrl = item.image;
    delete payload.image;
  }
  if (item.date !== undefined) {
    payload.eventDate = item.date;
    delete payload.date;
  }
  if (item.time !== undefined) {
    payload.eventTime = item.time;
    delete payload.time;
  }
  if (item.status !== undefined) {
    payload.status = item.status.toUpperCase();
  }
  if (item.gallery !== undefined) {
    payload.galleryUrls = item.gallery;
    delete payload.gallery;
  }
  return payload;
}

export function toApiProjectPayload(item: Partial<Project>) {
  const payload: any = { ...item };
  if (item.image !== undefined) {
    payload.imageUrl = item.image;
    delete payload.image;
  }
  if (item.github !== undefined) {
    payload.githubUrl = item.github;
    delete payload.github;
  }
  if (item.demo !== undefined) {
    payload.demoUrl = item.demo;
    delete payload.demo;
  }
  if (item.status !== undefined) {
    payload.status = item.status === 'on-hold' ? 'ON_HOLD' : item.status.toUpperCase();
  }
  if (item.mentor !== undefined) {
    payload.externalMentorName = item.mentor;
    delete payload.mentor;
  }
  return payload;
}

export function toApiAchievementPayload(item: Partial<Achievement>) {
  const payload: any = { ...item };
  if (item.image !== undefined) {
    payload.imageUrl = item.image;
    delete payload.image;
  }
  if (item.date !== undefined) {
    payload.dateAchieved = item.date;
    delete payload.date;
  }
  return payload;
}

export function toApiAnnouncementPayload(item: Partial<Announcement>) {
  const payload: any = { ...item };
  if (item.date !== undefined) {
    payload.datePosted = item.date;
    delete payload.date;
  }
  if (item.active !== undefined) {
    payload.isActive = item.active;
    delete payload.active;
  }
  if (item.category !== undefined) {
    payload.category = item.category.toUpperCase();
  }
  return payload;
}

export function toApiPartnerPayload(item: Partial<Partner>) {
  const payload: any = { ...item };
  if (item.logo !== undefined) {
    payload.logoUrl = item.logo;
    delete payload.logo;
  }
  if (item.type !== undefined) {
    payload.partnerType = item.type;
    delete payload.type;
  }
  return payload;
}

export function toApiGalleryPayload(item: Partial<GalleryItem>) {
  const payload: any = { ...item };
  if (item.image !== undefined) {
    payload.imageUrl = item.image;
    delete payload.image;
  }
  if (item.category !== undefined) {
    payload.category = item.category.toUpperCase();
  }
  return payload;
}

export function toApiApplicationPayload(item: Partial<Application>) {
  return {
    name: item.name,
    email: item.email,
    phone: item.phone,
    branch: item.branch,
    year: item.year,
    divisionId: item.division, // or divisionId if mapped
    skills: item.skills,
    motivation: item.motivation,
    projects: item.projects,
    github: item.github,
    linkedin: item.linkedin,
    portfolio: item.portfolio,
  };
}

export function toApiContactPayload(item: Partial<ContactMessage>) {
  return {
    name: item.name,
    email: item.email,
    subject: item.subject,
    message: item.message,
  };
}
