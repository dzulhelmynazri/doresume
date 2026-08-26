import { auth } from "@doresume/auth";
import { Spinner } from "@doresume/ui/components/spinner";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { authClient } from "@/lib/auth-client";
import { userIsOnboarded } from "@/lib/onboarding";

import Dashboard from "./dashboard";

const DashboardPageContent = async () => {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session?.user) {
    redirect("/auth");
  }

  if (!(await userIsOnboarded(session.user.id))) {
    redirect("/onboarding");
  }

  const { data: customerState } = await authClient.customer.state({
    fetchOptions: {
      headers: requestHeaders,
    },
  });

  return (
    <>
      <p>Welcome {session.user.name}</p>
      <Dashboard session={session} customerState={customerState} />
    </>
  );
};

const DashboardPage = () => (
  <div>
    <h1>Dashboard</h1>
    <Suspense fallback={<Spinner />}>
      <DashboardPageContent />
    </Suspense>
  </div>
);

export default DashboardPage;
