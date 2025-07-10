import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://zvrfpfiwfudsinpbjvzg.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2cmZwZml3ZnVkc2lucGJqdnpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0NTIwMjQsImV4cCI6MjA2NzAyODAyNH0.2ivGALn_nwXXIN55Pik0ATv5ywbYi32m0cPH0sCMalQ'

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

export default supabase;