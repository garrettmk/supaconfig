import React from "react";
import { PaginationPerPage, PaginationPerPageProps } from "@/app/(components)/pagination-per-page";
import { type Table as ReactTable } from "@tanstack/react-table";

export type DataTablePaginationPerPageProps = Omit<PaginationPerPageProps, 'value' | 'onChange'> & {
  table: ReactTable<any>;
};

export function DataTablePaginationPerPage(props: DataTablePaginationPerPageProps) {
  const { table, ...paginationProps } = props;

  const {
    pagination: { pageSize },
  } = table.getState();

  return (
    <PaginationPerPage
      value={pageSize}
      onChange={table.setPageSize}
      {...paginationProps}
    />
  );
}