import { apiFetch } from './api';
import type { DashboardMeResponse, StudioDashboardSummary } from './types';

export const adminApi = {
  getMe: (token: string) => apiFetch<DashboardMeResponse>('/api/auth/me', { token }),
  getStudios: (token: string) => apiFetch<{ current_studio: DashboardMeResponse['current_studio']; items: DashboardMeResponse['accessible_studios'] }>('/api/auth/studios', { token }),
  getDashboard: async (token: string, studioSlug: string): Promise<StudioDashboardSummary> => {
    const [studio, bookings, blocks, team, publication] = await Promise.all([
      apiFetch<StudioDashboardSummary['studio']>('/api/admin/studio', { token, query: { studio: studioSlug } }),
      apiFetch<StudioDashboardSummary['bookings']>('/api/admin/bookings', { token, query: { studio: studioSlug, pageSize: 6 } }),
      apiFetch<StudioDashboardSummary['blocks']>('/api/admin/blocks', { token, query: { studio: studioSlug } }),
      apiFetch<StudioDashboardSummary['team']>('/api/admin/team', { token, query: { studio: studioSlug } }),
      apiFetch<StudioDashboardSummary['publication']>('/api/admin/studio/publication', { token, query: { studio: studioSlug } }),
    ]);
    return { studio, bookings, blocks, team, publication };
  },
};
