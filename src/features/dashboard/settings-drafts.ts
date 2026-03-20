import type {
  StudioMediaItem,
  StudioProfileAdmin,
  StudioSettings,
} from "@/types/api";

export interface ProfileSettingsDraft {
  name: string;
  public_display_name: string;
  slug: string;
  timezone: string;
}

export interface ContactSettingsDraft {
  email: string;
  phone: string;
  address: string;
  service_area: string;
}

export interface BrandingSettingsDraft {
  brand_primary_color: string;
  brand_secondary_color: string;
  logo_url: string;
  hero_url: string;
  gallery_urls: string;
}

export interface BookingSettingsDraft {
  booking_policy: string;
  cancellation_policy: string;
  arrival_instructions: string;
  parking_info: string;
}

export interface PublicPageSettingsDraft {
  booking_link_mode: "internal" | "external";
  external_booking_url: string;
}

export const createProfileSettingsDraft = (
  studio: StudioProfileAdmin | null | undefined,
): ProfileSettingsDraft => ({
  name: studio?.name ?? "",
  public_display_name: studio?.public_display_name ?? "",
  slug: studio?.slug ?? "",
  timezone: studio?.timezone ?? "",
});

export const createContactSettingsDraft = (
  studio: StudioProfileAdmin | null | undefined,
): ContactSettingsDraft => ({
  email: studio?.email ?? "",
  phone: studio?.phone ?? "",
  address: studio?.address ?? "",
  service_area: studio?.service_area ?? "",
});

export const createBookingSettingsDraft = (
  settings: StudioSettings | null | undefined,
): BookingSettingsDraft => ({
  booking_policy: settings?.booking_policy ?? "",
  cancellation_policy: settings?.cancellation_policy ?? "",
  arrival_instructions: settings?.arrival_instructions ?? "",
  parking_info: settings?.parking_info ?? "",
});

export const createPublicPageSettingsDraft = (
  studio: StudioProfileAdmin | null | undefined,
): PublicPageSettingsDraft => ({
  booking_link_mode: studio?.booking_link_mode ?? "internal",
  external_booking_url: studio?.external_booking_url ?? "",
});

export const createBrandingSettingsDraft = (
  settings: StudioSettings | null | undefined,
  media: StudioMediaItem[] | null | undefined,
): BrandingSettingsDraft => ({
  brand_primary_color: settings?.brand_primary_color ?? "",
  brand_secondary_color: settings?.brand_secondary_color ?? "",
  logo_url:
    media?.find((item) => item.media_type === "logo")?.url ?? "",
  hero_url:
    media?.find((item) => item.media_type === "hero")?.url ?? "",
  gallery_urls:
    media
      ?.filter((item) => item.media_type === "gallery")
      .map((item) => item.url)
      .join("\n") ?? "",
});

export const buildStudioMediaPayload = (
  draft: BrandingSettingsDraft,
): StudioMediaItem[] => {
  const logoUrl = draft.logo_url.trim();
  const heroUrl = draft.hero_url.trim();
  const galleryItems = draft.gallery_urls
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((url, index) => ({
      media_type: "gallery" as const,
      label: `Gallery ${index + 1}`,
      url,
      alt_text: `Gallery image ${index + 1}`,
      sort_order: index + 2,
    }));

  return [
    ...(logoUrl
      ? [
          {
            media_type: "logo" as const,
            label: "Logo",
            url: logoUrl,
            alt_text: "Studio logo",
            sort_order: 0,
          },
        ]
      : []),
    ...(heroUrl
      ? [
          {
            media_type: "hero" as const,
            label: "Hero",
            url: heroUrl,
            alt_text: "Studio hero image",
            sort_order: 1,
          },
        ]
      : []),
    ...galleryItems,
  ];
};
