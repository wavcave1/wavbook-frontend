"use client";

import { useState } from "react";
import Link from "@/compat/next-link";
import {
  DashboardEmptyState,
  DashboardErrorState,
  DashboardLoadingGrid,
} from "@/components/dashboard/dashboard-state";
import { AppLayout } from "@/components/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { NoticeBanner } from "@/components/ui/notice-banner";
import { SurfaceCard } from "@/components/ui/surface-card";
import {
  loadStudioBlocks,
  loadStudioShellContext,
} from "@/features/dashboard/loaders";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { adminApi } from "@/lib/api/endpoints/admin-api";
import { formatDateTime } from "@/lib/utils";

const getDefaultDateTime = (offsetDays: number, hour: number) => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  date.setHours(hour, 0, 0, 0);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
};

export default function StudioBlocksPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;
  const shell = useAsyncResource(() => loadStudioShellContext(slug), `shell:${slug}`);
  const [refreshKey, setRefreshKey] = useState(0);
  const [startTime, setStartTime] = useState(getDefaultDateTime(1, 10));
  const [endTime, setEndTime] = useState(getDefaultDateTime(1, 12));
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { data, error: loadError, loading } = useAsyncResource(
    () => loadStudioBlocks(slug),
    `${slug}:${refreshKey}`,
  );

  const handleCreateBlock = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setStatus(null);

    try {
      await adminApi.createBlock({
        studioSlug: slug,
        start_time: new Date(startTime).toISOString(),
        end_time: new Date(endTime).toISOString(),
        reason,
      });
      setStatus("Block created.");
      setRefreshKey((current) => current + 1);
    } catch (submitError: unknown) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not create block",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBlock = async (blockId: string) => {
    await adminApi.deleteBlock(slug, blockId);
    setRefreshKey((current) => current + 1);
  };

  return (
    <AppLayout
      title="Blocks"
      description="Create and remove blackout windows for the selected studio."
      studioSlug={slug}
      studioName={shell.data?.studioAccess?.name ?? data?.studio.name}
      studioTimezone={shell.data?.studioAccess?.timezone ?? data?.studio.timezone}
      operatorEmail={shell.data?.me.email}
      accessibleStudios={shell.data?.me.accessible_studios}
    >
      <SurfaceCard>
        <form className="form-stack" onSubmit={handleCreateBlock}>
          <div className="field-grid">
            <label className="field">
              <span>Start</span>
              <input
                className="input"
                type="datetime-local"
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
              />
            </label>
            <label className="field">
              <span>End</span>
              <input
                className="input"
                type="datetime-local"
                value={endTime}
                onChange={(event) => setEndTime(event.target.value)}
              />
            </label>
          </div>

          <label className="field">
            <span>Reason</span>
            <input
              className="input"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Maintenance, private session, holiday"
            />
          </label>

          <Button type="submit" disabled={saving}>
            {saving ? "Creating block..." : "Create block"}
          </Button>
        </form>
      </SurfaceCard>

      {status ? (
        <NoticeBanner title="Block saved" tone="muted">
          <p>{status}</p>
        </NoticeBanner>
      ) : null}

      {error || loadError ? (
        <DashboardErrorState
          title="Block error"
          message={error || loadError || "Could not load blocks"}
        />
      ) : null}

      {loading ? <DashboardLoadingGrid labels={["Loading blocks"]} /> : null}

      {data && data.blocks.length ? (
        <div className="list-stack">
          {data.blocks.map((block) => (
            <SurfaceCard key={block.id} className="list-row">
              <div>
                <strong>{block.reason || "Blocked time"}</strong>
                <p>
                  {formatDateTime(block.start_time)} to {formatDateTime(block.end_time)}
                </p>
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={() => handleDeleteBlock(block.id)}
              >
                Delete
              </Button>
            </SurfaceCard>
          ))}
        </div>
      ) : null}

      {data && !data.blocks.length ? (
        <DashboardEmptyState
          title="No blackout windows"
          description="The block list is empty for this studio right now."
          action={
            <Link
              href={`/app/studio/${slug}/calendar`}
              className="button button-secondary"
            >
              Review calendar
            </Link>
          }
        />
      ) : null}
    </AppLayout>
  );
}
