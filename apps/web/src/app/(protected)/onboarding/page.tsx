import { Spinner } from "@doresume/ui/components/spinner";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import Onboarding from "@/components/onboarding";
import { userIsOnboarded } from "@/lib/onboarding";
import { getUserResume } from "@/lib/resume";
import { requireUser } from "@/lib/session";

const OnboardingPageContent = async () => {
  const user = await requireUser();
  const [resume, isOnboarded] = await Promise.all([
    getUserResume(user.id),
    userIsOnboarded(user.id),
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
