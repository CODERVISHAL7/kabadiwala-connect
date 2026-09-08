import { supabase } from '../lib/supabase';

export type MaterialPrice = {
  id: string;
  material_id: string;
  location: string | null;
  location_name: string | null;
  buying_price: number;
  selling_price: number;
  market_min: number;
  market_max: number;
  unit: string;
  is_verified: boolean;
  recorded_at: string;
  source_type: string;
};

export async function getLatestVerifiedPrice(
  materialId: string
): Promise<MaterialPrice | null> {
  const { data, error } = await supabase
    .from('price_records')
    .select(`
      id,
      material_id,
      location,
      location_name,
      buying_price,
      selling_price,
      market_min,
      market_max,
      unit,
      is_verified,
      recorded_at,
      source_type
    `)
    .eq('material_id', materialId)
    .eq('is_verified', true)
    .order('recorded_at', {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}