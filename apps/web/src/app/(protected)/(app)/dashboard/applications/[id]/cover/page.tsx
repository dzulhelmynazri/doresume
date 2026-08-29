"use client";

import {
  createDefaultCoverLetter,
  createDefaultResumeDocument,
  getActiveDocumentBundle,
} from "@doresume/contracts";
import { useQuery } from "@tanstack/react-query";

import { LoadingImage } from "@/components/loading-image";
import { CoverLetterPreviewDisplay } from "@/components/resume/cover-letter-preview-display";
import { orpc } from "@/utils/orpc";

const STALE_TIME_MS = 5 * 60 * 1000;

const ApplicationCoverPage = () => {
  const { data, isPending } = useQuery(
    orpc.getDocuments.queryOptions({
      staleTime: STALE_TIME_MS,
    })
  );

  if (isPending) {
    return <LoadingImage />;
  }

  const activeBundle = data ? getActiveDocumentBundle(data) : null;
  const document =
    activeBundle?.document ??
    createDefaultResumeDocument({
      email: "alex@example.com",
      name: "Alex Smith",
    });
  const coverLetter = activeBundle?.coverLetter ?? createDefaultCoverLetter();

  return (
    <div className="flex min-h-0 flex-1 overflow-y-auto">
      <div className="w-full max-w-[8.5in] shadow-sm">
        <CoverLetterPreviewDisplay
          coverLetter={coverLetter}
          document={document}
        />
      </div>
    </div>
  );
};

export default ApplicationCoverPage;
