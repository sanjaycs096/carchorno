import { createClient } from '@supabase/supabase-js';

// This function is for use in client-side code (components with 'use client')
// It uses the anon key, which is safe to expose in the browser.
export function createBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Supabase URL and Anon Key must be provided in your environment variables.'
    );
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}
