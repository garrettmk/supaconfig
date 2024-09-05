import { Database } from "@/app/(lib)/supabase/types";

export type User = Database['public']['Tables']['users']['Row'];

export type Event = Database['public']['Tables']['events']['Row'];
export type EventWithUsers = Omit<Event, 'created_by'> & {
  created_by: null | User
};

