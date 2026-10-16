'use client';

import {
  flexRender,
  RowData,
  SortingState,
  useTable,
} from '@tanstack/react-table';
import { useState } from 'react';

import { ErrorToast } from '@/components/common/error-toast';
import {
  dashboardTableFeatures,
  DashboardColumnDef,
} from '@/components/dashboard/shared/table-features';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  hasError = false,
  filterPlaceholder = 'Filter...',
}: DataTableProps<TData> & {
  filterPlaceholder?: string;
  hasError?: boolean;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
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

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex text-center md:justify-start md:text-start'>
        <Input
          placeholder={filterPlaceholder}
          value={globalFilter ?? ''}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className='max-w-sm'
        />
      </div>

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
                  {hasError && (
                    <ErrorToast
                      title='Failed to load data.'
                      description='Please try again later.'
                    />
                  )}
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className='flex flex-col justify-between gap-4 xl:flex-row xl:items-center'>
        {/* Left Side: Row Count / Selection Info */}
        <div className='text-muted-foreground text-sm'>
          {table.getFilteredRowModel().rows.length} total row(s) found.
        </div>

        {/* Right Side: Pagination Controls */}
        <div className='flex flex-col gap-2 space-x-6 lg:flex-row lg:items-center lg:space-x-8'>
          {/* Items Per Page Selector */}
          <div className='flex items-center gap-2'>
            <p className='text-sm font-medium'>Rows per page</p>
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
                {[5, 10, 15, 20, 25, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Page Counter */}
          <div className='flex items-center text-sm font-medium'>
            Page {table.state.pagination.pageIndex + 1} of{' '}
            {table.getPageCount() || 1}
          </div>

          {/* Previous/Next Buttons */}
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
