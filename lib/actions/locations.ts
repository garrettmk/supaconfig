'use server';

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { type Location } from "@/types/models";
import { type PaginationResult, type PaginationInput } from "@/lib/pagination";
import { asyncTimeout } from "../utils";


export type GetLocationInput = string;

export type GetLocationResult = Location;

export async function getLocation(input: GetLocationInput): Promise<GetLocationResult> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .eq('id', input)
    .single();

  if (error)
    throw new Error(error.details ?? error.message, { cause: error});

  return data;
}


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


export type DailyHours = {
  isOpen: boolean;
  open: { hour: number; minute: number; };
  close: { hour: number; minute: number; };
  break: { hour: number; minute: number; };
  breakDuration: number;
};

export type WeeklyHours = {
  sunday: DailyHours;
  monday: DailyHours;
  tuesday: DailyHours;
  wednesday: DailyHours;
  thursday: DailyHours;
  friday: DailyHours;
  saturday: DailyHours;
};

export type SetLocationDefaultHoursInput = {
  id: string;
  defaultHours: WeeklyHours;
}

export async function setLocationDefaultHours(input: SetLocationDefaultHoursInput) {
  const supabase = createClient();
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


export type SpecialtyHours = {
  [date: string]: DailyHours
}

export type SetLocationHoursInput = {
  id: string;
  specialtyHours: SpecialtyHours;
}

export async function setLocationHours(input: SetLocationHoursInput) {
  const supabase = createClient();
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


export type GetLocationDefaultHoursInput = {
  id: string;
}

export async function getLocationDefaultHours(input: GetLocationDefaultHoursInput) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("locations")
    .select("default_hours")
    .eq('id', input.id)
    .single();

  if (error)
    throw new Error(error.details ?? error.message, { cause: error});

  return data.default_hours;
}