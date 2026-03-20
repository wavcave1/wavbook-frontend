"use client";

import { useState } from "react";
import { DashboardErrorState, DashboardLoadingGrid } from "@/components/dashboard/dashboard-state";
import { SettingsFormSection } from "@/components/settings/settings-form-section";
import { SettingsSaveBar } from "@/components/settings/settings-save-bar";
import { StudioSettingsLayout } from "@/components/settings/studio-settings-layout";
import { NoticeBanner } from "@/components/ui/notice-banner";
import { loadStudioBookingSettings } from "@/features/dashboard/loaders";
import {
  createBookingSettingsDraft,
  type BookingSettingsDraft,
} from "@/features/dashboard/settings-drafts";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { useSettingsDraft } from "@/hooks/use-settings-draft";
import { adminApi } from "@/lib/api/endpoints/admin-api";

export default function StudioBookingSettingsPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;
  const { data, error, loading } = useAsyncResource(
    () => loadStudioBookingSettings(slug),
    `booking-settings:${slug}`,
  );
  const {
    draft,
    isDirty,
    markSaved,
    resetDraft,
    updateField,
  } = useSettingsDraft(data ? createBookingSettingsDraft(data.settings) : null);
  const [status, setStatus] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const setDraftValue = <K extends keyof BookingSettingsDraft>(
    key: K,
    value: BookingSettingsDraft[K],
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
      const updatedSettings = await adminApi.updateStudioSettings(slug, draft);
      markSaved(createBookingSettingsDraft(updatedSettings));
      setStatus("Booking settings saved.");
    } catch (submitError: unknown) {
      setSaveError(
        submitError instanceof Error
          ? submitError.message
          : "Could not save booking settings.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <StudioSettingsLayout
      studioSlug={slug}
      title="Booking settings"
      description="Edit the customer-facing policies and arrival guidance used by the booking flow and public studio page."
      studioName={data?.studio.name}
      studioTimezone={data?.studio.timezone}
    >
      {loading ? <DashboardLoadingGrid labels={["Loading booking settings"]} /> : null}

      {error ? (
        <DashboardErrorState
          title="Could not load booking settings"
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
            title="Policies"
            description="Policy text stays backend-driven and is reused anywhere booking guidance is shown."
            audienceLabel="Public profile"
          >
            <label className="field">
              <span>Booking policy</span>
              <textarea
                className="textarea"
                rows={5}
                value={draft.booking_policy}
                onChange={(event) =>
                  setDraftValue("booking_policy", event.target.value)
                }
              />
            </label>

            <label className="field">
              <span>Cancellation policy</span>
              <textarea
                className="textarea"
                rows={5}
                value={draft.cancellation_policy}
                onChange={(event) =>
                  setDraftValue("cancellation_policy", event.target.value)
                }
              />
            </label>
          </SettingsFormSection>

          <SettingsFormSection
            title="Arrival guidance"
            description="Instructions here help customers arrive prepared without adding any new booking logic."
            audienceLabel="Public profile"
          >
            <div className="field-grid">
              <label className="field">
                <span>Arrival instructions</span>
                <textarea
                  className="textarea"
                  rows={4}
                  value={draft.arrival_instructions}
                  onChange={(event) =>
                    setDraftValue("arrival_instructions", event.target.value)
                  }
                />
              </label>
              <label className="field">
                <span>Parking info</span>
                <textarea
                  className="textarea"
                  rows={4}
                  value={draft.parking_info}
                  onChange={(event) =>
                    setDraftValue("parking_info", event.target.value)
                  }
                />
              </label>
            </div>
          </SettingsFormSection>

          <SettingsSaveBar
            dirty={isDirty}
            saving={saving}
            saveLabel="Save booking settings"
            onReset={resetDraft}
          />
        </form>
      ) : null}
    </StudioSettingsLayout>
  );
}
