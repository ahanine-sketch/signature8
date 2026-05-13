import { supabase } from '../config/supabase';

export class ProjectService {
  static async getAll() {
    console.log("🛠️ [BACKEND] ProjectService.getAll called");
    console.log("🛠️ [BACKEND] Supabase client defined:", !!supabase);
    
    const { data, error } = await supabase
      .from('projets')
      .select('*, clients(nom_complet, email), responsables(nom), retouches(count)')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("❌ [BACKEND] Projects Fetch Error details:", JSON.stringify(error, null, 2));
      throw error;
    }

    console.log("🔍 [BACKEND] Projects Fetch Result:", data?.length, "rows fetched");
    if (data && data.length > 0) {
      console.log("🔍 [BACKEND] First row sample:", JSON.stringify(data[0]).substring(0, 100) + "...");
    }
    
    return data;
  }

  static async create(projectData: any) {
    const { data, error } = await supabase
      .from('projets')
      .insert([projectData])
      .select();
    
    if (error) throw error;
    return data[0];
  }

  static async update(id: string, projectData: any) {
    const { data, error } = await supabase
      .from('projets')
      .update(projectData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('projets')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  static async getStats() {
    const { data: demandes, error: err1 } = await supabase.from('demandes').select('id, statut, date_demande, type_projet');
    const { count: clientsCount, error: err2 } = await supabase.from('clients').select('*', { count: 'exact', head: true });
    const { data: projets, error: err3 } = await supabase.from('projets').select('ca_total');

    if (err1 || err2 || err3) throw err1 || err2 || err3;

    const totalRevenue = (projets || []).reduce((sum, p) => sum + (p.ca_total || 0), 0);
    const recentDemandes = (demandes || [])
      .sort((a, b) => new Date(b.date_demande).getTime() - new Date(a.date_demande).getTime())
      .slice(0, 5);

    return {
      totalDemandes: demandes?.length || 0,
      totalClients: clientsCount || 0,
      totalProjects: projets?.length || 0,
      totalRevenue,
      recentDemandes
    };
  }
}
