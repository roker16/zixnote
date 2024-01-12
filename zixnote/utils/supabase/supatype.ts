export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles_roles: {
        Row: {
          profile_id: string
          role_id: number
        }
        Insert: {
          profile_id: string
          role_id: number
        }
        Update: {
          profile_id?: string
          role_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "profiles_roles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          }
        ]
      }
      roles: {
        Row: {
          description: string | null
          id: number
          role: string
        }
        Insert: {
          description?: string | null
          id?: number
          role: string
        }
        Update: {
          description?: string | null
          id?: number
          role?: string
        }
        Relationships: []
      }
      syll_class: {
        Row: {
          class_name: string
          id: number
          school_id: number
        }
        Insert: {
          class_name: string
          id?: number
          school_id: number
        }
        Update: {
          class_name?: string
          id?: number
          school_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "syll_class_school_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "syll_school"
            referencedColumns: ["id"]
          }
        ]
      }
      syll_college: {
        Row: {
          college_name: string
          id: number
        }
        Insert: {
          college_name: string
          id?: number
        }
        Update: {
          college_name?: string
          id?: number
        }
        Relationships: []
      }
      syll_department: {
        Row: {
          college_id: number
          course_name: string
          department_name: string
          id: number
        }
        Insert: {
          college_id: number
          course_name: string
          department_name: string
          id?: number
        }
        Update: {
          college_id?: number
          course_name?: string
          department_name?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "syll_department_college_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "syll_college"
            referencedColumns: ["id"]
          }
        ]
      }
      syll_exam: {
        Row: {
          exam_name: string
          id: number
        }
        Insert: {
          exam_name: string
          id?: number
        }
        Update: {
          exam_name?: string
          id?: number
        }
        Relationships: []
      }
      syll_index: {
        Row: {
          category_id: number | null
          index_id: number
          index_name: string
          parent_index_id: number | null
          sequence: number | null
          syllabus_id: number
        }
        Insert: {
          category_id?: number | null
          index_id?: number
          index_name: string
          parent_index_id?: number | null
          sequence?: number | null
          syllabus_id: number
        }
        Update: {
          category_id?: number | null
          index_id?: number
          index_name?: string
          parent_index_id?: number | null
          sequence?: number | null
          syllabus_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "syll_index_category_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "syll_index_category"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "syll_index_parent_fkey"
            columns: ["parent_index_id"]
            isOneToOne: false
            referencedRelation: "syll_index"
            referencedColumns: ["index_id"]
          },
          {
            foreignKeyName: "syll_index_syllabus_fkey"
            columns: ["syllabus_id"]
            isOneToOne: false
            referencedRelation: "syll_syllabus_entity"
            referencedColumns: ["id"]
          }
        ]
      }
      syll_index_category: {
        Row: {
          category_id: number
          category_name: string
        }
        Insert: {
          category_id?: number
          category_name: string
        }
        Update: {
          category_id?: number
          category_name?: string
        }
        Relationships: []
      }
      syll_moderator: {
        Row: {
          id: number
          moderator_id: string
          syllabus_id: number
        }
        Insert: {
          id?: number
          moderator_id: string
          syllabus_id: number
        }
        Update: {
          id?: number
          moderator_id?: string
          syllabus_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "syll_moderator_syllabus_fkey"
            columns: ["syllabus_id"]
            isOneToOne: false
            referencedRelation: "syll_syllabus_entity"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "syll_moderator_user_fkey"
            columns: ["moderator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      syll_paper: {
        Row: {
          exam_id: number
          id: number
        }
        Insert: {
          exam_id: number
          id?: number
        }
        Update: {
          exam_id?: number
          id?: number
        }
        Relationships: []
      }
      syll_school: {
        Row: {
          id: number
          school_name: string
        }
        Insert: {
          id?: number
          school_name: string
        }
        Update: {
          id?: number
          school_name?: string
        }
        Relationships: []
      }
      syll_subject: {
        Row: {
          id: number
          subject_name: string
        }
        Insert: {
          id?: number
          subject_name: string
        }
        Update: {
          id?: number
          subject_name?: string
        }
        Relationships: []
      }
      syll_syllabus_entity: {
        Row: {
          class_id: number | null
          department_id: number | null
          id: number
          owner_id: string | null
          paper_id: number | null
          subject_id: number | null
          syllabus_name: string
          type_id: number
        }
        Insert: {
          class_id?: number | null
          department_id?: number | null
          id?: number
          owner_id?: string | null
          paper_id?: number | null
          subject_id?: number | null
          syllabus_name: string
          type_id: number
        }
        Update: {
          class_id?: number | null
          department_id?: number | null
          id?: number
          owner_id?: string | null
          paper_id?: number | null
          subject_id?: number | null
          syllabus_name?: string
          type_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "syll_syllabus_entity_class_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "syll_class"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "syll_syllabus_entity_department_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "syll_department"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "syll_syllabus_entity_owner_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "syll_syllabus_entity_paper_fkey"
            columns: ["paper_id"]
            isOneToOne: false
            referencedRelation: "syll_paper"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "syll_syllabus_entity_subject_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "syll_subject"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "syll_syllabus_entity_type_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "syllabus_type"
            referencedColumns: ["id"]
          }
        ]
      }
      syllabus_type: {
        Row: {
          id: number
          type_name: string
        }
        Insert: {
          id?: number
          type_name: string
        }
        Update: {
          id?: number
          type_name?: string
        }
        Relationships: []
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
