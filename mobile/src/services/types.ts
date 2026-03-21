export type Duration = '2hr' | '4hr' | '8hr' | '12hr';
export type PaymentType = 'full' | 'deposit';

export interface PublicStudioProfile {
  id: string;
  slug: string;
  displayName: string;
  studioName: string;
  about: string;
  timezone: string;
  email: string;
  phone: string;
  address: string;
  serviceArea: string;
  bookingPolicy: string;
  bookingLinkMode: 'internal' | 'external';
  externalBookingUrl: string | null;
  logo: { url: string } | null;
  heroImage: { url: string } | null;
  gallery: Array<{ url: string; altText: string; label: string }>;
}

export interface BusyInterval {
  id: string;
  start_time: string;
  end_time: string;
  type: 'booking' | 'block';
}

export interface AccessibleStudio {
  id: string;
  name: string;
  slug: string;
  timezone: string;
  membership_role: string;
}

export interface DashboardMeResponse {
  email: string;
  accessible_studios: AccessibleStudio[];
  current_studio: AccessibleStudio | null;
}

export interface StudioDashboardSummary {
  studio: {
    id: string;
    name: string;
    slug: string;
  };
  bookings: { items: Array<{ id: string; customer_name: string; start_time: string }> };
  blocks: { items: Array<{ id: string; start_time: string; end_time: string; reason: string }> };
  team: { items: Array<{ id: string; email: string; role: string }> };
  publication: { publication: { isPublic: boolean; publishReady: boolean; requiredFields: string[] } };
}
