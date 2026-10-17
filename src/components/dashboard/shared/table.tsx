'use client';

import {
  type ColumnSizingState,
  type ColumnVisibilityState,
  flexRender,
  RowData,
  SortingState,
  useTable,
} from '@tanstack/react-table';
import { useEffect, useRef, useState } from 'react';

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Columns3Icon,
  RotateCcwIcon,
  SearchIcon,
  XIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';

import {
  dashboardTableFeatures,
  DashboardColumnDef,
} from '@/components/dashboard/shared/table-features';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

// On wide screens, columns with a size get that width in pixels and can be dragged wider or narrower at their header's
// right edge; columns without one, like a title, share what's left, at least this much
const FLEXIBLE_MIN_WIDTH = 240;

type Layout = { sizing: ColumnSizingState; visibility: ColumnVisibilityState };

// What someone changed about a table's columns, kept in their browser. Storage can be unavailable, as in a private
// window, and then the table just starts as it's set up.
function readLayout(key: string): Partial<Layout> | null {
  try {
    const saved = JSON.parse(localStorage.getItem(key) ?? 'null');
    return saved && typeof saved === 'object' ? saved : null;
  } catch {
    return null;
  }
}

function saveLayout(key: string, layout: Layout) {
  try {
    if (
      Object.keys(layout.sizing).length === 0 &&
      Object.keys(layout.visibility).length === 0
    ) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(layout));
    }
  } catch {
    // Not kept then; the table still works
  }
}

