"use client";

import { useState } from "react";

import {
  getBrowseJobs,
  jobs as initialJobs,
} from "@/components/dashboard/data/jobs";
import type { Job } from "@/components/dashboard/data/jobs";
import { JobCards } from "@/components/dashboard/job/job-cards";
import { JobSheet } from "@/components/dashboard/job/job-sheet";

export const Jobs = () => {
  const [jobs, setJobs] = useState(initialJobs);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedJob = jobs.find((job) => job.id === selectedId) ?? null;
  const browseJobs = getBrowseJobs(jobs);

  const handleApply = (job: Job) => {
    setJobs((current) =>
      current.map((row) =>
        row.id === job.id ? { ...row, status: "in-flight" } : row
      )
    );
  };

  const handlePass = (job: Job) => {
    setJobs((current) =>
      current.map((row) =>
        row.id === job.id ? { ...row, status: "skipped" } : row
      )
    );
  };

  const handleSelectJob = (nextJob: Job) => {
    setSelectedId(nextJob.id);
    setOpen(true);
  };

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
