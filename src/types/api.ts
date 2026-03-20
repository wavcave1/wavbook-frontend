export type Duration = "2hr" | "4hr" | "8hr" | "12hr";
export type PaymentType = "full" | "deposit";
export type BookingStatus = "confirmed" | "cancelled" | "completed" | "no_show";
export type PaymentStatus = "paid" | "pending" | "failed";
export type StudioMembershipRole = "owner" | "manager" | "staff";

export interface PublicStudioMediaItem {
  mediaType: "logo" | "hero" | "gallery";
  url: string;
  altText: string;
  label: string;
}

export interface PublicStudioProfile {
  id: string;
  slug: string;
  displayName: string;
  studioName: string;
  publishedAt: string | null;
  about: string;
  timezone: string;
  email: string;
  phone: string;
  address: string;
  serviceArea: string;
  bookingPolicy: string;
  bookingLinkMode: "internal" | "external";
  externalBookingUrl: string | null;
  logo: PublicStudioMediaItem | null;
  heroImage: PublicStudioMediaItem | null;
  gallery: PublicStudioMediaItem[];
}

export interface MarketplaceHomeResponse {
  count: number;
  featured: PublicStudioProfile[];
  newest: PublicStudioProfile[];
  locations: string[];
}

export interface StudioSearchResponse {
  filters: {
    query: string;
    location: string;
  };
  count: number;
  studios: PublicStudioProfile[];
}

export interface BusyInterval {
  id: string;
  start_time: string;
  end_time: string;
  type: "booking" | "block";
}

export interface AvailabilityResponse {
  busy: BusyInterval[];
  studio: {
    id: string;
    slug: string;
    name: string;
  };
}

export type PriceMap = Record<Duration, number>;

export interface PaymentIntentRequest {
  studioSlug: string;
  service: Duration;
  paymentType: PaymentType;
  name: string;
  email: string;
  phone: string;
  date: string;
}

export interface PaymentIntentResponse {
  clientSecret: string | null;
}

export interface PaymentIntentStatusResponse {
  status: "pending" | "confirmed" | "failed" | "not_found" | "expired";
  metadata?: Record<string, string>;
  error?: string;
  booking?: BookingRecord;
}

export interface AuthUser {
  id: string | null;
  user_id: string;
  email: string;
  studio_id: string | null;
  created_at?: string;
}

export interface AccessibleStudio {
  id: string;
  name: string;
  slug: string;
  timezone: string;
  membership_role: StudioMembershipRole;
}

export interface DashboardMeResponse extends AuthUser {
  legacy_studio_id: string | null;
  current_studio: AccessibleStudio | null;
  accessible_studios: AccessibleStudio[];
}

export interface DashboardStudiosResponse {
  current_studio: AccessibleStudio | null;
  items: AccessibleStudio[];
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  inviteCode: string;
}

export interface StudioProfileAdmin {
  id: string;
  name: string;
  public_display_name: string;
  slug: string;
  timezone: string;
  email: string;
  phone: string;
  address: string;
  service_area: string;
  is_public: boolean;
  booking_link_mode: "internal" | "external";
  external_booking_url: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  publication?: PublicationState;
}

export interface PublicationState {
  isPublic: boolean;
  publishReady: boolean;
  publishedAt: string | null;
  requiredFields: string[];
}

export interface PublicationResponse {
  publication: PublicationState;
  required_fields: string[];
}

export interface StudioSettings {
  studio_id: string;
  booking_policy: string;
  cancellation_policy: string;
  arrival_instructions: string;
  parking_info: string;
  brand_primary_color: string;
  brand_secondary_color: string;
  created_at?: string;
  updated_at?: string;
  publication?: PublicationState;
}

export interface StudioMediaItem {
  id?: string;
  studio_id?: string;
  media_type: "logo" | "hero" | "gallery";
  label: string;
  url: string;
  alt_text: string;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface StudioMediaResponse {
  items: StudioMediaItem[];
  publication?: PublicationState;
}

export interface BookingRecord {
  id: string;
  studio_id: string;
  stripe_payment_intent_id: string;
  service: Duration;
  payment_type: PaymentType;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  start_time: string;
  end_time: string;
  timezone: string;
  booking_status: BookingStatus;
  payment_status: PaymentStatus;
  created_at: string;
  notes: string;
}

export interface BookingsResponse {
  page: number;
  pageSize: number;
  total: number;
  items: BookingRecord[];
}

export interface BookingFilters {
  query?: string;
  service?: Duration | "";
  booking_status?: BookingStatus | "";
  payment_status?: PaymentStatus | "";
  start?: string;
  end?: string;
  page?: number;
  pageSize?: number;
}

export interface BlockRecord {
  id: string;
  studio_id: string;
  start_time: string;
  end_time: string;
  timezone: string;
  reason: string;
  created_by_admin: string | null;
  created_at?: string;
}

export interface BlocksResponse {
  items: BlockRecord[];
}

export interface CreateBlockPayload {
  studioSlug: string;
  start_time: string;
  end_time: string;
  reason: string;
}

export interface TeamMember {
  id: string;
  role: StudioMembershipRole;
  created_at: string;
  user_id: string;
  email: string;
}

export interface TeamResponse {
  items: TeamMember[];
}

export interface StudioReviewResource {
  state: "unavailable";
  message: string;
  items: [];
}

export interface BookingPricingPreview {
  fullPrice?: number;
  paymentTypePrice?: number | null;
  note?: string;
}

export interface DashboardInsightPlaceholder {
  title: string;
  message: string;
  actions: string[];
}
