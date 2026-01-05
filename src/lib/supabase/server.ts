'use server';
import { createServerClient as createSupabaseServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// This is a server-only module. It can be used in Server Actions or Route Handlers.
// It is NOT for use in client-side code.
export function createServerClient() {
  const cookieStore = cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase URL and Service Key must be provided.');
  }

  return createSupabaseServerClient(supabaseUrl, supabaseServiceKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
    },
    auth: {
      // IMPORTANT:
      // We are using the service_role key here, which has admin privileges.
      // We must explicitly tell the Supabase client to bypass RLS for all queries.
      // This is safe ONLY on the server.
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
