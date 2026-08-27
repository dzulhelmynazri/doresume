import { createColumnHelper } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/dashboard/table/data-table-column-header";
import type { DataTableFeatures } from "@/components/dashboard/table/data-table-features";

import type { Company } from "../data/companies";

const columnHelper = createColumnHelper<DataTableFeatures, Company>();

export const columns = columnHelper.columns([
  columnHelper.accessor("name", {
    cell: ({ getValue }) => (
      <span className="font-medium whitespace-nowrap">{getValue()}</span>
    ),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Company" />
    ),
    meta: { label: "Company" },
  }),
  columnHelper.accessor("location", {
    cell: ({ getValue }) => (
      <span className="text-muted-foreground whitespace-nowrap">
        {getValue()}
      </span>
    ),
    header: ({ column }) => (
      <DataTableColumnHeader
        className="justify-end"
        column={column}
        title="Location"
      />
    ),
    meta: { className: "text-right", label: "Location" },
  }),
]);
