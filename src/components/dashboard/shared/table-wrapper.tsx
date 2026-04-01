'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';

import { Pagination } from '@/components/dashboard/shared/pagination';
import { BaseTable } from '@/components/dashboard/shared/table-base';
import { Input } from '@/components/ui/input';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function TableWrapper<TData, TValue>({
  columns,
  data,
  hasError = false,
  filterPlaceholder = 'Filter...',
}: DataTableProps<TData, TValue> & { filterPlaceholder?: string; hasError?: boolean }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
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

      <BaseTable table={table} columns={columns.length} hasError={hasError} />

      <Pagination table={table} />
    </div>
  );
}
