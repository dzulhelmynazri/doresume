import { Spinner } from "@doresume/ui/components/spinner";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { getJobById } from "@/components/dashboard/data/jobs";
import { JobApplication } from "@/components/dashboard/job/job-application";

const ApplicationContent = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const job = getJobById(id);

  if (!job) {
    notFound();
  }

  return <JobApplication job={job} />;
};

const ApplicationPage = ({ params }: { params: Promise<{ id: string }> }) => (
  <Suspense
    fallback={
      <div className="flex min-h-40 items-center justify-center">
        <Spinner />
      </div>
    }
  >
    <ApplicationContent params={params} />
  </Suspense>
);

export default ApplicationPage;
