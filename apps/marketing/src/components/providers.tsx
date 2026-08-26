"use client";

import { TooltipProvider } from "@doresume/ui/components/tooltip";
import type { ReactNode } from "react";

import { ThemeProvider } from "./theme-provider";

const Providers = ({ children }: { children: ReactNode }) => (
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    disableTransitionOnChange
    enableSystem
  >
    <TooltipProvider>{children}</TooltipProvider>
  </ThemeProvider>
);

export default Providers;
