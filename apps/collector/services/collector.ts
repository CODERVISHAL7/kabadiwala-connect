import { supabase } from '../lib/supabase';

export async function getCurrentCollector() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error('No authenticated user found.');
  }

  const {
    data,
    error,
  } = await supabase
    .from('collectors')
    .select(`
      id,
      profile_id,
      collector_code,
      general_location,
      general_location_text,
      created_at,
      updated_at
    `)
    .eq('profile_id', user.id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateCollectorProfile(
  generalLocation: string
) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error('No authenticated user found.');
  }

  const location = generalLocation.trim();

  if (!location) {
    throw new Error(
      'General location cannot be empty.'
    );
  }

  const {
    data,
    error,
  } = await supabase
    .from('collectors')
    .update({
      general_location_text: location,
    })
    .eq('profile_id', user.id)
    .select(`
      id,
      profile_id,
      collector_code,
      general_location,
      general_location_text,
      created_at,
      updated_at
    `)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getCollectorStats() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error('No authenticated user found.');
  }

  // Get collector record
  const {
    data: collector,
    error: collectorError,
  } = await supabase
    .from('collectors')
    .select('id')
    .eq('profile_id', user.id)
    .single();

  if (collectorError) {
    throw collectorError;
  }

  // Get this collector's material lots
  const {
    data: lots,
    error: lotsError,
  } = await supabase
    .from('material_lots')
    .select('approx_weight, weight_unit, estimated_value, status')
    .eq('collector_id', collector.id);

  if (lotsError) {
    throw lotsError;
  }

  const collections = lots?.length ?? 0;

  const totalWeight =
    lots?.reduce((total, lot) => {
      if (lot.weight_unit === 'kg') {
        return total + Number(lot.approx_weight);
      }

      return total;
    }, 0) ?? 0;

  const totalEstimatedValue =
    lots?.reduce((total, lot) => {
      return total + Number(lot.estimated_value);
    }, 0) ?? 0;

  return {
    collections,
    totalWeight,
    totalEstimatedValue,
  };
}

export async function updateCollectorGPSLocation(
  latitude: number,
  longitude: number
) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error('No authenticated user found.');
  }

  const point = `POINT(${longitude} ${latitude})`;

  const {
    data,
    error,
  } = await supabase
    .from('collectors')
    .update({
      general_location: point,
    })
    .eq('profile_id', user.id)
    .select(`
      id,
      profile_id,
      collector_code,
      general_location,
      general_location_text,
      created_at,
      updated_at
    `)
    .single();

  if (error) {
    throw error;
  }

  return data;
}