"use client";

import { DataTable } from "@/components/dashboard/table/data-table";

import { companies, getCompanyPath } from "./data/companies";
import { columns } from "./table/columns";

export const Networking = () => (
  <div className="flex flex-col gap-4">
    <h2>Companies</h2>
    <DataTable
      columns={columns}
      data={companies}
      getRowHref={(company) => getCompanyPath(company.id)}
    />
  </div>
);
