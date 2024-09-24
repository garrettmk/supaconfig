'use server';

import { EventWithUsers } from "@/app/configuration/events/(lib)/types";
import { type PaginationInput, type PaginationResult } from "@/app/(lib)/pagination";
import { createServerClient } from "@/app/(lib)/supabase/server";
import { PostgrestError } from "@supabase/supabase-js";
import { SortingInput, SortingResult } from "@/app/(lib)/sorting";

/**
 * Get a list of events.
 */

export type GetEventsInput = {
  sorting?: SortingInput;
  pagination?: PaginationInput;
  filter?: {
    event_type?: string;
    aggregate_type?: string;
    aggregate_id?: string;
    created_by?: string;
  }
};

export type GetEventsResult = {
  data: EventWithUsers[];
  pagination: PaginationResult;
  sorting: SortingResult;
};

export async function getEvents(input: GetEventsInput): Promise<GetEventsResult> {
  const { sorting, pagination, filter } = input;
  const { offset = 0, limit = 10 } = pagination ?? {};
  const { sortKey = 'event_id', sortDirection = 'desc' } = sorting ?? {};

  const supabase = createServerClient();
  const query = filter?.created_by 
    ? supabase.from('events').select('*, created_by!inner (id, name)', { count: 'exact' })
    : supabase.from('events').select('*, created_by (id, name)', { count: 'exact' });

  if (filter?.event_type)
    query.eq('event_type', filter.event_type);
  
  if (filter?.aggregate_type)
    query.eq('aggregate_type', filter.aggregate_type);

  if (filter?.aggregate_id)
    query.eq('aggregate_id', filter.aggregate_id);

  if (filter?.created_by)
    query.ilike('created_by.name', `%${filter.created_by}%`);

  const { data, error, count } = await query
    .order(sortKey, { ascending: sortDirection === 'asc' })
    .range(offset, offset + limit - 1);

  if (error)
    throw new Error(error.details ?? error.message, { cause: error });

  return {
    data,
    pagination: {
      count: count ?? 0,
      offset,
      limit
    },
    sorting:{
      sortKey,
      sortDirection
    }
  };
}


/**
 * Get the event stream for a given aggregate.
 */

export type GetEventStreamInput = PaginationInput & SortingInput & {
  aggregateId: string;
}

export type GetEventStreamResult = PaginationResult & SortingResult & {
  data?: EventWithUsers[];
  error?: PostgrestError; 
};

export async function getEventStream(input: GetEventStreamInput): Promise<GetEventStreamResult> {
  const { 
    aggregateId, 
    offset = 0, 
    limit = 10, 
    sortKey = 'version_number',
    sortDirection = 'asc'
  } = input;

  const supabase = createServerClient();
  const { data, error, count } = await supabase
    .from('events')
    .select('*, created_by (id, name)', { count: 'exact'})
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
 * Get a single event by its ID.
 */

export type GetEventInput = {
  eventId: EventWithUsers['event_id'];
}

export type GetEventResult = {
  data?: EventWithUsers;
  error?: PostgrestError;
};

export async function getEvent(input: GetEventInput): Promise<GetEventResult> {
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