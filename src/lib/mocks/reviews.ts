import type { StudioReviewResource } from "@/types/api";

export const placeholderStudioReviews: StudioReviewResource = {
  state: "unavailable",
  message:
    "Reviews are intentionally left as a placeholder because the backend currently returns a 501 for this resource.",
  items: [],
};
