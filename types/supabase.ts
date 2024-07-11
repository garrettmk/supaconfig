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
          default_hours: Json | null
          id: string | null
          name: string | null
          specialty_hours: Json | null
          version: number | null
        }
        Insert: {
          default_hours?: never
          id?: string | null
          name?: never
          specialty_hours?: never
          version?: number | null
        }
        Update: {
          default_hours?: never
          id?: string | null
          name?: never
          specialty_hours?: never
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
      apply_jsonb_updates: {
        Args: {
          original: Json
          updates: Json
        }
        Returns: Json
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
      location_create: {
        Args: {
          name: string
          id?: string
          data?: Json
        }
        Returns: string
      }
      location_delete: {
        Args: {
          location_id: string
        }
        Returns: undefined
      }
      location_get_hours: {
        Args: {
          location_id: string
          start_date: string
          end_date: string
        }
        Returns: {
          date: string
          weekday: string
          is_default: boolean
          is_open: boolean
          open_time: string
          close_time: string
          break_time: string
          break_duration: number
          total_hours: unknown
        }[]
      }
      location_set_default_hours: {
        Args: {
          location_id: string
          hours: Json
        }
        Returns: undefined
      }
      location_set_specialty_hours: {
        Args: {
          location_id: string
          date: string
          hours: Json
        }
        Returns: undefined
      }
      location_validate_daily_hours: {
        Args: {
          hours: Json
        }
        Returns: undefined
      }
      location_validate_weekly_hours: {
        Args: {
          hours: Json
        }
        Returns: undefined
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
