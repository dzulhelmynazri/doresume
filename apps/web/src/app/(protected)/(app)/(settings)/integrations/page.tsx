import { CardDescription, CardTitle } from "@doresume/ui/components/card";
import { Spinner } from "@doresume/ui/components/spinner";
import { Suspense } from "react";

const IntegrationsPage = () => (
  <Suspense
    fallback={
      <div className="py-4">
        <Spinner />
      </div>
    }
  >
    <div className="py-4">
      <CardTitle>Integrations</CardTitle>
      <CardDescription>
        Integrations with other services and tools.
      </CardDescription>
    </div>
  </Suspense>
);

export default IntegrationsPage;
