import { Separator } from "@doresume/ui/components/separator";
import type { ReactNode } from "react";

import { SettingsNav } from "@/components/settings/nav-settings";

const SettingsLayout = ({ children }: { children: ReactNode }) => (
  <div className="-m-4 flex min-h-[calc(100%+2rem)] flex-1">
    <SettingsNav />
    <Separator orientation="vertical" />
    <div className="min-w-0 flex-1 px-8">{children}</div>
  </div>
);

export default SettingsLayout;
