'use server';

import { type PaginationInput, type PaginationResult } from "@/app/(lib)/pagination";
import { createServerClient } from "@/app/(lib)/supabase/server";
import { revalidatePath } from "next/cache";
import { asyncTimeout } from "@/app/(lib)/utils/utils";
import { type SpecialtyHours, type WeeklyHours, type Location } from "./types";
import { SortingInput, SortingResult } from "@/app/(lib)/sorting";


/**
 * Get a location by its ID
 */

export type GetLocationInput = string;

export type GetLocationResult = Location;

export async function getLocation(input: GetLocationInput): Promise<GetLocationResult> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .eq('id', input)
    .single();

  if (error)
    throw new Error(error.details ?? error.message, { cause: error});

  return data;
}

/**
 * Get all locations
 */

export type GetLocationsInput = PaginationInput & SortingInput;

export type GetLocationsResult = PaginationResult & SortingResult & {
  data: Location[];
};

export async function getLocations(input: GetLocationsInput): Promise<GetLocationsResult> {
  const { offset = 0, limit = 10, sortKey = 'name', sortDirection = 'asc' } = input;

  const supabase = createServerClient();
  const { data, error, count } = await supabase
    .from("locations")
    .select("*", { count: 'exact' })
    .order(sortKey, { ascending: sortDirection === 'asc' })
    .range(offset, offset + limit - 1);

  if (error)
    throw error;

  return {
    data,
    count: count ?? 0,
    offset,
    limit,
    sortKey,
    sortDirection
  };
}

/**
 * Create a new location
 */

export type CreateLocationInput = {
  name: string;
};

export async function createLocation(input: CreateLocationInput) {  
  const supabase = createServerClient();
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

/**
 * Delete a location
 */

export type DeleteLocationInput = {
  id: string;
};

export type DeleteLocationResult = void;

export async function deleteLocation(input: DeleteLocationInput) {
  await asyncTimeout(3000);
  
  const supabase = createServerClient();
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

/**
 * Update a location
 */

export type UpdateLocationInput = {
  id: string;
  name: string;
};

export type UpdateLocationResult = void;

export async function updateLocation(input: UpdateLocationInput) {
  const supabase = createServerClient();
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

/**
 * Set the default hours for a location
 */

export type SetLocationDefaultHoursInput = {
  id: string;
  defaultHours: WeeklyHours;
}

export async function setLocationDefaultHours(input: SetLocationDefaultHoursInput) {
  const supabase = createServerClient();
  const { error } = await supabase
    .from('events')
    .insert({
      event_type: 'update',
      aggregate_id: input.id,
      event_data: { defaultHours: input.defaultHours }
    });

  if (error)
    throw new Error(error.details ?? error.message, { cause: error});

  revalidatePath(`/configuration/locations/${input.id}/schedule`);
}

/**
 * Set the specialty hours for a location
 */

export type SetLocationHoursInput = {
  id: string;
  specialtyHours: SpecialtyHours;
}

export async function setLocationHours(input: SetLocationHoursInput) {
  const supabase = createServerClient();
  const { error } = await supabase
    .from('events')
    .insert({
      event_type: 'update',
      aggregate_id: input.id,
      event_data: { 
        specialtyHours: input.specialtyHours
      }
    });

  if (error)
    throw new Error(error.details ?? error.message, { cause: error});

  revalidatePath(`/configuration/locations/${input.id}/schedule`);
}

/**
 * Get the default hours for a location
 */

export type GetLocationDefaultHoursInput = {
  id: string;
}

export async function getLocationDefaultHours(input: GetLocationDefaultHoursInput) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("locations")
    .select("default_hours")
    .eq('id', input.id)
    .single();

  if (error)
    throw new Error(error.details ?? error.message, { cause: error});

  return data.default_hours;
}