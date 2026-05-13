import { supabase } from '../config/supabase';

export class DemandeService {
  static async getAll() {
    const { data, error } = await supabase
      .from('demandes')
      .select('*')
      .order('date_demande', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async create(demandeData: any) {
    const { data, error } = await supabase
      .from('demandes')
      .insert([demandeData])
      .select();
    
    if (error) throw error;
    return data[0];
  }

  static async updateStatus(id: string, statut: string) {
    const { data, error } = await supabase
      .from('demandes')
      .update({ statut })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    if (!data || data.length === 0) return null;
    return data[0];
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('demandes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  static async update(id: string, demandeData: any) {
    const { data, error } = await supabase
      .from('demandes')
      .update(demandeData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    if (!data || data.length === 0) return null;
    return data[0];
  }
}
