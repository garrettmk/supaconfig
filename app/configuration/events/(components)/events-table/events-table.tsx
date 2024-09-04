'use client';

import { DataTable, DataTableColumn, DataTableProps, useTablePaginationNavigation, useTableSortingNavigation } from "@/app/(components)/data-table";
import { formatDateString } from "@/app/(lib)/utils/utils";
import { GetEventsResult } from "@/app/configuration/events/(lib)/actions";
import { type EventWithUsers } from "@/app/configuration/events/(lib)/types";


const columns: DataTableColumn<EventWithUsers>[] = [
  {
    accessorKey: 'event_id',
    header: 'Event ID',
    enableSorting: true
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
    enableSorting: true
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
    cell: ({ getValue }) => formatDateString(getValue() as string)
  },
  {
    accessorKey: 'created_by',
    header: 'Created By',
    enableSorting: true
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
    <div>
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
    </div>
  );
}



