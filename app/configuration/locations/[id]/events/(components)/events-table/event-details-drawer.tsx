"use client";

import { Button } from "@/app/(components)/button";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/app/(components)/drawer";
import { Cross1Icon } from "@radix-ui/react-icons";
import { Suspense } from "react";
import { EventDetails } from "@/app/(components)/event-details";
import { useUrlState } from "@/app/(lib)/utils/use-url-state";

export type EventDetailsDrawerProps = {
  eventId?: string;
}

export function EventDetailsDrawer(props: EventDetailsDrawerProps) {
  const { eventId } = props;
  const [, setDetailsId] = useUrlState('details');
  const isOpen = !!eventId;

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setDetailsId(null);
    }
  };
  const handleClose = () => setDetailsId(null);


  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <DrawerHeader className="flex flex-row items-center justify-between">
          <DrawerTitle>
            Event Details
          </DrawerTitle>
          <Button 
            type="button"
            size="icon"
            onClick={handleClose}
          >
            <Cross1Icon/>
          </Button>
        </DrawerHeader>
        <Suspense fallback={<div>Loading...</div>}>
          <EventDetails 
            className="p-4 overflow-auto max-h-[75vh]"
            eventId={eventId}
          />
        </Suspense>
        <DrawerFooter>

        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}