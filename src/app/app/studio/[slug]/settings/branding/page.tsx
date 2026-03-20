"use client";

import { useState } from "react";
import { DashboardErrorState, DashboardLoadingGrid } from "@/components/dashboard/dashboard-state";
import { SettingsFormSection } from "@/components/settings/settings-form-section";
import { SettingsSaveBar } from "@/components/settings/settings-save-bar";
import { StudioSettingsLayout } from "@/components/settings/studio-settings-layout";
import { NoticeBanner } from "@/components/ui/notice-banner";
import { SurfaceCard } from "@/components/ui/surface-card";
import { loadStudioBranding } from "@/features/dashboard/loaders";
import {
  buildStudioMediaPayload,
  createBrandingSettingsDraft,
  type BrandingSettingsDraft,
} from "@/features/dashboard/settings-drafts";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { useSettingsDraft } from "@/hooks/use-settings-draft";
import { adminApi } from "@/lib/api/endpoints/admin-api";

export default function StudioBrandingSettingsPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;
  const { data, error, loading } = useAsyncResource(
    () => loadStudioBranding(slug),
    `branding-settings:${slug}`,
  );
  const {
    draft,
    isDirty,
    markSaved,
    resetDraft,
    updateField,
  } = useSettingsDraft(
    data ? createBrandingSettingsDraft(data.settings, data.media) : null,
  );
  const [status, setStatus] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const setDraftValue = <K extends keyof BrandingSettingsDraft>(
    key: K,
    value: BrandingSettingsDraft[K],
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
      const [updatedSettings, updatedMedia] = await Promise.all([
        adminApi.updateStudioSettings(slug, {
          brand_primary_color: draft.brand_primary_color,
          brand_secondary_color: draft.brand_secondary_color,
        }),
        adminApi.replaceStudioMedia(slug, buildStudioMediaPayload(draft)),
      ]);

      markSaved(createBrandingSettingsDraft(updatedSettings, updatedMedia.items));
      setStatus("Branding settings saved.");
    } catch (submitError: unknown) {
      setSaveError(
        submitError instanceof Error
          ? submitError.message
          : "Could not save branding settings.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <StudioSettingsLayout
      studioSlug={slug}
      title="Branding settings"
      description="Control public brand colors and hosted media assets without changing backend upload behavior."
      studioName={data?.studio.name}
      studioTimezone={data?.studio.timezone}
    >
      {loading ? <DashboardLoadingGrid labels={["Loading branding settings"]} /> : null}

      {error ? (
        <DashboardErrorState title="Could not load branding" message={error} />
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
        <div className="content-grid">
          <form className="form-stack" onSubmit={handleSave}>
            <SettingsFormSection
              title="Brand tokens"
              description="Brand colors are stored on the shared studio settings record."
              audienceLabel="Public profile"
            >
              <div className="field-grid">
                <label className="field">
                  <span>Primary color</span>
                  <input
                    className="input"
                    value={draft.brand_primary_color}
                    placeholder="#0f766e"
                    onChange={(event) =>
                      setDraftValue("brand_primary_color", event.target.value)
                    }
                  />
                </label>
                <label className="field">
                  <span>Secondary color</span>
                  <input
                    className="input"
                    value={draft.brand_secondary_color}
                    placeholder="#112032"
                    onChange={(event) =>
                      setDraftValue("brand_secondary_color", event.target.value)
                    }
                  />
                </label>
              </div>
            </SettingsFormSection>

            <SettingsFormSection
              title="Public media"
              description="Media stays URL-based for the current backend contract. One gallery URL per line."
              audienceLabel="Public profile"
            >
              <label className="field">
                <span>Logo URL</span>
                <input
                  className="input"
                  value={draft.logo_url}
                  onChange={(event) => setDraftValue("logo_url", event.target.value)}
                />
              </label>

              <label className="field">
                <span>Hero image URL</span>
                <input
                  className="input"
                  value={draft.hero_url}
                  onChange={(event) => setDraftValue("hero_url", event.target.value)}
                />
              </label>

              <label className="field">
                <span>Gallery URLs</span>
                <textarea
                  className="textarea"
                  rows={6}
                  value={draft.gallery_urls}
                  placeholder="One URL per line"
                  onChange={(event) =>
                    setDraftValue("gallery_urls", event.target.value)
                  }
                />
              </label>
            </SettingsFormSection>

            <SettingsSaveBar
              dirty={isDirty}
              saving={saving}
              saveLabel="Save branding"
              onReset={resetDraft}
            />
          </form>

          <div className="stack-lg">
            <SurfaceCard>
              <span className="eyebrow">Color preview</span>
              <div className="color-swatch-row">
                <div className="color-swatch">
                  <span
                    style={{
                      backgroundColor: draft.brand_primary_color || "#0f766e",
                    }}
                  />
                  <p>{draft.brand_primary_color || "#0f766e"}</p>
                </div>
                <div className="color-swatch">
                  <span
                    style={{
                      backgroundColor: draft.brand_secondary_color || "#112032",
                    }}
                  />
                  <p>{draft.brand_secondary_color || "#112032"}</p>
                </div>
              </div>
            </SurfaceCard>

            <SurfaceCard>
              <span className="eyebrow">Media summary</span>
              <p>
                Logo: {draft.logo_url ? "configured" : "not set"}.
                Hero: {draft.hero_url ? " configured." : " not set."}
              </p>
              <p className="muted-copy">
                Gallery items:{" "}
                {
                  draft.gallery_urls
                    .split("\n")
                    .map((item) => item.trim())
                    .filter(Boolean).length
                }
              </p>
            </SurfaceCard>
          </div>
        </div>
      ) : null}
    </StudioSettingsLayout>
  );
}
