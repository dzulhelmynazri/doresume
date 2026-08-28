import { getUserApplicationSettings } from "@doresume/db/user-application-settings";
import { Suspense } from "react";

import { LoadingImage } from "@/components/loading-image";
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
      <div className="py-6">
        <LoadingImage />
      </div>
    }
  >
    <ApplySettingsPageContent />
  </Suspense>
);

export default ApplySettingsPage;
