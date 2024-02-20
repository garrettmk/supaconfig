'use client';

import { Paginator } from "@/components/paginator";
import { Spinner } from "@/components/spinner";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { GetEventStreamInput, getEventStream } from "@/lib/actions/events";
import { type PaginationInput } from "@/lib/pagination";
import { type Location } from "@/types/models";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";


export type LocationEventsDrawerProps = {
  location?: Location;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
};

export function LocationEventsDrawer(props: LocationEventsDrawerProps) {
  const { location, isOpen , onOpenChange } = props;
  const { toast } = useToast();

  const [queryInput, setQueryInput] = useState<GetEventStreamInput>({
    aggregateId: location?.id ?? '',
    offset: 0,
    limit: 10
  });

  const updatePagination = (pagination: PaginationInput) => setQueryInput((old) =>({
    ...old,
    ...pagination
  }));

  useEffect(() => {
    if (!isOpen)
      setTimeout(() => updatePagination({ offset: 0 }), 300);
  }, [isOpen]);

  useEffect(() => {
    if (location)
      setQueryInput((old) => ({ ...old, aggregateId: location.id }));
  }, [location]);

  const { data, error, isFetching } = useQuery({
    enabled: Boolean(isOpen && queryInput.aggregateId),
    queryKey: ['events', queryInput.aggregateId, queryInput] as const,
    queryFn: async () => getEventStream(queryInput),
    placeholderData: (previousData, previousQuery) => {
      if (previousQuery?.queryKey[1] !== location?.id)
        return undefined;
      return previousData;
    }
  });

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
              onUpdate={updatePagination}
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