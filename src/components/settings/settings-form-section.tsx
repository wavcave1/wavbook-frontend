import { SurfaceCard } from "@/components/ui/surface-card";

interface SettingsFormSectionProps {
  title: string;
  description: string;
  audienceLabel?: string;
  children: React.ReactNode;
}

export function SettingsFormSection({
  title,
  description,
  audienceLabel,
  children,
}: SettingsFormSectionProps) {
  return (
    <SurfaceCard className="settings-section">
      <div className="settings-section-heading">
        <div className="settings-section-copy">
          {audienceLabel ? (
            <span className="chip settings-audience-chip">{audienceLabel}</span>
          ) : null}
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
      {children}
    </SurfaceCard>
  );
}
