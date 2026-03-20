import { getStudioReviewsResource } from "@/lib/api/adapters/studio-reviews.adapter";
import { publicApi } from "@/lib/api/endpoints/public-api";
import { mockHomepageFeaturedStudios } from "@/lib/mocks/homepage";
import { mockBrowseStudios } from "@/lib/mocks/studios-browse";
import type { PublicStudioProfile, StudioReviewResource } from "@/types/api";

export type StudioProfileSource = "api" | "mock";
export type StudioProfileMetadataSource = "preview" | "placeholder";

export interface PublicStudioProfilePageData {
  source: StudioProfileSource;
  studio: PublicStudioProfile;
  categories: string[];
  amenities: string[];
  metadataSource: StudioProfileMetadataSource;
  reviews: StudioReviewResource;
}

const findMockBrowseRecord = (slug: string) =>
  mockBrowseStudios.find((record) => record.studio.slug === slug);

const findMockStudio = (slug: string) =>
  mockHomepageFeaturedStudios.find((studio) => studio.slug === slug) ?? null;

export async function getPublicStudioProfilePageData(
  slug: string,
): Promise<PublicStudioProfilePageData | null> {
  const normalizedSlug = slug.trim().toLowerCase();
  const [apiStudio, reviews] = await Promise.all([
    publicApi.getStudio(normalizedSlug).catch(() => null),
    getStudioReviewsResource(normalizedSlug),
  ]);

  const previewRecord = findMockBrowseRecord(normalizedSlug);
  const fallbackStudio = previewRecord?.studio ?? findMockStudio(normalizedSlug);
  const studio = apiStudio ?? fallbackStudio;

  if (!studio) {
    return null;
  }

  const previewMetadata = previewRecord
    ? {
        categories: previewRecord.categories,
        amenities: previewRecord.amenities,
        metadataSource: "preview" as const,
      }
    : {
        categories: [],
        amenities: [],
        metadataSource: "placeholder" as const,
      };

  return {
    source: apiStudio ? "api" : "mock",
    studio,
    categories: previewMetadata.categories,
    amenities: previewMetadata.amenities,
    metadataSource: previewMetadata.metadataSource,
    reviews,
  };
}
