import { createClient } from "@supabase/supabase-js";
import type { User, SocialAccount, Order, Application, Review } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export type { User, SocialAccount, Order, Application, Review };
