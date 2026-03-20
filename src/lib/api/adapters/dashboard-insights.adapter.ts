import { placeholderDashboardInsights } from "@/lib/mocks/dashboard";
import type { DashboardInsightPlaceholder } from "@/types/api";

export async function getDashboardInsightsPlaceholder(
  studioSlug: string,
): Promise<DashboardInsightPlaceholder> {
  void studioSlug;
  return placeholderDashboardInsights;
}
