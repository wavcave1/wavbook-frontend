"use client";

import { AppLayout } from "@/components/layouts/app-layout";
import { SettingsTabs } from "@/components/settings/settings-tabs";
import { loadStudioShellContext } from "@/features/dashboard/loaders";
import { useAsyncResource } from "@/hooks/use-async-resource";

interface StudioSettingsLayoutProps {
  studioSlug: string;
  title: string;
  description: string;
  studioName?: string;
  studioTimezone?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function StudioSettingsLayout({
  studioSlug,
  title,
  description,
  studioName,
  studioTimezone,
  actions,
  children,
}: StudioSettingsLayoutProps) {
  const shell = useAsyncResource(
    () => loadStudioShellContext(studioSlug),
    `settings-shell:${studioSlug}`,
  );

  return (
    <AppLayout
      title={title}
      description={description}
      studioSlug={studioSlug}
      studioName={shell.data?.studioAccess?.name ?? studioName}
      studioTimezone={shell.data?.studioAccess?.timezone ?? studioTimezone}
      operatorEmail={shell.data?.me.email}
      accessibleStudios={shell.data?.me.accessible_studios}
      actions={actions}
    >
      <div className="stack-lg">
        <SettingsTabs studioSlug={studioSlug} />
        {children}
      </div>
    </AppLayout>
  );
}
