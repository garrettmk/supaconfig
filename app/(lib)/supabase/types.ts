export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      aggregates: {
        Row: {
          created_at: string
          created_by: string | null
          data: Json
          id: string
          status: Database["public"]["Enums"]["agg_status"]
          type: Database["public"]["Enums"]["agg_type"]
          updated_at: string
          updated_by: string | null
          version_number: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          data: Json
          id: string
          status?: Database["public"]["Enums"]["agg_status"]
          type: Database["public"]["Enums"]["agg_type"]
          updated_at?: string
          updated_by?: string | null
          version_number: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          data?: Json
          id?: string
          status?: Database["public"]["Enums"]["agg_status"]
          type?: Database["public"]["Enums"]["agg_type"]
          updated_at?: string
          updated_by?: string | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "aggregates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "aggregates_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          aggregate_id: string
          aggregate_type: Database["public"]["Enums"]["agg_type"]
          created_at: string
          created_by: string | null
          event_data: Json
          event_id: number
          event_type: string
          version_number: number
        }
        Insert: {
          aggregate_id: string
          aggregate_type: Database["public"]["Enums"]["agg_type"]
          created_at?: string
          created_by?: string | null
          event_data: Json
          event_id?: number
          event_type: string
          version_number: number
        }
        Update: {
          aggregate_id?: string
          aggregate_type?: Database["public"]["Enums"]["agg_type"]
          created_at?: string
          created_by?: string | null
          event_data?: Json
          event_id?: number
          event_type?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      locations: {
        Row: {
          created_at: string | null
          created_by: string | null
          created_by_user: Json | null
          default_hours: Json | null
          id: string | null
          name: string | null
          specialty_hours: Json | null
          updated_at: string | null
          updated_by: string | null
          updated_by_user: Json | null
          version: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          created_by_user?: never
          default_hours?: never
          id?: string | null
          name?: never
          specialty_hours?: never
          updated_at?: string | null
          updated_by?: string | null
          updated_by_user?: never
          version?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          created_by_user?: never
          default_hours?: never
          id?: string | null
          name?: never
          specialty_hours?: never
          updated_at?: string | null
          updated_by?: string | null
          updated_by_user?: never
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "aggregates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "aggregates_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
          created_at: string
          created_by: string | null
          data: Json
          id: string
          status: Database["public"]["Enums"]["agg_status"]
          type: Database["public"]["Enums"]["agg_type"]
          updated_at: string
          updated_by: string | null
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
          created_at: string
          created_by: string | null
          data: Json
          id: string
          status: Database["public"]["Enums"]["agg_status"]
          type: Database["public"]["Enums"]["agg_type"]
          updated_at: string
          updated_by: string | null
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
          created_at: string
          created_by: string | null
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
      user_json: {
        Args: {
          user_id: string
        }
        Returns: Json
      }
    }
    Enums: {
      agg_status: "active" | "deleted"
      agg_type: "location"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

