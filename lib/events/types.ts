import { Database } from "@/lib/supabase/supabase";
import { NonNullableObject } from "@/types/utils";

export type Event = Database['public']['Tables']['events']['Row'];

