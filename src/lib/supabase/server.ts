import { createClient } from '@supabase/supabase-js';

// IMPORTANT: This function should only be used in server-side code.
// It uses the service_role key, which has admin privileges and must be kept secret.
export function createServerClient() {
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
