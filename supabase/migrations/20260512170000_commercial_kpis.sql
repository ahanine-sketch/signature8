-- Migration: Add fields for Commercial KPIs

-- 1. Add date_premiere_reponse to demandes
ALTER TABLE "public"."demandes" ADD COLUMN IF NOT EXISTS "date_premiere_reponse" timestamp with time zone;

-- 2. Create depenses_marketing table
CREATE TABLE IF NOT EXISTS "public"."depenses_marketing" (
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "mois" date NOT NULL, -- Format: YYYY-MM-01
    "source" text NOT NULL,
    "montant_depense" numeric NOT NULL DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT now()
);

-- 3. Create objectifs_financiers table
CREATE TABLE IF NOT EXISTS "public"."objectifs_financiers" (
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "mois" date NOT NULL UNIQUE, -- Format: YYYY-MM-01 (unique per month to avoid duplicates)
    "objectif_ca" numeric NOT NULL DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT now()
);

-- Insert a default objective for the current month so the UI doesn't crash
INSERT INTO "public"."objectifs_financiers" ("mois", "objectif_ca") 
VALUES (date_trunc('month', current_date), 1000000)
ON CONFLICT ("mois") DO NOTHING;
