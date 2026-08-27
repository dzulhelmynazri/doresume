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
  // GraduationCapIcon,
  Earth,
  ListChecksIcon,
  Origami,
  BookUser,
  LifeBuoyIcon,
  SendIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";

const data = {
  navMain: [
    {
      icon: <Earth />,
      title: "Dashboard",
      url: "/dashboard",
    },
    {
      icon: <BriefcaseIcon />,
      title: "Browse Job",
      url: "/jobs",
    },
    // {
    //   icon: <GraduationCapIcon />,
    //   title: "Graduate Trainee",
    //   url: "/graduate-trainee",
    // },
    {
      icon: <ListChecksIcon />,
      title: "Tracker",
      url: "/tracker",
    },
    {
      icon: <BookUser />,
      title: "Networking",
      url: "/networking",
    },
    {
      icon: <Origami />,
      title: "Profile",
      url: "/profile",
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

export const getAppNavTitle = (pathname: string) => {
  if (pathname.startsWith("/dashboard/applications/")) {
    return "Application";
  }

  if (
    pathname.startsWith("/apply") ||
    pathname.startsWith("/workday") ||
    pathname.startsWith("/integrations")
  ) {
    return "Settings";
  }

  for (const item of data.navMain) {
    if (item.url === pathname) {
      return item.title;
    }
  }

  return "Dashboard";
};

export const AppSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => (
  <Sidebar variant="inset" {...props}>
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            render={<Link aria-label="doresume" href="/dashboard" />}
          >
            <div className="relative size-8 overflow-hidden rounded-lg">
              <Image
                alt="doresume"
                className="size-full [image-rendering:pixelated]"
                height={32}
                src="/doresume.png"
                unoptimized
                width={32}
              />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">doresume</span>
              <span className="truncate text-xs">Job Agent</span>
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
