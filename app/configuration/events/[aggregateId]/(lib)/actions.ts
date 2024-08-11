'use server';

import { type EventWithUsers } from "@/app/configuration/events/(lib)/types";
import { type PaginationInput, type PaginationResult } from "@/app/(lib)/pagination";
import { createServerClient } from "@/app/(lib)/supabase/server";
import { PostgrestError } from "@supabase/supabase-js";
import { type SortingInput, SortingResult } from "@/app/(lib)/sorting";
import { Aggregate, AggregateWithUsers } from "./types";

/**
 * Gets details for an aggregate.
 */

export type GetAggregateInput = {
  aggregateId: Aggregate['id'],
  version?: number
};

export type GetAggregateResult = AggregateWithUsers;

export async function getAggregate(input: GetAggregateInput): Promise<GetAggregateResult> {
  const { aggregateId, version } = input;
  const supabase = createServerClient();

  const { data, error } = typeof version === 'number' 
  ? await supabase.rpc('build_aggregate', {
    agg_id: aggregateId,
    max_version: version
  })
  : await supabase
    .from('aggregates')
    .select('*, created_by (id, name), updated_by (id, name)')
    .eq('id', aggregateId)
    .single();

  if (error)
    throw new Error(error.details ?? error.message, { cause: error });

  return data;
}

/**
 * Get events for an aggregate.
 */

export type GetAggregateEventsInput = PaginationInput & SortingInput & {
  aggregateId: string;
};

export type GetAggregateEventsResult = PaginationResult & SortingResult & {
  data?: Omit<EventWithUsers, 'event_data'>[];
  error?: PostgrestError;
}

export async function getAggregateEvents(input: GetAggregateEventsInput): Promise<GetAggregateEventsResult> {
  const {
    aggregateId, 
    offset = 0, 
    limit = 10, 
    sortKey = 'version_number', 
    sortDirection = 'desc'
  } = input;

  const supabase = createServerClient();
  const { data, error, count } = await supabase
    .from('events')
    .select('aggregate_id, aggregate_type, version_number, event_id, event_type, created_at, created_by (id, name)', { count: 'exact' })
    .eq('aggregate_id', aggregateId)
    .order(sortKey, { ascending: sortDirection === 'asc' })
    .range(offset, offset + limit - 1);

  if (error)
    throw new Error(error.details ?? error.message, { cause: error });

  return {
    data: data ?? undefined,
    error: error ?? undefined,
    count: count ?? 0,
    offset,
    limit,
    sortKey,
    sortDirection
  };
}


/**
 * Get event details
 */

export type GetEventDetailsInput = {
  eventId: EventWithUsers['event_id']
};

export type GetEventDetailsResult = {
  data?: EventWithUsers,
  error?: PostgrestError
};

export async function getEventDetails(input: GetEventDetailsInput): Promise<GetEventDetailsResult> {
  const { eventId } = input;
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('events')
    .select('*, created_by (id, name)')
    .eq('event_id', eventId)
    .single();

  if (error)
    throw new Error(error.details ?? error.message, { cause: error });

  return {
    data: data ?? undefined,
    error: error ?? undefined
  };
}