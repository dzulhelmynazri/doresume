"use client";

import { Button } from "@doresume/ui/components/button";
import { cn } from "@doresume/ui/lib/utils";
import type { LucideIcon } from "lucide-react";
import { BriefcaseIcon, SlidersHorizontalIcon, ToyBrick } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SETTINGS_NAV_ITEMS: {
  icon: LucideIcon;
  title: string;
  url: string;
}[] = [
  {
    icon: SlidersHorizontalIcon,
    title: "Apply settings",
    url: "/apply",
  },
  {
    icon: BriefcaseIcon,
    title: "Workday password",
    url: "/workday",
  },
  {
    icon: ToyBrick,
    title: "Integrations",
    url: "/integrations",
  },
];

export const SettingsNav = () => {
  const pathname = usePathname();

  return (
    <nav className="flex w-56 shrink-0 flex-col gap-1 p-4">
      {SETTINGS_NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.url;

        return (
          <Button
            key={item.url}
            className={cn(
              "justify-start gap-2",
              isActive && "bg-muted font-medium"
            )}
            nativeButton={false}
            render={<Link aria-label={item.title} href={item.url} />}
            variant="ghost"
          >
            <Icon />
            {item.title}
          </Button>
        );
      })}
    </nav>
  );
};
