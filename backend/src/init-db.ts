import { supabase } from './config/supabase';

async function initDb() {
  console.log('🚀 Starting Database Initialization...');

  const sqlCommands = [
    `ALTER TABLE "public"."demandes" ADD COLUMN IF NOT EXISTS "date_premiere_reponse" timestamp with time zone;`,
    
    `CREATE TABLE IF NOT EXISTS "public"."depenses_marketing" (
        "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        "mois" date NOT NULL, 
        "source" text NOT NULL,
        "montant_depense" numeric NOT NULL DEFAULT 0,
        "created_at" timestamp with time zone DEFAULT now()
    );`,

    `CREATE TABLE IF NOT EXISTS "public"."objectifs_financiers" (
        "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        "mois" date NOT NULL UNIQUE, 
        "objectif_ca" numeric NOT NULL DEFAULT 0,
        "created_at" timestamp with time zone DEFAULT now()
    );`
  ];

  for (const sql of sqlCommands) {
    console.log(`Executing: ${sql.substring(0, 50)}...`);
    const { error } = await supabase.rpc('run_raw_sql', { sql_query: sql });
    
    if (error) {
      // If RPC fails, it might be because run_raw_sql doesn't exist
      console.warn('RPC run_raw_sql failed, trying direct query if possible (Note: common in Supabase to require RPC for raw SQL)');
      console.error(error);
    } else {
      console.log('✅ Success');
    }
  }

  console.log('🏁 Initialization finished.');
}

initDb();
