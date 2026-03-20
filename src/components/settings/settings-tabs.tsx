"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getStudioSettingsLinks } from "@/features/dashboard/navigation";
import { cn } from "@/lib/utils";

export function SettingsTabs({ studioSlug }: { studioSlug: string }) {
  const pathname = usePathname();

  return (
    <div className="settings-tabs">
      {getStudioSettingsLinks(studioSlug).map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn("chip", pathname === item.href && "chip-active")}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
