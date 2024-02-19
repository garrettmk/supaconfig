"use client";

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { useEventStreamQuery } from "@/lib/queries";
import { Database } from "@/types/supabase";
import { type Location } from "@/types/locations";

export type DatabaseEvent = Database['public']['Tables']['events']['Row'];

export type LocationEventsDrawerProps = {
  location?: Location;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
};

export function LocationEventsDrawer(props: LocationEventsDrawerProps) {
  const { location, isOpen , onOpenChange } = props;
  const { toast } = useToast();
  const { data, error, isFetching } = useEventStreamQuery({ 
    enabled: isOpen && Boolean(location),
    aggregateId: location?.id ?? undefined 
  });

  return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Event Stream for {location?.name ?? 'Location'}</DrawerTitle>
          </DrawerHeader>
          <Table className="mb-4">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Event ID</TableHead>
                <TableHead>Sequence Number</TableHead>
                <TableHead>Event Type</TableHead>
                <TableHead className="pr-4">Event Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data.map((event, index) => (
                <TableRow key={index}>
                  <TableCell className="pl-4">{event.event_id}</TableCell>
                  <TableCell>{event.version_number}</TableCell>
                  <TableCell>
                    <pre>
                      {event.event_type}
                    </pre>
                  </TableCell>
                  <TableCell className="pr-4">
                    <pre>
                      {JSON.stringify(event.event_data)}
                    </pre>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DrawerContent>
      </Drawer>
  );
}