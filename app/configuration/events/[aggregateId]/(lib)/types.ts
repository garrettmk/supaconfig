import { Database } from "@/app/(lib)/supabase/types";

export type Aggregate = Database['public']['Tables']['aggregates']['Row'];

export type AggregateWithUsers = Omit<Aggregate, 'created_by' | 'updated_by'> & {
  created_by: null | {
    id: string;
    name: string;
  },

  updated_by: null | {
    id: string;
    name: string;
  }
}