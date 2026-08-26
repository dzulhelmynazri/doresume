"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@doresume/ui/components/sidebar";
import {
  BriefcaseIcon,
  LayoutDashboardIcon,
  ListChecksIcon,
  SearchIcon,
  UserIcon,
  UsersIcon,
  LifeBuoyIcon,
  SendIcon,
  TerminalIcon,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";

const data = {
  navMain: [
    {
      icon: <LayoutDashboardIcon />,
      title: "Dashboard",
      url: "/dashboard",
    },
    {
      icon: <BriefcaseIcon />,
      title: "Browse Job",
      url: "/jobs",
    },
    {
      icon: <ListChecksIcon />,
      title: "Tracker",
      url: "/tracker",
    },
    {
      icon: <UsersIcon />,
      title: "Networking",
      url: "/networking",
    },
    {
      icon: <UserIcon />,
      title: "Profile",
      url: "/profile",
    },
    {
      icon: <SearchIcon />,
      title: "Research",
      url: "/research",
    },
  ],
  navSecondary: [
    {
      icon: <LifeBuoyIcon />,
      title: "Support",
      url: "/dashboard",
    },
    {
      icon: <SendIcon />,
      title: "Feedback",
      url: "/dashboard",
    },
  ],
};

export const getAppNavTitle = (pathname: string) =>
  data.navMain.find((item) => item.url === pathname)?.title ?? "Dashboard";

export const AppSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => (
  <Sidebar variant="inset" {...props}>
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            render={<Link aria-label="Acme Inc" href="/dashboard" />}
          >
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <TerminalIcon />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">Acme Inc</span>
              <span className="truncate text-xs">Enterprise</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <NavMain items={data.navMain} />
      <NavSecondary items={data.navSecondary} className="mt-auto" />
    </SidebarContent>
    <SidebarFooter>
      <NavUser />
    </SidebarFooter>
  </Sidebar>
);
