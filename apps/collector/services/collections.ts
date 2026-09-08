import { supabase } from '../lib/supabase';

type CreateMaterialLotParams = {
  materialId: string;
  weight: number;
  weightUnit: string;
  location: string;
  estimatedValue: number;
};

export async function createMaterialLot({
  materialId,
  weight,
  weightUnit,
  location,
  estimatedValue,
}: CreateMaterialLotParams) {
  // 1. Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw authError;
  }

  if (!user) {
    throw new Error(
      'You must be logged in to create a collection.'
    );
  }

  // 2. Find the collector belonging to this user
  const { data: collector, error: collectorError } =
    await supabase
      .from('collectors')
      .select('id, collector_code')
      .eq('profile_id', user.id)
      .maybeSingle();

  if (collectorError) {
    throw collectorError;
  }

  if (!collector) {
    throw new Error(
      'Collector profile not found.'
    );
  }

  // 3. Generate a unique lot code
  const lotCode = `LOT-${Date.now()}-${Math.floor(
    Math.random() * 1000
  )
    .toString()
    .padStart(3, '0')}`;

  // 4. Create material lot
  const { data, error } = await supabase
    .from('material_lots')
    .insert({
      lot_code: lotCode,
      collector_id: collector.id,
      material_id: materialId,
      approx_weight: weight,
      weight_unit: weightUnit,
      collection_address: location,
      estimated_value: estimatedValue,
      currency: 'INR',
      status: 'draft',
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}