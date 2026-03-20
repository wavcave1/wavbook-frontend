import { publicApi } from "@/lib/api/endpoints/public-api";
import {
  mockBrowseStudios,
  studioBrowseAmenityOptions,
  studioBrowseCategoryOptions,
} from "@/lib/mocks/studios-browse";
import type { PublicStudioProfile } from "@/types/api";

export interface StudioBrowseFilters {
  q?: string;
  location?: string;
  category?: string;
  amenity?: string;
}

export interface StudioBrowseData {
  source: "api" | "mock";
  studios: PublicStudioProfile[];
  count: number;
  locations: string[];
  categories: string[];
  amenities: string[];
  filters: Required<StudioBrowseFilters>;
  tagsBySlug: Record<string, string[]>;
  placeholderFiltersSupported: boolean;
}

const normalize = (value?: string) => value?.trim() ?? "";

const matchesText = (studio: PublicStudioProfile, query: string) => {
  if (!query) return true;

  const haystack = [
    studio.displayName,
    studio.studioName,
    studio.slug,
    studio.about,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
};

const matchesLocation = (studio: PublicStudioProfile, location: string) => {
  if (!location) return true;

  const haystack = [studio.address, studio.serviceArea].join(" ").toLowerCase();
  return haystack.includes(location.toLowerCase());
};

const toTagsBySlug = (records: typeof mockBrowseStudios) =>
  records.reduce<Record<string, string[]>>((map, record) => {
    map[record.studio.slug] = [...record.categories.slice(0, 1), ...record.amenities.slice(0, 2)];
    return map;
  }, {});

export async function getStudioBrowseData(
  filters: StudioBrowseFilters,
): Promise<StudioBrowseData> {
  const normalized = {
    q: normalize(filters.q),
    location: normalize(filters.location),
    category: normalize(filters.category),
    amenity: normalize(filters.amenity),
  };

  try {
    const payload = await publicApi.searchStudios({
      q: normalized.q,
      location: normalized.location,
    });

    return {
      source: "api",
      studios: payload.studios,
      count: payload.count,
      locations: Array.from(
        new Set(
          payload.studios.map((studio) => studio.address || studio.serviceArea).filter(Boolean),
        ),
      ),
      categories: [...studioBrowseCategoryOptions],
      amenities: [...studioBrowseAmenityOptions],
      filters: normalized,
      tagsBySlug: {},
      placeholderFiltersSupported: false,
    };
  } catch {
    const filtered = mockBrowseStudios.filter((record) => {
      const matchesCategory = normalized.category
        ? record.categories.includes(normalized.category)
        : true;
      const matchesAmenity = normalized.amenity
        ? record.amenities.includes(normalized.amenity)
        : true;

      return (
        matchesText(record.studio, normalized.q) &&
        matchesLocation(record.studio, normalized.location) &&
        matchesCategory &&
        matchesAmenity
      );
    });

    return {
      source: "mock",
      studios: filtered.map((record) => record.studio),
      count: filtered.length,
      locations: Array.from(
        new Set(
          mockBrowseStudios
            .map((record) => record.studio.address || record.studio.serviceArea)
            .filter(Boolean),
        ),
      ),
      categories: [...studioBrowseCategoryOptions],
      amenities: [...studioBrowseAmenityOptions],
      filters: normalized,
      tagsBySlug: toTagsBySlug(filtered),
      placeholderFiltersSupported: true,
    };
  }
}
