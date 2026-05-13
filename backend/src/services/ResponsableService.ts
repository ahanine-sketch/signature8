import { supabase } from '../config/supabase';

export class ResponsableService {
  static async getAll() {
    const { data: responsables, error: err1 } = await supabase
      .from('responsables')
      .select('*');
    
    if (err1) throw err1;

    // Get project counts for each responsable
    const { data: projets, error: err2 } = await supabase
      .from('projets')
      .select('responsable_id');
    
    if (err2) throw err2;

    return responsables.map((r: any) => ({
      ...r,
      projets_actifs: (projets || []).filter((p: any) => p.responsable_id === r.id).length
    }));
  }

  static async create(responsableData: any) {
    const { data, error } = await supabase
      .from('responsables')
      .insert([responsableData])
      .select();
    
    if (error) throw error;
    return data[0];
  }

  static async update(id: string, data: any) {
    const { data: updated, error } = await supabase
      .from('responsables')
      .update(data)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return updated[0];
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('responsables')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  static async getByEmail(email: string) {
    const { data, error } = await supabase
      .from('responsables')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) return null;
    return data;
  }
}
