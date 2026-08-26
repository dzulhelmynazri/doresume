import { auth } from "@doresume/auth";
import { Spinner } from "@doresume/ui/components/spinner";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { userIsOnboarded } from "@/lib/onboarding";
import { getUserResume } from "@/lib/resume";

import Onboarding from "./onboarding";

const OnboardingPageContent = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/auth");
  }

  const [resume, isOnboarded] = await Promise.all([
    getUserResume(session.user.id),
    userIsOnboarded(session.user.id),
  ]);

  if (isOnboarded) {
    redirect("/dashboard");
  }

  return <Onboarding initialResume={resume} />;
};

const OnboardingPage = () => (
  <div className="row-span-full min-h-0 overflow-y-auto">
    <div className="flex min-h-full flex-col items-center justify-center px-6 py-12">
      <Suspense fallback={<Spinner />}>
        <OnboardingPageContent />
      </Suspense>
    </div>
  </div>
);

export default OnboardingPage;
