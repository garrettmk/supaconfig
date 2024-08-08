"use client";

import { Event } from "@/app/configuration/events/(lib)/types";
import { Button, ButtonProps } from "@/app/(components)/button";
import { useUrlState } from "@/app/(lib)/utils/use-url-state";

export type EventDetailsButtonProps = Omit<ButtonProps, 'onClick'> & {
  eventId: Event['event_id'];
}

export function EventDetailsButton({ eventId, ...buttonProps }: EventDetailsButtonProps) {
  const [, setDetailsId] = useUrlState('details');

  return (
    <Button 
      variant="secondary" 
      onClick={() => setDetailsId(eventId.toString())}
      {...buttonProps}
    >
      View Data
    </Button>
  );
}