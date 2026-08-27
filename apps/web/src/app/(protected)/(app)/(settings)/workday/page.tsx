import { getUserApplicationPassword } from "@doresume/db/user-application-password";
import { Spinner } from "@doresume/ui/components/spinner";
import { Suspense } from "react";

import { requireUser } from "@/lib/session";

import { WorkdayPasswordForm } from "./workday-form";

const WorkdayPasswordPageContent = async () => {
  const user = await requireUser();
  const password = await getUserApplicationPassword(user.id);

  return <WorkdayPasswordForm password={password ?? ""} />;
};

const WorkdayPasswordPage = () => (
  <Suspense
    fallback={
      <div className="py-4">
        <Spinner />
      </div>
    }
  >
    <WorkdayPasswordPageContent />
  </Suspense>
);

export default WorkdayPasswordPage;
