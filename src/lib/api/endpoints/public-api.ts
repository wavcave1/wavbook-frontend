import { apiFetch } from "@/lib/api/client";
import type {
  AvailabilityResponse,
  MarketplaceHomeResponse,
  PaymentIntentRequest,
  PaymentIntentResponse,
  PaymentIntentStatusResponse,
  PriceMap,
  PublicStudioProfile,
  StudioSearchResponse,
} from "@/types/api";

export const publicApi = {
  getMarketplaceHome: () =>
    apiFetch<MarketplaceHomeResponse>("/api/public/marketplace/home", {
      next: { revalidate: 60 },
    }),

  searchStudios: (params: { q?: string; location?: string }) =>
    apiFetch<StudioSearchResponse>("/api/public/studios", {
      query: params,
      next: { revalidate: 30 },
    }),

  getStudio: (slug: string) =>
    apiFetch<PublicStudioProfile>(`/api/public/studios/${slug}`, {
      next: { revalidate: 30 },
    }),

  getStudioAvailability: (slug: string, params: { start: string; end: string }) =>
    apiFetch<AvailabilityResponse>(`/api/public/studios/${slug}/availability`, {
      query: params,
    }),

  getPrices: (date?: string) =>
    apiFetch<PriceMap>("/api/public/bookings/prices", {
      query: { date },
      next: { revalidate: 60 },
    }),

  createPaymentIntent: (payload: PaymentIntentRequest) =>
    apiFetch<PaymentIntentResponse>("/api/public/bookings/payment-intents", {
      method: "POST",
      body: payload,
    }),

  getPaymentStatus: (paymentIntentId: string) =>
    apiFetch<PaymentIntentStatusResponse>(
      `/api/public/bookings/payment-intents/${paymentIntentId}/status`,
    ),
};
