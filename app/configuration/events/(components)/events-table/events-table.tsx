'use client';

import { DataTable, DataTableColumn, DataTableProps, useTablePaginationNavigation, useTableSortingNavigation } from "@/app/(components)/data-table";
import { GetEventsResult } from "@/app/configuration/events/(lib)/actions";
import { User, type EventWithUsers } from "@/app/configuration/events/(lib)/types";
import { DateStringCell, UUIDCell } from "@/app/(components)/data-table/cells";


const columns: DataTableColumn<EventWithUsers>[] = [
  {
    accessorKey: 'event_id',
    header: 'Event ID',
    enableSorting: true,
  },
  {
    accessorKey: 'event_type',
    header: 'Event Type',
    enableSorting: true
  },
  {
    accessorKey: 'aggregate_type',
    header: 'Aggregate Type',
    enableSorting: true
  },
  {
    accessorKey: 'aggregate_id',
    header: 'Aggregate ID',
    enableSorting: true,
    cell: ({ getValue }) => <UUIDCell value={getValue() as string} />
  },
  {
    accessorKey: 'version_number',
    header: 'Version Number',
    enableSorting: true
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    enableSorting: true,
    cell: ({ getValue }) => <DateStringCell value={getValue() as string} />
  },
  {
    accessorKey: 'created_by',
    header: 'Created By',
    enableSorting: true,
    cell: ({ getValue }) => (getValue() as User | null)?.name
  }
];


export type EventsTableProps = Omit<DataTableProps<EventWithUsers>, 'columns' | 'data'> & {
  getEventsResult: GetEventsResult;
};


export function EventsTable(props: EventsTableProps) {
  const { getEventsResult, ...tableProps } = props;
  const { data, pagination, sorting } = getEventsResult;

  const [sortingState, setSortingState] = useTableSortingNavigation(sorting);
  const [paginationState, setPaginationState] = useTablePaginationNavigation(pagination);

  return (
    <DataTable
      data={data}
      manualSorting
      manualPagination
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



