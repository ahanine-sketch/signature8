import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the root of the backend folder
try {
  dotenv.config({ path: path.resolve(process.cwd(), '.env') });
} catch (e) {}

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ CRITICAL: Missing Supabase environment variables! Check Vercel Dashboard → Environment Variables.');
}

// Use a lazy getter to fail fast (503) on missing env vars instead of
// creating a placeholder client that hangs on DNS lookup for 10+ seconds.
function getSupabaseClient(): SupabaseClient {
  if (!supabaseUrl || !supabaseServiceKey) {
    const err: any = new Error('Backend misconfigured: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set.');
    err.status = 503;
    throw err;
  }
  return createClient(supabaseUrl, supabaseServiceKey);
}

// Singleton — only created if env vars are present
let _client: SupabaseClient | null = null;

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (!_client) _client = getSupabaseClient();
    return (_client as any)[prop];
  }
});
