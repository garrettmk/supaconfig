import { getEvent } from "@/app/configuration/events/(lib)/actions";
import { formatDateString } from "@/app/(lib)/utils/utils";
import clsx from "clsx";
import { Table, TableBody, TableCell, TableHead, TableRow } from "./table";

export type EventDetailsProps = React.ComponentProps<'div'> & {
  eventId?: string;
}

export async function EventDetails(props: EventDetailsProps) {
  const { eventId, ...divProps } = props;

  const getEventResult = eventId ? await getEvent({ eventId: eventId }) : undefined;
  const event = getEventResult?.data;

  return (
    <div {...divProps}>
      <Table>
        <TableBody>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableCell>{event?.event_id}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead>Sequence Number</TableHead>
            <TableCell>{event?.version_number}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead>Created At</TableHead>
            <TableCell>{formatDateString(event?.created_at)}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead>Created By</TableHead>
            <TableCell>{event?.created_by?.name}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead>Aggregate ID</TableHead>
            <TableCell>{event?.aggregate_id}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead>Aggregate Type</TableHead>
            <TableCell>{event?.aggregate_type}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead>Event Type</TableHead>
            <TableCell>{event?.event_type}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div>
        <h2 className={clsx('text-md font-semibold mt-8 mb-6')}>Event Data</h2>
        <pre>
          {JSON.stringify(event?.event_data, null, 2)}
        </pre>
      </div>
    </div>
  );
}