import { useState } from "react";
import { GetEventResult, GetEventStreamInput, GetEventStreamResult, getEvent, getEventStream } from "./actions";
import { QueryClient, UseQueryOptions, useQuery } from "@tanstack/react-query";

/**
 * Get the event stream for a particular aggregate
 * 
 * @param defaultValue 
 * @returns 
 */

export function useEventsQueryInput(defaultValue?: GetEventStreamInput) {
  const [input, setInput] = useState<GetEventStreamInput>(defaultValue ?? { 
    aggregateId: ''
  });

  const updateInput = (newInput: Partial<GetEventStreamInput>) => {
    setInput((old) => ({
      ...old,
      ...newInput
    }));
  };

  const resetInput = (options?: Partial<GetEventStreamInput>) => {
    setInput({ 
      aggregateId: '', 
      ...defaultValue, 
      ...options
    });
  };

  return [
    input,
    {
      setInput,
      updateInput,
      resetInput
    }
  ] as const;
}


export type UseEventsQueryInput = Omit<UseQueryOptions<GetEventStreamResult>, 'queryKey' | 'queryFn'> & {
  input: GetEventStreamInput;
}

export function useEventsQuery(input: UseEventsQueryInput) {
  const { input: queryInput, ...useQueryOptions } = input;

  return useQuery({
    queryKey: ['events', queryInput.aggregateId, queryInput] as const,
    queryFn: async () => getEventStream(queryInput),
    placeholderData: (previousData, previousQuery) => {
      if (previousQuery?.queryKey[1] !== queryInput.aggregateId)
        return undefined;
      return previousData;
    },
    ...useQueryOptions
  });
}

useEventsQuery.invalidate = (queryClient: QueryClient, aggregateId: string) => {
  queryClient.invalidateQueries({
    queryKey: aggregateId ? ['events', aggregateId] : ['events']
  });
}



/**
 * Get a single event by its ID
 */


export type UseEventQueryInput = Omit<UseQueryOptions<GetEventResult>, 'queryKey' | 'queryFn'> & {
  eventId: string;
}

export function useEventQuery(input: UseEventQueryInput) {
  const { eventId, ...useQueryOptions } = input;

  return useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => getEvent({ eventId }),
    ...useQueryOptions
  });
}

useEventQuery.invalidate = (queryClient: QueryClient, eventId: string) => {
  queryClient.invalidateQueries({
    queryKey: eventId ? ['event', eventId] : ['event']
  });
}