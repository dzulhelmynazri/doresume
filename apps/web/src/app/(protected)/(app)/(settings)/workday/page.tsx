import { auth } from "@doresume/auth";
import { getUserApplicationPassword } from "@doresume/db/user-application-password";
import { Spinner } from "@doresume/ui/components/spinner";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { WorkdayPasswordForm } from "./workday-form";

const WorkdayPasswordPageContent = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/auth");
  }

  const password = await getUserApplicationPassword(session.user.id);

  return <WorkdayPasswordForm password={password ?? ""} />;
};

const WorkdayPasswordPage = () => (
  <Suspense fallback={<Spinner />}>
    <WorkdayPasswordPageContent />
  </Suspense>
);

export default WorkdayPasswordPage;
