import { supabase } from '../lib/supabase';


// ============================================
// RECYCLER REGISTRATION
// ============================================

export async function registerRecycler(
  email: string,
  password: string,
  preferredLanguage: string,
  operatingLocation: string
) {
  const {
    data: authData,
    error: authError,
  } = await supabase.auth.signUp({
    email: email.trim(),
    password,
  });

  if (authError) {
    console.error(
      'RECYCLER AUTH SIGNUP ERROR:',
      authError
    );

    throw new Error(
      authError.message
    );
  }

  if (!authData.user) {
    throw new Error(
      'Recycler account could not be created.'
    );
  }

  const userId = authData.user.id;

  const {
    error: profileError,
  } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      role: 'recycler_user',
      preferred_language:
        preferredLanguage || 'hi',
      is_active: true,
    });

  if (profileError) {
    console.error(
      'RECYCLER PROFILE INSERT ERROR:',
      profileError
    );

    throw new Error(
      `Profile creation failed: ${profileError.message}`
    );
  }

  return authData.user;
}


// ============================================
// GET AVAILABLE MATERIAL LOTS
// ============================================

export async function getAvailableMaterialLots() {
  const {
    data,
    error,
  } = await supabase
    .from('material_lots')
    .select(`
      id,
      collector_id,
      approx_weight,
      weight_unit,
      estimated_value,
      status
    `)
    .eq('status', 'available')
    .order('created_at', {
      ascending: false,
    });

  if (error) {
    console.error(
      'GET AVAILABLE MATERIAL LOTS ERROR:',
      error
    );

    throw new Error(
      `Failed to load available material: ${error.message}`
    );
  }

  return data ?? [];
}