import { createColumnHelper } from "@tanstack/react-table";

import type { Job } from "../data/jobs";
import { JobResumeBadge } from "../job/job-resume-badge";
import { JobStatusBadge } from "../job/job-status-badge";
import { DataTableColumnHeader } from "./data-table-column-header";
import type { DataTableFeatures } from "./data-table-features";

const columnHelper = createColumnHelper<DataTableFeatures, Job>();

const JobRoleCell = ({
  company,
  title,
}: {
  company: string;
  title: string;
}) => (
  <div className="flex min-w-56 flex-col gap-0.5">
    <span className="font-medium">{title}</span>
    <span className="text-muted-foreground">{company}</span>
  </div>
);

export const columns = columnHelper.columns([
  columnHelper.accessor("title", {
    cell: ({ row }) => (
      <JobRoleCell company={row.original.company} title={row.original.title} />
    ),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    meta: { label: "Role" },
  }),
  columnHelper.accessor("resumeStatus", {
    cell: ({ getValue }) => <JobResumeBadge status={getValue()} />,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Resume" />
    ),
    meta: { label: "Resume" },
  }),
  columnHelper.accessor("status", {
    cell: ({ getValue }) => <JobStatusBadge status={getValue()} />,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    meta: { label: "Status" },
  }),
]);
