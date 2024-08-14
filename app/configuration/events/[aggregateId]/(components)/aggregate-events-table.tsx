import { Event, EventWithUsers } from "@/app/configuration/events/(lib)/types";
import { formatDateString } from "@/app/(lib)/utils/utils";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/(components)/table";
import { EventDetailsButton } from "../../(components)/events-table/event-details-button";
import { usePaginationSearchParams, pickPaginationResult, usePaginationUrls } from "@/app/(lib)/pagination";
import { useSortingSearchParams, pickSortingResult, useSortingUrls } from "@/app/(lib)/sorting";
import { getAggregateEvents } from "../(lib)/actions";
import { SsrPagination } from "@/app/(components)/ssr-pagination";
import { Button } from "@/app/(components)/button";
import { makeUrl } from "@/app/(lib)/utils/url";

export type AggregateEventsTableProps = React.ComponentProps<typeof Table> & {
  aggregateId: EventWithUsers['aggregate_id'];
  searchParams?: Record<string, string>;
};

export async function AggregateEventsTable(props: AggregateEventsTableProps) {
  const {
    aggregateId,
    searchParams = {},
    ...tableProps
  } = props;

  const paginationInput = usePaginationSearchParams(searchParams);
  const sortingInput = useSortingSearchParams(searchParams);

  const result = await getAggregateEvents({ aggregateId, ...paginationInput, ...sortingInput });
  const events = result.data;
  const paginationResult = pickPaginationResult(result);
  const sortingResult = pickSortingResult(result);

  const sortingUrls = useSortingUrls({
    keys: ['event_id', 'version_number', 'created_at', 'created_by', 'event_type'],
    searchParams,
    sorting: sortingResult
  });

  const paginationUrls = usePaginationUrls({
    searchParams,
    pagination: paginationResult
  });

  const makeDetailsUrl = (event: Pick<Event, 'event_id'>) => makeUrl({
    searchParams,
    set: { details: event.event_id }
  })

  const SortableTableHead = ({ url, children, ...props }: React.ComponentProps<typeof TableHead> & { url?: string }) => (
    <TableHead {...props}>
      {url ? (
        <Link className="hover:underline" href={url}>
          {children}
        </Link>
      ) : (
        children
      )}
    </TableHead>
  );

  return (
    <>
    <Table {...tableProps}>
      <TableHeader>
        <TableRow>
          <SortableTableHead url={sortingUrls?.event_id}>
            Event ID
          </SortableTableHead>
          <SortableTableHead url={sortingUrls?.version_number}>
            Version Number
          </SortableTableHead>
          <SortableTableHead url={sortingUrls?.created_at}>
            Created At
          </SortableTableHead>
          <SortableTableHead url={sortingUrls?.created_by}>
            Created By
          </SortableTableHead>
          <SortableTableHead url={sortingUrls?.event_type}>
            Event Type
          </SortableTableHead>
          <TableHead>
            Data
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events?.map(event => (
          <TableRow key={event.event_id}>
            <TableCell>
              {event.event_id}
            </TableCell>
            <TableCell>
              {event.version_number}
            </TableCell>
            <TableCell>
              {formatDateString(event.created_at)}
            </TableCell>
            <TableCell>
              {event.created_by?.name}
            </TableCell>
            <TableCell>
              {event.event_type}
            </TableCell>
            <TableCell>
              <Link href={makeDetailsUrl(event)}>
                <Button variant="secondary">
                  View Details
                </Button>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    <SsrPagination
        className="mt-4"
        {...paginationUrls}
      />
    </>
  );
}