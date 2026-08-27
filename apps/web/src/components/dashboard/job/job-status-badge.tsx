"use client";

import { Badge } from "@doresume/ui/components/badge";

import { JOB_STATUS_LABEL } from "../data/jobs";
import type { JobStatus } from "../data/jobs";

const JOB_STATUS_CLASSNAME: Record<JobStatus, string> = {
  failed: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
  "in-flight": "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  "needs-you":
    "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  skipped: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  submitted: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
};

const JobStatusBadge = ({ status }: { status: JobStatus }) => (
  <Badge className={JOB_STATUS_CLASSNAME[status]}>
    {JOB_STATUS_LABEL[status]}
  </Badge>
);

export { JobStatusBadge };
