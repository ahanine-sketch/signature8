import { supabase } from '../config/supabase';

export class CommercialService {
  private static getFirstDayOfMonth() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}-01`;
  }

  static async getCommercialKpis() {
    const currentMonthStr = this.getFirstDayOfMonth();
    const currentMonthStart = new Date(currentMonthStr);

    // --- 1. BASIC COUNTS (TOTALS) ---
    const { count: totalDemandesRaw } = await supabase.from('demandes').select('*', { count: 'exact', head: true });
    const { count: totalProjetsRaw } = await supabase.from('projets').select('*', { count: 'exact', head: true });
    const { count: totalDevisRaw } = await supabase.from('devis').select('*', { count: 'exact', head: true });
    
    const totalDemandes = totalDemandesRaw || 0;
    const totalProjets = totalProjetsRaw || 0;
    const totalDevis = totalDevisRaw || 0;

    // --- 2. QUALIFICATION & CONVERSION ---
    const { count: qualifiedRaw } = await supabase.from('demandes').select('*', { count: 'exact', head: true }).neq('statut', 'nouveau');
    const qualified = qualifiedRaw || 0;
    
    const tauxQualification = totalDemandes ? Math.round((qualified / totalDemandes) * 100) : 0;
    const tauxConversion = totalDemandes ? Math.round((totalProjets / totalDemandes) * 100) : 0;

    // --- 3. PROJECT STATS ---
    const { data: projets } = await supabase.from('projets').select('ca_total, statut, created_at');
    const totalRevenue = projets?.reduce((acc, p) => acc + (p.ca_total || 0), 0) || 0;
    const panierMoyen = totalProjets ? totalRevenue / totalProjets : 0;
    const projetsEnAttente = projets?.filter(p => p.statut === 'en_cours' || p.statut === 'en_attente').length || 0;
    const valeurPipeline = projets?.filter(p => p.statut === 'en_cours' || p.statut === 'en_attente')
                                   .reduce((acc, p) => acc + (p.ca_total || 0), 0) || 0;

    // --- 4. DEPENSES MARKETING ---
    const { data: depensesMarketing } = await supabase.from('depenses_marketing').select('montant_depense').eq('mois', currentMonthStr);
    const totalMarketing = depensesMarketing?.reduce((acc, d) => acc + (d.montant_depense || 0), 0) || 0;

    // --- 5. RESPONSE TIME ---
    const { data: leadsWithResponse } = await supabase
      .from('demandes')
      .select('date_demande, date_premiere_reponse')
      .not('date_premiere_reponse', 'is', null);

    let avgResponseTime = 0;
    if (leadsWithResponse && leadsWithResponse.length > 0) {
      const totalTime = leadsWithResponse.reduce((acc, lead) => {
        const start = new Date(lead.date_demande);
        const end = new Date(lead.date_premiere_reponse);
        return acc + (end.getTime() - start.getTime());
      }, 0);
      avgResponseTime = Math.round((totalTime / (1000 * 60 * 60 * leadsWithResponse.length)) * 10) / 10;
    }

    // --- 6. CAC ---
    const currentMonthProjectsCount = projets?.filter(p => p.created_at && new Date(p.created_at) >= currentMonthStart).length || 0;
    const cacValue = currentMonthProjectsCount > 0 ? formatCurrency(totalMarketing / currentMonthProjectsCount) : "0";

    // --- 7. OBJECTIF MENSUEL ---
    let objectifPercentage = 0;
    let objectifTrend = "Aucun objectif défini";
    
    try {
      const { data: objectiveData } = await supabase
        .from('objectifs_financiers')
        .select('objectif_ca')
        .eq('mois', currentMonthStr)
        .maybeSingle();

      if (objectiveData) {
        const objectiveCA = objectiveData.objectif_ca;
        
        if (objectiveCA > 0) {
          const currentMonthRevenue = projets?.filter(p => p.created_at && new Date(p.created_at) >= currentMonthStart)
                                              .reduce((acc, p) => acc + (p.ca_total || 0), 0) || 0;
          
          objectifPercentage = Math.round((currentMonthRevenue / objectiveCA) * 100);
          
          if (currentMonthRevenue === 0) {
            objectifTrend = `0 MAD ce mois (Cible: ${formatCurrency(objectiveCA)})`;
          } else {
            objectifTrend = `${formatCurrency(currentMonthRevenue)} MAD / ${formatCurrency(objectiveCA)}`;
          }
        }
      }
    } catch (e) {
      console.error('DEBUG - Error calculating Objectif:', e);
    }

    // --- 8. RECENT LEADS (Filtered for config response logging) ---
    const { data: recentLeads } = await supabase
      .from('demandes')
      .select('id, nom_complet, date_demande, source')
      .is('date_premiere_reponse', null)
      .order('date_demande', { ascending: false })
      .limit(5);

    // Funnel Data
    const funnelData = [
      { label: "Leads Entrants", value: (totalDemandes || 0).toString(), percentage: "100%", width: "100%", color: "from-[#755a23] to-[#b8975a]" },
      { label: "Qualifiés", value: (qualified || 0).toString(), percentage: `${tauxQualification}%`, width: `${tauxQualification}%`, color: "from-[#664e1e] to-[#a38650]", insight: "Qualification par diagnostic" },
      { label: "Devis envoyés", value: (totalDevis || 0).toString(), percentage: (totalDemandes || 0) > 0 ? `${Math.round(((totalDevis || 0) / (totalDemandes || 1)) * 100)}%` : "0%", width: (totalDemandes || 0) > 0 ? `${Math.round(((totalDevis || 0) / (totalDemandes || 1)) * 100)}%` : "0%", color: "from-[#574219] to-[#8f7546]", insight: "Propositions architecturales" },
      { label: "Projets signés", value: (totalProjets || 0).toString(), percentage: `${tauxConversion}%`, width: `${tauxConversion}%`, color: "from-[#453000] to-[#755a23]", final: "Signature Finale" },
    ];

    return {
      kpiStats: [
        { id: "canaux", label: "Nombre de canaux", value: "05", trend: "+1 Récent", trendUp: true, icon: "Share2", size: "small" },
        { id: "qualification", label: "Taux qualification", value: `${tauxQualification}%`, trend: "Calculé", trendStable: true, icon: "ShieldCheck", size: "small" },
        { id: "conversion", label: "Taux conversion", value: `${tauxConversion}%`, trend: "En hausse", trendUp: true, icon: "RefreshCcw", size: "small" },
        { id: "panier", label: "Panier Moyen", value: formatCurrency(panierMoyen), unit: "MAD", trend: "VS M-1", trendDown: false, trendUp: true, icon: "TrendingUp", size: "small" },
        { id: "response", label: "Lead Response Time", value: avgResponseTime.toString(), unit: "h", trend: "Temps réel", trendUp: true, icon: "Timer", size: "small" },
        { 
          id: "cac", 
          label: currentMonthProjectsCount > 0 ? "Coût d'Acquisition" : "Dépenses Marketing", 
          value: currentMonthProjectsCount > 0 ? formatCurrency(totalMarketing / currentMonthProjectsCount) : formatCurrency(totalMarketing), 
          unit: "MAD", 
          trend: currentMonthProjectsCount > 0 ? "Par projet signé" : "Mois en cours", 
          trendStable: true, 
          icon: "Target", 
          size: "small" 
        },
        { id: "attente", label: "Projets en Attente", value: projetsEnAttente.toString(), trend: "Actifs", trendUp: true, icon: "Clock", size: "small" },
        { id: "pipeline", label: "Valeur Pipeline", value: formatCurrency(valeurPipeline), unit: "MAD", trend: "+12%", trendUp: true, icon: "BarChart3", size: "small" }
      ],
      funnelData,
      mainObjective: {
        value: objectifPercentage > 100 ? 100 : objectifPercentage,
        trend: objectifTrend
      },
      recentLeads: recentLeads || []
    };
  }

  static async updateMonthlyObjective(objectif: number) {
    const mois = this.getFirstDayOfMonth();

    const { data, error } = await supabase
      .from('objectifs_financiers')
      .upsert({ mois, objectif_ca: objectif }, { onConflict: 'mois' })
      .select();

    if (error) throw error;
    return data[0];
  }

  static async addMarketingExpense(source: string, montant: number) {
    const mois = this.getFirstDayOfMonth();

    const { data, error } = await supabase
      .from('depenses_marketing')
      .insert([{ mois, source, montant_depense: montant }])
      .select();

    if (error) throw error;
    return data[0];
  }
}

function formatCurrency(val: number) {
  if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
  if (val >= 1000) return (val / 1000).toFixed(1) + 'k';
  return Math.round(val).toString();
}
