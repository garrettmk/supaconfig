'use server';

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { type Location } from "@/types/locations";
import { PaginatedResult, PaginationInput } from "@/types/queries";


export type GetLocationsInput = PaginationInput<Location>;

export type GetLocationsResult = PaginatedResult<Location>;

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

export async function deleteLocation(input: DeleteLocationInput) {
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