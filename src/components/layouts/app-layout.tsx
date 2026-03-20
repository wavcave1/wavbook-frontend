import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { DashboardSidebar } from "@/components/navigation/dashboard-sidebar";
import { cn } from "@/lib/utils";
import type { AccessibleStudio } from "@/types/api";

interface AppLayoutProps {
  title: string;
  description?: string;
  studioSlug?: string;
  studioName?: string;
  studioTimezone?: string;
  operatorEmail?: string;
  accessibleStudios?: AccessibleStudio[];
  actions?: React.ReactNode;
  showSidebar?: boolean;
  children: React.ReactNode;
}

export function AppLayout({
  title,
  description,
  studioSlug,
  studioName,
  studioTimezone,
  operatorEmail,
  accessibleStudios,
  actions,
  showSidebar = true,
  children,
}: AppLayoutProps) {
  return (
    <div className="app-screen">
      <div className="container">
        <div className={cn("app-layout", !showSidebar && "app-layout-single")}>
          {showSidebar && studioSlug ? (
            <DashboardSidebar
              studioSlug={studioSlug}
              studioName={studioName}
            />
          ) : null}

          <section className="app-main">
            <DashboardTopbar
              studioSlug={studioSlug}
              studioName={studioName}
              studioTimezone={studioTimezone}
              operatorEmail={operatorEmail}
              accessibleStudios={accessibleStudios}
            />

            <header className="page-header">
              <div>
                <span className="eyebrow">Operator app</span>
                <h1>{title}</h1>
                {description ? <p>{description}</p> : null}
              </div>
              {actions ? <div className="page-actions">{actions}</div> : null}
            </header>

            <div className="stack-lg">{children}</div>
          </section>
        </div>
      </div>
    </div>
  );
}
