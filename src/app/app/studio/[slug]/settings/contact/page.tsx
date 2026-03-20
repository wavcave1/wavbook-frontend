"use client";

import { useState } from "react";
import { DashboardErrorState, DashboardLoadingGrid } from "@/components/dashboard/dashboard-state";
import { SettingsFormSection } from "@/components/settings/settings-form-section";
import { SettingsSaveBar } from "@/components/settings/settings-save-bar";
import { StudioSettingsLayout } from "@/components/settings/studio-settings-layout";
import { NoticeBanner } from "@/components/ui/notice-banner";
import { loadStudioContactSettings } from "@/features/dashboard/loaders";
import {
  createContactSettingsDraft,
  type ContactSettingsDraft,
} from "@/features/dashboard/settings-drafts";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { useSettingsDraft } from "@/hooks/use-settings-draft";
import { adminApi } from "@/lib/api/endpoints/admin-api";

export default function StudioContactSettingsPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;
  const { data, error, loading } = useAsyncResource(
    () => loadStudioContactSettings(slug),
    `contact-settings:${slug}`,
  );
  const {
    draft,
    isDirty,
    markSaved,
    resetDraft,
    updateField,
  } = useSettingsDraft(data ? createContactSettingsDraft(data) : null);
  const [status, setStatus] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const setDraftValue = <K extends keyof ContactSettingsDraft>(
    key: K,
    value: ContactSettingsDraft[K],
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
      markSaved(createContactSettingsDraft(updatedStudio));
      setStatus("Contact settings saved.");
    } catch (submitError: unknown) {
      setSaveError(
        submitError instanceof Error
          ? submitError.message
          : "Could not save contact settings.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <StudioSettingsLayout
      studioSlug={slug}
      title="Contact settings"
      description="Maintain the public contact and location data that appears on studio discovery and profile pages."
      studioName={data?.name}
      studioTimezone={data?.timezone}
    >
      {loading ? <DashboardLoadingGrid labels={["Loading contact settings"]} /> : null}

      {error ? (
        <DashboardErrorState
          title="Could not load contact settings"
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
            title="Public contact"
            description="These channels are customer-facing and should match what you want shown on the studio profile."
            audienceLabel="Public profile"
          >
            <div className="field-grid">
              <label className="field">
                <span>Email</span>
                <input
                  className="input"
                  type="email"
                  value={draft.email}
                  onChange={(event) => setDraftValue("email", event.target.value)}
                />
              </label>
              <label className="field">
                <span>Phone</span>
                <input
                  className="input"
                  value={draft.phone}
                  onChange={(event) => setDraftValue("phone", event.target.value)}
                />
              </label>
            </div>
          </SettingsFormSection>

          <SettingsFormSection
            title="Location and service area"
            description="Address and service area power marketplace discovery and public profile metadata."
            audienceLabel="Public profile"
          >
            <label className="field">
              <span>Street address</span>
              <input
                className="input"
                value={draft.address}
                onChange={(event) => setDraftValue("address", event.target.value)}
              />
            </label>

            <label className="field">
              <span>Service area</span>
              <input
                className="input"
                value={draft.service_area}
                onChange={(event) =>
                  setDraftValue("service_area", event.target.value)
                }
              />
            </label>
          </SettingsFormSection>

          <SettingsSaveBar
            dirty={isDirty}
            saving={saving}
            saveLabel="Save contact"
            onReset={resetDraft}
          />
        </form>
      ) : null}
    </StudioSettingsLayout>
  );
}
