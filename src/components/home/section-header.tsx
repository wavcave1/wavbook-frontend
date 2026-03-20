import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  center?: boolean;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  center = false,
}: SectionHeaderProps) {
  return (
    <div className={cn("section-heading", center && "section-heading-center")}>
      <div className="section-copy">
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        {description ? <p className="section-description">{description}</p> : null}
      </div>
      {action ? <div className="section-actions">{action}</div> : null}
    </div>
  );
}
