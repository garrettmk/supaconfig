import { PaginatedResult, PaginationInput } from "@/types/queries";
import { Database } from "@/types/supabase";
import { supabase } from "@/utils/supabase/client";
import { UseQueryResult, useQuery } from "@tanstack/react-query";

export type Location = Database['public']['Views']['locations']['Row'];

export type UseLocationsQueryParams = PaginationInput<Location>;

export type UseLocationsQueryResult = UseQueryResult<PaginatedResult<Location>>;

export function useLocationsQuery(params?: UseLocationsQueryParams): UseLocationsQueryResult {
  const { initialData, offset = 0, limit = 10, enabled } = params ?? {};

  return useQuery({
    initialData,
    enabled,
    queryKey: ['locations', offset, limit],
    queryFn: async () => {
      const { data, error, count } = await supabase
        .from("locations")
        .select("*", { count: 'exact' })
        .order('name', { ascending: true })
        .range(offset, offset + limit - 1);
        
      if (error) {
        throw error;
      }

      return {
        data,
        count,
        offset,
        limit
      };
    },
  });
}


export type AggregateEvent = Database['public']['Tables']['events']['Row'];

export type UseEventStreamQueryParams = PaginationInput<AggregateEvent> & {
  aggregateId?: string;
};

export type UseEventStreamQueryResult = UseQueryResult<PaginatedResult<AggregateEvent>>;

export function useEventStreamQuery(params?: UseEventStreamQueryParams): UseEventStreamQueryResult {
  const { aggregateId, initialData, enabled, offset = 0, limit = 10 } = params ?? {};

  return useQuery({
    initialData,
    enabled,
    queryKey: ['events', aggregateId, offset, limit],
    queryFn: async () => {
      const { data, error, count } = await supabase
        .from("events")
        .select("*", { count: 'exact' })
        .eq('aggregate_id', aggregateId)
        .order('version_number', { ascending: true })
        .range(offset, limit);

      if (error) {
        throw error;
      }

      return {
        data,
        count,
        offset,
        limit
      };
    },
  });
}
