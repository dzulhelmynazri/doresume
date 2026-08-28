"use client";

import { Button } from "@doresume/ui/components/button";
import { cn } from "@doresume/ui/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import type { LucideIcon } from "lucide-react";
import {
  BriefcaseIcon,
  SlidersHorizontalIcon,
  ToyBrick,
  Terminal,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { SETTINGS_STALE_TIME_MS } from "@/lib/settings-queries";
import { orpc } from "@/utils/orpc";

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
    icon: Terminal,
    title: "ATS form",
    url: "/ats",
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

const prefetchSettingsQueries = (
  queryClient: ReturnType<typeof useQueryClient>
) => {
  const queryOptions = { staleTime: SETTINGS_STALE_TIME_MS };

  void queryClient.prefetchQuery(
    orpc.getApplicationSettings.queryOptions(queryOptions)
  );
  void queryClient.prefetchQuery(
    orpc.getAtsFormData.queryOptions(queryOptions)
  );
  void queryClient.prefetchQuery(
    orpc.getApplicationPassword.queryOptions(queryOptions)
  );
  void queryClient.prefetchQuery(
    orpc.getConnections.queryOptions(queryOptions)
  );
};

export const SettingsNav = () => {
  const pathname = usePathname();
  const queryClient = useQueryClient();

  useEffect(() => {
    prefetchSettingsQueries(queryClient);
  }, [queryClient]);

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
