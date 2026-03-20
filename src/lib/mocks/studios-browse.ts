import { mockHomepageFeaturedStudios } from "@/lib/mocks/homepage";
import type { PublicStudioProfile } from "@/types/api";

export const studioBrowseCategoryOptions = [
  "Recording",
  "Rehearsal",
  "Podcast",
  "Content",
] as const;

export const studioBrowseAmenityOptions = [
  "Parking",
  "Natural Light",
  "In-house Engineer",
  "Late Hours",
] as const;

export interface MockBrowseStudioRecord {
  studio: PublicStudioProfile;
  categories: string[];
  amenities: string[];
}

export const mockBrowseStudios: MockBrowseStudioRecord[] = [
  {
    studio: mockHomepageFeaturedStudios[0],
    categories: ["Recording", "Content"],
    amenities: ["Natural Light", "Parking"],
  },
  {
    studio: mockHomepageFeaturedStudios[1],
    categories: ["Rehearsal", "Podcast"],
    amenities: ["Late Hours", "Parking"],
  },
  {
    studio: mockHomepageFeaturedStudios[2],
    categories: ["Recording", "Rehearsal"],
    amenities: ["In-house Engineer", "Late Hours"],
  },
];