export function DataTable<TData extends RowData & { id: string }>({
  columns,
  data,
  filterPlaceholder = 'Filter...',
  defaultSorting = [],
  noun = 'row',
  storageKey,
}: DataTableProps<TData> & {
  // Where the table remembers the column widths and hidden columns someone picked, e.g. "posts"
  storageKey: string;
  filterPlaceholder?: string;
  // What a row is, for the count under the table, e.g. "post" for "12 posts"
  noun?: string;
  // How the rows are sorted at first, shown on that column's header, e.g. [{ id: 'updatedAt', desc: true }]
  defaultSorting?: SortingState;
}) {
  const [sorting, setSorting] = useState<SortingState>(defaultSorting);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});
  const [columnVisibility, setColumnVisibility] =
    useState<ColumnVisibilityState>({});
  const [layoutLoaded, setLayoutLoaded] = useState(false);
  const layoutKey = `dashboard-table:${storageKey}`;

  // Whether part of the table is scrolled out of view under the pinned actions column, which then gets a background and
  // a shadow so the rows' ⋯ stay reachable and readable
  const frame = useRef<HTMLDivElement>(null);
  const [scrolledUnder, setScrolledUnder] = useState(false);
  useEffect(() => {
    const scroller = frame.current?.querySelector<HTMLElement>(
      '[data-slot="table-container"]',
    );
    if (!scroller) return;
    const update = () =>
      setScrolledUnder(
        scroller.scrollWidth - scroller.clientWidth - scroller.scrollLeft > 1,
      );
    update();
    const resized = new ResizeObserver(update);
    resized.observe(scroller);
    if (scroller.firstElementChild) resized.observe(scroller.firstElementChild);
    scroller.addEventListener('scroll', update, { passive: true });
    return () => {
      resized.disconnect();
      scroller.removeEventListener('scroll', update);
    };
  }, []);
  const pinned = (columnId: string) =>
    columnId === 'actions' &&
    cn(
      'sticky right-0 z-10',
      scrolledUnder &&
        'bg-card shadow-[-10px_0_12px_-10px_rgb(0_0_0/0.4)] group-hover/row:bg-[color-mix(in_oklab,var(--muted)_50%,var(--card))]',
    );

  // Read after the first render, which matches the server's, so the page doesn't change under React as it takes over
  useEffect(() => {
    const saved = readLayout(layoutKey);
    /* eslint-disable react-hooks/set-state-in-effect -- the saved layout only exists in the browser */
    if (saved?.sizing) setColumnSizing(saved.sizing);
    if (saved?.visibility) setColumnVisibility(saved.visibility);
    setLayoutLoaded(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [layoutKey]);

  useEffect(() => {
    if (!layoutLoaded) return;
    saveLayout(layoutKey, {
      sizing: columnSizing,
      visibility: columnVisibility,
    });
  }, [layoutKey, layoutLoaded, columnSizing, columnVisibility]);

  const table = useTable({
    features: dashboardTableFeatures,
    data,
    columns,
    getRowId: (row) => row.id,
    columnResizeMode: 'onChange',
    // Dragged narrower, a column stops where its header and a badge or date still fit; a column can ask for less
    defaultColumn: { minSize: 120 },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnSizingChange: setColumnSizing,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      globalFilter,
      columnSizing,
      columnVisibility,
    },
  });

  const visibleColumns = table.getVisibleLeafColumns();
  const hideable = table
    .getAllLeafColumns()
    .filter((column) => column.getCanHide() && column.columnDef.meta?.label);
  // Read from the columns as given: the table fills in a default size for every column
  const sizedIds = new Set(
    columns
      .filter((column) => column.size !== undefined)
      .map((column) =>
        'accessorKey' in column && column.accessorKey
          ? String(column.accessorKey)
          : column.id,
      ),
  );
  const hasSize = (column: { id: string }) => sizedIds.has(column.id);
  // Wide enough for every sized column and some room for the flexible ones; wider than the page, it scrolls sideways
  const minTableWidth =
    visibleColumns.filter(hasSize).reduce((sum, c) => sum + c.getSize(), 0) +
    (visibleColumns.some((column) => !hasSize(column))
      ? FLEXIBLE_MIN_WIDTH
      : 0);
  const changed =
    Object.keys(columnSizing).length > 0 ||
    Object.keys(columnVisibility).length > 0;

  const rowCount = table.getFilteredRowModel().rows.length;
  const pageCount = table.getPageCount();

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex items-center gap-2'>
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
        {hideable.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='outline'
                className='h-10 shrink-0'
                aria-label='Columns'
              >
                <Columns3Icon />
                <span className='hidden sm:inline'>Columns</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-52'>
              <DropdownMenuLabel>Show columns</DropdownMenuLabel>
              {hideable.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(checked) =>
                    column.toggleVisibility(!!checked)
                  }
                  // Stays open, so several can be picked in one go
                  onSelect={(event) => event.preventDefault()}
                >
                  {column.columnDef.meta?.label}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={!changed}
                onSelect={() => {
                  table.resetColumnVisibility(true);
                  table.resetColumnSizing(true);
                }}
              >
                <RotateCcwIcon />
                Reset columns
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div
        ref={frame}
        className='bg-card w-full overflow-hidden rounded-xl border'
      >
        <Table
          className='lg:min-w-(--table-min) lg:table-fixed'
          style={{ '--table-min': `${minTableWidth}px` } as React.CSSProperties}
        >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const sized = hasSize(header.column);
                  const resizable = sized && header.column.getCanResize();
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        'relative',
                        sized && 'lg:w-(--column-width)',
                        pinned(header.column.id),
                      )}
                      style={
                        sized
                          ? ({
                              '--column-width': `${header.getSize()}px`,
                            } as React.CSSProperties)
                          : undefined
                      }
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                      {resizable && (
                        // Drag to resize, double-click for the column's usual width. Mouse and touch only; Reset
                        // columns in the Columns menu undoes it for everyone.
                        <div
                          aria-hidden
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          onDoubleClick={() => header.column.resetSize()}
                          className='group/resize absolute inset-y-0 -right-1.5 z-10 hidden w-3 cursor-col-resize touch-none select-none lg:block'
                        >
                          <span
                            className={cn(
                              'bg-line-strong absolute inset-y-2 left-1/2 w-px -translate-x-1/2 opacity-0 transition-opacity group-hover/resize:opacity-100',
                              header.column.getIsResizing() &&
                                'bg-primary-text opacity-100',
                            )}
                          />
                        </div>
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
                <TableRow key={row.id} className='group/row'>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      // What doesn't fit a narrowed column is cut off at its edge rather than running into the next
                      className={cn(
                        cell.column.getCanResize() && 'lg:overflow-hidden',
                        pinned(cell.column.id),
                      )}
                    >
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
                  colSpan={visibleColumns.length}
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
