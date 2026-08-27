"use client";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@doresume/ui/components/sidebar";
import type { LucideIcon } from "lucide-react";
import { BriefcaseIcon, SlidersHorizontalIcon } from "lucide-react";
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
];

export const SettingsNav = () => {
  const pathname = usePathname();

  return (
    <nav className="w-56 shrink-0 p-4">
      <SidebarGroup className="p-0">
        <SidebarMenu>
          {SETTINGS_NAV_ITEMS.map((item) => {
            const Icon = item.icon;

            return (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  isActive={pathname === item.url}
                  render={<Link aria-label={item.title} href={item.url} />}
                >
                  <Icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroup>
    </nav>
  );
};
