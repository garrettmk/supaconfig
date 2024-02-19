export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]
export interface Database {
  public: {
    Tables: {
      aggregates: {
        Row: {
          data: Json
          id: string
          type: Database["public"]["Enums"]["agg_type"]
          version_number: number
        }
        Insert: {
          data: Json
          id: string
          type: Database["public"]["Enums"]["agg_type"]
          version_number: number
        }
        Update: {
          data?: Json
          id?: string
          type?: Database["public"]["Enums"]["agg_type"]
          version_number?: number
        }
      }
      events: {
        Row: {
          aggregate_id: string
          aggregate_type: Database["public"]["Enums"]["agg_type"]
          event_data: Json
          event_id: number
          event_type: string
          version_number: number
        }
        Insert: {
          aggregate_id: string
          aggregate_type: Database["public"]["Enums"]["agg_type"]
          event_data: Json
          event_id?: number
          event_type: string
          version_number: number
        }
        Update: {
          aggregate_id?: string
          aggregate_type?: Database["public"]["Enums"]["agg_type"]
          event_data?: Json
          event_id?: number
          event_type?: string
          version_number?: number
        }
      }
    }
    Views: {
      locations: {
        Row: {
          id: string | null
          name: string | null
          version: number | null
        }
        Insert: {
          id?: string | null
          name?: never
          version?: number | null
        }
        Update: {
          id?: string | null
          name?: never
          version?: number | null
        }
      }
    }
    Functions: {
      aggregate_exists: {
        Args: {
          agg_id: string
        }
        Returns: boolean
      }
      apply_event: {
        Args: {
          aggregate: unknown
          event: unknown
        }
        Returns: {
          data: Json
          id: string
          type: Database["public"]["Enums"]["agg_type"]
          version_number: number
        }
      }
      build_aggregate: {
        Args: {
          agg_id: string
          max_version?: number
        }
        Returns: {
          data: Json
          id: string
          type: Database["public"]["Enums"]["agg_type"]
          version_number: number
        }
      }
      get_aggregate_events: {
        Args: {
          agg_id: string
          max_version?: number
        }
        Returns: {
          aggregate_id: string
          aggregate_type: Database["public"]["Enums"]["agg_type"]
          event_data: Json
          event_id: number
          event_type: string
          version_number: number
        }[]
      }
      next_version_number: {
        Args: {
          agg_id: string
        }
        Returns: number
      }
    }
    Enums: {
      agg_type: "location"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
