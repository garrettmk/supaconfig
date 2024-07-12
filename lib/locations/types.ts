import { type Database } from "@/lib/supabase/supabase";
import { type NonNullableObject } from "@/types/utils";

export type Location = NonNullableObject<Database['public']['Views']['locations']['Row']>;

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

export type SpecialtyHours = {
  [date: string]: DailyHours
};