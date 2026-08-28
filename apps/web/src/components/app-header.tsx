"use client";

import { AppNavMenu } from "@/components/app-nav-menu";
import { ModeToggle } from "@/components/mode-toggle";
import { UserMenu } from "@/components/user-menu";

export const AppHeader = () => (
  <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4">
    <AppNavMenu />
    <div className="flex items-center gap-2">
      <ModeToggle />
      <UserMenu />
    </div>
  </header>
);
