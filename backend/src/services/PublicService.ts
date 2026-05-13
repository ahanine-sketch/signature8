import { supabase } from '../config/supabase';

export class PublicService {
  static async getServices() {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('ordre', { ascending: true });

    if (error) throw error;
    return data;
  }

  static async getTestimonials() {
    const { data, error } = await supabase
      .from('testimonials')
      .select('id, nom_complet, projet, texte, note, actif, cree_le')
      .eq('actif', true)
      .order('cree_le', { ascending: false });

    if (error) throw error;
    
    // Map to frontend field names
    return (data || []).map(t => ({
      id: t.id,
      auteur: t.nom_complet,
      projet: t.projet,
      message: t.texte,
      note: t.note,
      annee: new Date(t.cree_le).getFullYear()
    }));
  }

  static async getPortfolio() {
    const { data, error } = await supabase
      .from('projets')
      .select('id, nom_projet, type_projet, ville, ca_total')
      .order('created_at', { ascending: false })
      .limit(6);

    if (error) throw error;
    
    // Remap to frontend names and add placeholder images
    const placeholders = [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1600585154526-990dcea4db0d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&q=80&w=800"
    ];

    return (data || []).map((p, i) => ({
      ...p,
      titre: p.nom_projet,
      localisation: p.ville,
      budget_total: p.ca_total,
      image_url: placeholders[i % placeholders.length],
      is_avant_apres: false
    }));
  }

  // Map frontend budget strings to numeric values
  private static mapBudget(label: string): number {
    if (!label) return 0;
    // Extract numbers and handle 'k' notation
    const match = label.match(/(\d+)k/);
    if (match) {
      return parseInt(match[1]) * 1000;
    }
    return 0;
  }

  // Map frontend project type labels to database-allowed slugs
  private static mapTypeProjet(label: string): string {
    const map: Record<string, string> = {
      'Résidentiel Privé': 'residentiel',
      'Espace Commercial': 'commercial',
      'Hôtellerie': 'professionnel',
      'Bureaux': 'professionnel',
    };
    return map[label] || 'autre';
  }

  static async createContact(contactData: any) {
    const { data, error } = await supabase
      .from('demandes')
      .insert({
        nom_complet: contactData.nom_complet,
        email: contactData.email,
        telephone: contactData.telephone,
        type_projet: PublicService.mapTypeProjet(contactData.type_projet),
        budget_estime: PublicService.mapBudget(contactData.budget_estime),
        description: contactData.message,
        source: 'formulaire_site',
        statut: 'nouveau'
      })
      .select();

    if (error) throw error;
    return data[0];
  }

  static async getStats() {
    const { count: totalProjects } = await supabase
      .from('projets').select('*', { count: 'exact', head: true });
    const { count: totalClients } = await supabase
      .from('clients').select('*', { count: 'exact', head: true });
    const { data: revenueData } = await supabase
      .from('projets').select('ca_total');

    const totalRevenue = (revenueData || []).reduce((acc, p) => acc + (p.ca_total || 0), 0);

    return {
      totalProjects: totalProjects || 0,
      totalClients: totalClients || 0,
      totalRevenue,
      yearsOfExcellence: new Date().getFullYear() - 2016
    };
  }
}
