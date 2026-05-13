import { supabase } from '../config/supabase';

export class RetoucheService {
  static async create(data: any) {
    const { data: retouche, error } = await supabase
      .from('retouches')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return retouche;
  }

  static async getByProject(projectId: string) {
    const { data: retouches, error } = await supabase
      .from('retouches')
      .select('*')
      .eq('projet_id', projectId);

    if (error) throw error;
    return retouches;
  }
}
