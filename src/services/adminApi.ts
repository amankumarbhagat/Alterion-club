import { apiClient } from './apiClient';
import {
  mapApiMember,
  mapApiDivision,
  mapApiEvent,
  mapApiProject,
  mapApiAchievement,
  mapApiAnnouncement,
  mapApiPartner,
  mapApiGalleryItem,
  mapApiFaculty,
  mapApiApplication,
  mapApiContactMessage,
  toApiMemberPayload,
  toApiEventPayload,
  toApiProjectPayload,
  toApiAchievementPayload,
  toApiAnnouncementPayload,
  toApiPartnerPayload,
  toApiGalleryPayload,
} from './mappers';
import type {
  Member,
  Division,
  Event,
  Project,
  Achievement,
  Announcement,
  Partner,
  GalleryItem,
  FacultyCoordinator,
  Application,
  ContactMessage,
} from '../data/seedData';

// Member Admin API
export async function adminGetMembers(): Promise<Member[]> {
  const data = await apiClient.get<any>('/admin/members');
  const items = Array.isArray(data) ? data : data?.members || [];
  return Array.isArray(items) ? items.map(mapApiMember) : [];
}

export async function adminCreateMember(member: Omit<Member, 'id'>): Promise<Member> {
  const payload = toApiMemberPayload(member);
  const data = await apiClient.post<any>('/admin/members', payload);
  return mapApiMember(data);
}

export async function adminUpdateMember(id: string, member: Partial<Member>): Promise<Member> {
  const payload = toApiMemberPayload(member);
  const data = await apiClient.put<any>(`/admin/members/${id}`, payload);
  return mapApiMember(data);
}

export async function adminDeleteMember(id: string): Promise<void> {
  await apiClient.delete(`/admin/members/${id}`);
}

// Division Admin API
export async function adminGetDivisions(): Promise<Division[]> {
  const data = await apiClient.get<any>('/admin/divisions');
  const items = Array.isArray(data) ? data : data?.divisions || [];
  return Array.isArray(items) ? items.map(mapApiDivision) : [];
}

export async function adminCreateDivision(division: Omit<Division, 'id'>): Promise<Division> {
  const data = await apiClient.post<any>('/admin/divisions', division);
  return mapApiDivision(data);
}

export async function adminUpdateDivision(id: string, division: Partial<Division>): Promise<Division> {
  const data = await apiClient.put<any>(`/admin/divisions/${id}`, division);
  return mapApiDivision(data);
}

export async function adminDeleteDivision(id: string): Promise<void> {
  await apiClient.delete(`/admin/divisions/${id}`);
}

// Event Admin API
export async function adminGetEvents(): Promise<Event[]> {
  const data = await apiClient.get<any>('/admin/events');
  const items = Array.isArray(data) ? data : data?.events || [];
  return Array.isArray(items) ? items.map(mapApiEvent) : [];
}

export async function adminCreateEvent(eventItem: Omit<Event, 'id'>): Promise<Event> {
  const payload = toApiEventPayload(eventItem);
  const data = await apiClient.post<any>('/admin/events', payload);
  return mapApiEvent(data);
}

export async function adminUpdateEvent(id: string, eventItem: Partial<Event>): Promise<Event> {
  const payload = toApiEventPayload(eventItem);
  const data = await apiClient.put<any>(`/admin/events/${id}`, payload);
  return mapApiEvent(data);
}

export async function adminDeleteEvent(id: string): Promise<void> {
  await apiClient.delete(`/admin/events/${id}`);
}

// Project Admin API
export async function adminGetProjects(): Promise<Project[]> {
  const data = await apiClient.get<any>('/admin/projects');
  const items = Array.isArray(data) ? data : data?.projects || [];
  return Array.isArray(items) ? items.map(mapApiProject) : [];
}

export async function adminCreateProject(project: Omit<Project, 'id'>): Promise<Project> {
  const payload = toApiProjectPayload(project);
  const data = await apiClient.post<any>('/admin/projects', payload);
  return mapApiProject(data);
}

export async function adminUpdateProject(id: string, project: Partial<Project>): Promise<Project> {
  const payload = toApiProjectPayload(project);
  const data = await apiClient.put<any>(`/admin/projects/${id}`, payload);
  return mapApiProject(data);
}

export async function adminDeleteProject(id: string): Promise<void> {
  await apiClient.delete(`/admin/projects/${id}`);
}

// Achievement Admin API
export async function adminGetAchievements(): Promise<Achievement[]> {
  const data = await apiClient.get<any>('/admin/achievements');
  const items = Array.isArray(data) ? data : data?.achievements || [];
  return Array.isArray(items) ? items.map(mapApiAchievement) : [];
}

export async function adminCreateAchievement(achievement: Omit<Achievement, 'id'>): Promise<Achievement> {
  const payload = toApiAchievementPayload(achievement);
  const data = await apiClient.post<any>('/admin/achievements', payload);
  return mapApiAchievement(data);
}

export async function adminUpdateAchievement(id: string, achievement: Partial<Achievement>): Promise<Achievement> {
  const payload = toApiAchievementPayload(achievement);
  const data = await apiClient.put<any>(`/admin/achievements/${id}`, payload);
  return mapApiAchievement(data);
}

