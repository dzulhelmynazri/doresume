"use client";

import {
  createDefaultResumeDocument,
  getActiveDocumentBundle,
} from "@doresume/contracts";
import { useQuery } from "@tanstack/react-query";

import { LoadingImage } from "@/components/loading-image";
import { ResumePreviewDisplay } from "@/components/resume/resume-preview-display";
import { orpc } from "@/utils/orpc";

const STALE_TIME_MS = 5 * 60 * 1000;

const ApplicationResumePage = () => {
  const { data, isPending } = useQuery(
    orpc.getDocuments.queryOptions({
      staleTime: STALE_TIME_MS,
    })
  );

  if (isPending) {
    return <LoadingImage />;
  }

  const document = data
    ? getActiveDocumentBundle(data).document
    : createDefaultResumeDocument({
        email: "alex@example.com",
        name: "Alex Smith",
      });

  return (
    <div className="flex min-h-0 flex-1 overflow-y-auto">
      <div className="w-full max-w-[8.5in] shadow-sm">
        <ResumePreviewDisplay document={document} />
      </div>
    </div>
  );
};

export default ApplicationResumePage;
