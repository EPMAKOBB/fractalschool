export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      skill_edges: {
        Row: {
          source_skill: string
          target_skill: string
        }
        Insert: {
          source_skill: string
          target_skill: string
        }
        Update: {
          source_skill?: string
          target_skill?: string
        }
        Relationships: [
          {
            foreignKeyName: "skill_edges_source_skill_fkey"
            columns: ["source_skill"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skill_edges_target_skill_fkey"
            columns: ["target_skill"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          code: string
          description: string | null
          difficulty: number | null
          id: string
          subject_id: string
          title: string
        }
        Insert: {
          code: string
          description?: string | null
          difficulty?: number | null
          id?: string
          subject_id: string
          title: string
        }
        Update: {
          code?: string
          description?: string | null
          difficulty?: number | null
          id?: string
          subject_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "skills_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          created_at: string
          exam_type: Database["public"]["Enums"]["exam_type_enum"]
          id: string
          slug: string
          title: string
          year: number
        }
        Insert: {
          created_at?: string
          exam_type: Database["public"]["Enums"]["exam_type_enum"]
          id?: string
          slug: string
          title: string
          year: number
        }
        Update: {
          created_at?: string
          exam_type?: Database["public"]["Enums"]["exam_type_enum"]
          id?: string
          slug?: string
          title?: string
          year?: number
        }
        Relationships: []
      }
      tags: {
        Row: {
          color: string | null
          id: number
          slug: string
          title: string
        }
        Insert: {
          color?: string | null
          id?: number
          slug: string
          title: string
        }
        Update: {
          color?: string | null
          id?: number
          slug?: string
          title?: string
        }
        Relationships: []
      }
      task_tag_map: {
        Row: {
          tag_id: number
          task_id: string
        }
        Insert: {
          tag_id: number
          task_id: string
        }
        Update: {
          tag_id?: number
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_tag_map_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_tag_map_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks_static"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks_static: {
        Row: {
          answer_json: Json | null
          body_md: string
          choices: Json | null
          created_at: string | null
          difficulty: number | null
          id: string
          notes_text: string | null
          skill_ids: string[] | null
          solution_md: string | null
          source: string | null
          subject_id: string
          subtype_text: string | null
          task_num_text: string | null
          type_num: number | null
        }
        Insert: {
          answer_json?: Json | null
          body_md: string
          choices?: Json | null
          created_at?: string | null
          difficulty?: number | null
          id?: string
          notes_text?: string | null
          skill_ids?: string[] | null
          solution_md?: string | null
          source?: string | null
          subject_id: string
          subtype_text?: string | null
          task_num_text?: string | null
          type_num?: number | null
        }
        Update: {
          answer_json?: Json | null
          body_md?: string
          choices?: Json | null
          created_at?: string | null
          difficulty?: number | null
          id?: string
          notes_text?: string | null
          skill_ids?: string[] | null
          solution_md?: string | null
          source?: string | null
          subject_id?: string
          subtype_text?: string | null
          task_num_text?: string | null
          type_num?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_static_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      variant_task_map: {
        Row: {
          position: number | null
          task_id: string
          variant_id: string
        }
        Insert: {
          position?: number | null
          task_id: string
          variant_id: string
        }
        Update: {
          position?: number | null
          task_id?: string
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "variant_task_map_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks_static"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "variant_task_map_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "variants"
            referencedColumns: ["id"]
          },
        ]
      }
      variants: {
        Row: {
          created_at: string | null
          id: string
          slug: string | null
          source: string | null
          subject_id: string
          title: string | null
          version: string | null
          year: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          slug?: string | null
          source?: string | null
          subject_id: string
          title?: string | null
          version?: string | null
          year?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          slug?: string | null
          source?: string | null
          subject_id?: string
          title?: string | null
          version?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "variants_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_task_id_inf_ege: {
        Args: { _task_type: number }
        Returns: string
      }
      generate_task_id_math_ege: {
        Args: { _task_type: number }
        Returns: string
      }
      get_table_columns: {
        Args: { tbl: string }
        Returns: {
          column_name: string
          data_type: string
          is_nullable: string
          column_default: string
        }[]
      }
    }
    Enums: {
      exam_type_enum: "ege" | "oge"
      gen_status: "pending" | "approved" | "rejected"
      task_status: "draft" | "published" | "archived"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      exam_type_enum: ["ege", "oge"],
      gen_status: ["pending", "approved", "rejected"],
      task_status: ["draft", "published", "archived"],
    },
  },
} as const
