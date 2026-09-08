import { supabase } from '../lib/supabase';

export type Material = {
  id: string;
  category: string;
  subcategory: string;
  name: string;
  description: string | null;
  default_unit: string;
  is_hazardous: boolean;
  is_active: boolean;
  created_at: string;
};

export async function getActiveMaterials(): Promise<Material[]> {
  const { data, error } = await supabase
    .from('materials')
    .select(`
      id,
      category,
      subcategory,
      name,
      description,
      default_unit,
      is_hazardous,
      is_active,
      created_at
    `)
    .eq('is_active', true)
    .order('name');

  if (error) {
    throw error;
  }

  return data ?? [];
}