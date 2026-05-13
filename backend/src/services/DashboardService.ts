import { supabase } from '../config/supabase';

export class DashboardService {
  static async getAdminStats() {
    // 1. Basic Counts
    const { count: totalProjects } = await supabase.from('projets').select('*', { count: 'exact', head: true });
    const { count: totalDemandes } = await supabase.from('demandes').select('*', { count: 'exact', head: true });
    const { count: totalClients } = await supabase.from('clients').select('*', { count: 'exact', head: true });

    // 2. Revenue Calculation
    const { data: projects } = await supabase.from('projets').select('ca_total');
    const totalRevenue = (projects || []).reduce((acc, p) => acc + (p.ca_total || 0), 0);

    // 3. Recent Demands (Activity)
    const { data: recentDemandes } = await supabase
      .from('demandes')
      .select('*, clients!client_id(nom_complet)') // Assuming foreign key client_id
      .order('date_demande', { ascending: false })
      .limit(5);

    // 4. Project Distribution (by status)
    const { data: distribution } = await supabase.from('projets').select('statut, ca_total, type_projet');
    
    const statusCounts = (distribution || []).reduce((acc: any, p) => {
      acc[p.statut] = (acc[p.statut] || 0) + 1;
      return acc;
    }, {});

    // 5. Revenue by Segment
    const revenueBySegment = (distribution || []).reduce((acc: any, p) => {
      const segment = p.type_projet === 'commercial' ? 'commercial' : 'residentiel';
      acc[segment] = (acc[segment] || 0) + (p.ca_total || 0);
      return acc;
    }, { residentiel: 0, commercial: 0 });

    return {
      stats: {
        totalProjects: totalProjects || 0,
        totalDemandes: totalDemandes || 0,
        totalClients: totalClients || 0,
        totalRevenue
      },
      recentActivity: recentDemandes || [],
      distribution: statusCounts,
      revenueBySegment
    };
  }
}
