import { getIntegrationConnections } from "@doresume/api/composio";
import { Suspense } from "react";

import { requireUser } from "@/lib/session";

import { Integrations } from "./integrations";

const IntegrationsPageContent = async () => {
  const user = await requireUser();
  const { gmail, linkedin, outlook } = await getIntegrationConnections(user.id);

  return <Integrations gmail={gmail} linkedin={linkedin} outlook={outlook} />;
};

const IntegrationsPage = () => (
  <Suspense
    fallback={<div className="text-muted-foreground py-4">Wait laa...</div>}
  >
    <IntegrationsPageContent />
  </Suspense>
);

export default IntegrationsPage;
