import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Car } from './types';

// Cached Supabase client for server-side
let supabase: SupabaseClient | undefined;

// This function is for use in SERVER-SIDE code (actions, route handlers, etc.)
export function getSupabaseServerClient() {
  if (supabase) {
    return supabase;
  }

  // These are read from the .env.local file on the server
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and Anon Key must be provided.');
  }

  supabase = createClient(supabaseUrl, supabaseAnonKey);
  return supabase;
}

// This function is for use in CLIENT-SIDE code (components with 'use client')
// It's good practice to have a separate getter for the client-side to avoid bundling
// server-only environment variables in the client bundle.
export function getSupabaseBrowserClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase URL and Anon Key must be provided in your .env.local file and prefixed with NEXT_PUBLIC_');
    }

    return createClient(supabaseUrl, supabaseAnonKey);
}


export type TypedSupabaseClient = ReturnType<typeof createClient>;
export type SupabaseCar = Car;
