import { getDashboardInsightsPlaceholder } from "@/lib/api/adapters/dashboard-insights.adapter";
import { adminApi } from "@/lib/api/endpoints/admin-api";
import { authApi } from "@/lib/api/endpoints/auth-api";
import type {
  AccessibleStudio,
  BookingFilters,
  BookingRecord,
  BlockRecord,
  DashboardInsightPlaceholder,
  DashboardMeResponse,
  PublicationResponse,
  StudioMediaResponse,
  StudioProfileAdmin,
  StudioSettings,
  TeamResponse,
} from "@/types/api";

export interface StudioDashboardData {
  studio: StudioProfileAdmin;
  bookings: BookingRecord[];
  blocks: BlockRecord[];
  team: TeamResponse["items"];
  publication: PublicationResponse["publication"];
  insight: DashboardInsightPlaceholder;
}

export interface CalendarData {
  studio: StudioProfileAdmin;
  bookings: BookingRecord[];
  blocks: BlockRecord[];
}

export interface BrandingData {
  studio: StudioProfileAdmin;
  settings: StudioSettings;
  media: StudioMediaResponse["items"];
}

export interface StudioShellContext {
  me: DashboardMeResponse;
  studioAccess: AccessibleStudio | null;
}

export async function loadAppHome() {
  return authApi.getMe();
}

export async function loadStudioShellContext(
  slug: string,
): Promise<StudioShellContext> {
  const me = await authApi.getMe();

  return {
    me,
    studioAccess:
      me.accessible_studios.find((studio) => studio.slug === slug) ??
      (me.current_studio?.slug === slug ? me.current_studio : null),
  };
}

export async function loadStudioDashboard(slug: string): Promise<StudioDashboardData> {
  const [studio, bookingsResponse, blocksResponse, publication, team, insight] =
    await Promise.all([
      adminApi.getStudio(slug),
      adminApi.listBookings(slug, { pageSize: 6 }),
      adminApi.listBlocks(slug),
      adminApi.getPublication(slug),
      adminApi.listTeam(slug),
      getDashboardInsightsPlaceholder(slug),
    ]);

  return {
    studio,
    bookings: bookingsResponse.items,
    blocks: blocksResponse.items,
    team: team.items,
    publication: publication.publication,
    insight,
  };
}

export async function loadStudioBookings(slug: string, filters: BookingFilters) {
  const [studio, bookings] = await Promise.all([
    adminApi.getStudio(slug),
    adminApi.listBookings(slug, filters),
  ]);

  return { studio, bookings };
}

export async function loadStudioCalendar(slug: string, range?: { start?: string; end?: string }) {
  const [studio, bookings, blocks] = await Promise.all([
    adminApi.getStudio(slug),
    adminApi.listBookings(slug, {
      start: range?.start,
      end: range?.end,
      pageSize: 100,
    }),
    adminApi.listBlocks(slug, range),
  ]);

  return {
    studio,
    bookings: bookings.items,
    blocks: blocks.items,
  };
}

export async function loadStudioBlocks(slug: string, range?: { start?: string; end?: string }) {
  const [studio, blocks] = await Promise.all([
    adminApi.getStudio(slug),
    adminApi.listBlocks(slug, range),
  ]);

  return { studio, blocks: blocks.items };
}

export async function loadStudioProfileSettings(slug: string) {
  return adminApi.getStudio(slug);
}

export async function loadStudioContactSettings(slug: string) {
  return adminApi.getStudio(slug);
}

export async function loadStudioBranding(slug: string): Promise<BrandingData> {
  const [studio, settings, media] = await Promise.all([
    adminApi.getStudio(slug),
    adminApi.getStudioSettings(slug),
    adminApi.getStudioMedia(slug),
  ]);

  return { studio, settings, media: media.items };
}

export async function loadStudioBookingSettings(slug: string) {
  const [studio, settings] = await Promise.all([
    adminApi.getStudio(slug),
    adminApi.getStudioSettings(slug),
  ]);

  return { studio, settings };
}

export async function loadStudioPublicPage(slug: string) {
  const [studio, publication, media, settings] = await Promise.all([
    adminApi.getStudio(slug),
    adminApi.getPublication(slug),
    adminApi.getStudioMedia(slug),
    adminApi.getStudioSettings(slug),
  ]);

  return {
    studio,
    publication: publication.publication,
    requiredFields: publication.required_fields,
    media: media.items,
    settings,
  };
}
