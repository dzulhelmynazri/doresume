import { Suspense } from "react";

import { LoadingImage } from "@/components/loading-image";
import Onboarding from "@/components/onboarding";
import { getUserResume } from "@/lib/resume";
import { requireNotOnboardedUser } from "@/lib/session";

const OnboardingPageContent = async () => {
  const user = await requireNotOnboardedUser();
  const resume = await getUserResume(user.id);

  return <Onboarding initialResume={resume} />;
};

const OnboardingPage = () => (
  <div className="row-span-full min-h-0 overflow-y-auto">
    <div className="flex min-h-full flex-col items-center justify-center px-6 py-12">
      <Suspense fallback={<LoadingImage />}>
        <OnboardingPageContent />
      </Suspense>
    </div>
  </div>
);

export default OnboardingPage;
