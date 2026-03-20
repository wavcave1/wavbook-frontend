import type { PublicStudioProfile } from "@/types/api";

export const mockHomepageFeaturedStudios: PublicStudioProfile[] = [
  {
    id: "mock-studio-1",
    slug: "signal-room-chicago",
    displayName: "Signal Room Chicago",
    studioName: "Signal Room Chicago",
    publishedAt: "2026-03-01T12:00:00.000Z",
    about:
      "A daylight-friendly room for vocal tracking, songwriting sessions, and fast-turn content shoots.",
    timezone: "America/Chicago",
    email: "bookings@signalroom.example",
    phone: "(312) 555-0140",
    address: "West Loop, Chicago",
    serviceArea: "Chicago",
    bookingPolicy:
      "Mock policy placeholder. Replace automatically when the marketplace API is reachable.",
    bookingLinkMode: "internal",
    externalBookingUrl: null,
    logo: null,
    heroImage: null,
    gallery: [],
  },
  {
    id: "mock-studio-2",
    slug: "harbor-stage-brooklyn",
    displayName: "Harbor Stage Brooklyn",
    studioName: "Harbor Stage Brooklyn",
    publishedAt: "2026-03-02T12:00:00.000Z",
    about:
      "A medium-format rehearsal and content space with flexible blocks for crews, musicians, and podcast teams.",
    timezone: "America/New_York",
    email: "hello@harborstage.example",
    phone: "(718) 555-0114",
    address: "Red Hook, Brooklyn",
    serviceArea: "New York City",
    bookingPolicy:
      "Mock policy placeholder. Replace automatically when the marketplace API is reachable.",
    bookingLinkMode: "internal",
    externalBookingUrl: null,
    logo: null,
    heroImage: null,
    gallery: [],
  },
  {
    id: "mock-studio-3",
    slug: "amber-live-room-austin",
    displayName: "Amber Live Room",
    studioName: "Amber Live Room Austin",
    publishedAt: "2026-03-03T12:00:00.000Z",
    about:
      "Designed for full-band rehearsals, camera-ready sessions, and all-day lockouts with a simple online booking flow.",
    timezone: "America/Chicago",
    email: "team@amberlive.example",
    phone: "(737) 555-0118",
    address: "East Austin",
    serviceArea: "Austin",
    bookingPolicy:
      "Mock policy placeholder. Replace automatically when the marketplace API is reachable.",
    bookingLinkMode: "internal",
    externalBookingUrl: null,
    logo: null,
    heroImage: null,
    gallery: [],
  },
];

export const mockHomepageLocations = mockHomepageFeaturedStudios.map(
  (studio) => studio.address || studio.serviceArea,
);

export const homepageTestimonialPlaceholders = [
  {
    title: "Customer reviews slot",
    description:
      "Plug a real testimonials or reviews feed into this block once the source of truth is ready.",
  },
  {
    title: "Marketplace conversion proof",
    description:
      "Show customer quotes, booking outcomes, or creator case studies here without changing the page structure.",
  },
  {
    title: "Studio owner success story",
    description:
      "Use this card for an operator story about fewer back-and-forth messages, cleaner calendar control, or faster booking intake.",
  },
];
