"use client";

import { useState } from "react";

import {
  getFeaturedJobs,
  getJobApplicationPath,
  jobs as initialJobs,
} from "./data/jobs";
import type { Job } from "./data/jobs";
import { JobCards } from "./job/job-cards";
import { JobSheet } from "./job/job-sheet";
import { columns } from "./table/columns";
import { DataTable } from "./table/data-table";

export const Dashboard = () => {
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

  const handleSelectJob = (nextJob: Job) => {
    setSelectedId(nextJob.id);
    setOpen(true);
  };

  const featuredJobs = getFeaturedJobs(jobs);

  return (
    <>
      <div className="flex flex-col gap-8">
        <section className="flex flex-col gap-4">
          <h2>Top job matches</h2>
          <JobCards
            jobs={featuredJobs}
            onApplyAction={handleApply}
            onPassAction={handlePass}
            onSelectAction={handleSelectJob}
          />
        </section>
        <section className="flex flex-col gap-4">
          <h2>All applications</h2>
          <DataTable
            columns={columns}
            data={jobs}
            getRowHref={(job) => getJobApplicationPath(job.id)}
          />
        </section>
      </div>
      <JobSheet job={selectedJob} onOpenChange={setOpen} open={open} />
    </>
  );
};
