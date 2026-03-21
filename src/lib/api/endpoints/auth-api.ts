import { apiFetch } from '@/lib/api/client';
import type { DashboardMeResponse, DashboardStudiosResponse } from '@/types/api';

export const authApi = {
  login: () =>
    apiFetch('/api/auth/login', {
      method: 'POST',
    }),

  register: (
    payload: { inviteCode: string; studioName?: string },
    token?: string,
  ) =>
    apiFetch('/api/auth/register', {
      method: 'POST',
      body: payload,
      token,
    }),

  logout: () =>
    apiFetch('/api/auth/logout', {
      method: 'POST',
    }),

  getMe: () => apiFetch<DashboardMeResponse>('/api/auth/me'),

  getStudios: () => apiFetch<DashboardStudiosResponse>('/api/auth/studios'),
};
