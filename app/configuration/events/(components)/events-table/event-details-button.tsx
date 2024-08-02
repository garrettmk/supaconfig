"use client";

import { Event } from "@/lib/events/types";
import { Button, ButtonProps } from "@/components/ui/button";
import { useUrlState } from "@/lib/utils/use-url-state";

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