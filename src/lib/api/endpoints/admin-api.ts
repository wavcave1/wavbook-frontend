import { apiFetch } from "@/lib/api/client";
import type {
  BlockRecord,
  BlocksResponse,
  BookingFilters,
  BookingRecord,
  BookingsResponse,
  CreateBlockPayload,
  PublicationResponse,
  StudioMediaItem,
  StudioMediaResponse,
  StudioProfileAdmin,
  StudioSettings,
  TeamResponse,
} from "@/types/api";

const studioQuery = (studioSlug: string) => ({ studio: studioSlug });

export const adminApi = {
  getStudio: (studioSlug: string) =>
    apiFetch<StudioProfileAdmin>("/api/admin/studio", {
      query: studioQuery(studioSlug),
    }),

  updateStudio: (
    studioSlug: string,
    payload: Partial<StudioProfileAdmin> & { studioSlug?: string },
  ) =>
    apiFetch<StudioProfileAdmin>("/api/admin/studio", {
      method: "PATCH",
      query: studioQuery(studioSlug),
      body: { ...payload, studioSlug },
    }),

  getPublication: (studioSlug: string) =>
    apiFetch<PublicationResponse>("/api/admin/studio/publication", {
      query: studioQuery(studioSlug),
    }),

  setPublication: (studioSlug: string, action: "publish" | "unpublish") =>
    apiFetch<PublicationResponse>("/api/admin/studio/publication", {
      method: "POST",
      query: studioQuery(studioSlug),
      body: { action, studioSlug },
    }),

  getStudioSettings: (studioSlug: string) =>
    apiFetch<StudioSettings>("/api/admin/studio/settings", {
      query: studioQuery(studioSlug),
    }),

  updateStudioSettings: (
    studioSlug: string,
    payload: Partial<StudioSettings> & { studioSlug?: string },
  ) =>
    apiFetch<StudioSettings>("/api/admin/studio/settings", {
      method: "PATCH",
      query: studioQuery(studioSlug),
      body: { ...payload, studioSlug },
    }),

  getStudioMedia: (studioSlug: string) =>
    apiFetch<StudioMediaResponse>("/api/admin/studio/media", {
      query: studioQuery(studioSlug),
    }),

  replaceStudioMedia: (studioSlug: string, items: StudioMediaItem[]) =>
    apiFetch<StudioMediaResponse>("/api/admin/studio/media", {
      method: "PUT",
      query: studioQuery(studioSlug),
      body: {
        studioSlug,
        items,
      },
    }),

  listBookings: (studioSlug: string, filters: BookingFilters = {}) =>
    apiFetch<BookingsResponse>("/api/admin/bookings", {
      query: {
        ...studioQuery(studioSlug),
        ...filters,
      },
    }),

  getBooking: (studioSlug: string, bookingId: string) =>
    apiFetch<BookingRecord>(`/api/admin/bookings/${bookingId}`, {
      query: studioQuery(studioSlug),
    }),

  updateBooking: (
    studioSlug: string,
    bookingId: string,
    payload: Partial<Pick<BookingRecord, "booking_status" | "notes">>,
  ) =>
    apiFetch<BookingRecord>(`/api/admin/bookings/${bookingId}`, {
      method: "PATCH",
      query: studioQuery(studioSlug),
      body: {
        ...payload,
        studioSlug,
      },
    }),

  listBlocks: (studioSlug: string, params?: { start?: string; end?: string }) =>
    apiFetch<BlocksResponse>("/api/admin/blocks", {
      query: {
        ...studioQuery(studioSlug),
        ...params,
      },
    }),

  createBlock: (payload: CreateBlockPayload) =>
    apiFetch<BlockRecord>("/api/admin/blocks", {
      method: "POST",
      body: payload,
      query: studioQuery(payload.studioSlug),
    }),

  deleteBlock: (studioSlug: string, blockId: string) =>
    apiFetch<{ success: true }>(`/api/admin/blocks/${blockId}`, {
      method: "DELETE",
      query: studioQuery(studioSlug),
    }),

  listTeam: (studioSlug: string) =>
    apiFetch<TeamResponse>("/api/admin/team", {
      query: studioQuery(studioSlug),
    }),
};
