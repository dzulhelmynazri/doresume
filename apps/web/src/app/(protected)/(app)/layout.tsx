import { Separator } from "@doresume/ui/components/separator";
import { Spinner } from "@doresume/ui/components/spinner";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import type { ReactNode } from "react";

import { AppHeader } from "@/components/app-header";
import { userIsOnboarded } from "@/lib/onboarding";
import { requireUser } from "@/lib/session";

const AppLayoutContent = async ({ children }: { children: ReactNode }) => {
  const user = await requireUser();

  if (!(await userIsOnboarded(user.id))) {
    redirect("/onboarding");
  }

  return (
    <div className="bg-sidebar row-span-full flex min-h-0 overflow-hidden p-2">
      <main className="bg-background relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl shadow-sm">
        <AppHeader />
        <Separator />
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
          {children}
        </div>
      </main>
    </div>
  );
};

const AppLayout = ({ children }: { children: ReactNode }) => (
  <Suspense
    fallback={
      <div className="row-span-full flex min-h-0 items-center justify-center">
        <Spinner />
      </div>
    }
  >
    <AppLayoutContent>{children}</AppLayoutContent>
  </Suspense>
);

export default AppLayout;
