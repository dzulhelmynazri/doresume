"use client";

import { Button } from "@doresume/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@doresume/ui/components/dropdown-menu";
import { cn } from "@doresume/ui/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { APP_NAV_MAIN, getAppNavContext } from "@/lib/app-nav";

export const AppNavMenu = () => {
  const pathname = usePathname();
  const { icon: CurrentIcon, title: currentTitle } = getAppNavContext(pathname);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            className="h-auto gap-2 px-3 py-1.5"
          />
        }
      >
        <div className="flex items-center gap-2">
          <div className="relative size-7 shrink-0 overflow-hidden rounded-lg">
            <Image
              alt="doresume"
              className="size-full [image-rendering:pixelated]"
              height={24}
              src="/doresume.png"
              unoptimized
              width={24}
            />
          </div>
          <div className="flex flex-col text-left leading-tight">
            <span className="text-sm font-medium">doresume</span>
            <span className="text-muted-foreground inline-flex items-center gap-1 text-xs">
              <span>[</span>
              {CurrentIcon ? (
                <CurrentIcon aria-hidden className="size-3 shrink-0" />
              ) : null}
              <span>{currentTitle}</span>
              <span>]</span>
            </span>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-56">
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
