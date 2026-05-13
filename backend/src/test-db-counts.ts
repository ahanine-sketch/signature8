import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testDB() {
    console.log('Checking database contents...');
    
    const { data: projects, count: projCount } = await supabase.from('projets').select('*', { count: 'exact' });
    console.log(`Projets count: ${projCount}`);
    
    const { data: retouches, count: retCount } = await supabase.from('retouches').select('*', { count: 'exact' });
    console.log(`Retouches count: ${retCount}`);
    if (retouches && retouches.length > 0) {
        console.log('Retouches data:', JSON.stringify(retouches, null, 2));
    }

    const { data: responsables } = await supabase.from('responsables').select('email');
    console.log('Responsables emails:', responsables?.map(r => r.email));
}

testDB();
