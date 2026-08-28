import { getUserApplicationSettings } from "@doresume/db/user-application-settings";
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
    fallback={<div className="text-muted-foreground py-4">Wait laa...</div>}
  >
    <ApplySettingsPageContent />
  </Suspense>
);

export default ApplySettingsPage;
