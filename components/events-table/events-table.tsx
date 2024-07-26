import { Event, EventWithUsers } from "@/lib/events/types";
import { formatDateString } from "@/lib/utils/utils";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { EventDetailsButton } from "./event-details-button";

export type EventsTableProps = React.ComponentProps<typeof Table> & {
  events?: EventWithUsers[];
  baseUrl?: string;
  sortingUrls?: Partial<Record<keyof Event, string>>;
};

export function EventsTable(props: EventsTableProps) {
  const {
    events = [],
    sortingUrls,
    ...tableProps
  } = props;

  return (
    <Table {...tableProps}>
      <TableHeader>
        <TableRow>
          <TableHead>
            {sortingUrls?.event_id ? (
              <Link className="hover:underline" href={sortingUrls.event_id}>
                Event ID
              </Link>
            ) : (
              "Event ID"
            )}
          </TableHead>
          <TableHead>
            {sortingUrls?.version_number ? (
              <Link className="hover:underline" href={sortingUrls.version_number}>
                Sequence Number
              </Link>
            ) : (
              "Sequence Number"
            )}
          </TableHead>
          <TableHead>
            {sortingUrls?.created_at ? (
              <Link className="hover:underline" href={sortingUrls.created_at}>
                Created At
              </Link>
            ) : (
              "Created At"
            )}
          </TableHead>
          <TableHead>
            {sortingUrls?.created_by ? (
              <Link className="hover:underline" href={sortingUrls.created_by}>
                Created By
              </Link>
            ) : (
              "Created By"
            )}
          </TableHead>
          <TableHead>
            {sortingUrls?.event_type ? (
              <Link className="hover:underline" href={sortingUrls.event_type}>
                Event Type
              </Link>
            ) : (
              "Event Type"
            )}
          </TableHead>
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