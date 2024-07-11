"use client";

import { type Event } from "@/types/models";
import { DataTable } from "../data-table";
import { useEventsTableColumns } from './events-table-columns';
import { useState } from "react";
import { EventDrawer } from "../event-drawer";

export type EventsTableProps = {
  events: Event[];
};

export function EventsTable(props: EventsTableProps) {
  const { events } = props;
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>();
  
  const [isViewingEvent, setisViewingEvent] = useState(false);
  const viewEvent = (event: Event) => {
    setSelectedEvent(event);
    setisViewingEvent(true);
  };

  const columns = useEventsTableColumns({ viewEvent });

  return (
    <div>
      <DataTable
        columns={columns}
        data={events}
      />
      <EventDrawer
        event={selectedEvent}
        isOpen={isViewingEvent}
        onOpenChange={setisViewingEvent}
      />
    </div>
  );
}