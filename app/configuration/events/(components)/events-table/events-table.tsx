import { Event, EventWithUsers } from "@/lib/events/types";
import { formatDateString } from "@/lib/utils/utils";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EventDetailsButton } from "./event-details-button";

export type EventsTableProps = React.ComponentProps<typeof Table> & {
  events?: EventWithUsers[];
  sortingUrls?: Partial<Record<keyof Event, string>>;
};

export function EventsTable(props: EventsTableProps) {
  const {
    events = [],
    sortingUrls,
    ...tableProps
  } = props;

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
    <Table {...tableProps}>
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
              {event.aggregate_id}
            </TableCell>
            <TableCell>
              {event.aggregate_type}
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
              <EventDetailsButton eventId={event.event_id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}