"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@doresume/ui/components/breadcrumb";
import { Separator } from "@doresume/ui/components/separator";
import { SidebarTrigger } from "@doresume/ui/components/sidebar";
import { usePathname } from "next/navigation";

import { getAppNavTitle } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { UserMenu } from "@/components/user-menu";

export const AppHeader = () => {
  const pathname = usePathname();
  const title = getAppNavTitle(pathname);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-vertical:h-4 data-vertical:self-auto"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-2">
        <ModeToggle />
        <UserMenu />
      </div>
    </header>
  );
};
