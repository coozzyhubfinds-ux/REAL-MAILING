import { createClient } from '@supabase/supabase-js';

const { SUPABASE_URL, SUPABASE_KEY } = process.env;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn('Supabase credentials are missing. Ensure SUPABASE_URL and SUPABASE_KEY are set.');
}

const supabase = SUPABASE_URL && SUPABASE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

export const getSupabase = () => {
  if (!supabase) {
    throw new Error('Supabase client is not initialized. Provide SUPABASE_URL and SUPABASE_KEY.');
  }
  return supabase;
};

export default supabase;

