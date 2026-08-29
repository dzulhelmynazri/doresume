import { notFound } from "next/navigation";
import { Suspense } from "react";

import { getJobById } from "@/components/dashboard/data/jobs";
import { JobApplication } from "@/components/dashboard/job/job-application";
import { LoadingImage } from "@/components/loading-image";

const JobContent = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const job = getJobById(id);

  if (!job) {
    notFound();
  }

  return <JobApplication job={job} />;
};

const ApplicationJobPage = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => (
  <Suspense
    fallback={
      <div className="flex min-h-40 items-center justify-center">
        <LoadingImage />
      </div>
    }
  >
    <JobContent params={params} />
  </Suspense>
);

export default ApplicationJobPage;
