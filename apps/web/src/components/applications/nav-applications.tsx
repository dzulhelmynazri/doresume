"use client";

import { Button } from "@doresume/ui/components/button";
import { cn } from "@doresume/ui/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import type { LucideIcon } from "lucide-react";
import { BriefcaseIcon, FileTextIcon, MailIcon, Terminal } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect } from "react";

import { orpc } from "@/utils/orpc";

const APPLICATIONS_STALE_TIME_MS = 5 * 60 * 1000;

export interface ApplicationsNavItem {
  icon: LucideIcon;
  slug: "form" | "resume" | "cover" | "job";
  title: string;
  url: string;
}

export const getApplicationsNavItems = (id: string): ApplicationsNavItem[] => [
  {
    icon: Terminal,
    slug: "form",
    title: "Form",
    url: `/dashboard/applications/${id}/form`,
  },
  {
    icon: FileTextIcon,
    slug: "resume",
    title: "Resume",
    url: `/dashboard/applications/${id}/resume`,
  },
  {
    icon: MailIcon,
    slug: "cover",
    title: "Cover",
    url: `/dashboard/applications/${id}/cover`,
  },
  {
    icon: BriefcaseIcon,
    slug: "job",
    title: "Job",
    url: `/dashboard/applications/${id}/job`,
  },
];

export interface ApplicationsNavProps {
  id?: string;
}

export const ApplicationsNav = ({ id: propId }: ApplicationsNavProps) => {
  const pathname = usePathname();
  const params = useParams<{ id?: string }>();
  const id = propId ?? (typeof params?.id === "string" ? params.id : "");
  const queryClient = useQueryClient();

  useEffect(() => {
    const queryOptions = { staleTime: APPLICATIONS_STALE_TIME_MS };

    const queries: Promise<unknown>[] = [
      queryClient.query(orpc.getDocuments.queryOptions(queryOptions)),
      queryClient.query(orpc.getAtsFormData.queryOptions(queryOptions)),
    ];

    if (id) {
      queries.push(
        queryClient.query(
          orpc.getApplication.queryOptions({
            input: { id },
            staleTime: APPLICATIONS_STALE_TIME_MS,
          })
        )
      );
    }

    void Promise.allSettled(queries);
  }, [id, queryClient]);

  const navItems = getApplicationsNavItems(id);

  return (
    <nav className="flex w-56 shrink-0 flex-col gap-1 p-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.url;

        return (
          <Button
            key={item.slug}
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
