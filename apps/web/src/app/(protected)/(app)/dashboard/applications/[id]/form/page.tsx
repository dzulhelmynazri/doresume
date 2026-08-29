"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { ApplicationFormSnapshotView } from "@/components/applications/form/application-form-snapshot";
import { LoadingImage } from "@/components/loading-image";
import { orpc } from "@/utils/orpc";

const STALE_TIME_MS = 5 * 60 * 1000;

const ApplicationFormPage = () => {
  const params = useParams<{ id: string }>();
  const id = typeof params?.id === "string" ? params.id : "";

  const { data, isPending } = useQuery(
    orpc.getApplication.queryOptions({
      input: { id },
      staleTime: STALE_TIME_MS,
    })
  );

  if (isPending) {
    return <LoadingImage />;
  }

  return <ApplicationFormSnapshotView snapshot={data?.formSnapshot} />;
};

export default ApplicationFormPage;
