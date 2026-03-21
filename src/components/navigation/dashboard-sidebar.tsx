"use client";

import Link from "@/compat/next-link";
import { usePathname } from "@/compat/next-navigation";
import { getStudioNavigation } from "@/features/dashboard/navigation";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  studioSlug: string;
  studioName?: string;
}

export function DashboardSidebar({
  studioSlug,
  studioName,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const groups = getStudioNavigation(studioSlug);

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-studio">
        <span className="eyebrow">Studio workspace</span>
        <strong>{studioName || studioSlug}</strong>
        <Link
          href="/app"
          className={cn(
            "sidebar-link sidebar-link-compact",
            pathname === "/app" && "sidebar-link-active",
          )}
        >
          All studios
        </Link>
      </div>

      <div className="sidebar-group-list">
        {groups.map((group) => (
          <div className="sidebar-group" key={group.title}>
            <span className="sidebar-title">{group.title}</span>
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "sidebar-link",
                  pathname === item.href && "sidebar-link-active",
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div className="sidebar-group">
        <span className="sidebar-title">Public</span>
        <Link href={`/studios/${studioSlug}`} className="sidebar-link">
          View public page
        </Link>
        <Link href={`/studios/${studioSlug}/book`} className="sidebar-link">
          Test booking page
        </Link>
      </div>
    </aside>
  );
}
