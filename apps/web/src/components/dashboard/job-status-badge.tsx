"use client";

import { Badge } from "@doresume/ui/components/badge";

import { JOB_STATUS_LABEL } from "./data";
import type { JobStatus } from "./data";

const JobStatusBadge = ({ status }: { status: JobStatus }) => {
  const label = JOB_STATUS_LABEL[status];

  if (status === "needs-you") {
    return <Badge>{label}</Badge>;
  }

  if (status === "failed") {
    return <Badge variant="destructive">{label}</Badge>;
  }

  if (status === "skipped") {
    return <Badge variant="outline">{label}</Badge>;
  }

  return <Badge variant="secondary">{label}</Badge>;
};

export { JobStatusBadge };
