'use client';

import { DataTable, DataTableColumn, DataTableProps, useTablePaginationNavigation, useTableSortingNavigation } from "@/app/(components)/data-table";
import { formatDateString } from "@/app/(lib)/utils/utils";
import { type Location } from "@/app/configuration/locations/(lib)/types";
import { GetLocationsResult } from "../(lib)/actions";
import { DateStringCell, UUIDCell } from "@/app/(components)/data-table/cells";
import { Button } from "@/app/(components)/button";
import Link from "next/link";


const columns: DataTableColumn<Location>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    enableSorting: true,
    cell: ({ getValue }) => <UUIDCell value={getValue() as string}/>
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
    accessorKey: 'updated_at',
    header: 'Updated At',
    enableSorting: true,
    cell: ({ getValue }) => <DateStringCell value={getValue() as string}/>
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <Link href={`/configuration/locations/${row.original.id}`}>
        <Button variant="secondary">
          Edit
        </Button>
      </Link>
    )
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