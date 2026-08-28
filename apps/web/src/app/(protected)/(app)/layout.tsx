import { Separator } from "@doresume/ui/components/separator";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import type { ReactNode } from "react";

import { AppHeader } from "@/components/app-header";
import { LoadingImage } from "@/components/loading-image";
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
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
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
        <LoadingImage />
      </div>
    }
  >
    <AppLayoutContent>{children}</AppLayoutContent>
  </Suspense>
);

export default AppLayout;
