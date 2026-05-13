import { supabase } from '../config/supabase';

export class OperationalService {
  static async getOperationalKpis() {
    // 1. Fetch Projets
    const { data: projects, error: projError } = await supabase
      .from('projets')
      .select('*, responsables(nom, avatar_url)');

    if (projError) throw projError;

    // 2. Fetch Retouches (if table exists and has data)
    const { data: retouches, error: retError } = await supabase
      .from('retouches')
      .select('*, projets(nom_projet, type_projet), responsables(nom, avatar_url)');

    // Calculate Completion Rate
    const totalProjects = projects?.length || 0;
    const completedProjects = projects?.filter(p => p.statut === 'termine' || p.statut === 'livre').length || 0;
    const completionRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;

    // Calculate Average Duration of retouches (impact)
    let totalRetouchDays = 0;
    let retouchCount = 0;
    
    if (retouches && retouches.length > 0) {
      retouches.forEach(r => {
        const days = Number(r.duree_heures) || 0;
        if (days > 0) {
          totalRetouchDays += days;
          retouchCount++;
        }
      });
    }

    const avgDuration = retouchCount > 0 
      ? Number((totalRetouchDays / retouchCount).toFixed(1)).toString() 
      : "0";

    // Calculate Retouch Rate (unique projects with retouches / total projects)
    const uniqueProjectsWithRetouches = new Set(retouches?.map(r => r.projet_id)).size;
    const retouchRate = totalProjects > 0 
      ? Math.round((uniqueProjectsWithRetouches / totalProjects) * 100) 
      : 0;


    // Map retouches for the table
    const tableData = (retouches && retouches.length > 0) ? retouches.map(r => {
      // The user inputs 'duree_heures' but expects it to be treated as Days ("3 jrs et 2 pour 4 jrs")
      const formattedJours = r.duree_heures ? r.duree_heures.toString() : "0";
      
      return {
        project: r.projets?.nom_projet || "Projet Inconnu",
        sector: r.projets?.type_projet === 'commercial' ? 'Corporate' : 'Résidentiel Luxe',
        manager: r.responsables?.nom || "Non assigné",
        avatar: r.responsables?.avatar_url,
        cycles: "1 cycle", // Default since column doesn't exist
        reason: r.motif || "Ajustement standard",
        impact: `+${formattedJours} Jours`,
        isCritical: (r.duree_heures || 0) > 40, // Keeping 40 as critical threshold for now
        initials: r.responsables?.nom ? r.responsables.nom.split(' ').map((n: string) => n[0]).join('') : "???"
      };
    }) : [];

    return {
      stats: [
        { 
          label: "Taux d'achèvement", 
          value: completionRate, 
          target: 90, 
          sub: totalProjects > 0 
            ? `${completedProjects} projet${completedProjects > 1 ? 's' : ''} livré${completedProjects > 1 ? 's' : ''} sur ${totalProjects} planifié${totalProjects > 1 ? 's' : ''}.` 
            : "Aucun projet planifié."
        },
        { 
          label: "Durée moyenne", 
          value: avgDuration, 
          unit: "Jours", 
          trend: retouchCount > 0 ? undefined : "N/A", 
          sub: retouchCount > 0 ? "Temps moyen d'impact" : "Aucune donnée" 
        },
        { 
          label: "Taux de retouches", 
          value: `${retouchRate}%`, 
          sub: retouchRate === 0 ? "Qualité parfaite ce mois" : "Projets ayant nécessité des retouches" 
        }
      ],
      retouchTable: tableData
    };

  }
}
