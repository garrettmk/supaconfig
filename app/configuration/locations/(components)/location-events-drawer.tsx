'use client';

import { Paginator } from "@/components/paginator";
import { Spinner } from "@/components/spinner";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { useEventsQuery, useEventsQueryInput } from "@/lib/queries/events";
import { type Location } from "@/types/models";
import { useEffect } from "react";


export type LocationEventsDrawerProps = {
  location?: Location;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
};

export function LocationEventsDrawer(props: LocationEventsDrawerProps) {
  const { location, isOpen , onOpenChange } = props;
  const { toast } = useToast();

  const [queryInput, { setInput, updateInput, resetInput }] = useEventsQueryInput({
    aggregateId: location?.id ?? ''
  });

  const { data, error, isFetching } = useEventsQuery({
    input: queryInput,
    enabled: Boolean(isOpen && queryInput.aggregateId),
  });

  useEffect(() => {
    if (!isOpen)
      setTimeout(resetInput, 300);
  }, [isOpen]);

  useEffect(() => {
    if (location)
      setInput({ aggregateId: location.id });
  }, [location]);


  useEffect(() => {
    if (error) {
      toast({
        title: 'Error fetching events',
        description: error.message,
        variant: 'destructive',
      });
    }
  }, [error])

  return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              Event Stream for {location?.name ?? 'Location'}
              {isFetching && <Spinner className="inline-block ml-2" />}
            </DrawerTitle>
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
              {data?.data?.map((event, index) => (
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
          {data?.data?.length ? (
            <Paginator
              className="mb-4"
              count={data?.count ?? 0}
              offset={data?.offset ?? 0}
              limit={data?.limit ?? 10}
              onUpdate={updateInput}
            />
          ) : isFetching ? (
            <div className="text-center text-gray-500 mb-4">
              Loading...
            </div>
          ) : (
            <div className="text-center text-gray-500 mb-4">
              No events found
            </div>
          )}
        </DrawerContent>
      </Drawer>
  );
}