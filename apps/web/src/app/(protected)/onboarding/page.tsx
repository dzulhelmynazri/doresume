import Onboarding from "@/components/onboarding";
import { getOnboardingState } from "@/lib/onboarding";
import { getUserResume } from "@/lib/resume";
import { requireNotOnboardedUser } from "@/lib/session";

export const instant = false;

const OnboardingPage = async () => {
  const user = await requireNotOnboardedUser();

  const [resume, onboardingState] = await Promise.all([
    getUserResume(user.id),
    getOnboardingState(user.id),
  ]);

  return (
    <div className="row-span-full min-h-0 overflow-y-auto">
      <div className="flex min-h-full flex-col items-center justify-center px-6 py-12">
        <Onboarding
          initialOnboarding={onboardingState}
          initialResume={resume}
        />
      </div>
    </div>
  );
};

export default OnboardingPage;
