"use client";

import { useQuery } from "@tanstack/react-query";

import { LoadingImage } from "@/components/loading-image";
import { SETTINGS_STALE_TIME_MS } from "@/lib/settings-queries";
import { orpc } from "@/utils/orpc";

import { WorkdayPasswordForm } from "./workday-form";

const WorkdayPasswordPage = () => {
  const { data, isPending } = useQuery(
    orpc.getApplicationPassword.queryOptions({
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

  return <WorkdayPasswordForm password={data.password} />;
};

export default WorkdayPasswordPage;
