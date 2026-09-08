import { supabase } from '../lib/supabase';

export type CollectionHistoryItem = {
  id: string;
  lot_code: string;
  approx_weight: number;
  weight_unit: string;
  estimated_value: number;
  currency: string;
  status: string;
  collection_address: string | null;
  created_at: string;
  material: {
    name: string;
    category: string;
    subcategory: string | null;
  } | null;
};

export async function getMyCollections(): Promise<
  CollectionHistoryItem[]
> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw authError;
  }

  if (!user) {
    throw new Error('You must be logged in.');
  }

  const { data: collector, error: collectorError } =
    await supabase
      .from('collectors')
      .select('id')
      .eq('profile_id', user.id)
      .maybeSingle();

  if (collectorError) {
    throw collectorError;
  }

  if (!collector) {
    throw new Error('Collector profile not found.');
  }

  const { data, error } = await supabase
    .from('material_lots')
    .select(`
      id,
      lot_code,
      approx_weight,
      weight_unit,
      estimated_value,
      currency,
      status,
      collection_address,
      created_at,
      material:materials (
        name,
        category,
        subcategory
      )
    `)
    .eq('collector_id', collector.id)
    .order('created_at', {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return (data ?? []) as CollectionHistoryItem[];
}