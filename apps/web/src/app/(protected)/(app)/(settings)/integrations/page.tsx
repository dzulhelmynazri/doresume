"use client";

import { useQuery } from "@tanstack/react-query";

import { LoadingImage } from "@/components/loading-image";
import { SETTINGS_STALE_TIME_MS } from "@/lib/settings-queries";
import { orpc } from "@/utils/orpc";

import { Integrations } from "./integrations";

const IntegrationsPage = () => {
  const { data, isPending } = useQuery(
    orpc.getConnections.queryOptions({
      staleTime: SETTINGS_STALE_TIME_MS,
    })
  );

  if (isPending || !data) {
    return (
      <div className="py-6">
        <LoadingImage />
      </div>
    );
  }

  return (
    <Integrations
      gmail={data.gmail}
      linkedin={data.linkedin}
      outlook={data.outlook}
    />
  );
};

export default IntegrationsPage;
