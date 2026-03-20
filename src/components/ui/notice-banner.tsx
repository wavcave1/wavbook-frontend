import { cn } from "@/lib/utils";

interface NoticeBannerProps {
  title: string;
  children: React.ReactNode;
  tone?: "default" | "muted";
}

export function NoticeBanner({
  title,
  children,
  tone = "default",
}: NoticeBannerProps) {
  return (
    <div className={cn("notice-banner", tone === "muted" && "notice-muted")}>
      <strong>{title}</strong>
      <div>{children}</div>
    </div>
  );
}
