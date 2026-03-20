import { placeholderStudioReviews } from "@/lib/mocks/reviews";
import type { StudioReviewResource } from "@/types/api";

export async function getStudioReviewsResource(
  slug: string,
): Promise<StudioReviewResource> {
  void slug;
  return placeholderStudioReviews;
}
