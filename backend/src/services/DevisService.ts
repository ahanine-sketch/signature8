import { supabase } from '../lib/supabase';

export interface Devis {
  id?: string;
  projet_id: string;
  numero_devis: string;
  montant_ht: number;
  montant_ttc: number;
  statut: 'brouillon' | 'envoye' | 'accepte' | 'refuse' | 'expire';
  date_emission?: string;
  date_validite?: string;
  notes?: string;
  created_at?: string;
}

class DevisService {
  async getAll() {
    const { data, error } = await supabase
      .from('devis')
      .select(`
        *,
        projets (
          id,
          nom_projet,
          clients (id, nom_complet)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getById(id: string) {
    const { data, error } = await supabase
      .from('devis')
      .select(`
        *,
        projets (
          id,
          nom_projet,
          clients (id, nom_complet)
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async create(devis: Devis) {
    const { data, error } = await supabase
      .from('devis')
      .insert([devis])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, devis: Partial<Devis>) {
    const { data, error } = await supabase
      .from('devis')
      .update(devis)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string) {
    const { error } = await supabase
      .from('devis')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  async getStats() {
    const { data, error } = await supabase
      .from('devis')
      .select('statut, montant_ttc');

    if (error) throw error;

    const stats = {
      totalActifs: data.filter(d => d.statut !== 'brouillon' && d.statut !== 'expire').length,
      enAttente: data.filter(d => d.statut === 'envoye').length,
      conversionRate: 0,
      totalMontantAttente: data
        .filter(d => d.statut === 'envoye')
        .reduce((sum, d) => sum + Number(d.montant_ttc), 0)
    };

    const acceptes = data.filter(d => d.statut === 'accepte').length;
    const totalFinis = data.filter(d => d.statut === 'accepte' || d.statut === 'refuse').length;
    
    if (totalFinis > 0) {
      stats.conversionRate = Math.round((acceptes / totalFinis) * 100);
    }

    return stats;
  }
}

export default new DevisService();
