import {
  columnFilteringFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
  type ColumnDef,
  type RowData,
} from '@tanstack/react-table';

// What a column says about itself beyond what the table needs: its name in the Columns menu, for columns that can be
// hidden there
interface DashboardColumnMeta {
  label?: string;
}

// What the dashboard tables can do: sort by a column, search all columns, page through rows, and show, hide and resize
// columns. The sort functions are the ones a column picks on its own for text, text with numbers, and dates.
export const dashboardTableFeatures = tableFeatures({
  columnMeta: {} as DashboardColumnMeta,
  columnFilteringFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  globalFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    datetime: sortFn_datetime,
    text: sortFn_text,
  },
});

export type DashboardColumnDef<
  TData extends RowData,
  TValue = unknown,
> = ColumnDef<typeof dashboardTableFeatures, TData, TValue>;
