'use client';

import { DataTable, DataTableColumn, DataTableProps, useTablePaginationNavigation, useTableSortingNavigation } from "@/app/(components)/data-table";
import { DateStringCell, FilterableCell } from "@/app/(components)/data-table/cells";
import { DataTablePaginationPages } from "@/app/(components)/data-table/controls/data-table-pagination-pages";
import { DataTablePaginationPerPage } from "@/app/(components)/data-table/controls/data-table-pagination-per-page";
import { truncate } from "@/app/(lib)/utils/utils";
import { GetEventsResult } from "@/app/configuration/events/(lib)/actions";
import { User, type EventWithUsers } from "@/app/configuration/events/(lib)/types";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { TableControl, TableControlLabel, ColumnFilterSearch, ColumnFilterSelect, ColumnFilterUUID } from "@/app/(components)/data-table/controls";
import { Separator } from "@/app/(components)/separator";


const columns: DataTableColumn<EventWithUsers>[] = [
  {
    accessorKey: 'event_id',
    header: 'Event ID',
    enableSorting: true,
  },
  {
    accessorKey: 'event_type',
    header: 'Event Type',
    enableSorting: true,
    cell: ({ getValue }) => (
      <FilterableCell
        columnKey="event_type"
        value={getValue() as string}
      />
    )
  },
  {
    accessorKey: 'aggregate_type',
    header: 'Aggregate Type',
    enableSorting: true,
    cell: ({ getValue }) => (
      <FilterableCell
        columnKey="aggregate_type"
        value={getValue() as string}
      />
    )
  },
  {
    accessorKey: 'aggregate_id',
    header: 'Aggregate ID',
    enableSorting: true,
    cell: ({ getValue }) => (
      <FilterableCell
        columnKey="aggregate_id"
        value={getValue() as string}
        as="pre"
      >
        {truncate(getValue() as string, 8)}
      </FilterableCell>
    )
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
    cell: ({ getValue }) => {
      const user = getValue() as User | null;

      return user ? (
        <FilterableCell
          columnKey="created_by"
          value={user.name}
        >
          {user.name}
        </FilterableCell>
      ) : null
    }
  }
];


export type EventsTableProps = Omit<DataTableProps<EventWithUsers>, 'table'> & {
  getEventsResult: GetEventsResult;
};


export function EventsTable(props: EventsTableProps) {
  const { getEventsResult, ...tableProps } = props;
  const { data, pagination, sorting } = getEventsResult;

  const [sortingState, setSortingState] = useTableSortingNavigation(sorting);
  const [paginationState, setPaginationState] = useTablePaginationNavigation(pagination);

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    state: {
      sorting: sortingState,
      pagination: paginationState
    },
    onSortingChange: setSortingState,
    onPaginationChange: setPaginationState,
    pageCount: Math.ceil(pagination.count / pagination.limit)
  });

  return (
    <div>
      <div className="mb-12 grid grid-cols-1 md:grid-cols-[minmax(0,_1fr)_minmax(0,_1fr)_1px_minmax(0,_1fr)] md:grid-rows-2 gap-4">
        <TableControl>
          <TableControlLabel>
            Event Type:
          </TableControlLabel>
          <ColumnFilterSelect
            columnKey="event_type"
            options={[
              { value: 'update', label: 'Update' },
              { value: 'create', label: 'Create' },
              { value: 'delete', label: 'Delete' }
            ]}
          />
        </TableControl>

        <TableControl>
          <TableControlLabel>
            Aggregate Type:
          </TableControlLabel>
          <ColumnFilterSelect
            columnKey="aggregate_type"
            options={[
              { value: 'location', label: 'Location' }
            ]}
          />
        </TableControl>

        <Separator
          orientation="vertical"
          className="hidden md:block h-auto translate-y-[.25rem] row-span-2"
        />

        <TableControl>
          <TableControlLabel>
            Page:
          </TableControlLabel>
          <DataTablePaginationPages table={table} />
        </TableControl>

        <TableControl>
          <TableControlLabel>
            Aggregate ID:
          </TableControlLabel>
          <ColumnFilterUUID
            columnKey='aggregate_id'
          />
        </TableControl>

        <TableControl>
          <TableControlLabel>
            Created By:
          </TableControlLabel>
          <ColumnFilterSearch
            columnKey='created_by'
          />
        </TableControl>

        <TableControl>
          <TableControlLabel>
            Page Size:
          </TableControlLabel>
          <DataTablePaginationPerPage className="w-full" table={table} />
        </TableControl>
      </div>
      <DataTable
        table={table}
        {...tableProps}
      />
    </div>
  );
}



