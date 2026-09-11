import { apiClient } from './apiClient';
import {
  mapApiDivision,
  mapApiMember,
  mapApiProject,
  mapApiEvent,
  mapApiAchievement,
  mapApiAnnouncement,
  mapApiPartner,
  mapApiGalleryItem,
  mapApiFaculty,
  mapApiStats,
  mapApiApplication,
  mapApiContactMessage,
  toApiApplicationPayload,
  toApiContactPayload,
} from './mappers';
import type {
  Division,
  Member,
  Project,
  Event,
  Achievement,
  Announcement,
  Partner,
  GalleryItem,
  FacultyCoordinator,
  HomeStats,
  Application,
  ContactMessage,
} from '../data/seedData';

export async function fetchDivisions(): Promise<Division[]> {
  const data = await apiClient.get<any[]>('/public/divisions');
  return Array.isArray(data) ? data.map(mapApiDivision) : [];
}

export async function fetchMembers(): Promise<Member[]> {
  const data = await apiClient.get<any[]>('/public/members');
  return Array.isArray(data) ? data.map(mapApiMember) : [];
}

export async function fetchProjects(): Promise<Project[]> {
  const data = await apiClient.get<any[]>('/public/projects');
  return Array.isArray(data) ? data.map(mapApiProject) : [];
}

export async function fetchEvents(): Promise<Event[]> {
  const data = await apiClient.get<any[]>('/public/events');
  return Array.isArray(data) ? data.map(mapApiEvent) : [];
}

export async function fetchAchievements(): Promise<Achievement[]> {
  const data = await apiClient.get<any[]>('/public/achievements');
  return Array.isArray(data) ? data.map(mapApiAchievement) : [];
}

export async function fetchAnnouncements(): Promise<Announcement[]> {
  const data = await apiClient.get<any[]>('/public/announcements');
  return Array.isArray(data) ? data.map(mapApiAnnouncement) : [];
}

export async function fetchPartners(): Promise<Partner[]> {
  const data = await apiClient.get<any[]>('/public/partners');
  return Array.isArray(data) ? data.map(mapApiPartner) : [];
}

export async function fetchGallery(): Promise<GalleryItem[]> {
  const data = await apiClient.get<any[]>('/public/gallery');
  return Array.isArray(data) ? data.map(mapApiGalleryItem) : [];
}

export async function fetchFaculty(): Promise<FacultyCoordinator> {
  const data = await apiClient.get<any>('/public/faculty');
  return mapApiFaculty(data);
}

export async function fetchSiteStats(): Promise<HomeStats> {
  const data = await apiClient.get<any>('/public/stats');
  return mapApiStats(data);
}

export async function submitApplication(appData: Partial<Application>): Promise<Application> {
  const payload = toApiApplicationPayload(appData);
  const data = await apiClient.post<any>('/public/applications', payload);
  return mapApiApplication(data);
}

export async function submitContactMessage(msgData: Partial<ContactMessage>): Promise<ContactMessage> {
  const payload = toApiContactPayload(msgData);
  const data = await apiClient.post<any>('/public/contact', payload);
  return mapApiContactMessage(data);
}

export async function registerForEvent(eventId: string, regData: { name: string; email: string; phone?: string; usn?: string; branch?: string; year?: string }): Promise<any> {
  return apiClient.post(`/public/events/${eventId}/register`, regData);
}
