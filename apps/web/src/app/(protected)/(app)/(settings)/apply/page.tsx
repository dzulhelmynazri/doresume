import { getUserApplicationSettings } from "@doresume/db/user-application-settings";
import { Spinner } from "@doresume/ui/components/spinner";
import { Suspense } from "react";

import { requireUser } from "@/lib/session";

import { ApplySettingsForm } from "./apply-form";

const ApplySettingsPageContent = async () => {
  const user = await requireUser();
  const settings = await getUserApplicationSettings(user.id);

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
