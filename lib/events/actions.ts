'use server';

import { type PaginationInput, type PaginationResult } from "@/lib/pagination";
import { type Event } from "@/lib/events/types";
import { createClient } from "@/lib/supabase/server";
import { PostgrestError } from "@supabase/supabase-js";
import { SortingInput, SortingResult } from "../sorting";


export type GetEventStreamInput = PaginationInput & SortingInput & {
  aggregateId: string;
}

export type GetEventStreamResult = PaginationResult & SortingResult & {
  data?: Event[];
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

  const supabase = createClient();
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