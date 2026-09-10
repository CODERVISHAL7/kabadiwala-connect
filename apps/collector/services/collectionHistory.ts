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

return (data ?? []).map((item: any) => ({
  ...item,
  material: Array.isArray(item.material)
    ? item.material[0]
    : item.material,
})) as CollectionHistoryItem[];
}

export async function getCollectionById(
  collectionId: string
) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error('You must be logged in.');
  }

  // Find current collector
  const {
    data: collector,
    error: collectorError,
  } = await supabase
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

  // Fetch only this collector's lot
  const {
    data,
    error,
  } = await supabase
    .from('material_lots')
    .select(`
      id,
      lot_code,
      collector_id,
      material_id,
      description,
      approx_weight,
      weight_unit,
      condition,
      source_type,
      collection_location,
      collection_address,
      estimated_value,
      currency,
      status,
      created_at,
      updated_at,
      material:materials (
        name,
        category,
        subcategory
      )
    `)
    .eq('id', collectionId)
    .eq('collector_id', collector.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error(
      'Collection not found or access denied.'
    );
  }

  return data;
}