export async function adminDeleteAchievement(id: string): Promise<void> {
  await apiClient.delete(`/admin/achievements/${id}`);
}

// Announcement Admin API
export async function adminGetAnnouncements(): Promise<Announcement[]> {
  const data = await apiClient.get<any>('/admin/announcements');
  const items = Array.isArray(data) ? data : data?.announcements || [];
  return Array.isArray(items) ? items.map(mapApiAnnouncement) : [];
}

export async function adminCreateAnnouncement(announcement: Omit<Announcement, 'id'>): Promise<Announcement> {
  const payload = toApiAnnouncementPayload(announcement);
  const data = await apiClient.post<any>('/admin/announcements', payload);
  return mapApiAnnouncement(data);
}

export async function adminUpdateAnnouncement(id: string, announcement: Partial<Announcement>): Promise<Announcement> {
  const payload = toApiAnnouncementPayload(announcement);
  const data = await apiClient.put<any>(`/admin/announcements/${id}`, payload);
  return mapApiAnnouncement(data);
}

export async function adminDeleteAnnouncement(id: string): Promise<void> {
  await apiClient.delete(`/admin/announcements/${id}`);
}

// Partner Admin API
export async function adminGetPartners(): Promise<Partner[]> {
  const data = await apiClient.get<any>('/admin/partners');
  const items = Array.isArray(data) ? data : data?.partners || [];
  return Array.isArray(items) ? items.map(mapApiPartner) : [];
}

export async function adminCreatePartner(partner: Omit<Partner, 'id'>): Promise<Partner> {
  const payload = toApiPartnerPayload(partner);
  const data = await apiClient.post<any>('/admin/partners', payload);
  return mapApiPartner(data);
}

export async function adminUpdatePartner(id: string, partner: Partial<Partner>): Promise<Partner> {
  const payload = toApiPartnerPayload(partner);
  const data = await apiClient.put<any>(`/admin/partners/${id}`, payload);
  return mapApiPartner(data);
}

export async function adminDeletePartner(id: string): Promise<void> {
  await apiClient.delete(`/admin/partners/${id}`);
}

// Gallery Admin API
export async function adminGetGallery(): Promise<GalleryItem[]> {
  const data = await apiClient.get<any>('/admin/gallery');
  const items = Array.isArray(data) ? data : data?.gallery || [];
  return Array.isArray(items) ? items.map(mapApiGalleryItem) : [];
}

export async function adminCreateGallery(gallery: Omit<GalleryItem, 'id'>): Promise<GalleryItem> {
  const payload = toApiGalleryPayload(gallery);
  const data = await apiClient.post<any>('/admin/gallery', payload);
  return mapApiGalleryItem(data);
}

export async function adminUpdateGallery(id: string, gallery: Partial<GalleryItem>): Promise<GalleryItem> {
  const payload = toApiGalleryPayload(gallery);
  const data = await apiClient.put<any>(`/admin/gallery/${id}`, payload);
  return mapApiGalleryItem(data);
}

export async function adminDeleteGallery(id: string): Promise<void> {
  await apiClient.delete(`/admin/gallery/${id}`);
}

// Faculty Admin API
export async function adminGetFaculty(): Promise<FacultyCoordinator> {
  const data = await apiClient.get<any>('/admin/faculty');
  return mapApiFaculty(data);
}

export async function adminUpdateFaculty(faculty: Partial<FacultyCoordinator>): Promise<FacultyCoordinator> {
  const payload = {
    name: faculty.name,
    designation: faculty.designation,
    department: faculty.department,
    imageUrl: faculty.image,
    bio: faculty.bio,
    email: faculty.email,
    phone: faculty.phone,
    office: faculty.office,
  };
  const data = await apiClient.put<any>('/admin/faculty', payload);
  return mapApiFaculty(data);
}

// Applications Admin API
export async function adminGetApplications(): Promise<Application[]> {
  const data = await apiClient.get<any>('/admin/applications');
  const items = Array.isArray(data) ? data : data?.applications || [];
  return Array.isArray(items) ? items.map(mapApiApplication) : [];
}

export async function adminUpdateApplicationStatus(id: string, status: string): Promise<Application> {
  const data = await apiClient.patch<any>(`/admin/applications/${id}/status`, { status: status.toUpperCase() });
  return mapApiApplication(data);
}

export async function adminDeleteApplication(id: string): Promise<void> {
  await apiClient.delete(`/admin/applications/${id}`);
}

// Contact Messages Admin API
export async function adminGetContactMessages(): Promise<ContactMessage[]> {
  const data = await apiClient.get<any>('/admin/contact-messages');
  const items = Array.isArray(data) ? data : data?.messages || [];
  return Array.isArray(items) ? items.map(mapApiContactMessage) : [];
}

export async function adminMarkContactRead(id: string, isRead: boolean = true): Promise<ContactMessage> {
  const data = await apiClient.patch<any>(`/admin/contact-messages/${id}`, { isRead });
  return mapApiContactMessage(data);
}

export async function adminDeleteContactMessage(id: string): Promise<void> {
  await apiClient.delete(`/admin/contact-messages/${id}`);
}
