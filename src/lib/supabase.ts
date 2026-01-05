import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Car } from './types';

// This function is for use in SERVER-SIDE code (actions, route handlers, etc.)
export function getSupabaseServerClient() {
  // These are read from the .env.local file on the server
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and Anon Key must be provided.');
  }

  // No caching, create a new client each time to ensure env vars are fresh
  return createClient(supabaseUrl, supabaseAnonKey);
}

// This function is for use in CLIENT-SIDE code (components with 'use client')
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
