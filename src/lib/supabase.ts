import { createClient } from '@supabase/supabase-js';

let supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
let supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

// Detect if URL and Anon Key were swapped in environment variables
if (supabaseUrl.startsWith('eyJ') && supabaseAnonKey.startsWith('http')) {
  const temp = supabaseUrl;
  supabaseUrl = supabaseAnonKey;
  supabaseAnonKey = temp;
}

// Fallback if URL is missing or still invalid
if (!supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
  supabaseUrl = 'https://mvrgpzlhvllsmyknisof.supabase.co';
}

if (!supabaseAnonKey) {
  supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key';
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

