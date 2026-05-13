import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function test() {
  console.log("🔍 Testing Database Schema...");
  
  // Try to insert a dummy retouch to see what fails
  console.log("🧪 Attempting to insert dummy retouch...");
  const { data: proj } = await supabase.from('projets').select('id').limit(1).single();
  
  if (!proj) {
    console.error("❌ No projects found to test retouch insertion.");
    return;
  }

  const { error: insError } = await supabase.from('retouches').insert([{
    projet_id: proj.id,
    motif: 'test',
    description: 'test description',
    duree_heures: 1
  }]);

  if (insError) {
    console.error("❌ Retouches insertion error:", insError);
  } else {
    console.log("✅ Retouches insertion works!");
    // Delete the test row
    await supabase.from('retouches').delete().eq('motif', 'test');
  }
}

test();
