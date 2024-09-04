"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  TableOptions,
  useReactTable
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow
} from "@/app/(components)/table";
import { DataTableSortableHead } from "./data-table-sortable-head";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../pagination";
import clsx from "clsx";
import { clamp, has, range } from "@/app/(lib)/utils/utils";
import { Button } from "../button";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../select";


export type DataTableColumn<TData, TValue = unknown> = ColumnDef<TData, TValue>;

export type DataTableProps<TData, TValue = unknown> = Omit<TableOptions<TData>, 'getCoreRowModel'> & {
  className?: string
};


export function DataTable<TData, TValue>({
  columns,
  className,
  ...tableOptions
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...tableOptions,
  });

  const {
    pagination: { pageIndex, pageSize },
  } = table.getState();

  const maxPages = 4;
  const currentPage = pageIndex + 1;
  const totalPages = table.getPageCount();

  const displayedRange = range(
    clamp(1, currentPage - Math.floor(maxPages / 2), currentPage),
    clamp(currentPage, currentPage + Math.floor(maxPages / 2), totalPages)
  );

  const displayPreviousEllipsis = displayedRange[0] >= 2;
  const displayNextEllipsis = displayedRange[displayedRange.length - 1] < totalPages;

  return (
    <div>
      <Table className={className}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <DataTableSortableHead
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    canSort={header.column.getCanSort()}
                    isSorted={header.column.getIsSorted()}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )
                    }
                  </DataTableSortableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {has(tableOptions, 'pageCount') && (
        <div className="flex flex-row justify-center items-center gap-6 mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button
                  variant="ghost"
                  onClick={table.previousPage}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronLeftIcon className="mr-1"/>
                  Previous
                </Button>
              </PaginationItem>
              {displayPreviousEllipsis && (
                <PaginationItem>
                  <PaginationEllipsis/>
                </PaginationItem>
              )}
              {displayedRange.map((page) => (
                <PaginationItem key={page}>
                  <Button
                    variant={currentPage === page ? "outline" : "ghost"}
                    onClick={() => table.setPageIndex(page - 1)}
                  >
                    {page}
                  </Button>
                </PaginationItem>
              ))}
              {displayNextEllipsis && (
                <PaginationItem>
                  <PaginationEllipsis/>
                </PaginationItem>
              )}
              <PaginationItem>
                <Button
                  variant="ghost"
                  onClick={table.nextPage}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                  <ChevronRightIcon className="ml-1"/>
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          <Select
            value={pageSize + ''}
            onValueChange={(value) => table.setPageSize(parseInt(value))}
          >
            <SelectTrigger className="w-auto px-4">
              {pageSize}&nbsp;<span className="text-muted-foreground">per page</span>
            </SelectTrigger>
            <SelectContent>
              {[2, 10, 25, 50, 100].map((size) => (
                <SelectItem
                  key={size}
                  value={size + ''}
                >
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
