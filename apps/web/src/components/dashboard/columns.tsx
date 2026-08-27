import { Button } from "@doresume/ui/components/button";
import { Checkbox } from "@doresume/ui/components/checkbox";
import { Progress } from "@doresume/ui/components/progress";
import { createColumnHelper } from "@tanstack/react-table";

import {
  formatMatchPercent,
  formatSalaryRange,
  formatWorkplaceLocation,
} from "./data";
import type { Job } from "./data";
import { DataTableColumnHeader } from "./data-table-column-header";
import type { DataTableFeatures } from "./data-table-features";
import { JobResumeBadge } from "./job-resume-badge";
import { JobStatusBadge } from "./job-status-badge";

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

const JobMatchCell = ({ value }: { value: number }) => (
  <div className="flex min-w-24 items-center gap-2">
    <span className="w-10 tabular-nums">{formatMatchPercent(value)}</span>
    <Progress aria-label="Match" className="w-16" value={value} />
  </div>
);

const JobRowActions = ({
  job,
  onApply,
  onPass,
}: {
  job: Job;
  onApply: (job: Job) => void;
  onPass: (job: Job) => void;
}) => {
  const canApply =
    job.status !== "in-flight" &&
    job.status !== "skipped" &&
    job.status !== "submitted";
  const canPass = job.status !== "skipped";

  return (
    <div className="flex w-full items-center justify-end gap-2">
      <Button
        disabled={!canPass}
        onClick={(event) => {
          event.stopPropagation();
          onPass(job);
        }}
        size="sm"
        type="button"
        variant="outline"
      >
        Pass
      </Button>
      <Button
        disabled={!canApply}
        onClick={(event) => {
          event.stopPropagation();
          onApply(job);
        }}
        size="sm"
        type="button"
      >
        Apply
      </Button>
    </div>
  );
};

const matchesRoleFilter = (
  row: { original: Job },
  _columnId: string,
  value: unknown
): boolean => {
  if (typeof value !== "string" || value.length === 0) {
    return true;
  }

  const query = value.toLowerCase();

  return (
    row.original.title.toLowerCase().includes(query) ||
    row.original.company.toLowerCase().includes(query)
  );
};

export const createColumns = ({
  onApplyAction,
  onPassAction,
}: {
  onApplyAction: (job: Job) => void;
  onPassAction: (job: Job) => void;
}) =>
  columnHelper.columns([
    columnHelper.display({
      cell: ({ row }) => (
        <Checkbox
          aria-label="Select row"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(value)}
          onClick={(event) => event.stopPropagation()}
        />
      ),
      enableHiding: false,
      enableSorting: false,
      header: ({ table }) => (
        <Checkbox
          aria-label="Select all"
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={
            table.getIsSomePageRowsSelected() &&
            !table.getIsAllPageRowsSelected()
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(value)}
        />
      ),
      id: "select",
    }),
    columnHelper.accessor("title", {
      cell: ({ row }) => (
        <JobRoleCell
          company={row.original.company}
          title={row.original.title}
        />
      ),
      filterFn: matchesRoleFilter,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Role" />
      ),
      meta: { label: "Role" },
    }),
    columnHelper.accessor("location", {
      cell: ({ row }) =>
        formatWorkplaceLocation(row.original.location, row.original.workplace),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Location" />
      ),
      meta: { label: "Location" },
    }),
    columnHelper.accessor("salaryMin", {
      cell: ({ row }) =>
        formatSalaryRange(row.original.salaryMin, row.original.salaryMax),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Salary" />
      ),
      meta: { label: "Salary" },
      sortFn: "basic",
    }),
    columnHelper.accessor("matchPercent", {
      cell: ({ getValue }) => <JobMatchCell value={getValue()} />,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Match" />
      ),
      meta: { label: "Match" },
      sortFn: "basic",
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
    columnHelper.display({
      cell: ({ row }) => (
        <JobRowActions
          job={row.original}
          onApply={onApplyAction}
          onPass={onPassAction}
        />
      ),
      enableHiding: false,
      enableSorting: false,
      header: () => <div className="text-right">Actions</div>,
      id: "actions",
      meta: { className: "text-right", label: "Actions" },
    }),
  ]);
