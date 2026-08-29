import type { ReactNode } from "react";

import { ApplicationsNav } from "@/components/applications/nav-applications";

const ApplicationLayout = ({ children }: { children: ReactNode }) => (
  <div className="-m-4 flex min-h-0 flex-1 overflow-hidden">
    <aside className="bg-background shrink-0">
      <ApplicationsNav />
    </aside>
    <div className="min-h-0 min-w-0 flex-1 overflow-y-auto p-8">{children}</div>
  </div>
);

export default ApplicationLayout;
