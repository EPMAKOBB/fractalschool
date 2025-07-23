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
  app: {
    Tables: {
      class_students: {
        Row: {
          added_at: string | null
          class_id: string
          student_id: string
        }
        Insert: {
          added_at?: string | null
          class_id: string
          student_id: string
        }
        Update: {
          added_at?: string | null
          class_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_students_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          teacher_id: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          teacher_id?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          teacher_id?: string | null
          title?: string
        }
        Relationships: []
      }
      roles: {
        Row: {
          id: string
          is_system: boolean | null
          label: string
          slug: string
        }
        Insert: {
          id?: string
          is_system?: boolean | null
          label: string
          slug: string
        }
        Update: {
          id?: string
          is_system?: boolean | null
          label?: string
          slug?: string
        }
        Relationships: []
      }
      teacher_students: {
        Row: {
          confirmed: boolean | null
          created_at: string | null
          student_id: string
          teacher_id: string
        }
        Insert: {
          confirmed?: boolean | null
          created_at?: string | null
          student_id: string
          teacher_id: string
        }
        Update: {
          confirmed?: boolean | null
          created_at?: string | null
          student_id?: string
          teacher_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          name: string | null
          nickname: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          name?: string | null
          nickname?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          name?: string | null
          nickname?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          granted_at: string | null
          role_id: string
          user_id: string
        }
        Insert: {
          granted_at?: string | null
          role_id: string
          user_id: string
        }
        Update: {
          granted_at?: string | null
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      user_roles_view: {
        Row: {
          email: string | null
          granted_at: string | null
          role_id: string | null
          role_label: string | null
          role_slug: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
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
  assistant: {
    Tables: {
      chats: {
        Row: {
          chat_type: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          settings: Json | null
          subject_id: string | null
          type_num: number | null
          user_id: string | null
        }
        Insert: {
          chat_type?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          settings?: Json | null
          subject_id?: string | null
          type_num?: number | null
          user_id?: string | null
        }
        Update: {
          chat_type?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          settings?: Json | null
          subject_id?: string | null
          type_num?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      faq_site: {
        Row: {
          answer: string
          created_at: string | null
          id: number
          is_active: boolean | null
          question: string
          tags: string[] | null
        }
        Insert: {
          answer: string
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          question: string
          tags?: string[] | null
        }
        Update: {
          answer?: string
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          question?: string
          tags?: string[] | null
        }
        Relationships: []
      }
      faq_subjects: {
        Row: {
          answer: string
          created_at: string | null
          id: number
          is_active: boolean | null
          question: string
          subject_id: string | null
          tags: string[] | null
        }
        Insert: {
          answer: string
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          question: string
          subject_id?: string | null
          tags?: string[] | null
        }
        Update: {
          answer?: string
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          question?: string
          subject_id?: string | null
          tags?: string[] | null
        }
        Relationships: []
      }
      faq_tasks_subtype: {
        Row: {
          answer: string
          created_at: string | null
          id: number
          is_active: boolean | null
          question: string
          subject_id: string | null
          tags: string[] | null
          type_num: number | null
        }
        Insert: {
          answer: string
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          question: string
          subject_id?: string | null
          tags?: string[] | null
          type_num?: number | null
        }
        Update: {
          answer?: string
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          question?: string
          subject_id?: string | null
          tags?: string[] | null
          type_num?: number | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          chat_id: string | null
          content: string
          created_at: string | null
          id: string
          meta: Json | null
          role: string
          user_id: string | null
        }
        Insert: {
          chat_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          meta?: Json | null
          role: string
          user_id?: string | null
        }
        Update: {
          chat_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          meta?: Json | null
          role?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profile: {
        Row: {
          profile: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          profile?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          profile?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      fn_add_message: {
        Args: {
          _chat_id: string
          _user_id: string
          _role: string
          _content: string
          _meta?: Json
        }
        Returns: undefined
      }
      fn_get_faq_site: {
        Args: { _query: string }
        Returns: {
          id: number
          question: string
          answer: string
          tags: string[]
        }[]
      }
      fn_get_faq_subjects: {
        Args: { _subject_id: string; _query: string }
        Returns: {
          id: number
          subject_id: string
          question: string
          answer: string
          tags: string[]
        }[]
      }
      fn_get_faq_tasks_subtype: {
        Args: { _subject_id: string; _type_num: number; _query: string }
        Returns: {
          id: number
          subject_id: string
          type_num: number
          question: string
          answer: string
          tags: string[]
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  billing: {
    Tables: {
      balance_transactions: {
        Row: {
          created_at: string | null
          delta: number
          id: string
          kind: Database["billing"]["Enums"]["balance_kind"] | null
          reason: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          delta: number
          id?: string
          kind?: Database["billing"]["Enums"]["balance_kind"] | null
          reason?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          delta?: number
          id?: string
          kind?: Database["billing"]["Enums"]["balance_kind"] | null
          reason?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      balances: {
        Row: {
          amount: number
          kind: Database["billing"]["Enums"]["balance_kind"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount?: number
          kind: Database["billing"]["Enums"]["balance_kind"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          kind?: Database["billing"]["Enums"]["balance_kind"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          id: string
          price_cents: number
          slug: string
          title: string
        }
        Insert: {
          id?: string
          price_cents: number
          slug: string
          title: string
        }
        Update: {
          id?: string
          price_cents?: number
          slug?: string
          title?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string | null
          id: string
          label: string
          period: string
          price_cents: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          label: string
          period: string
          price_cents: number
        }
        Update: {
          created_at?: string | null
          id?: string
          label?: string
          period?: string
          price_cents?: number
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          current_period_end: string | null
          external_id: string | null
          id: string
          plan_id: string | null
          started_at: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          current_period_end?: string | null
          external_id?: string | null
          id?: string
          plan_id?: string | null
          started_at?: string | null
          status: string
          user_id?: string | null
        }
        Update: {
          current_period_end?: string | null
          external_id?: string | null
          id?: string
          plan_id?: string | null
          started_at?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      user_courses: {
        Row: {
          access_expires_at: string | null
          course_id: string | null
          id: string
          purchased_at: string | null
          user_id: string | null
        }
        Insert: {
          access_expires_at?: string | null
          course_id?: string | null
          id?: string
          purchased_at?: string | null
          user_id?: string | null
        }
        Update: {
          access_expires_at?: string | null
          course_id?: string | null
          id?: string
          purchased_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
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
      balance_kind: "RUB" | "ERMACOIN" | "AI_TOKEN"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  courses: {
    Tables: {
      course_module_tasks: {
        Row: {
          module_id: string
          task_id: string
          task_source: string | null
          task_type_num: number | null
        }
        Insert: {
          module_id: string
          task_id: string
          task_source?: string | null
          task_type_num?: number | null
        }
        Update: {
          module_id?: string
          task_id?: string
          task_source?: string | null
          task_type_num?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "course_module_tasks_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      course_modules: {
        Row: {
          body_md: string | null
          course_id: string | null
          created_at: string | null
          id: string
          order_num: number | null
          title: string
        }
        Insert: {
          body_md?: string | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          order_num?: number | null
          title: string
        }
        Update: {
          body_md?: string | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          order_num?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          slug: string
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          slug: string
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          slug?: string
          title?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      fn_get_course_progress: {
        Args: { _user_id: string; _course_id: string }
        Returns: {
          user_id: string
          course_id: string
          completed_units: number
          total_units: number
          progress_percent: number
        }[]
      }
      fn_update_course_progress: {
        Args: { _user_id: string; _course_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  learner: {
    Tables: {
      user_course_progress: {
        Row: {
          certified: boolean | null
          completed_units: number | null
          course_id: string
          grade: number | null
          last_activity: string | null
          total_units: number | null
          user_id: string
        }
        Insert: {
          certified?: boolean | null
          completed_units?: number | null
          course_id: string
          grade?: number | null
          last_activity?: string | null
          total_units?: number | null
          user_id: string
        }
        Update: {
          certified?: boolean | null
          completed_units?: number | null
          course_id?: string
          grade?: number | null
          last_activity?: string | null
          total_units?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_recommendation: {
        Row: {
          reason: string | null
          recommended_at: string
          source: string | null
          status: string | null
          task_id: string
          user_id: string
        }
        Insert: {
          reason?: string | null
          recommended_at?: string
          source?: string | null
          status?: string | null
          task_id: string
          user_id: string
        }
        Update: {
          reason?: string | null
          recommended_at?: string
          source?: string | null
          status?: string | null
          task_id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          settings: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          settings?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          settings?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_skill_progress: {
        Row: {
          difficulty: number | null
          halflife_h: number | null
          last_review: string | null
          next_review: string | null
          reviews_cnt: number | null
          skill_id: string
          stability: number | null
          user_id: string
        }
        Insert: {
          difficulty?: number | null
          halflife_h?: number | null
          last_review?: string | null
          next_review?: string | null
          reviews_cnt?: number | null
          skill_id: string
          stability?: number | null
          user_id: string
        }
        Update: {
          difficulty?: number | null
          halflife_h?: number | null
          last_review?: string | null
          next_review?: string | null
          reviews_cnt?: number | null
          skill_id?: string
          stability?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_subject_progress: {
        Row: {
          avg_score: number | null
          last_activity: string | null
          progress: number | null
          subject_id: string
          user_id: string
        }
        Insert: {
          avg_score?: number | null
          last_activity?: string | null
          progress?: number | null
          subject_id: string
          user_id: string
        }
        Update: {
          avg_score?: number | null
          last_activity?: string | null
          progress?: number | null
          subject_id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_task_attempts: {
        Row: {
          answer_json: Json | null
          attempt_num: number | null
          correct: boolean | null
          created_at: string | null
          elapsed_ms: number | null
          id: string
          max_score: number | null
          score: number | null
          source: string | null
          task_id: string
          user_id: string | null
        }
        Insert: {
          answer_json?: Json | null
          attempt_num?: number | null
          correct?: boolean | null
          created_at?: string | null
          elapsed_ms?: number | null
          id?: string
          max_score?: number | null
          score?: number | null
          source?: string | null
          task_id: string
          user_id?: string | null
        }
        Update: {
          answer_json?: Json | null
          attempt_num?: number | null
          correct?: boolean | null
          created_at?: string | null
          elapsed_ms?: number | null
          id?: string
          max_score?: number | null
          score?: number | null
          source?: string | null
          task_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_task_stats: {
        Row: {
          attempts_cnt: number | null
          best_score: number | null
          last_attempt_at: string | null
          last_score: number | null
          task_id: string
          user_id: string
        }
        Insert: {
          attempts_cnt?: number | null
          best_score?: number | null
          last_attempt_at?: string | null
          last_score?: number | null
          task_id: string
          user_id: string
        }
        Update: {
          attempts_cnt?: number | null
          best_score?: number | null
          last_attempt_at?: string | null
          last_score?: number | null
          task_id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_type_progress: {
        Row: {
          accuracy: number | null
          attempts_cnt: number | null
          avg_score: number | null
          last_attempt_at: string | null
          progress: number | null
          subject_id: string
          type_num: number
          user_id: string
        }
        Insert: {
          accuracy?: number | null
          attempts_cnt?: number | null
          avg_score?: number | null
          last_attempt_at?: string | null
          progress?: number | null
          subject_id: string
          type_num: number
          user_id: string
        }
        Update: {
          accuracy?: number | null
          attempts_cnt?: number | null
          avg_score?: number | null
          last_attempt_at?: string | null
          progress?: number | null
          subject_id?: string
          type_num?: number
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      fn_log_task_attempt: {
        Args: {
          _user_id: string
          _task_id: string
          _score: number
          _max_score: number
          _answer: Json
          _source?: string
          _elapsed_ms?: number
        }
        Returns: undefined
      }
      fn_recommend_tasks: {
        Args: { _user_id: string; _limit?: number }
        Returns: {
          task_id: string
          score: number
        }[]
      }
      fn_update_skill_progress: {
        Args: { _user_id: string; _skill_id: string }
        Returns: undefined
      }
      fn_update_task_stats: {
        Args: { _user_id: string; _task_id: string }
        Returns: undefined
      }
      fn_update_type_progress: {
        Args: { _user_id: string; _subject_id: string; _type_num: number }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
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
          body_mdx: string | null
          choices: Json | null
          created_at: string | null
          difficulty: number | null
          id: string
          img_urls: Json | null
          max_score: number | null
          notes_text: string | null
          scoring_schema: Json | null
          skill_ids: string[] | null
          solution_md: string | null
          solution_mdx: Json | null
          source: string | null
          status: string | null
          subject_id: string
          subtype_text: string | null
          svg_data: Json | null
          tables_data: Json | null
          task_num_text: string | null
          type_num: number | null
        }
        Insert: {
          answer_json?: Json | null
          body_md: string
          body_mdx?: string | null
          choices?: Json | null
          created_at?: string | null
          difficulty?: number | null
          id?: string
          img_urls?: Json | null
          max_score?: number | null
          notes_text?: string | null
          scoring_schema?: Json | null
          skill_ids?: string[] | null
          solution_md?: string | null
          solution_mdx?: Json | null
          source?: string | null
          status?: string | null
          subject_id: string
          subtype_text?: string | null
          svg_data?: Json | null
          tables_data?: Json | null
          task_num_text?: string | null
          type_num?: number | null
        }
        Update: {
          answer_json?: Json | null
          body_md?: string
          body_mdx?: string | null
          choices?: Json | null
          created_at?: string | null
          difficulty?: number | null
          id?: string
          img_urls?: Json | null
          max_score?: number | null
          notes_text?: string | null
          scoring_schema?: Json | null
          skill_ids?: string[] | null
          solution_md?: string | null
          solution_mdx?: Json | null
          source?: string | null
          status?: string | null
          subject_id?: string
          subtype_text?: string | null
          svg_data?: Json | null
          tables_data?: Json | null
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
  app: {
    Enums: {},
  },
  assistant: {
    Enums: {},
  },
  billing: {
    Enums: {
      balance_kind: ["RUB", "ERMACOIN", "AI_TOKEN"],
    },
  },
  courses: {
    Enums: {},
  },
  learner: {
    Enums: {},
  },
  public: {
    Enums: {
      exam_type_enum: ["ege", "oge"],
      gen_status: ["pending", "approved", "rejected"],
      task_status: ["draft", "published", "archived"],
    },
  },
} as const
