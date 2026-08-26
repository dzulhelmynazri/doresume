import { auth } from "@doresume/auth";
import { Spinner } from "@doresume/ui/components/spinner";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import Auth from "@/components/auth";
import { userIsOnboarded } from "@/lib/onboarding";

const AuthPageContent = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user) {
    if (await userIsOnboarded(session.user.id)) {
      redirect("/dashboard");
    }

    redirect("/onboarding");
  }

  return <Auth />;
};

const AuthPage = () => (
  <div className="flex h-svh items-center justify-center p-6">
    <Suspense fallback={<Spinner />}>
      <AuthPageContent />
    </Suspense>
  </div>
);

export default AuthPage;
