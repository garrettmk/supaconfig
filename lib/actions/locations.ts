'use server';

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { type Location } from "@/types/models";
import { type PaginationResult, type PaginationInput } from "@/lib/pagination";
import { asyncTimeout } from "../utils";


export type GetLocationsInput = PaginationInput;

export type GetLocationsResult = PaginationResult & {
  data: Location[];
};

export async function getLocations(input: GetLocationsInput): Promise<GetLocationsResult> {
  const { offset = 0, limit = 10 } = input;

  const supabase = createClient();
  const { data, error, count } = await supabase
    .from("locations")
    .select("*", { count: 'exact' })
    .order('name', { ascending: true })
    .range(offset, offset + limit - 1);

  if (error)
    throw error;

  return {
    data,
    count: count ?? 0,
    offset,
    limit
  };
}


export type CreateLocationInput = {
  name: string;
};

export async function createLocation(input: CreateLocationInput) {  
  const supabase = createClient();
  const { error } = await supabase
    .from('events')
    .insert({
      event_type: 'create',
      aggregate_type: 'location',
      event_data: input
    });

  if (error)
    throw error;

  revalidatePath('/configuration/locations');
}


export type DeleteLocationInput = {
  id: string;
};

export type DeleteLocationResult = void;

export async function deleteLocation(input: DeleteLocationInput) {
  await asyncTimeout(3000);
  
  const supabase = createClient();
  const { error } = await supabase
    .from('events')
    .insert({
      event_type: 'delete',
      aggregate_id: input.id,
      event_data: {}
    });

  if (error)
    throw error;

  revalidatePath('/configuration/locations');
}


export type UpdateLocationInput = {
  id: string;
  name: string;
};

export type UpdateLocationResult = void;

export async function updateLocation(input: UpdateLocationInput) {
  const supabase = createClient();
  const { error } = await supabase
    .from('events')
    .insert({
      event_type: 'update',
      aggregate_id: input.id,
      event_data: { name: input.name }
    });

  if (error)
    throw error;

  revalidatePath('/configuration/locations');
}