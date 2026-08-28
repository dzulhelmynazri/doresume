import { getUserApplicationPassword } from "@doresume/db/user-application-password";
import { Suspense } from "react";

import { LoadingImage } from "@/components/loading-image";
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
      <div className="py-6">
        <LoadingImage />
      </div>
    }
  >
    <WorkdayPasswordPageContent />
  </Suspense>
);

export default WorkdayPasswordPage;
