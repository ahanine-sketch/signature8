import { supabase } from './lib/supabase';

const seed = async () => {
  console.log('🌱 Seeding database...');

  // 1. Responsables
  const { data: responsables, error: respError } = await supabase.from('responsables').upsert([
    { nom: 'Aymane Hanine', email: 'aymane@signature8.com', role: 'super_admin', actif: true },
    { nom: 'Sarah Designer', email: 'sarah@signature8.com', role: 'designer', actif: true },
    { nom: 'Hamza Manager', email: 'hamza@signature8.com', role: 'manager', actif: true }
  ], { onConflict: 'email' }).select();

  if (respError) {
    console.error('Error seeding responsables:', respError);
    return;
  }

  // 2. Clients
  const { data: clients, error: clientError } = await supabase.from('clients').upsert([
    { nom_complet: 'Marc-Antoine Lefèvre', email: 'marc@example.com', telephone: '+33 6 12 34 56 78', source_lead: 'instagram' },
    { nom_complet: 'Clara Valmont', email: 'clara@example.com', telephone: '+33 6 88 77 66 55', source_lead: 'whatsapp' },
    { nom_complet: 'Julien Sorel', email: 'julien@example.com', telephone: '+33 7 00 11 22 33', source_lead: 'site_web' }
  ], { onConflict: 'email' }).select();

  if (clientError) {
    console.error('Error seeding clients:', clientError);
    return;
  }

  // 3. Demandes
  const { data: demandes, error: demandeError } = await supabase.from('demandes').upsert([
    { 
      client_id: clients[0].id, 
      nom_complet: clients[0].nom_complet, 
      type_projet: 'residentiel', 
      description: 'Penthouse Design', 
      source: 'instagram', 
      statut: 'nouveau' 
    },
    { 
      client_id: clients[1].id, 
      nom_complet: clients[1].nom_complet, 
      type_projet: 'commercial', 
      description: 'Concept Store', 
      source: 'whatsapp', 
      statut: 'contacte' 
    }
  ]).select();

  if (demandeError) {
    console.error('Error seeding demandes:', demandeError);
    return;
  }

  // 4. Projets
  const { error: projetError } = await supabase.from('projets').upsert([
    {
      nom_projet: 'Projet #101 - Villa Anfa',
      client_id: clients[0].id,
      responsable_id: responsables[0].id,
      demande_id: demandes[0].id,
      type_projet: 'residentiel',
      surface_m2: 450,
      ville: 'Casablanca',
      statut: 'en_cours',
      avancement: 65,
      ca_total: 1250000
    }
  ]);

  if (projetError) {
    console.error('Error seeding projets:', projetError);
    return;
  }

  console.log('✅ Seeding complete!');
};

seed();
