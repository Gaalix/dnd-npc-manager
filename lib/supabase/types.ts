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
      campaigns: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      npcs: {
        Row: {
          alignment: string | null
          campaign_id: string
          charisma: number | null
          class: string | null
          constitution: number | null
          created_at: string
          description: string | null
          dexterity: number | null
          id: string
          intelligence: number | null
          location: string | null
          name: string
          notes: string | null
          photo_url: string | null
          race: string | null
          strength: number | null
          updated_at: string
          user_id: string
          wisdom: number | null
        }
        Insert: {
          alignment?: string | null
          campaign_id: string
          charisma?: number | null
          class?: string | null
          constitution?: number | null
          created_at?: string
          description?: string | null
          dexterity?: number | null
          id?: string
          intelligence?: number | null
          location?: string | null
          name: string
          notes?: string | null
          photo_url?: string | null
          race?: string | null
          strength?: number | null
          updated_at?: string
          user_id: string
          wisdom?: number | null
        }
        Update: {
          alignment?: string | null
          campaign_id?: string
          charisma?: number | null
          class?: string | null
          constitution?: number | null
          created_at?: string
          description?: string | null
          dexterity?: number | null
          id?: string
          intelligence?: number | null
          location?: string | null
          name?: string
          notes?: string | null
          photo_url?: string | null
          race?: string | null
          strength?: number | null
          updated_at?: string
          user_id?: string
          wisdom?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "npcs_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

export type Campaign = Tables<'campaigns'>
export type NPC = Tables<'npcs'>
export type InsertCampaign = InsertTables<'campaigns'>
export type InsertNPC = InsertTables<'npcs'>
export type UpdateCampaign = UpdateTables<'campaigns'>
export type UpdateNPC = UpdateTables<'npcs'>
