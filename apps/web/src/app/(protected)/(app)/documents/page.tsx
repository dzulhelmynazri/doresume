"use client";

import { useQuery } from "@tanstack/react-query";

import { LoadingImage } from "@/components/loading-image";
import { ResumeEditor } from "@/components/resume";
import { orpc } from "@/utils/orpc";

const STALE_TIME_MS = 5 * 60 * 1000;

const DocumentsPage = () => {
  const { data, isPending } = useQuery(
    orpc.getDocuments.queryOptions({
      staleTime: STALE_TIME_MS,
    })
  );

  if (isPending || !data) {
    return (
      <div className="p-6">
        <LoadingImage />
      </div>
    );
  }

  return <ResumeEditor initialDocuments={data} />;
};

export default DocumentsPage;
