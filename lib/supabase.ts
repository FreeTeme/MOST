import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type User = {
  id: string;
  telegram_id: number;
  telegram_username: string | null;
  first_name: string | null;
  last_name: string | null;
  photo_url: string | null;
  user_type: "blogger" | "client";
  full_name: string | null;
  bio: string | null;
  company_name: string | null;
  company_category: string | null;
  company_description: string | null;
  created_at: string;
};
