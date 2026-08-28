"use client";

import { useQuery } from "@tanstack/react-query";

import { LoadingImage } from "@/components/loading-image";
import { SETTINGS_STALE_TIME_MS } from "@/lib/settings-queries";
import { orpc } from "@/utils/orpc";

import { AtsForm } from "./ats-form";

const AtsPage = () => {
  const { data, isPending } = useQuery(
    orpc.getAtsFormData.queryOptions({
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
    <AtsForm
      checklist={data.checklist}
      eligibility={data.eligibility}
      minimumSalary={data.minimumSalary}
    />
  );
};

export default AtsPage;
