import type { ReactNode } from "react";

import { SettingsNav } from "@/components/settings/nav-settings";

const SettingsLayout = ({ children }: { children: ReactNode }) => (
  <div className="-m-4 flex min-h-0 flex-1 overflow-hidden">
    <aside className="bg-background shrink-0">
      <SettingsNav />
    </aside>
    <div className="min-h-0 min-w-0 flex-1 overflow-y-auto px-8">
      {children}
    </div>
  </div>
);

export default SettingsLayout;
