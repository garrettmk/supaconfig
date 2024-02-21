import { useState } from "react";
import { GetEventStreamInput, GetEventStreamResult, getEventStream } from "@/lib/actions/events";
import { QueryClient, UseQueryOptions, useQuery } from "@tanstack/react-query";

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