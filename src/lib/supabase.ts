import { createClient } from '@supabase/supabase-js';
import type { Car } from './types';

// These should be in your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type TypedSupabaseClient = ReturnType<typeof createClient>;
export type SupabaseCar = Car;
