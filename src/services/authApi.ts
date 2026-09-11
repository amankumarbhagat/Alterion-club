import { apiClient } from './apiClient';

export interface AuthUser {
  id: string;
  email: string;
  username?: string;
  name: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'MEMBER';
}

export async function loginApi(credentials: { username?: string; email?: string; login?: string; password: string }): Promise<AuthUser> {
  const loginStr = credentials.login || credentials.username || credentials.email || '';
  const payload = { login: loginStr, password: credentials.password };
  const data = await apiClient.post<any>('/auth/login', payload);
  return data.user || data;
}

export async function logoutApi(): Promise<void> {
  await apiClient.post('/auth/logout');
}

export async function getMeApi(): Promise<AuthUser> {
  const data = await apiClient.get<any>('/auth/me');
  return data.user || data;
}
