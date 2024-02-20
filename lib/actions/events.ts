'use server';

import { type PaginationInput, type PaginationResult } from "@/lib/pagination";
import { asyncTimeout } from "@/lib/utils";
import { type Event } from "@/types/models";
import { createClient } from "@/utils/supabase/server";
import { PostgrestError } from "@supabase/supabase-js";


export type GetEventStreamInput = PaginationInput & {
  aggregateId: string;
}

export type GetEventStreamResult = PaginationResult & {
  data?: Event[];
  error?: PostgrestError; 
};

export async function getEventStream(input: GetEventStreamInput): Promise<GetEventStreamResult> {
  await asyncTimeout(3000);
  const { aggregateId, offset = 0, limit = 10 } = input;

  const supabase = createClient();
  const { data, error, count } = await supabase
    .from('events')
    .select('*', { count: 'exact'})
    .eq('aggregate_id', aggregateId)
    .order('version_number', { ascending: true })
    .range(offset, offset + limit - 1);

  if (error)
    throw new Error(error.details ?? error.message, { cause: error });

  return {
    data: data ?? undefined,
    error: error ?? undefined,
    count: count ?? 0,
    offset,
    limit
  };
}