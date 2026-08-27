import { getIntegrationConnections } from "@doresume/api/composio";
import { Spinner } from "@doresume/ui/components/spinner";
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
    fallback={
      <div className="py-4">
        <Spinner />
      </div>
    }
  >
    <IntegrationsPageContent />
  </Suspense>
);

export default IntegrationsPage;
