export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          badge_number: string;
          full_name: string;
          rank: string;
          service_points: number;
          department: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          badge_number?: string;
          full_name: string;
          rank?: string;
          service_points?: number;
          department?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          badge_number?: string;
          full_name?: string;
          rank?: string;
          service_points?: number;
          department?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      game_sessions: {
        Row: {
          id: string;
          user_id: string;
          active_case_id: string;
          virtual_time: string;
          investigation_budget_hours: number;
          ksip_queries_used: number;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          active_case_id: string;
          virtual_time?: string;
          investigation_budget_hours?: number;
          ksip_queries_used?: number;
          status?: string;
        };
        Update: {
          virtual_time?: string;
          investigation_budget_hours?: number;
          ksip_queries_used?: number;
          status?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      cases: {
        Row: {
          id: string;
          code: string;
          title: string;
          subtitle: string | null;
          required_rank: string;
          starting_budget_hours: number;
          ksip_queries_limit: number;
          reward_points: number;
          created_at: string;
        };
        Insert: {
          id: string;
          code: string;
          title: string;
          subtitle?: string | null;
          required_rank?: string;
          starting_budget_hours?: number;
          ksip_queries_limit?: number;
          reward_points?: number;
          created_at?: string;
        };
        Update: {
          code?: string;
          title?: string;
          subtitle?: string | null;
          required_rank?: string;
          starting_budget_hours?: number;
          ksip_queries_limit?: number;
          reward_points?: number;
        };
        Relationships: [];
      };
      documents: {
        Row: {
          id: string;
          case_id: string;
          title: string;
          doc_type: string;
          pages_count: number;
          content_html: string;
          available_at_start: boolean;
          unlocked_by_action_id: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          case_id: string;
          title: string;
          doc_type: string;
          pages_count?: number;
          content_html: string;
          available_at_start?: boolean;
          unlocked_by_action_id?: string | null;
          created_at?: string;
        };
        Update: {
          title?: string;
          doc_type?: string;
          pages_count?: number;
          content_html?: string;
          available_at_start?: boolean;
          unlocked_by_action_id?: string | null;
        };
        Relationships: [];
      };
      case_photos: {
        Row: {
          id: string;
          case_id: string;
          file_name: string;
          title: string;
          description: string;
          technician_notes: string | null;
          is_trap: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          case_id: string;
          file_name: string;
          title: string;
          description: string;
          technician_notes?: string | null;
          is_trap?: boolean;
          created_at?: string;
        };
        Update: {
          file_name?: string;
          title?: string;
          description?: string;
          technician_notes?: string | null;
          is_trap?: boolean;
        };
        Relationships: [];
      };
      ksip_records: {
        Row: {
          id: string;
          category: string;
          search_query: string;
          display_title: string;
          record_data: Json;
          is_meta_clue: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          category: string;
          search_query: string;
          display_title: string;
          record_data: Json;
          is_meta_clue?: boolean;
          created_at?: string;
        };
        Update: {
          category?: string;
          search_query?: string;
          display_title?: string;
          record_data?: Json;
          is_meta_clue?: boolean;
        };
        Relationships: [];
      };
      field_actions: {
        Row: {
          id: string;
          case_id: string;
          name: string;
          cost_hours: number;
          requires_superior_approval: boolean;
          result_document_ids: string[];
          created_at: string;
        };
        Insert: {
          id: string;
          case_id: string;
          name: string;
          cost_hours: number;
          requires_superior_approval?: boolean;
          result_document_ids?: string[];
          created_at?: string;
        };
        Update: {
          name?: string;
          cost_hours?: number;
          requires_superior_approval?: boolean;
          result_document_ids?: string[];
        };
        Relationships: [];
      };
      evidence_items: {
        Row: {
          id: string;
          session_id: string;
          case_id: string;
          document_id: string;
          evidence_type: string;
          quote_text: string;
          color: string;
          source_title: string;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          case_id: string;
          document_id: string;
          evidence_type: string;
          quote_text: string;
          color: string;
          source_title: string;
          metadata?: Json;
        };
        Update: {
          quote_text?: string;
          color?: string;
          metadata?: Json;
        };
        Relationships: [];
      };
      warrants: {
        Row: {
          id: string;
          session_id: string;
          case_id: string;
          suspect_name: string;
          alibi_evidence_ids: string[];
          presence_evidence_ids: string[];
          material_trace_evidence_ids: string[];
          motive_evidence_ids: string[];
          status: string;
          submitted_at: string | null;
        };
        Insert: {
          id?: string;
          session_id: string;
          case_id: string;
          suspect_name: string;
          alibi_evidence_ids?: string[];
          presence_evidence_ids?: string[];
          material_trace_evidence_ids?: string[];
          motive_evidence_ids?: string[];
          status?: string;
          submitted_at?: string | null;
        };
        Update: {
          suspect_name?: string;
          alibi_evidence_ids?: string[];
          presence_evidence_ids?: string[];
          material_trace_evidence_ids?: string[];
          motive_evidence_ids?: string[];
          status?: string;
          submitted_at?: string | null;
        };
        Relationships: [];
      };
      ksip_audit_log: {
        Row: {
          id: string;
          session_id: string;
          query_text: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          query_text: string;
          created_at?: string;
        };
        Update: {
          query_text?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
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
};
