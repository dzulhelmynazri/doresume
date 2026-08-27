"use client";

import { Badge } from "@doresume/ui/components/badge";

import { RESUME_STATUS_LABEL } from "../data/jobs";
import type { ResumeStatus } from "../data/jobs";

const RESUME_STATUS_CLASSNAME: Record<ResumeStatus, string> = {
  generating: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  "not-ready": "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  ready: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
};

const JobResumeBadge = ({ status }: { status: ResumeStatus }) => (
  <Badge className={RESUME_STATUS_CLASSNAME[status]}>
    {RESUME_STATUS_LABEL[status]}
  </Badge>
);

export { JobResumeBadge };
