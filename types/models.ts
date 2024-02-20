import { Database } from "@/types/supabase";
import { NonNullableObject } from "@/types/utils";

export type Event = Database['public']['Tables']['events']['Row'];
export type Aggregate = Database['public']['Tables']['aggregates']['Row'];
export type Location = NonNullableObject<Database['public']['Views']['locations']['Row']>;