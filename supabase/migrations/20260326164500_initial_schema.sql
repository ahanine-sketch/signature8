-- Signature 8 - Initial Database Schema (PostgreSQL)
-- Optimized for Supabase

-- 0. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CLIENTS
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom_complet TEXT NOT NULL,
    email TEXT UNIQUE,
    telephone TEXT,
    whatsapp TEXT,
    ville TEXT,
    source_lead TEXT CHECK (source_lead IN ('instagram','whatsapp','site_web','reference','facebook','youtube','bouche_a_oreille','autre')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. RESPONSABLES
CREATE TABLE IF NOT EXISTS responsables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom TEXT NOT NULL,
    email TEXT UNIQUE,
    role TEXT CHECK (role IN ('super_admin', 'admin', 'designer', 'manager', 'lecture_seule')),
    actif BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. DEMANDES
CREATE TABLE IF NOT EXISTS demandes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    nom_complet TEXT NOT NULL,
    email TEXT,
    telephone TEXT,
    type_projet TEXT CHECK (type_projet IN ('residentiel','commercial','professionnel','autre')),
    description TEXT,
    budget_estime DECIMAL(12,2),
    source TEXT CHECK (source IN ('formulaire_site','whatsapp','instagram','facebook','appel','reference','autre')),
    statut TEXT DEFAULT 'nouveau' CHECK (statut IN ('nouveau','contacte','qualifie','converti','abandonne')),
    date_demande TIMESTAMPTZ DEFAULT now(),
    notes_internes TEXT
);

-- 4. PROJETS
CREATE TABLE IF NOT EXISTS projets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom_projet TEXT NOT NULL,
    client_id UUID REFERENCES clients(id) NOT NULL,
    responsable_id UUID REFERENCES responsables(id),
    demande_id UUID REFERENCES demandes(id) ON DELETE SET NULL,
    type_projet TEXT CHECK (type_projet IN ('residentiel','commercial','professionnel')),
    surface_m2 DECIMAL(8,2),
    ville TEXT,
    date_debut DATE,
    date_fin_prevue DATE,
    date_fin_reelle DATE,
    avancement INT DEFAULT 0 CHECK (avancement BETWEEN 0 AND 100),
    statut TEXT DEFAULT 'en_attente' CHECK (statut IN ('en_attente','en_cours','en_retard','termine','annule')),
    satisfaction DECIMAL(3,1),
    ca_total DECIMAL(12,2),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. DEVIS
CREATE TABLE IF NOT EXISTS devis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    projet_id UUID REFERENCES projets(id) ON DELETE CASCADE,
    numero_devis TEXT UNIQUE NOT NULL,
    montant_ht DECIMAL(12,2),
    montant_ttc DECIMAL(12,2),
    statut TEXT DEFAULT 'brouillon' CHECK (statut IN ('brouillon','envoye','accepte','refuse','expire')),
    date_emission DATE DEFAULT CURRENT_DATE,
    date_validite DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. RETOUCHES
CREATE TABLE IF NOT EXISTS retouches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    projet_id UUID REFERENCES projets(id) ON DELETE CASCADE,
    responsable_id UUID REFERENCES responsables(id),
    date_retouche DATE NOT NULL DEFAULT CURRENT_DATE,
    motif TEXT CHECK (motif IN ('changement_client','erreur_design','contrainte_technique','budget','autre')),
    description TEXT,
    duree_heures DECIMAL(5,2),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. PAIEMENTS
CREATE TABLE IF NOT EXISTS paiements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    projet_id UUID REFERENCES projets(id) ON DELETE CASCADE,
    etape TEXT CHECK (etape IN ('acompte','avancement_1','avancement_2','solde','autre')),
    montant DECIMAL(12,2) NOT NULL,
    date_paiement DATE,
    statut TEXT DEFAULT 'en_attente' CHECK (statut IN ('en_attente','recu','en_retard')),
    mode_paiement TEXT CHECK (mode_paiement IN ('virement','cheque','cash','autre')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE responsables ENABLE ROW LEVEL SECURITY;
ALTER TABLE demandes ENABLE ROW LEVEL SECURITY;
ALTER TABLE projets ENABLE ROW LEVEL SECURITY;
ALTER TABLE devis ENABLE ROW LEVEL SECURITY;
ALTER TABLE retouches ENABLE ROW LEVEL SECURITY;
ALTER TABLE paiements ENABLE ROW LEVEL SECURITY;
