
import { createClient } from '@supabase/supabase-js';

// IMPORTANT: Never share your service role key with anyone.
// It should only be used on the server and must be kept secret.
// It is stored in the .env.local file.

// This function is for use in SERVER-SIDE code (actions, route handlers, etc.)
export function getSupabaseServerClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase URL and Service Key must be provided.');
  }

  // When using the service_role key, we can bypass RLS for server-side operations.
  // This is safe ONLY on the server.
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

// This function is for use in CLIENT-SIDE code (components with 'use client')
export function getSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Supabase URL and Anon Key must be provided in your .env.local file and configured in next.config.ts'
    );
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}
