'use client';

import {
  flexRender,
  RowData,
  SortingState,
  useTable,
} from '@tanstack/react-table';
import { useState } from 'react';

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
  XIcon,
} from 'lucide-react';

import {
  dashboardTableFeatures,
  DashboardColumnDef,
} from '@/components/dashboard/shared/table-features';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Rows need an id: React keys them by it, so per-row state stays with its row when the data reorders
interface DataTableProps<TData extends RowData & { id: string }> {
  columns: DashboardColumnDef<TData>[];
  data: TData[];
}

export function DataTable<TData extends RowData & { id: string }>({
  columns,
  data,
  filterPlaceholder = 'Filter...',
  defaultSorting = [],
  noun = 'row',
}: DataTableProps<TData> & {
  filterPlaceholder?: string;
  // What a row is, for the count under the table, e.g. "post" for "12 posts"
  noun?: string;
  // How the rows are sorted at first, shown on that column's header, e.g. [{ id: 'updatedAt', desc: true }]
  defaultSorting?: SortingState;
}) {
  const [sorting, setSorting] = useState<SortingState>(defaultSorting);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useTable({
    features: dashboardTableFeatures,
    data,
    columns,
    getRowId: (row) => row.id,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      globalFilter,
    },
  });

  const rowCount = table.getFilteredRowModel().rows.length;
  const pageCount = table.getPageCount();

  return (
    <div className='flex flex-col gap-3'>
      {/* Like the search on the projects and posts pages, at the height of a button */}
      <label className='bg-card focus-within:border-primary-text/60 focus-within:ring-primary/20 flex h-10 w-full max-w-sm items-center gap-2.5 rounded-lg border px-3 transition-[border-color,box-shadow] focus-within:ring-3'>
        <SearchIcon
          aria-hidden
          className='text-muted-foreground size-4 shrink-0'
        />
        <span className='sr-only'>{filterPlaceholder}</span>
        <input
          type='search'
          placeholder={filterPlaceholder}
          value={globalFilter ?? ''}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className='placeholder:text-muted-foreground h-full min-w-0 flex-1 bg-transparent text-[13px] outline-none [&::-webkit-search-cancel-button]:hidden'
        />
        {globalFilter && (
          <button
            type='button'
            aria-label='Clear search'
            onClick={() => setGlobalFilter('')}
            className='text-muted-foreground hover:text-foreground hover:bg-muted -mr-1.5 grid size-7 place-items-center rounded-md transition-colors'
          >
            <XIcon className='size-4' />
          </button>
        )}
      </label>

      <div className='bg-card w-full overflow-hidden rounded-xl border'>
        <Table className='lg:table-fixed'>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-12 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className='text-muted-foreground flex flex-wrap items-center justify-between gap-x-6 gap-y-3 text-[13px]'>
        <p role='status'>
          {rowCount} {rowCount === 1 ? noun : `${noun}s`}
        </p>

        <div className='flex flex-wrap items-center gap-x-5 gap-y-3'>
          <label className='flex items-center gap-2'>
            Rows
            <Select
              value={`${table.state.pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger
                size='sm'
                className='w-16'
                aria-label='Rows per page'
              >
                <SelectValue placeholder={table.state.pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side='top'>
                {[10, 20, 50, 100].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>

          {pageCount > 1 && (
            <div className='flex items-center gap-2'>
              <span className='tabular-nums'>
                Page {table.state.pagination.pageIndex + 1} of {pageCount}
              </span>
              <Button
                variant='outline'
                size='icon-sm'
                aria-label='Previous page'
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeftIcon />
              </Button>
              <Button
                variant='outline'
                size='icon-sm'
                aria-label='Next page'
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRightIcon />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
