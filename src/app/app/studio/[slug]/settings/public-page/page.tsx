"use client";

import { useEffect, useState } from "react";
import { DashboardErrorState, DashboardLoadingGrid } from "@/components/dashboard/dashboard-state";
import { SettingsFormSection } from "@/components/settings/settings-form-section";
import { SettingsSaveBar } from "@/components/settings/settings-save-bar";
import { StudioSettingsLayout } from "@/components/settings/studio-settings-layout";
import { Button } from "@/components/ui/button";
import { NoticeBanner } from "@/components/ui/notice-banner";
import { SurfaceCard } from "@/components/ui/surface-card";
import { loadStudioPublicPage } from "@/features/dashboard/loaders";
import {
  createPublicPageSettingsDraft,
  type PublicPageSettingsDraft,
} from "@/features/dashboard/settings-drafts";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { useSettingsDraft } from "@/hooks/use-settings-draft";
import { adminApi } from "@/lib/api/endpoints/admin-api";

export default function StudioPublicPageSettingsPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;
  const { data, error, loading } = useAsyncResource(
    () => loadStudioPublicPage(slug),
    `public-page-settings:${slug}`,
  );
  const {
    draft,
    isDirty,
    markSaved,
    resetDraft,
    updateField,
  } = useSettingsDraft(data ? createPublicPageSettingsDraft(data.studio) : null);
  const [status, setStatus] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [publishAction, setPublishAction] = useState<"publish" | "unpublish" | null>(
    null,
  );
  const [publicationState, setPublicationState] = useState(data?.publication ?? null);
  const [requiredFields, setRequiredFields] = useState<string[]>(
    data?.requiredFields ?? [],
  );
  const publicationSnapshot = data
    ? JSON.stringify({
        publication: data.publication,
        requiredFields: data.requiredFields,
      })
    : "null";

  useEffect(() => {
    if (publicationSnapshot === "null") {
      setPublicationState(null);
      setRequiredFields([]);
      return;
    }

    const parsed = JSON.parse(publicationSnapshot) as {
      publication: NonNullable<typeof data>["publication"];
      requiredFields: string[];
    };

    setPublicationState(parsed.publication);
    setRequiredFields(parsed.requiredFields);
  }, [publicationSnapshot]);

  const setDraftValue = <K extends keyof PublicPageSettingsDraft>(
    key: K,
    value: PublicPageSettingsDraft[K],
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
      const updatedStudio = await adminApi.updateStudio(slug, {
        booking_link_mode: draft.booking_link_mode,
        external_booking_url: draft.external_booking_url,
      });
      markSaved(createPublicPageSettingsDraft(updatedStudio));
      setStatus("Public page settings saved.");
    } catch (submitError: unknown) {
      setSaveError(
        submitError instanceof Error
          ? submitError.message
          : "Could not save public page settings.",
      );
    } finally {
      setSaving(false);
    }
  };

  const togglePublication = async (action: "publish" | "unpublish") => {
    setPublishAction(action);
    setStatus(null);
    setSaveError(null);

    try {
      const response = await adminApi.setPublication(slug, action);
      setPublicationState(response.publication);
      setRequiredFields(response.required_fields);
      setStatus(action === "publish" ? "Studio published." : "Studio unpublished.");
    } catch (submitError: unknown) {
      setSaveError(
        submitError instanceof Error
          ? submitError.message
          : "Could not update publication status.",
      );
    } finally {
      setPublishAction(null);
    }
  };

  return (
    <StudioSettingsLayout
      studioSlug={slug}
      title="Public page settings"
      description="Control public visibility and booking handoff while keeping marketplace launch concerns out of the operator settings area."
      studioName={data?.studio.name}
      studioTimezone={data?.studio.timezone}
    >
      {loading ? (
        <DashboardLoadingGrid labels={["Loading public page settings"]} />
      ) : null}

      {error ? (
        <DashboardErrorState
          title="Could not load public page settings"
          message={error}
        />
      ) : null}

      {status ? (
        <NoticeBanner title="Updated" tone="muted">
          <p>{status}</p>
        </NoticeBanner>
      ) : null}

      {saveError ? (
        <NoticeBanner title="Update failed">
          <p>{saveError}</p>
        </NoticeBanner>
      ) : null}

      {data && draft ? (
        <div className="content-grid">
          <form className="form-stack" onSubmit={handleSave}>
            <SettingsFormSection
              title="Booking handoff"
              description="Choose whether the public studio page routes customers into the internal booking flow or an existing external booking URL."
              audienceLabel="Public profile"
            >
              <label className="field">
                <span>Booking mode</span>
                <select
                  className="select"
                  value={draft.booking_link_mode}
                  onChange={(event) =>
                    setDraftValue(
                      "booking_link_mode",
                      event.target.value as PublicPageSettingsDraft["booking_link_mode"],
                    )
                  }
                >
                  <option value="internal">internal</option>
                  <option value="external">external</option>
                </select>
              </label>

              <label className="field">
                <span>External booking URL</span>
                <input
                  className="input"
                  value={draft.external_booking_url}
                  onChange={(event) =>
                    setDraftValue("external_booking_url", event.target.value)
                  }
                />
              </label>
            </SettingsFormSection>

            <SettingsSaveBar
              dirty={isDirty}
              saving={saving}
              saveLabel="Save public page settings"
              onReset={resetDraft}
            />
          </form>

          <div className="stack-lg">
            <SurfaceCard>
              <span className="eyebrow">Publication controls</span>
              <h3>
                {publicationState?.isPublic ? "Currently live" : "Currently private"}
              </h3>
              <div className="button-row">
                <Button
                  type="button"
                  disabled={publishAction !== null}
                  onClick={() => togglePublication("publish")}
                >
                  {publishAction === "publish" ? "Publishing..." : "Publish"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  disabled={publishAction !== null}
                  onClick={() => togglePublication("unpublish")}
                >
                  {publishAction === "unpublish" ? "Unpublishing..." : "Unpublish"}
                </Button>
              </div>
            </SurfaceCard>

            <SurfaceCard>
              <span className="eyebrow">Readiness checklist</span>
              {requiredFields.length ? (
                <ul className="inline-list">
                  {requiredFields.map((field) => (
                    <li key={field}>{field}</li>
                  ))}
                </ul>
              ) : (
                <p className="muted-copy">No blocking fields are currently returned.</p>
              )}
            </SurfaceCard>

            <SurfaceCard>
              <span className="eyebrow">Linked public assets</span>
              <p>
                {data.media.length} media items connected. Brand primary color:{" "}
                {data.settings.brand_primary_color || "not set"}.
              </p>
            </SurfaceCard>
          </div>
        </div>
      ) : null}
    </StudioSettingsLayout>
  );
}
