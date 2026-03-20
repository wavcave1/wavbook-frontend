"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SettingsSaveBarProps {
  dirty: boolean;
  saving: boolean;
  saveLabel: string;
  onReset: () => void;
}

export function SettingsSaveBar({
  dirty,
  saving,
  saveLabel,
  onReset,
}: SettingsSaveBarProps) {
  return (
    <div className="settings-save-bar">
      <div className="settings-save-copy">
        <span className={cn("chip", dirty && "chip-active")}>
          {saving ? "Saving" : dirty ? "Draft changes" : "Saved"}
        </span>
        <p className="muted-copy">
          {saving
            ? "Saving changes to the current backend record."
            : dirty
              ? "You have unsaved changes on this page."
              : "This form matches the latest values loaded from the backend."}
        </p>
      </div>

      <div className="button-row">
        <Button type="button" variant="ghost" onClick={onReset} disabled={!dirty || saving}>
          Reset
        </Button>
        <Button type="submit" disabled={!dirty || saving}>
          {saving ? "Saving..." : saveLabel}
        </Button>
      </div>
    </div>
  );
}
