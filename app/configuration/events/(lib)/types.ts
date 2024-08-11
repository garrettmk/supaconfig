import { Database } from "@/app/(lib)/supabase/types";

export type Event = Database['public']['Tables']['events']['Row'];
export type EventWithUsers = Omit<Event, 'created_by'> & {
  created_by: null | {
    id: string;
    name: string;
  }
};

