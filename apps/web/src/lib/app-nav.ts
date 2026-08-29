import type { LucideIcon } from "lucide-react";
import {
  BookUser,
  BriefcaseIcon,
  Earth,
  LifeBuoyIcon,
  ListChecksIcon,
  Files,
  SendIcon,
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

export const APP_NAV_SECONDARY: AppNavItem[] = [
  {
    icon: LifeBuoyIcon,
    title: "Support",
    url: "/dashboard",
  },
  {
    icon: SendIcon,
    title: "Feedback",
    url: "/dashboard",
  },
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
    const tracker = APP_NAV_MAIN.find((item) => item.url === "/tracker");
    return { icon: tracker?.icon, title: "Tracker" };
  }

  if (
    pathname.startsWith("/apply") ||
    pathname.startsWith("/ats") ||
    pathname.startsWith("/workday") ||
    pathname.startsWith("/integrations") ||
    pathname.startsWith("/billing")
  ) {
    return { icon: SlidersHorizontalIcon, title: "Settings" };
  }

  for (const item of APP_NAV_MAIN) {
    if (pathname === item.url || pathname.startsWith(`${item.url}/`)) {
      return { icon: item.icon, title: item.title };
    }
  }

  const dashboard = APP_NAV_MAIN.find((item) => item.url === "/dashboard");
  return { icon: dashboard?.icon, title: "Dashboard" };
};

export const getAppNavTitle = (pathname: string) =>
  getAppNavContext(pathname).title;
