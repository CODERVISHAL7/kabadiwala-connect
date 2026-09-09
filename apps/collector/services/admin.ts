import { supabase } from '../lib/supabase';

export async function getAdminStats() {
  // Get all active profiles
  const {
    data: profiles,
    error: profilesError,
  } = await supabase
    .from('profiles')
    .select('role')
    .eq('is_active', true);

  if (profilesError) {
    throw profilesError;
  }

  const collectors =
    profiles?.filter(
      (profile) => profile.role === 'collector'
    ).length ?? 0;

  const recyclers =
    profiles?.filter(
      (profile) => profile.role === 'recycler_user'
    ).length ?? 0;

  // Get all material lots
  const {
    data: lots,
    error: lotsError,
  } = await supabase
    .from('material_lots')
    .select(
      'approx_weight, weight_unit, estimated_value'
    );

  if (lotsError) {
    throw lotsError;
  }

  const collections = lots?.length ?? 0;

  const totalWeight =
    lots?.reduce((total, lot) => {
      if (lot.weight_unit === 'kg') {
        return total + Number(lot.approx_weight || 0);
      }

      return total;
    }, 0) ?? 0;

  const totalEstimatedValue =
    lots?.reduce((total, lot) => {
      return total + Number(lot.estimated_value || 0);
    }, 0) ?? 0;

  return {
    collectors,
    recyclers,
    collections,
    totalWeight,
    totalEstimatedValue,
  };
}

export async function getAdminCollectors() {
  // Get all collectors
  const {
    data: collectors,
    error: collectorsError,
  } = await supabase
    .from('collectors')
    .select(`
      id,
      profile_id,
      collector_code,
      general_location_text,
      created_at,
      updated_at
    `)
    .order('created_at', {
      ascending: false,
    });

  if (collectorsError) {
    throw collectorsError;
  }

  if (!collectors || collectors.length === 0) {
    return [];
  }

  // Get profiles for these collectors
  const profileIds = collectors.map(
    (collector) => collector.profile_id
  );

  const {
    data: profiles,
    error: profilesError,
  } = await supabase
    .from('profiles')
    .select(`
      id,
      is_active
    `)
    .in('id', profileIds);

  if (profilesError) {
    throw profilesError;
  }

  // Get material lots belonging to these collectors
  const collectorIds = collectors.map(
    (collector) => collector.id
  );

  const {
    data: lots,
    error: lotsError,
  } = await supabase
    .from('material_lots')
    .select(`
      collector_id,
      approx_weight,
      weight_unit,
      estimated_value
    `)
    .in('collector_id', collectorIds);

  if (lotsError) {
    throw lotsError;
  }

  return collectors.map((collector) => {
    const profile = profiles?.find(
      (item) => item.id === collector.profile_id
    );

    const collectorLots =
      lots?.filter(
        (lot) =>
          lot.collector_id === collector.id
      ) ?? [];

    const collections = collectorLots.length;

    const totalWeight =
      collectorLots.reduce(
        (total, lot) => {
          if (lot.weight_unit === 'kg') {
            return (
              total +
              Number(lot.approx_weight || 0)
            );
          }

          return total;
        },
        0
      );

    const totalEstimatedValue =
      collectorLots.reduce(
        (total, lot) =>
          total +
          Number(lot.estimated_value || 0),
        0
      );

    return {
      ...collector,
      is_active: profile?.is_active ?? false,
      collections,
      totalWeight,
      totalEstimatedValue,
    };
  });
}

export async function setUserActive(
  userId: string,
  isActive: boolean
) {
  const { data, error } = await supabase.rpc(
    'set_user_active',
    {
      target_user_id: userId,
      new_active: isActive,
    }
  );

  if (error) {
    throw error;
  }

  return data;
}

export async function getAdminCollectorDetail(
  collectorId: string
) {
  // Get collector
  const {
    data: collector,
    error: collectorError,
  } = await supabase
    .from('collectors')
    .select(`
      id,
      profile_id,
      collector_code,
      general_location_text,
      created_at,
      updated_at
    `)
    .eq('id', collectorId)
    .single();

  if (collectorError) {
    throw collectorError;
  }

  // Get profile status
  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from('profiles')
    .select('id, is_active')
    .eq('id', collector.profile_id)
    .single();

  if (profileError) {
    throw profileError;
  }

  // Get this collector's collections
  const {
    data: lots,
    error: lotsError,
  } = await supabase
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

  if (lotsError) {
    throw lotsError;
  }

  return {
    ...collector,
    is_active: profile?.is_active ?? false,
    collections: lots?.length ?? 0,
    lots: lots ?? [],
  };
}

export async function getAdminCollectionDetail(
  lotId: string
) {
  const {
    data: lot,
    error,
  } = await supabase
    .from('material_lots')
    .select(`
      id,
      lot_code,
      collector_id,
      approx_weight,
      weight_unit,
      estimated_value,
      currency,
      status,
      collection_address,
      created_at,
      updated_at,
      material:materials (
        name,
        category,
        subcategory
      )
    `)
    .eq('id', lotId)
    .single();

  if (error) {
    throw error;
  }

  return lot;
}