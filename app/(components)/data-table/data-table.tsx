"use client"

import {
  ColumnDef,
  flexRender,
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


export type DataTableColumn<TData, TValue = unknown> = ColumnDef<TData, TValue>;

export type DataTableProps<TData> = React.ComponentProps<typeof Table> & {
  table: ReturnType<typeof useReactTable<TData>>;
};


export function DataTable<TData>({
  className,
  table,
  ...tableProps
}: DataTableProps<TData>) {

  return (
    <Table className={className} {...tableProps}>
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
            <TableCell colSpan={999} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
