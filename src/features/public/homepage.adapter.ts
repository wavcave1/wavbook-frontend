import { publicApi } from "@/lib/api/endpoints/public-api";
import {
  mockHomepageFeaturedStudios,
  mockHomepageLocations,
} from "@/lib/mocks/homepage";
import type { PublicStudioProfile } from "@/types/api";

export interface HomepageLandingData {
  publishedStudioCount: number;
  featuredStudios: PublicStudioProfile[];
  newestStudios: PublicStudioProfile[];
  locations: string[];
  featuredSource: "api" | "mock";
}

export async function getHomepageLandingData(): Promise<HomepageLandingData> {
  try {
    const payload = await publicApi.getMarketplaceHome();

    return {
      publishedStudioCount: payload.count,
      featuredStudios: payload.featured,
      newestStudios: payload.newest,
      locations: payload.locations,
      featuredSource: "api",
    };
  } catch {
    return {
      publishedStudioCount: mockHomepageFeaturedStudios.length,
      featuredStudios: mockHomepageFeaturedStudios,
      newestStudios: mockHomepageFeaturedStudios,
      locations: mockHomepageLocations,
      featuredSource: "mock",
    };
  }
}
