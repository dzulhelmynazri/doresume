"use client";
import { Button } from "@doresume/ui/components/button";
import { useQuery } from "@tanstack/react-query";

import { authClient } from "@/lib/auth-client";
import { orpc } from "@/utils/orpc";

const Dashboard = ({
  customerState,
  session: _session,
}: {
  customerState: ReturnType<typeof authClient.customer.state>;
  session: typeof authClient.$Infer.Session;
}) => {
  const privateData = useQuery(orpc.privateData.queryOptions());

  const hasProSubscription =
    (customerState?.activeSubscriptions?.length ?? 0) > 0;

  return (
    <>
      <p>API: {privateData.data?.message}</p>
      <p>Plan: {hasProSubscription ? "Pro" : "Free"}</p>
      {hasProSubscription ? (
        <Button
          type="button"
          onClick={async () => await authClient.customer.portal()}
        >
          Manage Subscription
        </Button>
      ) : (
        <Button
          type="button"
          onClick={async () => await authClient.checkout({ slug: "pro" })}
        >
          Upgrade to Pro
        </Button>
      )}
    </>
  );
};

export default Dashboard;
