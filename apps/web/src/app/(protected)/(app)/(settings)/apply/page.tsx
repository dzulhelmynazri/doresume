"use client";

import { useQuery } from "@tanstack/react-query";

import { LoadingImage } from "@/components/loading-image";
import { SETTINGS_STALE_TIME_MS } from "@/lib/settings-queries";
import { orpc } from "@/utils/orpc";

import { ApplySettingsForm } from "./apply-form";

const ApplySettingsPage = () => {
  const { data, isPending } = useQuery(
    orpc.getApplicationSettings.queryOptions({
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

  return <ApplySettingsForm settings={data.settings} />;
};

export default ApplySettingsPage;
