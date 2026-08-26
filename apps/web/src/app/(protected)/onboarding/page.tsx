import { auth } from "@doresume/auth";
import { userHasLocation } from "@doresume/db/user-location";
import { Spinner } from "@doresume/ui/components/spinner";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { getUserResume } from "@/lib/resume";

import Onboarding from "./onboarding";

const OnboardingPageContent = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/auth");
  }

  const [resume, hasLocation] = await Promise.all([
    getUserResume(session.user.id),
    userHasLocation(session.user.id),
  ]);

  if (resume && hasLocation) {
    redirect("/dashboard");
  }

  return <Onboarding initialResume={resume} />;
};

const OnboardingPage = () => (
  <div className="flex h-svh items-center justify-center p-6">
    <Suspense fallback={<Spinner />}>
      <OnboardingPageContent />
    </Suspense>
  </div>
);

export default OnboardingPage;
