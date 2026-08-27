import { Spinner } from "@doresume/ui/components/spinner";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import Auth from "@/components/auth";
import { userIsOnboarded } from "@/lib/onboarding";
import { getCurrentUser } from "@/lib/session";

const AuthPageContent = async () => {
  const user = await getCurrentUser();

  if (user) {
    if (await userIsOnboarded(user.id)) {
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
