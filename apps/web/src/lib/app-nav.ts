import type { LucideIcon } from "lucide-react";
import {
  BookUser,
  BriefcaseIcon,
  Earth,
  ListChecksIcon,
  Files,
  SlidersHorizontalIcon,
} from "lucide-react";

export interface AppNavItem {
  icon: LucideIcon;
  title: string;
  url: string;
}

export const APP_NAV_MAIN: AppNavItem[] = [
  {
    icon: Earth,
    title: "Dashboard",
    url: "/dashboard",
  },
  {
    icon: BriefcaseIcon,
    title: "Browse Job",
    url: "/jobs",
  },
  {
    icon: ListChecksIcon,
    title: "Tracker",
    url: "/tracker",
  },
  {
    icon: BookUser,
    title: "Networking",
    url: "/networking",
  },
  {
    icon: Files,
    title: "Documents",
    url: "/documents",
  },
];

const SETTINGS_ROUTES = [
  "/apply",
  "/ats",
  "/workday",
  "/integrations",
  "/billing",
];

export interface AppNavContext {
  icon?: LucideIcon;
  title: string;
}

export const getAppNavContext = (pathname: string): AppNavContext => {
  if (pathname.startsWith("/dashboard/applications/")) {
    return { icon: Earth, title: "Dashboard > Application" };
  }

  if (pathname.startsWith("/networking/")) {
    return { title: "Company" };
  }

  if (pathname === "/tracker") {
    return { icon: ListChecksIcon, title: "Tracker" };
  }

  if (SETTINGS_ROUTES.some((route) => pathname.startsWith(route))) {
    return { icon: SlidersHorizontalIcon, title: "Settings" };
  }

  for (const item of APP_NAV_MAIN) {
    if (pathname === item.url || pathname.startsWith(`${item.url}/`)) {
      return { icon: item.icon, title: item.title };
    }
  }

  return { icon: Earth, title: "Dashboard" };
};

export const getAppNavTitle = (pathname: string) =>
  getAppNavContext(pathname).title;
