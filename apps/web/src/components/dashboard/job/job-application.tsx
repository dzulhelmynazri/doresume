import { Button } from "@doresume/ui/components/button";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import type { Job } from "../data/jobs";
import { JobDetails } from "./job-details";
import { JobResumeBadge } from "./job-resume-badge";
import { JobStatusBadge } from "./job-status-badge";

const JobApplication = ({ job }: { job: Job }) => (
  <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-1">
        <h1>{job.title}</h1>
        <p className="text-muted-foreground">{job.company}</p>
      </div>
      <Button
        className="shrink-0"
        nativeButton={false}
        render={
          <Link
            aria-label="View original posting"
            href={job.url}
            rel="noopener"
            target="_blank"
          />
        }
        variant="link"
      >
        View original posting
        <ArrowUpRight data-icon="inline-end" />
      </Button>
    </div>
    <JobDetails job={job}>
      <JobStatusBadge status={job.status} />
      <JobResumeBadge status={job.resumeStatus} />
    </JobDetails>
  </div>
);

export { JobApplication };
