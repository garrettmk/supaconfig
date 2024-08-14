import { SsrPagination } from "@/app/(components)/ssr-pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/(components)/table";
import { usePaginationUrls } from "@/app/(lib)/pagination";
import { useSortingUrls } from "@/app/(lib)/sorting";
import { getFromSearchParams, parseAsInteger, parseAsStringEnum } from "@/app/(lib)/utils/search-params";
import { formatDateString } from "@/app/(lib)/utils/utils";
import { Event } from "@/app/configuration/events/(lib)/types";
import Link from "next/link";
import { getEvents, GetEventsInput } from "../../(lib)/actions";
import { EventDetailsButton } from "./event-details-button";

const sortableFields: (keyof Event)[] = [
  'event_id',
  'event_type',
  'aggregate_type',
  'aggregate_id',
  'version_number',
  'created_at',
  'created_by'
];

export type EventsTableProps = React.ComponentProps<'div'> & {
  searchParams?: Record<string, string>
};

export async function EventsTable(props: EventsTableProps) {
  const {
    searchParams = {},
    ...divProps
  } = props;

  const getEventsInput: GetEventsInput = getFromSearchParams(searchParams, {
    offset: parseAsInteger.withDefault(0),
    limit: parseAsInteger.withDefault(10),
    sortKey: parseAsStringEnum(sortableFields).withDefault('event_id'),
    sortDirection: parseAsStringEnum(['asc', 'desc']).withDefault('desc')
  });

  const { data: events, pagination, sorting } = await getEvents(getEventsInput);

  const sortingUrls = useSortingUrls({
    keys: sortableFields,
    searchParams,
    sorting
  });

  const paginationUrls = usePaginationUrls({
    searchParams,
    pagination
  });

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
    <div {...divProps}>
      <Table>
        <TableHeader>
          <TableRow>
            <SortableTableHead url={sortingUrls?.event_id}>
              Event ID
            </SortableTableHead>
            <SortableTableHead url={sortingUrls?.aggregate_id}>
              Aggregate ID
            </SortableTableHead>
            <SortableTableHead url={sortingUrls?.aggregate_type}>
              Aggregate Type
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
          {events.map(event => (
            <TableRow key={event.event_id}>
              <TableCell>
                {event.event_id}
              </TableCell>
              <TableCell>
                <Link
                  className="hover:underline"
                  href={`/configuration/events/${event.aggregate_id}`}
                >
                  {event.aggregate_id}
                </Link>
              </TableCell>
              <TableCell>
                {event.aggregate_type}
              </TableCell>
              <TableCell>
                <Link
                  className="hover:underline"
                  href={`/configuration/events/${event.aggregate_id}?version=${event.version_number}`}
                >
                  {event.version_number}
                </Link>
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
                <EventDetailsButton eventId={event.event_id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <SsrPagination
        className="mt-4"
        {...paginationUrls}
      />
    </div>
  );
}