export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      instance_agents: {
        Row: {
          agent_id: string
          capabilities: string[] | null
          created_at: string | null
          display_order: number | null
          heartbeat_active_hours_end: string | null
          heartbeat_active_hours_start: string | null
          heartbeat_active_hours_tz: string | null
          heartbeat_enabled: boolean | null
          heartbeat_every: string | null
          heartbeat_target: string | null
          id: string
          instance_id: string
          is_default: boolean | null
          level: string
          max_concurrent_tasks: number | null
          model: string | null
          org_id: string
          role_description: string | null
          soul_md: string | null
          status: string
          updated_at: string | null
          workspace_path: string
        }
        Insert: {
          agent_id: string
          capabilities?: string[] | null
          created_at?: string | null
          display_order?: number | null
          heartbeat_active_hours_end?: string | null
          heartbeat_active_hours_start?: string | null
          heartbeat_active_hours_tz?: string | null
          heartbeat_enabled?: boolean | null
          heartbeat_every?: string | null
          heartbeat_target?: string | null
          id?: string
          instance_id: string
          is_default?: boolean | null
          level?: string
          max_concurrent_tasks?: number | null
          model?: string | null
          org_id: string
          role_description?: string | null
          soul_md?: string | null
          status?: string
          updated_at?: string | null
          workspace_path: string
        }
        Update: {
          agent_id?: string
          capabilities?: string[] | null
          created_at?: string | null
          display_order?: number | null
          heartbeat_active_hours_end?: string | null
          heartbeat_active_hours_start?: string | null
          heartbeat_active_hours_tz?: string | null
          heartbeat_enabled?: boolean | null
          heartbeat_every?: string | null
          heartbeat_target?: string | null
          id?: string
          instance_id?: string
          is_default?: boolean | null
          level?: string
          max_concurrent_tasks?: number | null
          model?: string | null
          org_id?: string
          role_description?: string | null
          soul_md?: string | null
          status?: string
          updated_at?: string | null
          workspace_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "instance_agents_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      instance_audit_logs: {
        Row: {
          created_at: string
          id: string
          instance_id: string
          ip_address: string | null
          jwt_claims: Json | null
          org_id: string
          payload: Json
          rate_limit_remaining: number | null
          user_agent: string | null
          verification_error: string | null
          verified: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          instance_id: string
          ip_address?: string | null
          jwt_claims?: Json | null
          org_id: string
          payload: Json
          rate_limit_remaining?: number | null
          user_agent?: string | null
          verification_error?: string | null
          verified?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          instance_id?: string
          ip_address?: string | null
          jwt_claims?: Json | null
          org_id?: string
          payload?: Json
          rate_limit_remaining?: number | null
          user_agent?: string | null
          verification_error?: string | null
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "instance_audit_logs_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      instance_secrets: {
        Row: {
          created_at: string | null
          id: string
          instance_id: string
          key: string
          org_id: string
          ssm_path: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          instance_id: string
          key: string
          org_id: string
          ssm_path: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          instance_id?: string
          key?: string
          org_id?: string
          ssm_path?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "instance_secrets_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          created_at: string | null
          email: string
          id: string
          org_id: string | null
          role: string | null
          stytch_member_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          org_id?: string | null
          role?: string | null
          stytch_member_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          org_id?: string | null
          role?: string | null
          stytch_member_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "members_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string | null
          credit_balance_cents: number | null
          customer_id: string | null
          has_access: boolean | null
          id: string
          name: string
          price_id: string | null
          slug: string
          stytch_org_id: string
          subscription_id: string | null
          subscription_item_id: string | null
          trial_ends_at: string | null
          trial_started_at: string | null
        }
        Insert: {
          created_at?: string | null
          credit_balance_cents?: number | null
          customer_id?: string | null
          has_access?: boolean | null
          id?: string
          name: string
          price_id?: string | null
          slug: string
          stytch_org_id: string
          subscription_id?: string | null
          subscription_item_id?: string | null
          trial_ends_at?: string | null
          trial_started_at?: string | null
        }
        Update: {
          created_at?: string | null
          credit_balance_cents?: number | null
          customer_id?: string | null
          has_access?: boolean | null
          id?: string
          name?: string
          price_id?: string | null
          slug?: string
          stytch_org_id?: string
          subscription_id?: string | null
          subscription_item_id?: string | null
          trial_ends_at?: string | null
          trial_started_at?: string | null
        }
        Relationships: []
      }
      project_secrets: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          is_secret: boolean
          key: string
          project_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id?: string
          is_secret?: boolean
          key: string
          project_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          is_secret?: boolean
          key?: string
          project_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_secrets_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string | null
          ecs_task_arn: string | null
          gateway_token: string | null
          id: string
          name: string
          org_id: string
          setup_phase: string | null
          setup_started_at: string | null
          started_at: string | null
          status: string | null
          stopped_at: string | null
          template: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          ecs_task_arn?: string | null
          gateway_token?: string | null
          id?: string
          name: string
          org_id: string
          setup_phase?: string | null
          setup_started_at?: string | null
          started_at?: string | null
          status?: string | null
          stopped_at?: string | null
          template?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          ecs_task_arn?: string | null
          gateway_token?: string | null
          id?: string
          name?: string
          org_id?: string
          setup_phase?: string | null
          setup_started_at?: string | null
          started_at?: string | null
          status?: string | null
          stopped_at?: string | null
          template?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      shared_tasks: {
        Row: {
          assigned_agent_id: string | null
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          instance_id: string
          org_id: string
          priority: number | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_agent_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          instance_id: string
          org_id: string
          priority?: number | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_agent_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          instance_id?: string
          org_id?: string
          priority?: number | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shared_tasks_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      standup_reports: {
        Row: {
          agent_activity: Json | null
          created_at: string | null
          id: string
          instance_id: string
          org_id: string
          report_date: string
          summary_md: string
          tasks_completed: number | null
          tasks_created: number | null
          tasks_in_progress: number | null
        }
        Insert: {
          agent_activity?: Json | null
          created_at?: string | null
          id?: string
          instance_id: string
          org_id: string
          report_date: string
          summary_md: string
          tasks_completed?: number | null
          tasks_created?: number | null
          tasks_in_progress?: number | null
        }
        Update: {
          agent_activity?: Json | null
          created_at?: string | null
          id?: string
          instance_id?: string
          org_id?: string
          report_date?: string
          summary_md?: string
          tasks_completed?: number | null
          tasks_created?: number | null
          tasks_in_progress?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "standup_reports_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      task_assignments: {
        Row: {
          agent_id: string | null
          assigned_at: string | null
          id: string
          member_id: string | null
          task_id: string
        }
        Insert: {
          agent_id?: string | null
          assigned_at?: string | null
          id?: string
          member_id?: string | null
          task_id: string
        }
        Update: {
          agent_id?: string | null
          assigned_at?: string | null
          id?: string
          member_id?: string | null
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_assignments_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_assignments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_comments: {
        Row: {
          author_id: string
          author_type: string
          content: string
          created_at: string | null
          id: string
          instance_id: string
          org_id: string
          task_id: string
        }
        Insert: {
          author_id: string
          author_type: string
          content: string
          created_at?: string | null
          id?: string
          instance_id: string
          org_id: string
          task_id: string
        }
        Update: {
          author_id?: string
          author_type?: string
          content?: string
          created_at?: string | null
          id?: string
          instance_id?: string
          org_id?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_comments_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_comments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "shared_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_messages: {
        Row: {
          agent_id: string | null
          content: string
          created_at: string | null
          id: string
          member_id: string | null
          task_id: string
        }
        Insert: {
          agent_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          member_id?: string | null
          task_id: string
        }
        Update: {
          agent_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          member_id?: string | null
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_messages_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_messages_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_subscriptions: {
        Row: {
          created_at: string | null
          id: string
          instance_id: string
          subscriber_id: string
          subscriber_type: string
          task_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          instance_id: string
          subscriber_id: string
          subscriber_type: string
          task_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          instance_id?: string
          subscriber_id?: string
          subscriber_type?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_subscriptions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "shared_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          created_at: string | null
          created_by_member_id: string | null
          description: string | null
          id: string
          priority: string | null
          project_id: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by_member_id?: string | null
          description?: string | null
          id?: string
          priority?: string | null
          project_id: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by_member_id?: string | null
          description?: string | null
          id?: string
          priority?: string | null
          project_id?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_created_by_member_id_fkey"
            columns: ["created_by_member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_credits: {
        Args: { p_amount: number; p_org_id: string }
        Returns: number
      }
      deduct_credits: {
        Args: { p_amount: number; p_org_id: string }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
