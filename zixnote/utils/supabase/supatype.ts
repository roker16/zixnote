export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.0.1 (cd38da5)";
  };
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      kpi_events: {
        Row: {
          created_at: string | null;
          event_type: string;
          id: number;
          metadata: Json | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          event_type: string;
          id?: number;
          metadata?: Json | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          event_type?: string;
          id?: number;
          metadata?: Json | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "kpi_events_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      notes: {
        Row: {
          ainotes_english: string | null;
          copied_from: string | null;
          created_at: string;
          id: number;
          index_id_fk: number;
          notes_english: string | null;
          notes_hindi: string | null;
          order: number;
          owner_fk: string;
          title: string;
          type: string;
          updated_at: string | null;
        };
        Insert: {
          ainotes_english?: string | null;
          copied_from?: string | null;
          created_at?: string;
          id?: number;
          index_id_fk: number;
          notes_english?: string | null;
          notes_hindi?: string | null;
          order: number;
          owner_fk: string;
          title?: string;
          type?: string;
          updated_at?: string | null;
        };
        Update: {
          ainotes_english?: string | null;
          copied_from?: string | null;
          created_at?: string;
          id?: number;
          index_id_fk?: number;
          notes_english?: string | null;
          notes_hindi?: string | null;
          order?: number;
          owner_fk?: string;
          title?: string;
          type?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "notes_copied_from_fkey";
            columns: ["copied_from"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_notes_index_id_fk_fkey";
            columns: ["index_id_fk"];
            isOneToOne: false;
            referencedRelation: "syll_index";
            referencedColumns: ["index_id"];
          },
          {
            foreignKeyName: "public_notes_owner_fk_fkey";
            columns: ["owner_fk"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      notes_sharing: {
        Row: {
          can_copy: boolean | null;
          can_edit: boolean | null;
          created_at: string;
          heading_id: number;
          id: number;
          is_public: boolean | null;
          shared_by: string;
          shared_with: string | null;
        };
        Insert: {
          can_copy?: boolean | null;
          can_edit?: boolean | null;
          created_at?: string;
          heading_id: number;
          id?: number;
          is_public?: boolean | null;
          shared_by?: string;
          shared_with?: string | null;
        };
        Update: {
          can_copy?: boolean | null;
          can_edit?: boolean | null;
          created_at?: string;
          heading_id?: number;
          id?: number;
          is_public?: boolean | null;
          shared_by?: string;
          shared_with?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "notes_sharing_heading_id_fkey";
            columns: ["heading_id"];
            isOneToOne: false;
            referencedRelation: "syll_index";
            referencedColumns: ["index_id"];
          },
          {
            foreignKeyName: "notes_sharing_shared_by_fkey";
            columns: ["shared_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notes_sharing_shared_with_fkey";
            columns: ["shared_with"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      pdf_extracted_texts: {
        Row: {
          description: string | null;
          extracted_text: string;
          file_name: string;
          id: number;
          index_id: number;
          uploaded_at: string | null;
          uploaded_by: string;
        };
        Insert: {
          description?: string | null;
          extracted_text: string;
          file_name: string;
          id?: number;
          index_id: number;
          uploaded_at?: string | null;
          uploaded_by: string;
        };
        Update: {
          description?: string | null;
          extracted_text?: string;
          file_name?: string;
          id?: number;
          index_id?: number;
          uploaded_at?: string | null;
          uploaded_by?: string;
        };
        Relationships: [
          {
            foreignKeyName: "pdf_extracted_texts_index_id_fkey";
            columns: ["index_id"];
            isOneToOne: false;
            referencedRelation: "syll_index";
            referencedColumns: ["index_id"];
          },
          {
            foreignKeyName: "pdf_extracted_texts_uploaded_by_fkey";
            columns: ["uploaded_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          email: string | null;
          full_name: string | null;
          id: string;
          updated_at: string | null;
          username: string | null;
          website: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          email?: string | null;
          full_name?: string | null;
          id: string;
          updated_at?: string | null;
          username?: string | null;
          website?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          updated_at?: string | null;
          username?: string | null;
          website?: string | null;
        };
        Relationships: [];
      };
      profiles_roles: {
        Row: {
          profile_id: string;
          role_id: number;
        };
        Insert: {
          profile_id: string;
          role_id: number;
        };
        Update: {
          profile_id?: string;
          role_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_roles_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "profiles_roles_role_id_fkey";
            columns: ["role_id"];
            isOneToOne: false;
            referencedRelation: "roles";
            referencedColumns: ["id"];
          }
        ];
      };
      roles: {
        Row: {
          description: string | null;
          id: number;
          role: string;
        };
        Insert: {
          description?: string | null;
          id?: number;
          role: string;
        };
        Update: {
          description?: string | null;
          id?: number;
          role?: string;
        };
        Relationships: [];
      };
      settings: {
        Row: {
          created_at: string;
          id: number;
          setting_name: string;
          setting_status: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          setting_name: string;
          setting_status: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          setting_name?: string;
          setting_status?: string;
        };
        Relationships: [];
      };
      subscription: {
        Row: {
          amount: number | null;
          end_date: string;
          id: number;
          payment_id: string;
          plan_name: string;
          start_date: string;
          status: string | null;
          user_id: string | null;
        };
        Insert: {
          amount?: number | null;
          end_date: string;
          id?: number;
          payment_id: string;
          plan_name: string;
          start_date: string;
          status?: string | null;
          user_id?: string | null;
        };
        Update: {
          amount?: number | null;
          end_date?: string;
          id?: number;
          payment_id?: string;
          plan_name?: string;
          start_date?: string;
          status?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "subscription_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      syll_class: {
        Row: {
          class_name: string;
          id: number;
          school_id: number;
        };
        Insert: {
          class_name: string;
          id?: number;
          school_id: number;
        };
        Update: {
          class_name?: string;
          id?: number;
          school_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "syll_class_school_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "syll_school";
            referencedColumns: ["id"];
          }
        ];
      };
      syll_college: {
        Row: {
          college_name: string;
          id: number;
        };
        Insert: {
          college_name: string;
          id?: number;
        };
        Update: {
          college_name?: string;
          id?: number;
        };
        Relationships: [];
      };
      syll_department: {
        Row: {
          college_id: number;
          department_name: string;
          id: number;
        };
        Insert: {
          college_id: number;
          department_name: string;
          id?: number;
        };
        Update: {
          college_id?: number;
          department_name?: string;
          id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "syll_department_college_fkey";
            columns: ["college_id"];
            isOneToOne: false;
            referencedRelation: "syll_college";
            referencedColumns: ["id"];
          }
        ];
      };
      syll_exam: {
        Row: {
          exam_name: string;
          id: number;
        };
        Insert: {
          exam_name: string;
          id?: number;
        };
        Update: {
          exam_name?: string;
          id?: number;
        };
        Relationships: [];
      };
      syll_index: {
        Row: {
          category_id: number;
          index_id: number;
          index_name: string;
          parent_index_id: number | null;
          sequence: number | null;
          syllabus_id: number;
        };
        Insert: {
          category_id: number;
          index_id?: number;
          index_name: string;
          parent_index_id?: number | null;
          sequence?: number | null;
          syllabus_id: number;
        };
        Update: {
          category_id?: number;
          index_id?: number;
          index_name?: string;
          parent_index_id?: number | null;
          sequence?: number | null;
          syllabus_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "syll_index_category_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "syll_index_category";
            referencedColumns: ["category_id"];
          },
          {
            foreignKeyName: "syll_index_parent_fkey";
            columns: ["parent_index_id"];
            isOneToOne: false;
            referencedRelation: "syll_index";
            referencedColumns: ["index_id"];
          },
          {
            foreignKeyName: "syll_index_syllabus_fkey";
            columns: ["syllabus_id"];
            isOneToOne: false;
            referencedRelation: "syll_syllabus_entity";
            referencedColumns: ["id"];
          }
        ];
      };
      syll_index_category: {
        Row: {
          category_id: number;
          category_name: string;
        };
        Insert: {
          category_id?: number;
          category_name: string;
        };
        Update: {
          category_id?: number;
          category_name?: string;
        };
        Relationships: [];
      };
      syll_moderator: {
        Row: {
          id: number;
          moderator_id: string;
          status: string | null;
          syllabus_id: number;
        };
        Insert: {
          id?: number;
          moderator_id: string;
          status?: string | null;
          syllabus_id: number;
        };
        Update: {
          id?: number;
          moderator_id?: string;
          status?: string | null;
          syllabus_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "syll_moderator_syllabus_fkey";
            columns: ["syllabus_id"];
            isOneToOne: false;
            referencedRelation: "syll_syllabus_entity";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "syll_moderator_user_fkey";
            columns: ["moderator_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      syll_paper: {
        Row: {
          exam_id: number;
          id: number;
          name: string;
        };
        Insert: {
          exam_id: number;
          id?: number;
          name: string;
        };
        Update: {
          exam_id?: number;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      syll_school: {
        Row: {
          id: number;
          school_name: string;
        };
        Insert: {
          id?: number;
          school_name: string;
        };
        Update: {
          id?: number;
          school_name?: string;
        };
        Relationships: [];
      };
      syll_subject: {
        Row: {
          id: number;
          subject_name: string;
        };
        Insert: {
          id?: number;
          subject_name: string;
        };
        Update: {
          id?: number;
          subject_name?: string;
        };
        Relationships: [];
      };
      syll_syllabus_entity: {
        Row: {
          class_id: number | null;
          department_id: number | null;
          id: number;
          owner_id: string | null;
          paper_id: number | null;
          subject_id: number | null;
          syllabus_name: string;
          type_id: number;
        };
        Insert: {
          class_id?: number | null;
          department_id?: number | null;
          id?: number;
          owner_id?: string | null;
          paper_id?: number | null;
          subject_id?: number | null;
          syllabus_name: string;
          type_id: number;
        };
        Update: {
          class_id?: number | null;
          department_id?: number | null;
          id?: number;
          owner_id?: string | null;
          paper_id?: number | null;
          subject_id?: number | null;
          syllabus_name?: string;
          type_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "syll_syllabus_entity_class_fkey";
            columns: ["class_id"];
            isOneToOne: false;
            referencedRelation: "syll_class";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "syll_syllabus_entity_department_fkey";
            columns: ["department_id"];
            isOneToOne: false;
            referencedRelation: "syll_department";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "syll_syllabus_entity_owner_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "syll_syllabus_entity_paper_fkey";
            columns: ["paper_id"];
            isOneToOne: false;
            referencedRelation: "syll_paper";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "syll_syllabus_entity_subject_fkey";
            columns: ["subject_id"];
            isOneToOne: false;
            referencedRelation: "syll_subject";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "syll_syllabus_entity_type_fkey";
            columns: ["type_id"];
            isOneToOne: false;
            referencedRelation: "syllabus_type";
            referencedColumns: ["id"];
          }
        ];
      };
      syllabus_type: {
        Row: {
          id: number;
          type_name: string;
        };
        Insert: {
          id?: number;
          type_name: string;
        };
        Update: {
          id?: number;
          type_name?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      latest_ai_drawer_events_per_user: {
        Row: {
          created_at: string | null;
          event_type: string | null;
          full_name: string | null;
          id: number | null;
          metadata: Json | null;
        };
        Relationships: [];
      };
      latest_note_updates_per_user: {
        Row: {
          created_at: string | null;
          event_type: string | null;
          full_name: string | null;
          id: number | null;
          metadata: Json | null;
          user_id: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "kpi_events_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null;
          avif_autodetection: boolean | null;
          created_at: string | null;
          file_size_limit: number | null;
          id: string;
          name: string;
          owner: string | null;
          owner_id: string | null;
          public: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id: string;
          name: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id?: string;
          name?: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      migrations: {
        Row: {
          executed_at: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Insert: {
          executed_at?: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Update: {
          executed_at?: string | null;
          hash?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      objects: {
        Row: {
          bucket_id: string | null;
          created_at: string | null;
          id: string;
          last_accessed_at: string | null;
          metadata: Json | null;
          name: string | null;
          owner: string | null;
          owner_id: string | null;
          path_tokens: string[] | null;
          updated_at: string | null;
          user_metadata: Json | null;
          version: string | null;
        };
        Insert: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          user_metadata?: Json | null;
          version?: string | null;
        };
        Update: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          user_metadata?: Json | null;
          version?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey";
            columns: ["bucket_id"];
            isOneToOne: false;
            referencedRelation: "buckets";
            referencedColumns: ["id"];
          }
        ];
      };
      s3_multipart_uploads: {
        Row: {
          bucket_id: string;
          created_at: string;
          id: string;
          in_progress_size: number;
          key: string;
          owner_id: string | null;
          upload_signature: string;
          user_metadata: Json | null;
          version: string;
        };
        Insert: {
          bucket_id: string;
          created_at?: string;
          id: string;
          in_progress_size?: number;
          key: string;
          owner_id?: string | null;
          upload_signature: string;
          user_metadata?: Json | null;
          version: string;
        };
        Update: {
          bucket_id?: string;
          created_at?: string;
          id?: string;
          in_progress_size?: number;
          key?: string;
          owner_id?: string | null;
          upload_signature?: string;
          user_metadata?: Json | null;
          version?: string;
        };
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey";
            columns: ["bucket_id"];
            isOneToOne: false;
            referencedRelation: "buckets";
            referencedColumns: ["id"];
          }
        ];
      };
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string;
          created_at: string;
          etag: string;
          id: string;
          key: string;
          owner_id: string | null;
          part_number: number;
          size: number;
          upload_id: string;
          version: string;
        };
        Insert: {
          bucket_id: string;
          created_at?: string;
          etag: string;
          id?: string;
          key: string;
          owner_id?: string | null;
          part_number: number;
          size?: number;
          upload_id: string;
          version: string;
        };
        Update: {
          bucket_id?: string;
          created_at?: string;
          etag?: string;
          id?: string;
          key?: string;
          owner_id?: string | null;
          part_number?: number;
          size?: number;
          upload_id?: string;
          version?: string;
        };
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey";
            columns: ["bucket_id"];
            isOneToOne: false;
            referencedRelation: "buckets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey";
            columns: ["upload_id"];
            isOneToOne: false;
            referencedRelation: "s3_multipart_uploads";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      can_insert_object: {
        Args: { bucketid: string; name: string; owner: string; metadata: Json };
        Returns: undefined;
      };
      extension: {
        Args: { name: string };
        Returns: string;
      };
      filename: {
        Args: { name: string };
        Returns: string;
      };
      foldername: {
        Args: { name: string };
        Returns: string[];
      };
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>;
        Returns: {
          size: number;
          bucket_id: string;
        }[];
      };
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string;
          prefix_param: string;
          delimiter_param: string;
          max_keys?: number;
          next_key_token?: string;
          next_upload_token?: string;
        };
        Returns: {
          key: string;
          id: string;
          created_at: string;
        }[];
      };
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string;
          prefix_param: string;
          delimiter_param: string;
          max_keys?: number;
          start_after?: string;
          next_token?: string;
        };
        Returns: {
          name: string;
          id: string;
          metadata: Json;
          updated_at: string;
        }[];
      };
      operation: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      search: {
        Args: {
          prefix: string;
          bucketname: string;
          limits?: number;
          levels?: number;
          offsets?: number;
          search?: string;
          sortcolumn?: string;
          sortorder?: string;
        };
        Returns: {
          name: string;
          id: string;
          updated_at: string;
          created_at: string;
          last_accessed_at: string;
          metadata: Json;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
  storage: {
    Enums: {},
  },
} as const;
