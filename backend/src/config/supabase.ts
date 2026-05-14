import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the root of the backend folder
try {
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });
} catch (e) {}

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ CRITICAL: Missing Supabase environment variables!');
}

/**
 * Service Role Client — used ONLY for server-side data queries.
 * NEVER call supabase.auth.signIn/signOut on this client.
 * persistSession: false ensures auth state is never stored in memory.
 */
let _serviceClient: SupabaseClient | null = null;

function getServiceClient(): SupabaseClient {
  if (!_serviceClient) {
    if (!supabaseUrl || !supabaseServiceKey) {
      const err: any = new Error('Backend misconfigured: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set.');
      err.status = 503;
      throw err;
    }
    console.log('🔧 [SUPABASE] Creating service role client for URL:', supabaseUrl);
    _serviceClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    });
  }
  return _serviceClient;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getServiceClient() as any)[prop];
  },
});

/**
 * Auth Client Factory — creates a FRESH, isolated client for each auth operation.
 * This prevents user JWT sessions from leaking into the service role client.
 * Call this ONLY inside AuthService for login/logout/verify.
 */
export function createAuthClient(): SupabaseClient {
  if (!supabaseUrl || !supabaseServiceKey) {
    const err: any = new Error('Backend misconfigured.');
    err.status = 503;
    throw err;
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}
