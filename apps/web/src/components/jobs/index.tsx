"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import type { Job, JobStatus } from "@/components/dashboard/data/jobs";
import { getBrowseJobs } from "@/components/dashboard/data/jobs";
import { JobCards } from "@/components/dashboard/job/job-cards";
import { JobSheet } from "@/components/dashboard/job/job-sheet";
import { LoadingImage } from "@/components/loading-image";
import { orpc } from "@/utils/orpc";

import { toUiJob } from "./live-jobs";

const JOBS_STALE_TIME_MS = 5 * 60 * 1000;

export const Jobs = () => {
  const { data, isPending } = useQuery(
    orpc.listJobs.queryOptions({
      input: { limit: 100 },
      staleTime: JOBS_STALE_TIME_MS,
    })
  );

  const feedJobs = useMemo(() => (data ?? []).map(toUiJob), [data]);

  // Apply/Pass mutate local overlay state until saveApplication is wired.
  const [statusOverrides, setStatusOverrides] = useState<
    Record<string, JobStatus>
  >({});
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (isPending) {
    return (
      <div className="p-6">
        <LoadingImage />
      </div>
    );
  }

  const jobs = feedJobs.map((job) => {
    const override = statusOverrides[job.id];
    return override ? { ...job, status: override } : job;
  });
  const selectedJob = jobs.find((job) => job.id === selectedId) ?? null;
  const browseJobs = getBrowseJobs(jobs);

  const handleApply = (job: Job) => {
    setStatusOverrides((current) => ({ ...current, [job.id]: "in-flight" }));
  };

  const handlePass = (job: Job) => {
    setStatusOverrides((current) => ({ ...current, [job.id]: "skipped" }));
  };

  const handleSelectJob = (nextJob: Job) => {
    setSelectedId(nextJob.id);
    setOpen(true);
  };

  if (jobs.length === 0) {
    return (
      <div className="text-muted-foreground p-6">
        No jobs yet. Run the MYFutureJobs ingest to populate your feed.
      </div>
    );
  }

  return (
    <>
      <JobCards
        jobs={browseJobs}
        onApplyAction={handleApply}
        onPassAction={handlePass}
        onSelectAction={handleSelectJob}
      />
      <JobSheet job={selectedJob} onOpenChange={setOpen} open={open} />
    </>
  );
};
