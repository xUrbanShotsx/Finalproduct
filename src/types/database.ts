import type { Industry, ModuleKey } from "@/config/modules";
import type { PricingTier as PricingTierAlias } from "@/config/pricing";

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      organisations: {
        Row: {
          id: string;
          name: string;
          industry: Industry;
          tier: PricingTierAlias;
          storage_used_bytes: number;
          ai_tokens_used: number;
          ai_tokens_reset_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["organisations"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["organisations"]["Insert"]>;
      };
      profiles: {
        Row: {
          id: string;
          org_id: string;
          full_name: string;
          role: "owner" | "admin" | "manager" | "worker";
          avatar_url: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      incidents: {
        Row: {
          id: string;
          org_id: string;
          title: string;
          description: string;
          severity: "near-miss" | "minor" | "moderate" | "serious" | "critical";
          status: "open" | "under-investigation" | "closed";
          reported_by: string;
          occurred_at: string;
          location: string | null;
          attachments: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["incidents"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["incidents"]["Insert"]>;
      };
      actions: {
        Row: {
          id: string;
          org_id: string;
          title: string;
          description: string;
          status: "open" | "in-progress" | "completed" | "overdue";
          priority: "low" | "medium" | "high" | "critical";
          assigned_to: string | null;
          due_date: string | null;
          linked_module: ModuleKey | null;
          linked_record_id: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["actions"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["actions"]["Insert"]>;
      };
      ai_usage: {
        Row: {
          id: string;
          org_id: string;
          feature: string;
          model: string;
          input_tokens: number;
          output_tokens: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["ai_usage"]["Row"], "id" | "created_at">;
        Update: never;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
