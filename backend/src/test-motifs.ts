import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const motifs = [
    'changement_client',
    'erreur_design',
    'contrainte_technique',
    'budget',
    'autre'
];

async function testMotifs() {
    console.log('Testing allowed motifs...');
    
    // Get a valid project and responsable id first
    const { data: project } = await supabase.from('projets').select('id').limit(1).single();
    const { data: resp } = await supabase.from('responsables').select('id').limit(1).single();

    if (!project || !resp) {
        console.error('Need at least one project and one responsable to test.');
        return;
    }

    for (const motif of motifs) {
        const { error } = await supabase.from('retouches').insert({
            projet_id: project.id,
            responsable_id: resp.id,
            motif: motif,
            duree_heures: 1,
            date_retouche: new Date().toISOString().split('T')[0]
        });

        if (error) {
            console.log(`❌ Motif "${motif}" failed:`, error.message);
        } else {
            console.log(`✅ Motif "${motif}" is allowed.`);
            // Clean up
            await supabase.from('retouches').delete().match({ motif: motif, duree_heures: 1 });
        }
    }
}

testMotifs();
