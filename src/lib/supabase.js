import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let client;

if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase environment variables are missing! Using a safe dummy client.");
  
  // Create a safe dummy client that prevents crashes when methods are called
  const dummyAuth = {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: async () => ({ data: null, error: new Error('Supabase is not configured') }),
    signOut: async () => ({ error: null }),
  };

  client = new Proxy({ auth: dummyAuth }, {
    get: function(target, prop) {
      if (prop in target) return target[prop];
      
      // Return a chainable dummy function for database operations (e.g. supabase.from('...').select('...'))
      const chainable = () => new Proxy(() => {}, {
        get: () => chainable,
        apply: async () => ({ data: null, error: new Error('Supabase is not configured') })
      });
      return chainable;
    }
  });
} else {
  client = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: true, autoRefreshToken: true }
  });
}

export const supabase = client;
