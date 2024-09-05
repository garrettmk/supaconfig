'use client';

import { DataTable, DataTableColumn, DataTableProps, useTablePaginationNavigation, useTableSortingNavigation } from "@/app/(components)/data-table";
import { formatDateString } from "@/app/(lib)/utils/utils";
import { type Location } from "@/app/configuration/locations/(lib)/types";
import { GetLocationsResult } from "../(lib)/actions";


const columns: DataTableColumn<Location>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    enableSorting: true
  },
  {
    accessorKey: 'name',
    header: 'Name',
    enableSorting: true,
  },
  {
    accessorKey: 'version',
    header: 'Version',
    enableSorting: true
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    enableSorting: true,
    cell: ({ getValue }) => formatDateString(getValue() as string)
  },
  {
    accessorKey: 'updated_at',
    header: 'Updated At',
    enableSorting: true,
    cell: ({ getValue }) => formatDateString(getValue() as string)
  }
];

export type LocationsTableProps = Omit<DataTableProps<Location>, 'columns' | 'data'> & {
  getLocationsResult: GetLocationsResult;
}

export function LocationsTable(props: LocationsTableProps) {
  const { getLocationsResult, ...tableProps } = props;
  const { sorting, pagination, data } = getLocationsResult;

  const [sortingState, setSortingState] = useTableSortingNavigation(sorting);
  const [paginationState, setPaginationState] = useTablePaginationNavigation(pagination);

  return (
    <DataTable
      manualSorting
      manualPagination
      data={data}
      columns={columns}
      pageCount={Math.ceil(pagination.count / pagination.limit)}
      onSortingChange={setSortingState}
      onPaginationChange={setPaginationState}
      state={{
        sorting: sortingState,
        pagination: paginationState
      }}
      {...tableProps}
    />
  );
}