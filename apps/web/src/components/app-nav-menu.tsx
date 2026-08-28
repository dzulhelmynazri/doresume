"use client";

import { Button } from "@doresume/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@doresume/ui/components/dropdown-menu";
import { cn } from "@doresume/ui/lib/utils";
import { ChevronsUpDownIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { APP_NAV_MAIN, APP_NAV_SECONDARY, getAppNavTitle } from "@/lib/app-nav";

export const AppNavMenu = () => {
  const pathname = usePathname();
  const currentTitle = getAppNavTitle(pathname);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            className="h-auto gap-2 px-2 py-1.5"
          />
        }
      >
        <div className="flex items-center gap-2">
          <div className="relative size-8 shrink-0 overflow-hidden rounded-lg">
            <Image
              alt="doresume"
              className="size-full [image-rendering:pixelated]"
              height={24}
              src="/doresume.png"
              unoptimized
              width={24}
            />
          </div>
          <div className="flex flex-col gap-0.5 text-left leading-tight">
            <span className="text-sm font-medium">doresume</span>
            <span className="text-muted-foreground text-xs">
              [{currentTitle}]
            </span>
          </div>
          <ChevronsUpDownIcon className="text-muted-foreground size-4 shrink-0" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-56 rounded-lg">
        <DropdownMenuGroup>
          {APP_NAV_MAIN.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.url;

            return (
              <DropdownMenuItem
                key={item.url}
                className={cn(isActive && "bg-muted")}
                render={<Link aria-label={item.title} href={item.url} />}
              >
                <Icon />
                {item.title}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {APP_NAV_SECONDARY.map((item) => {
            const Icon = item.icon;

            return (
              <DropdownMenuItem
                key={item.title}
                render={<Link aria-label={item.title} href={item.url} />}
              >
                <Icon />
                {item.title}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
