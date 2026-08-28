import type { LucideIcon } from "lucide-react";
import {
  BookUser,
  BriefcaseIcon,
  Earth,
  LifeBuoyIcon,
  ListChecksIcon,
  Origami,
  SendIcon,
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
    icon: Origami,
    title: "Profile",
    url: "/profile",
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

export const getAppNavTitle = (pathname: string) => {
  if (pathname.startsWith("/dashboard/applications/")) {
    return "Application";
  }

  if (pathname.startsWith("/networking/")) {
    return "Company";
  }

  if (pathname === "/tracker") {
    return "Tracker";
  }

  if (
    pathname.startsWith("/apply") ||
    pathname.startsWith("/ats") ||
    pathname.startsWith("/workday") ||
    pathname.startsWith("/integrations")
  ) {
    return "Settings";
  }

  for (const item of APP_NAV_MAIN) {
    if (item.url === pathname) {
      return item.title;
    }
  }

  return "Dashboard";
};
