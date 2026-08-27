import { auth } from "@doresume/auth";
import { Separator } from "@doresume/ui/components/separator";
import { SidebarInset, SidebarProvider } from "@doresume/ui/components/sidebar";
import { Spinner } from "@doresume/ui/components/spinner";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import type { ReactNode } from "react";

import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { userIsOnboarded } from "@/lib/onboarding";

const AppLayoutContent = async ({ children }: { children: ReactNode }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/auth");
  }

  if (!(await userIsOnboarded(session.user.id))) {
    redirect("/onboarding");
  }

  return (
    <SidebarProvider className="row-span-full min-h-0 overflow-hidden">
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <Separator />
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
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
