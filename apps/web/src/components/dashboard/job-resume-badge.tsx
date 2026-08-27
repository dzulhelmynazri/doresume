"use client";

import { Badge } from "@doresume/ui/components/badge";

import { RESUME_STATUS_LABEL } from "./data";
import type { ResumeStatus } from "./data";

const JobResumeBadge = ({ status }: { status: ResumeStatus }) => {
  const label = RESUME_STATUS_LABEL[status];

  if (status === "ready") {
    return <Badge>{label}</Badge>;
  }

  if (status === "generating") {
    return <Badge variant="secondary">{label}</Badge>;
  }

  return <Badge variant="outline">{label}</Badge>;
};

export { JobResumeBadge };
