"use client";

import { useState } from "react";
import { DashboardErrorState, DashboardLoadingGrid } from "@/components/dashboard/dashboard-state";
import { SettingsFormSection } from "@/components/settings/settings-form-section";
import { SettingsSaveBar } from "@/components/settings/settings-save-bar";
import { StudioSettingsLayout } from "@/components/settings/studio-settings-layout";
import { NoticeBanner } from "@/components/ui/notice-banner";
import { loadStudioProfileSettings } from "@/features/dashboard/loaders";
import {
  createProfileSettingsDraft,
  type ProfileSettingsDraft,
} from "@/features/dashboard/settings-drafts";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { useSettingsDraft } from "@/hooks/use-settings-draft";
import { adminApi } from "@/lib/api/endpoints/admin-api";

export default function StudioProfileSettingsPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;
  const { data, error, loading } = useAsyncResource(
    () => loadStudioProfileSettings(slug),
    `profile-settings:${slug}`,
  );
  const {
    draft,
    isDirty,
    markSaved,
    resetDraft,
    updateField,
  } = useSettingsDraft(data ? createProfileSettingsDraft(data) : null);
  const [status, setStatus] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const setDraftValue = <K extends keyof ProfileSettingsDraft>(
    key: K,
    value: ProfileSettingsDraft[K],
  ) => {
    setStatus(null);
    setSaveError(null);
    updateField(key, value);
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft) return;

    setSaving(true);
    setStatus(null);
    setSaveError(null);

    try {
      const updatedStudio = await adminApi.updateStudio(slug, draft);
      markSaved(createProfileSettingsDraft(updatedStudio));
      setStatus("Profile settings saved.");
    } catch (submitError: unknown) {
      setSaveError(
        submitError instanceof Error
          ? submitError.message
          : "Could not save profile settings.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <StudioSettingsLayout
      studioSlug={slug}
      title="Profile settings"
      description="Manage studio identity fields while keeping operator-facing identifiers separate from the public brand name."
      studioName={draft?.name ?? data?.name}
      studioTimezone={draft?.timezone ?? data?.timezone}
    >
      {loading ? <DashboardLoadingGrid labels={["Loading profile settings"]} /> : null}

      {error ? (
        <DashboardErrorState
          title="Could not load profile settings"
          message={error}
        />
      ) : null}

      {status ? (
        <NoticeBanner title="Saved" tone="muted">
          <p>{status}</p>
        </NoticeBanner>
      ) : null}

      {saveError ? (
        <NoticeBanner title="Save failed">
          <p>{saveError}</p>
        </NoticeBanner>
      ) : null}

      {draft ? (
        <form className="form-stack" onSubmit={handleSave}>
          <SettingsFormSection
            title="Operator workspace identity"
            description="These fields identify the workspace inside the operator app and existing admin tooling."
            audienceLabel="Operator only"
          >
            <div className="field-grid">
              <label className="field">
                <span>Internal name</span>
                <input
                  className="input"
                  value={draft.name}
                  onChange={(event) => setDraftValue("name", event.target.value)}
                />
              </label>
              <label className="field">
                <span>Timezone</span>
                <input
                  className="input"
                  value={draft.timezone}
                  onChange={(event) => setDraftValue("timezone", event.target.value)}
                />
              </label>
            </div>

            <label className="field">
              <span>Studio slug</span>
              <input
                className="input"
                value={draft.slug}
                onChange={(event) => setDraftValue("slug", event.target.value)}
              />
            </label>
          </SettingsFormSection>

          <SettingsFormSection
            title="Public listing identity"
            description="This name is shown to customers on marketplace and public profile pages."
            audienceLabel="Public profile"
          >
            <label className="field">
              <span>Public display name</span>
              <input
                className="input"
                value={draft.public_display_name}
                onChange={(event) =>
                  setDraftValue("public_display_name", event.target.value)
                }
              />
            </label>
          </SettingsFormSection>

          <SettingsSaveBar
            dirty={isDirty}
            saving={saving}
            saveLabel="Save profile"
            onReset={resetDraft}
          />
        </form>
      ) : null}
    </StudioSettingsLayout>
  );
}
