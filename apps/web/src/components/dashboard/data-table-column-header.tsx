"use client";

import { Button } from "@doresume/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@doresume/ui/components/dropdown-menu";
import { cn } from "@doresume/ui/lib/utils";
import type { Column, RowData } from "@tanstack/react-table";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronsUpDownIcon,
  EyeOffIcon,
} from "lucide-react";

import type { DataTableFeatures } from "./data-table-features";

const DataTableColumnHeader = <TData extends RowData, TValue>({
  className,
  column,
  title,
}: {
  className?: string;
  column: Column<DataTableFeatures, TData, TValue>;
  title: string;
}) => {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  const sorted = column.getIsSorted();

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button size="sm" variant="ghost" />}>
          <span>{title}</span>
          {sorted === "desc" ? <ArrowDownIcon data-icon="inline-end" /> : null}
          {sorted === "asc" ? <ArrowUpIcon data-icon="inline-end" /> : null}
          {sorted ? null : <ChevronsUpDownIcon data-icon="inline-end" />}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
              <ArrowUpIcon />
              Asc
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
              <ArrowDownIcon />
              Desc
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
              <EyeOffIcon />
              Hide
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export { DataTableColumnHeader };
