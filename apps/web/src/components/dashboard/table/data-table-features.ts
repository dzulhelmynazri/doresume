import {
  createPaginatedRowModel,
  createSortedRowModel,
  metaHelper,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_text,
  tableFeatures,
} from "@tanstack/react-table";

export const features = tableFeatures({
  columnMeta: metaHelper<{ className?: string; label?: string }>(),
  paginatedRowModel: createPaginatedRowModel(),
  rowPaginationFeature,
  rowSortingFeature,
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    basic: sortFn_basic,
    text: sortFn_text,
  },
  sortedRowModel: createSortedRowModel(),
});

export type DataTableFeatures = typeof features;
