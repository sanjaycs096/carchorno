import { createClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';

// This admin client is used for server-side operations that require
// elevated privileges, bypassing RLS. It should only be used in
// server-side code (e.g., Server Components, Route Handlers, Server Actions).

// Note: supabaseUrl and supabaseServiceKey are dredged up from
// process.env.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase URL and Service Key must be provided.');
}

// The admin client uses the service_role key, which bypasses RLS.
// MAKE SURE THIS IS ONLY EVER USED ON THE SERVER.
export const adminClient = () => {
  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
