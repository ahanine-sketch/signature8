import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the root of the backend folder
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

console.log("🛠️ [BACKEND] Supabase Config URL:", supabaseUrl);
console.log("🛠️ [BACKEND] Supabase Key Prefix:", supabaseServiceKey ? supabaseServiceKey.substring(0, 10) + "..." : "MISSING");

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('⚠️ Missing Supabase environment variables in backend/.env');
}


export const supabase = createClient(supabaseUrl, supabaseServiceKey);
