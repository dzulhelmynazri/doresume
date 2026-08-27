import { auth } from "@doresume/auth";
import { getUserApplicationSettings } from "@doresume/db/user-application-settings";
import { Spinner } from "@doresume/ui/components/spinner";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { ApplySettingsForm } from "./apply-form";

const ApplySettingsPageContent = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/auth");
  }

  const settings = await getUserApplicationSettings(session.user.id);

  return <ApplySettingsForm settings={settings} />;
};

const ApplySettingsPage = () => (
  <Suspense
    fallback={
      <div className="py-4">
        <Spinner />
      </div>
    }
  >
    <ApplySettingsPageContent />
  </Suspense>
);

export default ApplySettingsPage;
