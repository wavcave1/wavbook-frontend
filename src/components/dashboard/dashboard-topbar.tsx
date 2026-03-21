"use client";

import Link from "@/compat/next-link";
import { usePathname } from "@/compat/next-navigation";
import { cn } from "@/lib/utils";
import type { AccessibleStudio } from "@/types/api";

interface DashboardTopbarProps {
  studioSlug?: string;
  studioName?: string;
  studioTimezone?: string;
  operatorEmail?: string;
  accessibleStudios?: AccessibleStudio[];
}

export function DashboardTopbar({
  studioSlug,
  studioName,
  studioTimezone,
  operatorEmail,
  accessibleStudios = [],
}: DashboardTopbarProps) {
  const pathname = usePathname();
  const activeStudio =
    accessibleStudios.find((studio) => studio.slug === studioSlug) ?? null;
  const resolvedStudioName = studioName ?? activeStudio?.name ?? studioSlug;
  const resolvedStudioTimezone = studioTimezone ?? activeStudio?.timezone;
  const contextLabel = studioSlug ? "Studio workspace" : "Operator workspace";

  return (
    <div className="dashboard-topbar">
      <div className="dashboard-topbar-main">
        <div className="dashboard-topbar-context">
          <Link href="/app" className="dashboard-home-link">
            Wavebook Operator
          </Link>
          <div className="dashboard-topbar-copy">
            <span className="eyebrow">{contextLabel}</span>
            <div className="dashboard-topbar-title-row">
              <strong>{resolvedStudioName || "All studios"}</strong>
              {studioSlug ? (
                <span className="dashboard-context-chip">{studioSlug}</span>
              ) : null}
              {resolvedStudioTimezone ? (
                <span className="dashboard-context-chip">
                  {resolvedStudioTimezone}
                </span>
              ) : null}
              {activeStudio?.membership_role ? (
                <span className="dashboard-context-chip">
                  {activeStudio.membership_role}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="dashboard-topbar-actions">
          {studioSlug ? (
            <>
              <Link
                href={`/studios/${studioSlug}`}
                className="button button-secondary"
              >
                View public page
              </Link>
              <Link
                href={`/studios/${studioSlug}/book`}
                className="button button-ghost"
              >
                Test booking
              </Link>
            </>
          ) : null}

          {operatorEmail ? (
            <div className="dashboard-operator-badge">
              <span className="eyebrow">Signed in</span>
              <strong>{operatorEmail}</strong>
            </div>
          ) : null}
        </div>
      </div>

      {accessibleStudios.length ? (
        <div className="dashboard-studio-switcher" aria-label="Studio switcher">
          {accessibleStudios.map((studio) => {
            const href = `/app/studio/${studio.slug}/dashboard`;
            const isActive = pathname.startsWith(`/app/studio/${studio.slug}/`);

            return (
              <Link
                key={studio.id}
                href={href}
                className={cn(
                  "dashboard-switcher-link",
                  isActive && "dashboard-switcher-link-active",
                )}
              >
                <strong>{studio.name}</strong>
                <span>
                  {studio.membership_role} · {studio.timezone}
                </span>
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
