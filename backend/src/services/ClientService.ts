import { supabase } from '../config/supabase';

export class ClientService {
  static async getAll() {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async create(clientData: any) {
    const { data, error } = await supabase
      .from('clients')
      .insert([clientData])
      .select();
    
    if (error) throw error;
    return data[0];
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  static async update(id: string, clientData: any) {
    const { data, error } = await supabase
      .from('clients')
      .update(clientData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  }
}
