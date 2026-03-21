import { apiFetch } from './api';
import type { BusyInterval, Duration, PaymentType, PublicStudioProfile } from './types';

export const publicApi = {
  getHome: () => apiFetch<{ count: number; featured: PublicStudioProfile[]; newest: PublicStudioProfile[]; locations: string[] }>('/api/public/marketplace/home'),
  searchStudios: (params?: { q?: string; location?: string }) => apiFetch<{ studios: PublicStudioProfile[]; count: number }>('/api/public/studios', { query: params }),
  getStudio: (slug: string) => apiFetch<PublicStudioProfile>(`/api/public/studios/${slug}`),
  getAvailability: (slug: string, params: { start: string; end: string }) => apiFetch<{ busy: BusyInterval[] }>(`/api/public/studios/${slug}/availability`, { query: params }),
  getPrices: (date?: string) => apiFetch<Record<Duration, number>>('/api/public/bookings/prices', { query: { date } }),
  createPaymentIntent: (payload: { studioSlug: string; service: Duration; paymentType: PaymentType; name: string; email: string; phone: string; date: string }) =>
    apiFetch<{ clientSecret: string | null }>('/api/public/bookings/payment-intents', { method: 'POST', body: payload }),
  getPaymentStatus: (paymentIntentId: string) => apiFetch<{ status: string; error?: string }>(`/api/public/bookings/payment-intents/${paymentIntentId}/status`),
};
