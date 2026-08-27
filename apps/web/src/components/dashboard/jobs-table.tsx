"use client";

import { useState } from "react";

import { createColumns } from "./columns";
import { jobs as initialJobs } from "./data";
import type { Job } from "./data";
import { DataTable } from "./data-table";
import { JobSheet } from "./job-sheet";

export const JobsTable = () => {
  const [jobs, setJobs] = useState(initialJobs);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedJob = jobs.find((job) => job.id === selectedId) ?? null;

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

  const handleRowClick = (nextJob: Job) => {
    setSelectedId(nextJob.id);
    setOpen(true);
  };

  const columns = createColumns({
    onApplyAction: handleApply,
    onPassAction: handlePass,
  });

  return (
    <>
      <DataTable columns={columns} data={jobs} onRowClick={handleRowClick} />
      <JobSheet job={selectedJob} onOpenChange={setOpen} open={open} />
    </>
  );
};
